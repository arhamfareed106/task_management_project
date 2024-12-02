from django.urls import path
from . import views

urlpatterns = [
    path('', views.calendar_view, name='calendar_view'),
    path('init/', views.google_calendar_init, name='google_calendar_init'),
    path('oauth2callback/', views.google_calendar_callback, name='google_calendar_callback'),
]
