import os
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
from django.urls import reverse
from .models import User, Transaction, Server
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from .utils import send_sms

@receiver(post_save, sender=User)
def send_welcome_email(sender, instance, created, **kwargs):
    """Send a welcome email when a new user registers. Always fail silently."""
    if created:
        try:
            send_mail(
                subject='Welcome to TBLINC Cloud!',
                message=(
                    f'Hi {instance.first_name or instance.email},\n\n'
                    f'Welcome to TBLINC Cloud! Your account has been created successfully.\n\n'
                    f'You can now log in at https://tblinstance.github.io/ using your email: {instance.email}\n\n'
                    f'If you have any questions, please contact our support team.\n\n'
                    f'Best regards,\nTBLINC Cloud Team'
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[instance.email],
                fail_silently=True,  # Never block registration due to SMTP issues
            )
        except Exception:
            pass  # Never block registration due to SMTP issues


@receiver(post_save, sender=User)
def send_admin_approval_email(sender, instance, created, **kwargs):
    # Notify admin when a new user registers
    if created and not instance.is_approved:
        uid = urlsafe_base64_encode(force_bytes(instance.pk))
        token = default_token_generator.make_token(instance)
        
        backend_root = getattr(settings, 'BACKEND_ROOT', None)
        if backend_root:
            backend_root = backend_root.rstrip('/')
        else:
            domain = getattr(settings, 'DOMAIN', 'localhost:8000')
            backend_root = f"http://{domain}".rstrip('/')

        approval_url = f"{backend_root}/api/admin/approve-link/{uid}/{token}/"
        
        admin_email = os.environ.get('EMAIL_HOST_USER')
        if admin_email:
            send_mail(
                subject=f'New User Registration: {instance.email}',
                message=f'A new user has registered and requires approval.\n\nUser: {instance.email}\nJoined: {instance.date_joined}\n\nApprove here:\n{approval_url}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[admin_email],
                fail_silently=True,  # Never block registration due to SMTP issues
            )


@receiver(post_save, sender=Transaction)
def send_transaction_email(sender, instance, created, **kwargs):
    if created:
        if instance.status == 'SUCCESS':
            subject = f'Transaction Success: {instance.type} - TBLINC'
            message = f'Hi,\n\nYour transaction was successful.\n\nType: {instance.get_type_display()}\nAmount: {instance.amount} BDT\nTransaction ID: {instance.transaction_id}\n\nThank you for choosing TBLINC.'
            
            # Email
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [instance.user.email], fail_silently=True)
            
            # SMS
            sms_text = f"TBLINC: Transaction Successful! {instance.type} of {instance.amount} BDT. ID: {instance.transaction_id}"
            send_sms(instance.user.phone_number, sms_text)
            
            # Low Balance Warning
            if instance.user.balance < 500:
                warning_subject = 'Low Balance Warning - TBLINC'
                warning_message = f'Hi,\n\nYour account balance is currently {instance.user.balance} BDT. Please top up soon.'
                send_mail(warning_subject, warning_message, settings.DEFAULT_FROM_EMAIL, [instance.user.email], fail_silently=True)
                send_sms(instance.user.phone_number, f"TBLINC Alert: Your balance is low ({instance.user.balance} BDT). Please top up.")

        elif instance.status == 'FAILED' or instance.status == 'DECLINED':
            subject = f'Transaction Declined: {instance.type} - TBLINC'
            message = f'Hi,\n\nYour transaction was declined or failed.\n\nType: {instance.get_type_display()}\nAmount: {instance.amount} BDT\nTransaction ID: {instance.transaction_id}\n\nPlease check your payment method or contact support.'
            
            # Email
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [instance.user.email], fail_silently=True)
            
            # SMS
            sms_text = f"TBLINC Alert: Transaction Declined! {instance.type} of {instance.amount} BDT failed. Please check your account."
            send_sms(instance.user.phone_number, sms_text)


@receiver(post_save, sender=Server)
def send_server_status_email(sender, instance, created, **kwargs):
    # Only notify if the status just changed to something meaningful like 'ACTIVE' or 'provisioning'
    if created:
        subject = f'Provisioning Started: {instance.name} - TBLINC'
        message = f'Hi,\n\nYour server {instance.name} is now being provisioned.\n\nProduct: {instance.product_id}\n\nYou will receive another email once it is ready.'
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.user.email],
            fail_silently=True,
        )
