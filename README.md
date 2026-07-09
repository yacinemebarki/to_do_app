# ToApp

A simple Express + MongoDB todo app with user sign-up and sign-in flows.

## Features

- User registration and login with email verification code
- Task creation with title, description, date/time, and completion status
- Task lists grouped by today, future, and past tasks
- MongoDB storage for users and tasks
- Basic frontend served from the `template/` directory

## Project Structure

- `server.js` - Express backend and API routes
- `public/` - frontend HTML, CSS, and JS files
- `model/user.js` - Mongoose schema for users
- `model/task.js` - Mongoose schema for tasks
- `.env` - local environment variables (not committed)

## API Endpoints

- `POST /verify` - verify email code
- `POST /sign_up` - request sign-up verification code
- `POST /sign_in` - request sign-in verification code
- `POST /user` - load user profile and task list
- `POST /add_task` - add a new task
- `POST /remove_task` - remove a task


## Notes

- This app uses Express static middleware to serve frontend files.
- The frontend expects the backend to be available on the same origin.
- If you deploy on Vercel, ensure your server and static assets are routed correctly.
