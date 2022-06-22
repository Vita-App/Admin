export const PRODUCTION = process.env.NODE_ENV === "production";
export const SERVER_URL = PRODUCTION
  ? "https://vitaa-server.com"
  : "http://localhost:5000";
