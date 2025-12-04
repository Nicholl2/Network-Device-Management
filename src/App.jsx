import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleProtectedRoute from './routes/RoleProtectedRoute'
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

        {/* protected routes - available for all authenticated users */}
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

        {/* Admin only routes */}
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRole="admin">
                <LayoutWrapper>
                  <TemplatePage />
                </LayoutWrapper>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRole="admin">
                <LayoutWrapper>
                  <UserPage />
                </LayoutWrapper>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRole="admin">
                <LayoutWrapper>
                  <UserDetailPage />
                </LayoutWrapper>
              </RoleProtectedRoute>
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