# GearGuard: The Ultimate Maintenance Tracker

A comprehensive maintenance management system that allows companies to track assets (machines, vehicles, computers) and manage maintenance requests efficiently. The system seamlessly connects Equipment (what is broken), Teams (who fix it), and Requests (the work to be done).

---

## 📋 Project Overview

GearGuard is a full-stack maintenance tracking application built with the MERN stack. It provides a complete solution for managing equipment maintenance workflows, from request creation to completion, with features including:

### Key Features

#### _Equipment Management_
- Track equipment with serial numbers, purchase dates, and warranty information
- Assign equipment to departments and employees
- Associate maintenance teams and default technicians
- Smart button to view all related maintenance requests

#### _Maintenance Requests_
- Create corrective (breakdown) or preventive (scheduled) requests
- Auto-fill maintenance team from equipment
- Kanban board with drag-and-drop workflow
- Calendar view for preventive maintenance
- Overdue detection and notifications

#### _Workflow Management_
- Request stages: New → In Progress → Repaired → Scrap
- Assign technicians to requests
- Track duration and maintenance costs
- Automatic equipment deactivation on scrap

#### _🔐 Authentication & Authorization_

- JWT-based authentication
- Role-based access control:
  - **User**: Create and view requests
  - **Technician**: View assigned requests, update status
  - **Manager**: Full access to teams and assignments
  - **Admin**: Complete system access


#### _Team Management_
- Create specialized maintenance teams
- Assign team members (technicians)
- Filter requests by team

#### _Reports & Analytics_
- Dashboard with key statistics
- Requests by team (pivot/graph reports)
- Requests by equipment
- Maintenance cost tracking

---

## 📁 Project Structure

```
gear-guard-mern/
├── backend/                 # Node.js + Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── validations/        # Validation schemas
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utilities
│   └── public/             # Static assets
│
└── docs/                   # Project documentation
    ├── API_DOCUMENTATION.md
    ├── gear_guard_database.dbml
    └── MERN_Folder_Structure.md
```

For detailed folder structure, see [MERN_Folder_Structure.md](./MERN_Folder_Structure.md)

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `GET /api/equipment/:id/requests` - Get equipment requests

### Maintenance Requests
- `GET /api/maintenance-requests` - Get all requests
- `GET /api/maintenance-requests/:id` - Get request by ID
- `POST /api/maintenance-requests` - Create request
- `PUT /api/maintenance-requests/:id` - Update request
- `PATCH /api/maintenance-requests/:id/stage` - Update stage
- `PATCH /api/maintenance-requests/:id/assign` - Assign technician
- `PATCH /api/maintenance-requests/:id/complete` - Complete request
- `PATCH /api/maintenance-requests/:id/scrap` - Scrap request
- `GET /api/maintenance-requests/calendar` - Get calendar view

### Maintenance Teams
- `GET /api/maintenance-teams` - Get all teams
- `GET /api/maintenance-teams/:id` - Get team by ID
- `POST /api/maintenance-teams` - Create team
- `PUT /api/maintenance-teams/:id` - Update team
- `DELETE /api/maintenance-teams/:id` - Delete team

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/requests-by-team` - Requests by team report
- `GET /api/dashboard/requests-by-equipment` - Requests by equipment report

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---
## 🛠️ Technology Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **CSS Modules** - Component styling
- **React Context API / Redux** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication
- **Joi** - Validation

### Development Tools
- **Git** - Version control
- **Postman** - API testing
- **VS Code** - IDE

&nbsp;&nbsp;

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher) - [Install MongoDB](https://www.mongodb.com/try/download/community)
- **Git** - [Install Git](https://git-scm.com/downloads)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gear-guard-mern
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**

   **Backend** (create `backend/.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gearguard
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   ```

   **Frontend** (create `frontend/.env`):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   ```bash
   # On macOS/Linux
   mongod
   
   # Or if installed via Homebrew
   brew services start mongodb-community
   ```

6. **Run the Application**

   **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

&nbsp;&nbsp;

### 📚 Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API endpoint reference
- **[Database Structure](./gear_guard_database.dbml)** - Database schema and relationships
- **[Folder Structure](./MERN_Folder_Structure.md)** - Detailed project structure
- **[Requirements Compliance](./REQUIREMENTS_COMPLIANCE_CHECK.md)** - Project requirements analysis

&nbsp;&nbsp;

### 👥 Team Members

_Ansh Bhatt_: [@ansh-logics](https://github.com/ansh-logics)

_Sourav Upreti_: [@souravupreti](https://github.com/souravupreti)

_Swati Sharma_: [@swatified](https://github.com/swatified)

_Varun Bahuguna_: [@varun858-tech](https://github.com/varun858-tech)



&nbsp;

### 📄 License

This project is part of online round for Odoo x Adani University Hackathon '26. All rights reserved.

&nbsp;

### 🙏 Acknowledgments

- Odoo team for the project requirements
- Team members for collaboration and contributions
- Open-source community for amazing tools and libraries

