from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User, Server, Payment, Transaction, ManualPaymentRequest, Notification, SystemSetting

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('email',)

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ('email',)

# Customizing the Original Admin GUI
admin.site.site_header = "TBLINC Administration"
admin.site.site_title = "TBLINC Admin Portal"
admin.site.index_title = "Welcome to the TBLINC Management Command Center"

class BaseModelAdmin(admin.ModelAdmin):
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }

class ServerInline(admin.TabularInline):
    model = Server
    extra = 0
    fields = ('name', 'ip_address', 'status', 'created_at')
    readonly_fields = ('created_at',)

class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    fields = ('transaction_id', 'amount_bdt', 'status', 'created_at')
    readonly_fields = ('created_at',)

try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }
    inlines = [ServerInline, PaymentInline]
    list_display = ('email', 'balance', 'phone_number', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_active', 'date_joined')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('balance', 'phone_number', 'profile_image')}),
        ('Security', {'fields': ('two_factor_enabled', 'two_factor_secret')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password'),
        }),
    )
    search_fields = ('email', 'phone_number')
    ordering = ('email',)

@admin.register(Server)
class ServerAdmin(BaseModelAdmin):
    list_display = ('name', 'user', 'contabo_id', 'ip_address', 'status', 'created_at')
    search_fields = ('name', 'contabo_id', 'ip_address', 'user__email')
    list_filter = ('status', 'created_at')

@admin.register(Payment)
class PaymentAdmin(BaseModelAdmin):
    list_display = ('transaction_id', 'user', 'amount_bdt', 'status', 'created_at')
    search_fields = ('transaction_id', 'user__email')
    list_filter = ('status', 'created_at')

@admin.register(Transaction)
class TransactionAdmin(BaseModelAdmin):
    list_display = ('transaction_id', 'user', 'amount', 'type', 'status', 'created_at')
    search_fields = ('transaction_id', 'user__email')
    list_filter = ('type', 'status', 'created_at')

@admin.register(ManualPaymentRequest)
class ManualPaymentRequestAdmin(BaseModelAdmin):
    list_display = ('id', 'user', 'amount', 'method', 'status', 'created_at')
    search_fields = ('user__email', 'transaction_id')
    list_filter = ('status', 'method', 'created_at')
    actions = ['approve_requests', 'reject_requests']

    def approve_requests(self, request, queryset):
        for req in queryset.filter(status='PENDING'):
            req.status = 'APPROVED'
            req.save()
            user = req.user
            user.balance += req.amount
            user.save()
            Transaction.objects.create(user=user, amount=req.amount, type='DEPOSIT', status='SUCCESS')
        self.message_user(request, "Selected requests approved.")
    approve_requests.short_description = "Approve selected payment requests"

    def reject_requests(self, request, queryset):
        queryset.filter(status='PENDING').update(status='REJECTED')
        self.message_user(request, "Selected requests rejected.")
    reject_requests.short_description = "Reject selected payment requests"

@admin.register(Notification)
class NotificationAdmin(BaseModelAdmin):
    list_display = ('title', 'user', 'type', 'is_read', 'created_at')
    search_fields = ('title', 'user__email')
    list_filter = ('type', 'is_read', 'created_at')

@admin.register(SystemSetting)
class SystemSettingAdmin(BaseModelAdmin):
    list_display = ('key', 'value', 'description')
    search_fields = ('key',)


