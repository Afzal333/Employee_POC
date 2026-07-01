# Employee POC — Spring Boot + React CRUD

A full-stack Employee management application.

- **Backend:** Java 17, Spring Boot 3.3, Spring Data JPA (Hibernate), H2 in-memory database. A separate REST endpoint for each CRUD operation.
- **Frontend:** React (Vite) single page — add an employee at the top, see all employees in a table below, and edit or delete any row.

```
Employee POC/
├── backend/    Spring Boot API (port 8080)
└── frontend/   React app (port 5173)
```

## Prerequisites

| Tool     | Version | Notes |
|----------|---------|-------|
| **JDK**  | 17+     | Required to run the backend. Not currently installed on this machine — install e.g. [Eclipse Temurin 17](https://adoptium.net/temurin/releases/?version=17). Set `JAVA_HOME` to the JDK folder. |
| **Node** | 18+     | Already installed (v22). Used for the frontend. |
| Maven    | —       | Not needed — the backend ships with the Maven Wrapper (`mvnw`), which downloads Maven automatically on first run. |

## Running the backend (port 8080)

```bash
cd backend
# Windows:
mvnw.cmd spring-boot:run
# macOS / Linux:
./mvnw spring-boot:run
```

The API is served at `http://localhost:8080/api/employees`.
The H2 web console is at `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:employeedb`, user `sa`, no password).

> Note: H2 is in-memory, so data resets each time the backend restarts.

## Running the frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The API base URL is configured in `frontend/.env`
(`VITE_API_URL`); change it if the backend runs elsewhere.

Run both the backend and the frontend at the same time (in two terminals).

## REST API

Base path: `/api/employees`

| Operation   | Method | Path                  | Success status |
|-------------|--------|-----------------------|----------------|
| List all    | GET    | `/api/employees`      | 200 |
| Get one     | GET    | `/api/employees/{id}` | 200 |
| Create      | POST   | `/api/employees`      | 201 |
| Update      | PUT    | `/api/employees/{id}` | 200 |
| Delete      | DELETE | `/api/employees/{id}` | 204 |

### Employee JSON

```json
{
  "id": 1,
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com",
  "department": "Engineering",
  "designation": "Senior Engineer",
  "salary": 120000
}
```

All fields except `id` are required; `email` must be valid and unique; `salary` must be ≥ 0.
Invalid requests return `400` with per-field messages; a missing id returns `404`.

### Quick test with curl

```bash
# Create
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ada","lastName":"Lovelace","email":"ada@example.com","department":"Engineering","designation":"Senior Engineer","salary":120000}'

# List
curl http://localhost:8080/api/employees
```

## Project layout

**Backend** (`backend/src/main/java/com/veltris/employee/`)
- `EmployeeApplication.java` — Spring Boot entry point
- `model/Employee.java` — JPA entity with validation
- `repository/EmployeeRepository.java` — Spring Data JPA repository
- `service/EmployeeService.java` — business logic
- `controller/EmployeeController.java` — REST endpoints (one per operation)
- `config/WebConfig.java` — CORS for the React dev server
- `exception/` — 404 + validation error handling

**Frontend** (`frontend/src/`)
- `App.jsx` — page state and orchestration
- `components/EmployeeForm.jsx` — add / edit form
- `components/EmployeeTable.jsx` — list with edit / delete
- `api/employeeApi.js` — one function per backend endpoint
