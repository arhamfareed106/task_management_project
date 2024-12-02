from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.contrib import messages
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from .models import GoogleCalendarCredentials
from tasks.models import Task
import json
from datetime import datetime, timedelta

# Create your views here.

@login_required
def calendar_view(request):
    tasks = Task.objects.filter(created_by=request.user).order_by('start_date')
    events = []
    
    for task in tasks:
        events.append({
            'id': task.id,
            'title': task.title,
            'start': task.start_date.isoformat(),
            'end': task.due_date.isoformat(),
            'color': get_task_color(task.priority),
        })
    
    return render(request, 'calendar_integration/calendar.html', {
        'events_json': json.dumps(events),
    })

def get_task_color(priority):
    colors = {
        'LOW': '#4CAF50',
        'MEDIUM': '#FFC107',
        'HIGH': '#F44336',
    }
    return colors.get(priority, '#2196F3')

@login_required
def google_calendar_init(request):
    flow = Flow.from_client_config(
        settings.GOOGLE_API_CREDENTIALS,
        scopes=['https://www.googleapis.com/auth/calendar.events']
    )
    flow.redirect_uri = request.build_absolute_uri('/calendar/oauth2callback/')
    
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    
    request.session['google_auth_state'] = state
    return redirect(authorization_url)

@login_required
def google_calendar_callback(request):
    state = request.session.get('google_auth_state')
    
    flow = Flow.from_client_config(
        settings.GOOGLE_API_CREDENTIALS,
        scopes=['https://www.googleapis.com/auth/calendar.events'],
        state=state
    )
    flow.redirect_uri = request.build_absolute_uri('/calendar/oauth2callback/')
    
    authorization_response = request.build_absolute_uri()
    flow.fetch_token(authorization_response=authorization_response)
    
    credentials = flow.credentials
    GoogleCalendarCredentials.objects.update_or_create(
        user=request.user,
        defaults={
            'credentials': {
                'token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'token_uri': credentials.token_uri,
                'client_id': credentials.client_id,
                'client_secret': credentials.client_secret,
                'scopes': credentials.scopes,
            }
        }
    )
    
    messages.success(request, 'Successfully connected to Google Calendar!')
    return redirect('calendar_view')
