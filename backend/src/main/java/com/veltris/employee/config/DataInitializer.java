package com.veltris.employee.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.veltris.employee.model.User;
import com.veltris.employee.repository.UserRepository;

/**
 * Seeds a default admin user at startup (H2 is in-memory, so this runs each boot).
 * Credentials come from app.admin.username / app.admin.password.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsername;
    private final String adminPassword;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           @Value("${app.admin.username}") String adminUsername,
                           @Value("${app.admin.password}") String adminPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername(adminUsername)) {
            userRepository.save(new User(
                    adminUsername,
                    passwordEncoder.encode(adminPassword),
                    "ADMIN"));
            log.info("Seeded default admin user -> username: '{}', password: '{}'",
                    adminUsername, adminPassword);
        }
    }
}
