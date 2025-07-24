# Bhatt Pharma - Pharmaceutical Products Management System

A comprehensive pharmaceutical products management application built with **Angular 17** frontend and **Node.js/Express** backend with **MongoDB** database.

## 🚀 Features

- **User Authentication & Authorization** (Admin, Manager, Pharmacist, Staff roles)
- **Product Management** (CRUD operations for pharmaceutical products)
- **Inventory Tracking** (Stock levels, expiry dates, low stock alerts)
- **Dashboard Analytics** (Product statistics, charts, and insights)
- **User Management** (Admin can manage system users)
- **Responsive Design** (Mobile-friendly Angular Material UI)
- **Role-based Access Control** (Different permissions for different roles)

## 🛠️ Tech Stack

### Frontend (Angular 17)
- **Angular 17** with Standalone Components
- **Angular Material** for UI components
- **TypeScript** for type safety
- **RxJS** for reactive programming
- **Angular Signals** for state management
- **SCSS** for styling

### Backend (Node.js)
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** & **CORS** for security

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Angular CLI** (v17)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd bhatt-pharma
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Setup Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bhatt_pharma
JWT_SECRET=bhatt_pharma_secret_key_2024
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 5. Seed the Database with Sample Users
```bash
cd server
node scripts/seed-users.js
```

### 6. Start the Application
```bash
# Start both backend and frontend
npm run dev

# Or start individually:
# Backend only: npm run server
# Frontend only: npm run client
```

### 7. Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:5000

## 👥 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@bhattpharma.com | admin123 |
| **Manager** | manager@bhattpharma.com | manager123 |
| **Pharmacist** | pharmacist@bhattpharma.com | pharmacist123 |
| **Staff** | staff@bhattpharma.com | staff123 |

## 📱 Application Features

### Dashboard
- Real-time statistics (Total products, Low stock, Expired products)
- Quick action cards for common tasks
- User role-based navigation
- Modern Material Design interface

### Product Management
- Add, edit, delete pharmaceutical products
- Comprehensive product information (Generic name, brand, manufacturer, etc.)
- Stock management with low stock alerts
- Expiry date tracking
- Batch number management
- Supplier information

### User Management (Admin Only)
- Create and manage system users
- Role assignment (Admin, Manager, Pharmacist, Staff)
- User activation/deactivation
- Profile management

### Authentication & Security
- JWT-based authentication
- Role-based access control
- Secure password hashing
- Protected routes
- Session management

## 🏗️ Project Structure

```
bhatt-pharma/
├── server/                 # Backend (Node.js/Express)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── scripts/           # Database scripts
│   └── index.js           # Server entry point
├── client/                # Frontend (Angular 17)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/      # Services, models, guards
│   │   │   ├── features/  # Feature modules
│   │   │   └── shared/    # Shared components
│   │   └── styles.scss    # Global styles
└── package.json           # Root package.json
```

## 🔧 Development

### Backend Development
```bash
cd server
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
cd client
ng serve  # Starts Angular dev server
```

### Database Operations
```bash
# Seed users
cd server && node scripts/seed-users.js

# Connect to MongoDB shell
mongo bhatt_pharma
```

## 📦 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/stats` - Get product statistics

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build for production: `cd client && ng build`
2. Deploy the `dist/client` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ for pharmaceutical inventory management.

---

**Note**: This is a demo application. For production use, ensure proper security measures, data validation, and testing are implemented.
