# Banking System App - Banque Misr GP

A modern, secure banking application built with Angular 17, featuring user authentication, account management, fund transfers, and transaction history. This project serves as a graduation project for Banque Misr.

## 🚀 Features

### User Management
- **User Authentication**: Secure login system with role-based access control
- **User Roles**: Admin and User roles with different permissions
- **User Management**: Admins can create, edit, delete, and manage user accounts
- **Account Status**: Active/Inactive user management

### Banking Operations
- **Account Management**: View account balances and account information
- **Fund Transfers**: Secure money transfers between accounts
- **Transaction History**: Complete transaction records with filtering and search
- **Real-time Updates**: Live account balance updates after transactions

### Admin Dashboard
- **User Administration**: Comprehensive user management interface
- **Search & Filter**: Advanced user search and filtering capabilities
- **Pagination**: Efficient data pagination for large user lists
- **Status Management**: Toggle user active/inactive status

### Security Features
- **Authentication Guards**: Route protection based on user roles
- **Form Validation**: Comprehensive input validation and error handling
- **Secure Storage**: Local storage for user session management

## 🛠️ Technology Stack

- **Frontend**: Angular 17 with standalone components
- **UI Framework**: Bootstrap 5 with custom CSS
- **Icons**: Font Awesome
- **State Management**: Angular services with RxJS
- **Routing**: Angular Router with guards
- **Forms**: Reactive Forms with validation

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Angular CLI** (version 17 or higher)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Banking-System-App_-Banque-Misr-GP
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
ng serve
```

The application will be available at `http://localhost:4200`

### 4. Build for Production
```bash
ng build
```

## 🔐 Demo Credentials

### Admin Access
- **Username**: `admin_alice`
- **Password**: `Adm!nP@ss2023`
- **Role**: Administrator
- **Access**: Full system access including user management

### User Access
- **Username**: `daniel_t`
- **Password**: `D@n13lT`
- **Role**: Regular User
- **Access**: Banking operations (transfers, transactions, account view)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/          # UI Components
│   │   ├── admin-home/     # Admin dashboard home
│   │   ├── admin-nav/      # Admin navigation
│   │   ├── admin-panel/    # User management panel
│   │   ├── login/          # Authentication component
│   │   ├── my-account/     # User account view
│   │   ├── transactions/   # Transaction history
│   │   ├── transfer/       # Fund transfer component
│   │   ├── user-home/      # User dashboard home
│   │   └── user-nav/       # User navigation
│   ├── core/               # Core functionality
│   │   ├── guards/         # Route guards
│   │   ├── interfaces/     # TypeScript interfaces
│   │   ├── pipes/          # Custom pipes
│   │   └── services/       # Business logic services
│   └── layouts/            # Application layouts
├── assets/                 # Static assets
└── styles/                 # Global styles
```

## 🔧 Key Components

### Authentication System
- **Login Component**: User authentication interface
- **Auth Guard**: Route protection based on user roles
- **Auth Service**: Authentication logic and user management

### Banking Components
- **Transfer Component**: Fund transfer between accounts
- **Transactions Component**: Transaction history with filtering
- **My Account Component**: Account information and balance

### Admin Components
- **Admin Panel**: Comprehensive user management
- **Admin Home**: Admin dashboard overview
- **User Management**: CRUD operations for users

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Modern Interface**: Clean, professional banking interface
- **Interactive Elements**: Hover effects, loading states, and animations
- **Accessibility**: ARIA labels and semantic HTML
- **Toast Notifications**: User feedback for actions

## 🔒 Security Considerations

- **Route Guards**: Protected routes based on authentication and roles
- **Input Validation**: Comprehensive form validation
- **Session Management**: Secure user session handling
- **Role-based Access**: Different permissions for different user types

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices
- Various screen sizes and orientations

## 🚀 Deployment

### Build for Production
```bash
ng build --configuration production
```

### Deploy to Server
The built files in the `dist/` folder can be deployed to any web server or hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Banque Misr Graduation Project.

## 👥 Team

- **Project**: Banking System App - Banque Misr GP
- **Type**: Graduation Project
- **Institution**: Banque Misr

## 📞 Support

For support or questions about this project, please contact the development team.

---

**Note**: This is a demonstration application. In a production environment, additional security measures, encryption, and compliance requirements would need to be implemented.
