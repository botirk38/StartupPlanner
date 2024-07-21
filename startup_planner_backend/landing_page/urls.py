from django.urls import path
from .views import ContactUsAPIView

app_name = 'landing_page'

urlpatterns = [
    path('contact-us/', ContactUsAPIView.as_view(), name='contact_us')
]

