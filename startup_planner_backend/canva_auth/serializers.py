
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, BillingInfo


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['display_name', 'email', 'bio', 'avatar']


class BillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingInfo
        fields = ['card_number', 'card_expiry', 'card_cvc', 'card_zip']


class SecuritySerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                "Current password is not correct.")
        return value
