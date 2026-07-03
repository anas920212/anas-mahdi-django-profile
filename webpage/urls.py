from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.home, name='home'), 
    path('chat/', views.chat_response_view, name='chat_response'),
]

# This block allows Django to serve your CSS/JS/Images in production
if not settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)