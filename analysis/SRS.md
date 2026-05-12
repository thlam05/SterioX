# ĐẶC TẢ YÊU CẦU PHẦN MỀM (SOFTWARE REQUIREMENTS SPECIFICATION - SRS)
## Dự án: SterioX — Nền tảng livestream web

## 1. Giới thiệu (Introduction)

### 1.1 Mục đích (Purpose)
Tài liệu SRS này xác định các yêu cầu chức năng và phi chức năng của nền tảng web SterioX (ứng dụng livestream, chat realtime, cộng đồng và quản trị). Mục đích gồm: làm cơ sở cho thiết kế kiến trúc, triển khai mã nguồn, lập kế hoạch kiểm thử (bao gồm tiêu chí chấp nhận có thể kiểm chứng), ước lượng công sức và phạm vi phát hành theo giai đoạn MVP và sau MVP.

**Đối tượng sử dụng tài liệu:** Development và người muốn tìm hiểu về dự án.

### 1.2 Phạm vi sản phẩm (Scope)
**Trong phạm vi:** SterioX cung cấp qua trình duyệt web (responsive) các khả năng sau, phân thành hai giai đoạn triển khai được tham chiếu trong toàn bộ tài liệu.

- **Giai đoạn 1 (MVP — bắt buộc để đạt phạm vi tối thiểu có thể demo):** đăng ký/đăng nhập và quản lý phiên; RBAC cho các vai trò Viewer, Streamer, Moderator kênh (nếu kích hoạt), Admin; trang chủ; trang kênh streamer; phòng xem live với trình phát video thích ứng qua CDN hoặc dịch vụ stream thử nghiệm; ingest live với khóa bí mật và hiển thị trạng thái live/offline; chat realtime trên luồng; điều khiển kiểm duyệt kênh cơ bản (timeout, cấm, xóa tin, bộ lọc từ); group/community và group chat realtime; follow streamer; trang khám phá/tìm kiếm tối thiểu (danh sách đang live, lọc theo danh mục); báo cáo vi phạm và hàng đợi xử lý cho admin; dashboard admin để cấu hình danh mục/nội dung và xử lý báo cáo; ghi nhận kiểm toán cho hành động nhạy cảm; giới hạn tần suất và biện pháp chống lạm dụng cơ bản.

- **Giai đoạn 2 (Post-MVP — mở rộng, không là điều kiện tiên quyết của MVP):** thông báo đầy đủ (realtime trong web mở rộng, email/push nếu cấu hình); monetization sandbox/mock (subscribe quà ảo, donate); VOD/replay, clip highlight, lịch phát stream; tìm kiếm/gợi ý nâng cao; audit log mở rộng và công cụ mod chi tiết hơn.

**Ngoài phạm vi (trừ khi dự án được mở rõ phạm vi):** ứng dụng native mobile chính thức; game engine tích hợp; marketplace vật phẩm vật lý; ví blockchain tùy chỉnh; cam kết SLA thương mại hoặc vận hành 24/7.

### 1.3 Tài liệu tham khảo (References)
| Ký hiệu | Tài liệu |
| :--- | :--- |
| [PV-1] | SterioX — Tài liệu Tầm nhìn Sản phẩm (Product Vision), phiên bản đồng bộ với SRS. |
| [IEEE-830] | IEEE Std 830-1998 — Recommended Practice for Software Requirements Specifications. |
| [OWASP-ASVS] | OWASP Application Security Verification Standard (tham chiếu học tập cho kiểm tra bảo mật). |
| [WCAG-2.1] | W3C Web Content Accessibility Guidelines 2.1 (mục tiêu tham chiếu cho luồng chính). |

*TBD:* Business Case hoặc hợp đồng khách hàng (nếu có) — chưa được cung cấp trong gói tài liệu hiện tại.

### 1.4 Tổng quan (Overview)
Cấu trúc tài liệu tuân theo IEEE 830: Mục 2 mô tả bối cảnh và ràng buộc tổng thể; Mục 3 các giao diện bên ngoài; Mục 4 liệt kê yêu cầu chức năng theo nhóm tính năng với mã định danh REQ; Mục 5 yêu cầu phi chức năng; Mục 6 các yêu cầu khác (pháp lý, vận hành demo). Ưu tiên giai đoạn được ghi trong mô tả từng nhóm (High = MVP, Medium/Low = sau MVP hoặc tùy chọn).

---

## 2. Mô tả tổng quát (Overall Description)

### 2.1 Góc nhìn sản phẩm (Product Perspective)
SterioX là **hệ thống độc lập** gồm ứng dụng web (client) và dịch vụ backend, tích hợp với **một hoặc nhiều dịch vụ bên thứ ba** cho phân phối video (CDN/streaming), và có thể tích hợp cổng thanh toán **sandbox** ở giai đoạn sau. Hệ thống không giả định là module con của ERP; dữ liệu người dùng, luồng phát, chat và báo cáo được quản lý trong ranh giới SterioX và các API được liệt kê tại Mục 3.

### 2.2 Chức năng sản phẩm (Product Functions)
Tóm tắt các nhóm chức năng chính:
1. **Quản lý danh tính và phiên:** đăng ký, đăng nhập, khôi phục mật khẩu, đăng xuất, kiểm soát phiên.
2. **RBAC và kiểm soát truy cập:** vai trò Viewer, Streamer, Moderator kênh, Admin; kiểm tra quyền trên API và thao tác UI.
3. **Livestream:** cấp khóa ingest, trạng thái live, tiêu đề phiên, đếm người xem (theo khả năng hạ tầng), danh mục/thẻ.
4. **Xem live:** trình phát thích ứng, phòng chat đồng bộ với luồng.
5. **Chat realtime:** tin nhắn, đề cập, emoji trong phạm vi MVP; slow mode và chat chỉ follower khi bật.
6. **Cộng đồng:** group, group chat, follow.
7. **Khám phá:** danh sách đang live, lọc danh mục, tìm kiếm tối thiểu.
8. **An toàn và kiểm duyệt:** báo cáo, hàng đợi xử lý, công cụ mod kênh, rate limit.
9. **Quản trị:** dashboard, CRUD danh mục/tag, xử lý báo cáo.
10. **Quan sát và kiểm toán:** log ứng dụng, audit cho hành động nhạy cảm; metric cơ bản (tham chiếu NFR).

### 2.3 Đặc điểm người dùng (User Classes and Characteristics)
| Lớp người dùng | Đặc điểm | Kỹ năng kỹ thuật dự kiến |
| :--- | :--- | :--- |
| Khách (chưa đăng nhập) | Xem trang công khai, có thể bị hạn chế chat/follow. | Sử dụng trình duyệt web phổ thông. |
| Viewer đã đăng ký | Xem live, chat (theo quy tắc kênh), follow, tham gia group, báo cáo. | Trung bình. |
| Streamer | Cấu hình kênh, phát live, điều chỉnh mod kênh, xem thống kê cơ bản khi có. | Trung bình–cao (OBS/streaming tool). |
| Moderator kênh | Timeout/ban/xóa tin trên kênh được gán. | Trung bình. |
| Admin nền tảng | Quản trị người dùng/nội dung/cấu hình, xử lý báo cáo, đọc log. | Cao trong phạm vi môi trường demo. |

### 2.4 Các ràng buộc (Constraints)
- **Nền tảng triển khai:** ứng dụng web responsive; HTTPS khi triển khai công khai.
- **Video:** ingest và phân phối phụ thuộc nhà cung cấp CDN/streaming (giới hạn băng thông, độ phân giải, trial) — chi tiết kỹ thuật ingest (RTMP/WebRTC/HLS) do kiến trúc và ADR quyết định nhưng client phải hỗ trợ xem qua trình phát chuẩn hóa trên trình duyệt hỗ trợ.
- **Realtime:** WebSocket hoặc giao thức tương đương được hỗ trợ bởi hạ tầng triển khai.
- **Dự án học tập:** ưu tiên luồng đầu-cuối có thể demo; không bắt buộc độ sâu tính năng phụ bằng mức sản phẩm thương mại.
- **Tuân thủ:** không lưu trữ dữ liệu nhạy cảm vượt quá nhu cầu; tuân thủ ToS của API bên thứ ba.

### 2.5 Giả định và Phụ thuộc (Assumptions and Dependencies)
**Giả định:**
- Người dùng có kết nối Internet đủ để duy trì ít nhất một luồng bitrate thấp trong điều kiện demo.
- Streamer sử dụng phần mềm encode bên thứ ba (ví dụ OBS) tương thích với khóa ingest do SterioX cấp.
- Môi trường demo có thể giới hạn số người dùng đồng thời; các ngưỡng NFR là mục tiêu nội bộ có thể đo được, không phải cam kết thương mại.
- Ngôn ngữ giao diện chính và múi giờ mặc định được cố định trong cấu hình triển khai (i18n đầy đủ là tùy chọn Post-MVP).

**Phụ thuộc:**
- Dịch vụ CDN/streaming và khóa API của nhà cung cấp đó.
- Cơ sở dữ liệu và broker message (nếu có) do kiến trúc chọn.
- Giai đoạn 2: nhà cung cấp email/SMS/push và cổng thanh toán sandbox — chỉ khi được triển khai.

**TBD:** Danh sách chính xác nhà cung cấp video và phiên bản API — phụ thuộc quyết định kiến trúc (ghi trong ADR).

---

## 3. Yêu cầu giao diện bên ngoài (External Interface Requirements)

### 3.1 Giao diện người dùng (User Interfaces)
- Giao diện web **responsive** cho các viewport tối thiểu: desktop (≥1280px), tablet (≥768px), mobile (≥360px chiều rộng). Hệ thống phải hiển thị được các luồng chính (khám phá, phòng live, chat, đăng nhập) mà không chồng lấn điều khiển thiết yếu trên breakpoint được hỗ trợ.
- Thiết kế tuân theo hệ thống design (màu sắc, typography, spacing) được định nghĩa trong tài liệu UI hoặc repository frontend.
- *TBD:* Liên kết tới prototype Figma/HTML — chưa được đính kèm; khi có sẽ bổ sung làm tham chiếu kiểm thử giao diện.

### 3.2 Giao diện phần cứng (Hardware Interfaces)
SterioX không yêu cầu giao tiếp trực tiếp với thiết bị phần cứng chuyên dụng của nền tảng (máy in, quét mã, cảm biến). Phần cứng người dùng (webcam, mic) được quản lý bởi hệ điều hành và phần mềm stream của streamer, không thuộc API SterioX.

### 3.3 Giao diện phần mềm (Software Interfaces)
- **API ứng dụng:** REST (hoặc tương đương) có tài liệu OpenAPI/Swagger theo [PV-1]; mọi endpoint nhạy cảm yêu cầu xác thực và kiểm tra quyền.
- **Cơ sở dữ liệu:** PostgreSQL hoặc DB tương đương do kiến trúc xác định; kết nối qua driver được hỗ trợ chính thức.
- **Streaming/CDN:** SDK hoặc API REST/Webhook của nhà cung cấp stream/CDN để tạo khóa ingest, URL phát, và nhận sự kiện trạng thái nếu có.
- **Thanh toán (giai đoạn 2):** API sandbox của nhà cung cấp thanh toán — chỉ khi module được bật.

### 3.4 Giao diện truyền thông (Communications Interfaces)
- **HTTPS/TLS 1.2+** cho toàn bộ giao tiếp client–server trên môi trường production/staging công khai.
- **WebSocket an toàn (WSS)** hoặc tương đương cho chat và thông báo realtime trong ứng dụng.
- **HLS hoặc định dạng phát thích ứng** do nhà cung cấp stream/CDN phục vụ tới trình phát web.
- **Email (tùy chọn, giai đoạn 2):** SMTP hoặc API email của bên thứ ba qua TLS.

---

## 4. Các tính năng hệ thống (System Features)
*Phần này liệt kê chi tiết các yêu cầu chức năng. Đánh số REQ liên tục trên toàn hệ thống.*

### 4.1 Quản lý tài khoản, xác thực và phiên làm việc
- **Mô tả và Ưu tiên:** Cung cấp đăng ký, đăng nhập, khôi phục mật khẩu, đăng xuất và kiểm soát phiên để mọi thao tác có danh tính được xác thực rõ ràng. **Ưu tiên: High (MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi người dùng gửi thông tin đăng ký hợp lệ, hệ thống tạo tài khoản và phản hồi trạng thái thành công hoặc lỗi có mã. Khi đăng nhập thành công, hệ thống thiết lập phiên xác thực và trả về ngữ cảnh người dùng (vai trò). Khi token/session hết hạn hoặc không hợp lệ, hệ thống từ chối truy cập tài nguyên được bảo vệ với mã lỗi thống nhất.
- **Yêu cầu chi tiết:**
    - **REQ-001:** Hệ thống phải cho phép người dùng đăng ký tài khoản bằng email và mật khẩu thỏa điều kiện độ dài tối thiểu 8 ký tự và ít nhất ba trong bốn nhóm: chữ hoa, chữ thường, chữ số, ký tự đặc biệt.
    - **REQ-002:** Hệ thống phải từ chối đăng ký nếu định dạng email không hợp lệ theo quy tắc RFC 5322 đơn giản hóa (một ký tự @, miền có dấu chấm).
    - **REQ-003:** Hệ thống phải băm mật khẩu bằng thuật toán băm thích hợp cho mật khẩu (ví dụ bcrypt, argon2) và không lưu mật khẩu dạng văn bản thuần.
    - **REQ-004:** Hệ thống phải cho phép người dùng đăng nhập bằng email và mật khẩu và nhận được phiên làm việc được xác thực hoặc token có thời hạn.
    - **REQ-005:** Hệ thống phải cung cấp luồng “quên mật khẩu” gửi liên kết đặt lại mật khẩu có thời hạn không quá 60 phút tới email đã đăng ký khi email tồn tại trong hệ thống (phản hồi thống nhất để không lộ danh sách email).
    - **REQ-006:** Hệ thống phải cho phép người dùng đã đăng nhập đăng xuất khỏi phiên hiện tại và vô hiệu hóa token/session của phiên đó trên máy chủ.
    - **REQ-007:** Hệ thống phải ghi nhận thời điểm đăng nhập cuối cùng của tài khoản với độ chính xác theo giây (UTC).
    - **REQ-008:** Hệ thống phải hỗ trợ khóa tài khoản tạm thời sau một số lần đăng nhập thất bại liên tiếp do cấu hình (mặc định tham chiếu: 5 lần trong 15 phút), trừ khi Admin nới lỏng cho môi trường demo.

### 4.2 RBAC, kiểm soát truy cập API và vai trò người dùng
- **Mô tả và Ưu tiên:** Phân quyền theo vai trò và kiểm tra quyền trên từng thao tác nhạy cảm. **Ưu tiên: High (MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi client gọi API có nhãn vai trò cụ thể, hệ thống xác minh danh tính và quyền trước khi thực hiện; nếu không đủ quyền, trả về mã HTTP 403 và không thay đổi dữ liệu.
- **Yêu cầu chi tiết:**
    - **REQ-009:** Hệ thống phải duy trì ít nhất các vai trò sau trong mô hình quyền: Viewer, Streamer, Moderator kênh (scoped theo kênh), Admin.
    - **REQ-010:** Hệ thống phải chỉ cho phép người dùng có vai trò Streamer hoặc Admin bắt đầu hoặc quản lý luồng phát gắn với kênh của họ.
    - **REQ-011:** Hệ thống phải chỉ cho phép Moderator kênh thực hiện hành động kiểm duyệt trên kênh mà họ được gán.
    - **REQ-012:** Hệ thống phải chỉ cho phép Admin thực hiện các thao tác quản trị toàn cục được liệt kê trong module 4.9.
    - **REQ-013:** Hệ thống phải kiểm tra quyền trên mọi endpoint API thao tác dữ liệu người dùng khác, luồng phát, chat, báo cáo và cấu hình danh mục trước khi thực hiện.
    - **REQ-014:** Hệ thống phải ghi lại vai trò hiện tại của người dùng trong payload phiên hoặc endpoint `/me` tương đương để client hiển thị đúng menu và hành động.

### 4.3 Hồ sơ người dùng, kênh streamer và cài đặt hiển thị
- **Mô tả và Ưu tiên:** Trang cá nhân, kênh streamer (bio, avatar, liên kết), và cài đặt hiển thị cơ bản. **Ưu tiên: High (MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi người dùng cập nhật hồ sơ, hệ thống lưu và phản ánh trên trang công khai trong thời gian không quá giới hạn được định nghĩa tại REQ về hiệu năng (tham chiếu NFR).
- **Yêu cầu chi tiết:**
    - **REQ-015:** Hệ thống phải cho phép người dùng đã đăng nhập tải lên hoặc chỉ định avatar với định dạng JPEG hoặc PNG và kích thước tệp tối đa 5 MB.
    - **REQ-016:** Hệ thống phải cho phép Streamer chỉnh sửa tiêu đề kênh, mô tả (bio) và tối đa ba liên kết ngoài có giao thức http hoặc https.
    - **REQ-017:** Hệ thống phải hiển thị trạng thái “đang live” hoặc “offline” trên trang kênh dựa trên trạng thái phiên phát hiện hành từ máy chủ.
    - **REQ-018:** Hệ thống phải cho phép người dùng chặn người dùng khác (block list) và ẩn tương tác trực tiếp từ người bị chặn đối với người thực hiện chặn.
    - **REQ-019:** Hệ thống phải cho phép Streamer gán Moderator kênh bằng cách nhập đúng username của người dùng đích và xác nhận trên giao diện; sau khi gán thành công, người đó phải xuất hiện trong danh sách moderator của kênh và có quyền theo REQ-011.

### 4.4 Phát sóng live, ingest và quản lý trạng thái luồng
- **Mô tả và Ưu tiên:** Cấp khóa ingest, hiển thị URL/khóa cho OBS, trạng thái live, tiêu đề phiên và metadata phiên. **Ưu tiên: High (MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi Streamer bắt đầu encode tới endpoint được cấp, hệ thống chuyển kênh sang trạng thái live và phát sự kiện tới viewer; khi luồng dừng hoặc timeout, chuyển offline.
- **Yêu cầu chi tiết:**
    - **REQ-020:** Hệ thống phải sinh và hiển thị một cặp giá trị gồm URL ingest và stream key duy nhất cho mỗi kênh được phép phát, và cho phép tái tạo khóa theo yêu cầu của Streamer hoặc Admin.
    - **REQ-021:** Hệ thống phải không hiển thị stream key đầy đủ sau lần hiển thị đầu tiên trừ khi người dùng chủ động yêu cầu “hiện lại” qua thao tác xác nhận (giảm rò rỉ qua snapshot màn hình).
    - **REQ-022:** Hệ thống phải cập nhật trạng thái kênh thành “live” trong vòng tối đa 90 giây sau khi nhận được tín hiệu ingest hợp lệ từ nhà cung cấp stream hoặc hook tương đương (*đo trên staging*).
    - **REQ-023:** Hệ thống phải cập nhật trạng thái kênh thành “offline” trong vòng tối đa 120 giây sau khi luồng ingest kết thúc hoặc sau thời gian chờ không nhận dữ liệu (heartbeat timeout theo cấu hình nhà cung cấp, có giá trị mặc định được ghi trong cấu hình triển khai).
    - **REQ-024:** Hệ thống phải cho phép Streamer đặt tiêu đề phiên live (tối đa 200 ký tự) trước hoặc trong khi phát, và hiển thị tiêu đề đó trên trang phòng xem.
    - **REQ-025:** Hệ thống phải gán mỗi phiên live một định danh phiên (session id) duy nhất để tham chiếu trong chat và log.
    - **REQ-026:** Hệ thống phải hiển thị số người xem đồng thời (concurrent viewers) trên phòng xem nếu hạ tầng cung cấp metric; nếu không có, hiển thị giá trị 0 hoặc “không khả dụng” nhất quán và không giả mạo số liệu ngẫu nhiên.

### 4.5 Danh mục, thẻ và siêu dữ liệu nội dung
- **Mô tả và Ưu tiên:** Danh mục có kiểm soát, thẻ (tag) phục vụ lọc và tìm kiếm tối thiểu. **Ưu tiên: High (MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi Admin tạo hoặc ẩn danh mục, danh sách lọc trên trang khám phá phản ánh thay đổi sau khi làm mới hoặc theo TTL cache được định nghĩa.
- **Yêu cầu chi tiết:**
    - **REQ-027:** Hệ thống phải duy trì danh sách danh mục do Admin quản lý, mỗi mục có định danh, tên hiển thị và cờ ẩn/hiện.
    - **REQ-028:** Hệ thống phải cho phép Streamer gán đúng một danh mục cho mỗi phiên live tại thời điểm bắt đầu hoặc cập nhật trước khi kết thúc phiên.
    - **REQ-029:** Hệ thống phải cho phép gán tối đa mười thẻ (tag) cho một phiên live, mỗi thẻ tối đa 32 ký tự chữ Latinh, số và gạch dưới.
    - **REQ-030:** Hệ thống phải loại bỏ khoảng trắng đầu/cuối khi lưu thẻ và chuẩn hóa chữ thường để tránh trùng lặp khác biệt chỉ bởi hoa/thường.
    - **REQ-031:** Hệ thống phải cho phép Admin gộp hai thẻ trùng nghĩa bằng cách chọn thẻ nguồn và thẻ đích, và cập nhật mọi tham chiếu phiên sang thẻ đích trong một giao dịch.

### 4.6 Phòng xem live, trình phát video và đồng bộ thời gian tối thiểu
- **Mô tả và Ưu tiên:** Trang phòng xem với player thích ứng (ABR khi hạ tầng cho phép). **Ưu tiên: High (MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi người xem mở phòng live hợp lệ, trình phát tải manifest/URL phát và bắt đầu phát trong ngưỡng thời gian được định nghĩa tại NFR; khi luồng không khả dụng, hiển thị thông báo lỗi có mã.
- **Yêu cầu chi tiết:**
    - **REQ-032:** Hệ thống phải cung cấp URL phát (HLS hoặc định dạng được trình duyệt hỗ trợ) cho trình phát web khi phiên đang ở trạng thái live.
    - **REQ-033:** Hệ thống phải từ chối truy cập phát nội dung của kênh bị Admin đình chỉ phát sóng với thông báo lý do mã hóa (ví dụ `CHANNEL_SUSPENDED`).
    - **REQ-034:** Hệ thống phải hiển thị tiêu đề phiên, tên kênh và danh mục trên phòng xem khi dữ liệu tồn tại.
    - **REQ-035:** Hệ thống phải hỗ trợ chế độ toàn màn hình và điều khiển âm lượng/tạm dừng thông qua API trình phát được chọn (HTML5 video hoặc thư viện player).
    - **REQ-036:** Hệ thống phải ghi nhận sự kiện “join stream” (viewer mở phòng thành công) với timestamp để phục vụ thống kê phiên.

### 4.7 Chat realtime trên luồng và điều khiển kênh
- **Mô tả và Ưu tiên:** Chat WebSocket (hoặc tương đương), slow mode, chat chỉ follower, ghim tin (nếu MVP phạm vi cho phép). **Ưu tiên: High (MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi người dùng gửi tin nhắn, máy chủ xác thực, áp dụng rate limit và quy tắc kênh, lưu/lan truyền tới subscriber của phòng; Moderator có thể xóa hoặc cấm trong phạm vi quyền.
- **Yêu cầu chi tiết:**
    - **REQ-037:** Hệ thống phải phân phối tin nhắn chat tới mọi client đang kết nối tới cùng định danh phiên live trong độ trễ không vượt quá ngưỡng chat trong NFR (đo trên mạng LAN/staging).
    - **REQ-038:** Hệ thống phải giới hạn độ dài một tin nhắn chat tối đa 500 ký tự Unicode sau khi chuẩn hóa.
    - **REQ-039:** Hệ thống phải từ chối tin nhắn từ người dùng bị cấm chat trên kênh đó hoặc đang trong thời gian timeout do Moderator/Streamer đặt.
    - **REQ-040:** Hệ thống phải áp dụng “slow mode” bằng cách chỉ cho phép mỗi người dùng gửi tối đa một tin trong khoảng thời gian T giây (T cấu hình theo kênh, tối thiểu 3, tối đa 120) khi chế độ được bật.
    - **REQ-041:** Hệ thống phải ở chế độ “followers-only chat” chỉ cho phép người dùng đã follow kênh gửi tin khi cờ này bật.
    - **REQ-042:** Hệ thống phải cho phép Streamer hoặc Moderator kênh xóa một tin nhắn theo id tin và lan truyền sự kiện xóa tới client để gỡ khỏi UI.
    - **REQ-043:** Hệ thống phải cho phép Streamer hoặc Moderator kênh đặt timeout người dùng với thời lượng chọn từ tập {60, 300, 900} giây.
    - **REQ-044:** Hệ thống phải cho phép Streamer hoặc Moderator kênh cấm người dùng khỏi kênh với lý do văn bản tối đa 280 ký tự và ghi nhận thời điểm cấm.
    - **REQ-045:** Hệ thống phải lọc tin nhắn chat theo danh sách từ cấm (case-insensitive, whole word hoặc substring theo cấu hình kênh) trước khi lưu hoặc lan truyền.
    - **REQ-046:** Hệ thống phải hỗ trợ đề cập người dùng theo định dạng `@username` và lưu id người được đề cập nếu username tồn tại.

### 4.8 Cộng đồng (group), follow và tương tác tối thiểu
- **Mô tả và Ưu tiên:** Group/community, group chat, follow streamer. **Ưu tiên: High (MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi người dùng follow kênh, hệ thống ghi nhận quan hệ và cập nhật UI; khi gửi tin trong group chat, chỉ thành viên hợp lệ nhận được.
- **Yêu cầu chi tiết:**
    - **REQ-047:** Hệ thống phải cho phép người dùng đã đăng nhập follow hoặc unfollow một kênh và idempotent theo trạng thái hiện tại.
    - **REQ-048:** Hệ thống phải hiển thị số lượng follower của kênh dưới dạng số nguyên không âm cập nhật theo sự kiện follow/unfollow.
    - **REQ-049:** Hệ thống phải cho phép tạo group với tên (3–80 ký tự), mô tả (tối đa 2000 ký tự), quy tắc (tối đa 2000 ký tự) và ảnh bìa tùy chọn (JPEG/PNG ≤ 5 MB).
    - **REQ-050:** Hệ thống phải cho phép chủ group mời hoặc duyệt thành viên (ít nhất một chế độ: “mở” hoặc “duyệt”) được cấu hình tại thời điểm tạo.
    - **REQ-051:** Hệ thống phải cung cấp group chat realtime cho thành viên group với cùng ràng buộc độ dài tin như chat stream (REQ-038).
    - **REQ-052:** Hệ thống phải cho phép chủ group chỉ định tối đa ba moderator group có quyền xóa tin và loại thành viên khỏi group.

### 4.9 Khám phá, danh sách đang live và tìm kiếm tối thiểu
- **Mô tả và Ưu tiên:** Trang chủ/khám phá, danh sách đang live, lọc danh mục, tìm kiếm theo từ khóa đơn giản. **Ưu tiên: High (MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi người dùng chọn danh mục hoặc nhập từ khóa, hệ thống trả về danh sách phân trang với metadata hiển thị trên thẻ kênh/phiên.
- **Yêu cầu chi tiết:**
    - **REQ-053:** Hệ thống phải hiển thị danh sách các kênh đang live với ít nhất: thumbnail (hoặc placeholder), tiêu đề phiên, tên kênh, danh mục, và nhãn “LIVE”.
    - **REQ-054:** Hệ thống phải hỗ trợ lọc danh sách đang live theo một danh mục do Admin định nghĩa.
    - **REQ-055:** Hệ thống phải hỗ trợ tìm kiếm theo chuỗi không phân biệt hoa thường trên ít nhất hai trường: tên kênh và tiêu đề phiên đang live.
    - **REQ-056:** Hệ thống phải phân trang kết quả với kích thước trang mặc định 20 và tối đa 50 mục mỗi trang.
    - **REQ-057:** Hệ thống phải trả về danh sách rỗng có metadata phân trang (total = 0) khi không có kết quả thay vì lỗi máy chủ.

### 4.10 Báo cáo vi phạm, hàng đợi xử lý và chống lạm dụng
- **Mô tả và Ưu tiên:** Gửi báo cáo, trạng thái xử lý, rate limit và CAPTCHA khi vượt ngưỡng. **Ưu tiên: High (MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi người dùng gửi báo cáo, hệ thống tạo bản ghi queue cho Admin/Mod quyền; khi vượt ngưỡng gửi báo cáo hoặc đăng nhập, áp dụng giới hạn hoặc CAPTCHA theo cấu hình.
- **Yêu cầu chi tiết:**
    - **REQ-058:** Hệ thống phải cho phép người dùng đã đăng nhập gửi báo cáo đối với ít nhất các đối tượng: kênh/stream, tin nhắn chat, hồ sơ người dùng.
    - **REQ-059:** Hệ thống phải yêu cầu chọn lý do từ danh sách cố định (spam, quấy rối, nội dung không phù hợp, khác) và cho phép mô tả tùy chọn tối đa 1000 ký tự.
    - **REQ-060:** Hệ thống phải gán trạng thái báo cáo trong tập {OPEN, IN_REVIEW, RESOLVED, REJECTED} và chỉ Admin hoặc vai trò được ủy quyền thay đổi trạng thái.
    - **REQ-061:** Hệ thống phải áp dụng giới hạn tối đa 10 báo cáo mỗi giờ cho mỗi người dùng trên môi trường production demo trừ khi Admin điều chỉnh.
    - **REQ-062:** Hệ thống phải áp dụng rate limit đối với endpoint đăng nhập và gửi tin chat theo ngưỡng được cấu hình trong máy chủ (không hard-code trong client).
    - **REQ-063:** Hệ thống phải tích hợp CAPTCHA (ví dụ reCAPTCHA v3/hCaptcha) trên biểu mẫu đăng ký và đăng nhập khi địa chỉ IP vượt ngưỡng thất bại hoặc burst request được định nghĩa trong cấu hình.

### 4.11 Quản trị nền tảng, danh mục và xử lý báo cáo
- **Mô tả và Ưu tiên:** Dashboard admin, CRUD danh mục/tag, xử lý báo cáo, đình chỉ kênh. **Ưu tiên: High (MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi Admin cập nhật danh mục hoặc đình chỉ kênh, thay đổi có hiệu lực đối với luồng đọc công khai và API trong thời gian đồng bộ xử lý không quá giới hạn batch (tham chiếu NFR).
- **Yêu cầu chi tiết:**
    - **REQ-064:** Hệ thống phải cung cấp giao diện web chỉ truy cập được bởi vai trò Admin liệt kê tổng quan: số người dùng đăng ký, số phiên live, số báo cáo OPEN.
    - **REQ-065:** Hệ thống phải cho phép Admin tạo, sửa, ẩn và khôi phục danh mục.
    - **REQ-066:** Hệ thống phải cho phép Admin đình chỉ phát sóng một kênh với thời hạn hoặc vô thời hạn và lưu lý do bắt buộc tối đa 500 ký tự.
    - **REQ-067:** Hệ thống phải cho phép Admin xem danh sách báo cáo lọc theo trạng thái và gán ghi chú xử lý nội bộ tối đa 2000 ký tự.
    - **REQ-068:** Hệ thống phải cho phép Admin vô hiệu hóa hoặc kích hoạt lại tài khoản người dùng và ghi nhận thời điểm và người thực hiện.

### 4.12 Kiểm toán, nhật ký hoạt động và phân tích cơ bản
- **Mô tả và Ưu tiên:** Audit cho hành động nhạy cảm; metric viewer join; analytics streamer tối thiểu. **Ưu tiên: Medium (MVP cho audit; analytics có thể tinh giản).**
- **Trình tự phản hồi (Stimulus/Response):** Khi Admin hoặc Mod thực hiện hành động kiểm duyệt, một bản ghi audit được ghi không thể chỉnh sửa từ UI người dùng thường.
- **Yêu cầu chi tiết:**
    - **REQ-069:** Hệ thống phải ghi audit log cho các hành động: đình chỉ kênh, ban người dùng toàn cục, thay đổi vai trò, xóa tin nhắn bởi mod/admin, quyết định báo cáo (resolve/reject).
    - **REQ-070:** Mỗi bản ghi audit phải chứa: timestamp UTC, actor id, target id (nếu có), loại hành động (enum), và payload tóm tắt không vượt quá 4 KB JSON.
    - **REQ-071:** Hệ thống phải cho phép Streamer xem biểu đồ hoặc bảng số liệu số người xem đồng thời tối đa và số lượt join phiên trong 24 giờ gần nhất khi dữ liệu được thu thập.
    - **REQ-072:** Hệ thống phải cho phép export audit log của Admin ra định dạng CSV cho phạm vi ngày tối đa 31 ngày mỗi lần yêu cầu.

### 4.13 Thông báo trong ứng dụng và lộ trình mở rộng
- **Mô tả và Ưu tiên:** MVP: thông báo trong web tối thiểu cho sự kiện follow/back-office; Post-MVP: đầy đủ realtime + email/push. **Ưu tiên: Medium (MVP tối thiểu) / Low–Medium (Post-MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi sự kiện phát sinh, client nhận payload qua kênh realtime hoặc polling theo thiết kế; người dùng có thể đánh dấu đã đọc.
- **Yêu cầu chi tiết:**
    - **REQ-073:** Hệ thống phải tạo thông báo trong ứng dụng khi người dùng nhận follow mới trên kênh của họ (đối với Streamer).
    - **REQ-074:** Hệ thống phải cho phép người dùng xem danh sách thông báo phân trang và đánh dấu một mục là đã đọc.
    - **REQ-075 (Post-MVP):** Hệ thống phải gửi email thông báo khi kênh được follow bật chế độ live nếu người dùng đã bật tùy chọn email và cấu hình SMTP hợp lệ.
    - **REQ-076 (Post-MVP):** Hệ thống phải đẩy thông báo realtime tới client đang kết nối trong vòng 5 giây kể từ sự kiện server cho các loại được định nghĩa trong cấu hình sản phẩm.

### 4.14 Tính năng giai đoạn 2 (VOD, lịch phát, monetization sandbox)
- **Mô tả và Ưu tiên:** Lưu VOD sau live, lịch phát, donate/subscribe sandbox — triển khai sau MVP. **Ưu tiên: Low (Post-MVP).**
- **Trình tự phản hồi (Stimulus/Response):** Khi phiên kết thúc, pipeline xử lý tạo asset VOD và trạng thái hiển thị trên UI; thanh toán sandbox chỉ ghi nhận giao dịch thử nghiệm.
- **Yêu cầu chi tiết:**
    - **REQ-077 (Post-MVP):** Hệ thống phải tạo bản ghi VOD sau khi phiên live kết thúc với trạng thái xử lý {PENDING, READY, FAILED} và chỉ hiển thị phát khi READY.
    - **REQ-078 (Post-MVP):** Hệ thống phải cho phép đặt chế độ hiển thị VOD là public, unlisted hoặc private theo định nghĩa sản phẩm và kiểm tra quyền trước khi phát.
    - **REQ-079 (Post-MVP):** Hệ thống phải cho phép Streamer tạo lịch phát với thời điểm bắt đầu UTC, tiêu đề và múi giờ hiển thị theo cấu hình người dùng hoặc mặc định hệ thống.
    - **REQ-080 (Post-MVP):** Hệ thống phải xử lý giao dịch donate qua cổng thanh toán sandbox với idempotency key trên mỗi yêu cầu để tránh trùng ghi.
    - **REQ-081 (Post-MVP):** Hệ thống phải duy trì sổ cái nội bộ ghi nhận mỗi giao dịch sandbox với mã tham chiếu nhà cung cấp, số tiền, đơn vị tiền, trạng thái và timestamp.

---

## 5. Các yêu cầu phi chức năng (Non-functional Requirements)

### 5.1 Yêu cầu về Hiệu năng (Performance Requirements)
- **Thời gian phản hồi API:** p95 độ trễ endpoint đọc danh sách đang live và chi tiết phòng xem ≤ **800 ms** trên môi trường staging với tải tham chiếu **≤ 50** yêu cầu đồng thời (đo bằng công cụ load test).
- **API ghi (chat, báo cáo):** p95 ≤ **1200 ms** trong điều kiện staging tương tự.
- **Khởi động phát video:** thời gian từ lúc player nhận URL manifest đến khung hình đầu tiên (TTFF) **≤ 5 giây** trên kết nối tham chiếu 10 Mbps, trừ khi giới hạn trial CDN không cho phép — khi đó ghi nhận ngoại lệ trong báo cáo triển khai.
- **Realtime chat:** độ trễ end-to-end từ lúc client gửi đến lúc client khác nhận tin trên cùng phiên **≤ 2 giây** trong mạng LAN/staging; trên Internet đo được và ghi nhận trong báo cáo kiểm thử.
- **Web Vitals (tham chiếu):** trên trang khám phá và phòng live, **LCP ≤ 2,5 s** và **INP ≤ 200 ms** trên thiết bị tham chiếu được định nghĩa trong Test Plan (trình duyệt + máy ảo).
- **Throughput message:** hệ thống phải xử lý tối thiểu **50 tin chat/giây** trên một phòng live trong kiểm thử load nội bộ mà không làm rơi kết nối hợp lệ vượt quá 1%.
- **Đồng thời:** kiến trúc phải cho phép mở rộng ngang tầng ứng dụng để hỗ trợ **ít nhất 200** người dùng đồng thời trên môi trường demo (số cụ thể có thể điều chỉnh theo hạ tầng, nhưng phải được kiểm chứng một lần trước demo).

### 5.2 Yêu cầu về Độ an toàn (Safety Requirements)
- **Toàn vẹn dữ liệu:** mọi thao tác ghi quan trọng (cấm, đình chỉ, quyết định báo cáo, giao dịch sandbox) phải thực hiện trong giao dịch DB hoặc mô hình tương đương đảm bảo không để trạng thái nửa vời khi lỗi.
- **Ngăn hư hỏng vận hành:** Admin phải có khả năng vô hiệu hóa nhanh chat toàn kênh hoặc dừng hiển thị luồng khi phát hiện lạm dụng (feature flag hoặc lệnh khẩn cấp trong dashboard).
- **Failover phiên live:** khi dịch vụ streaming upstream mất kết nối, hệ thống phải chuyển kênh sang offline hoặc trạng thái lỗi có mã trong vòng **180 giây** và hiển thị thông báo cho viewer.
- **Sao lưu và phục hồi:** xem chi tiết mục 5.4 (Thuộc tính chất lượng) — RPO/RTO mục tiêu nội bộ cho môi trường demo.
- **Streaming và CDN:** phải có cơ chế retry khi tải manifest/player lỗi tạm thời với tối đa **3** lần thử cách **2 giây** trước khi báo lỗi người dùng.

### 5.3 Yêu cầu về Bảo mật (Security Requirements)
- **Vận chuyển:** toàn bộ lưu lượng người dùng qua Internet phải dùng **TLS 1.2+**; cookie phiên phải có cờ `Secure` và `HttpOnly` khi dùng cookie-based session.
- **Mật khẩu và bí mật:** không lưu secret trong mã nguồn; sử dụng biến môi trường hoặc vault; rotate stream key khi nghi ngờ lộ.
- **OWASP:** áp dụng biện pháp chống **SQLi** (truy vấn tham số hóa/ORM), **XSS** (escape output, CSP khuyến nghị), **CSRF** (token cho form/mutation), và kiểm tra **SSRF** đối với webhook nội bộ nếu có.
- **Ủy quyền:** mọi API phải xác thực trừ danh sách public được liệt kê trong OpenAPI; kiểm tra quyền theo tài nguyên (resource-based) đối với thao tác trên kênh, group, báo cáo.
- **Rate limiting:** áp dụng giới hạn theo IP và theo tài khoản đối với đăng nhập, chat, báo cáo (tham chiếu REQ-062, REQ-061).
- **Giám sát gian lận (sandbox):** khi bật thanh toán giai đoạn 2, áp dụng kiểm tra velocity đơn giản (số giao dịch/phút/user) và log đầy đủ để điều tra.
- **PII và log:** không ghi nội dung mật khẩu, token đầy đủ hoặc stream key trong log ứng dụng; giảm thiểu email trong log trừ hash/định danh nội bộ khi cần.

### 5.4 Các thuộc tính chất lượng phần mềm (Software Quality Attributes)
- **Khả năng mở rộng (Scalability):** tầng ứng dụng phải **stateless** đối với phiên người dùng trừ token/session lưu store tập trung; cho phép thêm instance mà không yêu cầu sticky session trên tầng HTTP ngoài cấu hình load balancer chuẩn.
- **Tính tin cậy (Reliability):** tỷ lệ lỗi máy chủ 5xx trên endpoint đọc chính **< 1%** trong tuần demo đo được qua logging; sự cố phải ghi exception id để truy vết.
- **Tính khả dụng (Availability):** mục tiêu **best effort** cho demo; không cam kết 99,9% — triển khai healthcheck `/healthz` trả về 200 khi DB và dependency bắt buộc sẵn sàng.
- **Khả năng bảo trì (Maintainability):** mã nguồn phải có lint/format theo chuẩn dự án; API có tài liệu OpenAPI phiên bản hóa; thay đổi breaking phải tăng phiên bản API.
- **Khả năng sử dụng (Usability) — web:** các luồng chính (đăng nhập, mở phòng live, gửi chat) hoàn thành được bằng **≤ 5** thao tác click/hành động chính từ trang chủ; thông báo lỗi hiển thị mã hoặc thông điệp chiến lược rõ ràng, không chỉ “Lỗi”.
- **Tương thích trình duyệt (Compatibility):** hỗ trợ **Chrome, Firefox, Edge, Safari** phiên bản **2 phát hành chính gần nhất** trên desktop; trên mobile iOS Safari và Chrome Android phiên bản tương đương cho luồng xem và chat.
- **Thiết kế responsive:** layout phải thích ứng breakpoint định nghĩa tại Mục 3.1 mà không làm mất chức năng lõi (xem, chat, điều hướng).
- **Logging và giám sát (Logging & Monitoring):** tích hợp structured logging (JSON) với correlation id mỗi request; metric cơ bản: RPS, latency histogram, error rate; dashboard staging hiển thị ít nhất các metric trên.
- **Sao lưu và phục hồi (Backup & Recovery):** sao lưu cơ sở dữ liệu **hàng ngày** giữ **7** bản cho môi trường demo; **RPO** mục tiêu **24 giờ**, **RTO** mục tiêu **4 giờ** — là mục tiêu nội bộ học tập, không phải SLA thương mại.
- **Khả năng truy cập (Accessibility):** các luồng chính tuân theo **WCAG 2.1 AA** ở mức có thể kiểm chứng (nhãn form, contrast tối thiểu 4,5:1 cho văn bản thông thường, điều hướng bàn phím cho điều khiển chính).
- **Độ trễ WebSocket và đồng bộ:** tin nhắn chat và sự kiện presence phải đến client trong ngưỡng đã nêu tại 5.1; kết nối phải hỗ trợ ping/pong hoặc heartbeat **≤ 30 giây** để phát hiện đứt mạng.

---

## 6. Các yêu cầu khác (Other Requirements)

- **Pháp lý và điều khoản (demo):** hệ thống phải hiển thị biểu ngữ hoặc trang thông tin rằng môi trường có thể là **demo/học tập** và không đảm bảo dịch vụ thương mại; phải có trang Điều khoản sử dụng (TOS) rút gọn và Chính sách quyền riêng tư mô tả dữ liệu thu thập tối thiểu (email, hồ sơ, log).
- **Quyền nội dung và gỡ bỏ:** phải có quy trình cho phép Admin gỡ VOD/stream khỏi hiển thị công khai khi có yêu cầu hợp lệ trong phạm vi đồ án/học thuật và ghi nhận quyết định trong audit log.
- **Giữ dữ liệu (Retention):** log ứng dụng giữ **30 ngày** trên staging/demo trừ khi cấu hình khác; audit log giữ **180 ngày**; dữ liệu chat có thể cấu hình xóa sau **90 ngày** để giảm rủi ro lưu trữ — chi tiết có thể tinh chỉnh trong ADR.
- **Phân tích sản phẩm nội bộ:** cho phép thu thập sự kiện analytics ẩn danh (page view, join stream) không chứa PII ngoài user id nội bộ và session id — tuân thủ phần giảm thiểu PII tại 5.3.
- **Đào tạo vận hành:** phải có tài liệu **Incident playbook** phiên bản học tập mô tả bước: tắt chat kênh, đình chỉ kênh, thông báo template — lưu trong repository docs.
- **Kiểm thử chấp nhận:** mọi REQ có nhãn MVP phải có ít nhất một **test case** liên kết trong Test Plan trước khi coi là đạt cho đợt phát hành demo.

---

*Tài liệu này là điểm neo traceability: mỗi hạng mục phát triển và kiểm thử nên tham chiếu mã REQ tương ứng. Phiên bản tài liệu và lịch sử thay đổi được quản lý theo quy trình cấu hình phần mềm của dự án (TBD nếu chưa có nhánh release).*
