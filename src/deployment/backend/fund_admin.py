import os
import django
from decimal import Decimal
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from tblinc.models import User, Transaction

email = "tblinc810@gmail.com"
amount = Decimal("10000.00")

try:
    user = User.objects.get(email=email)
    user.balance += amount
    user.save()
    
    Transaction.objects.create(
        user=user,
        amount=amount,
        type='DEPOSIT',
        transaction_id="TEST-FUNDING-001",
        status='SUCCESS (TEST)'
    )
    print(f"Successfully funded {email} with {amount} BDT. New balance: {user.balance}")
except User.DoesNotExist:
    print(f"User {email} not found. Please sign up first.")
except Exception as e:
    print(f"Error: {e}")
