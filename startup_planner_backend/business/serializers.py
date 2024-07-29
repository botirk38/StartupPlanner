from decimal import Decimal
from rest_framework import serializers
from .models import Business, Competitor, CompetitorStrength, CompetitorWeakness


class BusinessSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Business
        fields = ['id', 'user', 'name', 'description', 'long_description', 'industry',
                  'stage', 'stage_description', 'funding_amount', 'team_size',
                  'founding_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CompetitorStrengthSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitorStrength
        fields = ['description']


class CompetitorWeaknessSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitorWeakness
        fields = ['description']


class CompetitorSerializer(serializers.ModelSerializer):
    strengths = CompetitorStrengthSerializer(many=True)
    weaknesses = CompetitorWeaknessSerializer(many=True)
    market_share = serializers.DecimalField(
        max_digits=5, decimal_places=2, max_value=100, min_value=0)
    business = serializers.PrimaryKeyRelatedField(
        queryset=Business.objects.all())

    class Meta:
        model = Competitor
        fields = ['business', 'name', 'industry', 'product', 'market_share', 'strengths',
                  'weaknesses', 'website', 'customer_reviews', 'growth_trend', 'id']

    def create(self, validated_data):
        strengths_data = validated_data.pop('strengths')
        weaknesses_data = validated_data.pop('weaknesses')

        validated_data['market_share'] = Decimal(
            str(validated_data['market_share']))

        competitor = Competitor.objects.create(**validated_data)

        for strength_data in strengths_data:
            CompetitorStrength.objects.create(
                competitor=competitor, **strength_data)
        for weakness_data in weaknesses_data:
            CompetitorWeakness.objects.create(
                competitor=competitor, **weakness_data)

        return competitor
