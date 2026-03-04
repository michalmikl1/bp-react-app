import { Navigate } from "react-router-dom";
import userService from "../../app/services/userService.js";

export default function ProtectedRoute({ children }) {
  const user = userService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
