
# 🎓 TomCollege School Management System

A comprehensive **web-based school management system** for managing students, classes, and schedules with **role-based access control**.

---

### 🧑‍💻 Author
**Marjory D. Marquez**

### 🏷️ Project Information
- **Project Name:** TomCollege  
- **Version:** 1.0.0  
- **License:** MIT  

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Case Study](#-case-study)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎓 Overview

**TomCollege** is a full-stack school management system designed to streamline educational institution operations.  
The application provides a centralized platform for managing student records, class schedules, and academic information with secure **role-based access** for administrators, teachers, and students.

### 🧾 Description
The system addresses common challenges faced by educational institutions in managing student data, class schedules, and academic performance tracking.  
By replacing traditional paper-based methods with a **modern digital solution**, TomCollege enhances operational efficiency, improves data accuracy, and provides real-time access to critical information for all stakeholders.

### 🔑 Key Highlights
- 🔐 Secure **JWT-based authentication**
- 👥 **Role-based access control** (Admin, Teacher, Student)
- 📊 **Real-time dashboard** with statistics
- 🎯 Comprehensive **student management**
- 📚 **Class enrollment** and management
- 📅 **Weekly schedule** organization
- 🔍 **Advanced search and filtering**
- 📱 **Responsive design** for all devices

---

## ✨ Features

### 👩‍💼 For Administrators
-  Complete **user management** (create, read, update, delete)
-  **Student registration** and profile management
-  **Class creation** and assignment
-  **Schedule management** and conflict detection
-  **Enrollment management**
-  **System configuration** and settings
-  Dashboard with **comprehensive statistics**

### 👨‍🏫 For Teachers
-  View all **students** and their information
-  Access **class rosters**
-  View and **update assigned classes**
-  Check **class schedules**
-  Update **personal profile**

### 🎓 For Students
-  View **personal academic information**
-  Check **enrolled classes**
-  View **weekly class schedule**
-  Update **personal profile**
-  Track **GPA and enrollment status**

---

## 🛠️ Technologies Used

### 🖥️ Frontend
| Technology | Version | Purpose |
|-------------|----------|----------|
| Angular | 17+ | Frontend framework |
| TypeScript | 5.0+ | Programming language |
| RxJS | 7.8+ | Reactive programming |
| HTML5 | — | Structure |
| CSS3 | — | Styling |
| Angular CLI | 17+ | Project scaffolding and build tools |

### ⚙️ Backend
| Technology | Version | Purpose |
|-------------|----------|----------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.18+ | Web framework |
| MongoDB | 6+ | Database |
| Mongoose | 8+ | ODM for MongoDB |
| JWT | 9.0+ | Authentication |
| bcryptjs | 2.4+ | Password hashing |
| dotenv | 16.3+ | Environment management |
| CORS | 2.8+ | Cross-origin support |


### 🧰 Development Tools
- Visual Studio Code – Code editor  
- PowerShell – Command-line interface  
- Nodemon – Auto-restart development server  
- Angular CLI – Angular development tools  
- Git – Version control  

---

## 📁 Project Structure

```
TomCollege/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── server.js
│
├── frontend/
│ ├── src/
│ ├── assets/
│ ├── environments/
│ └── angular.json
│
├── .env
├── package.json
├── README.md
└── LICENSE
```


---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/TomCollege.git

# Navigate to project folder
cd TomCollege

# Install dependencies for both backend and frontend
cd backend && npm install
cd ../frontend && npm install


# Start backend server
cd backend
npm run dev

# Start Angular frontend
cd ../frontend
ng serve

Visit the app at:
👉 http://localhost:4200


📚 API Documentation

The API provides RESTful endpoints for managing users, students, classes, and schedules.
Authentication is handled via JWT tokens.

📖 Case Study

The TomCollege project demonstrates efficient data-driven management for schools, improving accessibility and transparency between staff, students, and administration.

🖼️ Screenshots

(Add your screenshots here)

🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the issues page
