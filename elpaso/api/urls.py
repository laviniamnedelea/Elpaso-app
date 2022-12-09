from django.urls import path
from . import views

urlpatterns = [
    path('login', views.log_in, name='login'),
    path('google_login', views.google_log_in, name='google_login'),
    path('register', views.register, name='register'),
    path('receipt', views.receipt, name='receipt'),
    path('capture', views.capture, name='capture'),
    path('general_dashboard', views.general_dashboard, name='general_dashboard'),
    path('dashboard', views.dashboard, name='dashboard'),
    path('', views.home, name='home'),
    
    
]
