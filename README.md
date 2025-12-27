# GearGuard: The Ultimate Maintenance Tracker

A comprehensive maintenance management system that allows companies to track assets (machines, vehicles, computers) and manage maintenance requests efficiently. The system seamlessly connects Equipment (what is broken), Teams (who fix it), and Requests (the work to be done).

---

## 📋 Project Overview

GearGuard is a full-stack maintenance tracking application built with the MERN stack. It provides a complete solution for managing equipment maintenance workflows, from request creation to completion, with features including:

- **Equipment Management**: Track all company assets with detailed information
- **Maintenance Teams**: Organize technicians into specialized teams
- **Request Workflow**: Manage maintenance requests through Kanban board and calendar views
- **Automated Features**: Auto-fill team assignments, overdue detection, and smart equipment tracking
- **Reporting**: Analytics and reports for maintenance operations

---

## 👥 Team Members

### Swati Sharma
- **Email**: [25sharmswati@gmail.com](mailto:25sharmswati@gmail.com)
- **GitHub**: [@swatified](https://github.com/swatified)

### Sourav Upreti
- **Email**: [souravupreti9@gmail.com](mailto:souravupreti9@gmail.com)
- **GitHub**: [@souravupreti](https://github.com/souravupreti)

### Varun Bahuguna
- **Email**: [varunbahuguna26@gmail.com](mailto:varunbahuguna26@gmail.com)
- **GitHub**: [@varun858-tech](https://github.com/varun858-tech)

### Ansh Bhatt
- **Email**: [anshbhatt140@gmail.com](mailto:anshbhatt140@gmail.com)
- **GitHub**: [@ansh-logics](https://github.com/ansh-logics)

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
- **Postman/Insomnia** - API testing
- **VS Code** - IDE (recommended)

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

---

## 📚 Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API endpoint reference
- **[Database Structure](./gear_guard_database.dbml)** - Database schema and relationships
- **[Folder Structure](./MERN_Folder_Structure.md)** - Detailed project structure
- **[Requirements Compliance](./REQUIREMENTS_COMPLIANCE_CHECK.md)** - Project requirements analysis

---

## 🔑 Key Features

### Equipment Management
- Track equipment with serial numbers, purchase dates, and warranty information
- Assign equipment to departments and employees
- Associate maintenance teams and default technicians
- Smart button to view all related maintenance requests

### Maintenance Requests
- Create corrective (breakdown) or preventive (scheduled) requests
- Auto-fill maintenance team from equipment
- Kanban board with drag-and-drop workflow
- Calendar view for preventive maintenance
- Overdue detection and notifications

### Workflow Management
- Request stages: New → In Progress → Repaired → Scrap
- Assign technicians to requests
- Track duration and maintenance costs
- Automatic equipment deactivation on scrap

### Team Management
- Create specialized maintenance teams
- Assign team members (technicians)
- Filter requests by team

### Reports & Analytics
- Dashboard with key statistics
- Requests by team (pivot/graph reports)
- Requests by equipment
- Maintenance cost tracking

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control:
  - **User**: Create and view requests
  - **Technician**: View assigned requests, update status
  - **Manager**: Full access to teams and assignments
  - **Admin**: Complete system access

---

## 📝 API Endpoints Overview

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

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

---

## 🤝 Contributing

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**
   - Open a PR on GitHub
   - Request review from at least one team member
   - Address review comments

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Code Review Process

1. All PRs must be reviewed by at least one team member
2. Address all review comments before merging
3. Ensure all tests pass
4. Update documentation if needed

---

## 📋 Development Guidelines

### Code Style
- Use ESLint and Prettier for code formatting
- Follow JavaScript/React best practices
- Write meaningful variable and function names
- Add comments for complex logic

### Best Practices
- Write clean, maintainable code
- Follow DRY (Don't Repeat Yourself) principle
- Implement proper error handling
- Validate all user inputs
- Write unit tests for critical functions

### Communication
- Use GitHub Issues for bug reports and feature requests
- Use Pull Requests for code changes
- Communicate blockers early with the team
- Participate in code reviews actively

---

## 🐛 Known Issues

- [ ] Add known issues here as they are discovered

---

## 📅 Project Timeline

- **Planning Phase**: Completed ✅
- **Database Design**: Completed ✅
- **API Documentation**: Completed ✅
- **Development Phase**: In Progress 🚧
- **Testing Phase**: Pending ⏳
- **Deployment Phase**: Pending ⏳

---

## 📄 License

This project is part of a development assignment/competition. All rights reserved.

---

## 🙏 Acknowledgments

- Odoo X Adani for the project requirements
- Team members for collaboration and contributions
- Open-source community for amazing tools and libraries

---

## 📞 Contact & Support

For questions or support, please contact any team member:

- **Swati Sharma**: [25sharmswati@gmail.com](mailto:25sharmswati@gmail.com)
- **Sourav Upreti**: [souravupreti9@gmail.com](mailto:souravupreti9@gmail.com)
- **Varun Bahuguna**: [varunbahuguna26@gmail.com](mailto:varunbahuguna26@gmail.com)
- **Ansh Bhatt**: [anshbhatt140@gmail.com](mailto:anshbhatt140@gmail.com)

---

## 🔄 Version History

- **v1.0.0** (Current) - Initial project setup and documentation
  - Database schema design
  - API documentation
  - Project structure planning

---

**Last Updated**: January 2024

**Project Status**: 🚧 In Development

