import { useEffect, useState, useCallback } from 'react'
import EmployeeForm from './components/EmployeeForm'
import EmployeeTable from './components/EmployeeTable'
import Login from './components/Login'
import { useAuth } from './auth/AuthContext'
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from './api/employeeApi'

// Auth gate: show the login screen until the user is authenticated.
function App() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <EmployeeManager /> : <Login />
}

function EmployeeManager() {
  const { username, logout } = useAuth()
  const [employees, setEmployees] = useState([])
  const [editing, setEditing] = useState(null) // employee being edited, or null
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadEmployees = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getEmployees()
      setEmployees(res.data)
    } catch (err) {
      setError(readError(err, 'Failed to load employees. Is the backend running on :8080?'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  const handleSave = async (form) => {
    setError('')
    try {
      if (editing) {
        await updateEmployee(editing.id, form)
      } else {
        await createEmployee(form)
      }
      setEditing(null)
      await loadEmployees()
    } catch (err) {
      setError(readError(err, 'Failed to save employee.'))
    }
  }

  const handleEdit = (employee) => {
    setEditing(employee)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => setEditing(null)

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return
    setError('')
    try {
      await deleteEmployee(id)
      if (editing && editing.id === id) setEditing(null)
      await loadEmployees()
    } catch (err) {
      setError(readError(err, 'Failed to delete employee.'))
    }
  }

  return (
    <div className="app">
      <header className="app-header-bar">
        <div>
          <h1>Employee Management</h1>
          <p>Add, edit and remove employees</p>
        </div>
        <div className="user-box">
          <span className="user-badge">{username}</span>
          <button className="btn btn-secondary btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <EmployeeForm
        key={editing ? editing.id : 'new'}
        editing={editing}
        onSave={handleSave}
        onCancel={handleCancelEdit}
      />

      <EmployeeTable
        employees={employees}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

// Pull a readable message out of an axios error (validation field errors, etc.).
function readError(err, fallback) {
  const data = err?.response?.data
  if (data?.fieldErrors) {
    return Object.entries(data.fieldErrors)
      .map(([field, msg]) => `${field}: ${msg}`)
      .join(' | ')
  }
  return data?.message || err?.message || fallback
}

export default App
