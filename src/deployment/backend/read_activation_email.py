"""
End-to-end signup + email activation test.
1. Signs up a new user on the live Render backend
2. Waits up to 60 seconds for the Djoser activation email to land in Gmail
3. Extracts the activation link from the email
4. Calls the backend activation endpoint to activate the account
"""
import imaplib
import email as emaillib
from email.header import decode_header
import re
import time
import random
import string
import requests

BACKEND_URL = "https://tblinstance-github-io.onrender.com"
GMAIL_USER = "tblinc810@gmail.com"
GMAIL_APP_PW = "rteohhxmyoydwjix"

def signup(email, password):
    url = f"{BACKEND_URL}/auth/users/"
    payload = {
        "email": email,
        "password": password,
        "re_password": password,
        "first_name": "Test",
        "last_name": "Activation",
        "phone_number": "+8801712345678",
        "address": "Dhaka, Bangladesh",
        "country": "Bangladesh"
    }
    print(f"\n[1] Signing up: {email}")
    for attempt in range(1, 4):
        try:
            res = requests.post(url, json=payload, timeout=60)
            print(f"    Status: {res.status_code}")
            print(f"    Body:   {res.text[:200]}")
            return res.status_code == 201
        except requests.exceptions.ReadTimeout:
            print(f"    Attempt {attempt} timed out, retrying...")
            time.sleep(5)
    print("    All attempts failed.")
    return False

def wait_for_activation_email(target_email, timeout=90):
    """Poll Gmail IMAP for the Djoser activation email sent to target_email."""
    print(f"\n[2] Waiting for activation email (up to {timeout}s)...")
    deadline = time.time() + timeout
    imap = imaplib.IMAP4_SSL("imap.gmail.com", 993)
    imap.login(GMAIL_USER, GMAIL_APP_PW)
    print("    ✓ Gmail IMAP connected")

    while time.time() < deadline:
        # Search ALL mail (includes spam/promotions)
        imap.select('"[Gmail]/All Mail"')
        # Search by subject keyword Djoser uses: "Activate"
        status, msgs = imap.search(None, 'UNSEEN SUBJECT "Activate"')
        if status == "OK" and msgs[0]:
            ids = msgs[0].split()
            for mid in reversed(ids):
                status2, data = imap.fetch(mid, "(RFC822)")
                for part in data:
                    if isinstance(part, tuple):
                        msg = emaillib.message_from_bytes(part[1])
                        to_field = msg.get("To", "")
                        if target_email.split("@")[1] in to_field or target_email in to_field:
                            subj, enc = decode_header(msg["Subject"])[0]
                            if isinstance(subj, bytes):
                                subj = subj.decode(enc or "utf-8")
                            print(f"    ✓ Found email: Subject='{subj}', To='{to_field}'")
                            body = extract_body(msg)
                            imap.store(mid, '+FLAGS', '\\Seen')
                            imap.close()
                            imap.logout()
                            return body
        print(f"    ... no email yet, retrying in 10s (remaining: {int(deadline - time.time())}s)")
        time.sleep(10)
    
    imap.close()
    imap.logout()
    print("    ✗ Timed out waiting for activation email")
    return None

def extract_body(msg):
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                return part.get_payload(decode=True).decode(errors="replace")
    else:
        return msg.get_payload(decode=True).decode(errors="replace")
    return ""

def extract_activation_link(body):
    # Djoser sends a link like: https://<domain>/activate/<uid>/<token>
    links = re.findall(r'https?://[^\s<>"]+activate[^\s<>"]+', body)
    return links[0] if links else None

def activate_account(uid, token):
    url = f"{BACKEND_URL}/auth/users/activation/"
    payload = {"uid": uid, "token": token}
    print(f"\n[3] Calling activation endpoint...")
    res = requests.post(url, json=payload, timeout=15)
    print(f"    Status: {res.status_code}")
    print(f"    Body:   {res.text[:300]}")
    return res.status_code in (200, 204)

def main():
    rid = "".join(random.choices(string.digits, k=6))
    test_email = f"tblinc810+activate_{rid}@gmail.com"
    password = "Aaaa1111@@##"

    # Step 1: Sign up
    ok = signup(test_email, password)
    if not ok:
        print("Signup failed, aborting.")
        return

    # Step 2: Wait for activation email
    body = wait_for_activation_email(test_email, timeout=90)
    if not body:
        print("\n✗ No activation email received. Check Render logs for SMTP errors.")
        return
    
    print(f"\n    Email body snippet:\n{body[:400]}")

    # Step 3: Extract activation link
    link = extract_activation_link(body)
    print(f"\n    Activation link: {link}")
    if not link:
        print("✗ Could not find activation link in email body.")
        return
    
    # Parse uid/token from link: /activate/<uid>/<token>
    m = re.search(r'/activate/([^/]+)/([^/\s]+)', link)
    if not m:
        print("✗ Could not parse uid/token from link.")
        return
    uid, token = m.group(1), m.group(2)
    print(f"    uid={uid}, token={token}")

    # Step 4: Activate
    success = activate_account(uid, token)
    if success:
        print("\n✅ Account activated successfully! Full signup → email → activation flow works.")
    else:
        print("\n✗ Activation API call failed.")

if __name__ == "__main__":
    main()
