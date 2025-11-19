# Akions Backend

Express-based API providing authentication, user management, and internship application endpoints.

## Features
- JWT auth (access + refresh)
- Role-based access (admin vs user)
- MongoDB (Mongoose) persistence for users, refresh tokens, and internship applications
- IP + timestamp tracking on login
- Admin endpoints for listing users, updating roles, viewing applications
- Internship application endpoints

## Endpoints
- `GET /api/health` – health check
- `POST /api/auth/register` – create user
- `POST /api/auth/login` – login (records IP + time)
- `POST /api/auth/refresh` – exchange refresh token for new access token
- `POST /api/auth/logout` – revoke refresh token
- `GET /api/auth/me` – current user profile
- `PUT /api/auth/profile` – update name / password
- `POST /api/auth/change-password` – change password
- `DELETE /api/auth/account` – delete account
- `GET /api/auth/users` (admin) – list users
- `PUT /api/auth/role` (admin) – update user role
- `POST /api/internships/apply` – apply to internship
- `GET /api/internships/applications/mine` – list current user's applications
- `GET /api/internships/applications` (admin) – list all applications

## Environment Variables
Create a `.env` file (see `.env.example`):
```
JWT_SECRET=super-secret-change-me
PORT=3000
MONGODB_URI=mongodb://localhost:27017/akions
```

## Scripts
Install dependencies (run inside backend folder):
```bash
npm install
```
Start server:
```bash
npm start
```
Dev with auto-reload (nodemon):
```bash
npm run dev
```

## Database
- Uses MongoDB via Mongoose.
- Configure `MONGODB_URI` in `.env`.
- Default local dev: `mongodb://localhost:27017/akions`.

## Security Notes
- Change `JWT_SECRET` in production.
- Add rate limiting & validation middleware.
- Store password hashes using bcrypt cost factor appropriate for target environment.

## Future Improvements
- Add refresh token rotation
- Add pagination for admin lists
- Add internship definition endpoints instead of static mock data
- Persist data in a database
