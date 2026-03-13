import userService from "./userService";

const getCurrentUserStorageKey = (key) => {
  const currentUser = userService.getCurrentUser();

  if (!currentUser?.id) {
    return key;
  }

  return `task_manager_${key}_${currentUser.id}`;
};

const migrateLegacyData = (key, scopedKey) => {
  const migrationKey = `task_manager_migrated_${key}`;
  const legacyData = localStorage.getItem(key);

  if (!legacyData || localStorage.getItem(migrationKey)) {
    return null;
  }

  localStorage.setItem(scopedKey, legacyData);
  localStorage.setItem(
    migrationKey,
    JSON.stringify({
      key,
      userId: userService.getCurrentUser()?.id ?? null,
      migratedAt: new Date().toISOString(),
    }),
  );

  return JSON.parse(legacyData);
};

const get = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const set = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const remove = (key) => {
  localStorage.removeItem(key);
};

const getForCurrentUser = (key) => {
  const scopedKey = getCurrentUserStorageKey(key);
  const scopedData = localStorage.getItem(scopedKey);

  if (scopedData) {
    return JSON.parse(scopedData);
  }

  const migratedData = migrateLegacyData(key, scopedKey);
  return migratedData ?? [];
};

const setForCurrentUser = (key, value) => {
  localStorage.setItem(getCurrentUserStorageKey(key), JSON.stringify(value));
};

const removeForCurrentUser = (key) => {
  localStorage.removeItem(getCurrentUserStorageKey(key));
};

export default {
  get,
  set,
  remove,
  getForCurrentUser,
  setForCurrentUser,
  removeForCurrentUser,
  getCurrentUserStorageKey,
};
