## Getting Started

> **Last Updated:** 2025-11-17

This guide will help you set up and run Sprinty locally for development.

---

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v22 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
  - *Alternative: Use Docker Compose to run PostgreSQL (recommended)*
- **Git** - [Download](https://git-scm.com/downloads)
- **Docker & Docker Compose** (optional, but recommended) - [Download](https://www.docker.com/products/docker-desktop)

---

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Zindiks/sprinty.git
cd sprinty
```

#### 2. Install Dependencies

**Backend:**
```bash
cd api
npm install
```

**Frontend:**
```bash
cd client
npm install
```

---

### Configuration

#### Backend Environment Variables

1. Create a `.env` file in the `api/` directory:

```bash
cd api
cp .env.example .env  # If .env.example exists
# OR create .env manually
```

2. Add the following environment variables to `api/.env`:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sprinty
DB_USER=postgres
DB_PASSWORD=postgres

# GitHub OAuth (Required for authentication)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:4000/api/v1/oauth/callback

# Session Secret
SESSION_SECRET=your_random_session_secret_here

# CORS Origins (Frontend URL)
CORS_ORIGIN=http://localhost:5173

# Optional: Redis (if not using Docker)
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### Frontend Environment Variables

1. Create a `.env` file in the `client/` directory:

```bash
cd client
cp .env.example .env  # If .env.example exists
# OR create .env manually
```

2. Add the following environment variables to `client/.env`:

```env
# API URL
VITE_API_URL=http://localhost:4000

# WebSocket URL (usually same as API URL)
VITE_WS_URL=http://localhost:4000
```

#### GitHub OAuth Setup

To enable authentication, you need to create a GitHub OAuth App:

1. Go to GitHub: **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Fill in the details:
   - **Application name**: Sprinty Local
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:4000/api/v1/oauth/callback`
3. Click **Register application**
4. Copy the **Client ID** and **Client Secret** to your `api/.env` file

---

### Database Setup

You have two options for setting up the database:

#### Option 1: Using Docker Compose (Recommended)

This will start PostgreSQL, Redis, Prometheus, and Grafana automatically:

```bash
cd api
docker-compose up -d
```

Services will be available at:
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`
- **Prometheus**: `http://localhost:9090`
- **Grafana**: `http://localhost:3030`

#### Option 2: Using Local PostgreSQL

If you prefer to use a local PostgreSQL installation:

1. Create a database:
```bash
psql -U postgres
CREATE DATABASE sprinty;
\q
```

2. Update the `DB_*` variables in `api/.env` with your database credentials.

#### Run Migrations

After the database is set up, run the migrations to create the schema:

```bash
cd api
npm run knex:migrate
```

#### (Optional) Seed the Database

To populate the database with sample data for development:

```bash
npm run knex:seed
```

---

### Running the Application

#### Start the Backend (API)

1. Navigate to the `api` directory:
   ```bash
   cd api
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The API will start at **`http://localhost:4000`**

4. Access Swagger API documentation at **`http://localhost:4000/docs`**

#### Start the Frontend (Client)

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The client will start at **`http://localhost:5173`**

4. Open your browser and go to **`http://localhost:5173`**

---

### Verify Installation

#### Check API Health

Open your browser or use curl:

```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "OK"
}
```

#### Check Database Connection

The API logs should show:
```
[INFO] Connected to database
[INFO] Server listening at http://localhost:4000
```

#### Test Frontend

1. Open `http://localhost:5173` in your browser
2. You should see the Sprinty home page
3. Click "Login with GitHub" to test authentication

---

### Common Issues & Troubleshooting

#### Database Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:
- Ensure PostgreSQL is running
- If using Docker: `docker-compose ps` should show `postgres` as running
- Verify database credentials in `api/.env`

#### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::4000`

**Solution**:
- Another process is using port 4000 or 5173
- Find and kill the process:
  ```bash
  # On macOS/Linux
  lsof -ti:4000 | xargs kill -9
  lsof -ti:5173 | xargs kill -9

  # On Windows
  netstat -ano | findstr :4000
  taskkill /PID <process_id> /F
  ```
- Or change the port in `.env` files

#### GitHub OAuth Error

**Error**: `OAuth callback error`

**Solution**:
- Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in `api/.env`
- Ensure callback URL matches: `http://localhost:4000/api/v1/oauth/callback`
- Check that your GitHub OAuth App settings are correct

#### Migration Errors

**Error**: `Migration file not found`

**Solution**:
```bash
cd api
npm run knex:migrate:rollback
npm run knex:migrate:latest
```

---

### Development Workflow

#### Running Tests

**Backend tests:**
```bash
cd api
npm test
```

**Frontend tests** (not yet implemented):
```bash
cd client
npm test
```

#### Database Operations

**Create a new migration:**
```bash
cd api
npm run knex:migrate:make migration_name
```

**Rollback last migration:**
```bash
npm run knex:migrate:rollback
```

**Check migration status:**
```bash
npm run knex:migrate:status
```

#### Code Formatting

**Format backend code:**
```bash
cd api
npm run format
```

**Format frontend code:**
```bash
cd client
npm run format
```

#### Linting

**Lint backend:**
```bash
cd api
npm run lint
```

**Lint frontend:**
```bash
cd client
npm run lint
```

---

### Docker Compose Services

If you're using Docker Compose, here are the available services:

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| API | 4000 | http://localhost:4000 | Fastify backend server |
| PostgreSQL | 5432 | localhost:5432 | Database |
| Redis | 6379 | localhost:6379 | Caching layer |
| Prometheus | 9090 | http://localhost:9090 | Metrics collection |
| Grafana | 3030 | http://localhost:3030 | Metrics visualization |

**Useful Docker commands:**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild services
docker-compose up --build

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

### Next Steps

After installation:

1. ✅ **Explore the application** - Create boards, lists, and cards
2. ✅ **Read the documentation** - Check out [FEATURES.md](FEATURES.md) and [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
3. ✅ **Review the code** - Familiarize yourself with the codebase structure
4. ✅ **Check the roadmap** - See [INCOMPLETE_FEATURES_AND_ROADMAP.md](INCOMPLETE_FEATURES_AND_ROADMAP.md)
5. ✅ **Contribute** - Follow the [Contributing Guidelines](../README.md#contributing)

---

### Additional Resources

- **API Documentation**: http://localhost:4000/docs (Swagger UI)
- **Database Schema**: See `api/src/db/migrations/` and `docs/db_diagram_v1.png`
- **Real-Time Features**: See [REAL_TIME_COLLABORATION_PLAN.md](REAL_TIME_COLLABORATION_PLAN.md)
- **GitHub Project**: https://github.com/users/Zindiks/projects/6

---

*Last updated: 2025-11-17*
