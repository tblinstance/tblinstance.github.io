import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from subhosting.views import contabo

try:
    print("Testing Contabo API connection...")
    instances = contabo.list_instances()
    print("Successfully connected to Contabo API!")
    print(f"Found {len(instances.get('data', []))} instances.")
except Exception as e:
    print(f"Failed to connect to Contabo API: {e}")
