import os
from datetime import timedelta
from django.utils import timezone
from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from tblinc.models import Server, Transaction, Notification
from tblinc.contabo_api import ContaboAPI
from django.conf import settings
from django.db import transaction
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

CONTABO_CLIENT_ID = os.environ.get('CONTABO_CLIENT_ID')
CONTABO_CLIENT_SECRET = os.environ.get('CONTABO_CLIENT_SECRET')
CONTABO_API_USER = os.environ.get('CONTABO_API_USER')
CONTABO_API_PASS = os.environ.get('CONTABO_API_PASS')

contabo = ContaboAPI(CONTABO_CLIENT_ID, CONTABO_CLIENT_SECRET, CONTABO_API_USER, CONTABO_API_PASS)

class Command(BaseCommand):
    help = 'Processes automated billing logic: 25-day warnings and 30-day renewals.'

    def handle(self, *args, **options):
        now = timezone.now()
        
        # 1. Warning Phase (Day 25)
        # Find servers expiring between 5 and 6 days from now
        warning_start = now + timedelta(days=5)
        warning_end = now + timedelta(days=6)
        
        expiring_servers = Server.objects.filter(
            status='ACTIVE',
            expires_at__gte=warning_start,
            expires_at__lte=warning_end,
            renewal_warning_sent=False
        )
        
        for server in expiring_servers:
            user = server.user
            self.stdout.write(f"Sending warning for {server.name} ({user.email})")
            
            msg = f"Your server '{server.name}' ({server.ip_address}) will expire in 5 days. It will automatically renew if you have sufficient balance ({server.plan_price} BDT). Please top up your account."
            Notification.objects.create(
                user=user,
                title="Server Expiring Soon",
                message=msg,
                type="warning"
            )
            
            try:
                send_mail(
                    subject="TBLINC - Server Expiring Soon",
                    message=msg,
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@tblinc.com'),
                    recipient_list=[user.email],
                    fail_silently=True,
                )
            except Exception as e:
                self.stderr.write(f"Email failed to {user.email}: {e}")
            
            server.renewal_warning_sent = True
            server.save()
            
        # 2. Renewal Phase (Day 30)
        # Find servers that have expired
        expired_servers = Server.objects.filter(
            status='ACTIVE',
            expires_at__lte=now
        )
        
        for server in expired_servers:
            user = server.user
            self.stdout.write(f"Processing renewal for {server.name} ({user.email})")
            
            if not server.auto_renew:
                self.suspend_server(server, "Auto-renew is disabled.")
                continue
                
            if user.balance >= server.plan_price:
                # Renew
                with transaction.atomic():
                    user.balance -= server.plan_price
                    user.save()
                    
                    server.expires_at += timedelta(days=30)
                    server.renewal_warning_sent = False
                    server.save()
                    
                    Transaction.objects.create(
                        user=user,
                        amount=server.plan_price,
                        type='SPEND',
                        transaction_id=f"RENEW-{server.id}-{int(now.timestamp())}",
                        status='SUCCESS'
                    )
                
                msg = f"Your server '{server.name}' has been successfully renewed for another 30 days. {server.plan_price} BDT has been deducted from your balance."
                Notification.objects.create(user=user, title="Server Renewed", message=msg, type="success")
                try:
                    send_mail(
                        "TBLINC - Server Renewed", 
                        msg, 
                        getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@tblinc.com'), 
                        [user.email], 
                        fail_silently=True
                    )
                except:
                    pass
                    
            else:
                # Insufficient balance
                self.suspend_server(server, f"Insufficient balance for renewal ({server.plan_price} BDT required).")

    def suspend_server(self, server, reason):
        self.stdout.write(f"Suspending {server.name} - {reason}")
        try:
            success = contabo.control_instance(server.contabo_id, 'stop')
            if not success:
                self.stderr.write(f"Failed to stop instance {server.contabo_id} on Contabo.")
        except Exception as e:
            self.stderr.write(f"Contabo API error: {e}")
            
        server.status = 'SUSPENDED'
        server.save()
        
        msg = f"Your server '{server.name}' has been suspended. Reason: {reason} Please add balance and contact support to restore your service."
        Notification.objects.create(user=server.user, title="Server Suspended", message=msg, type="error")
        try:
            send_mail(
                "TBLINC - Server Suspended Action Required", 
                msg, 
                getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@tblinc.com'), 
                [server.user.email], 
                fail_silently=True
            )
        except:
            pass
