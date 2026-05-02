import { useState } from 'react'
import Login from './Login'
import Signup from './Signup'

/**
 * App Component - Main application wrapper
 * Manages navigation between Login and Signup pages
 * Uses React hooks (useState) for state management
 * 
 * @component
 * @returns {JSX.Element} The main app container with either Login or Signup page
 */
function App() {
  // State to track which page is currently displayed ('login' or 'signup')
  const [currentPage, setCurrentPage] = useState('login')
  // State to track logged-in user
  const [loggedInUser, setLoggedInUser] = useState(null)

  // Handle logout
  const handleLogout = () => {
    setLoggedInUser(null)
    setCurrentPage('login')
  }

  // If user is logged in, show welcome screen
  if (loggedInUser) {
    return (
      <div className="app-container">
        <div className="welcome-card">
          <div className="welcome-header">
            <div className="welcome-avatar">{loggedInUser.name.charAt(0).toUpperCase()}</div>
            <h1 className="welcome-title">Welcome back! 👋</h1>
          </div>
          <div className="welcome-content">
            <p className="welcome-name">Hello, <strong>{loggedInUser.name}</strong></p>
            <p className="welcome-email">📧 {loggedInUser.email}</p>
            <p className="welcome-message">You are successfully logged in!</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      {/* Conditional rendering: Show Login if currentPage is 'login', otherwise show Signup */}
      {currentPage === 'login' ? (
        <Login onSwitchToSignup={() => setCurrentPage('signup')} onLoginSuccess={setLoggedInUser} />
      ) : (
        <Signup onSwitchToLogin={() => setCurrentPage('login')} onSignupSuccess={setLoggedInUser} />
      )}
    </div>
  )
}

export default App
