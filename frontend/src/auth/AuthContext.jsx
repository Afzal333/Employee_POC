import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { TOKEN_KEY, USER_KEY } from '../api/client'
import * as authApi from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [username, setUsername] = useState(() => localStorage.getItem(USER_KEY))

  const applyAuth = useCallback((newToken, newUsername) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, newUsername)
    setToken(newToken)
    setUsername(newUsername)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUsername(null)
  }, [])

  const login = useCallback(async (u, p) => {
    const res = await authApi.login(u, p)
    applyAuth(res.data.token, res.data.username)
  }, [applyAuth])

  const register = useCallback(async (u, p) => {
    const res = await authApi.register(u, p)
    applyAuth(res.data.token, res.data.username)
  }, [applyAuth])

  // The axios interceptor fires this when an authenticated request gets a 401.
  useEffect(() => {
    const onUnauthorized = () => logout()
    window.addEventListener('auth:unauthorized', onUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized)
  }, [logout])

  const value = {
    token,
    username,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
