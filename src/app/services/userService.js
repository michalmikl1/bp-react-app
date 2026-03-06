// app/services/user.service.js
import bcrypt from "bcryptjs";

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

  // HASH PASSWORD
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: Date.now(),
    username,
    password: hashedPassword,
  };

  users.push(newUser);
  saveUsers(users);

  // AUTO LOGIN
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ id: newUser.id, username: newUser.username }),
  );

  return newUser;
};

const login = ({ username, password }) => {
  const users = getUsers();

  const user = users.find((u) => u.username === username);

  // kontrola hesla přes bcrypt
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error("Špatné uživatelské jméno nebo heslo.");
  }

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
