from django.contrib import admin
from api.models import User,Profile
# Register your models here.

from django.contrib import admin
from django.contrib.auth import get_user_model

from django.core.mail import send_mail
from django.utils.crypto import get_random_string


User = get_user_model()
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff')
    actions = ['approve_users']

    def approve_users(self, request, queryset):
        """Admin action to approve selected users and send them a temporary password"""
        for user in queryset:
            if not user.is_active:
                # Generate a random temporary password
                random_password = get_random_string(length=10)
                user.set_password(random_password)
                user.is_active = True
                user.save()
                print("***")
                print(user.email)

                # Send email to user with their new password
                subject = "Your Account is Approved"
                message = f"Your account has been approved. Your temporary password is: {random_password}\n Please log in and change your password."
                send_mail(subject, message, "no-reply@example.com", [user.email])

        self.message_user(request, "Selected users have been approved and notified.")

    approve_users.short_description = "Approve selected users and send email"
class ProfileAdmin(admin.ModelAdmin):
    list_editable=['verified']
    list_display=['user','full_name','verified']

admin.site.register(User,UserAdmin)
admin.site.register(Profile,ProfileAdmin)