# 📚 AuraReads - Premium Book Review Platform

AuraReads is a full-stack, premium book review platform built with a modern tech stack. It features a robust Role-Based Access Control (RBAC) system, allowing standard users to discover books and submit reviews, while granting Administrators a dedicated console to manage content and moderate community reviews.

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Distinct privileges for `Admin` and `User` accounts.
* **Intelligent Trending Algorithm:** The home page dynamically displays the Top 5 books sorted by highest average community rating, using release date as a tie-breaker.
* **Community Moderation System:** User reviews are placed in a "Pending" queue by default. They only become visible to the public once explicitly approved by an Admin.
* **Full Library Management (CRUD):** Admins can add, edit, and safely delete books from the database.
* **Secure Authentication:** Custom-built authentication using JSON Web Tokens (JWT) and Bcrypt password hashing.
* **Premium UI/UX:** A highly responsive, dark-themed interface built with Next.js App Router and Tailwind CSS, featuring interactive dropdowns, animated badges, and dynamic UI states.

## 🛠️ Tech Stack

**Frontend:**

* Next.js (React Framework - App Router)
* Tailwind CSS (Styling)
* Axios (API Requests)
* TypeScript

**Backend:**

* Node.js & Express.js (REST API)
* MongoDB & Mongoose (NoSQL Database & Object Modeling)
* JSON Web Token (JWT) (Session Management)
* Bcrypt.js (Security/Encryption)

---

## 🚀 Local Setup & Installation

Follow these steps to run the project locally on your machine.

### Prerequisites

* [Node.js](https://nodejs.org/) installed on your machine.
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and database connection string.

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
```
Install the dependencies:

'''bash
npm install
'''
Create a .env file in the root of the backend folder and add your environment variables:

'''bash
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secret_key_here
'''

Start the backend development server:

'''bash
npm run dev
'''

### 2. Frontend Setup

Open a second terminal and navigate to the frontend directory:

'''bash
cd frontend
'''

Install the dependencies:

'''bash
npm install
'''

Start the frontend development server:

'''bash
npm run dev
'''

## 📂 Folder Structure Overview

```text
AuraReads/
│
├── backend/                  # Express.js API
│   ├── controllers/          # Business logic (Auth, Books, Reviews)
│   ├── middleware/           # RBAC & JWT Security validation
│   ├── models/               # MongoDB Mongoose Schemas
│   ├── routes/               # API Endpoints
│   └── server.js             # Entry point & Database connection
│
└── frontend/                 # Next.js Application
    ├── app/                  # Pages & Routing (Home, Login, Admin, Library)
    ├── components/           # Reusable UI (Navbar, ReviewForm)
    ├── lib/                  # Axios configuration & Token interceptors
    └── tailwind.config.ts    # Styling configuration
```