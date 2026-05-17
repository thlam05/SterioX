package com.thlam05.steriox.config;

import com.thlam05.steriox.common.enums.RoleType;
import com.thlam05.steriox.modules.auth.model.Role;
import com.thlam05.steriox.modules.auth.model.User;
import com.thlam05.steriox.modules.auth.repository.AuthRepository;

import lombok.RequiredArgsConstructor;

import java.util.Set;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationInitConfig {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner() {
        return (arg -> {
            if (authRepository.findByEmail("admin@steriox.com").isEmpty()) {
                User user = User.builder()
                        .email("admin@steriox.com")
                        .username("admin")
                        .password(passwordEncoder.encode("123456"))
                        .roles(Set.of(new Role(RoleType.ADMIN.name())))
                        .build();

                authRepository.save(user);
            }
        });
    }
}
