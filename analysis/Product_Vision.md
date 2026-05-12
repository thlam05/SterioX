# TÀI LIỆU TẦM NHÌN SẢN PHẨM (PRODUCT VISION)
## Dự án: SterioX — Nền tảng livestream web

## 1. Giới thiệu (Introduction)
*Tài liệu định nghĩa tầm nhìn kỹ thuật–sản phẩm cho nền tảng livestream dạng website, dùng làm khung tham chiếu khi triển khai code, kiểm thử và demo — phục vụ streamer, người xem và vai trò quản trị.*
### 1.1 Mục đích (Purpose)
Tài liệu này nhằm:
- Thống nhất **mục tiêu học tập**, phạm vi chức năng và thứ tự ưu tiên triển khai (MVP trước, mở rộng sau), tránh phình phạm vi không kiểm soát.
- Làm cơ sở cho các tài liệu kỹ thuật đi kèm (SRS, use case, kiến trúc, kế hoạch kiểm thử) phục vụ báo cáo môn học, đồ án hoặc hồ sơ năng lực cá nhân.

### 1.2 Phạm vi (Scope)
Phạm vi được chia hai giai đoạn để **tối đa hóa học được trong thời gian cho phép**: hoàn thành luồng giá trị kỹ thuật cốt lõi trước, sau đó mở rộng các chủ đề nâng cao (thanh toán mô phỏng, gợi ý, vận hành) tùy hướng dẫn hoặc định hướng cá nhân.

**Giai đoạn 1 — MVP (Minimum Viable Product)**
- Ứng dụng web responsive: trang chủ, trang kênh streamer, phòng xem live, trang cộng đồng/group, trang cá nhân người dùng; trang khám phá/tìm kiếm ở mức tối thiểu (danh sách đang live, lọc theo danh mục).
- Hạ tầng phát và xem video trực tiếp: ingest, phân phối qua CDN (hoặc dịch vụ trial/miễn phí có giới hạn); transcoding/chất lượng thích ứng ở mức đủ để **học và demo** (chi tiết trong SRS).
- Chat realtime trên stream; group chat cho cộng đồng.
- Quản trị cốt lõi: dashboard admin, cấu hình danh mục/nội dung, tiếp nhận và xử lý báo cáo vi phạm cơ bản, phân quyền vai trò thiết yếu (ví dụ Admin, Streamer, Viewer, Mod kênh nếu áp dụng).
- Tương tác xã hội tối thiểu: follow streamer.

**Giai đoạn 2 — Phát triển mở rộng (Post-MVP)**
- Luồng thông báo đầy đủ: realtime trong web; email/push khi có thời gian tích hợp và cấu hình môi trường (thường là tùy chọn học tập).
- **Monetization dạng học tập / demo:** mô phỏng hoặc tích hợp **sandbox** cổng thanh toán (subscribe, quà ảo, donate) để luyện thiết kế API, idempotency, ledger — **không bắt buộc** phải vận hành thu nhập thật; báo cáo “doanh thu” phục vụ demo và bài học kế toán nghiệp vụ.
- Nội dung sau phát sóng: lịch phát (stream schedule), VOD/replay, clip highlight.
- Khám phá nâng cao: tìm kiếm mở rộng (metadata, tag), gợi ý/discovery (có thể bắt đầu từ heuristic đơn giản trước khi học ML).
- Kiểm duyệt và vận hành nâng cao: công cụ mod chi tiết hơn, hàng đợi xử lý, audit log mở rộng; tối ưu transcoding đa profile/adaptive bitrate nếu chưa hoàn thiện ở MVP.

**Ngoài phạm vi (trừ khi được bổ sung có chủ đích học tập):**
- Ứng dụng native mobile chính thức (web responsive đủ cho mục tiêu trải nghiệm đa thiết bị).
- Game engine tích hợp, marketplace vật phẩm vật lý, ví blockchain tùy chỉnh.
### 1.3 Định nghĩa, Từ viết tắt (Definitions, Acronyms, and Abbreviations)
| Thuật ngữ / Viết tắt | Định nghĩa |
| :--- | :--- |
| VOD | Video on demand — bản ghi sau live để xem lại. |
| CDN | Content delivery network — mạng phân phối nội dung tĩnh và video gần người dùng. |
| RTMP / WebRTC | Các giao thức/giải pháp phổ biến cho ingest hoặc xem có độ trễ thấp (lựa chọn cụ thể do kiến trúc quyết định). |
| DRM | Digital rights management — bảo vệ bản quyền nội dung (khi cần). |
| RBAC | Role-based access control — kiểm soát truy cập theo vai trò. |
| SLA | Service level agreement — trong bối cảnh dự án học: **mục tiêu chất lượng nội bộ** (tham chiếu), không phải cam kết hợp đồng thương mại. |
| UGC | User-generated content — nội dung do người dùng tạo (stream, chat, clip). |
| TOS | Terms of service — điều khoản sử dụng (có thể rút gọn cho môi trường demo). |
| 2FA / MFA | Xác thực hai lớp / đa yếu tố. |
| Sandbox (thanh toán) | Môi trường thử nghiệm của nhà cung cấp thanh toán, không ghi nhận giao dịch tiền thật. |
---
## 2. Định vị (Positioning)
### 2.1 Bối cảnh & Mục tiêu học tập (Learning Context and Goals)
Xây dựng nền tảng livestream web là cách **ôn tập và mở rộng** nhiều lớp kỹ thuật: frontend hiện đại, API và cơ sở dữ liệu, xác thực và phân quyền, WebSocket/realtime, pipeline video và CDN, cùng các chủ đề vận hành (moderation, logging). SterioX đóng vai trò **bài lab quy mô lớn**: đủ phức tạp để gần với công việc thực tế, nhưng trong phạm vi kiểm soát được và ưu tiên **an toàn học tập** (dữ liệu giả, sandbox, giới hạn người dùng) hơn là cạnh tranh thị trường.

### 2.2 Phát biểu Vấn đề (Problem Statement)
- **Vấn đề là:** Streamer và khán giả thiếu một không gian web thống nhất vừa phát/xem ổn định, vừa quản trị cộng đồng và kiếm tiền một cách rõ ràng; nền tảng chung thường quá tải tính năng hoặc thiếu kiểm soát địa phương/tuân thủ.
- **Ảnh hưởng đến:** Streamer (giảm thu nhập, burnout kiểm duyệt), Viewer (spam, nội dung không phù hợp, khó tìm nội dung), Admin (chi phí vận hành cao, rủi ro pháp lý).
- **Kết quả là:** Suy giảm thời gian xem (DAU/watch time), tỷ lệ giữ chân thấp, gia tăng khiếu nại và rủi ro tuân thủ.
- **Một giải pháp tốt sẽ:** Cung cấp live ổn định, chat có công cụ kiểm soát, discovery hợp lý, monetization có hóa đơn/audit trail, và dashboard vận hành đo lường được.

### 2.3 Phát biểu Định vị Sản phẩm (Product Position Statement)
- **Dành cho:** Streamer chuyên nghiệp và bán chuyên, người xem yêu thích nội dung live, và đội vận hành nền tảng.
- **Người mà:** Cần một hub web để phát sóng, xây cộng đồng, tương tác realtime và phát triển thu nhập bền vững.
- **Sản phẩm là:** Nền tảng livestream web SterioX.
- **Cái mà:** Mang lại trải nghiệm xem tin cậy, công cụ quản lý kênh và cộng đồng rõ ràng, cùng lộ trình kiếm tiền và phân tích hiệu quả.
- **Khác với:** Các nền tảng live đa mục đích quốc tế hoặc khu vực có trọng tâm sản phẩm khác với đối tượng mục tiêu của chúng ta.
- **Sản phẩm của chúng tôi:** Tập trung vào **web-first**, **moderation có lớp** (tự động + con người), **phân quyền chi tiết**, và **khả năng mở rộng kỹ thuật** (CDN, realtime, observability) phù hợp triển khai thực tế.

---
## 3. Mô tả Các bên liên quan & Người dùng (Stakeholder and User Descriptions)
### 3.1 Nhân khẩu học Thị trường (Market Demographics)
- **Độ tuổi:** 18–45 (chính), có kiểm soát nội dung 13+ nếu mở rộng sau khi có chính sách bảo vệ trẻ em.
- **Khu vực:** Ưu tiên thị trường khởi đầu theo chiến lược go-to-market (ngôn ngữ UI, phương thức thanh toán, giờ cao điểm).
- **Thiết bị:** Desktop và mobile browser; băng thông đa dạng → cần adaptive bitrate và UI tối ưu touch.

### 3.2 Hồ sơ Các bên liên quan (Stakeholder Profiles)
| Stakeholder | Vai trò / Quan tâm |
| :--- | :--- |
| Development | Hoàn thành milestone, chất lượng code, học stack và DevOps cơ bản. |
| Product / BA (có thể trùng vai Dev trong dự án nhỏ) | Viết SRS, ưu tiên backlog, giữ phạm vi MVP. |
| QA (có thể tự test) | Kịch bản kiểm thử, hồi quy trước demo. |
| “Admin” trong demo | Thường là chính tác giả; học thao tác vận hành và audit. |

### 3.3 Hồ sơ Người dùng (User Profiles)
| Nhóm người dùng | Mô tả ngắn | Nhu cầu chính (trong bối cảnh học tập) |
| :--- | :--- | :--- |
| Streamer (demo) | Người tạo luồng thử, quản lý kênh. | Hiểu ingest key, trạng thái live, công cụ mod cơ bản. |
| Viewer / User | Người xem demo, chat thử. | Trải nghiệm player, chat, follow; báo cáo lỗi cho nhóm. |
| Moderator | Người được gán quyền trên kênh demo. | Thực hành timeout/ban/filter. |
| Admin | Quản trị môi trường demo. | Dashboard, cấu hình danh mục, xử lý report, đọc log. |

---
## 4. Tổng quan về Sản phẩm (Product Overview)
### 4.1 Góc nhìn Sản phẩm (Product Perspective)
SterioX là **hệ thống độc lập** (web + backend) dùng để học tích hợp: CDN/video pipeline, **cổng thanh toán ở chế độ sandbox hoặc mock** (tùy giai đoạn), email/push nếu cấu hình được, cơ chế anti-abuse đơn giản (rate limit, CAPTCHA) và logging phục vụ **debug và báo cáo đồ án** — không bắt buộc đạt mức độ tích hợp doanh nghiệp đầy đủ.

### 4.2 Tóm tắt các Khả năng (Summary of Capabilities)
| Lợi ích cho Khách hàng | Tính năng của Sản phẩm |
| :--- | :--- |
| Xem live ổn định, thích ứng mạng | Adaptive streaming, CDN, player chuẩn hóa, giám sát chất lượng phiên |
| Tương tác realtime, không bị “ngập” spam | Chat realtime, slow mode, giới hạn tần suất, filter, role chat |
| Tìm nội dung phù hợp nhanh | Tìm kiếm streamer/title/tag, danh mục, trang khám phá, gợi ý cá nhân hóa |
| Gắn bó với creator và cộng đồng | Follow, subscribe (gói), group/community, thông báo realtime |
| Ủng hộ creator | Quà ảo, donate, ledger giao dịch, chống gian lận cơ bản |
| Kiểm soát sau phát sóng | VOD/replay, clip highlight, metadata và quyền hiển thị |
| Vận hành minh bạch | Admin dashboard, RBAC, audit log, báo cáo vi phạm, analytics streamer |

---
## 5. Các Tính năng của Sản phẩm (Product Features)
**A. Người dùng & tài khoản**
- **FEAT-01:** Đăng ký/đăng nhập — email/social (tùy cấu hình), xác minh email, khôi phục mật khẩu, MFA tùy chọn.
- **FEAT-02:** Hồ sơ người dùng — avatar, bio, liên kết, cài đặt riêng tư, chặn người dùng.
- **FEAT-03:** RBAC — vai trò Viewer, Streamer, Mod kênh, Admin; ma trận quyền API/UI.
- **FEAT-04:** Quản lý phiên & thiết bị — đăng xuất mọi nơi, danh sách phiên (nâng cao).

**B. Livestream & quản lý luồng**
- **FEAT-05:** Phát live video — khóa stream, gợi ý bitrate, trạng thái live/offline.
- **FEAT-06:** Danh mục & thẻ — category, tag có kiểm soát, metadata phục vụ tìm kiếm.
- **FEAT-07:** Lịch phát — tạo lịch, hiển thị kênh, nhắc qua thông báo.
- **FEAT-08:** VOD / Replay — lưu sau live, public/unlisted/private, retention theo chính sách demo.
- **FEAT-10:** Trạng thái kênh — tiêu đề phiên, viewer count.

**C. Chat & tương tác trên stream**
- **FEAT-11:** Chat realtime — tin nhắn, mention, emoji/sticker.
- **FEAT-12:** Slow mode & follower-only chat.
- **FEAT-13:** Pin message / announcement.

**D. Cộng đồng**
- **FEAT-14:** Group / community — tạo, mô tả, quy tắc, ảnh bìa.
- **FEAT-15:** Group chat — realtime, phân quyền thành viên/mod group.
- **FEAT-16:** Follow streamer — feed theo dõi, trạng thái live.
- **FEAT-17:** Subscribe streamer — **luồng sandbox**: badge/emote.

**E. Monetization (sandbox)**
- **FEAT-18:** Donate / tips — tích hợp **sandbox** hoặc ghi nhận nội bộ không tiền thật; lọc từ khóa khi hiển thị cảm ơn.
- **FEAT-19:** Quà ảo — catalog và animation; “doanh thu” chỉ mang tính minh họa hoặc điểm ảo.
- **FEAT-20:** Báo cáo thu nhập (demo) — export CSV, trạng thái payout **mô phỏng** để học báo cáo và reconciliation cơ bản.

**F. Khám phá & gợi ý**
- **FEAT-21:** Tìm kiếm — kênh, tiêu đề, tag; phân trang; lọc live/VOD.
- **FEAT-22:** Trang khám phá — top theo danh mục, mới, đề xuất đơn giản.
- **FEAT-23:** Gợi ý — heuristic trước; mở rộng theo lịch sử nếu có thời gian (học recommendation từ từ).

**G. Kiểm duyệt & an toàn**
- **FEAT-24:** Công cụ mod kênh — timeout, ban, xóa tin nhắn, từ cấm.
- **FEAT-25:** Hệ thống báo cáo — stream, user, chat; queue cho admin/mod.
- **FEAT-26:** Anti-spam — rate limit, CAPTCHA khi cần; chính sách shadowban chỉ áp dụng trong phạm vi demo có tài liệu.
- **FEAT-27:** Gỡ nội dung / bản quyền — gỡ VOD/clip, lưu vết quyết định.

**H. Thông báo**
- **FEAT-28:** Thông báo realtime trong web.
- **FEAT-29:** Email/push tùy chọn — phục vụ học tích hợp bên thứ ba.

**I. Admin & vận hành (demo)**
- **FEAT-30:** Admin dashboard — người dùng, stream live, báo cáo, giao dịch bất thường.
- **FEAT-31:** Quản lý danh mục & tag — CRUD, ẩn/hiện, gộp tag.
- **FEAT-32:** Audit log — hành động quan trọng, export phục vụ báo cáo.

**J. Phân tích**
- **FEAT-33:** Analytics cho streamer — concurrent viewers, nguồn traffic đơn giản, retention phiên; “doanh thu” theo loại nếu bật module sandbox.

---
## 6. Các Ràng buộc (Constraints)
- **Ràng buộc Kỹ thuật:** Web responsive; TLS khi deploy công khai; video qua CDN hoặc dịch vụ trial; realtime qua WebSocket hoặc tương đương; tuân thủ **hạn mức miễn phí** của nhà cung cấp (CDN, stream, email).
- **Ràng buộc dự án học tập:** Thời gian khóa học hoặc deadline cá nhân; ưu tiên chứng minh **luồng hoàn chỉnh** hơn là độ sâu từng tính năng phụ; thanh toán thật **không** bắt buộc — ưu tiên sandbox/mock trừ khi có giám sát và mục đích nghiên cứu rõ ràng.
- **Ràng buộc Pháp lý & đạo đức (dù là demo):** Không lưu dữ liệu nhạy cảm không cần thiết; thông báo rõ môi trường demo; tôn trọng ToS của API bên thứ ba; có quy trình gỡ nội dung khi được yêu cầu trong phạm vi học thuật/đồ án.
- **Ràng buộc Vận hành:** Không cam kết hỗ trợ 24/7; có playbook sự cố đơn giản cho demo (tắt chat, dừng stream) phục vụ **bài học incident**, không thay thế quy trình doanh nghiệp.

---
## 7. Các Yêu cầu Khác (Other Requirements)
**Hiệu năng & trải nghiệm**
- **P1 — Web vitals:** Đặt ngưỡng tham chiếu trong SRS; ưu tiên luồng watch/chat ổn định trên máy dev và staging.
- **P2 — Video:** Thời gian khởi động phát và ABR theo khả năng hạ tầng học tập; 1080p là mục tiêu **không bắt buộc** nếu cost/trial hạn chế.
- **P3 — Realtime:** Độ trễ chat ở mức chấp nhận được cho demo (đo và ghi nhận trong báo cáo).

**Khả năng mở rộng & sẵn sàng (học kiến trúc)**
- **S1:** Stateless app tier; khả năng scale-out như **bài tập thiết kế** và/hoặc triển khai giới hạn.
- **S2:** Tách ingestion và delivery; queue cho job nặng (VOD, clip).
- **S3:** CDN cache và TTL metadata — học invalidation và trade-off.

**Bảo mật**
- **SEC1:** OWASP ASVS làm tham chiếu học tập; chống XSS/CSRF/SQLi; cookie session an toàn.
- **SEC2:** Kiểm tra quyền theo resource trên mọi API quan trọng.
- **SEC3:** Bí mật qua biến môi trường / vault tùy môi trường; không commit secret.
- **SEC4:** Nếu có thanh toán sandbox — velocity check đơn giản, log giao dịch để học phát hiện bất thường.
- **SEC5:** Giảm thiểu PII trong log; retention ngắn cho môi trường demo.

**Độ tin cậy & quan sát (mức học tập)**
- **R1:** Uptime “best effort” cho demo; ghi nhận RTO/RPO trong tài liệu như **bài học**, không phải SLA thương mại.
- **R2:** Metrics/logging cơ bản (latency, error rate) để phục vụ debug và phần đánh giá đồ án.

**Trợ năng & đa ngôn ngữ**
- **A1:** WCAG 2.1 AA cho các luồng chính — mục tiêu học accessibility.
- **A2:** i18n nếu có thời gian (một ngôn ngữ chính + fallback đủ cho nhiều đồ án).

**Kiểm thử & chất lượng**
- **Q1:** Test tự động cho auth, luồng player/chat; sandbox payment trong test nếu tích hợp.
- **Q2:** Load test **tùy chọn** như bài lab (số concurrent giả lập vừa phải).

---
## 8. Tài liệu đi kèm (Documentation Requirements)
| Tài liệu | Mô tả |
| :--- | :--- |
| Software Requirements Specification (SRS) | Yêu cầu chi tiết, acceptance criteria, traceability. |
| Kiến trúc hệ thống & ADR | Quyết định kỹ thuật (ingest, CDN, realtime, DB). |
| API Specification | OpenAPI/Swagger. |
| Ghi chú môi trường & bí mật | Hướng dẫn chạy local/staging, không lộ key. |
| Moderation / Incident (phiên bản học tập) | Quy trình rút gọn cho demo. |
| README / Portfolio | Mục tiêu học tập, screenshot, hạn chế known issues. |
| Báo cáo đồ án hoặc Learning log | Tổng kết bài học, trade-off, hướng cải tiến. |
| Test Plan & Test Report | Phạm vi kiểm thử, kết quả trước demo. |
| Release Notes | Thay đổi theo phiên bản (kể cả nhỏ). |

---
