from django.urls import path
from .views import BusinessListCreateView, BusinessRetrieveUpdateDestroyView, CompetitorListView, CompetitorDetailView

app_name = "business"

urlpatterns = [
    path('businesses/', BusinessListCreateView.as_view(),
         name='business-list-create'),
    path('businesses/<int:pk>/',
         BusinessRetrieveUpdateDestroyView.as_view(), name='business-detail'),
    path('competitors', CompetitorListView.as_view(), name='competitor-list'),
    path('competitors/<int:pk>/', CompetitorDetailView.as_view(),
         name='competitor-detail'),
]
