#!/usr/bin/env bash
set -e

cd src/deployment/backend

# Install dependencies
pip install -r ../requirements.txt 2>/dev/null || pip install poetry && poetry install --no-root 2>/dev/null || true

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
