import { useState } from 'react'

/**
 * Signup Component - Handles new user registration
 * 
 * Features:
 * - Name validation (required field)
 * - Email validation (format check & duplicate check)
 * - Password validation (minimum 6 characters)
 * - Confirm password validation (must match password)
 * - Real-time error display
 * - Saves user data to localStorage
 * - Form reset after successful submission
 * 
 * @component
 * @param {function} onSwitchToLogin - Callback function to switch to login page
 * @param {function} onSignupSuccess - Callback function when signup is successful
 * @returns {JSX.Element} Signup form with name, email, password fields and validation
 */
function Signup({ onSwitchToLogin, onSignupSuccess }) {
  // State management for form fields
  const [name, setName] = useState('') // Full name input state
  const [email, setEmail] = useState('') // Email input state
  const [password, setPassword] = useState('') // Password input state
  const [confirmPassword, setConfirmPassword] = useState('') // Confirm password input state
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
   * Validates entire signup form
   * Checks:
   * - Name is not empty
   * - Email is not empty, has valid format, and is not already registered
   * - Password is not empty and has minimum 6 characters
   * - Confirm password is not empty and matches password
   * 
   * @returns {boolean} True if all validations pass, false otherwise
   */
  const validateForm = () => {
    const newErrors = {}
    
    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    } else if (existingUsers.some(u => u.email === email)) {
      newErrors.email = 'This email is already registered'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handles form submission
   * Validates form before submission
   * If valid: saves user data to localStorage and shows success message
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

    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Create new user object
    const newUser = { name, email, password }
    
    // Add new user to the users array
    existingUsers.push(newUser)
    
    // Save updated users array to localStorage
    localStorage.setItem('users', JSON.stringify(existingUsers))
    
    // Log successful signup
    console.log('Signup successful!', newUser)
    console.log('Total registered users:', existingUsers)
    
    // Show success message
    setSuccessMessage('✅ Signup successful! Logging you in...')
    
    // Reset form after successful submission
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setErrors({})
    
    // Auto login and redirect after short delay
    setTimeout(() => {
      onSignupSuccess(newUser)
      setSuccessMessage('')
    }, 1500)
  }

  return (
    <div className="form-container">
      <div className="form-box">
        <h1 className="form-title">Create Account</h1>
        <p className="form-subtitle">Join us today</p>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

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
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        </form>

        <p className="form-footer">
          Already have an account?{' '}
          <button
            type="button"
            className="link-btn"
            onClick={onSwitchToLogin}
          >
            Login here
          </button>
        </p>
        <p className="demo-hint">💾 Your data is saved locally - fill the form and you can login!</p>
      </div>
    </div>
  )
}

export default Signup
