function EmployeeTable({ employees, loading, onEdit, onDelete }) {
  return (
    <div className="card">
      <h2>Employees ({employees.length})</h2>

      <div className="table-wrap">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="empty">Loading…</td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty">No employees yet. Add one above.</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.firstName}</td>
                  <td>{emp.lastName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{formatSalary(emp.salary)}</td>
                  <td className="row-actions">
                    <button className="btn btn-small btn-edit" onClick={() => onEdit(emp)}>
                      Edit
                    </button>
                    <button className="btn btn-small btn-delete" onClick={() => onDelete(emp.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatSalary(value) {
  if (value == null) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default EmployeeTable
