from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from tasks.models import Task
import json
from django.db.models import F

@login_required
def analytics_dashboard(request):
    # Get user's tasks
    user_tasks = Task.objects.filter(created_by=request.user)
    
    # Task completion rate
    total_tasks = user_tasks.count()
    completed_tasks = user_tasks.filter(status='COMPLETED').count()
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    # Tasks by priority
    priority_distribution = user_tasks.values('priority').annotate(
        count=Count('id')
    ).order_by('priority')
    
    # Tasks by status
    status_distribution = user_tasks.values('status').annotate(
        count=Count('id')
    ).order_by('status')
    
    # Weekly task completion trend
    today = timezone.now()
    week_ago = today - timedelta(days=7)
    daily_completion = []
    
    for i in range(7):
        day = week_ago + timedelta(days=i)
        completed = user_tasks.filter(
            status='COMPLETED',
            updated_at__date=day.date()
        ).count()
        daily_completion.append({
            'date': day.strftime('%Y-%m-%d'),
            'completed': completed
        })
    
    # Overdue tasks
    overdue_tasks = user_tasks.filter(
        due_date__lt=timezone.now(),
        status__in=['TODO', 'IN_PROGRESS']
    ).count()
    
    # Average completion time
    completed_tasks_with_duration = user_tasks.filter(
        status='COMPLETED'
    ).exclude(
        updated_at__isnull=True
    )
    
    total_duration = timedelta()
    task_count = 0
    
    for task in completed_tasks_with_duration:
        duration = task.updated_at - task.created_at
        total_duration += duration
        task_count += 1
    
    avg_completion_time = total_duration / task_count if task_count > 0 else timedelta()
    
    # Productivity score (based on completion rate and timeliness)
    on_time_completed = user_tasks.filter(
        status='COMPLETED',
        due_date__gte=F('updated_at')
    ).count()
    
    productivity_score = (
        (completion_rate * 0.6) +  # 60% weight to completion rate
        ((on_time_completed / completed_tasks * 100 if completed_tasks > 0 else 0) * 0.4)  # 40% weight to timeliness
    )
    
    context = {
        'completion_rate': round(completion_rate, 1),
        'priority_distribution': list(priority_distribution),
        'status_distribution': list(status_distribution),
        'daily_completion': daily_completion,
        'overdue_tasks': overdue_tasks,
        'avg_completion_time': {
            'days': avg_completion_time.days,
            'hours': avg_completion_time.seconds // 3600,
            'minutes': (avg_completion_time.seconds % 3600) // 60,
        },
        'productivity_score': round(productivity_score, 1),
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
    }
    
    return render(request, 'analytics/dashboard.html', context)



