# EstateFlow — Real Estate Property Management System (MERN Stack)

A centralized, enterprise-grade Real Estate Property Management platform engineered for a university Full Stack Development course project. Developed strictly using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) across 10 structured, incremental phases.

---

## 1. Technology Stack

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB with Mongoose ODM
* **Authentication**: JWT (JSON Web Tokens) & bcryptjs password hashing
* **Middleware**: CORS, Morgan (logger), Multer (file uploads)
* **Configuration**: dotenv

### Frontend
* **Core**: React.js (v18+)
* **Build Tool**: Vite
* **Routing**: React Router (v7+)
* **HTTP Client**: Axios (with centralized interceptors)
* **Styling**: Tailwind CSS with custom real-estate color system & glassmorphism
* **Icons**: Lucide React
* **Analytics / Visualizations**: Recharts

---

## 2. System Architecture

```
[ Client (React + Vite) ]
        │
    (Axios API)
        ▼
[ Express REST API ] ─── (CORS, Morgan, JSON Parser)
        │
  [ Middleware ] ─────── (JWT Auth, Role Guard, Error Handler)
        │
 [ Controllers ]
        │
  [ Services ]
        │
 [ Mongoose Models ]
        │
[ MongoDB Database ]
```

### Folder Organization

```
d:/SEM5 PROJECTS/FULL STACK/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Reusable Button, Card, Loader, etc.
│   │   │   ├── Navbar.jsx     # Responsive header & mobile drawer
│   │   │   ├── Footer.jsx     # Multi-column footer
│   │   │   └── BackendStatusBadge.jsx  # Live API/DB health indicator
│   │   ├── layouts/           # MainLayout & upcoming DashboardLayout
│   │   ├── pages/             # Home, Properties, Login, Register, About, Contact, NotFound
│   │   ├── services/          # Central Axios API instance with interceptors
│   │   ├── App.jsx            # React Router master configuration
│   │   ├── index.css          # Tailwind directives & glassmorphism utilities
│   │   └── main.jsx           # React DOM root entry
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── config/                # MongoDB Mongoose connection manager (db.js)
│   ├── controllers/           # Request controllers (healthController.js, etc.)
│   ├── middleware/            # Central errorHandler, notFound, auth
│   ├── models/                # Mongoose schemas (User, Property, Agreement, etc.)
│   ├── routes/                # Express routers (api.js, healthRoutes.js, etc.)
│   ├── uploads/               # Static user uploaded media directory
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Express app entry & HTTP server
├── .gitignore
├── package.json               # Root scripts for concurrent development
└── README.md
```

---

## 3. Environment Variables

### Backend (`server/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | HTTP Server Port | `5000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `MONGODB_URI` | MongoDB Connection URI | `mongodb://127.0.0.1:27017/realestate_db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `supersecretjwtkey_course_project_sem5_2026` |
| `CLIENT_URL` | Frontend client origin for CORS | `http://localhost:5173` |

### Frontend (`client/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base REST API URL | `http://localhost:5000/api` |

---

## 4. Getting Started & Installation

### Prerequisites
* **Node.js**: v18+ (tested on Node v24)
* **npm**: v9+ (tested on npm v11)
* **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

### Installation

1. Clone or open the repository workspace:
   ```bash
   cd "d:/SEM5 PROJECTS/FULL STACK"
   ```

2. Install all dependencies across root, server, and client:
   ```bash
   npm run install-all
   ```
   *(Or individually: `npm install` in root, `cd server && npm install`, `cd client && npm install`)*

3. Configure environment variables:
   * Copy `server/.env.example` to `server/.env`
   * Copy `client/.env.example` to `client/.env`

---

## 5. Running the Application

### Option A: Run Both Frontend & Backend Concurrently (Recommended)
From the root project directory:
```bash
npm run dev
```

### Option B: Run Individually
* **Start Backend API Server**:
  ```bash
  npm run server
  # or: cd server && npm run dev
  ```
  Backend runs at: `http://localhost:5000`  
  Health Check: `http://localhost:5000/api/health`

* **Start Frontend Client**:
  ```bash
  npm run client
  # or: cd client && npm run dev
  ```
  Frontend runs at: `http://localhost:5173`

* **Build Frontend for Production**:
  ```bash
  npm run build-client
  # or: cd client && npm run build
  ```

---

## 6. Phase 1 Verification & APIs

### Health Check Endpoint
* **Method**: `GET`
* **Route**: `/api/health`
* **Sample Response**:
  ```json
  {
    "success": true,
    "message": "Real Estate Management API is healthy",
    "data": {
      "status": "online",
      "timestamp": "2026-08-29T09:41:27.259Z",
      "uptimeSeconds": 48,
      "environment": "development",
      "serverPort": "5000",
      "database": {
        "status": "Connected",
        "code": 1,
        "name": "realestate_db",
        "host": "127.0.0.1"
      },
      "version": "1.0.0",
      "phase": "Phase 1: Project Setup & Architecture Scaffolding"
    }
  }
  ```

---

## 7. 10-Phase Course Roadmap

- [x] **Phase 1**: Project Setup & Foundation Architecture
- [ ] **Phase 2**: Authentication, Password Hashing & Role Management (Admin, Owner, Tenant)
- [ ] **Phase 3**: Property Model, Image Uploads (Multer) & Owner Property CRUD
- [ ] **Phase 4**: Advanced Search, Filtering & Public Property Catalog
- [ ] **Phase 5**: Inquiries, Visit Scheduling & Interaction Workflows
- [ ] **Phase 6**: Rental Agreements, Payment Tracking & Invoices
- [ ] **Phase 7**: Maintenance Requests & Notification Center
- [ ] **Phase 8**: Role-Specific Dashboards & Admin Analytics (Recharts)
- [ ] **Phase 9**: Security Hardening, Input Validation & Testing
- [ ] **Phase 10**: Finalization, Production Readiness & Deployment
