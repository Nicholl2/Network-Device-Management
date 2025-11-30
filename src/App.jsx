import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import LayoutWrapper from './components/layout/LayoutWrapper'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import DevicePage from './pages/DevicePage'
import TemplatePage from './pages/TemplatePage'
import UserPage from './pages/UserPage'
import UserDetailPage from './pages/UserDetailPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* public route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <HomePage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <AboutPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/devices"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <DevicePage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <TemplatePage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <UserPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <LayoutWrapper>
                <UserDetailPage />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />

        {/* default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
