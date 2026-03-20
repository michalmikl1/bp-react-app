import storage from "./storage.service";
import userService from "./userService";
import {
  MAX_TASK_TITLE_LENGTH,
  MAX_TASK_DESCRIPTION_LENGTH,
} from "../../shared/constants/input.limits";

const KEY = "tasks";

const getTasks = () => storage.getForCurrentUser(KEY) || [];

const getTasksByProjectId = (projectId) =>
  getTasks().filter((t) => t.projectId === projectId);

const getTaskById = (taskId) => getTasks().find((t) => t.id === taskId);

const validateTask = (task) => {
  const title = (task.title || "").trim();
  const description = (task.description || "").trim();

  if (!title) {
    throw new Error("Název úkolu nesmí být prázdný.");
  }
  if (title.length > MAX_TASK_TITLE_LENGTH) {
    throw new Error(
      `Název úkolu může mít maximálně ${MAX_TASK_TITLE_LENGTH} znaků.`,
    );
  }
  if (description.length > MAX_TASK_DESCRIPTION_LENGTH) {
    throw new Error(
      `Popis úkolu může mít maximálně ${MAX_TASK_DESCRIPTION_LENGTH} znaků.`,
    );
  }
};

const createTask = (task) => {
  validateTask(task);

  const tasks = getTasks();
  const currentUser = userService.getCurrentUser();

  const newTask = {
    ...task,
    title: task.title.trim(),
    description: task.description?.trim() ?? "",
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ownerId: currentUser?.id ?? null,
  };

  tasks.push(newTask);
  storage.setForCurrentUser(KEY, tasks);
  return newTask;
};

const updateTask = (updatedTask) => {
  validateTask(updatedTask);

  const tasks = getTasks().map((t) =>
    t.id === updatedTask.id
      ? {
          ...t,
          ...updatedTask,
          title: updatedTask.title.trim(),
          description: updatedTask.description?.trim() ?? "",
        }
      : t,
  );
  storage.setForCurrentUser(KEY, tasks);
};

const deleteTask = (taskId) => {
  const tasks = getTasks().filter((t) => t.id !== taskId);
  storage.setForCurrentUser(KEY, tasks);
};

const deleteTasksByProjectId = (projectId) => {
  const tasks = getTasks().filter((t) => t.projectId !== projectId);
  storage.setForCurrentUser(KEY, tasks);
};

export default {
  getTasks,
  getTasksByProjectId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  deleteTasksByProjectId,
};
