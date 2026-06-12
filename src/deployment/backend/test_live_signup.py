import requests
import random
import string

def test_signup():
    random_id = "".join(random.choices(string.digits, k=6))
    email = f"tblinc810+test_{random_id}@gmail.com"
    password = "Aaaa1111@@##"
    
    base_url = "https://tblinstance-github-io.onrender.com"
    signup_url = f"{base_url}/auth/users/"
    
    payload = {
        "email": email,
        "password": password,
        "re_password": password,
        "first_name": "Test",
        "last_name": f"User_{random_id}",
        "phone_number": "+8801712345678",
        "address": "Dhaka, Bangladesh",
        "country": "Bangladesh"
    }
    
    print(f"Sending signup request to {signup_url} for email: {email}...")
    try:
        res = requests.post(signup_url, json=payload, timeout=15)
        print(f"Status Code: {res.status_code}")
        print(f"Response: {res.text}")
        if res.status_code == 201:
            print("✓ Account successfully created!")
            print("✓ Djoser should have sent the random activation link via SMTP!")
        else:
            print("❌ Signup failed!")
    except Exception as e:
        print(f"Error during request: {e}")

if __name__ == "__main__":
    test_signup()
