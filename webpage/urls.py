from django.urls import path
from . import views

urlpatterns = [
    # Your existing portfolio home path...
    path('', views.home, name='home'), 
    
    # Add this exact line to wire the backend logic to your JavaScript gateway
    path('chat/', views.chat_response_view, name='chat_response'),
]