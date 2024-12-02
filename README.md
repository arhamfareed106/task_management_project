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
