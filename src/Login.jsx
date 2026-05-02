import { useState } from 'react'

/**
 * Login Component - Handles user login with email and password
 * 
 * Features:
 * - Email validation (format check)
 * - Password validation (minimum 6 characters)
 * - Password visibility toggle
 * - Real-time error display
 * - Authenticates against registered users
 * - Form reset after successful submission
 * 
 * @component
 * @param {function} onSwitchToSignup - Callback function to switch to signup page
 * @param {function} onLoginSuccess - Callback function when login is successful
 * @returns {JSX.Element} Login form with email, password fields and validation
 */
function Login({ onSwitchToSignup, onLoginSuccess }) {
  // State management for form fields
  const [email, setEmail] = useState('') // Email input state
  const [password, setPassword] = useState('') // Password input state
  const [showPassword, setShowPassword] = useState(false) // Toggle password visibility
  const [errors, setErrors] = useState({}) // Object to store validation errors
  const [successMessage, setSuccessMessage] = useState('') // Success message state

  /**
   * Validates email format using regex pattern
   * Pattern checks for: characters@characters.extension
   * 
   * @param {string} email - The email to validate
   * @returns {boolean} True if email format is valid, false otherwise
   */
  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  /**
   * Validates entire login form
   * Checks:
   * - Email is not empty and has valid format
   * - Password is not empty and has minimum 6 characters
   * 
   * @returns {boolean} True if all validations pass, false otherwise
   */
  const validateForm = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handles form submission
   * Validates form before submission
   * If valid: checks credentials against registered users
   * If invalid: displays error messages
   * 
   * @param {Event} e - The form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault() // Prevent default form submission behavior

    // Exit early if validation fails
    if (!validateForm()) {
      return
    }

    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Find user with matching email and password
    const user = registeredUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      // Successful login
      setSuccessMessage('✅ Login successful! Redirecting...')
      console.log('Login successful!', { email, password })
      
      // Reset form
      setEmail('')
      setPassword('')
      setErrors({})
      
      // Call success callback after short delay
      setTimeout(() => {
        onLoginSuccess(user)
        setSuccessMessage('')
      }, 1000)
    } else {
      // Failed login
      setErrors({ submit: 'Invalid email or password. Please try again or sign up first.' })
      console.log('Login failed - user not found')
    }
  }

  return (
    <div className="form-container">
      <div className="form-box">
        <h1 className="form-title">Welcome Back</h1>
        <p className="form-subtitle">Login to your account</p>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errors.submit && <div className="submit-error">{errors.submit}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        <p className="form-footer">
          Don't have an account?{' '}
          <button
            type="button"
            className="link-btn"
            onClick={onSwitchToSignup}
          >
            Create one now
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
