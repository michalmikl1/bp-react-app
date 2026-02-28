import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../../features/Home";
import ProjectDetail from "../../features/projects/ProjectDetail";
import TaskDetail from "../../features/tasks/TaskDetail";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/tasks/:taskId" element={<TaskDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
