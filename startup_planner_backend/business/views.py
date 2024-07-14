from rest_framework import generics
from .serializers import BusinessSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Business


class BusinessListCreateView(generics.ListCreateAPIView):
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Business.objects.filter(user=self.request.user)


class BusinessRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Business.objects.filter(user=self.request.user)
