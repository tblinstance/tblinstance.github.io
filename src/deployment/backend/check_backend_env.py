import os
import sys
import django
import requests

# Set settings module and initialize django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
try:
    django.setup()
except Exception as e:
    print(f"❌ Django Setup Failed: {e}")
    sys.exit(1)

from tblinc.contabo_api import ContaboAPI
from django.conf import settings

def run_backend_checks():
    print("==================================================")
    print("      TBLINC Backend .env Configuration Check     ")
    print("==================================================")
    
    # 1. Django Database Check
    print("\n--- 1. Testing Database Connection ---")
    from django.db import connection
    try:
        connection.ensure_connection()
        print("✓ Database connection verified successfully!")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

    # 2. Contabo API Check
    print("\n--- 2. Testing Contabo API Connection ---")
    try:
        api = ContaboAPI()
        # Mask credentials
        def mask(s):
            if not s: return "Not Set"
            return s[:4] + "*" * (len(s) - 4) if len(s) > 4 else "***"
        print(f"Client ID: {mask(api.client_id)}")
        print(f"User:      {mask(api.api_user)}")
        
        token = api._get_access_token()
        print("✓ Authentication successful! Token retrieved.")
        instances = api.list_instances()
        print(f"✓ Connected to Contabo! Found {len(instances.get('data', []))} instances.")
    except Exception as e:
        print(f"❌ Contabo API check failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")

    # 3. SMTP Email Check
    print("\n--- 3. Testing SMTP Email Connection ---")
    email_host = os.environ.get('EMAIL_HOST')
    email_port = os.environ.get('EMAIL_PORT')
    email_user = os.environ.get('EMAIL_HOST_USER')
    email_password = os.environ.get('EMAIL_HOST_PASSWORD')
    email_use_tls = os.environ.get('EMAIL_USE_TLS', 'True') == 'True'
    
    if not email_host or not email_user or not email_password:
        print("⚠ SMTP Email settings are not fully configured in .env.")
    else:
        try:
            import smtplib
            port = int(email_port) if email_port else 587
            print(f"Connecting to SMTP server {email_host}:{port}...")
            server = smtplib.SMTP(email_host, port, timeout=10)
            if email_use_tls:
                print("Starting TLS encryption...")
                server.starttls()
            print("Authenticating SMTP credentials...")
            server.login(email_user, email_password)
            server.quit()
            print("✓ SMTP Authentication successful!")
        except Exception as e:
            print(f"❌ SMTP check failed: {e}")

    # 4. Testing PayPal API
    print("\n--- 4. Testing PayPal API ---")
    paypal_id = os.environ.get('PAYPAL_CLIENT_ID')
    paypal_secret = os.environ.get('PAYPAL_SECRET')
    paypal_mode = os.environ.get('PAYPAL_MODE', 'sandbox')
    
    if not paypal_id or not paypal_secret or paypal_id.startswith('AQ_your_'):
        print("⚠ PayPal Credentials are not configured (default placeholders found).")
    else:
        try:
            api_base = "https://api-m.sandbox.paypal.com" if paypal_mode == "sandbox" else "https://api-m.paypal.com"
            print(f"Authenticating with PayPal ({paypal_mode})...")
            auth_res = requests.post(
                f"{api_base}/v1/oauth2/token",
                auth=(paypal_id, paypal_secret),
                data={"grant_type": "client_credentials"},
                timeout=10
            )
            if auth_res.status_code == 200:
                print("✓ PayPal credentials are valid!")
            else:
                print(f"❌ PayPal authentication failed: {auth_res.status_code} - {auth_res.text}")
        except Exception as e:
            print(f"❌ PayPal check failed: {e}")

    # 5. Testing Currency API
    print("\n--- 5. Testing Currency API ---")
    currency_key = os.environ.get('CURRENCY_API_KEY')
    if not currency_key or currency_key.startswith('your_'):
        print("⚠ CURRENCY_API_KEY is not configured.")
    else:
        try:
            url = f"https://api.currencyapi.com/v3/latest?base_currency=USD&currencies=BDT&apikey={currency_key}"
            print("Connecting to CurrencyAPI...")
            res = requests.get(url, timeout=10)
            if res.status_code == 200:
                rate = res.json().get('data', {}).get('BDT', {}).get('value')
                print(f"✓ CurrencyAPI check successful! Current USD/BDT rate: {rate}")
            else:
                print(f"❌ CurrencyAPI failed with status {res.status_code}: {res.text}")
        except Exception as e:
            print(f"❌ CurrencyAPI check failed: {e}")

    # 6. Testing SSLCommerz Configuration
    print("\n--- 6. Testing SSLCommerz Configuration ---")
    store_id = os.environ.get('SSL_STORE_ID')
    store_pass = os.environ.get('SSL_STORE_PASS')
    is_sandbox = os.environ.get('SSL_IS_SANDBOX', 'True') == 'True'
    
    if not store_id or not store_pass or store_id.startswith('your_'):
        print("⚠ SSLCommerz settings are not configured.")
    else:
        print(f"Store ID: {store_id[:4]}***")
        print(f"Sandbox Mode: {is_sandbox}")
        try:
            gw_url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php" if is_sandbox else "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
            print(f"Pinging SSLCommerz gateway ({gw_url})...")
            # Endpoint responds to POST, verifying connectivity
            res = requests.post(gw_url, data={}, timeout=10)
            print("✓ SSLCommerz Gateway is reachable.")
        except Exception as e:
            print(f"❌ SSLCommerz connectivity failed: {e}")

    # 7. Testing SMS API Configuration
    print("\n--- 7. Testing SMS API Configuration ---")
    sms_key = os.environ.get('SMS_API_KEY')
    sms_url = os.environ.get('SMS_API_URL')
    if not sms_key or not sms_url or sms_key.startswith('your_'):
        print("⚠ SMS API settings are not configured. SMS sending will fallback to logging.")
    else:
        print(f"SMS API URL: {sms_url}")
        try:
            from urllib.parse import urlparse
            import socket
            parsed = urlparse(sms_url)
            host = parsed.netloc
            print(f"Resolving SMS Host {host}...")
            ip = socket.gethostbyname(host)
            print(f"✓ SMS Host resolved to {ip}")
        except Exception as e:
            print(f"❌ SMS host resolution failed: {e}")

    print("\n==================================================")
    print("               Backend Check Complete             ")
    print("==================================================")

if __name__ == "__main__":
    run_backend_checks()
