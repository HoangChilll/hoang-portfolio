---
title: JSON TOKEN WEB
date: 2026-03-17
tags: [http, authen, author,JWT,security]
description: phương thức xác thực phổ biến hiện nay
---
# JWT (JSON Web Token)
  - JWT là một `chuẩn` dùng để truyền thông tin giữa client và server dưới dạng `JSON đã được ký (signed)`
  - Thường dùng trong `authentication` (xác thực) và `authorization` (phân quyền)

# 1. JWT là gì (hiểu đơn giản)
  - JWT giống như một `"tấm vé"`
    + Khi đăng nhập thành công → server cấp cho bạn 1 `token (JWT)`
    + Sau đó mỗi lần gọi API → bạn `gửi kèm token` này
    + Server chỉ cần `kiểm tra token` → không cần lưu session
  - Khác với session truyền thống: JWT `không cần lưu trạng thái` ở server (`stateless`)

# 2. Cấu trúc của JWT
  - JWT có `3 phần`, nối với nhau bằng dấu `.`
  - `HEADER.PAYLOAD.SIGNATURE`

## 2.1. Header
  - Chứa thông tin `thuật toán mã hóa`
  - Ví dụ:
    + `"alg": "HS256"`
    + `"typ": "JWT"`

## 2.2. Payload
  - Chứa `dữ liệu (claims)`
  - Ví dụ:
    + `"userId": 123`
    + `"username": "hoang"`
    + `"role": "admin"`
    + `"exp": 1710000000`
  - **Lưu ý**
    + Payload `KHÔNG được mã hóa`, chỉ encode `base64` → ai cũng đọc được
    + Không lưu `password` hoặc `data nhạy cảm`

## 2.3. Signature (quan trọng nhất)
  - Dùng để `xác minh token có bị sửa` không
  - **Cách tạo**
    + `HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret_key)`

# 3. Cách JWT hoạt động

## 3.1. Bước 1: Login
  - User gửi `username + password`
  - Server kiểm tra đúng → `tạo JWT` → trả về client

## 3.2. Bước 2: Client lưu token
  - Thường lưu ở:
    + `localStorage`
    + `cookie` (an toàn hơn nếu `httpOnly`)

## 3.3. Bước 3: Gọi API
  - Client gửi request kèm token:
    + `Authorization: Bearer <JWT>`

## 3.4. Bước 4: Server verify
  - Server kiểm tra:
    + `chữ ký (signature)`
    + `hạn sử dụng (exp)`
  - Nếu hợp lệ → `cho phép truy cập`

# 4. Ưu điểm của JWT

## 4.1. Stateless (không cần lưu server)
  - Đây là `ưu điểm lớn nhất`
  - Server `không cần lưu session`
  - Mỗi request chỉ cần:
    + `verify chữ ký`
    + `đọc payload`
  - Giảm tải `RAM / database`
  - Không cần `session store`

## 4.2. Scale cực tốt (phù hợp hệ thống lớn)
  - Có 10 server → `vẫn chạy bình thường`
  - Không cần:
    + `Redis session`
    + `sticky session`
  - Vì server nào cũng `verify JWT được`

## 4.3. Nhanh hơn session
  - Session: phải `query DB / cache`
  - JWT: chỉ cần `verify signature (CPU)`
  - `Ít I/O` → nhanh hơn trong nhiều case

## 4.4. Phù hợp REST API / Microservices
  - Mỗi service chỉ cần:
    + `decode JWT`
    + `không cần hỏi service khác`
  - Rất hợp với:
    + `mobile app`
    + `frontend React / SPA`
    + `hệ thống phân tán`

## 4.5. Tự chứa thông tin (self-contained)
  - Trong JWT có thể chứa:
    + `userId`
    + `role`
    + `permission`
  - `Không cần gọi DB` mỗi lần
  - Ví dụ:
    + `"userId": 1`
    + `"role": "admin"`

## 4.6. Dễ tích hợp đa nền tảng
  - `Web`
  - `Mobile`
  - `API`
  - `IoT`
  - Chỉ cần gửi: `Authorization: Bearer <JWT>`

## 4.7. Linh hoạt cách lưu
  - JWT có thể lưu ở:
    + `localStorage`
    + `cookie`
    + `memory`
  - Tuỳ theo `chiến lược bảo mật`

## 4.8. Chuẩn phổ biến
  - Là `chuẩn mở (RFC 7519)`
  - Hầu hết framework đều support:
    + `Spring Boot`
    + `Node.js`
    + `Django`

# 5. Nhược điểm của JWT

## 5.1. Khó logout / revoke (điểm yếu lớn nhất)
  - **Với session**
    + Logout → `xóa session` → xong
  - **Với JWT**
    + Token đã phát → `vẫn dùng được` đến khi hết hạn
    + User logout rồi nhưng token `vẫn còn sống`
  - **Cách xử lý**
    + Dùng `blacklist (Redis)`
    + Hoặc `token ngắn hạn + refresh token`

## 5.2. Bị lộ token = "toang ngay"
  - JWT giống như `chứng minh thư có chữ ký hợp lệ`
  - Nếu hacker lấy được:
    + `dùng được luôn`
    + server `không phân biệt được`
  - Khác session:
    + Còn có thể `invalidate server-side`

## 5.3. Không thể chỉnh sửa / cập nhật giữa chừng
  - **Ví dụ**
    + User bị đổi role: `admin → user`
    + JWT cũ vẫn chứa: `"role": "admin"`
    + → vẫn có quyền admin `cho đến khi token hết hạn`

## 5.4. Payload đọc được (không mã hóa)
  - JWT chỉ `encode base64`, `KHÔNG encrypt`
  - Ai cũng `decode được`
  - Lộ thông tin nếu lưu `data nhạy cảm`

## 5.5. Token dài → tăng size request
  - JWT thường khá dài: `vài trăm bytes`
  - Mỗi request đều gửi: `Authorization: Bearer <JWT>`
  - `Tốn băng thông` hơn sessionId

## 5.6. Verify tốn CPU hơn session (trong một số case)
  - JWT: phải `verify signature (HMAC / RSA)`
  - Session: chỉ `lookup Redis (O(1))`
  - Với hệ thống cực lớn: CPU verify có thể thành `bottleneck`

## 5.7. Dễ bị XSS nếu lưu sai chỗ
  - Nếu lưu JWT ở `localStorage`
  - XSS → `script lấy token` → gửi về hacker

## 5.8. CSRF nếu dùng Cookie
  - Nếu lưu JWT trong cookie:
    + Browser `tự gửi` → dính `CSRF`
  - **Phải dùng**
    + `CSRF token`
    + `SameSite cookie`

## 5.9. Khó kiểm soát session người dùng
  - **Session**
    + Biết user đang `login ở đâu`
    + Có thể `force logout`
  - **JWT**
    + Không biết token `đang ở đâu`

# 6. Một số cách tấn công phổ biến

## 6.1. Token Theft (Đánh cắp JWT)
  - **Cách xảy ra**
    + `XSS` (inject script)
    + Lưu token ở `localStorage`
    + `Log lộ token`
    + `MITM` (HTTP không có HTTPS)
  - Hacker lấy được `Authorization: Bearer <JWT>` → dùng như user thật
  - **Hậu quả**
    + `Không phân biệt được` hacker vs user
    + `Toàn quyền truy cập`
  - **Cách phòng chống**
    + `Không lưu localStorage`
    + `Chống XSS`
    + Luôn dùng `HTTPS`
    + `Token sống ngắn`
    + Dùng `Refresh Token`
    + `Bind thêm context` (advanced): đúng IP, đúng device, đúng môi trường mới chấp nhận JWT

## 6.2. XSS → lấy JWT
  - **Cách hoạt động**
    + Script inject vào web: `localStorage.getItem("token")`
    + Gửi về `server hacker`
  - Vì JWT thường lưu `localStorage`
  - Đây là `lỗi phổ biến nhất` khi dùng JWT

## 6.3. CSRF (nếu lưu JWT trong cookie)
  - **Cách**
    + Browser `tự gửi cookie`
    + Hacker tạo `request giả`
    + User login → cookie có JWT
    + User vào web độc → bị `gửi request ngầm`
  - **Hậu quả**
    + Thực hiện hành động `thay user`

## 6.4. Algorithm None Attack (cổ điển nhưng nổi tiếng)
  - **Cách**
    + JWT header: `"alg": "none"`
    + Một số server config ngu:
      + `không verify signature`
      + `vẫn accept token`
  - Hacker `tự tạo JWT giả` luôn
  - **Phòng chống**
    + `alg:none` → reject luôn

## 6.5. Signature Forgery (Brute-force secret)
  - **Cách**
    + Nếu dùng secret yếu: `secret = "123456"`
    + Hacker `brute-force` → ký lại token
  - **Hậu quả**
    + Tạo `token admin giả`

## 6.6. Token Replay Attack
  - **Cách**
    + Hacker `chặn được request`
    + Gửi lại JWT đó `nhiều lần`
  - **Ví dụ**
    + Thanh toán → gửi lại request → bị `trừ tiền 2 lần`

## 6.7. Token không hết hạn (No Expiry)
  - **Cách**
    + JWT `không có exp`
  - **Hậu quả**
    + Token `sống mãi mãi` → hack 1 lần dùng cả đời

## 6.8. Privilege Escalation
  - **Cách**
    + JWT chứa: `"role": "user"`
    + Nếu server verify sai: hacker sửa thành `"admin"`
  - **Hậu quả**
    + Nếu signature `không check kỹ` → toang

## 6.9. Key Confusion Attack (RS256 ↔ HS256)
  - **Cách**
    + Server dùng `RSA (public/private key)`
    + Hacker dùng `public key làm secret`
    + Server `verify sai logic`
  - Có thể `giả mạo token hợp lệ`

## 6.10. Information Leakage
  - **Cách**
    + JWT chứa data nhạy cảm:
      + `email`
      + `password`
      + `ssn`
  - `decode base64` → `đọc được hết`
