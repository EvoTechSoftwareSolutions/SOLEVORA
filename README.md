# SoleVora — Premium Footwear E-commerce 👟

**SoleVora** is a high-end, full-stack e-commerce platform dedicated to luxury footwear. Built with a focus on premium aesthetics and a seamless user experience, it offers a complete shopping journey from discovery to delivery — optimized for the Sri Lankan market.

---

## 🌟 Key Features

### For Customers
- **Curated Collections**: Browse shoes by category, gender (Men, Women, Kids), size, and price range.
- **Localized Experience**: Fully localized for the Sri Lankan market with **Rs. (LKR)** currency formatting.
- **Smart Cart & Wishlist**: Real-time cart management with selectable checkout items and a personalized wishlist.
- **Multi-Step Checkout**: Streamlined checkout with Shipping Information → Shipping Method → Payment.
- **Promo Code System**: Apply discount codes at checkout — validated in real-time, with live discount shown on every step, the order confirmation page, and the downloadable PDF receipt.
- **Secure Payments**: Integrated with **PayHere** (Online) and Cash on Delivery (COD).
- **Order Confirmation**: Detailed confirmation page with estimated delivery, promo breakdown, and a downloadable **PDF receipt**.
- **Profile Management**: Manage multiple saved shipping addresses, view order history, and update personal information.
- **Product Reviews**: Rate and review purchased products.
- **Newsletter Subscription**: Welcome emails with exclusive discount codes.

### For Administrators & Managers
- **Analytics Dashboard**: Real-time SVG-based sales chart with period filters (All / 6M / 3M), KPI cards (Total Revenue, Avg/Month, Peak Month, Total Orders), and revenue tracking.
- **Product Management**: Full CRUD for products with multi-image upload, size/stock management, and category assignment.
- **Inventory Control**: FIFO-based stock tracking with batch management, low-stock alerts, and inventory reports.
- **Order Management**: Manage the full order lifecycle from `PENDING` → `PROCESSING` → `SHIPPED` → `DELIVERED`.
- **Promo Code Management**: Create, edit, and delete promo codes with usage limits, expiry dates, discount types (percentage or fixed), and real-time `usedCount` tracking.
- **Customer Management**: View and manage customer accounts with role-based access control.
- **Messages**: View and manage contact form submissions.
- **Store Settings**: Configure store name, currency, shipping fees, free shipping threshold, and more.
- **Role-Based Access**: `admin`, `store_manager`, and `customer` roles with protected routes.

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI framework |
| Vanilla CSS3 | Custom design system & styling |
| React Context API | Global state (Cart, Auth) |
| Axios | HTTP client |
| React Router DOM | Client-side routing |
| jsPDF + jspdf-autotable | PDF receipt generation |
| Material Symbols | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | API server (ESM modules) |
| **Prisma ORM v6** | Database access & schema management |
| MySQL | Relational database |
| JWT | Authentication tokens |
| Bcrypt | Password hashing |
| Nodemailer | Transactional email (order confirmations) |
| Multer | File/image uploads |
| Zod | Request validation |
| PayHere API | Online payment gateway |
| Google Auth Library | Google OAuth support |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server (v8+)
- NPM

---

### 1. Database Setup

1. Create a new MySQL database:
   ```sql
   CREATE DATABASE new_solevora;
   ```
2. Prisma will manage the schema — **do not** create tables manually.

---

### 2. Backend Setup (`prisma-backend-js/`)

1. Navigate to the backend directory:
   ```bash
   cd prisma-backend-js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   PORT=5001
   NODE_ENV=development

   # Prisma Database Connection
   DATABASE_URL="mysql://root:YOUR_PASSWORD@127.0.0.1:3306/new_solevora"

   # JWT Authentication
   JWT_SECRET=your_jwt_secret_key

   # PayHere Payment Gateway
   PAYHERE_MERCHANT_ID=your_merchant_id
   PAYHERE_SECRET=your_payhere_secret
   PAYHERE_APP_ID=your_app_id
   PAYHERE_APP_SECRET=your_app_secret

   # Email (Nodemailer via Gmail)
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_gmail_app_password

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id

   # Cloudinary (for image hosting, optional)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Apply the Prisma schema to the database:
   ```bash
   npx prisma db push
   ```
   > This creates all tables automatically based on `prisma/schema.prisma`.

5. (Optional) Seed initial data:
   ```bash
   # Seed categories
   node seed-categories.js

   # Seed admin users
   npm run seed-admin
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5001`.

---

### 3. Frontend Setup (`frontend/`)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```
SOLEVORA/
├── prisma-backend-js/          # Express API Server (Prisma + MySQL)
│   ├── prisma/
│   │   └── schema.prisma       # Database schema (single source of truth)
│   ├── src/
│   │   ├── app.js              # Express app & route registration
│   │   ├── server.js           # Entry point
│   │   ├── controllers/        # Business logic
│   │   │   ├── admin.controller.js      # Dashboard stats, promo CRUD, customers
│   │   │   ├── order.controller.js      # Order creation, FIFO stock deduction, promo usage
│   │   │   ├── product.controller.js    # Product CRUD + image management
│   │   │   ├── user.controller.js       # Auth, profile, account management
│   │   │   ├── payment.controller.js    # PayHere integration
│   │   │   ├── cart.controller.js       # Cart operations
│   │   │   ├── address.controller.js    # Saved address management
│   │   │   ├── stockController.js       # Inventory batch management (FIFO)
│   │   │   └── ...
│   │   ├── routes/             # API route definitions
│   │   ├── middleware/         # Auth (JWT), role checks
│   │   ├── validators/         # Zod request schemas
│   │   ├── utils/              # Email service, tracking number, delivery estimate
│   │   └── prisma/             # Prisma client instance
│   ├── seed-categories.js      # Category seed script
│   ├── seed-admin-users.js     # Admin user seed script
│   └── .env                    # Environment variables
│
├── frontend/                   # React Client Application (Vite)
│   └── src/
│       ├── admin/              # Admin dashboard pages & components
│       │   ├── Dashboard.jsx   # Sales overview chart + KPI cards
│       │   ├── PromoCodes.jsx  # Promo code management
│       │   ├── OrdersManagement.jsx
│       │   ├── ProductsManagement.jsx
│       │   └── ...
│       ├── pages/
│       │   ├── user/           # Storefront pages (checkout, cart, auth)
│       │   │   ├── ShippingInformation.jsx
│       │   │   ├── ShippingMethod.jsx
│       │   │   ├── PaymentDetails.jsx   # Promo + PayHere payment
│       │   │   └── OrderConfirmation.jsx # PDF receipt download
│       │   └── profile/        # User profile pages
│       ├── context/            # CartContext, AuthContext
│       ├── components/         # Shared UI components (Modal, Toast, etc.)
│       ├── config/             # API base URL config
│       └── styles/             # Global & page-level CSS
│
└── README.md
```

---

## 🔌 Key API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/login` | Public | User login |
| `POST` | `/api/auth/register` | Public | User registration |
| `GET` | `/api/products` | Public | Get all products |
| `GET` | `/api/categories` | Public | Get all categories |
| `POST` | `/api/promo/validate` | Public | Validate & calculate promo code discount |
| `POST` | `/api/orders` | Auth | Place an order (increments promo usedCount) |
| `GET` | `/api/orders/my` | Auth | Get current user's order history |
| `GET` | `/api/admin/stats` | Admin/Manager | Dashboard analytics |
| `GET` | `/api/admin/promo` | Admin | List all promo codes |
| `POST` | `/api/admin/promo` | Admin | Create a new promo code |
| `PUT` | `/api/admin/promo/:id` | Admin | Update a promo code |
| `DELETE` | `/api/admin/promo/:id` | Admin | Delete a promo code |
| `POST` | `/api/payment/hash` | Auth | Generate PayHere payment hash |
| `POST` | `/api/payment/notify` | PayHere | Payment notification webhook |

---

## 🛡️ Role-Based Access

| Role | Permissions |
|------|-------------|
| `customer` | Browse, add to cart, checkout, manage profile & addresses |
| `store_manager` | All of the above + manage products, orders, and view inventory |
| `admin` | Full system control including user deletion, promo codes, and settings |

---

## 🎟️ Promo Code System

- Codes are validated **in real-time** via `POST /api/promo/validate` before checkout.
- The discount persists across all checkout steps using `sessionStorage`.
- On order placement, the backend **atomically increments** `usedCount` within the same database transaction as the order creation.
- Validation checks: `isActive`, `expiresAt`, `maxUses vs usedCount`, and `minOrderAmount`.
- Discount breakdown (code name + savings) is shown on the **Order Confirmation** page and included in the **downloadable PDF receipt**.

---

## ⚖️ License
© 2026 SoleVora Inc. All rights reserved. This project is for commercial footwear distribution.
