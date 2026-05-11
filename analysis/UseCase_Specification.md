# ĐẶC TẢ USE CASE (USE CASE SPECIFICATION)
## Use Case Name: [Tên Use Case]

> [!TIP]
> **Mục đích:** Tài liệu này mô tả chi tiết luồng tương tác giữa Actor và Hệ thống cho một chức năng cụ thể. Một hệ thống sẽ có nhiều tài liệu Đặc tả Use Case cho từng chức năng chính.

---

## 1. Tên Use Case (Use Case Name)
Tên Use Case phải là một cụm động từ (Ví dụ: Đăng ký tài khoản, Thanh toán giỏ hàng).

### 1.1 Tóm tắt (Brief Description)
Mô tả ngắn gọn (2-3 câu) về mục đích và giá trị mà Use Case này mang lại cho Actor.

---

## 2. Các Tác nhân (Actors)
Liệt kê các Actor tham gia vào Use Case này (Actor chính và Actor phụ).

---

## 3. Tiền điều kiện (Preconditions)
Những điều kiện PHẢI đúng trước khi Use Case này có thể bắt đầu (Ví dụ: Người dùng đã đăng nhập).

---

## 4. Luồng sự kiện chính (Basic Flow)
*Mô tả kịch bản thành công nhất (Happy Path).*

1. [Bước 1]: Actor thực hiện hành động X.
2. [Bước 2]: Hệ thống kiểm tra dữ liệu và hiển thị Y.
3. [Bước 3]: Actor chọn Z.
4. [Bước 4]: Hệ thống lưu trữ thông tin và thông báo thành công.

---

## 5. Các luồng thay thế (Alternative Flows)
*Mô tả các hướng đi khác nhưng vẫn đạt được mục đích hoặc xử lý các lựa chọn của người dùng.*

### 5.1 [Tên luồng thay thế 1]
Tại bước [N] của luồng chính, nếu Actor chọn [Hành động khác], thì:
1. ...
2. Quay lại bước [M] của luồng chính.

---

## 6. Luồng ngoại lệ (Exception Flows)
*Mô tả cách hệ thống xử lý khi có lỗi hoặc điều kiện không mong muốn.*

### 6.1 [Tên lỗi - Ví dụ: Sai mật khẩu]
Tại bước [N] của luồng chính, nếu hệ thống phát hiện dữ liệu không hợp lệ:
1. Hệ thống hiển thị thông báo lỗi.
2. Cho phép Actor nhập lại hoặc hủy bỏ.

---

## 7. Hậu điều kiện (Postconditions)
Trạng thái của hệ thống sau khi Use Case kết thúc thành công (Ví dụ: Đơn hàng đã được lưu vào Database).

---

## 8. Các yêu cầu đặc biệt (Special Requirements)
Các yêu cầu phi chức năng chỉ áp dụng riêng cho Use Case này (Ví dụ: Thời gian xử lý giao dịch thanh toán không quá 30 giây).

---

## 9. Điểm mở rộng (Extension Points)
Nếu Use Case này có các Use Case khác mở rộng từ nó (Ví dụ: Use Case "Thanh toán" có điểm mở rộng là "Áp dụng mã giảm giá").

---

## 10. Ghi chú & Quy tắc nghiệp vụ (Business Rules)
Liệt kê các quy tắc logic nghiệp vụ áp dụng trong Use Case này (Ví dụ: Khách hàng VIP được giảm 10%).
