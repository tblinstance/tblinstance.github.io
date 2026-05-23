#!/usr/bin/env bash
set -e

# Write .env from build-time env vars (or fallback to hardcoded defaults)
cat > .env << 'EOF'
CONTABO_CLIENT_ID=INT-14498746
CONTABO_CLIENT_SECRET=ge0nQpTMDfZYnGatHEeQSk7dZ0hlpjxU
CONTABO_API_USER=tblinc810@gmail.com
CONTABO_API_PASSWORD=Aaaa1111@@a
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tblinc810@gmail.com
EMAIL_HOST_PASSWORD=rteohhxmyoydwjix
DEFAULT_FROM_EMAIL=TBLINC <no-reply@tblinc.com>
CURRENCY_API_KEY=fca_live_36um3nfiCgxWh8yz6mk70OsfR8u6h707OX0OXKK0
SSL_STORE_ID=tblin663e2646399c5
SSL_STORE_PASS=tblin663e2646399c5@ssl
SSL_IS_SANDBOX=True
PAYPAL_CLIENT_ID=AQ_your_paypal_client_id_here
PAYPAL_SECRET=EB_your_paypal_secret_here
PAYPAL_MODE=sandbox
SMS_API_KEY=your_sms_api_key_here
SMS_SENDER_ID=TBLINC
SMS_API_URL=https://msg.elitbuzz-bd.com/smsapi
EOF

echo ".env file written."

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Create/update admin superuser
python manage.py shell -c "
from tblinc.models import User

email = 'tblinc810@gmail.com'
password = 'Aaaa1111@@##'

user, created = User.objects.get_or_create(email=email)
user.set_password(password)
user.username = email
user.is_staff = True
user.is_superuser = True
user.is_approved = True
user.is_active = True
user.save()

if created:
    print(f'Superuser created: {email}')
else:
    print(f'Superuser updated: {email}')
"

echo "Build complete."
