from django.urls import path
from . import views

app_name = 'webpage'

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('index/', views.index, name='index'),
    path('chat/', views.chat_response_view, name='chat'),
    path('contact/', views.contact_form_view, name='contact'),
]