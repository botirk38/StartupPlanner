from django.urls import path

from .views import (
    CanvaCallbackAPIView, CanvaAuthAPIView,
    CheckAuthAPIView, AccountView,
    BillingView, SecurityView,
    LogoutAPIView, RegisterAPIView,
    LoginAPIView
)

app_name = 'canva_auth'

urlpatterns = [
    path('canva/', CanvaAuthAPIView.as_view(), name='canva_auth'),
    path('canva/callback/',
         CanvaCallbackAPIView.as_view(), name='canva_callback'),
    path('check-auth/', CheckAuthAPIView.as_view(), name='check_auth'),
    path('account/', AccountView.as_view(), name='account'),
    path('billing/', BillingView.as_view(), name='billing'),
    path('security/', SecurityView.as_view(), name='security'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login')

]
