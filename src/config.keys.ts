export const PRODUCTION = Boolean(import.meta.env.VITE_PRODUCTION);
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
