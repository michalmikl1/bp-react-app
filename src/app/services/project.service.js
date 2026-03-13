import { getRandomGradient } from "../../shared/constants/project.gradient-colors";
import storage from "./storage.service";
import taskService from "./task.service";
import userService from "./userService";

const KEY = "projects";

const getProjects = () => storage.getForCurrentUser(KEY) || [];

const createProject = (project) => {
  const projects = getProjects();
  const currentUser = userService.getCurrentUser();

  const newProject = {
    ...project,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    gradient: getRandomGradient(),
    ownerId: currentUser?.id ?? null,
  };

  projects.push(newProject);
  storage.setForCurrentUser(KEY, projects);
  return newProject;
};

const getProjectById = (id) => getProjects().find((p) => p.id === id);

const updateProject = (updated) => {
  const projects = getProjects().map((p) =>
    p.id === updated.id ? { ...p, ...updated } : p,
  );
  storage.setForCurrentUser(KEY, projects);
};

const deleteProject = (id) => {
  const projects = getProjects().filter((p) => p.id !== id);
  storage.setForCurrentUser(KEY, projects);

  taskService.deleteTasksByProjectId(id);
};

export default {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
