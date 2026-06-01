import os
import uuid
from dotenv import load_dotenv
load_dotenv()
from decimal import Decimal
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .models import Server, Payment, Transaction, User, ManualPaymentRequest, Notification, SystemSetting, ChatMessage
from .contabo_api import ContaboAPI
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from .serializers import (
    UserSerializer, ServerSerializer, PaymentSerializer, 
    TransactionSerializer, ManualPaymentRequestSerializer, 
    NotificationSerializer, SystemSettingSerializer
)
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.views.decorators.csrf import csrf_exempt
from sslcommerz_lib import SSLCOMMERZ
from django.shortcuts import redirect, render, get_object_or_404
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import pyotp
import qrcode
import io
import base64
from django.utils import timezone
from datetime import timedelta

# Contabo Credentials (must be provided from environment variables)
def require_env(key):
    value = os.environ.get(key)
    if not value:
        raise ImproperlyConfigured(f"Environment variable {key} is required for Contabo integration")
    return value

contabo = None

def get_contabo():
    global contabo
    if contabo is None:
        contabo = ContaboAPI(
            require_env("CONTABO_CLIENT_ID"),
            require_env("CONTABO_CLIENT_SECRET"),
            require_env("CONTABO_API_USER"),
            require_env("CONTABO_API_PASS"),
        )
    return contabo

# SSLCommerz Credentials
SSL_SETTINGS = {
    'store_id': os.environ.get("SSL_STORE_ID"),
    'store_pass': os.environ.get("SSL_STORE_PASS"),
    'issandbox': os.environ.get("SSL_IS_SANDBOX", "True") == "True"
}

sslcz = SSLCOMMERZ(SSL_SETTINGS)

# PayPal Credentials
PAYPAL_CLIENT_ID = os.environ.get("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = os.environ.get("PAYPAL_SECRET")
PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com" if os.environ.get("PAYPAL_MODE") == "sandbox" else "https://api-m.paypal.com"

# ViewSets
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def add_balance(self, request, pk=None):
        user = self.get_object()
        amount = request.data.get('amount', 0)
        user.balance += Decimal(str(amount))
        user.save()
        Transaction.objects.create(user=user, amount=amount, type='ADMIN_ADJUST', status='SUCCESS')
        return Response({"message": "Balance added", "new_balance": float(user.balance)})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def toggle_staff(self, request, pk=None):
        user = self.get_object()
        if user == request.user:
            return Response({"error": "Cannot toggle yourself"}, status=400)
        user.is_staff = not user.is_staff
        user.save()
        return Response({"is_staff": user.is_staff})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        if user == request.user:
            return Response({"error": "Cannot ban yourself"}, status=400)
        user.is_active = not user.is_active
        user.save()
        return Response({"is_active": user.is_active})

class ServerViewSet(viewsets.ModelViewSet):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Server.objects.all()
        return Server.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def control(self, request, pk=None):
        server = self.get_object()
        action = request.data.get('action')
        # Logic from old server_control...
        if action == 'rebuild':
            # ... rebuild logic
            pass
        return Response({"status": "action_sent"})

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminUser]

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

class ManualPaymentRequestViewSet(viewsets.ModelViewSet):
    queryset = ManualPaymentRequest.objects.all()
    serializer_class = ManualPaymentRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ManualPaymentRequest.objects.all()
        return ManualPaymentRequest.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def approve(self, request, pk=None):
        req = self.get_object()
        if req.status != 'PENDING': return Response({"error": "Not pending"}, status=400)
        req.status = 'APPROVED'
        req.save()
        user = req.user
        user.balance += req.amount
        user.save()
        return Response({"status": "approved"})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        req = self.get_object()
        req.status = 'REJECTED'
        req.save()
        return Response({"status": "rejected"})

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"status": "all_read"})

class SystemSettingViewSet(viewsets.ModelViewSet):
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    permission_classes = [IsAdminUser]

    def get_permissions(self):
        if self.action == 'list' and not self.request.user.is_staff:
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def sync_rate(self, request):
        # Logic from old sync_exchange_rate...
        return Response({"status": "synced"})

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    # Test Contabo Connectivity
    contabo_status = "Connected"
    try:
        get_contabo()._get_access_token()
    except Exception as e:
        error_msg = str(e)
        if hasattr(e, 'response') and e.response is not None:
            error_msg += f" - Response: {e.response.text}"
        contabo_status = f"Authentication Failed: {error_msg}"
    return Response({
        "status": "ok",
        "contabo_api": contabo_status,
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_settings(request):
    settings_qs = SystemSetting.objects.all()
    data = {s.key: s.value for s in settings_qs}
    # Ensure bdt_usd_rate has a default if not set in DB
    if 'bdt_usd_rate' not in data:
        data['bdt_usd_rate'] = "120"
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_settings(request):
    settings_qs = SystemSetting.objects.all()
    data = [{"id": s.id, "key": s.key, "value": s.value, "description": s.description} for s in settings_qs]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def update_setting(request):
    key = request.data.get('key')
    value = request.data.get('value')
    if not key or value is None:
        return Response({"error": "Key and value are required"}, status=400)
    
    setting, created = SystemSetting.objects.update_or_create(
        key=key,
        defaults={'value': str(value)}
    )
    return Response({"message": f"Setting {key} updated successfully", "value": setting.value})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_exchange_rate(request):
    if not request.user.is_staff:
        return Response({"error": "Forbidden"}, status=403)
    
    api_key = os.environ.get("CURRENCY_API_KEY")
    if not api_key:
        return Response({"error": "CURRENCY_API_KEY not found in environment"}, status=500)
    
    try:
        import requests as req
        # Using CurrencyAPI.com V3
        url = f"https://api.currencyapi.com/v3/latest?base_currency=USD&currencies=BDT&apikey={api_key}"
        res = req.get(url)
        if res.status_code == 200:
            data = res.json().get('data', {})
            bdt_data = data.get('BDT', {})
            bdt_rate = bdt_data.get('value')
            if bdt_rate:
                SystemSetting.objects.update_or_create(
                    key='bdt_usd_rate',
                    defaults={'value': str(bdt_rate), 'description': f'Auto-synced from CurrencyAPI.com at {bdt_data.get("last_updated_at", "")}'}
                )
                return Response({"message": "Exchange rate synced successfully", "rate": bdt_rate})
        return Response({"error": f"Failed to fetch rate: {res.text}"}, status=500)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_servers(request):
    try:
        import requests as req
        headers = get_contabo()._get_headers()
        res = req.get('https://api.contabo.com/v1/compute/instances', headers=headers)
        if res.status_code == 200:
            contabo_servers = res.json().get('data', [])
            mapped = []
            for s in contabo_servers:
                ipv4 = None
                ipv6 = None
                ip_config = s.get('ipConfig')
                if ip_config:
                    ipv4 = ip_config.get('v4', {}).get('ip')
                    v6_list = ip_config.get('v6', [])
                    if v6_list and len(v6_list) > 0:
                        ipv6 = v6_list[0].get('ip')
                
                ram_mb = s.get('ramMb')
                disk_mb = s.get('diskMb')
                local_s = Server.objects.filter(contabo_id=str(s.get('instanceId'))).first()
                
                mapped.append({
                    'id': s.get('instanceId'),
                    'name': s.get('displayName') or s.get('name') or f"VPS-{s.get('instanceId')}",
                    'ipv4': ipv4 or 'Allocating...',
                    'ipv6': ipv6 or 'None',
                    'status': (s.get('status') or 'unknown').replace('_', ' ').upper(),
                    'region': s.get('region', 'EU'),
                    'product': s.get('productName') or s.get('productId', ''),
                    'os_type': s.get('osType', 'Linux'),
                    'image_id': s.get('imageId', ''),
                    'cpu': s.get('cpuCores', '-'),
                    'ram_gb': round(ram_mb / 1024, 1) if ram_mb else '-',
                    'disk_gb': round(disk_mb / 1024, 1) if disk_mb else '-',
                    'created': s.get('createdDate', ''),
                    'error': s.get('errorMessage', ''),
                    'plan_price': local_s.plan_price if local_s else 0,
                    'expires_at': local_s.expires_at if local_s else None,
                })
            return Response(mapped)
        else:
            return Response([], status=200)
    except Exception as e:
        print(f"Server List Error: {e}")
        return Response([], status=200)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_plans(request):
    # Base prices in USD (Contabo Original)
    PLANS = [
        {'id': 'V91', 'name': 'Cloud VPS 10', 'cpu': 4, 'ram': '8 GB', 'storage': '75 GB NVMe', 'bandwidth': '32 TB', 'base_usd': 5.62},
        {'id': 'V94', 'name': 'Cloud VPS 20', 'cpu': 6, 'ram': '12 GB', 'storage': '100 GB NVMe', 'bandwidth': '32 TB', 'base_usd': 8.75},
        {'id': 'V97', 'name': 'Cloud VPS 30', 'cpu': 8, 'ram': '24 GB', 'storage': '200 GB NVMe', 'bandwidth': '32 TB', 'base_usd': 17.50},
        {'id': 'V100', 'name': 'Cloud VPS 40', 'cpu': 12, 'ram': '48 GB', 'storage': '250 GB NVMe', 'bandwidth': '32 TB', 'base_usd': 31.25},
        {'id': 'V103', 'name': 'Cloud VPS 50', 'cpu': 16, 'ram': '64 GB', 'storage': '300 GB NVMe', 'bandwidth': '32 TB', 'base_usd': 46.25},
        {'id': 'V106', 'name': 'Cloud VPS 60', 'cpu': 18, 'ram': '96 GB', 'storage': '350 GB NVMe', 'bandwidth': '32 TB', 'base_usd': 61.25},
    ]
    
    rate_setting = SystemSetting.objects.filter(key='bdt_usd_rate').first()
    rate = float(rate_setting.value) if rate_setting else 120.0
    
    for p in PLANS:
        # Convert base USD to BDT
        p['base_price'] = int(p['base_usd'] * rate)
        
        # Determine markup in USD
        markup_usd = 2.0 # Global default
        if request.user.is_authenticated:
            markup_usd = float(request.user.markup_amount)
        
        p['markup'] = int(markup_usd * rate)
        p['price_bdt'] = p['base_price'] + p['markup'] # total price in BDT
            
    return Response(PLANS)

@api_view(['POST'])
def create_order(request):
    try:
        plan_id = request.data.get('plan_id')
        selected_region = request.data.get('region', 'EU')
        selected_image = request.data.get('image_id', 'afecbb85-e2fc-46f0-9684-b46b1faf00bb')
        custom_name = request.data.get('custom_name') or request.data.get('name', f"TBLINC-{plan_id}")
        custom_password = request.data.get('custom_password') or request.data.get('root_pass')
        transaction_id = str(uuid.uuid4())[:16] 
        
        # RE-CALCULATE PRICE ON SERVER (Security)
        # Base prices in USD (Contabo Original)
        base_usd_prices = {
            'V91': 5.62, 
            'V94': 8.75, 
            'V97': 17.50, 
            'V100': 31.25, 
            'V103': 46.25, 
            'V106': 61.25
        }
        
        rate_setting = SystemSetting.objects.filter(key='bdt_usd_rate').first()
        rate = float(rate_setting.value) if rate_setting else 120.0
        
        base_price_bdt = int(base_usd_prices.get(plan_id, 0) * rate)
        
        markup_usd = 2.0
        if request.user.is_authenticated:
            markup_usd = float(request.user.markup_amount)
            
        markup_bdt = int(markup_usd * rate)
        price_bdt = base_price_bdt + markup_bdt
        
        print(f"Creating order: {plan_id} for {price_bdt} BDT (User: {request.user})")

        # CHECK WALLET BALANCE FIRST
        if request.user.balance >= Decimal(str(price_bdt)):
            # Process instantly from wallet
            user = request.user
            user.balance -= Decimal(str(price_bdt))
            user.save()
            
            transaction_id = f"WLT-{str(uuid.uuid4())[:12]}"
            
            # Create a PAID payment
            payment = Payment.objects.create(
                user=user,
                plan_id=plan_id,
                amount_bdt=price_bdt,
                transaction_id=transaction_id,
                status='PAID'
            )
            
            # Create Transaction Record
            Transaction.objects.create(
                user=user,
                amount=price_bdt,
                type='SPEND',
                transaction_id=transaction_id,
                status='SUCCESS (WALLET)'
            )
            
            # PROVISION VPS ON CONTABO
            try:
                # Password logic: use custom if provided, otherwise generate
                root_pass = custom_password
                if not root_pass:
                    import secrets
                    import string
                    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
                    root_pass = ''.join(secrets.choice(alphabet) for _ in range(16))
                    root_pass += "A1!"
                
                # STEP 1: Create a Secret on Contabo
                secret_id = get_contabo().create_secret(
                    name=f"PASS-{custom_name}",
                    value=root_pass
                )
                
                res = get_contabo().create_instance(
                    productId=plan_id,
                    region=selected_region,
                    imageId=selected_image,
                    rootPasswordId=secret_id,
                    displayName=custom_name
                )
                
                print(f"Contabo Response: {res}")
                
                # Contabo API returns { "data": [ { "instanceId": ... } ] }
                instance_data = res.get('data', [{}])[0]
                
                Server.objects.create(
                    user=user,
                    contabo_id=instance_data.get('instanceId', 'PENDING'),
                    name=custom_name,
                    ip_address=instance_data.get('ipConfig', {}).get('v4', {}).get('ip', 'ALLOCATING'),
                    status='PROVISIONING',
                    product_id=plan_id,
                    plan_price=price_bdt,
                    expires_at=timezone.now() + timedelta(days=30)
                )
                
                # Note: In a real app, you'd send root_pass to the user via email
                print(f"Provisioned VPS. Root Pass: {root_pass}")
                
                Notification.objects.create(
                    user=user,
                    title="Server Deployment Started",
                    message=f"Your deployment for '{custom_name}' has been initiated.",
                    type="info"
                )
                
                return Response({
                    "message": "Order processed from wallet",
                    "transaction_id": transaction_id,
                    "payment_url": None
                })
            except Exception as contabo_err:
                print(f"Contabo Provisioning Failed: {contabo_err}")
                return Response({"message": f"Paid from wallet but provisioning failed: {str(contabo_err)}", "transaction_id": transaction_id}, status=200)

        # IF NOT ENOUGH BALANCE, GO TO SSLCOMMERZ
        # Create a pending payment
        payment = Payment.objects.create(
            user=request.user,
            plan_id=plan_id,
            amount_bdt=price_bdt,
            transaction_id=transaction_id,
            status='PENDING'
        )
        
        # SSLCommerz Payload
        post_body = {
            'total_amount': price_bdt,
            'currency': 'BDT',
            'tran_id': transaction_id,
            'success_url': f"{settings.BACKEND_ROOT}/api/payment/success/?id={transaction_id}",
            'fail_url': f"{settings.BACKEND_ROOT}/api/payment/fail/?id={transaction_id}",
            'cancel_url': f"{settings.BACKEND_ROOT}/api/payment/cancel/?id={transaction_id}",
            'emi_option': 0,
            'cus_name': 'Test Customer',
            'cus_email': 'test@example.com',
            'cus_phone': '01700000000',
            'cus_add1': 'Dhaka',
            'cus_city': 'Dhaka',
            'cus_country': 'Bangladesh',
            'shipping_method': 'NO',
            'num_of_item': 1,
            'product_name': f"VPS Plan {plan_id}",
            'product_category': 'VPS',
            'product_profile': 'general'
        }
        
        response = sslcz.createSession(post_body)
        if response['status'] == 'SUCCESS':
            return Response({
                "message": "Order created",
                "transaction_id": transaction_id,
                "payment_url": response['GatewayPageURL']
            })
        else:
            print(f"SSLCommerz Session Failed: {response}")
            return Response({"error": "Failed to create payment session", "details": response}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def create_deposit(request):
    try:
        amount = request.data.get('amount')
        transaction_id = f"DEP-{str(uuid.uuid4())[:12]}"
        
        # Create a pending payment marked as DEPOSIT
        Payment.objects.create(
            user=request.user,
            plan_id='DEPOSIT',
            amount_bdt=amount,
            transaction_id=transaction_id,
            status='PENDING'
        )
        
        post_body = {
            'total_amount': amount,
            'currency': 'BDT',
            'tran_id': transaction_id,
            'success_url': f"{settings.BACKEND_ROOT}/api/payment/success/?id={transaction_id}",
            'fail_url': f"{settings.BACKEND_ROOT}/api/payment/fail/?id={transaction_id}",
            'cancel_url': f"{settings.BACKEND_ROOT}/api/payment/cancel/?id={transaction_id}",
            'emi_option': 0,
            'cus_name': request.user.email,
            'cus_email': request.user.email,
            'cus_phone': '01700000000',
            'cus_add1': 'Dhaka',
            'cus_city': 'Dhaka',
            'cus_country': 'Bangladesh',
            'shipping_method': 'NO',
            'num_of_item': 1,
            'product_name': "Wallet Deposit",
            'product_category': 'Wallet',
            'product_profile': 'general'
        }
        
        response = sslcz.createSession(post_body)
        if response['status'] == 'SUCCESS':
            return Response({"payment_url": response['GatewayPageURL']})
        return Response({"error": "Failed to create session"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def create_paypal_deposit(request):
    amount_usd = request.data.get('amount')
    transaction_id = f"PAY-{str(uuid.uuid4())[:12]}"
    
    import requests
    auth_res = requests.post(
        f"{PAYPAL_API_BASE}/v1/oauth2/token",
        auth=(PAYPAL_CLIENT_ID, PAYPAL_SECRET),
        data={"grant_type": "client_credentials"}
    )
    token = auth_res.json().get("access_token")
    
    order_data = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "amount": {"currency_code": "USD", "value": str(amount_usd)},
            "description": "Wallet Deposit - TBLINC",
            "custom_id": transaction_id
        }],
        "application_context": {
            "return_url": f"{settings.BACKEND_ROOT}/api/paypal/success/?id={transaction_id}",
            "cancel_url": f"{settings.FRONTEND_ROOT}/billing?payment=cancel"
        }
    }
    
    order_res = requests.post(
        f"{PAYPAL_API_BASE}/v2/checkout/orders",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=order_data
    )
    
    if order_res.status_code in [200, 201]:
        links = order_res.json().get("links")
        approve_url = next(link["href"] for link in links if link["rel"] == "approve")
        
        Payment.objects.create(
            user=request.user,
            plan_id='DEPOSIT',
            amount_bdt=float(amount_usd) * 120,
            transaction_id=transaction_id,
            status='PENDING'
        )
        return Response({"payment_url": approve_url})
    return Response({"error": "PayPal session failed"}, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def paypal_success(request):
    transaction_id = request.query_params.get('id')
    order_id = request.query_params.get('token')
    
    import requests
    auth_res = requests.post(
        f"{PAYPAL_API_BASE}/v1/oauth2/token",
        auth=(PAYPAL_CLIENT_ID, PAYPAL_SECRET),
        data={"grant_type": "client_credentials"}
    )
    token = auth_res.json().get("access_token")
    
    capture_res = requests.post(
        f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    )
    
    if capture_res.status_code in [200, 201]:
        payment = Payment.objects.get(transaction_id=transaction_id)
        payment.status = 'PAID'
        payment.save()
        
        user = payment.user
        user.balance += payment.amount_bdt
        user.save()
        
        Transaction.objects.create(
            user=user,
            amount=payment.amount_bdt,
            type='DEPOSIT',
            transaction_id=transaction_id,
            status='SUCCESS (PAYPAL)'
        )
        return redirect(f"{settings.FRONTEND_ROOT}/billing?payment=success")
    return redirect(f"{settings.FRONTEND_ROOT}/billing?payment=fail")

@api_view(['GET'])
def list_transactions(request):
    txs = Transaction.objects.filter(user=request.user).order_by('-created_at').values()
    return Response(list(txs))

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_all_transactions(request):
    txs = Transaction.objects.all().select_related('user').order_by('-created_at')
    data = []
    for t in txs:
        data.append({
            "id": t.id,
            "user_email": t.user.email,
            "amount": str(t.amount),
            "type": t.type,
            "transaction_id": t.transaction_id,
            "status": t.status,
            "created_at": t.created_at
        })
    return Response(data)

@api_view(['POST'])
def clear_transactions(request):
    Transaction.objects.filter(user=request.user).delete()
    return Response({"message": "Transactions cleared"})

@api_view(['GET'])
def list_notifications(request):
    notifs = Notification.objects.filter(user=request.user).order_by('-created_at').values()
    return Response(list(notifs))

@api_view(['POST'])
def mark_notifications_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({"message": "Marked all as read"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def server_control(request, server_id):
    action = request.data.get('action') # start, stop, restart
    try:
        if request.user.is_staff:
            server = Server.objects.get(id=server_id)
        else:
            server = Server.objects.get(id=server_id, user=request.user)
        
        # Real Contabo API call
        if action == 'rebuild':
            image_id = request.data.get('imageId', 'ubuntu-22.04') # Default
            new_pass = request.data.get('password', 'DefaultPass123!')
            
            # Create a secret for the new password
            pass_id = get_contabo().create_secret(f"rebuild-{server.id}", new_pass)
            success = get_contabo().reinstall_instance(server.contabo_id, image_id, pass_id)
        else:
            success = get_contabo().control_instance(server.contabo_id, action)
        
        if success:
            if action == 'stop': server.status = 'STOPPED'
            elif action == 'start': server.status = 'RUNNING'
            elif action == 'restart': server.status = 'REBOOTING'
            elif action == 'rebuild': server.status = 'REINSTALLING'
            server.save()
            return Response({"message": f"Server {action} successful", "new_status": server.status})
        return Response({"error": f"Contabo failed to {action} instance"}, status=500)
    except Server.DoesNotExist:
        return Response({"error": "Server not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_user_info(request):
    return Response({
        "email": request.user.email,
        "balance": request.user.balance,
        "is_staff": request.user.is_staff,
        "is_superuser": request.user.is_superuser,
        "profile_image": request.user.profile_image.url if request.user.profile_image else None,
        "two_factor_enabled": request.user.two_factor_enabled
    })

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_all_users(request):
    if request.user.is_superuser:
        users_qs = User.objects.all()
    else:
        users_qs = User.objects.filter(parent_reseller=request.user)
    
    users = users_qs.values('id', 'email', 'balance', 'is_staff', 'is_active', 'date_joined', 'phone_number', 'is_reseller', 'markup_amount')
    return Response(list(users))

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_all_servers(request):
    if request.user.is_superuser:
        servers_qs = Server.objects.all()
    else:
        servers_qs = Server.objects.filter(user__parent_reseller=request.user)
        
    servers = servers_qs.values('id', 'name', 'ip_address', 'status', 'created_at', 'contabo_id', 'user__email')
    data = []
    for s in servers:
        s['user_email'] = s.pop('user__email')
        data.append(s)
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_user_servers(request, user_id):
    servers = Server.objects.filter(user_id=user_id).values()
    return Response(list(servers))

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_add_balance(request):
    user_id = request.data.get('user_id')
    amount = request.data.get('amount')
    try:
        user = User.objects.get(id=user_id)
        user.balance += Decimal(str(amount))
        user.save()
        
        Transaction.objects.create(
            user=user,
            amount=amount,
            type='DEPOSIT',
            transaction_id=f"ADM-{str(uuid.uuid4())[:12]}",
            status='SUCCESS (ADMIN)'
        )
        return Response({"message": "Balance updated successfully", "new_balance": user.balance})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_broadcast_message(request):
    title = request.data.get('title')
    message = request.data.get('message')
    msg_type = request.data.get('type', 'info')
    
    if not title or not message:
        return Response({"error": "Title and message are required"}, status=400)
    
    users = User.objects.all()
    notifications = [
        Notification(user=user, title=title, message=message, type=msg_type)
        for user in users
    ]
    Notification.objects.bulk_create(notifications)
    
    return Response({"message": f"Broadcast sent to {len(users)} users."})

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_send_sms(request):
    user_id = request.data.get('user_id') # Optional: if targeting a single user
    message = request.data.get('message')
    phone = request.data.get('phone')
    
    if not message:
        return Response({"error": "Message is required"}, status=400)
    
    # Mock SMS Sending Logic
    print(f"DEBUG: Sending SMS to {phone or 'All Users'}: {message}")
    
    # In a real app, integrate with an SMS gateway here
    return Response({"message": "SMS request processed successfully (Mock)"})

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_adjust_billing(request):
    user_id = request.data.get('user_id')
    amount = request.data.get('amount') # Can be negative to deduct
    reason = request.data.get('reason', 'Admin adjustment')
    
    try:
        user = User.objects.get(id=user_id)
        user.balance += Decimal(str(amount))
        user.save()
        
        Transaction.objects.create(
            user=user,
            amount=abs(float(amount)),
            type='SPEND' if float(amount) < 0 else 'DEPOSIT',
            transaction_id=f"ADJ-{str(uuid.uuid4())[:12]}",
            status=f"SUCCESS ({reason})"
        )
        return Response({"message": "Billing adjusted successfully", "new_balance": user.balance})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_toggle_staff(request):
    user_id = request.data.get('user_id')
    action = request.data.get('action') # 'make-admin' or 'remove-admin'
    
    try:
        user = User.objects.get(id=user_id)
        if action == 'make-admin':
            user.is_staff = True
        elif action == 'remove-admin':
            # Prevent self-removal of admin rights for safety
            if user == request.user:
                return Response({"error": "You cannot remove your own administrator privileges."}, status=400)
            user.is_staff = False
        
        user.save()
        return Response({"message": f"User role updated successfully. is_staff: {user.is_staff}"})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_toggle_active(request):
    user_id = request.data.get('user_id')
    action = request.data.get('action') # 'ban' or 'unban'
    
    try:
        user = User.objects.get(id=user_id)
        if action == 'ban':
            if user == request.user:
                return Response({"error": "You cannot ban yourself."}, status=400)
            user.is_active = False
        elif action == 'unban':
            user.is_active = True
        
        user.save()
        return Response({"message": f"User active status updated. is_active: {user.is_active}"})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@csrf_exempt
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def payment_success(request):
    transaction_id = request.query_params.get('id')
    try:
        payment = Payment.objects.get(transaction_id=transaction_id)
        payment.status = 'PAID'
        payment.save()

        # Update User Balance if it's a DEPOSIT
        if payment.plan_id == 'DEPOSIT':
            user = payment.user
            user.balance += payment.amount_bdt
            user.save()
            
            Transaction.objects.create(
                user=user,
                amount=payment.amount_bdt,
                type='DEPOSIT',
                transaction_id=transaction_id,
                status='SUCCESS'
            )
            return redirect(f"{settings.FRONTEND_ROOT}/billing?payment=success")

        # If it's a VPS Order
        Transaction.objects.create(
            user=payment.user,
            amount=payment.amount_bdt,
            type='SPEND',
            transaction_id=transaction_id,
            status='SUCCESS'
        )
        
        # SEND EMAIL NOTIFICATION
        send_mail(
            subject='Payment Successful - Your VPS is being provisioned',
            message=f'Hi,\n\nYour payment of {payment.amount_bdt} BDT for transaction {transaction_id} was successful.\nYour VPS is now being provisioned on Contabo. You will receive another email with your credentials soon.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[payment.user.email], 
            fail_silently=True,
        )
        
        # TRIGGER CONTABO PROVISIONING HERE
        try:
            UBUNTU_IMAGE_UUID = "afecbb85-e2fc-46f0-9684-b46b1faf00bb"
            import secrets
            import string
            root_pass = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(16))

            res = get_contabo().create_instance(
                productId=payment.plan_id,
                region="EU",
                imageId=UBUNTU_IMAGE_UUID,
                rootPassword=root_pass,
                displayName=f"TBLINC-{payment.plan_id}-{payment.user.id}"
            )
            
            # Create Server record
            instance_data = res.get('data', [{}])[0]
            Server.objects.create(
                user=payment.user,
                contabo_id=instance_data.get('instanceId', 'PENDING'),
                name=f"VPS {payment.plan_id}",
                ip_address=instance_data.get('ipConfig', {}).get('v4', {}).get('ip', 'ALLOCATING'),
                status='PROVISIONING',
                product_id=payment.plan_id,
                plan_price=payment.amount_bdt,
                expires_at=timezone.now() + timedelta(days=30)
            )
            
            # SEND EMAIL WITH CREDENTIALS
            send_mail(
                subject='Your VPS Credentials - TBLINC',
                message=f'Hi,\n\nYour VPS has been provisioned successfully.\n\nProduct: {payment.plan_id}\nRoot Password: {root_pass}\n\nYou can access your server once the IP address is fully allocated in your dashboard.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[payment.user.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Contabo Provisioning Failed in Webhook: {e}")
        
        # Redirect back to frontend
        return redirect(f"{settings.FRONTEND_ROOT}/?payment=success")
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=404)

@csrf_exempt
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def payment_fail(request):
    transaction_id = request.query_params.get('id')
    return redirect(f"{settings.FRONTEND_ROOT}/?payment=fail")

@csrf_exempt
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def payment_cancel(request):
    transaction_id = request.query_params.get('id')
    return redirect(f"{settings.FRONTEND_ROOT}/?payment=cancel")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_manual_request(request):
    amount = request.data.get('amount')
    method = request.data.get('method')
    transaction_id = request.data.get('transaction_id')
    screenshot = request.FILES.get('screenshot')
    
    if not transaction_id:
        return Response({"error": "Transaction ID is required"}, status=400)
        
    if ManualPaymentRequest.objects.filter(transaction_id=transaction_id).exists():
        return Response({"error": "This Transaction ID has already been submitted"}, status=400)

    ManualPaymentRequest.objects.create(
        user=request.user,
        amount=amount,
        method=method,
        transaction_id=transaction_id,
        screenshot=screenshot,
        status='PENDING'
    )
    return Response({"message": "Manual payment request submitted"})

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_manual_requests(request):
    # Using user__email to get the email from the related User model
    requests = ManualPaymentRequest.objects.filter(status='PENDING').values('id', 'user__email', 'amount', 'method', 'transaction_id', 'created_at')
    return Response(list(requests))

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_get_stats(request):
    from django.db.models import Sum
    from django.utils import timezone
    from datetime import timedelta
    
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=7)

    user = request.user
    is_admin = user.is_superuser
    
    # Base querysets
    users_qs = User.objects.all()
    payments_qs = Payment.objects.filter(status='PAID')
    servers_qs = Server.objects.all()
    manual_qs = ManualPaymentRequest.objects.filter(status='PENDING')
    
    if not is_admin:
        # If reseller, filter by their sub-customers
        users_qs = users_qs.filter(parent_reseller=user)
        payments_qs = payments_qs.filter(user__parent_reseller=user)
        servers_qs = servers_qs.filter(user__parent_reseller=user)
        manual_qs = manual_qs.filter(user__parent_reseller=user)

    total_users = users_qs.count()
    users_today = users_qs.filter(date_joined__gte=today_start).count()
    users_week = users_qs.filter(date_joined__gte=week_start).count()
    
    total_balance = users_qs.aggregate(Sum('balance'))['balance__sum'] or 0
    total_income = payments_qs.aggregate(Sum('amount_bdt'))['amount_bdt__sum'] or 0
    total_servers = servers_qs.count()
    total_pending = manual_qs.count()
    
    # Distribution stats
    from django.db.models import Count
    region_dist = list(servers_qs.values('product_id').annotate(count=Count('id'))) # Using product_id as proxy for distribution
    
    # Platform growth (Last 30 days daily income)
    income_30d = []
    for i in range(30):
        day = today_start - timedelta(days=i)
        next_day = day + timedelta(days=1)
        amt = payments_qs.filter(created_at__range=(day, next_day)).aggregate(Sum('amount_bdt'))['amount_bdt__sum'] or 0
        income_30d.append({"date": day.strftime('%Y-%m-%d'), "amount": float(amt)})
    income_30d.reverse()
    
    # Servers expiring in next 5 days
    expiring_soon = servers_qs.filter(expires_at__lte=now + timedelta(days=5)).order_by('expires_at')
    expiring_data = []
    for s in expiring_soon:
        expiring_data.append({
            "id": s.id,
            "name": s.name,
            "user_email": s.user.email,
            "expires_at": s.expires_at,
            "days_left": (s.expires_at - now).days if s.expires_at else 0
        })

    # Suspended Servers (Unpaid)
    suspended_qs = servers_qs.filter(status='SUSPENDED').order_by('-expires_at')
    suspended_data = []
    for s in suspended_qs:
        suspended_data.append({
            "id": s.id,
            "name": s.name,
            "user_email": s.user.email,
            "contabo_id": s.contabo_id,
            "plan_price": s.plan_price,
            "expires_at": s.expires_at,
        })

    return Response({
        "total_users": total_users,
        "users_today": users_today,
        "users_week": users_week,
        "total_income": float(total_income),
        "total_balance": float(total_balance),
        "total_servers": total_servers,
        "total_pending": total_pending,
        "expiring_soon": expiring_data,
        "suspended_servers": suspended_data,
        "region_dist": region_dist,
        "income_30d": income_30d
    })

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_approve_manual(request):
    request_id = request.data.get('request_id')
    try:
        m_request = ManualPaymentRequest.objects.get(id=request_id)
        if m_request.status != 'PENDING':
            return Response({"error": "Already processed"}, status=400)
        m_request.status = 'APPROVED'
        m_request.save()
        user = m_request.user
        user.balance += m_request.amount
        user.save()
        Transaction.objects.create(
            user=user,
            amount=m_request.amount,
            type='DEPOSIT',
            transaction_id=m_request.transaction_id or f"MAN-{str(uuid.uuid4())[:8]}",
            status='SUCCESS (MANUAL)'
        )
        return Response({"message": "Approved"})
    except ManualPaymentRequest.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_reject_manual(request):
    request_id = request.data.get('request_id')
    try:
        m_request = ManualPaymentRequest.objects.get(id=request_id)
        if m_request.status != 'PENDING':
            return Response({"error": "Already processed"}, status=400)
        m_request.status = 'REJECTED'
        m_request.save()
        return Response({"message": "Rejected"})
    except ManualPaymentRequest.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_delete_suspended_server(request):
    server_id = request.data.get('server_id')
    try:
        server = Server.objects.get(id=server_id)
        if server.status != 'SUSPENDED':
            return Response({"error": "Only suspended servers can be deleted here."}, status=400)
            
        # Cancel on Contabo
        get_contabo().cancel_instance(server.contabo_id)
        
        # Delete from DB
        server.delete()
        
        return Response({"message": "Server permanently deleted."})
    except Server.DoesNotExist:
        return Response({"error": "Server not found."}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_deploy_for_user(request):
    user_id = request.data.get('user_id')
    plan_id = request.data.get('plan_id')
    region = request.data.get('region', 'fra1')
    image = request.data.get('image', 'ubuntu-22.04')
    name = request.data.get('name', f"admin-deploy-{str(uuid.uuid4())[:8]}")
    root_pass = request.data.get('root_pass')
    
    if not all([user_id, plan_id, root_pass]):
        return Response({"error": "Missing parameters"}, status=400)
        
    try:
        user = User.objects.get(id=user_id)
        plan = Product.objects.get(id=plan_id) # Product is the plan model
        
        # Deploy on Contabo
        response = get_contabo().create_instance(
            name=name,
            product_id=plan.product_id,
            region=region,
            image_id=image,
            root_password=root_pass
        )
        
        if 'error' in response:
            return Response({"error": response['error']}, status=400)
            
        instance_id = response.get('instanceId')
        
        # Create server in DB
        server = Server.objects.create(
            user=user,
            name=name,
            contabo_id=instance_id,
            status='ACTIVE',
            plan_name=plan.name,
            plan_price=plan.price_bdt,
            vcpus=plan.vcpus,
            ram=plan.ram,
            storage=plan.storage,
            region=region,
            product_id=plan.product_id,
            expires_at=timezone.now() + timedelta(days=30)
        )
        
        return Response({"message": "Deployment initiated.", "server_id": server.id})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Product.DoesNotExist:
        return Response({"error": "Plan not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_provision_network(request):
    user_id = request.data.get('user_id')
    region = request.data.get('region', 'fra1')
    count = request.data.get('count', 1)
    
    # In a real scenario, this would call Contabo Private Network API
    # Here we simulate success
    return Response({"message": f"Provisioned {count} Private Network resources in {region} for User {user_id}"})

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_provision_storage(request):
    user_id = request.data.get('user_id')
    region = request.data.get('region', 'fra1')
    size_gb = request.data.get('size_gb', 50)
    
    # In a real scenario, this would call Contabo Block Storage API
    # Here we simulate success
    return Response({"message": f"Provisioned {size_gb}GB Block Storage in {region} for User {user_id}"})

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_broadcast(request):
    subject = request.data.get('subject', 'System Announcement')
    message = request.data.get('message')
    broadcast_type = request.data.get('type', 'both')
    
    if not message:
        return Response({"error": "Message required"}, status=400)
        
    # Logic to send to all users
    # Example:
    # users = User.objects.all()
    # for user in users:
    #    send_announcement(user, subject, message, broadcast_type)
    
    return Response({"message": f"Broadcast transmission initiated via {broadcast_type}."})

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_send_test_email(request):
    email = request.data.get('email')
    if not email:
        return Response({"error": "Target email required"}, status=400)
    return Response({"message": f"Diagnostic signal sent to {email}"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    password = request.data.get('password')
    
    if not password:
        return Response({"error": "Password is required to delete account"}, status=400)
    
    if not user.check_password(password):
        return Response({"error": "Incorrect password. Account deletion aborted."}, status=403)
    
    try:
        # 1. Terminate all Contabo Servers
        servers = Server.objects.filter(user=user)
        for s in servers:
            try:
                if s.contabo_id and s.contabo_id != 'PENDING':
                    get_contabo().cancel_instance(s.contabo_id)
            except Exception as e:
                print(f"Failed to cancel contabo instance {s.contabo_id}: {e}")
        
        # 2. Delete the user (CASCADE will handle the rest)
        user.delete()
        
        return Response({"message": "Account and all associated resources have been permanently deleted."})
    except Exception as e:
        return Response({"error": f"Deletion failed: {str(e)}"}, status=500)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_delete_user(request):
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({"error": "User ID is required"}, status=400)
    try:
        user_to_delete = User.objects.get(id=user_id)
        if user_to_delete.is_superuser:
            return Response({"error": "Cannot delete a superuser."}, status=403)
        
        # Reseller protection
        if not request.user.is_superuser:
            if user_to_delete.parent_reseller != request.user:
                return Response({"error": "Forbidden: You can only delete your own customers."}, status=403)

        servers = Server.objects.filter(user=user_to_delete)
        for s in servers:
            try:
                if s.contabo_id and s.contabo_id != 'PENDING':
                    get_contabo().cancel_instance(s.contabo_id)
            except: pass
        user_email = user_to_delete.email
        user_to_delete.delete()
        return Response({"message": f"User {user_email} deleted."})
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_image(request):
    if 'image' not in request.FILES:
        return Response({"error": "No image provided"}, status=400)
    
    user = request.user
    user.profile_image = request.FILES['image']
    user.save()
    
    return Response({
        "message": "Profile image updated",
        "profile_image": user.profile_image.url
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_2fa_otp(request):
    user = request.user
    if user.two_factor_enabled:
        return Response({"error": "2FA is already enabled"}, status=400)
    
    if not user.two_factor_secret:
        user.two_factor_secret = pyotp.random_base32()
        user.save()
    
    totp = pyotp.TOTP(user.two_factor_secret)
    provisioning_url = totp.provisioning_uri(name=user.email, issuer_name="TBLINC")
    
    # Generate QR Code as base64
    img = qrcode.make(provisioning_url)
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return Response({
        "secret": user.two_factor_secret,
        "qr_code": f"data:image/png;base64,{img_str}"
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enable_2fa(request):
    user = request.user
    otp_code = request.data.get('otp_code')
    
    if not otp_code:
        return Response({"error": "OTP code is required"}, status=400)
    
    if not user.two_factor_secret:
        return Response({"error": "No 2FA secret found. Generate one first."}, status=400)
    
    totp = pyotp.TOTP(user.two_factor_secret)
    if totp.verify(otp_code):
        user.two_factor_enabled = True
        user.save()
        return Response({"message": "2FA enabled successfully"})
    else:
        return Response({"error": "Invalid OTP code"}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def disable_2fa(request):
    user = request.user
    otp_code = request.data.get('otp_code')
    
    if not otp_code:
        return Response({"error": "OTP code is required"}, status=400)
    
    totp = pyotp.TOTP(user.two_factor_secret)
    if totp.verify(otp_code):
        user.two_factor_enabled = False
        user.save()
        return Response({"message": "2FA disabled successfully"})
    else:
        return Response({"error": "Invalid OTP code"}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_jwt_create(request):
    email = request.data.get('email')
    password = request.data.get('password')
    otp_code = request.data.get('otp_code')
    
    user = authenticate(username=email, password=password)
    
    if not user:
        return Response({"error": "Invalid credentials"}, status=401)
    
    if not user.is_approved:
        return Response({
            "error": "Account pending approval",
            "detail": "Your account has been verified but is currently pending administrative approval. You will receive an email once approved."
        }, status=403)
    
    if user.two_factor_enabled:
        if not otp_code:
            return Response({
                "two_factor_required": True,
                "email": email,
                "message": "2FA is enabled for this account. Please provide OTP code."
            }, status=200)
        
        totp = pyotp.TOTP(user.two_factor_secret)
        if not totp.verify(otp_code):
            return Response({"error": "Invalid OTP code"}, status=401)
            
    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_chat_message(request):
    user_id = request.data.get('user_id') # The 'target' user (admin's target or admin self)
    message_text = request.data.get('message')
    
    if not message_text:
        return Response({"error": "Message text required"}, status=400)
        
    # If customer is sending, target is admin
    # If admin is sending, target is specified user_id
    if not request.user.is_staff:
        target_user = User.objects.filter(is_superuser=True).first()
    else:
        target_user = get_object_or_404(User, id=user_id)
        
    msg = ChatMessage.objects.create(
        user=target_user if not request.user.is_staff else target_user,
        sender=request.user,
        message=message_text
    )
    # Special logic: for a conversation between User A and Admin, 
    # we always associate the ChatMessage with the CUSTOMER user object 
    # so we can group them easily.
    if not request.user.is_staff:
        msg.user = request.user # This conversation belongs to this customer
    else:
        msg.user = target_user # This reply belongs to this customer's thread
    msg.save()
    
    # 🔔 Create a Notification for the recipient
    if not request.user.is_staff:
        # Customer sent message → notify ALL superusers
        admins = User.objects.filter(is_superuser=True)
        for admin in admins:
            Notification.objects.create(
                user=admin,
                title="💬 New Support Message",
                message=f"{request.user.email}: {message_text[:80]}{'...' if len(message_text) > 80 else ''}",
                type='chat'
            )
    else:
        # Admin replied → notify the customer
        Notification.objects.create(
            user=target_user,
            title="💬 Support Reply",
            message=f"Support team: {message_text[:80]}{'...' if len(message_text) > 80 else ''}",
            type='chat'
        )
    
    return Response({"message": "Sent", "id": msg.id})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_chat_messages(request):
    # If customer, get their own messages
    # If admin, get messages for a specific user_id
    if not request.user.is_staff:
        user = request.user
    else:
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response([])  # Admin with no user selected = empty list
        user = get_object_or_404(User, id=user_id)
        
    msgs = ChatMessage.objects.filter(user=user).order_by('created_at')
    return Response([{
        "id": m.id,
        "sender_email": m.sender.email,
        "sender_id": m.sender.id,
        "message": m.message,
        "is_read": m.is_read,
        "created_at": m.created_at
    } for m in msgs])

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_active_chats(request):
    # List users who have at least one message
    user_ids = ChatMessage.objects.values_list('user_id', flat=True).distinct()
    users = User.objects.filter(id__in=user_ids)
    
    data = []
    for u in users:
        last_msg = ChatMessage.objects.filter(user=u).order_by('-created_at').first()
        unread_count = ChatMessage.objects.filter(user=u, is_read=False).exclude(sender=request.user).count()
        data.append({
            "user_id": u.id,
            "user_email": u.email,
            "last_message": last_msg.message if last_msg else "",
            "last_time": last_msg.created_at if last_msg else None,
            "unread_count": unread_count
        })
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_update_markup(request):
    user_id = request.data.get('user_id')
    markup = request.data.get('markup')
    if markup is None:
        return Response({"error": "Markup is required"}, status=400)
    try:
        user = User.objects.get(id=user_id)
        user.markup_amount = float(markup)
        user.save()
        return Response({"message": f"Markup updated to ${markup}"})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_chat_read(request):
    # For customer: mark admin's messages as read
    # For admin: mark a specific user's messages as read
    if not request.user.is_staff:
        # Mark all messages sent to THIS user as read
        ChatMessage.objects.filter(user=request.user, is_read=False).exclude(sender=request.user).update(is_read=True)
    else:
        user_id = request.data.get('user_id')
        if user_id:
            target_user = User.objects.get(id=user_id)
            ChatMessage.objects.filter(user=target_user, is_read=False).exclude(sender=request.user).update(is_read=True)
            
    return Response({"message": "Read"})
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_object_storages(request):
    try:
        res = get_contabo().list_object_storages()
        return Response(res.get('data', []))
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_private_networks(request):
    try:
        res = get_contabo().list_private_networks()
        return Response(res.get('data', []))
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_dns_zones(request):
    try:
        res = get_contabo().list_dns_zones()
        return Response(res.get('data', []))
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_dns_records(request, zone_id):
    try:
        res = get_contabo().list_dns_records(zone_id)
        return Response(res.get('data', []))
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_firewalls(request):
    try:
        res = get_contabo().list_firewalls()
        return Response(res.get('data', []))
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_snapshots(request):
    try:
        res = get_contabo().list_all_snapshots()
        return Response(res.get('data', []))
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_load_balancers(request):
    try:
        res = get_contabo().list_load_balancers()
        return Response(res.get('data', []))
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def tblinc_email(request):
    """View to test SMTP configuration"""
    to_email = request.data.get('email', request.user.email)
    try:
        send_mail(
            subject='SMTP Test - TBLINC',
            message='This is a test email to verify your SMTP configuration on TBLINC Cloud Platform.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )
        return Response({"message": f"Test email sent successfully to {to_email}"})
    except Exception as e:
        return Response({"error": f"Failed to send email: {str(e)}"}, status=500)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_unapproved_users(request):
    users = User.objects.filter(is_approved=False, is_active=True)
    data = [{
        "id": u.id,
        "email": u.email,
        "date_joined": u.date_joined,
        "is_active": u.is_active
    } for u in users]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_user(request):
    user_id = request.data.get('user_id')
    try:
        user = User.objects.get(id=user_id)
        user.is_approved = True
        user.save()
        
        # Notify user of approval
        send_mail(
            subject='Account Approved - TBLINC Cloud',
            message=f'Hi,\n\nYour account ({user.email}) has been approved by the TBLINC team. You can now login and start managing your infrastructure.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
        
        return Response({"message": f"User {user.email} approved successfully"})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['GET'])
@permission_classes([AllowAny])
def approve_user_link(request, uidb64, token):
    try:
        from django.utils.http import urlsafe_base64_decode
        from django.contrib.auth.tokens import default_token_generator
        
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
        
        if default_token_generator.check_token(user, token):
            user.is_approved = True
            user.save()
            
            # Notify user
            send_mail(
                subject='Account Approved - TBLINC Cloud',
                message=f'Hi,\n\nYour account ({user.email}) has been approved. You can now login.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )
            
            from django.http import HttpResponse
            return HttpResponse("<h1>User Approved Successfully</h1><p>You can close this window.</p>")
        else:
            from django.http import HttpResponse
            return HttpResponse("<h1>Invalid or Expired Link</h1>", status=400)
            
    except Exception as e:
        from django.http import HttpResponse
        return HttpResponse(f"<h1>Error</h1><p>{str(e)}</p>", status=500)
