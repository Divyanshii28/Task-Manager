# Task Manager 📋

A full-stack Task Manager web application built with Java Spring Boot and vanilla JavaScript.

## Tech Stack

- **Backend** — Java 17, Spring Boot 3, Spring Data JPA, Hibernate
- **Database** — MySQL 8
- **Frontend** — HTML5, CSS3, JavaScript (Vanilla)
- **Build Tool** — Maven

## Features

- ✅ Create, Read, Update, Delete tasks
- 🔄 Toggle task status (Pending / Completed)
- 🎯 Set priority levels (Low / Medium / High)
- 📅 Add due dates to tasks
- 🔍 Search tasks by title
- 🔎 Filter by status and priority
- 📊 Live stats (Total / Pending / Completed)

## REST API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/{id} | Get task by ID |
| POST | /api/tasks | Create new task |
| PUT | /api/tasks/{id} | Update task |
| PATCH | /api/tasks/{id}/status | Toggle status |
| DELETE | /api/tasks/{id} | Delete task |
| GET | /api/tasks/filter/status/{status} | Filter by status |
| GET | /api/tasks/filter/priority/{priority} | Filter by priority |
| GET | /api/tasks/search?keyword= | Search by title |

## Setup & Run

1. Clone the repository

   git clone https://github.com/YOURUSERNAME/task-manager.git

2. Create MySQL database

   CREATE DATABASE taskmanager;

3. Update application.properties with your MySQL password

4. Run the Spring Boot app from IntelliJ or:

   mvn spring-boot:run

5. Open browser and go to:

   http://localhost:8080/index.html

## Project Structure

    src/main/java/com/taskmanager/
    ├── controller/    → REST API endpoints
    ├── service/       → Business logic
    ├── repository/    → Database operations
    ├── model/         → Task entity
    └── exception/     → Error handling

## Author
Built as a Java Developer Internship project
