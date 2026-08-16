# AGENTS.md - backend

## Commands

- `mvn spring-boot:run` (hoặc `./mvnw spring-boot:run` nếu có wrapper) — chạy dev server
- `mvn clean package` — build ra file `.jar` trong `target/`; chạy bằng `java -jar target/<artifact>.jar`
- `mvn test` — chạy unit test (JUnit 5), colocated theo convention Maven: `src/test/java/...`, class kết thúc bằng `*Tests.java`/`*Test.java`
- `mvn verify` — chạy cả unit test + integration test (nếu có cấu hình Failsafe plugin cho `*IT.java`)
- `mvn -N io.takari:maven:wrapper` — generate Maven wrapper (`mvnw`) nếu project chưa có
- Formatting/lint: dự án dùng plugin nào thì gọi plugin đó (ví dụ `mvn spotless:apply` nếu dùng Spotless, `mvn com.diffplug.spotless:spotless-maven-plugin:check`) — không có convention format bắt buộc sẵn trong Spring Boot như Prettier/ESLint của Node, cần khai báo plugin trong `pom.xml` nếu muốn.
- **Không có lệnh `typecheck` riêng** — Java compile-time đã type-check khi `mvn compile`/`mvn package`.

## Conventions & gotchas

### Database & JPA/Hibernate

- Kết nối database phải đọc cấu hình (host, port, user, password, database) từ `application.properties`/`application.yml`, dùng biến môi trường qua `${DB_HOST}`, không hard-code.
- Entity dùng `@Entity`, `@Table(name = "...")`; repository kế thừa `JpaRepository<T, ID>` (Spring Data JPA), không tự viết query CRUD thủ công nếu không cần thiết.
- `spring.jpa.hibernate.ddl-auto=validate` (hoặc `none`) bắt buộc khi đã dùng migration (production) — **không dùng `update`/`create`** ở production.
- Phải có migration tool (Flyway hoặc Liquibase) với file version rõ ràng (`V1__init_schema.sql`, ...); entity phải khớp chính xác với migration (tên cột, kiểu, nullable, `created_at`/`updated_at`).
- Seed dữ liệu (nếu có, qua `data.sql`/`CommandLineRunner`) phải đúng tham chiếu (đúng enum, đúng khóa ngoại, ...).
- Phân trang: dùng `Pageable`/`Page<T>` của Spring Data, bọc qua `PageResponse` (xem `common/dto/PageResponse.java`) — trả `content`, `page`, `size`, `totalElements`, `totalPages` tách rõ, không tự tính tay.
- Tránh N+1 — dùng `@EntityGraph`, `JOIN FETCH` trong `@Query`, hoặc cấu hình `fetch = FetchType.LAZY` hợp lý khi entity có quan hệ.

### Chuẩn Spring Boot & Architecture

- **Cấu trúc package-by-feature** (mặc định): mỗi domain (auth, user, gift, ...) là một package riêng chứa đủ Controller + Service + Repository + Entity + DTO của nó. Chỉ những gì thực sự dùng chung (Security config, Exception handler, response envelope) mới đặt trong `common/`.
- `application.properties`/`application.yml`: cấu hình phải tách theo profile (`application-dev.properties`, `application-prod.properties`, ...) khi cần, dùng `@ConfigurationProperties`/`@Value` để inject vào code thay vì đọc `System.getenv()` trực tiếp.
- Validation: bật `spring-boot-starter-validation`, dùng `@Valid` ở tham số controller + annotation `@NotNull`, `@NotBlank`, `@Size`, ... trên request DTO.
- Dependency injection: dùng **constructor injection** (`private final XService service;` + constructor, hoặc `@RequiredArgsConstructor` của Lombok) — **không dùng field injection với `@Autowired` trên field**.
- Security/Filter: `SecurityFilterChain` bean khai báo trong `common/config/SecurityConfig.java`; các endpoint public vs protected phải khai báo tường minh (`.requestMatchers(...).permitAll()` / `.anyRequest().authenticated()`).

### API & HTTP

- Tạo resource: `POST /name` (không dùng `POST /name/create`).
- HTTP status chuẩn: `201 Created` (dùng `ResponseEntity.status(HttpStatus.CREATED)`), `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `204 No Content` cho delete.
- Response tạo mới phải trả lại resource (có `id`), bọc trong `ApiResponse<T>`.
- List rỗng vẫn trả `200` với `data: []` (hoặc `content: []` trong `PageResponse`), không throw lỗi.
- Path variable `{id}` nên dùng đúng kiểu (`Long id` hoặc `UUID id` trong method signature) để Spring tự validate format, tránh nhận `String` rồi tự parse tay.
- Login sai email/password trả `400`; `401` chỉ dùng cho API bảo vệ khi token thiếu/sai/hết hạn.
- Login: tránh user enumeration (message lỗi sai email/password phải giống nhau).
- Phân quyền: API yêu cầu role (VD admin) dùng `@PreAuthorize("hasRole('ADMIN')")` (bật `@EnableMethodSecurity`) hoặc check trong `SecurityFilterChain`, dùng Enum role chứ không hard-code string.
- API User Profile: phải hỗ trợ xem profile (`GET /users/me`), sửa profile (`PATCH /users/me`) và đổi mật khẩu (verify old password, hash new password).
- **Mọi endpoint controller phải trả `ApiResponse<T>`** (hoặc `ResponseEntity<ApiResponse<T>>`) — không trả bare object/list/`Page<T>` trực tiếp. Lỗi (not-found, validation, unexpected) đều đi qua `GlobalExceptionHandler`, không tự dựng error response trong controller/service.

### Cấu trúc & response

- Controller chỉ gọi service (`@RestController` mỏng), không gắn logic DB trực tiếp — logic nghiệp vụ nằm ở `@Service`.
- Entity, DTO, Repository, Controller, Service của một feature nằm chung package của feature đó (package-by-feature), không tách top-level `controller/`, `service/`, `repository/` dùng chung cho toàn bộ project (trừ khi được yêu cầu khác).
- DTO request/response tách rõ; request DTO validate bằng `jakarta.validation` annotation, response DTO map từ entity qua Mapper/MapStruct/thủ công — không trả raw Entity ra ngoài.
- Response luôn bọc qua `ApiResponse<T>`/`PageResponse<T>` trong `common/dto/` — không trả raw object.
- Không dùng `throw new RuntimeException(...)` tùy tiện — dùng custom exception (VD `ResourceNotFoundException`) và để `GlobalExceptionHandler` (`@RestControllerAdvice`) convert sang response chuẩn.

### Bảo mật & Xử lý File

- Mật khẩu hash bằng `BCryptPasswordEncoder`, không trả `password` trong response (dùng `@JsonIgnore` trên field hoặc loại bỏ hẳn ở response DTO).
- JWT secret/expiration đọc từ `application.properties` (`jwt.secret`, `jwt.expiration`) qua `@Value`/`@ConfigurationProperties`, phải validate secret tồn tại và expiration hợp lệ (tránh giá trị âm/NaN khi parse).
- Path file (avatar, upload — nếu có): tránh double prefix đường dẫn (`/uploads/uploads/...`).
- Xóa file: xử lý chuẩn xác leading slash `/` để không bị lỗi path khi xóa (dùng `Paths.get(...)`/`File` API thay vì string nối tay).

### Naming & format

- Class / Entity / DTO: `PascalCase` (VD `UserService`, `LoginRequest`, `User`, `Gift`).
- Field, biến, method: `camelCase` (VD `fullName`, `createdAt`, `findAllActive`).
- Package name: toàn bộ **chữ thường**, không dùng gạch dưới/gạch ngang (`com.example.giftsystem`, không phải `com.example.gift_system`).
- File: **một public top-level class/interface trên một file**, tên file trùng tên class.
- Không typo trong tên class/file/method.
- Import: dùng import tường minh (không wildcard `import com.example.*`), thống nhất thứ tự import (nếu dùng plugin format thì để plugin tự sort).

### Code logic

- Không `System.out.println`/`e.printStackTrace()` trong code production cũng như seed/CLI runner — dùng `Logger` (SLF4J, VD `LoggerFactory.getLogger(...)` hoặc `@Slf4j` của Lombok).
- Không dead code / check thừa.
- Dùng enum/constant thay magic string (Role, Enum, Message lỗi, Constant key) — VD `enum UserRole { ADMIN, USER }` thay vì so sánh chuỗi `"admin"`.
- Không dùng version Spring Boot/dependency đoán từ trí nhớ khi cần bản mới nhất — kiểm tra lại nếu độ chính xác quan trọng.
