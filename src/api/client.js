import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  try {
    const savedUser = sessionStorage.getItem('terra_auth_user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {
    // Ignore malformed session data — request proceeds unauthenticated
  }
  return config;
});

/**
 * Resolves a backend-relative asset path (e.g. "/uploads/tiles/x.jpg") into a
 * fully-qualified URL pointing at the API host. Leaves absolute URLs untouched.
 */
export function resolveAssetUrl(path) {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return `${API_BASE_URL}${path}`;
}
