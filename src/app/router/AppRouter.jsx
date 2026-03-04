import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../../features/Home";
import Login from "../../features/users/Login";
import Register from "../../features/users/Register";
import ProjectDetail from "../../features/projects/ProjectDetail";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../../features/navbar/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
