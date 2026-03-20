import storage from "./storage.service";
import userService from "./userService";
import {
  MAX_TASK_TITLE_LENGTH,
  MAX_TASK_DESCRIPTION_LENGTH,
} from "../../shared/constants/input.limits";

const KEY = "tasks";
export const TASKS_UPDATED_EVENT = "tasks-updated";

const notifyTasksUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(TASKS_UPDATED_EVENT));
  }
};

const getTasks = () => {
  const tasks = storage.getForCurrentUser(KEY) || [];
  // Migrace starých úkolů bez completed flagu
  return tasks.map((t) => ({
    ...t,
    completed: t.completed || false,
  }));
};

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
    completed: false,
  };

  tasks.push(newTask);
  storage.setForCurrentUser(KEY, tasks);
  notifyTasksUpdated();
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
  notifyTasksUpdated();
};

const deleteTask = (taskId) => {
  const tasks = getTasks().filter((t) => t.id !== taskId);
  storage.setForCurrentUser(KEY, tasks);
  notifyTasksUpdated();
};

const deleteTasksByProjectId = (projectId) => {
  const tasks = getTasks().filter((t) => t.projectId !== projectId);
  storage.setForCurrentUser(KEY, tasks);
  notifyTasksUpdated();
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
