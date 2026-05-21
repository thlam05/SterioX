package com.thlam05.steriox.config;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.enums.RoleType;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.rbac.repository.RoleRepository;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.Set;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationInitConfig {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner() {
        return (arg -> {
            if (userRepository.findByEmail("admin@steriox.com").isEmpty()) {
                User user = User.builder()
                        .email("admin@steriox.com")
                        .username("admin")
                        .password(passwordEncoder.encode("123456"))
                        .roles(Set.of(roleRepository.findById(RoleType.ADMIN.toString())
                                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Role not found"))))
                        .build();

                userRepository.save(user);
            }
        });
    }
}
