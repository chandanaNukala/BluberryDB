from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
from api.models import Profile,User
from api.serializer import UserSerializer,MyTokenObtainPairSerializer,RegisterSerializer

from rest_framework.decorators import api_view,permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics,status

from rest_framework.permissions import AllowAny,IsAuthenticated

from rest_framework.response import Response
from django.utils.html import format_html

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get("email")
        username = request.data.get("username")
        
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered. Please log in."}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken. Please choose another username."}, status=status.HTTP_400_BAD_REQUEST)
        
        response = super().create(request, *args, **kwargs)
        
        # Notify admin about new registration
        admin_emails = list(User.objects.filter(is_staff=True).values_list('email', flat=True))

        if admin_emails:
            subject = "🔔 New User Registration Pending Approval"

            html_message = format_html(
            """
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
                <p>Dear Admin,</p>

                <p>A new user has registered on the platform and requires approval.</p>

                <h3 style="color: #0056b3;">📌 User Details:</h3>
                <ul style="background: #f9f9f9; padding: 10px; border-radius: 5px;">
                    <li><strong>Email:</strong> {email}</li>
                </ul>

                <p>Please review and approve the account in the admin panel.</p>

                <p style="text-align: center;">
                    <a href="http://localhost:8000/admin" 
                       style="background-color: #0056b3; color: #fff; padding: 10px 15px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                       🔗 Approve User in Admin Panel
                    </a>
                </p>

            </body>
            </html>
            """,
                email=email
            )

            send_mail(
                subject,
                "",  # Plain text part (optional)
                "no-reply@example.com",
                admin_emails,
                html_message=html_message
            )


        return Response({"message": "Registration successful! Pending admin approval."}, status=status.HTTP_201_CREATED)


@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    if request.method=="GET":
        response= f"Hey {request.user} , this is GET response"
        return Response({'response':response}, status=status.HTTP_200_OK)
    elif request.method=="POST":
        text= request.POST.get("text")
        response=f"Hey {request.user} your text is {text}"
        return Response({'response':response}, status=status.HTTP_200_OK)
    return Response({'response':response}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = "Hello buddy"
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)


import random
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import OTPVerification

class SendOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists() and request.data.get("parmtext")=="register_password":
            return Response({"error": "User already exists. Please log in."}, status=status.HTTP_400_BAD_REQUEST)
        if request.data.get("parmtext") == "forgot_password" and not User.objects.filter(email=email).exists():
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
        # Generate a 6-digit OTP
        otp = str(random.randint(100000, 999999))

        # Save OTP in the database (replace if exists)
        otp_entry, created = OTPVerification.objects.update_or_create(email=email, defaults={"otp": otp})

        # Send OTP via email
        subject = "Your OTP Code"
        message = f"Your OTP is {otp}. It expires in 5 minutes."
        sender_email = "your_email@gmail.com"

        try:
            send_mail(subject, message, sender_email, [email])
            return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Failed to send OTP. Try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        user_otp = request.data.get("otp")

        try:
            otp_entry = OTPVerification.objects.get(email=email)
            

            if otp_entry.otp == user_otp:
                otp_entry.is_verified = True  # Mark OTP as verified
                otp_entry.save()
                return Response({"message": "OTP Verified"}, status=status.HTTP_200_OK)
            else:
                if otp_entry.is_expired():
                    otp_entry.delete()
                    return Response({"error": "OTP expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        except OTPVerification.DoesNotExist:
            return Response({"error": "OTP not found. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
        

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()  # ✅ Get the custom User model

@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    new_password = request.data.get('new_password')

    if not email or not new_password:
        return Response({"error": "Email and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)  # ✅ Use the correct user model
        user.password = make_password(new_password)  # Hash the password before saving
        user.save()

        return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    

from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_user(request):
    if not request.user.is_staff:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    email = request.data.get("email")
    try:
        user = User.objects.get(email=email, is_active=False)

        # Generate random password
        random_password = get_random_string(length=10)
        user.set_password(random_password)
        user.is_active = True
        user.save()

        # Send email to user with password
        subject = "Your Account is Approved"
        message = f"Your account has been approved. Your temporary password is: {random_password}\n Please log in and change your password."
        send_mail(subject, message, "no-reply@example.com", [email])

        return Response({"message": "User approved and password sent."}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"error": "User not found or already approved."}, status=status.HTTP_404_NOT_FOUND)
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['POST'])
def verify_old_password(request):
    print(request)
    email = request.data.get('email')
    old_password = request.data.get('oldPassword')
    if not email or not old_password:
        return Response({"error": "Email and old password are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        if user.check_password(old_password):
            return Response({"message": "Old password verified successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Incorrect old password."}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
