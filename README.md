# 🔧 FixItNow Backend API

A robust RESTful Backend API for a Home Service Marketplace built with **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, and **JWT Authentication**.

Customers can book home services, technicians can manage bookings and availability, and admins can manage users and service categories.

---

## 🚀 Live API

```
https://b7-a4-nine.vercel.app
```

---

## 📄 API Documentation

Postman Collection:

```
https://drive.google.com/file/d/1_4n9ZuPI7JSMK8aE1AuLhY6SI_LjVN_s/view?usp=sharing
```

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Bcrypt
- Stripe Payment Gateway

---

## ✨ Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Role Based Authorization

### Customer

- Browse Services
- Book Services
- Cancel Booking
- Payment Integration
- Payment History
- Leave Reviews

### Technician

- Create Technician Profile
- Manage Availability
- Create Services
- Update Services
- Accept / Decline Bookings
- Complete Jobs

### Admin

- View All Users
- Ban / Unban Users
- View All Bookings
- Manage Categories
- View All Services

### Public

- Browse Services
- Browse Technicians
- Search
- Filter
- Pagination
- Sorting

---

# API Endpoints

## Authentication

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

## Categories

```
POST   /api/categories
GET    /api/categories
GET    /api/categories/:id
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

## Services

```
POST   /api/services
GET    /api/services
GET    /api/services/:id
PATCH  /api/services/:id
DELETE /api/services/:id
```

Supports

- Search
- Filter
- Pagination
- Sorting

---

## Technician

```
POST   /api/technician/profile
PUT    /api/technician/profile

POST   /api/technician/availability
GET    /api/technician/availability
PATCH  /api/technician/availability/:id
DELETE /api/technician/availability/:id

GET    /api/technicians
GET    /api/technicians/:id
```

Supports

- Search
- Filter
- Pagination
- Sorting

---

## Booking

```
POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/:id
PATCH  /api/bookings/:id
PATCH  /api/bookings/:id/cancel
```

---

## Payments

```
POST   /api/payments/checkout-session
POST   /api/payments/confirm

GET    /api/payments
GET    /api/payments/:id
```

---

## Reviews

```
POST   /api/reviews
GET    /api/reviews
GET    /api/reviews/:id
```

---

## Admin

```
GET    /api/admin/users
PATCH  /api/admin/users/:id

GET    /api/admin/bookings

GET    /api/admin/services

GET    /api/admin/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/:id
DELETE /api/admin/categories/:id
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/your-username/fixitnow-backend.git
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CLIENT_URL=
APP_URL=
```

Generate Prisma Client

```bash
npx prisma generate
```

Run Migration

```bash
npx prisma migrate dev
```

Run Development Server

```bash
npm run dev
```

Build

```bash
npm run build
```

Start Production

```bash
npm start
```

---

# Project Structure

```
src/
│
├── app/
│   ├── modules/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   └── lib/
│
├── app.ts
└── server.ts
```

---

# Author

**Polok Kumar**

GitHub:
https://github.com/your-github

---

# License

This project is licensed under the MIT License.
