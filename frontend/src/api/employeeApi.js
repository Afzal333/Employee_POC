import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/employees'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// One function per backend endpoint.

// GET /api/employees
export const getEmployees = () => api.get('')

// GET /api/employees/{id}
export const getEmployee = (id) => api.get(`/${id}`)

// POST /api/employees
export const createEmployee = (employee) => api.post('', employee)

// PUT /api/employees/{id}
export const updateEmployee = (id, employee) => api.put(`/${id}`, employee)

// DELETE /api/employees/{id}
export const deleteEmployee = (id) => api.delete(`/${id}`)
