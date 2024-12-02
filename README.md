# Task Management System

A comprehensive web application for managing tasks, tracking productivity, and collaborating with team members. Built with Django and modern web technologies.

## Features

### 1. Task Management
- Create, read, update, and delete tasks
- Priority levels (High, Medium, Low)
- Status tracking (Todo, In Progress, Completed)
- Task assignments and deadlines
- Parent-child task relationships
- Rich task descriptions

### 2. Calendar Integration
- Interactive calendar view of tasks
- Google Calendar synchronization
- Drag-and-drop task scheduling
- Color-coded task priorities
- Event details modal
- Quick task editing

### 3. Analytics Dashboard
- Real-time productivity metrics
- Task completion rate tracking
- Priority distribution analysis
- Status distribution visualization
- Weekly completion trends
- Average completion time metrics
- Overdue task monitoring
- Interactive charts and graphs

### 4. User Authentication
- Secure user registration and login
- OAuth2 authentication for Google Calendar
- Role-based access control
- Profile management
- Session handling

## Technology Stack

### Backend
- Django 4.2.7
- Django REST Framework
- Django Allauth
- Google Calendar API
- SQLite (Development)

### Frontend
- Tailwind CSS
- Chart.js
- FullCalendar.js
- Font Awesome
- Vanilla JavaScript

### Development Tools
- Python 3.13.0
- Node.js (for Tailwind)
- python-dotenv
- Virtual Environment (venv)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task_management
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
npm install              # For Tailwind CSS
```

4. Set up environment variables:
Create a .env file in the root directory with:
```
DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///db.sqlite3
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_PROJECT_ID=your_google_project_id
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. Collect static files:
```bash
python manage.py collectstatic
```

8. Run the development server:
```bash
python manage.py runserver
```

## Google Calendar Integration Setup

1. Go to Google Cloud Console
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: http://127.0.0.1:8000/calendar/oauth2callback/
   - Authorized JavaScript origins: http://127.0.0.1:8000
5. Copy credentials to .env file

## Project Structure

```
task_management/
├── analytics/                 # Analytics app
├── calendar_integration/      # Calendar integration app
├── tasks/                    # Main tasks app
├── templates/                # HTML templates
│   ├── analytics/           # Analytics templates
│   ├── calendar_integration/ # Calendar templates
│   └── tasks/               # Task templates
├── static/                   # Static files
│   ├── css/                 # CSS files
│   └── js/                  # JavaScript files
└── task_management_project/  # Project settings
```

## Key Features Implementation

### Task Analytics
- Productivity score calculation based on completion rate and timeliness
- Task distribution analysis across priorities and statuses
- Weekly trend analysis for task completion
- Average completion time calculations
- Overdue task monitoring

### Calendar Features
- Interactive calendar with FullCalendar.js
- Task event display with color coding
- Google Calendar synchronization
- Event modal with task details
- Quick navigation and view options

### User Interface
- Modern, responsive design
- Dark theme support
- Interactive charts and graphs
- Smooth animations and transitions
- Mobile-friendly layout

## Security Features

- Django's built-in security middleware
- CSRF protection
- Secure password hashing
- OAuth2 authentication
- Environment-based secret management
- Session security

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Django documentation
- Tailwind CSS team
- Chart.js community
- FullCalendar.js team
- Google Calendar API team

## Advanced Technical Documentation and Implementation Details

### Task Management

#### Advanced Task Hierarchy
- Parent-child task relationships
- Recursive task dependencies
- Automatic status propagation
- Bulk task operations
- Task templates and presets

#### Smart Task Assignment
- Workload balancing algorithm
- Skill-based auto-assignment
- Team capacity tracking
- Assignment notifications
- Delegation history

#### Dynamic Task Attributes
- Custom field definitions
- Computed fields
- Field validation rules
- Conditional formatting
- Multi-value attributes

### Calendar Integration

#### Google Calendar Sync
- Bi-directional synchronization
- Conflict resolution
- Batch updates
- Offline support
- Multi-calendar management

#### Advanced Calendar Features
- Resource scheduling
- Recurring task patterns
- Time zone handling
- Calendar overlays
- External calendar feeds

### Analytics Dashboard

#### Performance Metrics
- Velocity tracking
- Burndown charts
- Cycle time analysis
- Lead time tracking
- Throughput metrics

#### Predictive Analytics
- Task completion forecasting
- Resource utilization prediction
- Bottleneck detection
- Trend analysis
- Risk assessment

#### Custom Reporting
- Report builder interface
- Data export (CSV, Excel, PDF)
- Scheduled reports
- Dashboard customization
- Metric thresholds and alerts

### Technical Architecture

#### Backend Architecture
```
task_management/
├── core/
│   ├── middleware/           # Custom middleware
│   ├── decorators/          # Reusable decorators
│   ├── utils/               # Utility functions
│   └── mixins/              # Common mixins
├── tasks/
│   ├── models/              # Task-related models
│   ├── services/            # Business logic
│   ├── selectors/           # Database queries
│   └── handlers/            # Event handlers
├── analytics/
│   ├── aggregators/         # Data aggregation
│   ├── calculators/         # Metric calculations
│   ├── exporters/           # Report generation
│   └── visualizers/         # Chart data preparation
└── calendar_integration/
    ├── synchronizer/        # Calendar sync logic
    ├── converters/          # Event format conversion
    └── resolvers/           # Conflict resolution
```

#### Data Models
```python
class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(choices=TaskStatus.choices)
    priority = models.CharField(choices=Priority.choices)
    due_date = models.DateTimeField()
    created_by = models.ForeignKey(User, related_name='created_tasks')
    assigned_to = models.ForeignKey(User, related_name='assigned_tasks')
    parent = models.ForeignKey('self', null=True, related_name='subtasks')
    
    class Meta:
        indexes = [
            models.Index(fields=['status', 'priority']),
            models.Index(fields=['due_date']),
            models.Index(fields=['created_by', 'assigned_to'])
        ]
```

#### Key Components

##### Task Service Layer
```python
class TaskService:
    def create_task(self, data: dict) -> Task:
        # Validation and task creation logic
        
    def update_status(self, task_id: int, status: str) -> Task:
        # Status update with cascade effects
        
    def assign_task(self, task_id: int, user_id: int) -> Task:
        # Assignment with workload checking
```

##### Analytics Engine
```python
class AnalyticsCalculator:
    def calculate_productivity_score(self, user_id: int) -> float:
        # Complex productivity calculation
        
    def predict_completion_time(self, task_id: int) -> datetime:
        # ML-based completion prediction
```

##### Calendar Sync
```python
class CalendarSynchronizer:
    def sync_events(self, user_id: int):
        # Two-way sync with conflict resolution
        
    def handle_recurring_tasks(self, task: Task):
        # Recurring event pattern handling
```

## Performance Optimizations

### Database
- Optimized indexes for common queries
- Denormalized data for analytics
- Caching strategy with Redis
- Batch processing for bulk operations
- Query optimization with select_related/prefetch_related

### Caching
```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

CACHE_MIDDLEWARE_SECONDS = 300
```

### Asynchronous Processing
- Celery for background tasks
- Async views with Django 4.2
- WebSocket for real-time updates
- Message queue for event handling
- Scheduled task processing

## API Design

### RESTful Endpoints
```python
urlpatterns = [
    path('api/v1/tasks/', TaskViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('api/v1/analytics/', AnalyticsViewSet.as_view({'get': 'retrieve'})),
    path('api/v1/calendar/', CalendarViewSet.as_view({'get': 'list', 'post': 'sync'})),
]
```

### GraphQL Schema
```graphql
type Task {
    id: ID!
    title: String!
    status: TaskStatus!
    priority: Priority!
    subtasks: [Task!]
    analytics: TaskAnalytics!
}

type TaskAnalytics {
    completionRate: Float!
    estimatedTime: Int!
    riskScore: Float!
}
```

## Testing Strategy

### Unit Tests
```python
class TaskServiceTests(TestCase):
    def test_create_task_with_subtasks(self):
        # Test task creation with hierarchy
        
    def test_status_propagation(self):
        # Test status updates in task tree
```

### Integration Tests
```python
class CalendarSyncTests(TestCase):
    def test_two_way_sync(self):
        # Test calendar synchronization
        
    def test_conflict_resolution(self):
        # Test sync conflict handling
```

## Deployment

### Docker Configuration
```dockerfile
FROM python:3.13.0-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["gunicorn", "task_management.wsgi:application"]
```

### Kubernetes Setup
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: task-management
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: web
        image: task-management:latest
        ports:
        - containerPort: 8000
```

## Monitoring

### Prometheus Metrics
```python
from prometheus_client import Counter, Histogram

task_creation_counter = Counter('task_creation_total', 'Total tasks created')
task_completion_time = Histogram('task_completion_seconds', 'Time to complete tasks')
```

### Logging Configuration
```python
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/app.log',
            'maxBytes': 1024 * 1024 * 100,  # 100 MB
        }
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
}
```

## Contributing

### Development Setup
1. Install development dependencies:
```bash
pip install -r requirements-dev.txt
pre-commit install
```

2. Run tests with coverage:
```bash
pytest --cov=task_management tests/
```

3. Check code quality:
```bash
flake8 task_management
black task_management
isort task_management
```

### CI/CD Pipeline
```yaml
name: CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          pip install -r requirements-dev.txt
          pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: |
          # Deployment steps
