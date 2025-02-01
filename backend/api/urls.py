from django.urls import path
from . import views
from .views import SendOTPView, VerifyOTPView,reset_password,approve_user,verify_old_password

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('test/', views.testEndPoint, name='test'),
    path("send-otp/", SendOTPView.as_view(), name="send-otp"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path('reset-password/', reset_password, name="reset_password"),
    path('approve-user/', approve_user, name="approve-user"),
    path('verify-old-password/', verify_old_password, name="verify-old-password"),

  
]