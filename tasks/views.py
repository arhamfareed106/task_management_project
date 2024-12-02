from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.core.paginator import Paginator
from .models import Task
from .forms import TaskForm

@login_required
def task_list(request):
    all_tasks = Task.objects.filter(created_by=request.user).order_by('-created_at')
    
    # Pre-filter tasks by status
    todo_tasks = all_tasks.filter(status='TODO')
    in_progress_tasks = all_tasks.filter(status='IN_PROGRESS')
    done_tasks = all_tasks.filter(status='COMPLETED')
    
    # Apply other filters
    priority = request.GET.get('priority')
    search = request.GET.get('search')
    
    if priority:
        todo_tasks = todo_tasks.filter(priority=priority)
        in_progress_tasks = in_progress_tasks.filter(priority=priority)
        done_tasks = done_tasks.filter(priority=priority)
    if search:
        todo_tasks = todo_tasks.filter(title__icontains=search)
        in_progress_tasks = in_progress_tasks.filter(title__icontains=search)
        done_tasks = done_tasks.filter(title__icontains=search)
    
    context = {
        'todo_tasks': todo_tasks,
        'in_progress_tasks': in_progress_tasks,
        'done_tasks': done_tasks,
    }
    
    return render(request, 'tasks/task_list.html', context)

@login_required
def task_create(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.created_by = request.user
            task.save()
            messages.success(request, 'Task created successfully!')
            return redirect('task_list')
    else:
        form = TaskForm()
    
    return render(request, 'tasks/task_form.html', {'form': form, 'title': 'Create Task'})

@login_required
def task_edit(request, pk):
    task = get_object_or_404(Task, pk=pk, created_by=request.user)
    
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            messages.success(request, 'Task updated successfully!')
            return redirect('task_list')
    else:
        form = TaskForm(instance=task)
    
    return render(request, 'tasks/task_form.html', {'form': form, 'title': 'Edit Task'})

@login_required
def task_delete(request, pk):
    task = get_object_or_404(Task, pk=pk, created_by=request.user)
    
    if request.method == 'POST':
        task.delete()
        messages.success(request, 'Task deleted successfully!')
        return redirect('task_list')
    
    return render(request, 'tasks/task_confirm_delete.html', {'task': task})

@login_required
def task_toggle_status(request, pk):
    if request.method == 'POST':
        task = get_object_or_404(Task, pk=pk, created_by=request.user)
        status_map = {
            'TODO': 'IN_PROGRESS',
            'IN_PROGRESS': 'COMPLETED',
            'COMPLETED': 'TODO'
        }
        task.status = status_map[task.status]
        task.save()
        return JsonResponse({'status': task.get_status_display()})
