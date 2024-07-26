from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import BillingInfo
from django.contrib.auth import get_user_model


User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):

    """
    Serializer for CustomUser model to handle user registration.
    """
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    remember_me = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = User
        fields = ['email', 'display_name', 'password',
                  'confirm_password', 'remember_me', 'canva_user_id']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        remember_me = validated_data.pop('remember_me', False)
        user = User.objects.create_user(**validated_data)

        if remember_me:
            self.context['request'].session.set_expiry(1209600)  # 2 weeks

        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    remember_me = serializers.BooleanField(required=False, default=False)


class AccountSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomUser model to handle account details.
    """
    class Meta:
        model = User
        fields = ['display_name', 'email', 'bio', 'avatar']


class BillingSerializer(serializers.ModelSerializer):
    """
    Serializer for BillingInfo model to handle billing details.
    Masks the card number during serialization.
    """
    card_number = serializers.CharField(write_only=True, required=True)
    card_expiry = serializers.CharField(write_only=True, required=True)
    card_cvc = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = BillingInfo
        fields = ['card_number', 'card_expiry', 'card_cvc', 'card_zip']

    def validate_card_expiry(self, value):
        """
        Validates the card expiry date to ensure it follows the MM/YY format and is in the future.
        """
        try:
            month, year = map(int, value.split('/'))
            if month < 1 or month > 12:
                raise serializers.ValidationError("Invalid expiry month.")
            from datetime import datetime
            now = datetime.now()
            if year < now.year % 100 or (year == now.year % 100 and month < now.month):
                raise serializers.ValidationError(
                    "Card expiry date is in the past.")
        except ValueError:
            raise serializers.ValidationError(
                "Card expiry must be in MM/YY format.")
        return value


class SecuritySerializer(serializers.Serializer):
    """
    Serializer to handle password change requests.
    """
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        """
        Ensure new_password and confirm_password match.
        """
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def validate_current_password(self, value):
        """
        Validates that the current password is correct.
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                "Current password is not correct.")
        return value
