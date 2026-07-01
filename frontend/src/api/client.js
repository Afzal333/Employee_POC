import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const TOKEN_KEY = 'employee_poc_token'
export const USER_KEY = 'employee_poc_user'

// Shared axios instance used by both the auth and employee API modules.
const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request: attach the JWT (if we have one) to every outgoing call.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response: if the server rejects an *authenticated* call with 401 (expired/invalid
// token), broadcast so the app can log the user out. We ignore 401s when there is no
// token (e.g. a failed login attempt) so those are handled by the caller instead.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)

export default client
