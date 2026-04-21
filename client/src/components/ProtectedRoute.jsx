import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role } = useParams();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary text-white">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium uppercase tracking-widest text-gray-400">
            Loading workspace
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRolePath = user.role.toLowerCase();
  if (role && role.toLowerCase() !== userRolePath) {
    return <Navigate to={`/${userRolePath}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
