import { getRandomGradient } from "../../shared/constants/project.gradient-colors";
import storage from "./storage.service";
import taskService from "./task.service";
import userService from "./userService";
import {
  MAX_PROJECT_NAME_LENGTH,
  MAX_PROJECT_DESCRIPTION_LENGTH,
} from "../../shared/constants/input.limits";

const KEY = "projects";

const getProjects = () => storage.getForCurrentUser(KEY) || [];

const validateProject = (project) => {
  const name = (project.name || "").trim();
  const description = (project.description || "").trim();

  if (!name) {
    throw new Error("Název projektu nesmí být prázdný.");
  }
  if (name.length > MAX_PROJECT_NAME_LENGTH) {
    throw new Error(
      `Název projektu může mít maximálně ${MAX_PROJECT_NAME_LENGTH} znaků.`,
    );
  }
  if (description.length > MAX_PROJECT_DESCRIPTION_LENGTH) {
    throw new Error(
      `Popis projektu může mít maximálně ${MAX_PROJECT_DESCRIPTION_LENGTH} znaků.`,
    );
  }
};

const createProject = (project) => {
  validateProject(project);

  const projects = getProjects();
  const currentUser = userService.getCurrentUser();

  const newProject = {
    ...project,
    name: project.name.trim(),
    description: project.description?.trim() ?? "",
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
  validateProject(updated);

  const projects = getProjects().map((p) =>
    p.id === updated.id
      ? {
          ...p,
          ...updated,
          name: updated.name.trim(),
          description: updated.description?.trim() ?? "",
        }
      : p,
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
