**Prisma TypeScript Authentication API**
A Node.js API built with TypeScript, Prisma, and Express, featuring JWT-based authentication with role-based access control for user, admin, and superadmin roles. The application includes two database models (User and Admin) and protected routes with middleware for authentication.
Features

Database: Prisma ORM with User and Admin tables (id, name, email, password, role).
Authentication: JWT-based authentication with bcrypt for password hashing.
Role-Based Access:
user: Access to user-specific routes.
admin: Access to admin and user routes.
superadmin: Access to all routes.


Endpoints: User/admin signup, login, and protected routes.
Middleware: Authentication middleware to verify JWT and roles.

Tech Stack

Node.js: Runtime environment.
TypeScript: For type-safe JavaScript.
Express: Web framework for API routes.
Prisma: ORM for database management.
JWT: JSON Web Tokens for authentication.
bcrypt: Password hashing.
Database: Configurable (PostgreSQL, MySQL, SQLite, etc.).

File Structure
project-root/
├── prisma/
│   ├── migrations/        # Prisma migration files
│   └── schema.prisma      # Prisma schema
├── src/
│   ├── auth.ts            # JWT and password utilities
│   ├── index.ts           # Express server and routes
│   └── middleware.ts      # Authentication middleware
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file

Prerequisites

Node.js: v20.18.3 or higher
npm: v10 or higher
Database: PostgreSQL, MySQL, or SQLite (configured via DATABASE_URL)
Git: For cloning the repository

Setup Instructions

Clone the Repository:
git clone <repository-url>
cd <repository-name>


Install Dependencies:
npm install


Configure Environment Variables:

Create a .env file in the root directory:DATABASE_URL="your_database_connection_string"
JWT_SECRET="your_jwt_secret_key"


Replace your_database_connection_string with your database URL (e.g., postgresql://user:password@localhost:5432/dbname).


Set Up Prisma:

Initialize the database schema:npx prisma migrate dev --name init


Generate Prisma client:npx prisma generate




Compile and Run:

Compile TypeScript to JavaScript:npx tsc


Start the server:node dist/index.js


Alternatively, use nodemon for development:npm install --save-dev nodemon ts-node
npm run dev




Access the API:

The server runs on http://localhost:3000.



API Endpoints
User Signup

Method: POST
URL: /user/signup
Body:{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}


Response: { "token": "<jwt_token>" }

Admin Signup

Method: POST
URL: /admin/signup
Body:{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin" // or "superadmin"
}


Response: { "token": "<jwt_token>" }

Login

Method: POST
URL: /login
Body:{
  "email": "john@example.com",
  "password": "password123",
  "type": "user" // or "admin"
}


Response: { "token": "<jwt_token>" }

Protected Routes

Headers: Authorization: Bearer <jwt_token>
Endpoints:
GET /user/protected: Accessible by user, admin, or superadmin.
GET /admin/protected: Accessible by admin or superadmin.
GET /superadmin/protected: Accessible by superadmin only.


Response: { "message": "<route_message>", "user": { "id": number, "role": string } }

Testing

Use Postman, cURL, or Insomnia to test endpoints.
Example with cURL:curl -X POST http://localhost:3000/user/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'


View database data with Prisma Studio:npx prisma studio



Development

Scripts:
Build: npm run build (compiles TypeScript)
Start: npm start (runs node dist/index.js)
Dev: npm run dev (uses nodemon for auto-restart)


Add Features:
Create new models in schema.prisma and run npx prisma migrate dev.
Add routes in src/index.ts.
Enhance middleware in src/middleware.ts for custom permissions.



Deployment

Set Up a Database: Use a cloud provider (e.g., Neon, PlanetScale).
Deploy API:
Build: npm run build
Deploy to Render, Vercel, or AWS.
Set DATABASE_URL and JWT_SECRET in the hosting platform’s environment variables.


Secure:
Enable HTTPS.
Use a strong JWT_SECRET.
Add rate limiting with express-rate-limit.



Contributing

Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit changes (git commit -m "Add feature").
Push to the branch (git push origin feature-name).
Open a pull request.

License
MIT License. See LICENSE for details.
Contact
For issues or suggestions, open a GitHub issue or contact the maintainer.
