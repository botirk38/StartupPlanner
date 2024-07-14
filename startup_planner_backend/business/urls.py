from django.urls import path
from .views import BusinessListCreateView, BusinessRetrieveUpdateDestroyView

app_name = "business"

urlpatterns = [
    path('businesses/', BusinessListCreateView.as_view(), name="business-list"),
    path('businesses/<int:pk>/',
         BusinessRetrieveUpdateDestroyView.as_view(), name="business-detail"),
]
