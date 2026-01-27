# Restaurant Management Application

A comprehensive full-stack web application designed to automate and streamline restaurant operations. This system provides role-based access for different staff members (Admin, Waiter, Chef) and includes features for menu management, order processing, real-time updates, and sales analytics.

##  Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Role-Based Features](#role-based-features)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Features
- ✅ **User Authentication** - Secure login/registration with JWT tokens
- ✅ **Role-Based Access Control** - Different dashboards for Admin, Waiter, and Chef
- ✅ **Menu Management** - Add, update, delete menu items with categories
- ✅ **Order Management** - Create orders, track status in real-time
- ✅ **Table Management** - Monitor table status (available, occupied, reserved)
- ✅ **Billing System** - Calculate bills with discounts and tax
- ✅ **Real-time Updates** - Socket.IO integration for live order status
- ✅ **Analytics Dashboard** - Sales reports and order statistics
- ✅ **Payment Processing** - Support for cash, card, and online payments

### Admin Features
- Dashboard with key statistics
- Menu item management (CRUD operations)
- User management and role assignment
- Sales analytics and daily reports
- Order analytics and tracking

### Waiter Features
- View all orders
- Update order status
- Table management and status tracking
- Create new orders
- Process bill payments

### Chef Features
- View orders to prepare
- Order queue prioritized by time
- Update order status (preparing → ready)
- Special requests display

##  Tech Stack

### Frontend
- **React.js** - UI library for building interactive components
- **React Router** - Client-side routing
- **Context API** - State management
- **CSS3** - Styling with modern features
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Socket.IO** - Real-time events
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Tools & Services
- **MongoDB Atlas** - Cloud database
- **Postman** - API testing
- **Git** - Version control
- **VS Code** - Code editor

##  Project Structure

```
restaurant-management-app/
├── server/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── MenuItem.js           # Menu item schema
│   │   ├── Order.js              # Order schema
│   │   └── Table.js              # Table schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── menu.js               # Menu routes
│   │   ├── orders.js             # Order routes
│   │   └── admin.js              # Admin routes
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── menuController.js     # Menu logic
│   │   ├── orderController.js    # Order logic
│   │   └── adminController.js    # Admin logic
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── errorHandler.js       # Error handling
│   ├── .env                      # Environment variables
│   ├── server.js                 # Entry point
│   └── package.json              # Dependencies
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Menu/
│   │   │   │   ├── MenuDisplay.jsx
│   │   │   │   └── MenuItem.jsx
│   │   │   ├── Orders/
│   │   │   │   ├── OrderForm.jsx
│   │   │   │   ├── OrderList.jsx
│   │   │   │   └── OrderDetail.jsx
│   │   │   ├── Chef/
│   │   │   │   ├── ChefDashboard.jsx
│   │   │   │   └── OrderQueue.jsx
│   │   │   ├── Waiter/
│   │   │   │   ├── WaiterDashboard.jsx
│   │   │   │   └── TableManager.jsx
│   │   │   ├── Admin/
│   │   │   │   ├── MenuManagement.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   ├── OrderAnalytics.jsx
│   │   │   │   └── SalesReport.jsx
│   │   │   ├── Billing/
│   │   │   │   ├── BillCalculator.jsx
│   │   │   │   └── PaymentForm.jsx
│   │   │   └── Auth/
│   │   │       └── LoginPage.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   ├── ChefPage.jsx
│   │   │   ├── WaiterPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── menuService.js
│   │   │   ├── orderService.js
│   │   │   └── adminService.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── OrderContext.jsx
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── Navbar.css
│   │   │   ├── Sidebar.css
│   │   │   ├── Menu.css
│   │   │   ├── Orders.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Admin.css
│   │   │   ├── Chef.css
│   │   │   ├── Waiter.css
│   │   │   ├── Billing.css
│   │   │   ├── Auth.css
│   │   │   ├── NotFound.css
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.html
│   ├── .env
│   └── package.json
│
└── README.md
```

##  Prerequisites

- **Node.js** v14.0.0 or higher
- **npm** v6.0.0 or higher
- **MongoDB** (Local or Atlas account)
- **Git** (optional, for version control)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

##  Installation & Setup

### Step 1: Clone/Download Repository

```bash
git clone <repository-url>
cd restaurant-management-app
```

### Step 2: Backend Setup

#### 2.1 Install Backend Dependencies
```bash
cd server
npm install
```

#### 2.2 Configure Environment Variables
Create a `.env` file in the `server` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/restaurant-app
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant-app?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_secret_key_here_change_in_production

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000
```

#### 2.3 Verify MongoDB Connection
Ensure MongoDB is running:
- **Local**: `mongod` should be running
- **Atlas**: Connection string in MONGODB_URI

#### 2.4 Start Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### Step 3: Frontend Setup

#### 3.1 Install Frontend Dependencies
```bash
cd client
npm install
```

#### 3.2 Configure Environment Variables
Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3.3 Start Frontend Development Server
```bash
npm start
```

Application will open at `http://localhost:3000` in your browser

##  Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/restaurant-app` |
| `JWT_SECRET` | Secret key for JWT tokens | None (required) |
| `PORT` | Server port | 5000 |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5000/api |

##  API Endpoints

### Authentication Routes
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
```

### Menu Routes
```
GET    /api/menu                - Get all menu items
GET    /api/menu/:id            - Get menu item by ID
POST   /api/menu                - Create menu item (Admin only)
PUT    /api/menu/:id            - Update menu item (Admin only)
DELETE /api/menu/:id            - Delete menu item (Admin only)
```

### Order Routes
```
POST   /api/orders              - Create new order
GET    /api/orders              - Get all orders
PUT    /api/orders/:id/status   - Update order status
PUT    /api/orders/:id/complete - Complete order
```

### Admin Routes
```
GET    /api/admin/stats         - Dashboard statistics
GET    /api/admin/sales-report  - Sales report
```

##  Usage Guide

### Initial Setup

#### 1. Create Test Users
Register users with different roles:

**Admin User**
- Email: `admin@restaurant.com`
- Password: `admin123`
- Role: `admin`

**Waiter User**
- Email: `waiter@restaurant.com`
- Password: `waiter123`
- Role: `waiter`

**Chef User**
- Email: `chef@restaurant.com`
- Password: `chef123`
- Role: `chef`

#### 2. Add Menu Items
Use Admin Dashboard → Menu Management to add items:

Example:
```
Name: Burger
Category: Main Course
Description: Delicious beef burger with cheese
Price: 250
Preparation Time: 15 minutes
Availability: Available
```

#### 3. Add Tables
Initialize tables in the database:

```javascript
Table.create([
  { tableNumber: 1, capacity: 2 },
  { tableNumber: 2, capacity: 4 },
  { tableNumber: 3, capacity: 4 },
  { tableNumber: 4, capacity: 6 }
])
```

### Workflow

**Customer Orders → Waiter Takes Order → Chef Prepares → Ready for Serving**

1. **Waiter**: Takes order → Creates order in system → Updates table status
2. **Chef**: Views pending orders → Marks as "preparing" → Marks as "ready"
3. **Waiter**: Gets notification → Serves order → Updates status to "served"
4. **Waiter**: Generates bill → Processes payment → Completes order

##  Role-Based Features

### Admin
- **Dashboard**: View statistics, total users, orders, revenue
- **Menu Management**: Add, edit, delete menu items
- **User Management**: View all users and their roles
- **Orders**: View all orders and their status
- **Analytics**: Order analytics and sales reports
- **Access**: Full system access

### Waiter
- **Dashboard**: View active orders
- **Tables**: Manage table status and assignments
- **Orders**: Create orders, update status
- **Billing**: Calculate bills with discounts
- **Payment**: Process payments
- **Menu**: View and browse menu items

### Chef
- **Dashboard**: View orders to prepare
- **Order Queue**: Prioritized order queue
- **Status Updates**: Update orders from "pending" to "preparing" to "ready"
- **Special Requests**: View special requests/notes
- **No Menu Access**: Cannot modify menu items

##  Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (admin, waiter, chef, customer),
  status: String (active, inactive),
  createdAt: Date,
  updatedAt: Date
}
```

### MenuItem Model
```javascript
{
  name: String (required),
  category: String (required),
  description: String,
  price: Number (required),
  image: String,
  availability: Boolean,
  preparationTime: Number (minutes),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  orderNumber: String (unique),
  tableNumber: Number (required),
  items: [{
    menuItemId: ObjectId,
    name: String,
    quantity: Number,
    price: Number,
    specialRequests: String
  }],
  status: String (pending, confirmed, preparing, ready, served, completed),
  totalAmount: Number,
  discount: Number,
  paymentMethod: String (cash, card, online),
  paymentStatus: String (pending, completed),
  waiterId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Table Model
```javascript
{
  tableNumber: Number (required, unique),
  capacity: Number (required),
  status: String (available, occupied, reserved),
  currentOrderId: ObjectId,
  createdAt: Date
}
```

##  Testing

### Using Postman

1. **Register User**
   ```
   POST http://localhost:5000/api/auth/register
   Body: {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "role": "waiter"
   }
   ```

2. **Login**
   ```
   POST http://localhost:5000/api/auth/login
   Body: {
     "email": "john@example.com",
     "password": "password123"
   }
   Response: { token, user }
   ```

3. **Get Menu Items**
   ```
   GET http://localhost:5000/api/menu
   ```

4. **Create Order**
   ```
   POST http://localhost:5000/api/orders
   Headers: { Authorization: "Bearer <token>" }
   Body: {
     "tableNumber": 1,
     "items": [
       {
         "menuItemId": "...",
         "name": "Burger",
         "quantity": 2,
         "price": 250
       }
     ],
     "totalAmount": 500
   }
   ```

##  Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Ensure MongoDB is running: `mongod`
- Check MongoDB URI in `.env`
- For Atlas, verify internet connection and IP whitelist

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
PORT=5001
```

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**:
- Verify `CLIENT_URL` in server `.env`
- Check that frontend is running on correct port
- Ensure CORS middleware is configured

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### JWT Token Invalid
```
Error: Invalid token
```
**Solution**:
- Clear browser localStorage: `localStorage.clear()`
- Login again to get new token
- Verify `JWT_SECRET` matches between login and subsequent requests

##  Deployment

### Backend Deployment (Heroku)

1. **Create Heroku Account** and install Heroku CLI
2. **Initialize Git** in server directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. **Create Heroku App**:
   ```bash
   heroku create your-app-name
   ```
4. **Set Environment Variables**:
   ```bash
   heroku config:set MONGODB_URI=your_atlas_uri
   heroku config:set JWT_SECRET=your_secret_key
   ```
5. **Deploy**:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel)

1. **Build Application**:
   ```bash
   npm run build
   ```
2. **Connect to Vercel** and deploy
3. **Set Environment Variables** in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-backend.herokuapp.com/api
   ```

### Database (MongoDB Atlas)

1. Create MongoDB Atlas account
2. Create cluster and database
3. Get connection string
4. Update `MONGODB_URI` in environment variables

##  Future Enhancements

- [ ] SMS/Email notifications for orders
- [ ] Kitchen Display System (KDS)
- [ ] Advanced inventory management
- [ ] Customer loyalty program
- [ ] Table reservation system
- [ ] Receipt printing
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Delivery system
- [ ] Staff attendance tracking
- [ ] Budget analytics

##  Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For support, email bhonemyatkyawthu9@gmail.com or create an issue in the repository.

## Acknowledgments

- Express.js documentation
- MongoDB documentation
- React.js community
- All contributors and testers

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Author**: Bhone Myat Kyaw Thu

For more information, visit the [Project Wiki](https://github.com/Lukedoy/restaurant-management-app/wiki)