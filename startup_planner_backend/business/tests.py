from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Business

User = get_user_model()


class BusinessViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@test.com', password='password123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.business1 = Business.objects.create(
            user=self.user,
            name='Test Business 1',
            industry='Tech',
            description='Test description for Business 1',
            stage='Idea',
            funding_amount=100000,
            team_size=5,
        )

        self.business2 = Business.objects.create(
            user=self.user,
            name='Test Business 2',
            industry='Finance',
            description='Test description for Business 2',
            stage='MVP',
            funding_amount=500000,
            team_size=10,
        )

    def test_list_businesses(self):
        url = reverse('business:business-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Assuming you have created two businesses in setUp
        self.assertEqual(len(response.data), 2)

    def test_retrieve_business(self):
        url = reverse('business:business-detail', args=[self.business1.pk])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.business1.name)

    def test_create_business(self):
        url = reverse('business:business-list')
        data = {
            'name': 'New Test Business',
            'industry': 'Healthcare',
            'description': 'Test description for new business',
            'stage': 'Growth',
            'funding_amount': 200000,
            'team_size': 8,
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Business.objects.count(), 3)

    def test_update_business(self):
        url = reverse('business:business-detail', args=[self.business1.pk])
        data = {
            'name': 'Updated Business Name',
            'industry': 'Updated Industry',
            'description': 'Test description',
            'stage': 'Growth',
            'funding_amount': 200000,
            'team_size': 15
        }
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.business1.refresh_from_db()
        self.assertEqual(self.business1.name, 'Updated Business Name')

    def test_delete_business(self):
        url = reverse('business:business-detail', args=[self.business1.pk])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Business.objects.filter(
            pk=self.business1.pk).exists())

