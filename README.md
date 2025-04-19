# 🏓 PingPro E-Commerce Backend

## Overview
PingPro is an e-commerce platform specializing in table tennis equipment. This repository contains the backend implementation, handling authentication, user management, product management, order processing, and cart functionality.

## Features

### 🔐 User Authentication
- JWT-based authentication.
- Refresh token mechanism for secure session management.
- User registration and login.
- Update user information.

### 🦹‍♂️ Admin Features
- CRUD operations for managing products.
- Update order status (processing, shipped, delivered, etc.).
- View all orders placed by customers.

### 🛒 Customer Features
- Browse and fetch product details.
- Add and manage products in the cart.
- Create new orders.
- Verify order details and status.

## 💻 Installation & Setup

### Prerequisites
- Node.js (Latest LTS version recommended)
- MongoDB (Local or Cloud-based instance)

### Steps to Install

1. Clone the repository:
   ```sh
   git clone https://https://github.com/hungdungn47/table-tennis-world-backend.git
   cd table-tennis-world-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
    PORT=''
    MONGO_DB_CONNECTION_STRING=''
    JWT_SECRET=''
    STRIPE_SECRET_KEY=''
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

## 🚀 Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, Refresh Tokens

## Contributing
Feel free to open an issue or submit a pull request if you have suggestions or improvements.
