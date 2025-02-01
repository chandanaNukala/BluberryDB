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
                

                # Send email to user with their new password
                from django.core.mail import send_mail
                from django.utils.html import format_html

                subject = "Your Account Has Been Approved – Action Required"

                html_message = format_html(
                    """
                    <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <p>Dear <strong>{username}</strong>,</p>

                        <p>We are pleased to inform you that your account has been successfully approved.</p>

                        <h3 style="color: #0056b3;">Temporary Login Credentials:</h3>
                        <ul>
                            <li><strong>Email:</strong> {email}</li>
                            <li><strong>Temporary Password:</strong> {password}</li>
                        </ul>

                        <p><strong>For security reasons, we strongly recommend that you log in and update your password immediately.</strong></p>
                        
                        <p>You can reset your password using the link below:</p>

                        <p style="text-align: center;">
                            <a href="http://localhost:3000/resetpassword" 
                            style="background-color: #0056b3; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
                            Reset Password
                            </a>
                        </p>

                        <h3>Steps to Update Your Password:</h3>
                        <ol>
                            <li>Click on the <strong>Reset Password</strong> link above.</li>
                            <li>Enter your email and the temporary password provided.</li>
                            <li>Set a new, strong password for your account.</li>
                            <li>Log in using your new password.</li>
                        </ol>

                     

                        <p>Best regards,<br>
                        <p>Support Team</p><br>
                        <em>Blueberry Breeding & Genomics Lab</em><br>
                        
                    </body>
                    </html>
                    """,
                    username=user.username,
                    email=user.email,
                    password=random_password
                )

                send_mail(
                    subject,
                    "",  # Plain text part (optional)
                    "no-reply@example.com",
                    [user.email],
                    html_message=html_message
                )




        self.message_user(request, "Selected users have been approved and notified.")

    approve_users.short_description = "Approve selected users and send email"
class ProfileAdmin(admin.ModelAdmin):
    list_editable=['verified']
    list_display=['user','full_name','verified']

admin.site.register(User,UserAdmin)
admin.site.register(Profile,ProfileAdmin)