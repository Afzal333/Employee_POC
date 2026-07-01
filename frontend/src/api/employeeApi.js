import client from './client'

// One function per backend endpoint. Requests go through the shared client,
// which attaches the JWT automatically.

// GET /api/employees
export const getEmployees = () => client.get('/api/employees')

// GET /api/employees/{id}
export const getEmployee = (id) => client.get(`/api/employees/${id}`)

// POST /api/employees
export const createEmployee = (employee) => client.post('/api/employees', employee)

// PUT /api/employees/{id}
export const updateEmployee = (id, employee) => client.put(`/api/employees/${id}`, employee)

// DELETE /api/employees/{id}
export const deleteEmployee = (id) => client.delete(`/api/employees/${id}`)
