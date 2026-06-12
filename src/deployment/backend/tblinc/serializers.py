from rest_framework import serializers
from .models import User, Server, Payment, Transaction, ManualPaymentRequest, Notification, SystemSetting

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'balance', 'phone_number', 'is_staff', 'is_superuser', 'is_active', 'date_joined', 'profile_image', 'two_factor_enabled']
        read_only_fields = ['id', 'date_joined']
        ref_name = 'TblincUser'

from djoser.serializers import UserCreateSerializer

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'password', 're_password', 'first_name', 'last_name', 'phone_number', 'address', 'country')

class ServerSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    class Meta:
        model = Server
        fields = ['id', 'name', 'user', 'user_email', 'contabo_id', 'ip_address', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

class PaymentSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    class Meta:
        model = Payment
        fields = ['id', 'user', 'user_email', 'amount_bdt', 'transaction_id', 'status', 'plan_id', 'created_at']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'amount', 'type', 'transaction_id', 'status', 'created_at']

class ManualPaymentRequestSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    class Meta:
        model = ManualPaymentRequest
        fields = ['id', 'user', 'user_email', 'amount', 'method', 'transaction_id', 'status', 'created_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'title', 'message', 'is_read', 'created_at']

class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = ['id', 'key', 'value', 'description']

# --- Administrative Serializers ---

class AdminUserDetailSerializer(serializers.ModelSerializer):
    servers_count = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'balance', 'phone_number', 'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login', 'profile_image', 'two_factor_enabled', 'servers_count', 'total_spent']

    def get_servers_count(self, obj):
        return obj.servers.count()

    def get_total_spent(self, obj):
        from django.db.models import Sum
        return obj.payments.filter(status='SUCCESS').aggregate(Sum('amount_bdt'))['amount_bdt__sum'] or 0.0

class AdminServerDetailSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    
    class Meta:
        model = Server
        fields = ['id', 'name', 'user', 'user_email', 'contabo_id', 'ip_address', 'status', 'created_at', 'vnc_ip', 'vnc_password']

class SystemHealthSerializer(serializers.Serializer):
    status = serializers.CharField()
    database_latency = serializers.FloatField()
    active_users = serializers.IntegerField()
    total_revenue = serializers.FloatField()
