# DevTinder

A full-stack developer networking platform inspired by Tinder, built to help developers discover other developers, explore profiles, and build meaningful professional connections.

<p align="center">
  <strong>Discover developers. Connect through interests. Build together.</strong>
</p>

<p align="center">
  <a href="https://devtinder-yfhj.onrender.com/">Live Demo</a> ·
  <a href="https://github.com/VikasKumar281/devTinder">Repository</a>
</p>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Application Workflow](#application-workflow)
- [Connection Request Lifecycle](#connection-request-lifecycle)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
- [Available Scripts](#available-scripts)
- [Core Concepts Explained](#core-concepts-explained)
- [Security Notes](#security-notes)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Author](#author)

## About the Project

**DevTinder** is a developer networking application inspired by swipe-based matching platforms. Instead of matching people for dating, the idea is to help developers find and connect with other developers.

Users can create an account, log in, view and edit their profiles, discover other developers, and send connection requests. A request can be reviewed and accepted, helping users build a network around shared technical interests and professional goals.

The project uses a Node.js and Express.js backend with MongoDB and Mongoose for data persistence. The repository also includes dependencies for authentication, validation, real-time communication, payments, and Google authentication; a dependency being present does not necessarily mean that its related feature is fully enabled in the current application.

## Problem Statement

Developers often find it difficult to discover peers who work with similar technologies, share professional interests, or want to collaborate on projects.

DevTinder aims to provide a dedicated place where developers can:

- Discover other developer profiles.
- Present their skills and professional interests.
- Express interest in connecting with another developer.
- Accept or reject incoming connection requests.
- Build a professional developer network.

## Features

The following capabilities are represented by the repository's documented API routes:

- **Account registration:** Create an account through the signup endpoint.
- **User login and logout:** Authenticate and end a session through the documented authentication routes.
- **Profile viewing:** Retrieve the authenticated user's profile.
- **Profile editing:** Update profile information.
- **Password update:** Use the documented password endpoint to update the password.
- **Developer discovery:** Retrieve a feed of users.
- **Connection requests:** Send a request with a supported request status.
- **Request review:** Review and accept a connection request.
- **Connections list:** Retrieve the user's connections.

> Note: The API list documents an accepted-request review endpoint. Although `rejected` appears in the documented status values, verify the implementation in the source code before assuming that every review action is available.

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime for the server |
| Express.js | HTTP server and API routing |
| MongoDB | Document-oriented database |
| Mongoose | MongoDB object modelling |
| JavaScript | Application programming language |
| JSON Web Token (JWT) | Token-based authentication dependency |
| bcrypt | Password hashing dependency |
| dotenv | Environment variable configuration |
| cookie-parser | Cookie parsing middleware |
| cors | Cross-origin resource sharing |
| validator | Input validation utilities |
| Nodemon | Restarts the server during development |

The `package.json` also lists Axios, Google Auth Library, node-cron, Socket.IO, and Stripe. These are listed as project dependencies; consult the implementation before describing them as active application features.

## Project Structure

The repository currently exposes this top-level structure:

```text
devTinder/
├── src/
├── .env.example
├── .gitignore
├── apiList.md
├── package-lock.json
└── package.json
```

### Important files

| File or directory | Responsibility |
|---|---|
| `src/` | Application source code |
| `.env.example` | Template for required environment variables |
| `.gitignore` | Files and folders Git should ignore |
| `apiList.md` | Documented API endpoints |
| `package.json` | Project metadata, dependencies, and scripts |
| `package-lock.json` | Locks dependency versions for repeatable installs |

The internal contents of `src/` are not expanded here because the repository's source files have not been independently reviewed for this documentation.

## Application Workflow

At a high level, the documented API supports this workflow:

1. A new user registers through `POST /signup`.
2. The user logs in through `POST /login`.
3. The user views their profile through `GET /profile/view`.
4. The user can update profile details through `PATCH /profile/edit`.
5. The user discovers developers through `GET /user/feed`.
6. The user sends a connection request through `POST /request/send/:status/:touserId`.
7. The recipient can review and accept a request through `POST /request/review/accepted/:requestId`.
8. The user can view received requests and established connections through the corresponding user endpoints.
9. The user can log out through `POST /logout`.

The exact screens, frontend behavior, response payloads, and authorization rules should be confirmed against the implementation.

## Connection Request Lifecycle

The API documentation lists these request status values:

| Status | Meaning |
|---|---|
| `ignored` | The request is marked as ignored |
| `interested` | The sender expresses interest in connecting |
| `accepted` | The request is accepted |
| `rejected` | The request is rejected |

A typical conceptual flow is:

```text
Developer A
    |
    | Sends an interested request
    v
Connection Request
    |
    | Recipient reviews the request
    v
Accepted / Rejected / Ignored
    |
    v
Developer connections
```

This diagram explains the status vocabulary documented in `apiList.md`; it is not a substitute for checking the actual state-transition rules in the source code.

## API Documentation

The following endpoints are listed in the repository's `apiList.md`.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/signup` | Register a user |
| `POST` | `/login` | Log in a user |
| `POST` | `/logout` | Log out a user |

### Profile

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/profile/view` | View the user's profile |
| `PATCH` | `/profile/edit` | Edit profile details |
| `PATCH` | `/profile/password` | Password update endpoint; the API list comments on it as a forgot-password API |

### Connection Requests

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/request/send/:status/:touserId` | Send a request with a status to a target user |
| `POST` | `/request/review/accepted/:requestId` | Review and accept a request |

### User

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/user/requests/recieved` | Retrieve received requests (route spelling as documented in the repository) |
| `GET` | `/user/connections` | Retrieve connections |
| `GET` | `/user/feed` | Retrieve the developer feed |

> **Important:** These paths are reproduced from `apiList.md`. The router mount prefixes, request body schemas, response formats, authentication requirements, and HTTP status codes are not specified here. Check the source code or API testing collection for those details.

## Environment Variables

Create a `.env` file in the project root and configure the variables below.

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port on which the server listens | `7777` |
| `DB_CONNECTION_SECRET` | MongoDB connection string | Your MongoDB URI |
| `JWT_SECRET` | Secret used for signing/verifying JWTs | A long, random secret |
| `MAIL_TO` | Email address used by the application configuration | `your_email@example.com` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Your Google client ID |

Example `.env` file:

```env
PORT=7777
DB_CONNECTION_SECRET=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
MAIL_TO=your_email@example.com
GOOGLE_CLIENT_ID=your_google_client_id
```

Never commit your real `.env` file, database credentials, JWT secret, OAuth credentials, or other private keys to GitHub.

## Installation and Setup

### 1. Install prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/) — JavaScript runtime.
- npm — package manager included with Node.js.
- [MongoDB Atlas](https://www.mongodb.com/atlas) or a local MongoDB server — database service.
- [Git](https://git-scm.com/) — version control.

### 2. Clone the repository

```bash
git clone https://github.com/VikasKumar281/devTinder.git
```

### 3. Open the project directory

```bash
cd devTinder
```

### 4. Install dependencies

```bash
npm install
```

This command reads `package.json` and installs the project's dependencies.

### 5. Configure environment variables

Create a `.env` file in the root directory. Copy the variable names from `.env.example` and provide your own valid values.

Make sure the MongoDB connection string points to a database you are allowed to use.

### 6. Start the development server

```bash
npm run dev
```

The development script runs `src/app.js` with Nodemon. Nodemon watches for file changes and restarts the Node.js process.

### 7. Start the application normally

```bash
npm start
```

The start script runs `node src/app.js`.

The configured port in the example environment file is `7777`. The actual startup message and available host URL depend on the application code and your environment.

## Available Scripts

These scripts are defined in `package.json`:

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the app with Nodemon |
| `npm start` | Start the app with Node.js |
| `npm run seed` | Run `src/utils/seedFeed.js` |

Use the seed command only after reviewing what the seed script writes to the database. Avoid running it against production data unless you understand its effects.

## Core Concepts Explained

### Node.js

Node.js is a JavaScript runtime that allows JavaScript to run outside the browser. In this project, it runs the backend application.

### Express.js

Express.js is a Node.js web framework. It helps define API routes, process HTTP requests, apply middleware, and send responses.

### REST API

A REST API exposes resources through HTTP endpoints. Common HTTP methods include:

- `GET` — retrieve data.
- `POST` — create data or trigger an operation.
- `PATCH` — partially update existing data.
- `DELETE` — delete a resource.

### MongoDB

MongoDB is a NoSQL database that stores information in flexible, document-oriented records.

### Mongoose

Mongoose is an Object Data Modeling (ODM) library for MongoDB. It provides schemas, models, validation, and methods for interacting with MongoDB documents.

### Authentication and Authorization

- **Authentication** verifies who a user is, for example during login.
- **Authorization** determines what an authenticated user is allowed to do.
- **JWT** is a token format commonly used to represent claims between systems.
- **bcrypt** is a password-hashing library. Passwords should be hashed rather than stored as plain text.

The dependencies indicate that JWT and bcrypt are available in this project. The precise implementation and configuration should be verified in the source code.

### Middleware

Middleware is a function that can inspect or modify a request and response, end the request-response cycle, or pass control to the next middleware. Express applications commonly use middleware for authentication, parsing, logging, and error handling.

### Environment Variables

Environment variables keep configuration outside source code. They are useful for managing secrets and different settings across development and production environments.

## Security Notes

- Keep `.env` out of version control.
- Use a strong, unique JWT secret.
- Store passwords using a secure password-hashing approach; never store plain-text passwords.
- Validate and sanitize user-provided input.
- Restrict database credentials and production access.
- Configure CORS for the frontend origins that should be allowed.
- Use HTTPS in production.
- Avoid exposing secrets or sensitive user information in API responses and logs.

These are recommended security practices, not a claim that every item is already implemented.

## Deployment

The repository's About section currently links to this live deployment:

**Live application:** https://devtinder-yfhj.onrender.com/

For a fresh deployment on a Node.js hosting provider such as Render:

1. Push the project to GitHub.
2. Create a new Web Service and connect the repository.
3. Select the appropriate Node.js runtime.
4. Set the build command to `npm install`.
5. Set the start command to `npm start`.
6. Add the required environment variables in the hosting provider's dashboard.
7. Ensure the MongoDB database accepts connections from the deployed service.
8. Deploy and inspect the service logs.
9. Test signup, login, profile, feed, and connection-request endpoints.

If the hosting provider supplies a `PORT` environment variable, make sure the application listens on the host-provided port. Confirm the port-handling logic in `src/app.js` before deployment.

## Future Improvements

Potential enhancements for a developer networking platform include:

- Add richer developer profiles with skills, interests, experience, and portfolio links.
- Add filters for technologies, roles, and collaboration interests.
- Add pagination or infinite scrolling to the developer feed.
- Add complete request review actions and clear request-state feedback.
- Add automated tests for authentication, profile, and connection APIs.
- Add API documentation with request and response examples.
- Add structured logging and centralized error handling.
- Add accessibility and responsive-design improvements.
- Add real-time messaging if the product roadmap requires it.

These are suggestions for future development, not confirmed existing features.

## Author

**Vikas Kumar**

- GitHub: [VikasKumar281](https://github.com/VikasKumar281)
- LinkedIn: [Vikas Kumar](https://www.linkedin.com/in/vikaskumar-fullstack/)

---

If you find this project useful, consider giving the repository a star ⭐.
