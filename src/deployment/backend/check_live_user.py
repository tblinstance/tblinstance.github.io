import requests

email = "tblinc810@gmail.com"
password = "Aaaa1111@@##"
base_url = "https://tblinstance-github-io.onrender.com"

print(f"Authenticating with live backend {base_url}...")
try:
    auth_res = requests.post(f"{base_url}/auth/jwt/create/", json={
        "email": email,
        "username": email,
        "password": password
    })
    print(f"Auth Status: {auth_res.status_code}")
    if auth_res.status_code != 200:
        print(f"Auth Failed: {auth_res.text}")
        exit(1)
        
    token = auth_res.json().get("access")
    print("✓ Authenticated successfully!")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\nFetching user info...")
    user_res = requests.get(f"{base_url}/api/user-info/", headers=headers)
    print(f"User Info Status: {user_res.status_code}")
    if user_res.status_code == 200:
        data = user_res.json()
        print(f"  Email: {data.get('email')}")
        print(f"  Balance: {data.get('balance')} BDT")
        print(f"  Is Staff: {data.get('is_staff')}")
    else:
        print(user_res.text)
        
    print("\nFetching notifications...")
    notif_res = requests.get(f"{base_url}/api/notifications/", headers=headers)
    print(f"Notifications Status: {notif_res.status_code}")
    if notif_res.status_code == 200:
        notifs = notif_res.json()
        print(f"Found {len(notifs)} notifications:")
        for n in notifs[:10]:
            print(f"  - Title: {n.get('title')}, Message: {n.get('message')}, Type: {n.get('type')}")
    else:
        print(notif_res.text)

    print("\nFetching payments...")
    pay_res = requests.get(f"{base_url}/api/payments/", headers=headers) # Wait, is the endpoint /api/payments/ or what?
    # Let's check the viewset name in urls.py: router.register('payments', PaymentViewSet) -> so /api/payments/ is correct
    print(f"Payments Status: {pay_res.status_code}")
    if pay_res.status_code == 200:
        payments = pay_res.json()
        print(f"Found {len(payments)} payments:")
        for p in payments[:10]:
            print(f"  - Plan: {p.get('plan_id')}, Amount: {p.get('amount_bdt')}, Status: {p.get('status')}")
    else:
        # Maybe it's admin only? Let's try /api/transactions/ instead, which we did.
        print(pay_res.text)

    print("\nFetching transactions...")
    tx_res = requests.get(f"{base_url}/api/transactions/", headers=headers)
    print(f"Transactions Status: {tx_res.status_code}")
    if tx_res.status_code == 200:
        txs = tx_res.json()
        print(f"Found {len(txs)} transactions:")
        for t in txs[:10]:
            print(f"  - Type: {t.get('type')}, Amount: {t.get('amount')}, Status: {t.get('status')}, Date: {t.get('created_at') or t.get('timestamp')}")
    else:
        print(tx_res.text)

except Exception as e:
    print(f"Error: {e}")
