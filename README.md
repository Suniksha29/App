# Auth App - Login & Signup

A simple React authentication application built for a junior developer coding interview.

## Features

- **Login Page**
  - Email and password input fields
  - Basic email validation
  - Password minimum 6 characters
  - Show/Hide password toggle
  - Simple error messages

- **Signup Page**
  - Name, email, password, and confirm password fields
  - Basic form validation
  - Password match validation
  - Simple error messages

- **Navigation**
  - Switch between login and signup pages
  - Link at bottom of each form to switch pages

## Tech Stack

- React.js (functional components with hooks)
- Vite (build tool)
- Plain CSS (minimal styling)
- No external form libraries

## Project Structure

```
Assignment/
├── src/
│   ├── main.jsx          # React entry point
│   ├── App.jsx           # Main component with page routing
│   ├── Login.jsx         # Login page component
│   ├── Signup.jsx        # Signup page component
│   └── styles.css        # Global styles
├── public/
│   └── index.html        # HTML template
├── package.json
├── vite.config.js
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173` (or the next available port).

### 3. Build for Production

```bash
npm run build
```

## Usage

1. **Login Page**
   - Enter your email and password
   - Click "Show" to toggle password visibility
   - Form validates email format and password length
   - Click "Sign up here" to go to signup page

2. **Signup Page**
   - Enter name, email, and password
   - Re-enter password in confirm field
   - Form checks if passwords match
   - Click "Log in here" to go back to login page

## Form Validation

Both pages include simple client-side validation:
- **Email**: Must be a valid email format
- **Password**: Minimum 6 characters
- **Confirm Password**: Must match password field
- All fields are required

Validation errors appear below each field.

## Console Logging

On successful form submission, the app logs the form data to the browser console (no backend required).

Example:
```javascript
Login successful! { email: "user@example.com", password: "password123" }
Signup successful! { name: "John Doe", email: "john@example.com", password: "password123" }
```

## Notes

- This is a frontend-only application with no backend
- All validation is done on the client side
- Form data is logged to console instead of being sent to a server
- Mobile responsive with minimal styling
