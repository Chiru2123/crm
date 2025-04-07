
# LeadNexus CRM

LeadNexus CRM is a role-based Customer Relationship Management application designed for telecallers to manage customer leads and for administrators to oversee operations. This documentation provides an overview of the system architecture, features, and instructions for setup and usage.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [User Roles](#user-roles)
4. [System Architecture](#system-architecture)
5. [Technical Stack](#technical-stack)
6. [Setup Instructions](#setup-instructions)
7. [Pages and Components](#pages-and-components)
8. [Authentication Flow](#authentication-flow)
9. [Data Management](#data-management)
10. [Future Enhancements](#future-enhancements)

## Overview

LeadNexus CRM enables telecallers to manage their customer leads effectively and allows administrators to monitor call activities, track performance metrics, and get insights into the overall operations. The application is built with a responsive design and follows modern web development practices.

## Features

### Authentication and Authorization
- Secure JWT-based login system
- Role-based access control (Admin and Telecaller)
- Persistent authentication via local storage
- Token-based API authentication

### Admin Dashboard
- Key performance metrics (total telecallers, calls, customers)
- Call trends visualization
- Connected call records display
- Telecaller list and performance tracking

### Telecaller Lead Management
- Complete CRUD operations for customer leads
- Update call statuses and responses
- Real-time feedback and notifications via Sonner Toast
- Lead status tracking
- Call record history

## User Roles

The system supports two primary user roles:

### Admin
- Access to the Dashboard page
- View all telecallers and their activities
- Monitor call trends and performance metrics
- Review connected call records

### Telecaller
- Access to the Telecaller page
- Add, edit, and delete customer leads
- Update lead statuses
- Track personal call history and performance

## System Architecture

The application follows a full-stack architecture with a React frontend and Express.js backend:

### Frontend Architecture:
- Component-based architecture with React and TypeScript
- Context API for state management (AuthContext)
- React Router for navigation
- Axios for API communication with interceptors for token handling

### Backend Architecture:
- Express.js RESTful API
- MongoDB database with Mongoose ODM
- JWT authentication middleware
- MVC pattern (Models, Controllers, Routes)

## Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: React Context API
- **UI Components**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Notifications**: Sonner Toast
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Testing Database**: MongoDB Memory Server
- **Authentication**: JWT (jsonwebtoken)
- **Password Encryption**: bcryptjs
- **Middleware**: cors, morgan
- **Environment Variables**: dotenv

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Environment Variables

#### Backend (.env file in server directory)
```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/leadnexus

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Installation Steps

1. Clone the repository:
```sh
git clone <repository-url>
cd lead-nexus-crm-main
```

2. Install frontend dependencies:
```sh
npm install
```

3. Install backend dependencies:
```sh
cd server
npm install
cd ..
```

4. Start the backend server:
```sh
cd server
npm run dev
```

5. In a new terminal, start the frontend development server:
```sh
npm run dev
```

6. Access the application at `http://localhost:5173`

Note: The application uses MongoDB Memory Server for development, which creates an in-memory MongoDB instance. No external MongoDB installation is required for development.

### Login Credentials

The application automatically seeds the database with default accounts when started. You can log in with the following credentials:

#### Admin Account
- Email: admin@leadnexus.com
- Password: password123

#### Telecaller Accounts
- Email: sarah@leadnexus.com
- Password: password123

- Email: mike@leadnexus.com
- Password: password123

- Email: emily@leadnexus.com
- Password: password123

## Pages and Components

### Main Pages

1. **Login Page (`/`)**
   - Entry point for authentication
   - Redirects to appropriate dashboard based on user role

2. **Register Page (`/register`)**
   - User registration form

3. **Admin Dashboard (`/dashboard`)**
   - Displays KPIs and metrics
   - Shows call trends chart
   - Lists connected call records
   - Shows telecaller list

4. **Telecaller Page (`/telecaller`)**
   - Displays customer leads
   - Provides CRUD operations
   - Allows status updates

5. **Not Found Page (`/*`)**
   - Handles invalid routes

### Key Components

- **Layout**: Sidebar and header for navigation
- **LeadsTable**: Displays and manages leads
- **DashboardMetrics**: Display for key performance indicators
- **CallTrendsChart**: Visualization of call data
- **ConnectedCallsTable**: Display of successful call records
- **TelecallerList**: List of telecallers for admin view

## Authentication Flow

1. User enters credentials on the login page
2. Frontend sends credentials to `/api/users/login` endpoint
3. Backend validates credentials and returns JWT token and user data
4. Frontend stores token in localStorage and user data in AuthContext
5. Axios interceptors add the token to all subsequent API requests
6. Protected routes check authentication status via AuthContext
7. Token expiration or 401 responses trigger automatic logout
8. Registration automatically logs in the user and redirects to the appropriate dashboard based on role

## Data Management

The application uses MongoDB for data storage with the following collections:

- **Users**: Admin and telecaller user accounts
- **Leads**: Customer lead information
- **CallRecords**: History of calls made by telecallers

API endpoints are organized by resource:

- `/api/users`: User authentication and profile management
- `/api/leads`: Lead CRUD operations
- `/api/call-records`: Call record management and dashboard metrics

## Future Enhancements

The following enhancements can be implemented to extend the functionality:

1. **Advanced Authentication**:
   - Social login options
   - Two-factor authentication
   - Password reset functionality

2. **Enhanced Features**:
   - Advanced filtering and searching for leads
   - Bulk lead import/export
   - Scheduled callbacks and reminders
   - Call recording integration

3. **Additional UI Improvements**:
   - Dark mode support
   - Additional accessibility features
   - Mobile-optimized views
   - Customizable dashboard widgets

4. **Reporting and Analytics**:
   - Advanced reporting with export options
   - Telecaller performance analytics
   - Conversion rate tracking
   - Custom report generation

---

## Contact and Support

For questions, issues, or feature requests, please contact the development team at support@leadnexus.com.

