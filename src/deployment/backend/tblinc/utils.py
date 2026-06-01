import requests
import os
import logging

logger = logging.getLogger(__name__)

def send_sms(phone_number, message):
    """
    Sends an SMS message using the configured API.
    """
    if not phone_number:
        logger.warning("No phone number provided for SMS")
        return False

    api_key = os.environ.get('SMS_API_KEY')
    api_url = os.environ.get('SMS_API_URL')
    sender_id = os.environ.get('SMS_SENDER_ID', 'TBLINC')

    if not api_key or not api_url:
        # Fallback to logging if not configured
        print(f"--- SMS LOG (NOT CONFIGURED) TO {phone_number} ---")
        print(f"Message: {message}")
        print("--------------------------------")
        return True

    try:
        # Common pattern for SMS APIs (Generic HTTP GET example)
        # Adjust params based on your provider's documentation
        params = {
            'api_key': api_key,
            'sender_id': sender_id,
            'number': phone_number,
            'message': message
        }
        response = requests.get(api_url, params=params, timeout=10)
        response.raise_for_status()
        return True
    except Exception as e:
        logger.error(f"SMS sending failed to {phone_number}: {e}")
        return False
