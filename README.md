# TechStax

TechStax is a full-stack candidate registration and CV submission application. Candidates can share their contact details, expected daily rate, and a PDF or DOCX resume through a responsive web interface.

Submissions are stored in MongoDB and can optionally be forwarded by email and added to a Notion candidate database.

## Features

- Responsive React landing page and CV submission flow
- PDF and DOCX resume uploads
- Candidate data persistence with MongoDB
- Optional CV delivery through SMTP
- Optional candidate creation in Notion
- File type and upload-size validation
- Health-check endpoint
- CORS, Helmet, request logging, and centralized API error handling

## Tech stack

- **Frontend:** React, TypeScript, Vite, React Router, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Zod
- **Database:** MongoDB with Mongoose
- **Integrations:** Nodemailer and Notion API
- **Tooling:** npm workspaces and Concurrently

## Project structure

```text
techstax/
├── client/              # React and Vite frontend
├── server/              # Express API and MongoDB models
├── package.json         # Workspace scripts
├── PROJECT_OVERVIEW.md  # Product and architecture notes
└── README.md
```

## Prerequisites

- Node.js 20 or newer
- npm
- MongoDB, either installed locally or running through Docker

## Getting started

1. Clone the repository:

   ```bash
   git clone https://github.com/mayankinfocus22/techstax.git
   cd techstax
   ```

2. Install all workspace dependencies:

   ```bash
   npm install
   ```

3. Create the environment files:

   **macOS/Linux**

   ```bash
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```

   **Windows PowerShell**

   ```powershell
   Copy-Item client/.env.example client/.env
   Copy-Item server/.env.example server/.env
   ```

4. Replace the placeholder JWT secrets in `server/.env` with two different strings of at least 32 characters.

5. Start MongoDB. To run it with Docker:

   ```bash
   docker run -d --name techstax-mongodb -p 27017:27017 -v techstax-mongodb-data:/data/db mongo:8
   ```

6. Start the frontend and backend together:

   ```bash
   npm run dev
   ```

The application will be available at:

- Frontend: <http://localhost:5173>
- API: <http://localhost:4000>
- Health check: <http://localhost:4000/health>

## Environment variables

### Client

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | Base URL for frontend API requests | `http://localhost:4000/api/v1` |

### Server

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | No | Runtime environment |
| `PORT` | No | API port; defaults to `4000` |
| `CLIENT_URL` | No | Allowed frontend origin |
| `DATABASE_URL` | Yes | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Yes | Access-token secret, at least 32 characters |
| `JWT_REFRESH_SECRET` | Yes | Refresh-token secret, at least 32 characters |
| `UPLOAD_DIR` | No | Local upload directory |
| `MAX_UPLOAD_BYTES` | No | Maximum resume size in bytes |
| `SMTP_HOST` | No | SMTP server hostname |
| `SMTP_PORT` | No | SMTP port, usually `587` or `465` |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `SMTP_TO` | No | Recipient for candidate submissions |
| `SMTP_FROM` | No | Sender address |
| `NOTION_API_KEY` | No | Notion integration token |
| `NOTION_DATABASE_ID` | No | Destination Notion database ID |

Email and Notion settings are optional. Submissions are still saved to MongoDB when either integration is not configured.

The Notion database should contain these properties:

- `Name` — title
- `Email` — email
- `Phone` — phone number
- `Expected Daily Rate` — number
- `CV File` — URL

## API

### Submit a CV

```http
POST /api/v1/cv/submit
Content-Type: multipart/form-data
```

Form fields:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Candidate name |
| `email` | Yes | Valid email address |
| `phone` | No | Phone number |
| `expectedDailyRate` | No | Positive whole number |
| `resume` | Yes | PDF or DOCX file |

### Health check

```http
GET /health
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run the client and server in development mode |
| `npm run build` | Build both workspaces for production |
| `npm run typecheck` | Type-check the client and server |

## Production notes

- Use strong, unique JWT secrets.
- Use a managed MongoDB instance or a secured MongoDB deployment.
- Configure the production frontend URL in `CLIENT_URL`.
- Store secrets in your deployment platform rather than committing `.env` files.
- Serve uploaded files from durable object storage if the server filesystem is ephemeral.

## License

No license has been specified yet.
