## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v22 or higher)
- **npm** or **yarn**

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Zindiks/sprinty.git
   cd sprinty
   ```

2. Install dependencies:
   ```bash
   # For backend
   cd api
   npm install
   ```
   ```bash
   # For frontend
   cd client
   npm install
   ```

### Running the Application

#### Backend (Fastify)

1. Navigate to the backend directory:

   ```bash
   cd api
   ```

2. Start the Fastify server:

   ```bash
   npm run dev
   ```

3. The server will start at `http://localhost:4000` by default.

#### Frontend (React)

1. Navigate to the frontend directory:

   ```bash
   cd client
   ```

2. Start the React development server:

   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser to access the application.

### Environment Variables

Create `.env` files in both the `backend` and `frontend` directories to configure the application. Example:

#### Backend (.env)

```
PORT=4000
DATABASE_URL=<your_database_url>
```

#### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5173
```
