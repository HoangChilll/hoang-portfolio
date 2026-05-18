---
title: Session
date: 2026-05-17
tags: [http, authen, security,session]
description: 1 phương thức xác thực phổ biến 
---
# 1. Session là gì?
  - Server `giữ trạng thái đăng nhập`
  - **Flow**
    + Bước 1: User login (username/password)
    + Bước 2: Server `tạo session`
    + Bước 3: Server trả về cookie (`JSESSIONID`)
    + Bước 4: Browser `tự động gửi cookie` mỗi request
    + Server dùng cookie để `tìm session` → biết user là ai
  - **Bản chất**
    + Server lưu:
      + `userId`
      + `role`
      + `trạng thái login`
  - **Ưu điểm**
    + `Dễ implement`
    + `An toàn` (data nằm server)
    + `Dễ revoke` (xóa session là logout)
  - **Nhược điểm**
    + `Tốn RAM` server
    + `Khó scale` (nhiều server phải share session)
    + `Không hợp microservice`

## 1.1. Bước 1: Login (CHỈ xảy ra 1 lần lúc đăng nhập)
  - User gửi request:
    + `POST /login`
    + `username=abc&password=123`
  - **Server xử lý**
    + Kiểm tra đúng/sai (`Authentication`)
    + Nếu đúng:
      + `tạo session` trên server
      + sinh ra `sessionId`
  - **Server trả về**
    + `Set-Cookie: JSESSIONID=xyz123`

## 1.2. Bước 2: Browser lưu cookie
  - Trình duyệt `tự động lưu` JSESSIONID
  - Không cần code gì thêm

## 1.3. Bước 3: Các request sau (QUAN TRỌNG)
  - Mỗi lần user gọi API: `GET /profile`
  - **Browser tự động gửi**
    + `Cookie: JSESSIONID=xyz123`
  - **Server xử lý**
    + Lấy `sessionId`
    + Tra trong `session store`
    + Biết user là ai → `không cần login lại`

# 2. Vấn đề bảo mật

## 2.1. Session Hijacking
  - `Nguy hiểm nhất`
  - **Cách xảy ra**
    + Hacker `lấy được JSESSIONID` (cookie)
    + Sau đó gửi request với cookie đó
    + Server sẽ nghĩ: `"Đây là user thật"`
  - **Nguyên nhân**
    + Dùng `HTTP` (không mã hóa)
    + `XSS` (đánh cắp cookie)
    + `WiFi công cộng`
  - **Cách phòng chống**
    + `HTTPS`
    + Cookie flags: `HttpOnly`, `Secure`
    + `Regenerate sessionId` sau login
    + `Timeout` session
    + `Detect bất thường`

## 2.2. Cross-Site Request Forgery (CSRF)
  - `Rất đặc trưng` của Session
  - **Bản chất**
    + Browser `tự động gửi cookie`
    + Hacker `lợi dụng` điều này
  - **Kịch bản**
    + Bước 1: User đã `login`
    + Bước 2: User vào `web độc hại`
    + Bước 3: Trong web có đoạn `<img src="https://bank.com/transfer?amount=1000&to=hacker">`
    + Bước 4: Browser tự gửi request `GET /transfer?amount=1000&to=hacker` kèm `Cookie: JSESSIONID=abc123`
    + Bước 5: Server check cookie hợp lệ → `cho phép chuyển tiền`
  - Browser vẫn gửi cookie → server `tưởng request hợp lệ`
  - Kết quả: User bị `thao túng mà không biết`
  - **Cách phòng chống**
    + `CSRF Token`: chuỗi ngẫu nhiên do server tạo ra để xác minh request thực sự đến từ user hợp lệ, gửi kèm cookie
    + `SameSite Cookie`: chỉ cho phép request từ trang hợp lệ
    + Check `Origin / Referer`

## 2.3. Cross-Site Scripting (XSS)
  - Không chỉ riêng session, nhưng `rất nguy hiểm`
  - **Cách tấn công**
    + `Inject JS` vào web
    + Lấy cookie: `document.cookie`
    + Gửi về hacker → `hijack session`
  - **Cách phòng chống**
    + `Escape / Encode output`
    + `Validate input`
    + `Content Security Policy` (chỉ chạy script từ domain mình)
    + `HttpOnly` cookie
    + Tránh dùng `innerHTML` nguy hiểm

## 2.4. Session Fixation
  - `Ít người biết` nhưng khá nguy hiểm
  - **Cách tấn công**
    + Hacker `gửi sẵn sessionId` cho nạn nhân
    + Nạn nhân `login`
    + Server `dùng lại session đó`
    + Hacker biết sessionId → `chiếm quyền`
  - **Cách phòng chống**
    + `Regenerate sessionId` sau login
    + Không nhận sessionId từ `URL`

# 3. Nhược điểm thiết kế (không phải hack)

## 3.1. Stateful → khó scale
  - Server phải lưu session: `sessionId → user data`
  - **Vấn đề**
    + 1 server → OK
    + Nhiều server → phải:
      + `Redis`
      + hoặc `shared session`
  - `Phức tạp` hệ thống

## 3.2. Tốn tài nguyên server
  - `RAM` để lưu session
  - User nhiều → `nặng`

## 3.3. Không hợp microservices
  - Vì:
    + Mỗi service `phải biết session`
    + Hoặc `share session` → messy

## 3.4. Phụ thuộc vào Cookie
  - Điều này dẫn đến:
    + `Dính CSRF`
    + `Khó dùng cho mobile app` (không phải browser)
