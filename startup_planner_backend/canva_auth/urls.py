from django.urls import path
from .views import CanvaCallbackAPIView, CanvaAuthAPIView, ContactUsAPIView, CheckAuthAPIView, AccountView, BillingView, SecurityView

app_name = 'canva_auth'

urlpatterns = [
    path('canva/auth/', CanvaAuthAPIView.as_view(), name='canva_auth'),
    path('canva/auth/callback/',
         CanvaCallbackAPIView.as_view(), name='canva_callback'),
    path('contact-us/', ContactUsAPIView.as_view(), name='contact_us'),
    path('check-auth/', CheckAuthAPIView.as_view(), name='check_auth'),
    path('account/', AccountView.as_view(), name='account'),
    path('billing/', BillingView.as_view(), name='billing'),
    path('security/', SecurityView.as_view(), name='security'),
]

