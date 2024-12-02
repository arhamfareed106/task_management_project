from django import template

register = template.Library()

@register.filter(name='filter_status')
def filter_status(tasks, status):
    if status:
        return tasks.filter(status=status)
    return tasks
