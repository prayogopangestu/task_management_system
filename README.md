Task Management System

A full-stack task management application built with Go, TypeScript, and PostgreSQL.

Features

User registration and login

Create, edit, delete tasks

Task assignment and status tracking

REST API backend and web frontend

Database schema provided

Tech Stack

Backend: Go (primary language)

Database: PostgreSQL (SQL schema included)

Frontend: TypeScript (likely with a modern framework)

API Testing: Postman collection included

Folder Structure
/backend        → Go REST API  
/frontend       → TypeScript web app  
/db.sql         → Database schema and initial setup  
/task-management.postman_collection.json → API collection for Postman  
/screenshorts   → Screenshots of the application  


(Note: “screenshorts” appears to be a typo for “screenshots” — you may rename it.)

Getting Started
Prerequisites

Go installed (version 1.XX or higher)

Node.js + npm or yarn for frontend

PostgreSQL database

Setup Instructions

Create a PostgreSQL database.

Run the SQL script db.sql to set up tables and initial data.

In /backend, configure the database connection (e.g., via environment variables).

In /backend, run go run . (or build and run) to start the API server.

In /frontend, install dependencies with npm install or yarn install.

Run the frontend with npm start or yarn start.

Open the web app in your browser (usually http://localhost:3000).

Use the Postman collection file in task-management.postman_collection.json to test API endpoints.

Usage

Register a new user or log in with existing credentials.

Create tasks, set deadlines, assign to users.

Update task status (e.g., “To Do”, “In Progress”, “Done”).

Delete tasks when completed or no longer relevant.

Screenshots

You’ll find sample screenshots in the /screenshorts directory showing key views: task list, task detail, user profile, etc.
