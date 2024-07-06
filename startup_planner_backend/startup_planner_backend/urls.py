from django.urls import path
from canva_auth.views import canva_auth, canva_callback, contact_us, check_auth

urlpatterns = [
    path('api/canva/auth/', canva_auth, name='canva-auth'),
    path('api/canva/auth/callback/', canva_callback, name='canva-callback'),
    path('api/contact-us/', contact_us, name='contact-us'),
    path('api/check-auth/', check_auth, name='check-auth'),
]

