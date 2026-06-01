from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'v2/users', views.UserViewSet)
router.register(r'v2/servers', views.ServerViewSet)
router.register(r'v2/payments', views.PaymentViewSet)
router.register(r'v2/transactions', views.TransactionViewSet)
router.register(r'v2/manual-requests', views.ManualPaymentRequestViewSet)
router.register(r'v2/notifications', views.NotificationViewSet)
router.register(r'v2/settings', views.SystemSettingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('health/', views.health_check, name='health_check'),
    path('settings/', views.get_settings, name='get_settings'),
    path('settings/update/', views.update_setting, name='update_setting'),
    path('settings/sync-rate/', views.sync_exchange_rate, name='sync_exchange_rate'),
    path('admin/settings/', views.admin_list_settings, name='admin_list_settings'),
    path('servers/', views.list_servers, name='list_servers'),
    path('plans/', views.get_plans, name='get_plans'),
    path('order/', views.create_order, name='create_order'),
    path('deposit/', views.create_deposit, name='create_deposit'),
    path('transactions/', views.list_transactions, name='list_transactions'),
    path('admin/all-transactions/', views.admin_list_all_transactions, name='admin_list_all_transactions'),
    path('transactions/clear/', views.clear_transactions, name='clear_transactions'),
    path('notifications/', views.list_notifications, name='list_notifications'),
    path('notifications/mark-read/', views.mark_notifications_read, name='mark_notifications_read'),
    path('user-info/', views.get_user_info, name='get_user_info'),
    path('admin/users/', views.list_all_users, name='list_all_users'),
    path('admin/all-servers/', views.admin_list_all_servers, name='admin_list_all_servers'),
    path('admin/users/<int:user_id>/servers/', views.list_user_servers, name='list_user_servers'),
    path('admin/add-balance/', views.admin_add_balance, name='admin_add_balance'),
    path('admin/send-sms/', views.admin_send_sms, name='admin_send_sms'),
    path('admin/adjust-billing/', views.admin_adjust_billing, name='admin_adjust_billing'),
    path('admin/toggle-staff/', views.admin_toggle_staff, name='admin_toggle_staff'),
    path('admin/toggle-active/', views.admin_toggle_active, name='admin_toggle_active'),
    path('servers/<int:server_id>/control/', views.server_control, name='server_control'),
    path('paypal/deposit/', views.create_paypal_deposit, name='create_paypal_deposit'),
    path('paypal/success/', views.paypal_success, name='paypal_success'),
    path('manual/deposit/', views.create_manual_request, name='create_manual_request'),
    path('admin/manual-requests/', views.admin_list_manual_requests, name='admin_list_manual_requests'),
    path('admin/approve-manual/', views.admin_approve_manual, name='admin_approve_manual'),
    path('admin/reject-manual/', views.admin_reject_manual, name='admin_reject_manual'),
    # SSLCommerz Callbacks
    path('payment/success/', views.payment_success, name='payment_success'),
    path('payment/fail/', views.payment_fail, name='payment_fail'),
    path('payment/cancel/', views.payment_cancel, name='payment_cancel'),
    path('account/delete/', views.delete_account, name='delete_account'),
    path('admin/delete-user/', views.admin_delete_user, name='admin_delete_user'),
    path('admin/delete-server/', views.admin_delete_suspended_server, name='admin_delete_suspended_server'),
    path('profile/upload-image/', views.upload_profile_image, name='upload_profile_image'),
    path('admin/stats/', views.admin_get_stats, name='admin_get_stats'),
    path('admin/broadcast-message/', views.admin_broadcast_message, name='admin_broadcast_message'),
    path('chat/send/', views.send_chat_message, name='send_chat_message'),
    path('chat/list/', views.list_chat_messages, name='list_chat_messages'),
    path('chat/read/', views.mark_chat_read, name='mark_chat_read'),
    path('admin/chats/', views.admin_list_active_chats, name='admin_list_active_chats'),
    path('admin/update-markup/', views.admin_update_markup, name='admin_update_markup'),
    path('admin/deploy-for-user/', views.admin_deploy_for_user, name='admin_deploy_for_user'),
    path('admin/provision-network/', views.admin_provision_network, name='admin_provision_network'),
    path('admin/provision-storage/', views.admin_provision_storage, name='admin_provision_storage'),
    path('admin/broadcast/', views.admin_broadcast, name='admin_broadcast'),
    path('admin/tblinc-email/', views.admin_send_test_email, name='admin_send_test_email'),
    path('2fa/generate/', views.generate_2fa_otp, name='generate_2fa_otp'),
    path('2fa/enable/', views.enable_2fa, name='enable_2fa'),
    path('2fa/disable/', views.disable_2fa, name='disable_2fa'),
    # Infrastructure Protocols
    path('infrastructure/storage/', views.list_object_storages, name='list_object_storages'),
    path('infrastructure/networks/', views.list_private_networks, name='list_private_networks'),
    path('infrastructure/dns/', views.list_dns_zones, name='list_dns_zones'),
    path('infrastructure/dns/<str:zone_id>/records/', views.list_dns_records, name='list_dns_records'),
    path('infrastructure/firewalls/', views.list_firewalls, name='list_firewalls'),
    path('infrastructure/snapshots/', views.list_snapshots, name='list_snapshots'),
    path('infrastructure/load-balancers/', views.list_load_balancers, name='list_load_balancers'),
    path('admin/tblinc-email/', views.tblinc_email, name='tblinc_email'),
    path('admin/unapproved-users/', views.list_unapproved_users, name='list_unapproved_users'),
    path('admin/approve-user/', views.approve_user, name='approve_user'),
    path('admin/approve-link/<str:uidb64>/<str:token>/', views.approve_user_link, name='approve_user_link'),
]
