from django.contrib.auth.models import User
from django.core.management import setup_environ
from task_management_project import settings

setup_environ(settings)

user = User.objects.get(username='admin')
user.set_password('admin123')
user.save()
