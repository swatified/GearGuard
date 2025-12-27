# MERN Stack - GearGuard Maintenance Tracker
## Complete Folder Structure

```
gear-guard-mern/
│
├── backend/                          # Node.js + Express Backend
│   ├── config/
│   │   ├── database.js              # MongoDB connection configuration
│   │   ├── env.js                   # Environment variables validation
│   │   └── cloudinary.js            # Cloudinary config (if using file uploads)
│   │
│   ├── controllers/                  # Route controllers (business logic)
│   │   ├── maintenanceTeam.controller.js
│   │   ├── equipment.controller.js
│   │   ├── maintenanceRequest.controller.js
│   │   ├── maintenanceStage.controller.js
│   │   ├── user.controller.js
│   │   └── auth.controller.js
│   │
│   ├── models/                       # MongoDB Mongoose models
│   │   ├── MaintenanceTeam.js
│   │   ├── Equipment.js
│   │   ├── MaintenanceRequest.js
│   │   ├── MaintenanceStage.js
│   │   ├── User.js
│   │   └── index.js                 # Export all models
│   │
│   ├── routes/                       # Express routes
│   │   ├── api/
│   │   │   ├── maintenanceTeam.routes.js
│   │   │   ├── equipment.routes.js
│   │   │   ├── maintenanceRequest.routes.js
│   │   │   ├── maintenanceStage.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── auth.routes.js
│   │   └── index.js                 # Combine all routes
│   │
│   ├── middleware/                   # Custom middleware
│   │   ├── auth.middleware.js       # JWT authentication
│   │   ├── errorHandler.middleware.js
│   │   ├── validate.middleware.js   # Request validation
│   │   └── upload.middleware.js     # File upload handling
│   │
│   ├── utils/                        # Utility functions
│   │   ├── logger.js                # Winston or similar logging
│   │   ├── emailService.js          # Email notifications
│   │   ├── generateToken.js         # JWT token generation
│   │   ├── constants.js             # App constants
│   │   └── helpers.js               # General helper functions
│   │
│   ├── validations/                  # Validation schemas (Joi/Yup)
│   │   ├── maintenanceTeam.validation.js
│   │   ├── equipment.validation.js
│   │   ├── maintenanceRequest.validation.js
│   │   └── user.validation.js
│   │
│   ├── services/                     # Business logic services (optional layer)
│   │   ├── maintenanceTeam.service.js
│   │   ├── equipment.service.js
│   │   ├── maintenanceRequest.service.js
│   │   └── notification.service.js
│   │
│   ├── tests/                        # Backend tests
│   │   ├── unit/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   └── services/
│   │   ├── integration/
│   │   │   └── api/
│   │   └── fixtures/                 # Test data
│   │
│   ├── uploads/                      # File uploads directory (gitignored)
│   │   ├── equipment-images/
│   │   └── request-attachments/
│   │
│   ├── .env                          # Environment variables (gitignored)
│   ├── .env.example                  # Example environment file
│   ├── .gitignore
│   ├── server.js                     # Main entry point
│   ├── package.json
│   └── README.md
│
├── frontend/                         # React Frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   │
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.jsx
│   │   │   │   │   ├── Button.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── Input/
│   │   │   │   │   ├── Input.jsx
│   │   │   │   │   ├── Input.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── Modal/
│   │   │   │   ├── Card/
│   │   │   │   ├── Loading/
│   │   │   │   ├── ErrorMessage/
│   │   │   │   └── Table/
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Header/
│   │   │   │   │   ├── Header.jsx
│   │   │   │   │   ├── Header.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── Sidebar/
│   │   │   │   ├── Footer/
│   │   │   │   └── Layout.jsx
│   │   │   │
│   │   │   ├── equipment/
│   │   │   │   ├── EquipmentCard/
│   │   │   │   ├── EquipmentForm/
│   │   │   │   ├── EquipmentList/
│   │   │   │   ├── EquipmentDetail/
│   │   │   │   └── EquipmentKanban/
│   │   │   │
│   │   │   ├── maintenanceRequest/
│   │   │   │   ├── RequestCard/
│   │   │   │   ├── RequestForm/
│   │   │   │   ├── RequestKanban/
│   │   │   │   ├── RequestCalendar/
│   │   │   │   ├── RequestList/
│   │   │   │   └── RequestDetail/
│   │   │   │
│   │   │   ├── maintenanceTeam/
│   │   │   │   ├── TeamCard/
│   │   │   │   ├── TeamForm/
│   │   │   │   └── TeamList/
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── StatsCard/
│   │   │       ├── Chart/
│   │   │       └── RecentActivity/
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── Dashboard.module.css
│   │   │   ├── Equipment/
│   │   │   │   ├── EquipmentListPage.jsx
│   │   │   │   ├── EquipmentDetailPage.jsx
│   │   │   │   └── EquipmentFormPage.jsx
│   │   │   ├── MaintenanceRequest/
│   │   │   │   ├── RequestListPage.jsx
│   │   │   │   ├── RequestKanbanPage.jsx
│   │   │   │   ├── RequestCalendarPage.jsx
│   │   │   │   ├── RequestDetailPage.jsx
│   │   │   │   └── RequestFormPage.jsx
│   │   │   ├── MaintenanceTeam/
│   │   │   │   ├── TeamListPage.jsx
│   │   │   │   └── TeamFormPage.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── Profile/
│   │   │   │   └── Profile.jsx
│   │   │   └── NotFound/
│   │   │       └── NotFound.jsx
│   │   │
│   │   ├── context/                  # React Context API
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── AppContext.jsx
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useEquipment.js
│   │   │   ├── useMaintenanceRequest.js
│   │   │   ├── useMaintenanceTeam.js
│   │   │   ├── useLocalStorage.js
│   │   │   └── useDebounce.js
│   │   │
│   │   ├── services/                 # API service layer
│   │   │   ├── api.js               # Axios instance configuration
│   │   │   ├── auth.service.js
│   │   │   ├── equipment.service.js
│   │   │   ├── maintenanceRequest.service.js
│   │   │   ├── maintenanceTeam.service.js
│   │   │   └── user.service.js
│   │   │
│   │   ├── store/                    # Redux store (if using Redux)
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── equipmentSlice.js
│   │   │   │   ├── requestSlice.js
│   │   │   │   └── teamSlice.js
│   │   │   ├── store.js
│   │   │   └── rootReducer.js
│   │   │
│   │   ├── utils/                    # Utility functions
│   │   │   ├── constants.js
│   │   │   ├── formatters.js        # Date, currency formatters
│   │   │   ├── validators.js        # Form validation
│   │   │   ├── helpers.js
│   │   │   └── permissions.js       # Role-based access control
│   │   │
│   │   ├── styles/                   # Global styles
│   │   │   ├── globals.css
│   │   │   ├── variables.css        # CSS variables
│   │   │   └── themes.css
│   │   │
│   │   ├── assets/                   # Static assets
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── fonts/
│   │   │
│   │   ├── App.jsx                   # Main App component
│   │   ├── App.css
│   │   ├── index.js                  # React entry point
│   │   ├── index.css
│   │   └── routes.js                 # React Router routes
│   │
│   ├── .env                          # Frontend environment variables
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── shared/                           # Shared code (optional)
│   ├── constants/
│   │   └── appConstants.js
│   ├── types/                        # TypeScript types (if using TS)
│   │   ├── equipment.types.ts
│   │   ├── request.types.ts
│   │   └── user.types.ts
│   └── utils/
│       └── validationSchemas.js
│
├── docs/                             # Documentation
│   ├── api/
│   │   └── API_DOCUMENTATION.md
│   ├── deployment/
│   │   └── DEPLOYMENT.md
│   └── development/
│       └── SETUP.md
│
├── scripts/                          # Utility scripts
│   ├── seed.js                      # Database seeding
│   ├── backup.js                    # Database backup
│   └── deploy.sh                    # Deployment script
│
├── .gitignore                        # Root gitignore
├── README.md                         # Main project README
├── package.json                      # Root package.json (if using monorepo)
└── docker-compose.yml                # Docker compose for local development

```

---

## Detailed Component Breakdown

### Backend Structure Details

#### `backend/config/`
- Database connection configuration
- Environment variable management
- Third-party service configurations

#### `backend/controllers/`
- Handle HTTP requests and responses
- Call service layer (if exists) or directly interact with models
- Return JSON responses

#### `backend/models/`
- Mongoose schemas for MongoDB
- Define data structure, validation, and methods
- Relationships between collections

#### `backend/routes/`
- Define API endpoints
- Map routes to controller methods
- Apply middleware (auth, validation)

#### `backend/middleware/`
- Authentication middleware (JWT verification)
- Error handling
- Request validation
- File upload handling

---

### Frontend Structure Details

#### `frontend/src/components/`
- **common/**: Reusable UI components (Button, Input, Modal, etc.)
- **layout/**: Layout components (Header, Sidebar, Footer)
- **equipment/**: Equipment-specific components
- **maintenanceRequest/**: Request-specific components
- **maintenanceTeam/**: Team-specific components
- **dashboard/**: Dashboard-specific components

#### `frontend/src/pages/`
- Full page components that compose multiple components
- Route-level components
- Handle page-level logic and state

#### `frontend/src/context/`
- React Context for global state management
- Auth context for user authentication state
- Theme context for UI theming

#### `frontend/src/hooks/`
- Custom React hooks for reusable logic
- API data fetching hooks
- Utility hooks (localStorage, debounce)

#### `frontend/src/services/`
- API service layer using Axios
- Abstract HTTP calls from components
- Handle API errors and transformations

---

## Key Files Description

### Backend Key Files

| File | Purpose |
|------|---------|
| `server.js` | Main entry point, starts Express server |
| `config/database.js` | MongoDB connection setup |
| `models/*.js` | Mongoose schemas and models |
| `routes/api/*.routes.js` | API route definitions |
| `controllers/*.controller.js` | Business logic handlers |
| `middleware/auth.middleware.js` | JWT authentication middleware |

### Frontend Key Files

| File | Purpose |
|------|---------|
| `src/index.js` | React app entry point |
| `src/App.jsx` | Main app component with routing |
| `src/routes.js` | React Router route definitions |
| `src/services/api.js` | Axios instance configuration |
| `src/context/AuthContext.jsx` | Authentication state management |

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi or Yup
- **File Upload**: Multer
- **Environment**: dotenv
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React.js
- **Routing**: React Router DOM
- **State Management**: React Context API (or Redux Toolkit)
- **HTTP Client**: Axios
- **Styling**: CSS Modules (or Styled Components / Tailwind CSS)
- **Forms**: React Hook Form
- **Date Handling**: date-fns or Moment.js
- **Charts**: Recharts or Chart.js
- **Calendar**: FullCalendar or React Big Calendar
- **Drag & Drop**: react-beautiful-dnd (for Kanban)

---

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gearguard
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

---

## Recommended Naming Conventions

- **Components**: PascalCase (e.g., `EquipmentCard.jsx`)
- **Files/Folders**: camelCase or kebab-case (e.g., `equipment.controller.js` or `equipment-controller.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Functions/Variables**: camelCase (e.g., `getEquipmentList`)
- **CSS Classes**: kebab-case or camelCase (e.g., `equipment-card` or `equipmentCard`)

---

## Git Ignore Patterns

```gitignore
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
/build
/dist
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Uploads
backend/uploads/
```

