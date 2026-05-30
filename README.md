# Job Board Backend API

A Ruby on Rails API-only backend for a job board platform where employers can create jobs and freelancers can apply to them.

For more information about Rails API-only applications:

https://guides.rubyonrails.org/api_app.html

## Features

- User registration and login
- JWT authentication
- Role-based authorization
- Employers can create, update, and delete jobs
- Freelancers can apply to jobs
- Employers can review applications
- Protected API routes
- Strong parameter security
- RESTful API architecture

---

# Tech Stack

- Ruby on Rails API
- SQLite
- JWT Authentication
- BCrypt

---

# Frontend Overview

The frontend is built with React and connects to the Rails API backend using Axios and React Query.

## Frontend Features

- React Router navigation
- User signup and login pages
- JWT token storage using `localStorage`
- Global authentication state with `AuthContext`
- Role-based navigation for employers and freelancers
- Protected frontend pages
- Job search by category and location
- Employers can create, edit, and manage jobs
- Freelancers can view and apply to jobs
- Freelancers can track their application status
- Employers can review applicants and update application status

---

# Frontend Tech Stack

- React
- React Router
- TanStack React Query
- Axios
- SweetAlert2
- CSS Modules / custom CSS
- React Icons

---

# Frontend Architecture

## Authentication Flow

1. User logs in from the frontend
2. Rails API returns a JWT token
3. Token is saved in `localStorage`
4. `AuthContext` stores the current user and token
5. Protected pages check authentication and user role
6. Axios sends the token in the `Authorization` header for protected API requests

## React Query

React Query is used for server state management.

It handles:

- Fetching jobs
- Fetching current user applications
- Fetching employer jobs
- Creating and updating jobs
- Updating application status
- Refreshing cached data with `invalidateQueries`

## Role-Based Pages

### Employer

- Create job
- Edit job
- View my jobs
- View applicants
- Accept or reject applications

### Freelancer

- Browse jobs
- Apply to jobs
- View my applications
- Track application status

---

# Database Relationships

## Users

- A user can be an employer or freelancer
- One user can create many jobs
- One user can create many job applications

## Jobs

- Each job belongs to one employer
- One job can have many job applications

## Job Applications

- Each application belongs to one job
- Each application belongs to one freelancer

---

# Authentication

The application uses JWT (JSON Web Token) authentication.

After login:

1. Backend generates a JWT token
2. Frontend stores the token
3. Token is sent in Authorization headers
4. Backend verifies token using `current_user`

Example header:

```http
Authorization: BEARER eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyfQ.3EleBAcTxacNSr5-r02iuKyBw-IQOtGIX6sDZxNrDOU
```

---

# Database ERD

The application uses a relational database structure with one-to-many relationships between users, jobs, and job applications.

![ERD Diagram](./images/erd.png)

# API Routes

## Authentication

| Method | Endpoint  | Description                |
| ------ | --------- | -------------------------- |
| POST   | `/signup` | Register user              |
| POST   | `/login`  | Login user                 |
| GET    | `/me`     | Get current logged-in user |

---

## Jobs

| Method | Endpoint    | Description       |
| ------ | ----------- | ----------------- |
| GET    | `/jobs`     | Get all jobs      |
| GET    | `/jobs/:id` | Get single job    |
| POST   | `/jobs`     | Create job        |
| PATCH  | `/jobs/:id` | Update job        |
| DELETE | `/jobs/:id` | Delete job        |
| GET    | `/my-jobs`  | Get employer jobs |

---

## Job Applications

| Method | Endpoint                         | Description                 |
| ------ | -------------------------------- | --------------------------- |
| POST   | `/jobs/:job_id/job_applications` | Apply to a job              |
| GET    | `/jobs/:job_id/job_applications` | View applications for a job |
| GET    | `/my-applications`               | Get freelancer applications |
| PATCH  | `/job_applications/:id`          | Update application status   |

---

# API Documentation

Base URL:

```text
http://localhost:3000
```

## Authentication

### Register User

```http
POST /signup
```

Request body:

```json
{
  "user": {
    "name": "Ali",
    "email": "ali@test.com",
    "phone_number": "07123456789",
    "password": "Password1!",
    "password_confirmation": "Password1!",
    "role": "freelancer"
  }
}
```

### Login User

```http
POST /login
```

Request body:

```json
{
  "email": "ali@test.com",
  "password": "Password1!"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "name": "Ali",
    "email": "ali@test.com",
    "role": "freelancer"
  },
  "token": "JWT_TOKEN"
}
```

### Current User

```http
GET /me
Authorization: Bearer JWT_TOKEN
```

---

## Jobs

### Get All Jobs

```http
GET /jobs
```

Optional filters:

```http
GET /jobs?category=frontend&location=london
```

### Get Single Job

```http
GET /jobs/:id
```

### Create Job

```http
POST /jobs
Authorization: Bearer JWT_TOKEN
```

Request body:

```json
{
  "job": {
    "title": "React Developer",
    "description": "Build a frontend application",
    "location": "London",
    "category": "Front-end Development",
    "budget": 1000
  }
}
```

### Update Job

```http
PATCH /jobs/:id
Authorization: Bearer JWT_TOKEN
```

### Delete Job

```http
DELETE /jobs/:id
Authorization: Bearer JWT_TOKEN
```

### My Jobs

```http
GET /my-jobs
Authorization: Bearer JWT_TOKEN
```

---

## Job Applications

### Apply To Job

```http
POST /jobs/:job_id/job_applications
Authorization: Bearer JWT_TOKEN
```

Request body:

```json
{
  "job_application": {
    "message": "I am interested in this role."
  }
}
```

### View Applications For A Job

```http
GET /jobs/:job_id/job_applications
Authorization: Bearer JWT_TOKEN
```

### My Applications

```http
GET /my-applications
Authorization: Bearer JWT_TOKEN
```

### Update Application Status

```http
PATCH /job_applications/:id
Authorization: Bearer JWT_TOKEN
```

Request body:

```json
{
  "job_application": {
    "status": "accepted"
  }
}
```

# Authorization Rules

## Employers

- Can create jobs
- Can update/delete their own jobs
- Can view applications for their jobs
- Can update application status

## Freelancers

- Can apply to jobs
- Can view their own applications

---

# Security

- Password hashing with BCrypt
- JWT authentication
- Strong parameters
- Protected routes
- Ownership authorization checks

# Clone Project

```bash
git clone https://github.com/fsmali/job-board.git
```

```bash
cd job-board
```

---

# Backend Setup

```bash
cd backend
```

Install gems:

```bash
bundle install
```

Create database:

```bash
rails db:create
rails db:migrate
```

Seed sample data:

```bash
rails db:seed
```

Start Rails server:

```bash
rails server
```

Backend runs on:

```text
http://localhost:3000
```

---

# Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React app:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

# Future Improvements

- PostgreSQL deployment
- Pagination
- Search optimization
- File uploads
- Email notifications
