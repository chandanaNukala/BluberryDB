from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.utils.timezone import now
from django.contrib.auth import get_user_model
# Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        user = self.create_user(email=email, username=username, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.date_joined = timezone.now() 
        user.save(using=self._db)
        return user
    
    # def get_by_natural_key(self, email):
    #     return self.get(email=email)
    def get_by_natural_key(self, identifier):
   
        try:
            return self.get(email=identifier)
        except self.model.DoesNotExist:
            return self.get(username=identifier)

# Custom User Model
class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)  # Required for authentication
    is_staff = models.BooleanField(default=False)  # Required for Django Admin
    date_joined = models.DateTimeField(default=now) 
    objects = UserManager()

    USERNAME_FIELD = 'email'  # Login using email
    REQUIRED_FIELDS = ['username']  # Username is required

    def __str__(self):
        return self.username

# Profile Model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=1000)
    bio = models.CharField(max_length=100)
    image = models.ImageField(upload_to="user_images", default="default.jpg")
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.full_name

# Signals to Create Profile on User Creation
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


# post_save.connect(create_user_profile,sender=User)
# post_save.connect(save_user_profile,sender=User)

User = get_user_model()

from django.db import models
from django.utils.timezone import now
from datetime import timedelta

class OTPVerification(models.Model):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)  # NEW FIELD

    def is_expired(self):
        return self.created_at + timedelta(minutes=5) < now()
