# muhammad-hammad-latif-mern-10pshine
# MERN Notes App

A full-stack **Notes Management Application** built with **React.js**, **Node.js**, and **MySQL**.  
It supports user authentication, CRUD operations for notes, structured logging, unit testing, and code-quality analysis with SonarQube.

---

##  Overview
This app allows users to create, edit, and delete personal notes securely.  
It includes user authentication, global exception handling, API logging, and frontend/backend testing.

---

## Tech Stack
- **Frontend:** React.js, React Router, React Quill  
- **Backend:** Node.js, Express.js, Sequelize ORM  
- **Database:** MySQL  
- **Auth:** JWT & bcrypt  
- **Logging:** Pino  
- **Testing:** Mocha + Chai (backend), Jest (frontend)  
- **Code Quality:** SonarQube  
- **Version Control:** Git  

---

##  Features
-  **User Authentication:** Sign up, login, logout, forgot password, reset password (JWT-based).  
-  **Notes Management:** Create, edit, delete, and search and sort notes and can akso organize notes with the help of folders.  
-  **User Profile Management:** can add avatar, bio, change username, and password.
-  **Logging:** Log requests, errors, and user activities using Pino.  
-  **Error Handling:** Centralized middleware for exceptions.  
-  **Testing:** Unit tests for core backend and frontend logic.  
-  **SonarQube:** Code quality and coverage tracking.  

---

## Project Structure
```
notes-app/
├── backend/
│   ├── src/ (controllers, models, routes, tests)
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/ (components, pages, context, services)
│   └── package.json
└── README.md
```

---

## Setup
```bash
# Clone repository
git clone https://github.com/M-Hammad02/muhammad-hammad-latif-mern-10pshine.git

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup
cd frontend
npm install
npm start
```

---

## Run Tests
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

---

## Branching Strategy
- `main` → Production  
- `development` → Integration  
- `feature/*` → Feature branches  

---

## SonarQube (optional)
Run locally
Access: [http://localhost:9000](http://localhost:9000)

---

## Quick Commands
```bash
# Start backend
npm run dev

# Start frontend
npm start

# Run all tests
npm test
```

---

## Credits
Built using MERN stack technologies.
