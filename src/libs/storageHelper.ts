export const AUTH_TOKEN = "AUTH_TOKEN";
export const ROLE = "ROLE";
export const USER = "USER";

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN);
};

export const getUserRole = () => {
  const role = localStorage.getItem(ROLE);
  return role ? JSON.parse(role) : null;
};

export const getUser = () => {
  const user = localStorage.getItem(USER);
  return user ? JSON.parse(user) : null;
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN, token);
};

export const setUserRole = (role: string) => {
  localStorage.setItem(ROLE, JSON.stringify(role));
};

export const setUser = (user: any) => {
  localStorage.setItem(USER, JSON.stringify(user));
};

export const logout = () => {
  localStorage.clear();
};