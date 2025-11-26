import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Obtener del almacenamiento local por clave
      const item = window.localStorage.getItem(key);
      // Parsear el JSON almacenado o, si no hay ninguno, devolver initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay un error, devolver initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Devolver una versión envuelta de la función setter useState que
  // persiste el nuevo valor en localStorage.
  const setValue = (value) => {
    try {
      // Permitir que el valor sea una función para que tengamos la misma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Guardar estado
      setStoredValue(valueToStore);
      // Guardar en almacenamiento local
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Una implementación más avanzada manejaría el caso de error
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

