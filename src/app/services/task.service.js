import storage from "./storage.service";
import userService from "./userService";

const KEY = "tasks";

const getTasks = () => storage.getForCurrentUser(KEY) || [];

const getTasksByProjectId = (projectId) =>
  getTasks().filter((t) => t.projectId === projectId);

const getTaskById = (taskId) => getTasks().find((t) => t.id === taskId);

const createTask = (task) => {
  const tasks = getTasks();
  const currentUser = userService.getCurrentUser();

  const newTask = {
    ...task,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ownerId: currentUser?.id ?? null,
  };

  tasks.push(newTask);
  storage.setForCurrentUser(KEY, tasks);
  return newTask;
};

const updateTask = (updatedTask) => {
  const tasks = getTasks().map((t) =>
    t.id === updatedTask.id ? { ...t, ...updatedTask } : t,
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
