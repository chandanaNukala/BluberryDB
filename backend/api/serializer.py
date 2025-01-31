from api.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
    
        if hasattr(user, 'profile'):
            token['full_name'] = user.profile.full_name
            token['bio'] = user.profile.bio
            token['image'] = str(user.profile.image)
            token['verified'] = user.profile.verified
        
        token['username'] = user.username
        token['email'] = user.email
        return token


from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from api.models import User, OTPVerification

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    otp = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'otp')

    def validate(self, attrs):
        if 'otp' not in attrs:
            raise serializers.ValidationError({"otp": "OTP field is missing in the request."})

        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        try:
            otp_entry = OTPVerification.objects.get(email=attrs['email'])
            if not otp_entry.is_verified:
                raise serializers.ValidationError({"otp": "OTP not verified. Please verify first."})
        except OTPVerification.DoesNotExist:
            raise serializers.ValidationError({"otp": "OTP not found. Request a new one."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        OTPVerification.objects.filter(email=validated_data['email']).delete()

        return user
