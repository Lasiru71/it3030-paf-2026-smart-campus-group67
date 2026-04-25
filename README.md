# IT3030 PAF 2026 – Smart Campus Operations Hub (Group 64)

##Description

This project is a Smart Campus Operations Hub developed for the IT3030 Programming Applications and Frameworks (PAF) module. The system is designed to streamline and manage university operations efficiently, including facility and resource bookings, incident management, and user notifications.

The application consists of a React-based frontend and a Spring Boot REST API backend integrated with a MongoDB database. It follows RESTful best practices and provides a user-friendly interface to ensure smooth interaction and efficient data handling.

---

#Features

* Manage campus facilities and resources (labs, rooms, equipment)
* Booking system with approval workflow and conflict checking
* Incident ticketing system with attachments and status updates
* Notification system for booking and ticket updates
* Role-based access control (User/Admin/Technician)
* OAuth 2.0 authentication (e.g., Google Sign-In)

---

#Technologies Used

* Frontend: React.js
* Backend: Spring Boot (Java)
* Database: MongoDB
* API: RESTful Web Services
* Authentication: OAuth 2.0
* Version Control: GitHub

---

##Team Members & Responsibilities

* Member 1: Facilities catalogue + resource management endpoints
  IT23605534

* Member 2: Booking workflow + conflict checking
  IT23837430

* Member 3: Incident tickets + attachments + technician updates
  IT23396036

* Member 4: Notifications + role management + OAuth integration improvements
  IT23556034

---

##Setup Instructions

#Backend (Spring Boot)

1. Navigate to backend folder: cd booking-management
2. Run the application: mvn spring-boot:run
3. Server will start on: http://localhost:8081

---

#Frontend (React)

1. Navigate to frontend folder:
   cd frontend
2. Install dependencies:
   npm install
3. Run the application:
   npm run dev
4. App will run on:
   http://localhost:5173



#Notes

* Ensure MongoDB is running locally before starting the backend
* Do not include node_modules or compiled files in the repository

---

## 📎 Repository Naming

it3030-paf-2026-smart-campus-group64
