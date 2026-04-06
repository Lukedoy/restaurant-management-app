# Restaurant Management Application

A comprehensive full-stack web application designed to automate and streamline restaurant operations. This system provides role-based access for different staff members (Admin, Waiter, Chef) and includes features for menu management, order processing, table management, billing with partial payments, real-time updates via Socket.IO, and sales analytics.

## Table of Contents

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
- **User Authentication** - Secure login/registration with JWT tokens and input validation
- **Role-Based Access Control** - Separate dashboards for Admin, Waiter, and Chef
- **Menu Management** - Full CRUD operations with categories, pricing, preparation time, and availability toggle
- **Order Management** - Create, edit, and track orders with per-item status tracking
- **Table Management** - Monitor and update table status (available, occupied, reserved) with configurable table count
- **Takeaway Orders** - Dedicated takeaway option (table number 0) alongside dine-in tables
- **Billing System** - Calculate bills with discount support, 5% tax, and partial payment tracking (paid/unpaid items)
- **Real-time Updates** - Socket.IO integration for live order and table status changes
- **Analytics Dashboard** - Sales reports and order statistics for admins
- **Payment Processing** - Support for cash, card, and online payments with partial payment capability
- **Order History** - Searchable, filterable, sortable order history with pagination
- **Print Bill** - Generate and print formatted bills from any order detail popup
- **Notifications** - Toast notification system for real-time feedback

### Admin Features
- Dashboard with key statistics (total users, orders, revenue)
- Menu item management (create, update, delete with validation)
- User management (view, activate/deactivate, delete users)
- Configurable table count
- Sales analytics and daily reports
- Order analytics and tracking

### Waiter Features
- Split-panel table management with inline order placement
- Table status control (available, occupied, reserved)
- Create orders directly from table view with menu browsing and category filtering
- Order detail popup with inline editing (add/remove items, change quantities, special requests)
- Auto-save on order modifications
- Table reassignment for existing orders
- Bill calculation with discounts and partial payments
- Order history with search, filters, and sorting

### Chef Features
- Real-time order queue prioritized by time
- Per-item status tracking (confirmed, preparing, ready)
- Bulk and individual item status updates
- Special requests display per item
- Visual priority indicators for older orders

## Tech Stack

### Frontend
- **React 18** - UI library with hooks and functional components
- **React Router v6** - Client-side routing with protected routes
- **Context API** - State management (AuthContext, NotificationContext)
- **Socket.IO Client** - Real-time communication
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework with middleware pipeline
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Socket.IO** - Real-time WebSocket events
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Dev & Testing
- **Jest** - Server-side testing framework
- **React Testing Library** - Component testing
- **Supertest** - HTTP assertion library
- **Nodemon** - Development auto-reload

## Project Structure

```
restaurant-management-app/
├── server/
│   ├── config/
│   │   └── db.js                    # Database connection
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── MenuItem.js              # Menu item schema
│   │   ├── Order.js                 # Order schema (with per-item paid/status tracking)
│   │   └── Table.js                 # Table schema
│   ├── routes/
│   │   ├── auth.js                  # Authentication routes
│   │   ├── menu.js                  # Menu routes (with validation middleware)
│   │   ├── orders.js                # Order routes (CRUD, payments, item updates)
│   │   ├── tables.js                # Table routes (status, assignment, count)
│   │   ├── users.js                 # User management routes
│   │   └── admin.js                 # Admin dashboard & reports
│   ├── controllers/
│   │   ├── authController.js        # Auth logic
│   │   ├── menuController.js        # Menu logic
│   │   ├── orderController.js       # Order logic (items, payments, reassign)
│   │   ├── tableController.js       # Table logic (status, count config)
│   │   ├── userController.js        # User management logic
│   │   └── adminController.js       # Admin stats & reports
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   ├── adminOnly.js             # Admin role guard
│   │   ├── validate.js              # Input validation & sanitization
│   │   └── errorHandler.js          # Error handling
│   ├── __tests__/
│   │   └── validate.test.js         # Validation middleware tests
│   ├── server.js                    # Entry point
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top navigation bar
│   │   │   ├── Sidebar.jsx          # Side navigation
│   │   │   ├── ProtectedRoute.jsx   # Auth route guard
│   │   │   ├── Admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── MenuManagement.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   ├── OrderAnalytics.jsx
│   │   │   │   └── SalesReport.jsx
│   │   │   ├── Orders/
│   │   │   │   ├── OrderForm.jsx
│   │   │   │   ├── OrderList.jsx
│   │   │   │   ├── OrderDetail.jsx
│   │   │   │   ├── OrderDetailPopup.jsx  # Inline editing, auto-save, print bill
│   │   │   │   └── OrderHistory.jsx      # Searchable/sortable order history
│   │   │   ├── Chef/
│   │   │   │   ├── ChefDashboard.jsx
│   │   │   │   └── OrderQueue.jsx        # Per-item status updates
│   │   │   ├── Waiter/
│   │   │   │   ├── WaiterDashboard.jsx
│   │   │   │   └── TableManager.jsx      # Split-panel table + order view
│   │   │   ├── Billing/
│   │   │   │   ├── BillCalculator.jsx    # Discount, tax, partial payments
│   │   │   │   ├── PaymentForm.jsx
│   │   │   │   └── Receipt.jsx
│   │   │   ├── Menu/
│   │   │   │   ├── MenuDisplay.jsx
│   │   │   │   └── MenuItem.jsx
│   │   │   ├── Customer/
│   │   │   │   └── CustomerOrder.jsx
│   │   │   ├── Auth/               # (Login/Register handled in pages)
│   │   │   └── common/
│   │   │       ├── ErrorBoundary.jsx
│   │   │       ├── LoadingSpinner.jsx
│   │   │       ├── Pagination.jsx
│   │   │       └── ToastContainer.jsx
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
│   │   │   ├── api.js               # Centralized API call wrapper
│   │   │   ├── authService.js
│   │   │   ├── menuService.js
│   │   │   ├── orderService.js
│   │   │   ├── adminService.js
│   │   │   └── socket.js            # Socket.IO client setup
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Auth state management
│   │   │   └── NotificationContext.jsx  # Toast notifications
│   │   ├── styles/
│   │   │   ├── Admin.css
│   │   │   ├── Auth.css
│   │   │   ├── Billing.css
│   │   │   ├── Chef.css
│   │   │   ├── Common.css
│   │   │   ├── Customer.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Menu.css
│   │   │   ├── Navbar.css
│   │   │   ├── NotFound.css
│   │   │   ├── OrderHistory.css
│   │   │   ├── Orders.css
│   │   │   ├── Receipt.css
│   │   │   ├── Sidebar.css
│   │   │   └── Waiter.css
│   │   ├── __tests__/
│   │   │   ├── ErrorBoundary.test.jsx
│   │   │   ├── LoadingSpinner.test.jsx
│   │   │   ├── NotificationContext.test.jsx
│   │   │   └── Pagination.test.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   ├── .env.example
│   └── package.json
│
├── README.md
└── LICENSE
```

## Prerequisites

- **Node.js** v14.0.0 or higher
- **npm** v6.0.0 or higher
- **MongoDB** (Local installation or MongoDB Atlas account)
- **Git** (for version control)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## Installation & Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/Lukedoy/restaurant-management-app.git
cd restaurant-management-app
```

### Step 2: Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/restaurant-app
JWT_SECRET=your_secret_key_here_change_in_production
PORT=5000
CLIENT_URL=http://localhost:3000
```

Start the server:

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (see `.env.example`):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

Start the development server:

```bash
npm start
```

Application opens at `http://localhost:3000`

## Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/restaurant-app` |
| `JWT_SECRET` | Secret key for JWT tokens | None (required) |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `REACT_APP_SOCKET_URL` | Socket.IO server URL | `http://localhost:5000` |

## API Endpoints

### Authentication (`/api/auth`)
```
POST   /api/auth/register        - Register new user (with validation)
POST   /api/auth/login           - Login user
GET    /api/auth/me              - Get current authenticated user
```

### Menu (`/api/menu`)
```
GET    /api/menu                 - Get all menu items
GET    /api/menu/:id             - Get menu item by ID
POST   /api/menu                 - Create menu item (Admin only, validated)
PUT    /api/menu/:id             - Update menu item (Admin only, validated)
DELETE /api/menu/:id             - Delete menu item (Admin only)
```

### Orders (`/api/orders`)
```
POST   /api/orders               - Create new order
GET    /api/orders               - Get all orders (supports pagination, search, filters)
PUT    /api/orders/:id/items     - Update order items (add, remove, edit)
PUT    /api/orders/:id/item-status - Update individual item status
PUT    /api/orders/:id/reassign-table - Reassign order to different table
PUT    /api/orders/:id/status    - Update order status
PUT    /api/orders/:id/payment   - Process payment (supports partial payments)
PUT    /api/orders/:id/complete  - Complete order
```

### Tables (`/api/tables`)
```
GET    /api/tables               - Get all tables
PUT    /api/tables/set-count     - Set total table count (Admin only)
PUT    /api/tables/:id/status    - Update table status
PUT    /api/tables/:id/assign    - Assign order to table
```

### Users (`/api/users`)
```
GET    /api/users                - Get all users (Admin only)
PUT    /api/users/:id/status     - Update user status (Admin only)
DELETE /api/users/:id            - Delete user (Admin only)
```

### Admin (`/api/admin`)
```
GET    /api/admin/stats          - Dashboard statistics
GET    /api/admin/sales-report   - Sales report data
```

### Health Check
```
GET    /api/health               - Server health status
```

## Usage Guide

### Initial Setup

#### 1. Create Users
Register users through the registration page or API:

| Role | Description |
|------|-------------|
| `admin` | Full system access |
| `waiter` | Order and table management |
| `chef` | Kitchen order queue |

#### 2. Configure Tables
Use the Admin dashboard to set the total number of tables. Tables are automatically created in the database.

#### 3. Add Menu Items
Use Admin Dashboard > Menu Management to add items with name, category, description, price, preparation time, and availability status.

### Workflow

1. **Waiter** selects a table (or takeaway) and places an order from the menu
2. **Chef** sees the order in their queue, updates item statuses (confirmed > preparing > ready)
3. **Waiter** sees ready items, serves the order, and updates status to "served"
4. **Waiter** generates bill (with optional discount), processes full or partial payment
5. **Order** is marked as completed when fully paid and served

## Role-Based Features

### Admin
- **Dashboard**: Statistics overview (users, orders, revenue, popular items)
- **Menu Management**: Full CRUD with validation (price range, required fields)
- **User Management**: View all users, activate/deactivate accounts, delete users
- **Table Configuration**: Set total number of restaurant tables
- **Order Analytics**: Order trends and status breakdown
- **Sales Reports**: Revenue reports with date filtering

### Waiter
- **Table Manager**: Split-panel view showing all tables and inline order creation
- **Takeaway Orders**: Dedicated takeaway option for to-go orders
- **Order Placement**: Browse menu by category, add to cart with quantities and special requests
- **Order Editing**: Modify existing orders (add/remove items, change quantities) with auto-save
- **Table Reassignment**: Move orders between tables
- **Billing**: Calculate totals with discount and 5% tax, process partial payments
- **Order History**: Search, filter by status/date, sort by any column, with pagination
- **Print Bill**: Generate formatted printable bills with paid/unpaid item breakdown

### Chef
- **Order Queue**: Real-time order list sorted by creation time
- **Per-Item Status**: Update individual items (confirmed > preparing > ready)
- **Bulk Updates**: Mark all items in an order as preparing/ready at once
- **Priority Indicators**: Visual indicators for orders waiting longer
- **Special Requests**: View special requests per item

## Database Schema

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, bcrypt hashed),
  role: String (admin | waiter | chef),
  status: String (active | inactive | pending),
  createdAt: Date,
  updatedAt: Date
}
```

### MenuItem
```javascript
{
  name: String (required),
  category: String (required),
  description: String,
  price: Number (required, 0.01-10000),
  image: String,
  availability: Boolean,
  preparationTime: Number (minutes, 1-180),
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  orderNumber: String (unique, auto-generated),
  tableNumber: Number (required, 0 = takeaway),
  items: [{
    menuItemId: ObjectId,
    name: String,
    quantity: Number,
    price: Number,
    specialRequests: String,
    status: String (confirmed | preparing | ready),
    paid: Boolean,
    createdAt: Date
  }],
  status: String (confirmed | preparing | ready | served | completed),
  totalAmount: Number,
  discount: Number (percentage, default 0),
  paymentMethod: String (cash | card | online),
  paymentStatus: String (unpaid | partially_paid | completed),
  waiterId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Table
```javascript
{
  tableNumber: Number (required, unique),
  capacity: Number (required),
  status: String (available | occupied | reserved),
  currentOrderId: ObjectId,
  createdAt: Date
}
```

## Testing

### Server Tests
```bash
cd server
npm test
```

Tests include validation middleware unit tests.

### Client Tests
```bash
cd client
npm test
```

Tests include component tests for ErrorBoundary, LoadingSpinner, Pagination, and NotificationContext.

### Manual API Testing with Postman

1. **Register**: `POST /api/auth/register` with `{ name, email, password, role }`
2. **Login**: `POST /api/auth/login` with `{ email, password }` - returns JWT token
3. **Use token**: Add `Authorization: Bearer <token>` header to authenticated requests

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Ensure MongoDB is running (`mongod`)
- Verify `MONGODB_URI` in `.env`
- For Atlas: check internet connection and IP whitelist

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
```bash
# Kill process on port 5000 (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# Or change PORT in server .env
```

### CORS Error
- Verify `CLIENT_URL` in server `.env` matches frontend URL
- Ensure both servers are running

### JWT Token Invalid
- Clear browser localStorage: `localStorage.clear()`
- Login again to get a new token

## Deployment

### Backend (Any Node.js host)

1. Set environment variables on host:
   - `MONGODB_URI` (use MongoDB Atlas for production)
   - `JWT_SECRET` (use a strong secret)
   - `PORT`
   - `CLIENT_URL` (deployed frontend URL)
2. Run `npm start`

### Frontend (Vercel / Netlify / Any static host)

1. Build: `npm run build`
2. Set environment variables:
   - `REACT_APP_API_URL=https://your-backend-url/api`
   - `REACT_APP_SOCKET_URL=https://your-backend-url`
3. Deploy the `build` folder

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas account and cluster
2. Get the connection string
3. Whitelist your server IP
4. Set `MONGODB_URI` in backend environment

## Future Enhancements

- [ ] SMS/Email notifications for order updates
- [ ] Kitchen Display System (KDS) with dedicated screen mode
- [ ] Inventory management linked to menu items
- [ ] Customer loyalty program
- [ ] Table reservation system with time slots
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration (Stripe)
- [ ] Delivery order management
- [ ] Staff shift scheduling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email bhonemyatkyawthu9@gmail.com or create an issue in the repository.

---

**Last Updated**: April 2026
**Version**: 2.0.0
**Author**: Bhone Myat Kyaw Thu
