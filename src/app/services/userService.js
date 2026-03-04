// app/services/user.service.js
const USERS_KEY = "task_manager_users";
const TOKEN_KEY = "task_manager_token";

const getUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const register = ({ username, password }) => {
  const users = getUsers();
  if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error("Uživatel s tímto jménem již existuje.");
  }
  const newUser = { id: Date.now(), username, password };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

const login = ({ username, password }) => {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) throw new Error("Špatné uživatelské jméno nebo heslo.");
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ id: user.id, username: user.username }),
  );
  return user;
};

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(TOKEN_KEY));
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
