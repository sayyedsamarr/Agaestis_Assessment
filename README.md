# Employee Management System

A full-stack CRUD web application for managing employee records, built with **React + TypeScript** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Axios |
| **Backend** | Node.js, Express 5, Mongoose, CORS, dotenv |
| **Database** | MongoDB (Atlas or local) |
| **Tooling** | Nodemon, ESLint, npm |

---

## Project Structure

```text
Agaetis_Demo/
├── Backend/
│   ├── config/
│   │   └── db.js              # MongoDB database connection
│   ├── Models/
│   │   └── EmployeeDB.js      # Mongoose schema and model
│   ├── Routes/
│   │   └── EmployeesRoute.js  # RESTful CRUD routes (/employees)
│   ├── server.js              # Express server entry point
│   ├── package.json           # Backend scripts and dependencies
│   └── .env                   # Backend environment variables
└── frontend/
    ├── public/                # Static assets & icons
    ├── src/
    │   ├── App.tsx            # Main application component & state
    │   ├── App.css            # Styles and responsive layouts
    │   └── main.tsx           # React DOM mounting
    ├── index.html             # HTML template
    ├── vite.config.mjs        # Vite configuration
    ├── package.json           # Frontend dependencies
    └── .env                   # Frontend environment variables
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas connection string)

---

### 1. Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `Backend/.env`:
   ```env
   MONGODB_URL=your_mongodb_connection_string
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```

   The backend will be running at `http://localhost:3000`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:5173` (or the URL shown in your Vite terminal output).

---

## API Reference

Base URL: `http://localhost:3000/employees`

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/employees` | Retrieve all employee records | `200 OK` |
| `POST` | `/employees` | Create a new employee | `201 Created` |
| `PUT` | `/employees/:id` | Update an existing employee by ID | `200 OK` |
| `DELETE` | `/employees/:id` | Delete an employee by ID | `200 OK` |

### Employee Data Model

```json
{
  "_id": "67... (MongoDB ObjectId)",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "Frontend Developer",
  "created_at": "2026-10-16T12:00:00.000Z",
  "updated_at": "2026-10-16T12:00:00.000Z"
}
```

- **Validation Rules**:
  - `name`: String, required, trimmed.
  - `email`: String, required, unique, lowercase, trimmed.
  - `role`: String, required, trimmed.

---

## Features

- **Full CRUD Operations**: Create, read, update, and delete employees seamlessly.
- **Instant Search & Filter**: Real-time filtering across employee names, email addresses, and job roles.
- **Configurable Pagination**: Page navigation with selectable page sizes (5, 10, or 20 entries per page).
- **Responsive & Modern UI**: Clean styling with dynamic avatar initials, loading states, and inline alert feedback for success and error conditions.
- **Error Handling**: Handles duplicate emails (`409 Conflict`), invalid Object IDs (`400 Bad Request`), and missing fields gracefully.
