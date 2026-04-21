import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import AuthPage from './pages/AuthPage'
import PublicLandingPage from './pages/PublicLandingPage'
import PublicLearnPage from './pages/PublicLearnPage'
import PublicAboutPage from './pages/PublicAboutPage'
import RoleSectionPage from './pages/RoleSectionPage'
import { useAuth } from './context/AuthContext'

const RoleDashboardRedirect = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />
}

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary text-white">
        <p className="text-sm uppercase tracking-[0.12em] text-gray-400">Loading...</p>
      </div>
    )
  }

  if (user) {
    return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={(
            <PublicOnlyRoute>
              <PublicLandingPage />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path="/learn"
          element={(
            <PublicOnlyRoute>
              <PublicLearnPage />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path="/about"
          element={(
            <PublicOnlyRoute>
              <PublicAboutPage />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path="/login"
          element={(
            <PublicOnlyRoute>
              <AuthPage mode="login" />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path="/register"
          element={(
            <PublicOnlyRoute>
              <AuthPage mode="register" />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <RoleDashboardRedirect />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/:role/dashboard"
          element={(
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/:role/reports"
          element={(
            <ProtectedRoute>
              <RoleSectionPage section="reports" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/:role/settings"
          element={(
            <ProtectedRoute>
              <RoleSectionPage section="settings" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/:role/notifications"
          element={(
            <ProtectedRoute>
              <RoleSectionPage section="notifications" />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
