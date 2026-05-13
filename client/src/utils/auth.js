/**
 * Centralized authentication helper functions for EventHive
 */

export const getToken = () => {
  return localStorage.getItem('eventhive_token');
};

export const getUser = () => {
  const user = localStorage.getItem('eventhive_user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error('Error parsing user from localStorage', error);
    return null;
  }
};

export const isLoggedIn = () => {
  return getToken() !== null;
};

export const isOrganiser = () => {
  const user = getUser();
  return user?.role === 'organizer' || user?.role === 'organiser'; // Handling both spellings for robustness
};

export const setAuth = (user, token) => {
  localStorage.setItem('eventhive_token', token);
  localStorage.setItem('eventhive_user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('eventhive_token');
  localStorage.removeItem('eventhive_user');
};

export const logout = () => {
  clearAuth();
  window.location.href = '/login';
};
