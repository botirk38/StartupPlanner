from unittest.mock import patch, MagicMock
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from .services.competitor_research_service import CompetitorResearchService
from .models import Business, Competitor, CompetitorStrength, CompetitorWeakness
import unittest
from .serializers import BusinessSerializer, CompetitorSerializer, CompetitorStrengthSerializer, CompetitorWeaknessSerializer
from rest_framework.test import APIRequestFactory
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from decimal import Decimal
from datetime import date


User = get_user_model()


class BusinessModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@test.com', password='12345')
        self.business = Business.objects.create(
            user=self.user,
            name="Test Business",
            industry="Tech",
            description="A test business",
            stage=Business.Stage.MVP,
            funding_amount=1000000,
            team_size=5,
            founding_date=date(2020, 1, 1)
        )

    def test_business_creation(self):
        self.assertTrue(isinstance(self.business, Business))
        self.assertEqual(self.business.__str__(), self.business.name)

    def test_business_fields(self):
        self.assertEqual(self.business.user, self.user)
        self.assertEqual(self.business.name, "Test Business")
        self.assertEqual(self.business.industry, "Tech")
        self.assertEqual(self.business.description, "A test business")
        self.assertEqual(self.business.stage, Business.Stage.MVP)
        self.assertEqual(self.business.funding_amount, 1000000)
        self.assertEqual(self.business.team_size, 5)
        self.assertEqual(self.business.founding_date, date(2020, 1, 1))

    def test_business_ordering(self):
        new_business = Business.objects.create(
            user=self.user,
            name="New Business",
            industry="Finance",
            description="A new business",
            stage=Business.Stage.IDEA
        )
        businesses = Business.objects.all()
        self.assertEqual(businesses[0], new_business)
        self.assertEqual(businesses[1], self.business)


class CompetitorModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@test.com', password='12345')
        self.business = Business.objects.create(
            user=self.user,
            name="Test Business",
            industry="Tech",
            description="A test business",
            stage=Business.Stage.MVP
        )
        self.competitor = Competitor.objects.create(
            business=self.business,
            name="Test Competitor",
            industry="Tech",
            product="Software",
            market_share=10.5,
            website="https://example.com",
            customer_reviews=100,
            growth_trend=Competitor.GrowthTrend.INCREASING
        )

    def test_competitor_creation(self):
        self.assertTrue(isinstance(self.competitor, Competitor))
        self.assertEqual(self.competitor.__str__(), self.competitor.name)

    def test_competitor_fields(self):
        self.assertEqual(self.competitor.business, self.business)
        self.assertEqual(self.competitor.name, "Test Competitor")
        self.assertEqual(self.competitor.industry, "Tech")
        self.assertEqual(self.competitor.product, "Software")
        self.assertEqual(self.competitor.market_share, Decimal('10.5'))
        self.assertEqual(self.competitor.website, "https://example.com")
        self.assertEqual(self.competitor.customer_reviews, 100)
        self.assertEqual(self.competitor.growth_trend,
                         Competitor.GrowthTrend.INCREASING)

    def test_market_share_validation(self):
        with self.assertRaises(ValidationError):
            invalid_competitor = Competitor(
                business=self.business,
                name="Invalid Competitor",
                industry="Tech",
                product="Software",
                market_share=101,  # Invalid: over 100
                website="https://example.com",
                growth_trend=Competitor.GrowthTrend.STEADY
            )
            invalid_competitor.full_clean()

    def test_unique_together_constraint(self):
        with self.assertRaises(ValidationError):
            duplicate_competitor = Competitor(
                business=self.business,
                name="Test Competitor",  # Duplicate name for the same business
                industry="Tech",
                product="Hardware",
                market_share=5,
                website="https://example2.com",
                growth_trend=Competitor.GrowthTrend.DECREASING
            )
            duplicate_competitor.full_clean()


class CompetitorStrengthWeaknessTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@test.com', password='12345')
        self.business = Business.objects.create(
            user=self.user,
            name="Test Business",
            industry="Tech",
            description="A test business",
            stage=Business.Stage.MVP
        )
        self.competitor = Competitor.objects.create(
            business=self.business,
            name="Test Competitor",
            industry="Tech",
            product="Software",
            market_share=10.5,
            website="https://example.com",
            customer_reviews=100,
            growth_trend=Competitor.GrowthTrend.INCREASING
        )

    def test_competitor_strength(self):
        strength = CompetitorStrength.objects.create(
            competitor=self.competitor,
            description="Strong brand recognition"
        )
        self.assertTrue(isinstance(strength, CompetitorStrength))
        self.assertEqual(
            str(strength), "Test Competitor - Strong brand recognition")

    def test_competitor_weakness(self):
        weakness = CompetitorWeakness.objects.create(
            competitor=self.competitor,
            description="Limited product range"
        )
        self.assertTrue(isinstance(weakness, CompetitorWeakness))
        self.assertEqual(
            str(weakness), "Test Competitor - Limited product range")

    def test_competitor_strengths_and_weaknesses_relationship(self):
        CompetitorStrength.objects.create(
            competitor=self.competitor, description="Strength 1")
        CompetitorStrength.objects.create(
            competitor=self.competitor, description="Strength 2")
        CompetitorWeakness.objects.create(
            competitor=self.competitor, description="Weakness 1")

        self.assertEqual(self.competitor.strengths.count(), 2)
        self.assertEqual(self.competitor.weaknesses.count(), 1)


class BusinessSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@test.com', password='12345')
        self.business_data = {
            'name': 'Test Business',
            'description': 'A test business',
            'long_description': 'A longer description of the test business',
            'industry': 'Tech',
            'stage': Business.Stage.MVP,
            'stage_description': 'Minimum Viable Product',
            'funding_amount': '1000000.00',
            'team_size': 5,
            'founding_date': '2020-01-01'

        }
        self.business = Business.objects.create(
            user=self.user, **self.business_data)
        self.serializer = BusinessSerializer()

    def test_contains_expected_fields(self):
        data = self.serializer.to_representation(self.business)
        self.assertCountEqual(data.keys(), ['id', 'name', 'description', 'long_description', 'industry',
                                            'stage', 'stage_description', 'funding_amount', 'team_size',
                                            'founding_date', 'created_at', 'updated_at'])

    def test_name_field_content(self):
        data = self.serializer.to_representation(self.business)
        self.assertEqual(data['name'], 'Test Business')

    def test_funding_amount_field_content(self):
        data = self.serializer.to_representation(self.business)
        self.assertEqual(data['funding_amount'], '1000000.00')

    def test_serializer_with_empty_data(self):
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = self.user
        serializer = BusinessSerializer(data={}, context={'request': request})
        self.assertFalse(serializer.is_valid())
        self.assertEqual(set(serializer.errors.keys()), set(
            ['name', 'description', 'industry', 'stage']))

    def test_serializer_with_valid_data(self):
        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = self.user
        serializer = BusinessSerializer(
            data=self.business_data, context={'request': request})
        self.assertTrue(serializer.is_valid())


class CompetitorSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@test.com', password='12345')
        self.business = Business.objects.create(
            user=self.user,
            name='Test Business',
            description='A test business',
            industry='Tech',
            stage=Business.Stage.MVP
        )
        self.competitor_data = {
            'business': self.business.id,
            'name': 'Test Competitor',
            'industry': 'Tech',
            'product': 'Software',
            'market_share': '10.50',
            'website': 'https://example.com',
            'customer_reviews': 100,
            'growth_trend': Competitor.GrowthTrend.INCREASING,
            'strengths': [{'description': 'Strong brand'}, {'description': 'Innovative products'}],
            'weaknesses': [{'description': 'High prices'}, {'description': 'Limited market reach'}]
        }

    def test_serializer_with_valid_data(self):
        serializer = CompetitorSerializer(data=self.competitor_data)
        self.assertTrue(serializer.is_valid())

    def test_create_competitor_with_strengths_and_weaknesses(self):
        serializer = CompetitorSerializer(data=self.competitor_data)
        self.assertTrue(serializer.is_valid())
        competitor = serializer.save()
        self.assertEqual(competitor.name, 'Test Competitor')
        self.assertEqual(competitor.strengths.count(), 2)
        self.assertEqual(competitor.weaknesses.count(), 2)

    def test_market_share_validation(self):
        invalid_data = self.competitor_data.copy()
        invalid_data['market_share'] = '101.00'  # Invalid: over 100
        serializer = CompetitorSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('market_share', serializer.errors)

    def test_serializer_with_empty_data(self):
        serializer = CompetitorSerializer(data={})
        self.assertFalse(serializer.is_valid())
        self.assertEqual(set(serializer.errors.keys()), set(
            ['business', 'name', 'industry', 'product', 'market_share', 'website', 'growth_trend', 'strengths', 'weaknesses']))


class CompetitorStrengthSerializerTest(TestCase):
    def test_serializer_with_valid_data(self):
        data = {'description': 'Strong brand recognition'}
        serializer = CompetitorStrengthSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, data)


class CompetitorWeaknessSerializerTest(TestCase):
    def test_serializer_with_valid_data(self):
        data = {'description': 'Limited product range'}
        serializer = CompetitorWeaknessSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, data)


class CompetitorResearchServiceTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@test.com', password='12345')

        self.business = Business.objects.create(
            user=self.user,
            name="Test Business",
            industry="Test Industry",
            description="Test Description"
        )
        self.service = CompetitorResearchService()

    def test_process_response(self):
        mock_messages = MagicMock()
        mock_message = MagicMock(
            role='assistant',
            content=[MagicMock(text=MagicMock(
                value='```json\n[{"name": "Competitor 1"}]\n```'))]
        )
        mock_messages.data = [mock_message]

        with patch.object(CompetitorResearchService, '_create_competitors') as mock_create:
            mock_create.return_value = [MagicMock()]
            result = self.service._process_response(
                mock_messages, self.business)

            mock_create.assert_called_once_with(
                [{"name": "Competitor 1"}], self.business)
            self.assertEqual(len(result), 1)

    def test_create_competitors(self):
        competitor_data = [
            {
                "name": "Competitor 1",
                "industry": "Test Industry",
                "product": "Test Product",
                "market_share": 10.5,
                "strengths": [{"description": "Strength 1"}],
                "weaknesses": [{"description": "Weakness 1"}],
                "website": "https://competitor1.com",
                "customer_reviews": 4,
                "growth_trend": "Increasing"
            }
        ]

        result = self.service._create_competitors(
            competitor_data, self.business)

        self.assertEqual(len(result), 1)
        self.assertIsInstance(result[0], Competitor)
        self.assertEqual(result[0].name, "Competitor 1")
        self.assertEqual(result[0].business, self.business)


class BusinessListCreateViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)

        self.business_data = {
            'name': 'Test Business',
            'description': 'A test business',
            'long_description': 'A longer description of the test business',
            'industry': 'Tech',
            'stage': Business.Stage.MVP,
            'stage_description': 'Minimum Viable Product',
            'funding_amount': '1000000.00',
            'team_size': 5,
            'founding_date': '2020-01-01'

        }
        self.business = Business.objects.create(
            user=self.user, **self.business_data)

    def test_list_businesses(self):
        url = reverse('business:business-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_business(self):
        url = reverse('business:business-list-create')
        new_business_data = {
            'name': 'New Business',
            'description': 'A new test business',
            'long_description': 'A longer description of the new test business',
            'industry': 'Finance',
            'stage': Business.Stage.IDEA,
            'stage_description': 'Idea Stage',
            'funding_amount': '500000.00',
            'team_size': 3,
            'founding_date': '2021-01-01'
        }
        response = self.client.post(url, new_business_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Business.objects.count(), 2)


class BusinessRetrieveUpdateDestroyViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
        self.business_data = {
            'name': 'Test Business',
            'description': 'A test business',
            'long_description': 'A longer description of the test business',
            'industry': 'Tech',
            'stage': Business.Stage.MVP,
            'stage_description': 'Minimum Viable Product',
            'funding_amount': '1000000.00',
            'team_size': 5,
            'founding_date': '2020-01-01'

        }
        self.business = Business.objects.create(
            user=self.user, **self.business_data)

    def test_retrieve_business(self):
        url = reverse('business:business-detail',
                      kwargs={'pk': self.business.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Business')

    def test_update_business(self):
        url = reverse('business:business-detail',
                      kwargs={'pk': self.business.pk})
        business_data = {
            'name': 'Updated Business',
            'description': 'A test business',
            'long_description': 'A longer description of the test business',
            'industry': 'Tech',
            'stage': Business.Stage.MVP,
            'stage_description': 'Minimum Viable Product',
            'funding_amount': '1000000.00',
            'team_size': 5,
            'founding_date': '2020-01-01'

        }

        response = self.client.put(url, business_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.business.refresh_from_db()
        self.assertEqual(self.business.name, 'Updated Business')

    def test_delete_business(self):
        url = reverse('business:business-detail',
                      kwargs={'pk': self.business.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Business.objects.count(), 0)


class CompetitorListViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)

        self.business_data = {
            'name': 'Test Business',
            'description': 'A test business',
            'long_description': 'A longer description of the test business',
            'industry': 'Tech',
            'stage': Business.Stage.MVP,
            'stage_description': 'Minimum Viable Product',
            'funding_amount': '1000000.00',
            'team_size': 5,
            'founding_date': '2020-01-01'

        }
        self.business = Business.objects.create(
            user=self.user, **self.business_data)

        self.competitor = Competitor.objects.create(
            business=self.business,
            name="Test Competitor",
            industry="Tech",
            product="Software",
            market_share=10.5,
            website="https://example.com",
            customer_reviews=100,
            growth_trend=Competitor.GrowthTrend.INCREASING
        )

    def test_list_competitors(self):
        url = reverse('business:competitor-list')
        response = self.client.get(url, {'businessId': self.business.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_delete_competitors(self):
        url = reverse('business:competitor-list')
        response = self.client.delete(url, {'businessId': self.business.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Competitor.objects.count(), 0)


class CompetitorDetailViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
        self.business_data = {
            'name': 'Test Business',
            'description': 'A test business',
            'long_description': 'A longer description of the test business',
            'industry': 'Tech',
            'stage': Business.Stage.MVP,
            'stage_description': 'Minimum Viable Product',
            'funding_amount': '1000000.00',
            'team_size': 5,
            'founding_date': '2020-01-01'

        }
        self.business = Business.objects.create(
            user=self.user, **self.business_data)

        self.competitor = Competitor.objects.create(
            business=self.business,
            name="Test Competitor",
            industry="Tech",
            product="Software",
            market_share=10.5,
            website="https://example.com",
            customer_reviews=100,
            growth_trend=Competitor.GrowthTrend.INCREASING
        )

    def test_retrieve_competitor(self):
        url = reverse('business:competitor-detail',
                      kwargs={'pk': self.competitor.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Competitor')


if __name__ == '__main__':
    unittest.main()
