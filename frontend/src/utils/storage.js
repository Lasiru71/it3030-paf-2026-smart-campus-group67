// Utility helpers for localStorage operations

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // silently fail
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // silently fail
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch {
      // silently fail
    }
  },
};
