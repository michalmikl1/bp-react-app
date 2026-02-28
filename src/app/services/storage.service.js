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

export default {
  get,
  set,
  remove,
};
