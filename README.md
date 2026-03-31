# SoleVora Full-Stack Workspace

This project is a modern integrated solution with a React frontend and Node.js backend.

## Project Structure

- `frontend/`: React + Vite with premium UI.
- `frontend/src/pages/profile/`: Account area (dashboard, orders, wishlist, addresses, settings).
- `backend/`: Node.js + Express with modular configuration.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

To install dependencies for both frontend and backend:

```bash
npm run install-all
```

### Development

To start both servers concurrently:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Features

- **Premium Design**: Dark mode by default with Glassmorphism and smooth gradients.
- **Backend Connectivity**: Automatic status check between frontend and backend.
- **Modern Stack**: Vite, Express, and ESM modules.

## PayHere sandbox (testing)

Use these card numbers **only in sandbox** (`sandbox: true`) with your **sandbox** Merchant ID and Merchant Secret from [sandbox.payhere.lk](https://sandbox.payhere.lk). Use any cardholder name, a **future** expiry date, and any valid CVV (3 digits; Amex often 4).

| Result | Visa | Mastercard | Amex |
|--------|------|------------|------|
| Success | 4916217501611292 | 5307732125531191 | 346781005510225 |
