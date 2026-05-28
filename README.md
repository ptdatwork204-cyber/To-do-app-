
# To-do-app-
Small personal to-do-app project
=======
# Fullstack Todo App

A fullstack Todo Management application built with:

- React + Tailwind CSS
- Spring Boot
- PostgreSQL
- JWT Authentication
- Email Reminder System
- Admin Dashboard
- Recurring Tasks

---

# Features

## Authentication
- User registration
- User login
- JWT authentication
- Protected routes
- Role-based authorization (USER / ADMIN)

---

## Todo Features

### Task Management
- Create tasks
- Delete tasks
- Complete tasks
- Update task status
- Update task priority inline

### Priority System
- LOW
- MEDIUM
- HIGH
- Inline priority change via dropdown

### Due Dates
- Set deadline for tasks
- Overdue detection

### Recurring Tasks
Supported recurring modes:
- NONE
- DAILY
- WEEKLY
- MONTHLY

When a recurring task is completed:
- a new task is automatically generated with the next due date

---

## Dark Mode
- Toggle between light and dark themes
- Persists user preference in localStorage
- Available in Login, Register, Settings, Todo, and Admin pages
- Accessible via sidebar and Settings page

---

## Activity Log (Admin)
Admin users can track all user activities:
- TASK_CREATED - When a new task is created
- TASK_COMPLETED - When a task is marked complete
- TASK_UNCOMPLETED - When a completed task is marked incomplete
- TASK_DELETED - When a task is deleted
- PRIORITY_CHANGED - When task priority is changed
- PROFILE_UPDATED - When user updates their display name
- USER_REGISTERED - When a new user registers

Activity log includes:
- Timestamp
- User email and display name
- Action type
- Task title (if applicable)
- Details

---

## Email Reminder System

Automatic email reminders are sent when:
- due date is approaching within 24 hours

Features:
- scheduled background job
- prevents duplicate reminder spam
- reminder tracking using `reminder_sent`

---

## Admin Dashboard

Admin users can:
- view all users' tasks
- monitor analytics
- see overdue tasks
- view priorities
- inspect completed/pending tasks
- view activity log

Dashboard statistics:
- Total tasks
- Completed tasks
- Pending tasks
- High priority tasks
- Overdue tasks

---

# Tech Stack

## Frontend
- React
- Tailwind CSS
- Axios
- React Router

## Backend
- Spring Boot
- Maven
- JWT

## Database
- PostgreSQL
- pgAdmin4

## Email Service
- Resend API

---

# Project Structure

```
todo/
│
├── src/main/java/com/dat/todo
│
├── controller/
│   ├── TodoController.java
│   ├── AuthController.java
│   └── AdminController.java
│
├── service/
│   ├── TodoService.java
│   ├── ActivityService.java
│   ├── EmailService.java
│   └── ReminderScheduler.java
│
├── repository/
│   ├── TodoRepository.java
│   └── ActivityRepository.java
│
├── model/
│   ├── Todo.java
│   └── Activity.java
│
├── util/
│   └── JwtUtil.java
│
└── resources/
    └── application.properties
```

---

# Architecture

The project follows a layered architecture.

## Controller Layer
Handles:
- HTTP requests
- API endpoints
- request/response processing

Examples:
- `TodoController`
- `AdminController`

---

## Service Layer
Handles:
- business logic
- recurring task logic
- analytics
- email reminder logic
- activity logging

Examples:
- `TodoService`
- `ActivityService`
- `ReminderScheduler`

---

## Repository Layer
Handles:
- SQL queries
- database communication
- CRUD operations

Example:
- `TodoRepository`
- `ActivityRepository`

---

# Database Tables

## users

```sql
id
email
password
display_name
role
```

## todos

```sql
id
title
completed
created_at
completed_at
deleted_at
priority
due_date
repeat_type
reminder_sent
user_id
```

## activities (NEW)

```sql
id
user_id
action
task_title
todo_id
details
timestamp
```

---

# API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

## Todos

```http
GET    /api/todos
POST   /api/todos
PUT    /api/todos/{id}
DELETE /api/todos/{id}
```

## User

```http
GET /api/todos/me
PUT /api/todos/me
```

## Admin

```http
GET /api/admin/todos
GET /api/admin/analytics
GET /api/admin/activities?limit=100
```

---

# JWT Authentication Flow

1. User logs in
2. Backend generates JWT token
3. Frontend stores token in localStorage
4. Every request sends:

```http
Authorization: Bearer <token>
```

5. Backend extracts userId from token

---

# Recurring Task Logic

When completing a recurring task:

```text
mark completed
↓
check repeat type
↓
generate next due date
↓
create new task automatically
```

Examples:
- DAILY → +1 day
- WEEKLY → +7 days
- MONTHLY → +1 month

---

# Reminder Scheduler Logic

Scheduler runs automatically every minute:

```java
@Scheduled(fixedRate = 60000)
```

Flow:

```text
find upcoming todos
↓
send reminder email
↓
mark reminder_sent = true
```

---

# Setup Instructions

## Backend

Run Spring Boot:

```bash
./mvnw spring-boot:run
```

or

```bash
mvn spring-boot:run
```

---

## Frontend

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

---

# Environment Variables

Example:

```properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=

jwt.secret=

resend.api.key=
```

---

# Changes Made

## Code Cleanup
- Removed console.log debugging statements from TodoPage.jsx
- Removed console.log from App.jsx

## Dark Mode Implementation
- Created ThemeContext.jsx for dark mode state management
- Updated tailwind.config.js to enable dark mode with 'class' strategy
- Updated all pages with dark mode classes:
  - Login.jsx
  - Register.jsx
  - Layout.jsx
  - TodoPage.jsx
  - AdminPage.jsx
  - Settings.jsx
- Added dark mode toggle in sidebar and Settings page
- Persists preference in localStorage

## Activity Log Implementation
- Created Activity.java model
- Created ActivityRepository.java for database operations
- Created ActivityService.java for business logic
- Modified TodoService.java to log activities on:
  - Task creation
  - Task completion/incompletion
  - Task deletion
  - Priority change
  - Profile update
  - User registration
- Added /api/admin/activities endpoint in AdminController
- Updated AdminPage.jsx with Activity Log tab showing:
  - Timestamp
  - User info
  - Action type with color coding
  - Task title
  - Details

---

# Future Improvements

Planned features:
- Task categories
- Search & filtering
- File attachments
- Real-time notifications
- Team collaboration
- Docker deployment
- CI/CD pipeline
- Redis caching
- Unit testing
- Refresh tokens
- Rate limiting
- Mobile responsive improvements
- Export activity logs to CSV
- Filter activity logs by date range
- Filter activity logs by user
- Notification preferences in settings

---

# Learning Goals

This project was built to practice:
- Fullstack development
- REST API design
- JWT authentication
- PostgreSQL integration
- Clean layered architecture
- Scheduled background jobs
- Email systems
- State management
- Real-world application structure
- Dark mode implementation
- Activity logging and audit trails

---

# Author

Developed by Me.
