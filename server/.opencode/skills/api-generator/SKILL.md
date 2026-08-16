---
name: api-generator
description: Generate new REST API modules (entity, repository, mapper, DTOs, service, controller) for the SterioX Spring Boot server, following the exact conventions used in the user/stream/rbac modules.
---

# API Module Generator — SterioX Server

This skill defines the **mandatory conventions** for creating new REST API features in the
SterioX server (`D:\study\project\SterioX\server`). A developer or AI agent must follow
these rules **exactly** so all modules stay consistent and reviewable.

Every section below includes a **complete example file** taken verbatim from the real
`modules/user` codebase — copy the pattern, rename for your module.

## Tech Stack (do not change)

- **Spring Boot 4.0.6**, Java 21, Maven
- JPA / Hibernate with PostgreSQL (`spring-boot-starter-data-jpa`)
- Spring Security + OAuth2 Resource Server (JWT), method security via `@PreAuthorize`
- **MapStruct** (`org.mapstruct:mapstruct:1.6.3`) for DTO <-> Entity mapping
- Lombok for boilerplate
- Redis cache, RabbitMQ, WebSocket (STOMP) available when needed
- All modules live under `com.thlam05.steriox.modules.<module>`

---

## 1. Module Directory Layout

Every feature is a self-contained module under
`src/main/java/com/thlam05/steriox/modules/<module>/`:

```
modules/
└── <module>/
    ├── controller/     # <X>Controller.java
    ├── service/        # <X>Service.java
    ├── repository/     # <X>Repository.java
    ├── entity/         # <X>.java
    ├── mapper/         # <X>Mapper.java (MapStruct)
    ├── constant/       # <X>Message.java (error/validation message constants)
    └── dto/
        ├── request/    # Create<X>Request.java, Update<X>Request.java, ...
        └── response/   # <X>Response.java
```

Package declaration format:
```java
package com.thlam05.steriox.modules.<module>.controller;
```

### File naming conventions
| Layer          | Class name pattern                 | Example (`user` module)            |
|----------------|------------------------------------|------------------------------------|
| Entity         | `<X>` (PascalCase)                 | `User.java`                        |
| Repository     | `<X>Repository`                    | `UserRepository.java`              |
| Mapper         | `<X>Mapper`                        | `UserMapper.java`                  |
| Request DTO    | `Create<X>Request`, `Update<X>Request` | `CreateUserRequest.java`       |
| Response DTO   | `<X>Response`                      | `UserResponse.java`                |
| Service        | `<X>Service`                       | `UserService.java`                 |
| Controller     | `<X>Controller`                    | `UserController.java`              |
| Messages       | `<X>Message`                       | `UserMessage.java`                 |

> Naming must match the module. A `chat` module uses `ChatMessage.java` (entity),
> `ChatMessageRepository.java`, `ChatMessageRequest.java`, etc.

---

## 2. Entity (`entity/`)

Rules:
- Extend `com.thlam05.steriox.common.model.BaseModel` (adds `createdAt` / `updatedAt`).
- `@Entity(name = "<table>")` and `@Table(name = "<table>")` — lowercase plural table name.
- Lombok: `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder`.
- ID: `String id` with `@Id @GeneratedValue(strategy = GenerationType.UUID)`.
- Relationships are **LAZY** (`FetchType.LAZY`); use `@ManyToOne`, `@ManyToMany`
  with explicit `@JoinTable`/`@JoinColumn` names (snake_case).
- Columns: `@Column(name = "snake_case", nullable = false, unique = true)` as needed.

Complete example — `modules/user/entity/User.java`:
```java
package com.thlam05.steriox.modules.user.entity;

import java.util.Set;

import com.thlam05.steriox.common.model.BaseModel;
import com.thlam05.steriox.modules.rbac.entity.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "users")
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class User extends BaseModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "avatar_image_url")
    private String avatarImageUrl;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_name"))
    private Set<Role> roles;
}
```

---

## 3. Repository (`repository/`)

Rules:
- Interface extending `JpaRepository<Entity, String>` (ID type is `String`).
- Derived query methods only: `findByX`, `existsByXIgnoreCase`, `findByUserId`, etc.
- No `@Repository` annotation needed; no custom `@Query` unless unavoidable.

Complete example — `modules/user/repository/UserRepository.java`:
```java
package com.thlam05.steriox.modules.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thlam05.steriox.modules.user.entity.User;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByUsernameIgnoreCase(String username);
}
```

---

## 4. Mapper (`mapper/`)

Rules:
- Interface annotated `@Mapper(componentModel = "spring")`.
- MapStruct methods with `@Mapping(target = "...", ignore = true)` for fields the
  service sets manually (id, relations, flags, timestamps).
- **Complex/derived mapping** is done via `default` methods with manual setters
  (never rely on MapStruct guessing).
- Always provide null-safe `to<X>Response` and a list variant `to<X>Responses`.

Complete example — `modules/user/mapper/UserMapper.java`:
```java
package com.thlam05.steriox.modules.user.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thlam05.steriox.modules.user.dto.request.CreateUserRequest;
import com.thlam05.steriox.modules.user.dto.response.UserResponse;
import com.thlam05.steriox.modules.user.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toUser(CreateUserRequest request);

    default UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setAvatarImageUrl(user.getAvatarImageUrl());
        response.setRoles(
                user.getRoles() != null
                        ? user.getRoles().stream()
                                .map(r -> r.getName())
                                .collect(Collectors.toList())
                        : null);
        return response;
    }

    default List<UserResponse> toUserResponses(List<User> users) {
        if (users == null) {
            return null;
        }
        return users.stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }
}
```

---

## 5. DTOs (`dto/request`, `dto/response`)

Rules:
- Plain POJOs with Lombok: `@Getter @Setter @NoArgsConstructor @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)`.
- **No Bean Validation annotations** (`@NotBlank`, etc.) — validation is manual in the service.
- Request classes: `Create<X>Request` (all mutable fields) and `Update<X>Request`
  (only the fields that can be changed; nullable = "leave unchanged").
- Response classes: id + all fields clients need; never expose passwords or internals.

Complete examples:

`modules/user/dto/request/CreateUserRequest.java`:
```java
package com.thlam05.steriox.modules.user.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateUserRequest {
    String username;
    String email;
    String password;
    String avatarImageUrl;
}
```

`modules/user/dto/request/UpdateUserRequest.java`:
```java
package com.thlam05.steriox.modules.user.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRequest {
    String username;
    String email;
    String avatarImageUrl;
}
```

`modules/user/dto/response/UserResponse.java`:
```java
package com.thlam05.steriox.modules.user.dto.response;

import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String username;
    String email;
    String avatarImageUrl;
    List<String> roles;
}
```

---

## 6. Service (`service/`) — core business logic

Rules:
- `@Service @RequiredArgsConstructor`; dependencies injected as `private final` fields.
- Method naming: `create`, `getById`, `getAll`, `getByUserId`, `getCurrentUser`,
  `update`, `updateProfile`, `delete`, `changePassword`, ...
- **Every resource lookup throws** `AppException`:
  ```java
  .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, XxxMessage.X_NOT_FOUND));
  ```
- **Validation is manual** in private `validateCreateRequest` / `validateUpdateRequest`
  methods. Throw `AppException(ResponseCode.BAD_REQUEST, XxxMessage.XXX)`.
- Uniqueness checks use the repository (`existsByXIgnoreCase`).
- Ownership checks throw `AppException(ResponseCode.FORBIDDEN, XxxMessage.XXX)`.
- Authorization: `@PreAuthorize("hasAuthority('CREATE:USER')")` style, or
  `@PreAuthorize("hasAuthority('UPDATE:USER') or authentication.principal.claims['sub'] == #id")`
  for owner-or-admin.
- Password handling: always `passwordEncoder.encode(...)` / `passwordEncoder.matches(...)`.
- Mutations return the fresh mapped response via `repository.save(...)` + mapper.

Complete example — `modules/user/service/UserService.java`:
```java
package com.thlam05.steriox.modules.user.service;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.user.constant.UserMessage;
import com.thlam05.steriox.modules.user.dto.request.ChangePasswordRequest;
import com.thlam05.steriox.modules.user.dto.request.CreateUserRequest;
import com.thlam05.steriox.modules.user.dto.request.UpdateUserRequest;
import com.thlam05.steriox.modules.user.dto.response.UserResponse;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.mapper.UserMapper;
import com.thlam05.steriox.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @PreAuthorize("hasAuthority('CREATE:USER')")
    public UserResponse create(CreateUserRequest request) {
        validateCreateRequest(request);

        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new AppException(ResponseCode.USER_ALREADY_EXISTS, UserMessage.EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.USERNAME_ALREADY_EXISTS);
        }

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    public UserResponse getById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, UserMessage.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    public List<UserResponse> getAll() {
        List<User> users = userRepository.findAll();
        return userMapper.toUserResponses(users);
    }

    public UserResponse getCurrentUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, UserMessage.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    public UserResponse updateProfile(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, UserMessage.USER_NOT_FOUND));

        validateUpdateRequest(request);

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
                throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.EMAIL_ALREADY_EXISTS);
            }
            user.setEmail(request.getEmail());
        }

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
                throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.USERNAME_ALREADY_EXISTS);
            }
            user.setUsername(request.getUsername());
        }

        if (request.getAvatarImageUrl() != null) {
            user.setAvatarImageUrl(request.getAvatarImageUrl());
        }

        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    public void changePassword(String id, ChangePasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, UserMessage.USER_NOT_FOUND));

        if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.CURRENT_PASSWORD_REQUIRED);
        }

        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.NEW_PASSWORD_REQUIRED);
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.CURRENT_PASSWORD_INCORRECT);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @PreAuthorize("hasAuthority('UPDATE:USER') or authentication.principal.claims['sub'] == #id")
    public UserResponse update(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, UserMessage.USER_NOT_FOUND));

        validateUpdateRequest(request);

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
                throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.EMAIL_ALREADY_EXISTS);
            }
            user.setEmail(request.getEmail());
        }

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
                throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.USERNAME_ALREADY_EXISTS);
            }
            user.setUsername(request.getUsername());
        }

        if (request.getAvatarImageUrl() != null) {
            user.setAvatarImageUrl(request.getAvatarImageUrl());
        }

        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasAuthority('DELETE:USER')")
    public void delete(String id) {
        if (!userRepository.existsById(id)) {
            throw new AppException(ResponseCode.NOT_FOUND, UserMessage.USER_NOT_FOUND);
        }

        userRepository.deleteById(id);
    }

    private void validateCreateRequest(CreateUserRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.USERNAME_REQUIRED);
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.EMAIL_REQUIRED);
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.PASSWORD_REQUIRED);
        }

        if (!isValidEmail(request.getEmail())) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.INVALID_EMAIL_FORMAT);
        }
    }

    private void validateUpdateRequest(UpdateUserRequest request) {
        if (request.getEmail() != null && !request.getEmail().isBlank() && !isValidEmail(request.getEmail())) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.INVALID_EMAIL_FORMAT);
        }

        if (request.getUsername() != null && request.getUsername().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.USERNAME_CANNOT_BE_EMPTY);
        }
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }
}
```

> Extra request DTO used above — `modules/user/dto/request/ChangePasswordRequest.java`:
```java
package com.thlam05.steriox.modules.user.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePasswordRequest {
    String currentPassword;
    String newPassword;
}
```

---

## 7. Controller (`controller/`) — thin layer only

Rules:
- `@RestController @RequiredArgsConstructor`; inject the service as `private final`.
- Every endpoint returns `ApiResponse<T>`:
  - Success with data: `new ApiResponse<>(response)`
  - Success without body: `new ApiResponse<>(ResponseCode.SUCCESS)`
- Path prefix: `/<plural-resource>` — e.g. `/users`, `/streams`, `/roles`.
- Standard verbs: `GET` (list / by id / /me), `POST` (create), `PUT` (full update),
  `PATCH` (partial update / profile / password), `DELETE`.
- **Authenticated user**: take `Authentication authentication` param and read
  `authentication.getName()` (JWT `sub`). Do **not** trust client-supplied user ids
  for identity operations.
- For endpoints where auth is required but the framework injects a null principal,
  check `authentication == null || !authentication.isAuthenticated()` and throw
  `new AppException(ResponseCode.UNAUTHORIZED)`.

Complete example — `modules/user/controller/UserController.java`:
```java
package com.thlam05.steriox.modules.user.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.dto.ApiResponse;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.user.dto.request.ChangePasswordRequest;
import com.thlam05.steriox.modules.user.dto.request.CreateUserRequest;
import com.thlam05.steriox.modules.user.dto.request.UpdateUserRequest;
import com.thlam05.steriox.modules.user.dto.response.UserResponse;
import com.thlam05.steriox.modules.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/users")
    public ApiResponse<UserResponse> create(@RequestBody CreateUserRequest request) {
        UserResponse response = userService.create(request);
        return new ApiResponse<>(response);
    }

    @GetMapping("/users")
    public ApiResponse<List<UserResponse>> getAll() {
        List<UserResponse> response = userService.getAll();
        return new ApiResponse<>(response);
    }

    @GetMapping("/users/me")
    public ApiResponse<UserResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ResponseCode.UNAUTHORIZED);
        }
        String id = authentication.getName();
        UserResponse response = userService.getCurrentUser(id);
        return new ApiResponse<>(response);
    }

    @PatchMapping("/users/profile")
    public ApiResponse<UserResponse> updateProfile(Authentication authentication, @RequestBody UpdateUserRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ResponseCode.UNAUTHORIZED);
        }
        String id = authentication.getName();
        UserResponse response = userService.updateProfile(id, request);
        return new ApiResponse<>(response);
    }

    @PatchMapping("/users/password")
    public ApiResponse<?> changePassword(Authentication authentication, @RequestBody ChangePasswordRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ResponseCode.UNAUTHORIZED);
        }
        String id = authentication.getName();
        userService.changePassword(id, request);
        return new ApiResponse<>(ResponseCode.SUCCESS);
    }

    @GetMapping("/users/{id}")
    public ApiResponse<UserResponse> getById(@PathVariable String id) {
        UserResponse response = userService.getById(id);
        return new ApiResponse<>(response);
    }

    @PutMapping("/users/{id}")
    public ApiResponse<UserResponse> update(@PathVariable String id, @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.update(id, request);
        return new ApiResponse<>(response);
    }

    @DeleteMapping("/users/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        userService.delete(id);
        return new ApiResponse<>(ResponseCode.SUCCESS);
    }
}
```

---

## 8. Message Constants (`constant/`)

Rules:
- `@NoArgsConstructor(access = AccessLevel.PRIVATE)` + `public static final String`.
- Constants in ALL_CAPS, English message text.
- One constant per user-facing message: not-found, already-exists, required,
  invalid-format, forbidden messages.

Complete example — `modules/user/constant/UserMessage.java`:
```java
package com.thlam05.steriox.modules.user.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserMessage {
    public static final String EMAIL_ALREADY_EXISTS = "Email already exists";
    public static final String USERNAME_ALREADY_EXISTS = "Username already exists";
    public static final String USER_NOT_FOUND = "User not found";
    public static final String CURRENT_PASSWORD_REQUIRED = "Current password is required";
    public static final String NEW_PASSWORD_REQUIRED = "New password is required";
    public static final String CURRENT_PASSWORD_INCORRECT = "Current password is incorrect";
    public static final String USERNAME_REQUIRED = "Username is required";
    public static final String EMAIL_REQUIRED = "Email is required";
    public static final String PASSWORD_REQUIRED = "Password is required";
    public static final String INVALID_EMAIL_FORMAT = "Invalid email format";
    public static final String USERNAME_CANNOT_BE_EMPTY = "Username cannot be empty";
}
```

---

## 9. Error Handling & Response Codes

- Use existing `com.thlam05.steriox.common.constant.ResponseCode` values:
  `SUCCESS`, `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`,
  `USER_ALREADY_EXISTS`, `INTERNAL_SERVER_ERROR`.
- **Do not create a new ResponseCode** unless the codebase owner approves; prefer
  composing existing codes with a specific message constant.
- Throw `new AppException(ResponseCode.X, XxxMessage.Y)` everywhere.
- Never return raw exceptions from controllers.

Reference `com.thlam05.steriox.common.exception.AppException`:
```java
package com.thlam05.steriox.common.exception;

import com.thlam05.steriox.common.constant.ResponseCode;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {

    private final ResponseCode responseCode;

    public AppException(ResponseCode responseCode) {
        super(responseCode.getMessage());
        this.responseCode = responseCode;
    }

    public AppException(
            ResponseCode responseCode,
            String customMessage) {
        super(customMessage);
        this.responseCode = responseCode;
    }
}
```

---

## 10. Security Integration (`security/config/SecurityConfig.java`)

- Public endpoints are listed in `PUBLIC_ENDPOINT` or via `requestMatchers`:
  ```java
  .requestMatchers(HttpMethod.GET, "/streams", "/streams/*").permitAll()
  .requestMatchers("/ws/**", "/ws-chat/**").permitAll()
  .anyRequest().authenticated()
  ```
- If a new module's `GET` endpoints must be public, add them there.
- Everything else is JWT-authenticated via the existing resource-server chain.

Complete example — `security/config/SecurityConfig.java`:
```java
package com.thlam05.steriox.security.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private String[] PUBLIC_ENDPOINT = { "/auth/login", "/auth/register", "/auth/refresh", "/auth/introspec",
            "/ws/**" };

    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(csrf -> csrf.disable());

        httpSecurity.authorizeHttpRequests(request -> request
                .requestMatchers(PUBLIC_ENDPOINT).permitAll()
                .requestMatchers(HttpMethod.GET, "/streams", "/streams/*").permitAll()
                .requestMatchers("/ws/**", "/ws-chat/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated());

        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwtConfigurer -> jwtConfigurer
                        .decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
                .accessDeniedHandler(jwtAccessDeniedHandler));

        httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return httpSecurity.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## 11. Code Style Rules

- Import order: `java.*` / `jakarta.*`, then `org.springframework.*`, then
  `com.thlam05.steriox.*`, then Lombok — blank line between groups (matches existing files).
- 4-space indentation, no tabs.
- No comments unless requested.
- Use `Optional` / `orElseThrow` for lookups; avoid returning `null` literals where a
  mapper default method already handles it.
- Constructor injection only via Lombok `@RequiredArgsConstructor`.

---

## 12. Generate a New Module — Step-by-Step Checklist

1. **Plan the module**: resource name (e.g. `chat`, `follow`), CRUD surface,
   public vs authenticated endpoints, ownership rules.
2. **Entity** — extend `BaseModel`, UUID id, snake_case table, lazy relations (see §2).
3. **Repository** — `JpaRepository<Entity, String>` + derived queries (see §3).
4. **Request DTOs** — `Create<X>Request`, `Update<X>Request` (Lombok POJOs, see §5).
5. **Response DTO** — `<X>Response` (see §5).
6. **Mapper** — MapStruct interface, `@Mapping(ignore = true)` + manual default methods (see §4).
7. **Messages** — `<X>Message` constants (see §8).
8. **Service** — CRUD + validation + ownership + `@PreAuthorize` where applicable (see §6).
9. **Controller** — thin REST endpoints returning `ApiResponse<T>` (see §7).
10. **SecurityConfig** — register any public paths (see §10).
11. **Verify** — run `mvnw compile` (from `D:\study\project\SterioX\server`) to confirm
    MapStruct annotation processing and compilation succeed.

### Reference modules to copy from
- `modules/user` — simplest full CRUD + auth/ownership pattern (all examples above).
- `modules/stream` — nested relations (user, categories), more complex mapper, derived queries.
- `modules/rbac` — enum constants (`RoleType`), string-keyed entities.
