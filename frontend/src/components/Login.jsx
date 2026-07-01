import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

function Login() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const isLogin = mode === 'login'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isLogin) {
        await login(username, password)
      } else {
        await register(username, password)
      }
      // On success the AuthProvider flips isAuthenticated and this screen unmounts.
    } catch (err) {
      setError(readError(err, isLogin ? 'Login failed.' : 'Registration failed.'))
    } finally {
      setBusy(false)
    }
  }

  const switchMode = () => {
    setMode(isLogin ? 'register' : 'login')
    setError('')
  }

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Employee Management</h1>
        <p className="login-subtitle">
          {isLogin ? 'Sign in to continue' : 'Create an account'}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <label className="login-field">
          Username
          <input
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="login-field">
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            required
          />
        </label>

        <button type="submit" className="btn btn-primary login-submit" disabled={busy}>
          {busy ? 'Please wait…' : isLogin ? 'Sign in' : 'Register'}
        </button>

        <p className="login-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className="link-button" onClick={switchMode}>
            {isLogin ? 'Register' : 'Sign in'}
          </button>
        </p>

        {isLogin && (
          <p className="login-hint">Default admin — username: <code>admin</code>, password: <code>admin123</code></p>
        )}
      </form>
    </div>
  )
}

function readError(err, fallback) {
  const data = err?.response?.data
  if (data?.fieldErrors) {
    return Object.entries(data.fieldErrors)
      .map(([field, msg]) => `${field}: ${msg}`)
      .join(' | ')
  }
  return data?.message || err?.message || fallback
}

export default Login
