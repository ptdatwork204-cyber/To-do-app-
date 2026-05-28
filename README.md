<<<<<<< HEAD
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

### Priority System
- LOW
- MEDIUM
- HIGH

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

```bash
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
│   ├── EmailService.java
│   └── ReminderScheduler.java
│
├── repository/
│   └── TodoRepository.java
│
├── model/
│   └── Todo.java
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

Examples:
- `TodoService`
- `ReminderScheduler`

---

## Repository Layer
Handles:
- SQL queries
- database communication
- CRUD operations

Example:
- `TodoRepository`

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

---

# Author

Developed by Me.
>>>>>>> master
