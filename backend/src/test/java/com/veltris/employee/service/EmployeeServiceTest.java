package com.veltris.employee.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.veltris.employee.exception.ResourceNotFoundException;
import com.veltris.employee.model.Employee;
import com.veltris.employee.repository.EmployeeRepository;

/**
 * Negative unit tests for the service layer.
 *
 * The repository is mocked, so these tests are fast and isolated: they only
 * verify the business logic of {@link EmployeeService}, not the database.
 */
@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private static final Long MISSING_ID = 99L;

    @Test
    void getEmployeeById_whenIdDoesNotExist_throwsResourceNotFound() {
        when(employeeRepository.findById(MISSING_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.getEmployeeById(MISSING_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(String.valueOf(MISSING_ID));
    }

    @Test
    void updateEmployee_whenIdDoesNotExist_throwsAndNeverSaves() {
        when(employeeRepository.findById(MISSING_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.updateEmployee(MISSING_ID, new Employee()))
                .isInstanceOf(ResourceNotFoundException.class);

        // The update must abort before persisting anything.
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    void deleteEmployee_whenIdDoesNotExist_throwsAndNeverDeletes() {
        when(employeeRepository.findById(MISSING_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.deleteEmployee(MISSING_ID))
                .isInstanceOf(ResourceNotFoundException.class);

        // Nothing should be deleted when the record is absent.
        verify(employeeRepository, never()).delete(any(Employee.class));
    }
}
