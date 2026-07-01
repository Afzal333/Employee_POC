package com.veltris.employee.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.veltris.employee.exception.ResourceNotFoundException;
import com.veltris.employee.model.Employee;
import com.veltris.employee.service.EmployeeService;

/**
 * Negative web-layer tests for {@link EmployeeController}.
 *
 * {@code @WebMvcTest} loads only the web slice (the controller, the
 * {@code GlobalExceptionHandler} advice and JSON conversion) - no database.
 * The service is mocked, so we can drive it to throw and assert the HTTP
 * status codes and error body the API returns for failures.
 */
@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeService employeeService;

    private static final Long MISSING_ID = 99L;

    private static final String VALID_JSON = """
            {
              "firstName": "Ada",
              "lastName": "Lovelace",
              "email": "ada@example.com",
              "department": "Engineering",
              "designation": "Engineer",
              "salary": 100000
            }
            """;

    // ---------------------------------------------------------------- 404 Not Found

    @Test
    void getById_whenNotFound_returns404() throws Exception {
        when(employeeService.getEmployeeById(MISSING_ID))
                .thenThrow(new ResourceNotFoundException("Employee not found with id: " + MISSING_ID));

        mockMvc.perform(get("/api/employees/{id}", MISSING_ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Employee not found with id: " + MISSING_ID));
    }

    @Test
    void update_whenNotFound_returns404() throws Exception {
        when(employeeService.updateEmployee(eq(MISSING_ID), any(Employee.class)))
                .thenThrow(new ResourceNotFoundException("Employee not found with id: " + MISSING_ID));

        mockMvc.perform(put("/api/employees/{id}", MISSING_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Employee not found with id: " + MISSING_ID));
    }

    @Test
    void delete_whenNotFound_returns404() throws Exception {
        doThrow(new ResourceNotFoundException("Employee not found with id: " + MISSING_ID))
                .when(employeeService).deleteEmployee(MISSING_ID);

        mockMvc.perform(delete("/api/employees/{id}", MISSING_ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    // ---------------------------------------------------------------- 400 Validation

    @Test
    void create_whenFirstNameBlank_returns400_andServiceNotCalled() throws Exception {
        String body = """
                {"firstName":"","lastName":"Lovelace","email":"ada@example.com",
                 "department":"Engineering","designation":"Engineer","salary":100000}
                """;

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.fieldErrors.firstName").exists());

        // Validation fails before the controller reaches the service.
        verify(employeeService, never()).createEmployee(any(Employee.class));
    }

    @Test
    void create_whenEmailInvalid_returns400() throws Exception {
        String body = """
                {"firstName":"Ada","lastName":"Lovelace","email":"not-an-email",
                 "department":"Engineering","designation":"Engineer","salary":100000}
                """;

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.email").exists());

        verify(employeeService, never()).createEmployee(any(Employee.class));
    }

    @Test
    void create_whenSalaryNegative_returns400() throws Exception {
        String body = """
                {"firstName":"Ada","lastName":"Lovelace","email":"ada@example.com",
                 "department":"Engineering","designation":"Engineer","salary":-5}
                """;

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.salary").exists());
    }

    @Test
    void create_whenMultipleFieldsInvalid_returns400_withAllFieldErrors() throws Exception {
        String body = """
                {"firstName":"","lastName":"","email":"bad","department":"",
                 "designation":"","salary":-1}
                """;

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.firstName").exists())
                .andExpect(jsonPath("$.fieldErrors.lastName").exists())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.fieldErrors.department").exists())
                .andExpect(jsonPath("$.fieldErrors.designation").exists())
                .andExpect(jsonPath("$.fieldErrors.salary").exists());

        verify(employeeService, never()).createEmployee(any(Employee.class));
    }

    @Test
    void update_whenBodyInvalid_returns400_andServiceNotCalled() throws Exception {
        String body = """
                {"firstName":"","lastName":"Lovelace","email":"ada@example.com",
                 "department":"Engineering","designation":"Engineer","salary":100000}
                """;

        mockMvc.perform(put("/api/employees/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.firstName").exists());

        verify(employeeService, never()).updateEmployee(any(Long.class), any(Employee.class));
    }

    @Test
    void create_whenBodyIsMalformedJson_returns400() throws Exception {
        String malformed = "{ this is not valid json ";

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(malformed))
                .andExpect(status().isBadRequest());

        verify(employeeService, never()).createEmployee(any(Employee.class));
    }
}
