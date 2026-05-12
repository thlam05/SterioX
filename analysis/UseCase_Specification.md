# ĐẶC TẢ USE CASE (USE CASE SPECIFICATION)
## Dự án: SterioX — Nền tảng livestream web

Tài liệu này tổng hợp các đặc tả Use Case cho phạm vi MVP (và một Use Case Post-MVP minh họa) của SterioX, căn cứ [SRS](./SRS.md) và [Product Vision](./Product_Vision.md). Mỗi Use Case lặp lại **cùng cấu trúc mục** theo template chuẩn (Mục 1–10).

---

## Phần phân tích & Traceability

### Phân tích Product Vision (tóm tắt)

| Khía cạnh | Nội dung |
| :--- | :--- |
| **Business goals** | Web-first livestream ổn định; chat realtime có kiểm soát; khám phá tối thiểu; quản trị & báo cáo vi phạm; phục vụ học tập/demo có kiểm soát phạm vi. |
| **Actors** | Khách, Viewer, Streamer, Moderator kênh, Chủ/Members group, Admin nền tảng; Hệ thống SterioX; Dịch vụ CDN/stream (actor phụ kỹ thuật). |
| **Phạm vi** | MVP: auth, RBAC, live ingest/view, chat + mod kênh, group + group chat, follow, discover/search tối thiểu, reports + admin, audit cơ bản, anti-abuse. Post-MVP: VOD, monetization sandbox, email/push nâng cao (tham chiếu một UC riêng). |
| **Workflow tổng quát** | Đăng ký → đăng nhập → (Streamer) cấu hình kênh & ingest → phát → Viewer vào phòng xem & chat → Mod/Streamer kiểm duyệt → User báo cáo → Admin xử lý & audit. |

### Phân tích SRS

Các yêu cầu chức năng được nhóm theo REQ-001–REQ-081 trong SRS Mục 4. Mỗi Use Case dưới đây tham chiếu mã REQ liên quan trong **Extension Points** và **Business Rules** để đảm bảo traceability và không mâu thuẫn với SRS.

**Giả định bổ sung (khi SRS không chi tiết UI):** luồng “đặt lại mật khẩu” gửi email qua nhà cung cấp SMTP/API khi cấu hình môi trường có hiệu lực; trên môi trường dev không có email thật có thể ghi log token một lần — **TBD** theo chính sách an toàn dự án.

---

### Danh sách Use Case chính

| Mã | Tên Use Case | Actor chính | Giai đoạn | REQ chính (tham chiếu) |
| :--- | :--- | :--- | :--- | :--- |
| UC-01 | Đăng ký tài khoản | Viewer (chưa đăng nhập) | MVP | REQ-001–003, 063 |
| UC-02 | Đăng nhập | Viewer | MVP | REQ-004, 007–008, 063 |
| UC-03 | Khôi phục mật khẩu | Viewer | MVP | REQ-005 |
| UC-04 | Đăng xuất | Viewer đã đăng nhập | MVP | REQ-006 |
| UC-05 | Cập nhật hồ sơ và kênh streamer | Viewer / Streamer | MVP | REQ-015–019 |
| UC-06 | Chuẩn bị phát sóng live (ingest key & metadata phiên) | Streamer | MVP | REQ-020–026, 028–030 |
| UC-07 | Xem phòng live | Viewer / Khách | MVP | REQ-032–036 |
| UC-08 | Gửi tin nhắn chat trên luồng live | Viewer đã đăng nhập | MVP | REQ-037–046, 038–041, 062 |
| UC-09 | Kiểm duyệt chat và người dùng trên kênh | Streamer / Moderator kênh | MVP | REQ-042–045 |
| UC-10 | Follow và unfollow kênh | Viewer đã đăng nhập | MVP | REQ-047–048 |
| UC-11 | Tạo group và tham gia group chat | Viewer đã đăng nhập | MVP | REQ-049–052 |
| UC-12 | Khám phá và tìm kiếm luồng đang live | Viewer / Khách | MVP | REQ-053–057 |
| UC-13 | Gửi báo cáo vi phạm | Viewer đã đăng nhập | MVP | REQ-058–061 |
| UC-14 | Quản trị nền tảng (dashboard, danh mục, đình chỉ, báo cáo, người dùng) | Admin | MVP | REQ-064–068, 027, 065–066 |
| UC-15 | Xem và quản lý thông báo trong ứng dụng | Viewer / Streamer | MVP | REQ-073–074 |
| UC-16 | Donate qua cổng thanh toán sandbox *(Post-MVP)* | Viewer đã đăng nhập | Post-MVP | REQ-080–081 |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-01 — Đăng ký tài khoản

## 1. Tên Use Case (Use Case Name)
Đăng ký tài khoản

### 1.1 Tóm tắt (Brief Description)
Use Case này cho phép người dùng mới tạo tài khoản SterioX bằng email và mật khẩu. Khi thành công, hệ thống lưu người dùng với mật khẩu đã băm và cho phép đăng nhập ở Use Case khác. Giá trị nghiệp vụ: thiết lập danh tính tin cậy cho mọi tương tác có kiểm soát (chat, follow, báo cáo).

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Người dùng mới | Actor chính | Người chưa có tài khoản, truy cập biểu mẫu đăng ký. |
| Hệ thống SterioX | Hệ thống | Xác thực đầu vào, lưu trữ, áp dụng CAPTCHA khi cần. |
| Dịch vụ CAPTCHA (tùy điều kiện) | Actor phụ / Hệ thống ngoài | Xác minh bot theo REQ-063. |

---

## 3. Tiền điều kiện (Preconditions)

1. Người dùng chưa được xác thực trong phiên hiện tại (hoặc đã đăng xuất).
2. Endpoint đăng ký và cơ sở dữ liệu người dùng đang hoạt động (healthcheck đạt).

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Actor mở trang đăng ký trên ứng dụng web.
2. Hệ thống hiển thị biểu mẫu gồm các trường email, mật khẩu, xác nhận mật khẩu và (nếu bật theo cấu hình) tiện ích CAPTCHA.
3. Actor nhập email và mật khẩu thỏa quy tắc độ phức tạp; nhập lại xác nhận mật khẩu trùng khớp.
4. Actor gửi biểu mẫu (submit).
5. Hệ thống kiểm tra định dạng email (RFC 5322 đơn giản hóa), kiểm tra mật khẩu ≥ 8 ký tự và ít nhất ba trong bốn nhóm ký tự quy định, kiểm tra trùng khớp xác nhận mật khẩu.
6. Hệ thống kiểm tra email chưa tồn tại trong cơ sở dữ liệu.
7. Hệ thống băm mật khẩu bằng thuật toán thích hợp và lưu bản ghi người dùng mới.
8. Hệ thống phản hồi trạng thái thành công và chuyển Actor tới trang đăng nhập hoặc tự động đăng nhập theo chính sách sản phẩm (*TBD nếu chọn auto-login*).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 CAPTCHA được yêu cầu theo IP hoặc burst
Tại bước **4** của luồng chính, nếu Hệ thống xác định IP hoặc fingerprint vượt ngưỡng (theo REQ-063):
1. Hệ thống hiển thị hoặc kích hoạt CAPTCHA trước khi chấp nhận submit.
2. Actor hoàn thành CAPTCHA.
3. Hệ thống xác minh token CAPTCHA hợp lệ.
4. Quay lại bước **5** của luồng chính.

### 5.2 Đăng ký xong chuyển thẳng tới đăng nhập không tự động session
Tại bước **8** của luồng chính, nếu chính sách sản phẩm không tự động đăng nhập:
1. Hệ thống chỉ hiển thị thông báo thành công và liên kết “Đăng nhập”.
2. Actor chọn “Đăng nhập” và chuyển sang UC-02.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Email không hợp lệ hoặc mật khẩu không đạt quy tắc
Tại bước **5** của luồng chính, nếu dữ liệu không hợp lệ:
1. Hệ thống không ghi cơ sở dữ liệu.
2. Hệ thống trả về thông báo lỗi theo từng trường (email / mật khẩu) và mã lỗi chuẩn hóa cho client.
3. Actor chỉnh sửa và gửi lại từ bước **4**. Trạng thái hệ thống không thay đổi về mặt dữ liệu người dùng.

### 6.2 Email đã tồn tại
Tại bước **6** của luồng chính:
1. Hệ thống từ chối tạo bản ghi trùng.
2. Hệ thống hiển thị thông báo trùng email (không tiết lộ thông tin nhạy cảm khác).
3. Use Case kết thúc không tạo tài khoản; Actor có thể chọn đăng nhập (UC-02) hoặc dùng khôi phục mật khẩu (UC-03).

### 6.3 Lỗi máy chủ hoặc cơ sở dữ liệu
Tại bước **7** của luồng chính:
1. Hệ thống ghi log với correlation id, không lộ stack trace cho client.
2. Hệ thống trả mã lỗi 5xx hoặc thông báo “Thử lại sau”.
3. Không xác nhận tài khoản đã tạo; trạng thái cuối: không có bản ghi mới (hoặc giao dịch rollback).

---

## 7. Hậu điều kiện (Postconditions)

1. Một bản ghi người dùng mới tồn tại với email duy nhất và mật khẩu đã băm (REQ-003).
2. Thời điểm tạo tài khoản được lưu (theo thiết kế schema — *TBD* nếu chưa có cột).
3. Actor có thể thực hiện UC-02 với thông tin vừa đăng ký.

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Bảo mật:** TLS cho mọi giao tiếp public (SRS 5.3); không log mật khẩu thô (SRS 5.3).
- **Hiệu năng:** p95 xử lý yêu cầu đăng ký ≤ **1200 ms** trong điều kiện staging tải nhẹ (SRS 5.1).
- **Accessibility:** nhãn form và thông báo lỗi có thể đọc được bởi trình đọc màn hình trên luồng chính (SRS 5.4).

---

## 9. Điểm mở rộng (Extension Points)

- **EXT-01 → UC-02 Đăng nhập:** sau đăng ký thành công.
- **EXT-02 → REQ-063:** kích hoạt CAPTCHA theo ngưỡng IP/burst.
- **Traceability:** REQ-001, REQ-002, REQ-003, REQ-063.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC01-01 | Mật khẩu tối thiểu 8 ký tự và chứa ít nhất ba trong bốn nhóm: chữ hoa, chữ thường, số, ký tự đặc biệt (REQ-001). |
| BR-UC01-02 | Email phải duy nhất trong hệ thống (suy ra từ REQ-006 và luồng đăng nhập; đăng ký từ chối trùng). |
| BR-UC01-03 | Định dạng email phải thỏa quy tắc RFC 5322 đơn giản hóa (REQ-002). |
| BR-UC01-04 | CAPTCHA khi vượt ngưỡng IP/thất bại/burst (REQ-063). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-02 — Đăng nhập

## 1. Tên Use Case (Use Case Name)
Đăng nhập

### 1.1 Tóm tắt (Brief Description)
Use Case này xác thực danh tính người dùng bằng email và mật khẩu, thiết lập phiên làm việc hoặc token có thời hạn. Kết quả thành công cho phép truy cập các chức năng yêu cầu đăng nhập (chat, follow, báo cáo). Giá trị nghiệp vụ: đảm bảo RBAC và trách nhiệm đối với hành vi trên nền tảng.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Viewer | Actor chính | Người có tài khoản, cung cấp thông tin đăng nhập. |
| Hệ thống SterioX | Hệ thống | Xác thực, tạo phiên, áp dụng khóa tài khoản sau thất bại. |
| CAPTCHA | Hệ thống ngoài | Theo REQ-063 khi cần. |

---

## 3. Tiền điều kiện (Preconditions)

1. Tài khoản đã tồn tại (đăng ký trước đó).
2. Tài khoản không ở trạng thái vô hiệu hóa vĩnh viễn do Admin (nếu có cờ trạng thái).

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Actor mở trang đăng nhập.
2. Hệ thống hiển thị biểu mẫu email, mật khẩu và tùy chọn CAPTCHA.
3. Actor nhập email và mật khẩu và gửi biểu mẫu.
4. Hệ thống xác minh định dạng email cơ bản.
5. Hệ thống tra cứu người dùng theo email; nếu tồn tại, so khớp mật khẩu với băm đã lưu.
6. Hệ thống tạo phiên xác thực (cookie an toàn hoặc token JWT theo kiến trúc) và trả về ngữ cảnh người dùng gồm vai trò (REQ-014).
7. Hệ thống ghi nhận thời điểm đăng nhập cuối cùng (UTC, độ chính xác giây) — REQ-007.
8. Hệ thống chuyển Actor tới trang đích (ví dụ trang chủ hoặc URL redirect hợp lệ).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 “Ghi nhớ đăng nhập” *(TBD — nếu sản phẩm bật)*
Tại bước **3**, nếu Actor chọn “Ghi nhớ”:
1. Hệ thống thiết lập thời hạn phiên/token dài hơn theo chính sách.
2. Quay lại bước **8** của luồng chính.

*Assumption:* SRS không bắt buộc “remember me”; chỉ triển khai nếu không làm yếu bảo mật.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Sai mật khẩu hoặc email không tồn tại
Tại bước **5**:
1. Hệ thống từ chối xác thực và **không** tiết lộ email có tồn tại hay không (phản hồi thống nhất).
2. Hệ thống tăng bộ đếm thất bại cho IP/tài khoản theo cấu hình.
3. Nếu đạt ngưỡng (tham chiếu REQ-008: 5 lần trong 15 phút), khóa tạm thời hoặc yêu cầu CAPTCHA.
4. Trạng thái cuối: không phiên hợp lệ.

### 6.2 Tài khoản bị khóa hoặc vô hiệu hóa
Tại bước **5** hoặc **6**:
1. Hệ thống từ chối đăng nhập với mã lý do `ACCOUNT_DISABLED` hoặc tương đương.
2. Không tạo phiên.

### 6.3 Lỗi máy chủ
Tại bước **6**:
1. Trả lỗi 5xx và correlation id nội bộ.
2. Không xác nhận phiên cho client.

---

## 7. Hậu điều kiện (Postconditions)

1. Phiên xác thực hợp lệ tồn tại phía server (hoặc token được cấp).
2. `last_login_at` (hoặc tương đương) được cập nhật (REQ-007).
3. Client có thể gọi API có xác thực và nhận vai trò từ `/me` (REQ-014).

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Rate limiting:** endpoint đăng nhập chịu rate limit server-side (REQ-062).
- **Cookie:** `Secure`, `HttpOnly`, `SameSite` thích hợp khi dùng cookie session (SRS 5.3).
- **Logging:** không ghi mật khẩu hoặc token đầy đủ (SRS 5.3).

---

## 9. Điểm mở rộng (Extension Points)

- **UC-03:** Khôi phục mật khẩu từ liên kết “Quên mật khẩu”.
- **Traceability:** REQ-004, REQ-007, REQ-008, REQ-014, REQ-062, REQ-063.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC02-01 | Xác thực email+mật khẩu bắt buộc cho luồng chuẩn (REQ-004). |
| BR-UC02-02 | Khóa tạm sau N lần thất bại (mặc định tham chiếu 5/15 phút) — REQ-008. |
| BR-UC02-03 | Phản hồi đăng nhập thất bại phải thống nhất để giảm enumerate email. |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-03 — Khôi phục mật khẩu

## 1. Tên Use Case (Use Case Name)
Khôi phục mật khẩu

### 1.1 Tóm tắt (Brief Description)
Use Case cho phép người dùng đặt lại mật khẩu khi quên thông qua email chứa liên kết có thời hạn. Giá trị nghiệp vụ: duy trì quyền truy cập tài khoản hợp lệ mà không yêu cầu can thiệp Admin trong môi trường demo.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Viewer | Actor chính | Yêu cầu liên kết đặt lại và nhập mật khẩu mới. |
| Hệ thống SterioX | Hệ thống | Sinh token đặt lại, gửi email, xác nhận đặt lại. |
| Dịch vụ email | Hệ thống ngoài | SMTP/API gửi mail (*TBD* trên môi trường không có mail). |

---

## 3. Tiền điều kiện (Preconditions)

1. Email đã đăng ký trong hệ thống (đối với luồng thực — phản hồi vẫn thống nhất khi không tồn tại).
2. Kênh gửi email được cấu hình hoặc chế độ dev cho phép log token một lần (*TBD*).

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Actor chọn “Quên mật khẩu” trên trang đăng nhập.
2. Hệ thống hiển thị biểu mẫu nhập email.
3. Actor nhập email và gửi yêu cầu.
4. Hệ thống kiểm tra định dạng email; nếu email tồn tại, sinh token đặt lại có thời hạn **≤ 60 phút** (REQ-005) và lưu băm token hoặc idempotent record.
5. Hệ thống gửi email chứa liên kết HTTPS tới trang đặt lại mật khẩu kèm token.
6. Actor mở email, chọn liên kết, mở trang đặt lại mật khẩu.
7. Hệ thống xác minh token còn hiệu lực và chưa sử dụng.
8. Actor nhập mật khẩu mới và xác nhận; Hệ thống kiểm tra quy tắc phức tạp giống REQ-001.
9. Hệ thống băm mật khẩu mới, cập nhật người dùng, vô hiệu hóa token đặt lại và (theo thiết kế) vô hiệu các phiên cũ.
10. Hệ thống hiển thị thành công và hướng dẫn đăng nhập (UC-02).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Email không tồn tại (phản hồi thống nhất)
Tại bước **4–5**:
1. Hệ thống **không** gửi email nhưng hiển thị cùng thông báo như trường hợp thành công “Nếu email tồn tại, đã gửi hướng dẫn” (REQ-005).
2. Use Case kết thúc; không lộ thông tin đếm email.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Token hết hạn hoặc đã dùng
Tại bước **7**:
1. Hệ thống từ chối và hiển thị mã `RESET_TOKEN_INVALID`.
2. Actor phải yêu cầu liên kết mới từ bước **1**.

### 6.2 Mật khẩu mới không đạt quy tắc
Tại bước **8**:
1. Hệ thống không cập nhật mật khẩu.
2. Hiển thị lỗi theo trường; Actor sửa và gửi lại tại bước **8**.

---

## 7. Hậu điều kiện (Postconditions)

1. Mật khẩu mới được lưu dưới dạng băm (REQ-003).
2. Token đặt lại không thể tái sử dụng.

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- Token đặt lại hết hạn ≤ **60 phút** (REQ-005).
- Gửi email qua TLS (SRS 3.4, 5.3).

---

## 9. Điểm mở rộng (Extension Points)

- **→ UC-02** sau đặt lại thành công.
- **Traceability:** REQ-005, REQ-001, REQ-003.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC03-01 | Liên kết đặt lại có TTL ≤ 60 phút (REQ-005). |
| BR-UC03-02 | Mật khẩu mới phải thỏa quy tắc REQ-001. |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-04 — Đăng xuất

## 1. Tên Use Case (Use Case Name)
Đăng xuất

### 1.1 Tóm tắt (Brief Description)
Use Case vô hiệu hóa phiên hiện tại của người dùng để kết thúc phiên làm việc an toàn trên thiết bị dùng chung. Giá trị nghiệp vụ: giảm rủi ro session hijacking và đảm bảo RBAC khi chuyển tài khoản.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Viewer đã đăng nhập | Actor chính | Chọn đăng xuất. |
| Hệ thống SterioX | Hệ thống | Thu hồi phiên/token phía server. |

---

## 3. Tiền điều kiện (Preconditions)

1. Actor đang có phiên xác thực hợp lệ.

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Actor chọn “Đăng xuất” trên giao diện.
2. Hệ thống gửi yêu cầu đăng xuất có xác thực CSRF (nếu dùng cookie session).
3. Hệ thống vô hiệu hóa session hiện tại hoặc đưa token vào denylist (theo kiến trúc).
4. Hệ thống xóa cookie phiên trên client (nếu áp dụng) và chuyển hướng về trang công khai.

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Đăng xuất khi token đã hết hạn
Tại bước **3**, nếu phiên không còn trên server:
1. Hệ thống coi như đã đăng xuất và chuyển về trang chủ.
2. Quay lại trạng thái không đăng nhập.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Lỗi mạng khi gọi API đăng xuất
Tại bước **2–3**:
1. Client xóa token/cookie cục bộ nếu có cơ chế an toàn.
2. Hiển thị cảnh báo “Đăng xuất có thể chưa hoàn tất trên server”; khuyến nghị thử lại.

---

## 7. Hậu điều kiện (Postconditions)

1. Phiên hiện tại không còn hợp lệ trên server (REQ-006).
2. Actor là Khách đối với tài nguyên yêu cầu đăng nhập.

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Bảo mật:** chống CSRF cho POST đăng xuất (SRS 5.3).

---

## 9. Điểm mở rộng (Extension Points)

- **Traceability:** REQ-006.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC04-01 | Một yêu cầu đăng xuất hợp lệ phải vô hiệu đúng phiên được gửi kèm (REQ-006). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-05 — Cập nhật hồ sơ và kênh streamer

## 1. Tên Use Case (Use Case Name)
Cập nhật hồ sơ và kênh streamer

### 1.1 Tóm tắt (Brief Description)
Use Case cho phép người dùng đã đăng nhập cập nhật avatar, thông tin kênh (tiêu đề kênh, bio, liên kết), chặn người dùng khác, và Streamer gán Moderator kênh. Giá trị nghiệp vụ: hiển thị danh tính công khai nhất quán và phân quyền kiểm duyệt đúng phạm vi kênh.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Viewer / Streamer | Actor chính | Chỉnh sửa hồ sơ hoặc kênh của mình; Streamer gán mod. |
| Hệ thống SterioX | Hệ thống | Validate, lưu, cập nhật danh sách moderator. |

---

## 3. Tiền điều kiện (Preconditions)

1. Actor đã đăng nhập (UC-02).
2. Đối với gán Moderator: Actor có vai trò Streamer trên kênh đó (REQ-010).

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Actor mở trang cài đặt hồ sơ hoặc trang quản lý kênh.
2. Hệ thống hiển thị dữ liệu hiện tại (avatar, bio, tiêu đề kênh, liên kết).
3. Actor tải avatar mới (JPEG/PNG, ≤ 5 MB) hoặc giữ avatar cũ (REQ-015).
4. Actor chỉnh sửa bio và tối đa ba liên kết `http`/`https` (REQ-016).
5. Actor lưu thay đổi.
6. Hệ thống kiểm tra định dạng tệp, kích thước, độ dài trường và giao thức URL.
7. Hệ thống lưu và trả về trạng thái thành công; trang kênh phản ánh sau làm mới (theo NFR cache *TBD*).

**Luồng con — Gán Moderator kênh (Streamer):**

8. Streamer nhập `username` người được gán và xác nhận (REQ-019).
9. Hệ thống kiểm tra user đích tồn tại và không trùng Streamer nếu logic nghiệp vụ loại trừ (*TBD*).
10. Hệ thống thêm người đó vào danh sách Moderator kênh; Moderator có quyền theo REQ-011.

**Luồng con — Chặn người dùng:**

11. Actor chọn “Chặn” trên hồ sơ đích và xác nhận (REQ-018).
12. Hệ thống lưu quan hệ block; ẩn tương tác trực tiếp từ người bị chặn.

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Hủy chỉnh sửa
Tại bước **5** trước khi lưu:
1. Actor chọn “Hủy”.
2. Hệ thống loại bỏ thay đổi cục bộ; quay lại bước **2** khi mở lại trang.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Tệp avatar vượt quá 5 MB hoặc sai định dạng
Tại bước **6**:
1. Hệ thống từ chối và hiển thị `AVATAR_INVALID`.
2. Không cập nhật avatar; các trường khác có thể lưu riêng nếu giao dịch tách (*thiết kế API — TBD*).

### 6.2 Username Moderator không tồn tại
Tại bước **9**:
1. Hệ thống báo `USER_NOT_FOUND`.
2. Không thêm Moderator.

---

## 7. Hậu điều kiện (Postconditions)

1. Dữ liệu hồ sơ/kênh được cập nhật đúng quy tắc REQ-015–016.
2. Moderator xuất hiện trong danh sách mod sau khi gán thành công (REQ-019).
3. Block list có hiệu lực theo REQ-018.

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Hiệu năng:** p95 API cập nhật ≤ **1200 ms** staging (SRS 5.1).
- **Lưu trữ ảnh:** object storage hoặc CDN upload URL (*kiến trúc — TBD*).

---

## 9. Điểm mở rộng (Extension Points)

- **→ UC-09** Moderator sử dụng quyền sau khi được gán.
- **Traceability:** REQ-015, REQ-016, REQ-018, REQ-019.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC05-01 | Avatar chỉ JPEG/PNG, ≤ 5 MB (REQ-015). |
| BR-UC05-02 | Tối đa ba liên kết ngoài http/https (REQ-016). |
| BR-UC05-03 | Gán Moderator chỉ qua username hợp lệ và xác nhận UI (REQ-019). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-06 — Chuẩn bị phát sóng live (ingest key & metadata phiên)

## 1. Tên Use Case (Use Case Name)
Chuẩn bị phát sóng live (ingest key & metadata phiên)

### 1.1 Tóm tắt (Brief Description)
Use Case hỗ trợ Streamer lấy URL ingest và stream key, đặt tiêu đề phiên, danh mục và thẻ trước/khi phát, và làm mới khóa khi cần. Giá trị nghiệp vụ: kích hoạt luồng live có kiểm soát và metadata phục vụ khám phá/tìm kiếm.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Streamer | Actor chính | Cấu hình phiên và OBS/tool encode. |
| Hệ thống SterioX | Hệ thống | Sinh key, trạng thái live/offline, session id. |
| Dịch vụ CDN/stream | Actor phụ | Nhận ingest và phản hồi trạng thái (REQ-022–023). |

---

## 3. Tiền điều kiện (Preconditions)

1. Actor có vai trò Streamer (hoặc Admin quản lý kênh — *TBD*).
2. Kênh không bị đình chỉ phát sóng (REQ-066).

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Streamer mở trang “Phát sóng” / “Studio”.
2. Hệ thống hiển thị URL ingest và stream key (hiển thị đầy đủ **một lần** theo REQ-021), trạng thái kênh offline/hiện tại.
3. Streamer sao chép URL/key vào OBS và (tùy chọn) nhập tiêu đề phiên ≤ 200 ký tự (REQ-024).
4. Streamer chọn **một** danh mục và tối đa mười thẻ (REQ-028–029); Hệ thống chuẩn hóa thẻ (trim, lowercase — REQ-030).
5. Streamer bắt đầu stream từ OBS tới URL ingest.
6. Hệ thống nhận tín hiệu từ nhà cung cấp stream và chuyển kênh sang **live** trong ≤ **90 giây** (REQ-022); sinh **session id** duy nhất (REQ-025).
7. Hệ thống hiển thị trạng thái live và (nếu có) concurrent viewers (REQ-026).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Tái tạo stream key
Tại bước **2–3**:
1. Streamer chọn “Tạo lại khóa” và xác nhận (REQ-020).
2. Hệ thống vô hiệu khóa cũ và hiển thị khóa mới (một lần đầy đủ).
3. Streamer cập nhật OBS; quay lại bước **5** của luồng chính.

### 5.2 Hiện lại stream key đã che
Tại bước **2**:
1. Streamer chọn “Hiện khóa” và xác nhận thao tác nhạy cảm (REQ-021).
2. Hệ thống hiển thị đầy đủ key trong phiên hiện tại.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Kênh bị đình chỉ
Tại bước **2** hoặc **6**:
1. Hệ thống từ chối phát và hiển thị `CHANNEL_SUSPENDED` (tham chiếu REQ-033 mức xem; phát sóng tương đương).

### 6.2 Ingest không vào trong thời gian chờ
Tại bước **6**:
1. Sau thời gian chờ (cấu hình nhà cung cấp), kênh vẫn offline; Hệ thống hiển thị hướng dẫn kiểm tra bitrate/OBS.
2. Trạng thái cuối: offline.

---

## 7. Hậu điều kiện (Postconditions)

1. Phiên live có `session id` (REQ-025) khi trạng thái live.
2. Danh mục và thẻ được gắn cho phiên (REQ-028–030).

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Bảo mật:** không log stream key đầy đủ (SRS 5.3).
- **Hiệu năng:** chuyển trạng thái live trong ngưỡng REQ-022–023.

---

## 9. Điểm mở rộng (Extension Points)

- **→ UC-07** Viewer xem khi live.
- **→ UC-08** Chat gắn `session id`.
- **Traceability:** REQ-020–026, REQ-028–030.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC06-01 | Một phiên live gán đúng một danh mục (REQ-028). |
| BR-UC06-02 | Tối đa 10 thẻ, mỗi thẻ ≤ 32 ký tự [A-Za-z0-9_] sau chuẩn hóa (REQ-029–030). |
| BR-UC06-03 | Stream key chỉ hiển thị đầy đủ lần đầu hoặc sau xác nhận “hiện lại” (REQ-021). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-07 — Xem phòng live

## 1. Tên Use Case (Use Case Name)
Xem phòng live

### 1.1 Tóm tắt (Brief Description)
Use Case cho phép Khách hoặc Viewer mở phòng xem, nhận URL phát HLS/tương thích, hiển thị metadata phiên và ghi nhận sự kiện join stream. Giá trị nghiệp vụ: trải nghiệm xem là lõi của nền tảng livestream.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Viewer / Khách | Actor chính | Mở phòng live. |
| Hệ thống SterioX | Hệ thống | Tra cứu phiên, cấp URL phát, kiểm tra đình chỉ. |
| Trình phát web | Hệ thống | Phát video (HTML5/player). |

---

## 3. Tiền điều kiện (Preconditions)

1. Tồn tại phiên live **live** hoặc URL phòng hợp lệ; kênh không bị đình chỉ (REQ-033).

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Actor điều hướng tới URL phòng live của kênh/phiên.
2. Hệ thống xác định phiên đang live và lấy URL phát (REQ-032).
3. Hệ thống trả về tiêu đề phiên, tên kênh, danh mục nếu có (REQ-034).
4. Trình phát tải manifest và bắt đầu phát; TTFF mục tiêu ≤ **5 giây** trên kết nối tham chiếu (SRS 5.1).
5. Hệ thống ghi sự kiện `join_stream` với timestamp (REQ-036).
6. Actor điều khiển âm lượng, fullscreen, pause theo khả năng player (REQ-035).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Khách xem không chat
Tại bước **1–6**:
1. UI ẩn hoặc khóa ô chat cho đến khi đăng nhập (chính sách sản phẩm — *TBD*).
2. Luồng xem vẫn hoàn tất.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Kênh đình chỉ
Tại bước **2**:
1. Hệ thống không cấp URL phát; hiển thị `CHANNEL_SUSPENDED` (REQ-033).

### 6.2 Player lỗi tạm thời
Theo SRS 5.2:
1. Player retry tối đa **3** lần, cách **2 giây**.
2. Nếu vẫn lỗi, hiển thị thông báo và mã lỗi.

---

## 7. Hậu điều kiện (Postconditions)

1. Sự kiện join được ghi nhận khi phát khả dụng (REQ-036).
2. Actor đang ở trạng thái “đang xem” (*session viewer — TBD*).

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Hiệu năng:** p95 API chi tiết phòng ≤ **800 ms** (SRS 5.1).
- **Web Vitals:** LCP/INP tham chiếu SRS 5.1 / 5.4.

---

## 9. Điểm mở rộng (Extension Points)

- **→ UC-08** Chat trên cùng phiên.
- **Traceability:** REQ-032–036, REQ-033.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC07-01 | Không phát nội dung kênh đình chỉ (REQ-033). |
| BR-UC07-02 | Mỗi lần mở phòng thành công ghi join có timestamp (REQ-036). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-08 — Gửi tin nhắn chat trên luồng live

## 1. Tên Use Case (Use Case Name)
Gửi tin nhắn chat trên luồng live

### 1.1 Tóm tắt (Brief Description)
Use Case cho phép Viewer đã đăng nhập gửi tin nhắn tới phòng chat của phiên live qua kết nối realtime; hệ thống áp dụng giới hạn độ dài, slow mode, followers-only, rate limit và filter từ cấm. Giá trị nghiệp vụ: tương tác realtime cốt lõi của livestream.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Viewer đã đăng nhập | Actor chính | Soạn và gửi tin. |
| Hệ thống SterioX | Hệ thống | Validate, phân phối WebSocket, lọc từ cấm. |
| Các Viewer khác | Actor phụ | Nhận tin qua subscription phòng. |

---

## 3. Tiền điều kiện (Preconditions)

1. Actor đã đăng nhập (UC-02).
2. Phiên live đang hoạt động (`session id` hợp lệ).
3. Actor không bị timeout/cấm trên kênh (REQ-039); nếu bật followers-only thì đã follow (REQ-041).

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Actor mở phòng live và kết nối kênh chat (WSS).
2. Hệ thống xác thực token và gán phòng theo `session id`.
3. Actor nhập nội dung ≤ **500** ký tự Unicode (REQ-038) và gửi.
4. Hệ thống kiểm tra slow mode (REQ-040), followers-only (REQ-041), rate limit (REQ-062), filter từ cấm (REQ-045).
5. Hệ thống lưu tin (theo thiết kế), phân phối tới subscriber trong ngưỡng trễ chat (SRS 5.1).
6. Hệ thống parse `@username`; nếu tồn tại, gắn id người được đề cập (REQ-046).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Gửi emoji/quick reaction *(nếu UI hỗ trợ — TBD)*
Tại bước **3**:
1. Actor chọn emoji từ bảng chọn thay vì nhập văn bản dài.
2. Tin vẫn chịu REQ-038 nếu được serialize thành chuỗi ngắn.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Bị timeout hoặc cấm chat
Tại bước **4**:
1. Hệ thống từ chối với mã `CHAT_NOT_ALLOWED` (REQ-039).

### 6.2 Vi phạm slow mode / rate limit
Tại bước **4**:
1. Hệ thống từ chối với mã `RATE_LIMIT` hoặc `SLOW_MODE`.

### 6.3 Tin bị lọc hoàn toàn bởi filter
Tại bước **4**:
1. Hệ thống không lưu/lan truyền hoặc thay bằng placeholder (*thiết kế — TBD*); phản hồi `FILTERED`.

### 6.4 Mất kết nối WebSocket
Tại bước **2–5**:
1. Client thực hiện reconnect với backoff (SRS 5.4 heartbeat).
2. Nếu không thể: hiển thị trạng thái mất kết nối chat.

---

## 7. Hậu điều kiện (Postconditions)

1. Tin hợp lệ xuất hiện trên UI mọi client trong phòng (REQ-037).

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Realtime:** độ trễ end-to-end ≤ **2 giây** LAN/staging (SRS 5.1).
- **Throughput:** ≥ **50** tin/giây/phòng trong load test nội bộ (SRS 5.1).

---

## 9. Điểm mở rộng (Extension Points)

- **→ UC-09** Xóa/timeout/ban.
- **Traceability:** REQ-037–046, REQ-062.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC08-01 | Độ dài tin ≤ 500 ký tự Unicode sau chuẩn hóa (REQ-038). |
| BR-UC08-02 | Slow mode: tối đa 1 tin mỗi T giây (T ∈ [3,120]) khi bật (REQ-040). |
| BR-UC08-03 | Followers-only: chỉ follower được gửi khi bật (REQ-041). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-09 — Kiểm duyệt chat và người dùng trên kênh

## 1. Tên Use Case (Use Case Name)
Kiểm duyệt chat và người dùng trên kênh

### 1.1 Tóm tắt (Brief Description)
Use Case cho phép Streamer hoặc Moderator kênh xóa tin nhắn, đặt timeout chat, hoặc cấm người dùng khỏi kênh. Giá trị nghiệp vụ: duy trì chất lượng cộng đồng và giảm lạm dụng.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Streamer / Moderator kênh | Actor chính | Thực hiện hành động mod. |
| Hệ thống SterioX | Hệ thống | Kiểm tra quyền scoped kênh (REQ-011), phát sự kiện realtime, audit nếu có. |

---

## 3. Tiền điều kiện (Preconditions)

1. Actor có quyền trên **đúng kênh** mục tiêu (REQ-011).
2. Phiên live hoặc kênh đang trong ngữ cảnh cho phép thao tác mod (*TBD*: mod khi offline — có thể giới hạn MVP chỉ khi live).

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Actor mở công cụ mod trên phòng live hoặc panel kênh.
2. Actor chọn một tin nhắn và chọn “Xóa” **hoặc** chọn người dùng và “Timeout” / “Ban kênh”.
3. Hệ thống xác nhận quyền và id đối tượng.
4. **Xóa tin:** Hệ thống đánh dấu xóa, phát sự kiện `message_deleted` tới client (REQ-042); ghi audit nếu thuộc danh mục REQ-069.
5. **Timeout:** Actor chọn 60, 300 hoặc 900 giây (REQ-043); Hệ thống áp dụng và từ chối chat của user đó trong thời gian đó (REQ-039).
6. **Ban kênh:** Actor nhập lý do ≤ 280 ký tự (REQ-044); Hệ thống lưu ban và ngăn tương tác kênh của user đó.

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Hủy hành động mod
Tại bước **2**:
1. Actor đóng menu mod; không thay đổi dữ liệu.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Không đủ quyền (403)
Tại bước **3**:
1. Hệ thống từ chối; không ghi audit hành động thành công.

### 6.2 Đối tượng không tồn tại / đã xóa
Tại bước **4**:
1. Trả lỗi `NOT_FOUND`; không phát sự kiện.

---

## 7. Hậu điều kiện (Postconditions)

1. Trạng thái mod được áp dụng nhất quán trên server và client (REQ-042–044).
2. Bản ghi audit cho xóa tin / ban / quyết định liên quan khi thuộc phạm vi REQ-069.

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Audit:** các hành động nhạy cảm ghi audit (REQ-069–070).
- **Realtime:** sự kiện xóa tin đến client ≤ ngưỡng chat (SRS 5.1).

---

## 9. Điểm mở rộng (Extension Points)

- **Traceability:** REQ-011, REQ-042–045, REQ-069.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC09-01 | Moderator chỉ thao tác trên kênh được gán (REQ-011). |
| BR-UC09-02 | Timeout chỉ chọn từ {60, 300, 900} giây (REQ-043). |
| BR-UC09-03 | Ban kênh bắt buộc có lý do ≤ 280 ký tự (REQ-044). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-10 — Follow và unfollow kênh

## 1. Tên Use Case (Use Case Name)
Follow và unfollow kênh

### 1.1 Tóm tắt (Brief Description)
Use Case thiết lập hoặc gỡ quan hệ follow giữa Viewer và kênh, cập nhật số follower và (theo SRS) tạo thông báo in-app cho Streamer khi có follow mới. Giá trị nghiệp vụ: gắn kết khán giả với creator.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Viewer đã đăng nhập | Actor chính | Nhấn Follow/Unfollow. |
| Hệ thống SterioX | Hệ thống | Cập nhật quan hệ, đếm, thông báo. |
| Streamer | Actor phụ | Nhận thông báo follow mới (REQ-073). |

---

## 3. Tiền điều kiện (Preconditions)

1. Viewer đã đăng nhập.

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Viewer mở trang kênh hoặc thẻ luồng.
2. Viewer chọn “Follow”.
3. Hệ thống tạo quan hệ follow idempotent (REQ-047).
4. Hệ thống tăng/giữ đúng số follower không âm (REQ-048).
5. Hệ thống tạo thông báo in-app cho chủ kênh khi là follow **mới** (REQ-073).

**Unfollow:**

6. Viewer chọn “Đang follow” / “Unfollow”.
7. Hệ thống xóa quan hệ follow (REQ-047) và cập nhật số đếm (REQ-048).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Follow khi đã follow
Tại bước **3**:
1. Hệ thống không nhân đôi bản ghi; trả trạng thái idempotent thành công.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Kênh không tồn tại
Tại bước **3**:
1. Trả `CHANNEL_NOT_FOUND`; không thay đổi follower.

---

## 7. Hậu điều kiện (Postconditions)

1. Quan hệ follow phản ánh đúng trạng thái nút UI.
2. Thông báo follow mới được tạo đúng một lần cho mỗi chuyển từ không-follow sang follow (REQ-073).

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Hiệu năng:** cập nhật đếm và UI trong giới hạn API đọc/ghi SRS 5.1.

---

## 9. Điểm mở rộng (Extension Points)

- **→ UC-08** followers-only chat (REQ-041).
- **→ UC-15** hộp thông báo.
- **Traceability:** REQ-047–048, REQ-073.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC10-01 | Follow/Unfollow idempotent (REQ-047). |
| BR-UC10-02 | Số follower là số nguyên không âm (REQ-048). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-11 — Tạo group và tham gia group chat

## 1. Tên Use Case (Use Case Name)
Tạo group và tham gia group chat

### 1.1 Tóm tắt (Brief Description)
Use Case cho phép người dùng tạo cộng đồng (group) với metadata và chế độ thành viên, đồng thời trò chuyện realtime trong group; chủ group có thể chỉ định tối đa ba moderator group. Giá trị nghiệp vụ: xây dựng cộng đồng quanh nội dung.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Viewer đã đăng nhập | Actor chính | Tạo group, tham gia chat. |
| Chủ group | Actor chính (một phần) | Cấu hình mod group (REQ-052). |
| Hệ thống SterioX | Hệ thống | Validate, phân phối chat nhóm. |

---

## 3. Tiền điều kiện (Preconditions)

1. Người dùng đã đăng nhập.

---

## 4. Luồng sự kiện chính (Basic Flow)

**Tạo group**

1. Actor chọn “Tạo group”.
2. Hệ thống hiển thị biểu mẫu: tên 3–80 ký tự, mô tả ≤ 2000, quy tắc ≤ 2000, ảnh bìa tuỳ chọn JPEG/PNG ≤ 5 MB (REQ-049).
3. Actor chọn chế độ thành viên “mở” hoặc “duyệt” (REQ-050) và gửi.
4. Hệ thống kiểm tra và tạo group; Actor trở thành chủ group.

**Group chat**

5. Thành viên mở tab chat của group.
6. Hệ thống kết nối kênh realtime của group.
7. Thành viên gửi tin ≤ 500 ký tự (REQ-051, REQ-038).
8. Hệ thống phân phối tin tới thành viên đủ điều kiện.

**Moderator group**

9. Chủ group chỉ định tối đa **3** moderator có quyền xóa tin và kick thành viên (REQ-052).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Tham gia nhóm “duyệt”
Tại bước **4** sau khi user khác xin vào:
1. Chủ group duyệt yêu cầu.
2. Hệ thống thêm thành viên.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Ảnh bìa không hợp lệ
Tại bước **4**:
1. Từ chối nếu > 5 MB hoặc không phải JPEG/PNG.

### 6.2 Người không phải thành viên gửi chat
Tại bước **8**:
1. Từ chối với mã `NOT_GROUP_MEMBER`.

---

## 7. Hậu điều kiện (Postconditions)

1. Group và (nếu có) ảnh bìa được lưu đúng ràng buộc REQ-049.
2. Chat nhóm hoạt động cho thành viên (REQ-051).

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Realtime:** cùng ngưỡng chat như stream (SRS 5.1).
- **Moderator:** tối đa 3 người (REQ-052).

---

## 9. Điểm mở rộng (Extension Points)

- **Traceability:** REQ-049–052.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC11-01 | Tên group 3–80 ký tự; mô tả & quy tắc mỗi trường ≤ 2000 ký tự (REQ-049). |
| BR-UC11-02 | Ít nhất một chế độ thành viên mở hoặc duyệt (REQ-050). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-12 — Khám phá và tìm kiếm luồng đang live

## 1. Tên Use Case (Use Case Name)
Khám phá và tìm kiếm luồng đang live

### 1.1 Tóm tắt (Brief Description)
Use Case hiển thị danh sách kênh đang live với metadata tối thiểu, hỗ trợ lọc theo danh mục và tìm kiếm theo tên kênh hoặc tiêu đề phiên; kết quả phân trang. Giá trị nghiệp vụ: giúp Viewer khám phá nội dung trong phạm vi MVP.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Viewer / Khách | Actor chính | Duyệt và tìm kiếm. |
| Hệ thống SterioX | Hệ thống | Truy vấn, phân trang, lọc. |

---

## 3. Tiền điều kiện (Preconditions)

1. Dịch vụ danh sách live khả dụng.

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Actor mở trang khám phá.
2. Hệ thống trả về danh sách đang live với thumbnail/placeholder, tiêu đề phiên, tên kênh, danh mục, nhãn LIVE (REQ-053).
3. Actor chọn một danh mục trong bộ lọc.
4. Hệ thống lọc danh sách theo danh mục (REQ-054).
5. Actor nhập từ khóa vào ô tìm kiếm và gửi.
6. Hệ thống tìm không phân biệt hoa thường trên tên kênh và tiêu đề phiên đang live (REQ-055).
7. Hệ thống hiển thị kết quả phân trang (mặc định 20, tối đa 50/trang — REQ-056).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Không có kết quả
Tại bước **6–7**:
1. Hệ thống trả danh sách rỗng với `total = 0` (REQ-057).
2. UI hiển thị trạng thái “Không có luồng phù hợp”.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Lỗi máy chủ khi truy vấn
Tại bước **2** hoặc **6**:
1. Hiển thị lỗi có correlation id; không báo “0 kết quả” giả.

---

## 7. Hậu điều kiện (Postconditions)

1. Actor nhìn thấy danh sách nhất quán với bộ lọc/từ khóa và phân trang đúng REQ-056.

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Hiệu năng:** p95 endpoint đọc ≤ **800 ms** (SRS 5.1).
- **Web Vitals:** trang khám phá đạt LCP/INP tham chiếu (SRS 5.1).

---

## 9. Điểm mở rộng (Extension Points)

- **→ UC-07** khi Actor chọn một thẻ luồng.
- **Traceability:** REQ-053–057.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC12-01 | Mỗi trang mặc định 20 mục, tối đa 50 (REQ-056). |
| BR-UC12-02 | Không có kết quả trả về payload phân trang hợp lệ với total = 0 (REQ-057). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-13 — Gửi báo cáo vi phạm

## 1. Tên Use Case (Use Case Name)
Gửi báo cáo vi phạm

### 1.1 Tóm tắt (Brief Description)
Use Case cho phép người dùng đã đăng nhập gửi báo cáo đối với kênh/stream, tin chat hoặc hồ sơ người dùng; hệ thống tạo bản ghi với trạng thái OPEN và giới hạn tần suất theo giờ. Giá trị nghiệp vụ: kích hoạt quy trình kiểm duyệt nền tảng.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Viewer đã đăng nhập | Actor chính | Điền báo cáo. |
| Hệ thống SterioX | Hệ thống | Validate, lưu queue, rate limit. |

---

## 3. Tiền điều kiện (Preconditions)

1. Người dùng đã đăng nhập.

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Actor chọn “Báo cáo” trên đối tượng (stream, tin chat, hồ sơ).
2. Hệ thống hiển thị biểu mẫu: lý do bắt buộc trong {spam, quấy rối, nội dung không phù hợp, khác}, mô tả tùy chọn ≤ 1000 ký tự (REQ-058–059).
3. Actor gửi báo cáo.
4. Hệ thống kiểm tra giới hạn ≤ **10** báo cáo/giờ/user (REQ-061).
5. Hệ thống tạo bản ghi trạng thái **OPEN** (REQ-060).
6. Hệ thống xác nhận đã tiếp nhận (không tiết lộ thứ tự xử lý nội bộ).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Lưu nháp *(TBD — nếu có)*
*TBD:* sản phẩm MVP có thể không có nháp; nếu có, lưu cục bộ browser.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Vượt giới hạn báo cáo
Tại bước **4**:
1. Hệ thống từ chối với mã `REPORT_RATE_LIMIT`.
2. Không tạo bản ghi mới.

### 6.2 Thiếu lý do
Tại bước **4**:
1. Hệ thống trả lỗi validation; không lưu.

---

## 7. Hậu điều kiện (Postconditions)

1. Bản ghi báo cáo tồn tại với trạng thái OPEN và liên kết tới đối tượng (REQ-058–060).

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Rate limit:** 10 báo cáo/giờ/user (REQ-061).
- **Audit:** quyết định sau này thuộc REQ-069 khi Admin xử lý.

---

## 9. Điểm mở rộng (Extension Points)

- **→ UC-14** Admin xử lý báo cáo.
- **Traceability:** REQ-058–061.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC13-01 | Lý do phải thuộc danh sách cố định (REQ-059). |
| BR-UC13-02 | Tối đa 10 báo cáo mỗi giờ cho mỗi user (REQ-061). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-14 — Quản trị nền tảng

## 1. Tên Use Case (Use Case Name)
Quản trị nền tảng

### 1.1 Tóm tắt (Brief Description)
Use Case tập hợp các thao tác Admin: xem dashboard tổng quan, quản lý danh mục, đình chỉ kênh, lọc và xử lý báo cáo (ghi chú nội bộ, đổi trạng thái), vô hiệu hóa/kích hoạt tài khoản. Giá trị nghiệp vụ: vận hành và an toàn nền tảng trong môi trường demo.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Admin | Actor chính | Thực hiện thao tác quản trị. |
| Hệ thống SterioX | Hệ thống | RBAC Admin (REQ-012), audit (REQ-069). |

---

## 3. Tiền điều kiện (Preconditions)

1. Actor có vai trò Admin (REQ-012).
2. Admin đã đăng nhập an toàn (UC-02).

---

## 4. Luồng sự kiện chính (Basic Flow)

**Dashboard**

1. Admin mở trang dashboard.
2. Hệ thống hiển thị số người dùng đăng ký, số phiên live, số báo cáo OPEN (REQ-064).

**Quản lý danh mục**

3. Admin chọn mục “Danh mục”.
4. Admin tạo/sửa/ẩn/khôi phục danh mục (REQ-065, REQ-027).

**Đình chỉ kênh**

5. Admin chọn kênh và “Đình chỉ phát sóng”.
6. Admin nhập lý do bắt buộc ≤ 500 ký tự và thời hạn hoặc vô thời hạn (REQ-066).
7. Hệ thống áp dụng; stream/play bị chặn (REQ-033); ghi audit (REQ-069).

**Xử lý báo cáo**

8. Admin mở danh sách báo cáo, lọc theo trạng thái (REQ-067).
9. Admin cập nhật trạng thái trong {IN_REVIEW, RESOLVED, REJECTED} và ghi chú ≤ 2000 ký tự (REQ-060, REQ-067); ghi audit quyết định (REQ-069).

**Quản lý người dùng**

10. Admin vô hiệu hóa hoặc kích hoạt tài khoản; hệ thống ghi nhận thời điểm và actor (REQ-068).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Chỉ xem dashboard không chỉnh sửa
Tại bước **1–2**:
1. Admin thoát; không thay đổi dữ liệu.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Không phải Admin (403)
Tại mọi bước:
1. Hệ thống từ chối truy cập UI và API (REQ-012–013).

### 6.2 Xung đột trạng thái báo cáo
Tại bước **9**:
1. Hệ thống áp dụng optimistic locking hoặc trả `CONFLICT` (*TBD schema*).

---

## 7. Hậu điều kiện (Postconditions)

1. Thay đổi cấu hình và quyết định quản trị được phản ánh trên API công khai trong thời gian đồng bộ hợp lý (SRS Mục 4.11).
2. Các hành động nhạy cảm có bản ghi audit (REQ-069–070).

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Audit:** mọi đình chỉ kênh, ban user, quyết định báo cáo phải có audit (REQ-069).
- **Export:** Admin có thể export audit CSV phạm vi ≤ 31 ngày (REQ-072) — có thể gọi từ màn riêng.

---

## 9. Điểm mở rộng (Extension Points)

- **UC-16 / Post-MVP:** gộp tag, công cụ nâng cao (REQ-031).
- **Traceability:** REQ-064–068, REQ-027, REQ-065–066, REQ-069–070.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC14-01 | Chỉ Admin được thực hiện các thao tác UC-14 (REQ-012). |
| BR-UC14-02 | Đình chỉ kênh bắt buộc có lý do ≤ 500 ký tự (REQ-066). |
| BR-UC14-03 | Trạng thái báo cáo thuộc tập cố định (REQ-060). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-15 — Xem và quản lý thông báo trong ứng dụng

## 1. Tên Use Case (Use Case Name)
Xem và quản lý thông báo trong ứng dụng

### 1.1 Tóm tắt (Brief Description)
Use Case cho phép người dùng xem danh sách thông báo in-app (ví dụ follow mới trên kênh của Streamer) và đánh dấu đã đọc. Giá trị nghiệp vụ: phản hồi tương tác xã hội tối thiểu trong MVP.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Viewer / Streamer | Actor chính | Đọc và quản lý thông báo. |
| Hệ thống SterioX | Hệ thống | Lưu trữ, phân trang, cập nhật trạng thái đọc. |

---

## 3. Tiền điều kiện (Preconditions)

1. Người dùng đã đăng nhập.

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Actor mở trung tâm thông báo.
2. Hệ thống trả về danh sách phân trang các thông báo hiện có (REQ-074).
3. Actor chọn một mục.
4. Hệ thống đánh dấu mục đó là đã đọc (REQ-074).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Đánh dấu tất cả đã đọc *(TBD nếu có nút)*
Tại bước **2**:
1. Actor chọn “Đánh dấu tất cả đã đọc”.
2. Hệ thống cập nhật hàng loạt trong giới hạn kích thước hợp lý.

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Không có thông báo
Tại bước **2**:
1. Hệ thống trả danh sách rỗng; UI hiển thị trạng thái trống.

---

## 7. Hậu điều kiện (Postconditions)

1. Trạng thái đọc của mục được chọn được cập nhật nhất quán (REQ-074).

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Realtime Post-MVP:** REQ-076 (không áp dụng bắt buộc MVP).

---

## 9. Điểm mở rộng (Extension Points)

- **→ REQ-073:** sự kiện follow tạo thông báo cho Streamer.
- **Traceability:** REQ-073–074.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC15-01 | Thông báo follow mới chỉ cho chủ kênh nhận follow (REQ-073). |

---

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

# UC-16 — Donate qua cổng thanh toán sandbox *(Post-MVP)*

## 1. Tên Use Case (Use Case Name)
Donate qua cổng thanh toán sandbox

### 1.1 Tóm tắt (Brief Description)
*(Post-MVP)* Use Case cho phép Viewer gửi “donate” thử nghiệm qua cổng thanh toán sandbox; hệ thống gửi yêu cầu có **idempotency key** và ghi **sổ cái nội bộ**. Giá trị nghiệp vụ: học tập tích hợp thanh toán và đối soát, không yêu cầu tiền thật.

---

## 2. Các Tác nhân (Actors)

| Vai trò | Loại | Mô tả |
| :--- | :--- | :--- |
| Viewer đã đăng nhập | Actor chính | Khởi tạo donate. |
| Cổng thanh toán sandbox | Hệ thống ngoài | Xử lý giao dịch thử nghiệm. |
| Hệ thống SterioX | Hệ thống | Idempotency, ledger (REQ-080–081). |

---

## 3. Tiền điều kiện (Preconditions)

1. Module monetization được bật trong triển khai (Post-MVP).
2. Viewer và Streamer đích hợp lệ; cổng sandbox được cấu hình.

---

## 4. Luồng sự kiện chính (Basic Flow)

1. Viewer mở luồng donate trên kênh.
2. Viewer nhập số tiền và xác nhận.
3. Hệ thống tạo yêu cầu thanh toán với **idempotency key** duy nhất (REQ-080).
4. Hệ thống chuyển Viewer tới luồng sandbox (redirect hoặc widget).
5. Cổng sandbox trả kết quả thành công/thất bại.
6. Hệ thống ghi bản ghi sổ cái với mã tham chiếu nhà cung cấp, số tiền, đơn vị tiền, trạng thái, timestamp (REQ-081).

---

## 5. Các luồng thay thế (Alternative Flows)

### 5.1 Viewer hủy trên UI cổng
Tại bước **4**:
1. Không ghi nhận thành công; có thể ghi trạng thái `CANCELLED` (*TBD*).

---

## 6. Luồng ngoại lệ (Exception Flows)

### 6.1 Trùng idempotency / retry mạng
Tại bước **3–6**:
1. Hệ thống đảm bảo không nhân đôi giao dịch với cùng key (REQ-080).

### 6.2 Velocity vượt ngưỡng gian lận
Theo SRS 5.3:
1. Từ chối hoặc yêu cầu xác minh bổ sung.

---

## 7. Hậu điều kiện (Postconditions)

1. Mọi giao dịch thành công có bản ghi ledger đầy đủ (REQ-081).

---

## 8. Các yêu cầu đặc biệt (Special Requirements)

- **Bảo mật:** TLS; không log PAN/card (sandbox vẫn tránh log nhạy cảm).
- **Audit:** giao dịch nhạy cảm trong DB transaction (SRS 5.2).

---

## 9. Điểm mở rộng (Extension Points)

- **Traceability:** REQ-080–081.

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)

| Mã | Quy tắc |
| :--- | :--- |
| BR-UC16-01 | Mỗi yêu cầu donate mang idempotency key duy nhất (REQ-080). |
| BR-UC16-02 | Sổ cái ghi đủ tham chiếu nhà cung cấp, số tiền, đơn vị, trạng thái, timestamp (REQ-081). |

---

## Phụ lục — Kiểm soát phiên bản

| Phiên bản | Ngày | Ghi chú |
| :--- | :--- | :--- |
| 1.0 | TBD | Khởi tạo bộ UC SterioX căn cứ SRS/Product Vision hiện hành. |

