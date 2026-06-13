package com.thlam05.steriox.config;

import java.util.List;
import java.util.Set;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.enums.RoleType;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.rbac.entity.Role;
import com.thlam05.steriox.modules.rbac.repository.RoleRepository;
import com.thlam05.steriox.modules.stream.entity.Stream;
import com.thlam05.steriox.modules.stream.repository.StreamRepository;
import com.thlam05.steriox.modules.stream.service.StreamSchedulerService;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class ApplicationInitConfig {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final StreamSchedulerService streamSchedulerService;
    private final StreamRepository streamRepository;

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            // Initialize roles if they don't exist
            if (!roleRepository.existsById(RoleType.ADMIN.toString())) {
                Role adminRole = Role.builder()
                        .name(RoleType.ADMIN.toString())
                        .permissions(Set.of())
                        .build();
                roleRepository.save(adminRole);
            }

            if (!roleRepository.existsById(RoleType.VIEWER.toString())) {
                Role viewerRole = Role.builder()
                        .name(RoleType.VIEWER.toString())
                        .permissions(Set.of())
                        .build();
                roleRepository.save(viewerRole);
            }

            if (!roleRepository.existsById(RoleType.STREAMER.toString())) {
                Role streamerRole = Role.builder()
                        .name(RoleType.STREAMER.toString())
                        .permissions(Set.of())
                        .build();
                roleRepository.save(streamerRole);
            }

            // Create admin user if it doesn't exist
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

            startStreamSchedular();
        };
    }

    private void startStreamSchedular() {
        List<Stream> streams = streamRepository.findAllStreamOnline();
        for (var stream : streams) {
            streamSchedulerService.startHeartbeatTask(stream.getId());
        }
    }
}