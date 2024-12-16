
[![Run Tests](https://github.com/Zindiks/sprinty/actions/workflows/test.yml/badge.svg)](https://github.com/Zindiks/sprinty/actions/workflows/test.yml)

# Sprinty

Sprinty is a task management application designed to streamline your workflow. With drag-and-drop (DnD) capabilities, Sprinty offers an intuitive way to organize boards, lists, cards, and task details for efficient project management.

## Purpose

The goal of this project is not just to build another task management app — there are plenty of those already. Instead, Sprinty focuses on utilizing available tools and frameworks to build a robust and solid project using best practices. This includes:

- Leveraging GitHub functionalities such as GitHub Actions, Issues, and Projects (link to project will be added).
- Demonstrating how to structure and maintain a modern codebase.
- Avoiding the use of external tools like Jira by fully utilizing GitHub Projects for task and issue tracking.
- Plans to implement CI/CD practices to ensure smooth and reliable deployments.
- Deploying the application to AWS for scalability and real-world hosting experience.

## Features

- **Boards**: Create and manage boards to categorize your projects.
- **Lists**: Organize tasks into lists within each board.
- **Cards**: Add cards to lists to represent individual tasks.
- **Drag-and-Drop**: Seamlessly move cards across lists or reorder them with an intuitive DnD interface.
- **Task Details**: View and edit detailed information about each task, such as descriptions, due dates, and more.
- **OAuth2 Authorization**: Secure user authentication and authorization using the OAuth2 protocol.

## Tech Stack

Sprinty leverages modern web technologies for a robust and scalable application:

### Frontend
- **React (TypeScript)**: For building a dynamic and responsive user interface.

### Backend
- **Fastify (TypeScript)**: A fast and lightweight Node.js framework for API development.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sprinty.git
   cd sprinty
   ```

2. Install dependencies:
   ```bash
   # For backend
   cd backend
   npm install

   # For frontend
   cd ../frontend
   npm install
   ```

### Running the Application

#### Backend (Fastify)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the Fastify server:
   ```bash
   npm run dev
   ```

3. The server will start at `http://localhost:3000` by default.

#### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the React development server:
   ```bash
   npm start
   ```

3. Open `http://localhost:3001` in your browser to access the application.

### Environment Variables

Create `.env` files in both the `backend` and `frontend` directories to configure the application. Example:

#### Backend (.env)
```
PORT=3000
DATABASE_URL=<your_database_url>
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3000
```

## Project Structure

### Backend
```
backend/
├── src/
│   ├── modules/
│   │   ├── <feature>/
│   │   │   ├── controller.ts
│   │   │   ├── model.ts
│   │   │   ├── route.ts
│   │   │   └── service.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── utils/
│   └── index.tsx
├── package.json
└── tsconfig.json
```

## Contributing

Contributions are welcome! If you'd like to contribute to Sprinty, please:
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push your branch and create a pull request.

## License

Sprinty is open-source software licensed under the [MIT License](LICENSE).

## Contact

For any questions or feedback, feel free to reach out at [your-email@example.com](mailto:your-email@example.com).

---

Start managing your tasks efficiently with Sprinty!
