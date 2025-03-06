export const safeGetStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error al acceder a localStorage para la clave ${key}:`, error);
    return defaultValue;
  }
};

export const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error al guardar en localStorage para la clave ${key}:`, error);
  }
};