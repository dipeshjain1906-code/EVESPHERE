# EveSphere

EveSphere is a full-stack event discovery and booking platform built with the MERN stack. It allows users to discover events, verify their accounts and booking requests through email OTPs, monitor booking status, and cancel bookings. Administrators can create and manage events, review booking requests, update payment status, and view booking statistics from a dedicated dashboard.

**Live Demo:** [https://evesphere-i9r2.vercel.app/](https://evesphere-i9r2.vercel.app/)

## Features

### User features

- Browse upcoming events and search by title
- View event details, pricing, location, date, and seat availability
- Register and verify an account using an email OTP
- Sign in with JWT-based authentication
- Recover an account through an OTP-based password reset flow
- Request an event booking using email OTP verification
- Track pending, confirmed, and cancelled bookings
- View payment status and cancel a booking

### Administrator features

- Role-protected admin dashboard
- Create and delete events
- Review all booking requests
- Approve bookings as paid or non-paid
- Reject or cancel bookings
- Track total confirmed revenue, unique paid clients, and pending requests
- Monitor available seats for each event

## Technology Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, Tailwind CSS, React Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens, bcryptjs |
| Email | Nodemailer with Gmail |
| Deployment | Vercel |

## Project Structure

## Project Structure

```text
EVESPHERE/
├── api/
│   └── index.js                 # Vercel serverless entry point
├── client/
│   ├── src/
│   │   ├── components/          # Shared interface components
│   │   ├── context/             # Authentication context
│   │   ├── pages/               # Public, user, and admin pages
│   │   └── utils/               # Axios API client
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── controllers/             # Authentication, event, and booking logic
│   ├── middleware/              # JWT and administrator authorization
│   ├── models/                  # User, Event, Booking, and OTP schemas
│   ├── routes/                  # REST API routes
│   ├── utils/                   # Email utilities
│   ├── index.js                 # Express application
│   ├── seed.js                  # Development/demo data seeder
│   └── package.json
├── package.json                 # Root development and build scripts
└── vercel.json                  # Production build and routing configuration
```

## Local Setup

### Prerequisites

- Node.js and npm
- A MongoDB connection URI
- A Gmail account configured for Nodemailer authentication

### 1. Clone the repository

```bash
git clone https://github.com/dipeshjain1906-code/EVESPHERE.git
cd EVESPHERE
```

### 2. Install dependencies

Install the root, backend, and frontend dependencies:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 3. Configure environment variables

Create `server/.env`:

```env
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_credential
PORT=5000
```

`PORT` is optional and defaults to `5000`. Do not commit the `.env` file or expose these values publicly.

### 4. Start the application

Run the frontend and backend together from the repository root:

```bash
npm run dev
```

The Vite development server proxies `/api` requests to the Express server at `http://localhost:5000`.

### Optional: seed development data

```bash
cd server
node seed.js
```

> **Warning:** The seed script deletes existing users, events, bookings, and OTP records before creating demo data. Run it only against a development or testing database.

## Usage

1. Create an account and enter the OTP sent to the registered email address.
2. Browse or search the available events.
3. Open an event and request a booking OTP.
4. Submit the OTP to create a pending booking request.
5. Track or cancel the request from the user dashboard.
6. An administrator can review the request, mark its payment status, and confirm or reject it.
7. A confirmed booking reduces the event's available-seat count and sends a confirmation email.

Payment status is currently recorded manually by an administrator; the project does not integrate an external payment gateway.

## Available Scripts

Run these commands from the repository root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the client and server concurrently |
| `npm run server` | Start the backend in development mode |
| `npm run client` | Start the Vite frontend |
| `npm run build` | Install client/server dependencies and build the frontend |

Additional package-specific commands:

| Command | Description |
| --- | --- |
| `npm run build --prefix client` | Create the production frontend build |
| `npm run preview --prefix client` | Preview the frontend production build locally |
| `npm start --prefix server` | Start the Express server with Node.js |

## Deployment

EveSphere is deployed on Vercel as a combined frontend and serverless backend:

- The React application is built into `client/dist`.
- Requests under `/api/*` are rewritten to `api/index.js`, which exports the Express application.
- Other requests are rewritten to `index.html` so React Router can handle client-side routes.
- MongoDB connections are reused where possible across warm serverless invocations.
- `/api/health` checks the backend, while `/api/health/db` and `/api/db` check the database connection.

The following variables must be configured in the Vercel project settings:

```text
MONGODB_URI
JWT_SECRET
EMAIL_USER
EMAIL_PASS
```

## Future Improvements

- Add atomic seat updates and database transactions for concurrency-safe confirmations
- Add request validation, rate limiting, and stronger OTP protections
- Add a unique user-event booking index
- Integrate an external payment provider with verified webhooks
- Add pagination and indexed event search
- Add automated unit, API integration, concurrency, and end-to-end tests
- Add structured logging and production monitoring

## License

The backend package is configured with the **ISC License**. Add a root `LICENSE` file before distributing the complete repository under this license.
