// helper/api.ts
// Backend API configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export const baseUrl = `${BACKEND_URL}/api/task`;
export const authUrl = `${BACKEND_URL}/api/auth`;

console.log("API Base URL:", baseUrl);
console.log("Backend URL:", BACKEND_URL);
