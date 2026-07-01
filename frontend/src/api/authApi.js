import client from './client'

// POST /api/auth/login  -> { token, username }
export const login = (username, password) =>
  client.post('/api/auth/login', { username, password })

// POST /api/auth/register  -> { token, username }
export const register = (username, password) =>
  client.post('/api/auth/register', { username, password })
