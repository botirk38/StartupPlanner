from rest_framework import serializers
from .models import Business


class BusinessSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Business
        fields = ['id', 'user', 'name', 'description', 'long_description', 'industry',
                  'stage', 'stage_description', 'funding_amount', 'team_size',
                  'founding_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
