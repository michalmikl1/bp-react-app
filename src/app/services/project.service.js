import { getRandomGradient } from "../../shared/constants/project.gradient-colors";
import storage from "./storage.service";
import taskService from "./task.service";

const KEY = "projects";

const getProjects = () => storage.get(KEY) || [];

const createProject = (project) => {
  const projects = getProjects();

  const newProject = {
    ...project,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    gradient: getRandomGradient(),
  };

  projects.push(newProject);
  storage.set(KEY, projects);
  return newProject;
};

const getProjectById = (id) => getProjects().find((p) => p.id === id);

const updateProject = (updated) => {
  const projects = getProjects().map((p) =>
    p.id === updated.id ? { ...p, ...updated } : p,
  );
  storage.set(KEY, projects);
};

const deleteProject = (id) => {
  const projects = getProjects().filter((p) => p.id !== id);
  storage.set(KEY, projects);

  taskService.deleteTasksByProjectId(id);
};

export default {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
