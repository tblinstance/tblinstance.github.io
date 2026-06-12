import os
import django
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from tblinc.views import get_contabo

try:
    print("Initializing Contabo API Client...")
    client = get_contabo()
    
    print("\n--- Testing Authentication ---")
    token = client._get_access_token()
    print("✓ Successfully authenticated! Token retrieved.")

    print("\n--- Testing Instances ---")
    instances = client.list_instances()
    instance_list = instances.get('data', [])
    print(f"✓ Found {len(instance_list)} instances.")
    if instance_list:
        print(f"  First instance ID: {instance_list[0].get('instanceId')} ({instance_list[0].get('displayName')})")

    print("\n--- Testing Object Storage ---")
    storages = client.list_object_storages()
    storage_list = storages.get('data', [])
    print(f"✓ Found {len(storage_list)} storage clusters.")
    if storage_list:
        print(f"  First cluster ID: {storage_list[0].get('objectStorageId')} ({storage_list[0].get('displayName')})")

    print("\n--- Testing Private Networks (VPCs) ---")
    networks = client.list_private_networks()
    network_list = networks.get('data', [])
    print(f"✓ Found {len(network_list)} private networks.")
    if network_list:
        print(f"  First network ID: {network_list[0].get('privateNetworkId')} ({network_list[0].get('name')})")

    print("\n--- Testing DNS Zones ---")
    zones = client.list_dns_zones()
    zone_list = zones.get('data', [])
    print(f"✓ Found {len(zone_list)} DNS zones.")
    if zone_list:
        zone_id = zone_list[0].get('zoneName')
        print(f"  First zone: {zone_id}")
        print(f"  Fetching DNS records for {zone_id}...")
        records = client.list_dns_records(zone_id)
        record_list = records.get('data', [])
        print(f"  ✓ Found {len(record_list)} records in zone {zone_id}.")

    print("\n--- Testing Firewalls ---")
    firewalls = client.list_firewalls()
    fw_list = firewalls.get('data', [])
    print(f"✓ Found {len(fw_list)} firewalls.")
    if fw_list:
        print(f"  First firewall ID: {fw_list[0].get('firewallId')} ({fw_list[0].get('name')})")

    print("\n--- Testing Snapshots (per-instance) ---")
    total_snapshots = 0
    for inst in instance_list[:2]:  # Limit check to first 2 instances to avoid rate limits
        iid = inst.get('instanceId')
        try:
            snaps = client.list_instance_snapshots(iid)
            snap_list = snaps.get('data', [])
            total_snapshots += len(snap_list)
            print(f"  Instance {iid}: found {len(snap_list)} snapshots.")
        except Exception as e:
            print(f"  Instance {iid}: failed to list snapshots: {e}")
    print(f"✓ Snapshot listing complete.")

    print("\n--- Testing Load Balancers (VIPs) ---")
    vips = client.list_load_balancers()
    vip_list = vips.get('data', [])
    print(f"✓ Found {len(vip_list)} VIPs / Load Balancers.")
    if vip_list:
        print(f"  First VIP: {vip_list[0].get('vipId')} ({vip_list[0].get('v4', {}).get('ip')})")

    print("\n======================================")
    print("ALL API CHECKS EXECUTED SUCCESSFULLY!")
    print("======================================")

except Exception as e:
    print(f"\n❌ API Check Failed: {e}")
