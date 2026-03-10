import storage from "./storage.service";

const KEY = "tasks";

const getTasks = () => storage.get(KEY) || [];

const getTasksByProjectId = (projectId) =>
  getTasks().filter((t) => t.projectId === projectId);

const getTaskById = (taskId) => getTasks().find((t) => t.id === taskId);

const createTask = (task) => {
  const tasks = getTasks();

  const newTask = {
    ...task,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  storage.set(KEY, tasks);
  return newTask;
};

const updateTask = (updatedTask) => {
  const tasks = getTasks().map((t) =>
    t.id === updatedTask.id ? { ...t, ...updatedTask } : t,
  );
  storage.set(KEY, tasks);
};

const deleteTask = (taskId) => {
  const tasks = getTasks().filter((t) => t.id !== taskId);
  storage.set(KEY, tasks);
};

const deleteTasksByProjectId = (projectId) => {
  const tasks = getTasks().filter((t) => t.projectId !== projectId);
  storage.set(KEY, tasks);
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
