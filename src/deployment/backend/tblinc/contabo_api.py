import os
import requests
import time
import uuid
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class ContaboAPI:
    def __init__(self, client_id=None, client_secret=None, api_user=None, api_password=None):
        self.client_id = client_id or os.environ.get("CONTABO_CLIENT_ID")
        self.client_secret = client_secret or os.environ.get("CONTABO_CLIENT_SECRET")
        self.api_user = api_user or os.environ.get("CONTABO_API_USER")
        self.api_password = api_password or os.environ.get("CONTABO_API_PASS")
        self.access_token = None
        self.token_expiry = 0

    def _get_access_token(self):
        missing = []
        if not self.client_id: missing.append("CONTABO_CLIENT_ID")
        if not self.client_secret: missing.append("CONTABO_CLIENT_SECRET")
        if not self.api_user: missing.append("CONTABO_API_USER")
        if not self.api_password: missing.append("CONTABO_API_PASS")
        if missing:
            raise ValueError(f"Contabo API credentials missing: {', '.join(missing)}. Please check your .env file.")

        if self.access_token and time.time() < self.token_expiry:
            return self.access_token

        url = "https://auth.contabo.com/auth/realms/contabo/protocol/openid-connect/token"
        data = {
            "grant_type": "password",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "username": self.api_user,
            "password": self.api_password
        }
        
        response = requests.post(url, data=data)
        response.raise_for_status()
        
        token_data = response.json()
        self.access_token = token_data["access_token"]
        self.token_expiry = time.time() + token_data["expires_in"] - 60  # Buffer of 60s
        return self.access_token

    def _get_headers(self):
        return {
            "Authorization": f"Bearer {self._get_access_token()}",
            "x-request-id": str(uuid.uuid4()),
            "Content-Type": "application/json"
        }

    def list_instances(self):
        url = "https://api.contabo.com/v1/compute/instances"
        response = requests.get(url, headers=self._get_headers())
        response.raise_for_status()
        return response.json()

    def create_secret(self, name, value, type="password"):
        url = "https://api.contabo.com/v1/secrets"
        data = {
            "name": name,
            "value": value,
            "type": type
        }
        response = requests.post(url, headers=self._get_headers(), json=data)
        response.raise_for_status()
        # Return the secretId from the data array
        return response.json().get('data', [{}])[0].get('secretId')

    def list_secrets(self, type=None, name=None):
        url = "https://api.contabo.com/v1/secrets"
        params = {}
        if type:
            params['type'] = type
        if name:
            params['name'] = name
        response = requests.get(url, headers=self._get_headers(), params=params)
        response.raise_for_status()
        return response.json()

    def create_instance(self, productId, region, imageId, rootPasswordId, displayName, sshKeys=None):
        url = "https://api.contabo.com/v1/compute/instances"
        data = {
            "productId": productId,
            "region": region,
            "imageId": imageId,
            "rootPassword": int(rootPasswordId), # Must be integer ID
            "displayName": displayName
        }
        if sshKeys:
            data["sshKeys"] = sshKeys
            
        response = requests.post(url, headers=self._get_headers(), json=data)
        if response.status_code >= 400:
            print(f"Contabo API Error Response: {response.text}")
        response.raise_for_status()
        return response.json()

    def control_instance(self, instanceId, action):
        """Action can be 'start', 'stop', or 'restart'"""
        url = f"https://api.contabo.com/v1/compute/instances/{instanceId}/actions/{action}"
        response = requests.post(url, headers=self._get_headers())
        response.raise_for_status()
        return response.status_code == 204 or response.status_code == 200

    def cancel_instance(self, instanceId):
        """Permanently terminate/cancel an instance"""
        url = f"https://api.contabo.com/v1/compute/instances/{instanceId}/cancel"
        response = requests.post(url, headers=self._get_headers())
        # Contabo might return 204 No Content on success
        return response.status_code in [200, 201, 204]

    def reinstall_instance(self, instanceId, imageId, rootPasswordId):
        """Reinstall/Rebuild an instance with a new image and password"""
        url = f"https://api.contabo.com/v1/compute/instances/{instanceId}/actions/reinstall"
        data = {
            "imageId": imageId,
            "rootPassword": int(rootPasswordId)
        }
        response = requests.post(url, headers=self._get_headers(), json=data)
        return response.status_code in [200, 201, 204]

    # --- OBJECT STORAGE ---
    def list_object_storages(self):
        url = "https://api.contabo.com/v1/object-storages"
        response = requests.get(url, headers=self._get_headers())
        response.raise_for_status()
        return response.json()

    # --- PRIVATE NETWORKING (VPC) ---
    def list_private_networks(self):
        url = "https://api.contabo.com/v1/private-networks"
        response = requests.get(url, headers=self._get_headers())
        response.raise_for_status()
        return response.json()

    # --- DNS MANAGEMENT ---
    def list_dns_zones(self):
        url = "https://api.contabo.com/v1/dns/zones"
        response = requests.get(url, headers=self._get_headers())
        response.raise_for_status()
        return response.json()

    def list_dns_records(self, zoneId):
        url = f"https://api.contabo.com/v1/dns/zones/{zoneId}/records"
        response = requests.get(url, headers=self._get_headers())
        response.raise_for_status()
        return response.json()

    # --- FIREWALLS ---
    def list_firewalls(self):
        url = "https://api.contabo.com/v1/firewalls"
        response = requests.get(url, headers=self._get_headers())
        response.raise_for_status()
        return response.json()

    # --- SNAPSHOTS ---
    def list_instance_snapshots(self, instanceId):
        """List snapshots for a specific instance."""
        url = f"https://api.contabo.com/v1/compute/instances/{instanceId}/snapshots"
        response = requests.get(url, headers=self._get_headers())
        response.raise_for_status()
        return response.json()

    # --- LOAD BALANCERS (Virtual IPs) ---
    def list_load_balancers(self):
        url = "https://api.contabo.com/v1/vips"
        response = requests.get(url, headers=self._get_headers())
        response.raise_for_status()
        return response.json()

if __name__ == "__main__":
    print("==================================================")
    print("Contabo API & .env Configuration Check")
    print("==================================================")
    
    # Instantiate the client (automatically loads credentials from environment)
    try:
        api = ContaboAPI()
        
        # Mask credentials for display
        def mask(s):
            if not s: return "Not Set"
            return s[:4] + "*" * (len(s) - 4) if len(s) > 4 else "***"

        print(f"CONTABO_CLIENT_ID:     {mask(api.client_id)}")
        print(f"CONTABO_CLIENT_SECRET: {mask(api.client_secret)}")
        print(f"CONTABO_API_USER:      {mask(api.api_user)}")
        print(f"CONTABO_API_PASS:      {mask(api.api_password)}")
        print("--------------------------------------------------")
        
        print("Authenticating...")
        token = api._get_access_token()
        print("✓ Token acquired successfully.")
        
        print("Fetching instances list...")
        instances = api.list_instances()
        count = len(instances.get("data", []))
        print(f"✓ API response received. Found {count} instance(s).")
        
        print("--------------------------------------------------")
        print("✅ SUCCESS: Contabo API is fully configured and reachable!")
        print("==================================================")
    except Exception as e:
        print("--------------------------------------------------")
        print(f"❌ ERROR: Check failed!")
        print(str(e))
        if hasattr(e, 'response') and e.response is not None:
            print(f"API Response Details: {e.response.text}")
        print("==================================================")
        exit(1)
