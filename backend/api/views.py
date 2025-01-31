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


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset=User.objects.all()
    permission_classes=([AllowAny])
    serializer_class=RegisterSerializer

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