# GearGuard Maintenance Tracker - API Documentation

## Base Information

- **Base URL**: `http://localhost:5000/api` (Development)
- **Production URL**: `https://api.gearguard.com/api`
- **API Version**: v1
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (JWT)

---

## Authentication

All protected endpoints require authentication via JWT token in the Authorization header.

```
Authorization: Bearer <token>
```

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [User Endpoints](#user-endpoints)
3. [Maintenance Team Endpoints](#maintenance-team-endpoints)
4. [Equipment Endpoints](#equipment-endpoints)
5. [Maintenance Request Endpoints](#maintenance-request-endpoints)
6. [Maintenance Stage Endpoints](#maintenance-stage-endpoints)
7. [Dashboard/Statistics Endpoints](#dashboard-statistics-endpoints)
8. [Error Handling](#error-handling)

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "role": "technician" // Optional: "user", "technician", "manager", "admin"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "technician"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Email already exists"
}
```

---

### 2. Login User

**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "technician"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid Credentials",
  "message": "Email or password is incorrect"
}
```

---

### 3. Get Current User

**GET** `/auth/me`

Get currently authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "technician",
    "maintenanceTeamIds": ["507f1f77bcf86cd799439012"]
  }
}
```

---

### 4. Refresh Token

**POST** `/auth/refresh`

Refresh JWT token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 5. Logout User

**POST** `/auth/logout`

Logout user (invalidates token on server-side if using token blacklist).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Endpoints

### 1. Get All Users

**GET** `/users`

Get list of all users (with pagination and filters).

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `role` (string): Filter by role (user, technician, manager, admin)
- `search` (string): Search by name or email
- `teamId` (string): Filter by maintenance team ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "technician",
        "maintenanceTeamIds": ["507f1f77bcf86cd799439012"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

---

### 2. Get User by ID

**GET** `/users/:id`

Get user details by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "technician",
    "maintenanceTeamIds": ["507f1f77bcf86cd799439012"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 3. Update User

**PUT** `/users/:id`

Update user information (admin or own profile).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "role": "manager"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe Updated",
    "email": "john.doe@example.com",
    "role": "manager",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## Maintenance Team Endpoints

### 1. Get All Teams

**GET** `/maintenance-teams`

Get list of all maintenance teams.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `active` (boolean): Filter by active status (default: true)
- `search` (string): Search by team name

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "Mechanics",
        "memberIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439013"],
        "members": [
          {
            "id": "507f1f77bcf86cd799439011",
            "name": "John Doe",
            "email": "john.doe@example.com"
          }
        ],
        "active": true,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### 2. Get Team by ID

**GET** `/maintenance-teams/:id`

Get team details by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Mechanics",
    "memberIds": ["507f1f77bcf86cd799439011"],
    "members": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john.doe@example.com"
      }
    ],
    "requestCount": 15,
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 3. Create Team

**POST** `/maintenance-teams`

Create a new maintenance team.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "IT Support",
  "memberIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439013"],
  "active": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "name": "IT Support",
    "memberIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439013"],
    "active": true,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 4. Update Team

**PUT** `/maintenance-teams/:id`

Update maintenance team.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "IT Support Updated",
  "memberIds": ["507f1f77bcf86cd799439011"],
  "active": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "name": "IT Support Updated",
    "memberIds": ["507f1f77bcf86cd799439011"],
    "active": true,
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

---

### 5. Delete Team

**DELETE** `/maintenance-teams/:id`

Delete maintenance team (soft delete by setting active=false).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

---

## Equipment Endpoints

### 1. Get All Equipment

**GET** `/equipment`

Get list of all equipment (with filters and pagination).

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `active` (boolean): Filter by active status (default: true)
- `departmentId` (string): Filter by department ID
- `employeeId` (string): Filter by assigned employee ID
- `teamId` (string): Filter by maintenance team ID
- `search` (string): Search by name or serial number

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "equipment": [
      {
        "id": "507f1f77bcf86cd799439020",
        "name": "CNC Machine 01",
        "serialNumber": "CNC-001-2024",
        "purchaseDate": "2024-01-01",
        "warrantyStartDate": "2024-01-01",
        "warrantyEndDate": "2025-01-01",
        "location": "Building A, Floor 2, Room 205",
        "departmentId": "507f1f77bcf86cd799439030",
        "department": {
          "id": "507f1f77bcf86cd799439030",
          "name": "Production"
        },
        "employeeId": "507f1f77bcf86cd799439031",
        "employee": {
          "id": "507f1f77bcf86cd799439031",
          "name": "Jane Smith"
        },
        "maintenanceTeamId": "507f1f77bcf86cd799439012",
        "maintenanceTeam": {
          "id": "507f1f77bcf86cd799439012",
          "name": "Mechanics"
        },
        "technicianId": "507f1f77bcf86cd799439011",
        "technician": {
          "id": "507f1f77bcf86cd799439011",
          "name": "John Doe"
        },
        "active": true,
        "requestCount": 5,
        "openRequestCount": 2,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

---

### 2. Get Equipment by ID

**GET** `/equipment/:id`

Get equipment details by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439020",
    "name": "CNC Machine 01",
    "serialNumber": "CNC-001-2024",
    "purchaseDate": "2024-01-01",
    "warrantyStartDate": "2024-01-01",
    "warrantyEndDate": "2025-01-01",
    "location": "Building A, Floor 2, Room 205",
    "departmentId": "507f1f77bcf86cd799439030",
    "department": {
      "id": "507f1f77bcf86cd799439030",
      "name": "Production"
    },
    "employeeId": "507f1f77bcf86cd799439031",
    "maintenanceTeamId": "507f1f77bcf86cd799439012",
    "technicianId": "507f1f77bcf86cd799439011",
    "active": true,
    "requestCount": 5,
    "openRequestCount": 2,
    "requests": [
      {
        "id": "507f1f77bcf86cd799439040",
        "name": "MR00001",
        "subject": "Leaking Oil",
        "state": "in_progress",
        "scheduledDate": "2024-01-20T10:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 3. Create Equipment

**POST** `/equipment`

Create new equipment.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Laptop Dell XPS 15",
  "serialNumber": "DLX-2024-001",
  "purchaseDate": "2024-01-10",
  "warrantyStartDate": "2024-01-10",
  "warrantyEndDate": "2027-01-10",
  "location": "IT Department, Floor 3",
  "departmentId": "507f1f77bcf86cd799439030",
  "employeeId": "507f1f77bcf86cd799439031",
  "maintenanceTeamId": "507f1f77bcf86cd799439014",
  "technicianId": "507f1f77bcf86cd799439011",
  "note": "Assigned to development team"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439021",
    "name": "Laptop Dell XPS 15",
    "serialNumber": "DLX-2024-001",
    "purchaseDate": "2024-01-10",
    "warrantyStartDate": "2024-01-10",
    "warrantyEndDate": "2027-01-10",
    "location": "IT Department, Floor 3",
    "maintenanceTeamId": "507f1f77bcf86cd799439014",
    "technicianId": "507f1f77bcf86cd799439011",
    "active": true,
    "requestCount": 0,
    "openRequestCount": 0,
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

### 4. Update Equipment

**PUT** `/equipment/:id`

Update equipment information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Laptop Dell XPS 15 Updated",
  "location": "IT Department, Floor 3, Room 301",
  "technicianId": "507f1f77bcf86cd799439013"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439021",
    "name": "Laptop Dell XPS 15 Updated",
    "location": "IT Department, Floor 3, Room 301",
    "technicianId": "507f1f77bcf86cd799439013",
    "updatedAt": "2024-01-15T12:30:00.000Z"
  }
}
```

---

### 5. Delete Equipment

**DELETE** `/equipment/:id`

Delete equipment (soft delete by setting active=false).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Equipment deleted successfully"
}
```

---

### 6. Get Equipment Requests

**GET** `/equipment/:id/requests`

Get all maintenance requests for a specific equipment (Smart Button functionality).

**Query Parameters:**
- `state` (string): Filter by state (new, in_progress, repaired, scrap)
- `requestType` (string): Filter by type (corrective, preventive)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "equipment": {
      "id": "507f1f77bcf86cd799439020",
      "name": "CNC Machine 01"
    },
    "requests": [
      {
        "id": "507f1f77bcf86cd799439040",
        "name": "MR00001",
        "subject": "Leaking Oil",
        "requestType": "corrective",
        "state": "in_progress",
        "scheduledDate": "2024-01-20T10:00:00.000Z",
        "technician": {
          "id": "507f1f77bcf86cd799439011",
          "name": "John Doe"
        },
        "createdAt": "2024-01-18T10:00:00.000Z"
      }
    ],
    "total": 5,
    "openCount": 2
  }
}
```

---

## Maintenance Request Endpoints

### 1. Get All Requests

**GET** `/maintenance-requests`

Get list of all maintenance requests (with filters and pagination).

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `state` (string): Filter by state (new, in_progress, repaired, scrap)
- `requestType` (string): Filter by type (corrective, preventive)
- `equipmentId` (string): Filter by equipment ID
- `teamId` (string): Filter by maintenance team ID
- `technicianId` (string): Filter by technician ID
- `isOverdue` (boolean): Filter overdue requests
- `scheduledDateFrom` (date): Filter by scheduled date from
- `scheduledDateTo` (date): Filter by scheduled date to
- `search` (string): Search by subject or request name

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "507f1f77bcf86cd799439040",
        "name": "MR00001",
        "subject": "Leaking Oil",
        "description": "Oil leak detected near the hydraulic system",
        "equipmentId": "507f1f77bcf86cd799439020",
        "equipment": {
          "id": "507f1f77bcf86cd799439020",
          "name": "CNC Machine 01",
          "serialNumber": "CNC-001-2024"
        },
        "maintenanceTeamId": "507f1f77bcf86cd799439012",
        "maintenanceTeam": {
          "id": "507f1f77bcf86cd799439012",
          "name": "Mechanics"
        },
        "technicianId": "507f1f77bcf86cd799439011",
        "technician": {
          "id": "507f1f77bcf86cd799439011",
          "name": "John Doe",
          "email": "john.doe@example.com"
        },
        "userId": "507f1f77bcf86cd799439032",
        "user": {
          "id": "507f1f77bcf86cd799439032",
          "name": "Jane Smith"
        },
        "requestType": "corrective",
        "priority": "2",
        "scheduledDate": "2024-01-20T10:00:00.000Z",
        "dateRequest": "2024-01-18T10:00:00.000Z",
        "dateStart": "2024-01-20T09:00:00.000Z",
        "dateEnd": null,
        "duration": 0,
        "maintenanceCost": 0,
        "stageId": "507f1f77bcf86cd799439050",
        "stage": {
          "id": "507f1f77bcf86cd799439050",
          "name": "In Progress",
          "sequence": 20
        },
        "state": "in_progress",
        "isOverdue": false,
        "createdAt": "2024-01-18T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

---

### 2. Get Request by ID

**GET** `/maintenance-requests/:id`

Get maintenance request details by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439040",
    "name": "MR00001",
    "subject": "Leaking Oil",
    "description": "Oil leak detected near the hydraulic system",
    "equipmentId": "507f1f77bcf86cd799439020",
    "equipment": {
      "id": "507f1f77bcf86cd799439020",
      "name": "CNC Machine 01",
      "serialNumber": "CNC-001-2024",
      "location": "Building A, Floor 2, Room 205"
    },
    "maintenanceTeamId": "507f1f77bcf86cd799439012",
    "maintenanceTeam": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Mechanics",
      "members": [
        {
          "id": "507f1f77bcf86cd799439011",
          "name": "John Doe"
        }
      ]
    },
    "technicianId": "507f1f77bcf86cd799439011",
    "technician": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "userId": "507f1f77bcf86cd799439032",
    "requestType": "corrective",
    "priority": "2",
    "scheduledDate": "2024-01-20T10:00:00.000Z",
    "dateRequest": "2024-01-18T10:00:00.000Z",
    "dateStart": "2024-01-20T09:00:00.000Z",
    "dateEnd": null,
    "duration": 0,
    "maintenanceCost": 0,
    "currencyId": "507f1f77bcf86cd799439060",
    "stageId": "507f1f77bcf86cd799439050",
    "stage": {
      "id": "507f1f77bcf86cd799439050",
      "name": "In Progress",
      "sequence": 20
    },
    "state": "in_progress",
    "isOverdue": false,
    "note": "Parts ordered, awaiting delivery",
    "createdAt": "2024-01-18T10:00:00.000Z",
    "updatedAt": "2024-01-20T09:00:00.000Z"
  }
}
```

---

### 3. Create Request

**POST** `/maintenance-requests`

Create a new maintenance request. Team is auto-filled from equipment.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subject": "Keyboard Not Working",
  "description": "Several keys on the keyboard are not responding",
  "equipmentId": "507f1f77bcf86cd799439021",
  "requestType": "corrective",
  "priority": "1",
  "scheduledDate": "2024-01-22T14:00:00.000Z",
  "note": "Need replacement keyboard"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439041",
    "name": "MR00002",
    "subject": "Keyboard Not Working",
    "description": "Several keys on the keyboard are not responding",
    "equipmentId": "507f1f77bcf86cd799439021",
    "equipment": {
      "id": "507f1f77bcf86cd799439021",
      "name": "Laptop Dell XPS 15"
    },
    "maintenanceTeamId": "507f1f77bcf86cd799439014",
    "maintenanceTeam": {
      "id": "507f1f77bcf86cd799439014",
      "name": "IT Support"
    },
    "technicianId": null,
    "userId": "507f1f77bcf86cd799439032",
    "requestType": "corrective",
    "priority": "1",
    "scheduledDate": "2024-01-22T14:00:00.000Z",
    "dateRequest": "2024-01-20T12:00:00.000Z",
    "dateStart": null,
    "dateEnd": null,
    "duration": 0,
    "maintenanceCost": 0,
    "stageId": "507f1f77bcf86cd799439048",
    "stage": {
      "id": "507f1f77bcf86cd799439048",
      "name": "New"
    },
    "state": "new",
    "isOverdue": false,
    "createdAt": "2024-01-20T12:00:00.000Z"
  }
}
```

**Note**: `maintenanceTeamId` is automatically set from the equipment's `maintenanceTeamId`.

---

### 4. Update Request

**PUT** `/maintenance-requests/:id`

Update maintenance request.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "subject": "Keyboard Not Working - Updated",
  "technicianId": "507f1f77bcf86cd799439011",
  "priority": "2",
  "duration": 2.5,
  "dateStart": "2024-01-22T14:00:00.000Z",
  "dateEnd": "2024-01-22T16:30:00.000Z",
  "maintenanceCost": 150.00,
  "note": "Keyboard replaced successfully"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439041",
    "subject": "Keyboard Not Working - Updated",
    "technicianId": "507f1f77bcf86cd799439011",
    "duration": 2.5,
    "dateEnd": "2024-01-22T16:30:00.000Z",
    "maintenanceCost": 150.00,
    "updatedAt": "2024-01-22T16:30:00.000Z"
  }
}
```

---

### 5. Update Request Stage

**PATCH** `/maintenance-requests/:id/stage`

Update request stage (for Kanban drag & drop).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "stageId": "507f1f77bcf86cd799439050"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439041",
    "stageId": "507f1f77bcf86cd799439050",
    "stage": {
      "id": "507f1f77bcf86cd799439050",
      "name": "In Progress"
    },
    "state": "in_progress",
    "updatedAt": "2024-01-22T14:00:00.000Z"
  }
}
```

**Note**: When stage is changed to "Scrap", equipment is automatically marked as inactive.

---

### 6. Assign Technician

**PATCH** `/maintenance-requests/:id/assign`

Assign technician to request (must be a member of the assigned team).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "technicianId": "507f1f77bcf86cd799439011"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439041",
    "technicianId": "507f1f77bcf86cd799439011",
    "technician": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe"
    },
    "updatedAt": "2024-01-22T14:00:00.000Z"
  }
}
```

---

### 7. Complete Request

**PATCH** `/maintenance-requests/:id/complete`

Mark request as completed (sets stage to "Repaired").

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "duration": 3.5,
  "dateEnd": "2024-01-22T17:30:00.000Z",
  "maintenanceCost": 200.00,
  "note": "Maintenance completed successfully"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439041",
    "stageId": "507f1f77bcf86cd799439049",
    "stage": {
      "id": "507f1f77bcf86cd799439049",
      "name": "Repaired"
    },
    "state": "repaired",
    "duration": 3.5,
    "dateEnd": "2024-01-22T17:30:00.000Z",
    "maintenanceCost": 200.00,
    "updatedAt": "2024-01-22T17:30:00.000Z"
  }
}
```

---

### 8. Scrap Request

**PATCH** `/maintenance-requests/:id/scrap`

Mark request as scrap (sets stage to "Scrap" and marks equipment as inactive).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "scrapReason": "Equipment beyond repair, replacement needed"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439041",
    "stageId": "507f1f77bcf86cd799439051",
    "stage": {
      "id": "507f1f77bcf86cd799439051",
      "name": "Scrap"
    },
    "state": "scrap",
    "equipment": {
      "id": "507f1f77bcf86cd799439021",
      "active": false,
      "scrapDate": "2024-01-22T18:00:00.000Z",
      "scrapReason": "Scrapped via request MR00002"
    },
    "updatedAt": "2024-01-22T18:00:00.000Z"
  }
}
```

---

### 9. Get Requests for Calendar

**GET** `/maintenance-requests/calendar`

Get preventive maintenance requests for calendar view.

**Query Parameters:**
- `startDate` (date): Start date for calendar (ISO format)
- `endDate` (date): End date for calendar (ISO format)
- `teamId` (string): Filter by team ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439042",
      "name": "MR00003",
      "subject": "Monthly Maintenance Check",
      "scheduledDate": "2024-01-25T10:00:00.000Z",
      "equipment": {
        "id": "507f1f77bcf86cd799439020",
        "name": "CNC Machine 01"
      },
      "maintenanceTeam": {
        "id": "507f1f77bcf86cd799439012",
        "name": "Mechanics"
      },
      "technician": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe"
      },
      "state": "new",
      "requestType": "preventive"
    }
  ]
}
```

---

### 10. Delete Request

**DELETE** `/maintenance-requests/:id`

Delete maintenance request (only allowed for draft/new requests).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Request deleted successfully"
}
```

---

## Maintenance Stage Endpoints

### 1. Get All Stages

**GET** `/maintenance-stages`

Get list of all maintenance stages.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439048",
      "name": "New",
      "sequence": 10,
      "fold": false,
      "isDone": false,
      "isScrap": false
    },
    {
      "id": "507f1f77bcf86cd799439050",
      "name": "In Progress",
      "sequence": 20,
      "fold": false,
      "isDone": false,
      "isScrap": false
    },
    {
      "id": "507f1f77bcf86cd799439049",
      "name": "Repaired",
      "sequence": 30,
      "fold": true,
      "isDone": true,
      "isScrap": false
    },
    {
      "id": "507f1f77bcf86cd799439051",
      "name": "Scrap",
      "sequence": 40,
      "fold": true,
      "isDone": false,
      "isScrap": true
    }
  ]
}
```

---

### 2. Get Stage by ID

**GET** `/maintenance-stages/:id`

Get stage details by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439050",
    "name": "In Progress",
    "sequence": 20,
    "fold": false,
    "isDone": false,
    "isScrap": false,
    "requestCount": 15
  }
}
```

---

### 3. Create Stage (Admin Only)

**POST** `/maintenance-stages`

Create a new maintenance stage.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "On Hold",
  "sequence": 25,
  "fold": false,
  "isDone": false,
  "isScrap": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439052",
    "name": "On Hold",
    "sequence": 25,
    "fold": false,
    "isDone": false,
    "isScrap": false
  }
}
```

---

## Dashboard/Statistics Endpoints

### 1. Get Dashboard Statistics

**GET** `/dashboard/stats`

Get overall statistics for dashboard.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalEquipment": 150,
    "activeEquipment": 145,
    "scrappedEquipment": 5,
    "totalRequests": 500,
    "openRequests": 25,
    "inProgressRequests": 15,
    "completedRequests": 450,
    "overdueRequests": 5,
    "totalMaintenanceCost": 50000.00,
    "averageRepairTime": 3.5,
    "requestsByType": {
      "corrective": 350,
      "preventive": 150
    },
    "requestsByTeam": [
      {
        "teamId": "507f1f77bcf86cd799439012",
        "teamName": "Mechanics",
        "requestCount": 200
      },
      {
        "teamId": "507f1f77bcf86cd799439014",
        "teamName": "IT Support",
        "requestCount": 150
      }
    ]
  }
}
```

---

### 2. Get Requests by Team (Pivot/Graph)

**GET** `/dashboard/requests-by-team`

Get request statistics grouped by team (for pivot/graph reports).

**Query Parameters:**
- `startDate` (date): Filter from date
- `endDate` (date): Filter to date

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "teamId": "507f1f77bcf86cd799439012",
      "teamName": "Mechanics",
      "totalRequests": 200,
      "correctiveRequests": 150,
      "preventiveRequests": 50,
      "completedRequests": 180,
      "pendingRequests": 20,
      "totalHours": 600,
      "totalCost": 25000.00
    },
    {
      "teamId": "507f1f77bcf86cd799439014",
      "teamName": "IT Support",
      "totalRequests": 150,
      "correctiveRequests": 100,
      "preventiveRequests": 50,
      "completedRequests": 140,
      "pendingRequests": 10,
      "totalHours": 300,
      "totalCost": 15000.00
    }
  ]
}
```

---

### 3. Get Requests by Equipment Category (Pivot/Graph)

**GET** `/dashboard/requests-by-equipment`

Get request statistics grouped by equipment (for pivot/graph reports).

**Query Parameters:**
- `startDate` (date): Filter from date
- `endDate` (date): Filter to date
- `limit` (number): Limit number of results (default: 20)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "equipmentId": "507f1f77bcf86cd799439020",
      "equipmentName": "CNC Machine 01",
      "totalRequests": 25,
      "correctiveRequests": 20,
      "preventiveRequests": 5,
      "totalHours": 75,
      "totalCost": 5000.00
    }
  ]
}
```

---

### 4. Get Recent Activity

**GET** `/dashboard/recent-activity`

Get recent maintenance activities.

**Query Parameters:**
- `limit` (number): Number of activities (default: 20)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439041",
      "type": "request_completed",
      "message": "Request MR00002 completed by John Doe",
      "equipmentName": "Laptop Dell XPS 15",
      "timestamp": "2024-01-22T17:30:00.000Z",
      "user": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe"
      }
    },
    {
      "id": "507f1f77bcf86cd799439042",
      "type": "request_created",
      "message": "New request MR00003 created for CNC Machine 01",
      "equipmentName": "CNC Machine 01",
      "timestamp": "2024-01-22T18:00:00.000Z",
      "user": {
        "id": "507f1f77bcf86cd799439032",
        "name": "Jane Smith"
      }
    }
  ]
}
```

---

## Error Handling

All error responses follow a consistent format:

### Error Response Format

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": {} // Optional: Additional error details
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or invalid input |
| 401 | Unauthorized - Authentication required or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists (e.g., duplicate email) |
| 500 | Internal Server Error - Server error |

### Common Error Responses

#### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": {
    "fields": {
      "email": "Email is required",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "You don't have permission to perform this action"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Equipment not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **Authentication endpoints**: 5 requests per minute per IP
- **General endpoints**: 100 requests per minute per user
- **Upload endpoints**: 10 requests per minute per user

Rate limit headers included in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Pagination

List endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## Filtering and Sorting

Most list endpoints support:
- **Filtering**: Via query parameters (varies by endpoint)
- **Sorting**: Via `sortBy` and `sortOrder` query parameters
  - `sortBy`: Field name to sort by (e.g., "createdAt", "name")
  - `sortOrder`: "asc" or "desc" (default: "desc")

Example:
```
GET /equipment?sortBy=createdAt&sortOrder=desc&page=1&limit=20
```

---

## Webhooks (Optional - Future Enhancement)

Webhooks can be configured to receive notifications for:
- Request created
- Request assigned
- Request completed
- Request scrapped
- Equipment scrapped

---

## Versioning

Current API version: **v1**

API versioning can be implemented via URL path:
- `/api/v1/maintenance-requests`
- `/api/v2/maintenance-requests` (future version)

