import os
import django
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from tblinc.models import User

email = "tblinc810@gmail.com"
password = "Aaaa1111@@##"

user, created = User.objects.get_or_create(email=email)
user.set_password(password)
user.is_staff = True
user.is_superuser = True
user.is_approved = True
user.is_active = True
user.save()

if created:
    print(f"Superuser created: {email}")
else:
    print(f"User updated to Superuser: {email}")
