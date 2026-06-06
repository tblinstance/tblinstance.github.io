import requests
import time
import uuid

class ContaboAPI:
    def __init__(self, client_id, client_secret, api_user, api_password):
        self.client_id = client_id
        self.client_secret = client_secret
        self.api_user = api_user
        self.api_password = api_password
        self.access_token = None
        self.token_expiry = 0

    def _get_access_token(self):
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
