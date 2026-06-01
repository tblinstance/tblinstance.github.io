#!/usr/bin/env bash
set -e

# ─── Paths ────────────────────────────────────────────────────────────────────
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$REPO_ROOT/src/deployment/backend"

echo "==> REPO_ROOT: $REPO_ROOT"
echo "==> BACKEND_DIR: $BACKEND_DIR"

# ─── Install Python dependencies ──────────────────────────────────────────────
echo "==> Installing Python dependencies..."
cd "$REPO_ROOT"

if command -v poetry &>/dev/null; then
    echo "==> Using poetry..."
    poetry install --no-root
else
    echo "==> Installing poetry..."
    pip install poetry
    poetry install --no-root
fi

# ─── Django setup ─────────────────────────────────────────────────────────────
cd "$BACKEND_DIR"
export DJANGO_SETTINGS_MODULE=core.settings

echo "==> Running migrations..."
poetry run python manage.py migrate --noinput

echo "==> Collecting static files..."
poetry run python manage.py collectstatic --noinput

# ─── Create / update superuser ────────────────────────────────────────────────
echo "==> Creating superuser..."
poetry run python manage.py shell -c "
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

echo "==> Build complete."
