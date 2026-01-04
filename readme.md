# API Test Car

Small Node.js/TypeScript REST API for testing car/customer/dealer endpoints.

# 🚗 API Test Car

[![Node.js CI](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A small, well-structured Node.js + TypeScript REST API used for testing and demonstrating car/customer/dealer endpoints.

---

## ✨ Features

- TypeScript + Express server scaffold
- Authentication (JWT + refresh tokens)
- Customer and Dealer resources with controllers, services and validation
- Organized project layout for rapid development and testing
- Optional Swagger/OpenAPI spec at `swagger.json`

## 📚 Table of Contents

- [Quick Start](#-quick-start)
- [Environment](#-environment)
- [Scripts](#-scripts)
- [Project Layout](#-project-layout)
- [API Overview](#-api-overview)
- [Examples](#-examples)
- [Development](#-development)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Quick Start

1. Install dependencies

```bash
npm install
```

2. Create your `.env` (see the sample below) and start the server in development

```bash
npm run dev
```

Build and run in production mode:

```bash
npm run build
npm start
```

---

## 🔧 Environment (example)

Create a `.env` at the project root with at least the following keys:

```env
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
JWT_SECRET=your_jwt_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```

Adjust DB configuration to match your database provider.

---

## 🧭 Scripts

- `npm run dev` — start in development (with ts-node / nodemon)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run the compiled production build

Check `package.json` for exact script definitions.

---

## 🗂 Project Layout

- `src/`
  - `index.ts` — server entry point
  - `controllers/` — request handlers
  - `routes/` — express routes
  - `services/` — business logic
  - `models/` — data models
  - `middlewares/` — Express middleware (auth, error handling)
  - `validations/` — validation schemas
- `public/` — static files (e.g., `booking.html`)
- `scripts/` — helper/test scripts
- `swagger.json` — OpenAPI spec (if available)

---

## 📡 API Overview

- Auth: `/auth` (login, register, refresh)
- Customers: `/customers` — customer CRUD and queries
- Dealers: `/dealers` — dealer CRUD and queries

For exact routes and payloads, see the route files in `src/routes/` and controllers in `src/controllers/`.

---

## 📘 Examples

Authenticate and call a protected endpoint (example using `curl`):

```bash
# Login to receive access token
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"secret"}'

# Use token to list customers
curl http://localhost:3000/customers -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## 🧪 Testing & Scripts

- Small test scripts are available in `scripts/` (e.g., `test-customer-routes.ts`). Run via `node` or `ts-node` depending on your setup.

---

## 🛠 Development Notes

- Linting / formatting: check `package.json` for any configured tools
- API spec: `swagger.json` can be used to generate docs or import into Postman

---

## 🤝 Contributing

Contributions are welcome. Open an issue or a PR with a clear description and tests where applicable.

---

## 📜 License

This project is licensed under the MIT License.

---

If you'd like, I can also:

- Add an example `.env.example`
- Generate a Postman collection
- Add endpoint examples for each route

Enjoy! ✨
