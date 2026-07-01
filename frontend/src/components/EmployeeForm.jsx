import { useState } from 'react'

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  designation: '',
  salary: '',
}

function EmployeeForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(() =>
    editing
      ? {
          firstName: editing.firstName ?? '',
          lastName: editing.lastName ?? '',
          email: editing.email ?? '',
          department: editing.department ?? '',
          designation: editing.designation ?? '',
          salary: editing.salary ?? '',
        }
      : EMPTY
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      salary: form.salary === '' ? null : Number(form.salary),
    })
    if (!editing) setForm(EMPTY)
  }

  return (
    <form className="card employee-form" onSubmit={handleSubmit}>
      <h2>{editing ? `Edit Employee #${editing.id}` : 'Add Employee'}</h2>

      <div className="form-grid">
        <label>
          First Name
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Last Name
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Department
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Designation
          <input
            name="designation"
            value={form.designation}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Salary
          <input
            type="number"
            name="salary"
            min="0"
            step="0.01"
            value={form.salary}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editing ? 'Update' : 'Add Employee'}
        </button>
        {editing && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default EmployeeForm
