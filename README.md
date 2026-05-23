# 🚼 DevPulse API

## Internal Tech Issue & Feature Tracker

A collaborative backend platform for software teams to report bugs, suggest features, and coordinate resolutions.

---

# 🚀 Live Application

**Base URL:**
https://dev-pulse-lovat.vercel.app

---

# 📖 Project Overview

DevPulse is a robust, modular RESTful API built to help software teams manage internal technical issues and feature requests. Designed with a strict Object-Oriented Programming (OOP) approach and a layered architecture (Controllers, Services, Repositories), it ensures extreme maintainability and scalability.

A key technical highlight of this project is its uncompromising stance on database performance: it interacts with the database using the native PostgreSQL `pg` driver with Raw SQL queries—completely bypassing ORMs and Query Builders to maximize execution speed and maintain low-level control.

---

# ✨ Key Features & Highlights

## 🔐 Secure Authentication

JWT-based login and registration with robust bcrypt password hashing (10 salt rounds).

## 🛡️ Role-Based Access Control (RBAC)

### `contributor`

* Can report issues
* Can log in
* Can view all system tickets

### `maintainer`

* Elevated privileges to update status workflows
* Edit descriptions
* Permanently delete issues

## 📋 Issue Lifecycle Management

Complete CRUD operations for tracking bugs and feature requests.

## 🔍 Advanced Querying

Support for sorting (`newest` / `oldest`) and filtering issues by type and workflow status.

## ⚡ Raw Database Performance

Engineered entirely with raw parameterized SQL queries, completely eliminating ORM overhead and preventing SQL injection.

## 🚦 Centralized Error Handling

Global Express error-catching middleware for both synchronous and asynchronous application errors.

## 🦾 Type Safety

Built entirely with strict TypeScript, utilizing Interfaces and DTOs (Data Transfer Objects) for request and response validation.

---

# 🛠️ Technology Stack

| Category   | Technology Used                        |
| ---------- | -------------------------------------- |
| Runtime    | Node.js (LTS)                          |
| Language   | TypeScript                             |
| Framework  | Express.js                             |
| Database   | PostgreSQL                             |
| DB Driver  | `pg` (Node-Postgres) utilizing Raw SQL |
| Security   | `bcrypt`, `jsonwebtoken`, `cors`       |
| Deployment | Vercel                                 |

---

# 🗄️ Database Schema Summary

The relational database is constructed natively in PostgreSQL with two primary tables:

## 1. `users`

Manages authentication, system access, and roles.

### Fields

* `id` (PK)
* `name`
* `email` (Unique)
* `password` (Hashed)
* `role` (`contributor` / `maintainer`)
* `created_at`
* `updated_at`

---

## 2. `issues`

Stores the reported bugs and feature requests.

### Fields

* `id` (PK)
* `title`
* `description`
* `type` (`bug` / `feature_request`)
* `status` (`open` / `in_progress` / `resolved`)
* `reporter_id` (FK referencing `users`)
* `created_at`
* `updated_at`

---

# 🌐 API Endpoints Specification

## 🔹 Authentication

| Method | Endpoint           | Description                  | Access |
| ------ | ------------------ | ---------------------------- | ------ |
| POST   | `/api/auth/signup` | Register a new user account  | Public |
| POST   | `/api/auth/login`  | Authenticate and receive JWT | Public |

---

## 🔹 Issues

| Method | Endpoint          | Description                                                | Access                             |
| ------ | ----------------- | ---------------------------------------------------------- | ---------------------------------- |
| POST   | `/api/issues`     | Create a new bug or feature request                        | Authenticated                      |
| GET    | `/api/issues`     | Retrieve all issues (Supports `?sort`, `?type`, `?status`) | Public                             |
| GET    | `/api/issues/:id` | Retrieve detailed information for a specific issue         | Public                             |
| PATCH  | `/api/issues/:id` | Update an issue's details or workflow status               | Maintainer / Contributor (if open) |
| DELETE | `/api/issues/:id` | Permanently remove an issue from the system                | Maintainer                         |

> **Note:** All authenticated endpoints require an `Authorization: <JWT_TOKEN>` header.

---

# 💻 Local Development Setup

Follow these instructions to run the API on your local machine:

## 1. Clone the repository

```bash
git clone https://github.com/yourusername/devpulse.git
cd devpulse
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project's root directory and populate it with your credentials:

```env
PORT=5000
DATABASE_URL=postgres://your_user:your_password@localhost:5432/devpulse
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

---

## 4. Start the development server

```bash
npm run dev
```

---

## 5. Build for Production

```bash
npm run build
npm start
```

---

Built for the B7A2 DevPulse Assignment.