# CafeManager

Professional full-stack Restaurant/Cafe Management System for table service, kitchen operations, billing, and sales analytics.

---

## Overview

CafeManager is built for:
- Restaurants
- Cafes
- Dhabas
- Cloud kitchens
- Canteens and food courts

It provides one integrated workflow:
- digital menu -> table order -> kitchen status -> bill generation -> daily reports

---

## Core Features

### Operations
- Digital menu with categories: `Starters`, `Mains`, `Drinks`, `Desserts`
- Table-wise order management with quantity updates
- Real-time kitchen display via Socket.io
- Order status flow: `pending -> preparing -> ready -> served -> billed`

### Billing & Reports
- GST-ready bill generation
  - CGST: `2.5%`
  - SGST: `2.5%`
- Print-friendly invoice page
- Daily sales report with:
  - total orders
  - total revenue
  - total GST
  - top dishes
  - payment method breakdown

### Admin & Security
- JWT-based authentication
- Role-based access (`admin`, `waiter`, `kitchen`)
- Admin panel for full menu CRUD (add/edit/delete, availability, pricing)

### UI/UX
- Professional responsive UI for desktop, tablet, and mobile
- Mobile bottom navigation + More sheet for fast access
- Branded app metadata, title, and logo

---

## Tech Stack

- Frontend: React, React Router, Axios, Socket.io Client, React Icons, React Toastify
- Backend: Node.js, Express.js, Socket.io
- Database: MongoDB (Mongoose)
- Authentication: JWT + bcryptjs
- Styling: Custom CSS (responsive, production-ready)

---

## Project Structure

```text
Cafe_Management/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   ├── Table.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── tables.js
│   │   ├── orders.js
│   │   └── reports.js
│   ├── .env.example
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── logo-cafemanager.svg
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── index.css
│   └── .env.example
└── README.md
```

---

## Environment Variables

### Backend (`backend/.env`)

Copy and edit:
```bash
cp backend/.env.example backend/.env
```

Variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cafe_management
JWT_SECRET=replace_with_your_jwt_secret
FRONTEND_URL=http://localhost:3001
```

### Frontend (`frontend/.env`)

Copy and edit:
```bash
cp frontend/.env.example frontend/.env
```

Variables:
```env
PORT=3001
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## Setup & Run

## 1) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

## 2) Configure environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## 3) Seed sample data

```bash
cd backend
npm run seed
```

## 4) Start backend

```bash
cd backend
npm run dev
```

Backend runs at: `http://localhost:5000`

## 5) Start frontend

```bash
cd frontend
npm start
```

Frontend runs at: `http://localhost:3001`

---

## Demo Users

- Admin: `admin@cafe.com / admin123`
- Waiter: `waiter@cafe.com / waiter123`
- Kitchen: `kitchen@cafe.com / kitchen123`

---

## Main Workflows

### Waiter Flow
1. Select table
2. Add menu items and quantities
3. Place order
4. Track order status
5. Generate and print bill

### Kitchen Flow
1. View incoming orders in real-time
2. Mark as preparing
3. Mark as ready

### Admin Flow
1. Manage menu items
2. View daily report dashboard
3. Track top-selling dishes and payments

---

## API Overview

### Auth
- `POST /api/auth/login`
- `POST /api/auth/register` (admin protected)
- `GET /api/auth/me`

### Menu
- `GET /api/menu`
- `GET /api/menu/categories`
- `POST /api/menu` (admin)
- `PUT /api/menu/:id` (admin)
- `DELETE /api/menu/:id` (admin)

### Tables
- `GET /api/tables`
- `POST /api/tables` (admin)
- `PUT /api/tables/:id`
- `DELETE /api/tables/:id` (admin)

### Orders
- `GET /api/orders`
- `GET /api/orders/active`
- `GET /api/orders/kitchen`
- `GET /api/orders/:id`
- `POST /api/orders`
- `PUT /api/orders/:id/items`
- `PUT /api/orders/:id/status`

### Reports
- `GET /api/reports/daily?date=YYYY-MM-DD` (admin)

---

## Notes

- Razorpay is not integrated yet in the current build; payment modes currently include `cash`, `card`, `upi`.
- If MongoDB is remote (Atlas), ensure network access and correct URI in `MONGO_URI`.
- For production, use secure secrets and environment-specific CORS/frontend URLs.
# Restaurant-Cafe-Management-System
