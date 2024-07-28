from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from django.shortcuts import get_object_or_404
from .serializers import BusinessSerializer, CompetitorSerializer
from .models import Business, Competitor
from .services.competitor_research_service import CompetitorResearchService

competitor_research_service = CompetitorResearchService()


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


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


class CompetitorListView(generics.ListCreateAPIView):
    serializer_class = CompetitorSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        business_id = self.request.query_params.get('businessId')
        if not business_id:
            return Competitor.objects.none()
        return Competitor.objects.filter(business_id=business_id, business__user=self.request.user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        business_id = request.data.get('id')
        if not business_id:
            return Response({'error': 'Business ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        business = get_object_or_404(
            Business, id=business_id, user=request.user)

        try:
            competitors = competitor_research_service.research_competitors(
                business)
            serializer = self.get_serializer(competitors, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @transaction.atomic
    def delete(self, request, *args, **kwargs):
        business_id = request.query_params.get('businessId')
        if not business_id:
            return Response({'error': 'businessId is required'}, status=status.HTTP_400_BAD_REQUEST)

        business = get_object_or_404(
            Business, id=business_id, user=request.user)
        deleted_count, _ = Competitor.objects.filter(
            business=business).delete()

        return Response({
            'message': f'Successfully deleted {deleted_count} competitors for business {business_id}',
            'deleted_count': deleted_count
        }, status=status.HTTP_200_OK)


class CompetitorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Competitor.objects.all()
    serializer_class = CompetitorSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        if obj.business.user != self.request.user:
            self.permission_denied(self.request)
        return obj

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
