# 📚 AuraReads

AuraReads is a modern, full-stack book library and community review platform. It features a sleek dark-themed UI, secure Role-Based Access Control (RBAC), and seamless OAuth integration, allowing users to browse books, submit reviews, and administrators to manage the platform.

#### **🌐 Live Demo:** [https://aurareads.vercel.app](https://aurareads.vercel.app)
---

## ✨ Key Features

### 🛡️ Secure Authentication & RBAC
* **Multi-Provider Login:** Users can register manually via JWT or log in instantly using **Google** or **GitHub** OAuth (powered by Passport.js).
* **Role-Based Access Control (RBAC):** Strict separation between standard `User` and `Admin` roles.
* **Middleware Protection:** Custom backend bouncers verify JWTs and restrict sensitive API routes exclusively to Admin users.

### 👤 User Profile Management
* **Personalized Dashboard:** Users can update their display name and email address through a dedicated, sleek profile settings page. Changes are processed securely on the backend and reflected instantly across the platform.
* **Secure Password Updates:** Features a robust security check that mandates verifying the current password before a new one can be established. The system includes front-end validation to ensure new passwords match before submission.
* **Account Deletion:** Users maintain full sovereignty over their data with a permanent account deletion feature accessible directly from their profile. This action securely wipes sensitive user credentials from the database.
* **Smart Fallbacks:** When an account is deleted, community reviews are preserved but automatically attributed to a "[Deleted User]" to maintain platform integrity.

### 👑 Admin Console & Moderation
* **User Management Dashboard:** Admins can view all registered users and promote/revoke Admin privileges with a single click.
* **Content Moderation:** Dedicated queue to review, approve, or reject user-submitted book reviews.
* **Book Management:** Full CRUD (Create, Read, Update, Delete) capabilities to maintain the library's catalog.

### 📖 Dynamic Library & UX
* **Real-Time Search:** Lightning-fast frontend filtering allows users to search the library by book title or author instantly.
* **Dynamic Book Covers:** Supports both uploaded cover images and fallback dynamic CSS gradients based on user-selected colors.
* **Fully Responsive:** Sleek, modern, Tailwind CSS-powered interface optimized for both desktop and mobile devices.

### 📊 Permissions Matrix

| Permission | Admin | User | Guest |
| :--- | :---: | :---: | :---: |
| **Browse Books & Read Reviews** | ✅ | ✅ | ✅ |
| **Create an Account / Login** | ✅ | ✅ | ✅ |
| **Submit Book Reviews** | ✅ | ✅ | ❌ |
| **Edit Profile & Password** | ✅ | ✅ | ❌ |
| **Delete Own Account** | ✅ | ✅ | ❌ |
| **Add / Edit / Delete Books** | ✅ | ❌ | ❌ |
| **Approve / Reject Reviews** | ✅ | ❌ | ❌ |
| **Promote / Demote Users** | ✅ | ❌ | ❌ |
---

## 🛠️ Tech Stack

**Frontend:**
* [Next.js](https://nextjs.org/) (React Framework)
* [Tailwind CSS](https://tailwindcss.com/) (Styling)
* Axios (API Client)

**Backend:**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/) & Mongoose (Database & ODM)
* JWT (JSON Web Tokens) & [bcryptjs](https://www.npmjs.com/package/bcryptjs) (Manual Auth)
* [Passport.js](https://www.passportjs.org/) (Google & GitHub OAuth 2.0)

---

## 🚀 Getting Started (Local Development)

To run this project locally, you will need Node.js and a MongoDB Atlas cluster.

### 1. Clone the repository
```bash
git clone https://github.com/monu754/AuraReads.git
cd AuraReads
```

### 2. Backend Setup

Navigate to the backend directory, install dependencies, and set up your environment variables.

```bash
cd backend
npm install
```

Create a .env file in the backend root:

```bash
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret 
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```
Create a .env.local file in the frontend root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Start the frontend server:

```bash
npm run dev
````
The application will now be running at http://localhost:3000

## 🔒 Becoming an Admin Locally

For security, public registration automatically defaults all new accounts to the User role. To access the Admin Console locally:

- Create an account via the frontend.
- Open your MongoDB Atlas Dashboard.
- Navigate to your users collection.
- Edit your user document and change the role field from "User" to "Admin".
- Log out and log back in on the frontend. You now have full Admin access!

## 📂 Core Project Structure

```text
AuraReads/
├── backend/
│   ├── config/         # Passport OAuth strategies & DB connection
│   ├── controllers/    # API Logic (Auth, Books, Reviews)
│   ├── middleware/     # JWT Verification & Role-Checking (isAdmin)
│   ├── models/         # MongoDB Schemas
│   ├── routes/         # Express API Routes
│   └── server.js       # Express App Entry Point
│
└── frontend/
    ├── app/
    │   ├── admin/      # Protected Admin Dashboard & User Management
    │   ├── book/       # Individual Book Pages
    │   ├── library/    # Public Library Grid
    │   ├── login/      # Unified Login/Register & OAuth redirect handler
    │   └── page.tsx    # Landing Page
    ├── components/     # Reusable UI (Navbar, etc.)
    └── lib/            # Axios API Configuration