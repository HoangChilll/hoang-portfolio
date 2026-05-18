---
title: Basic http, authen,author
date: 2026-05-17
tags: [http, authen, author]
description: Kiến thức cơ bản về phương thức http, phân quyền và xác thực
---
# HTTP - Authentication & Authorization
  - HTTP là giao thức ở `tầng ứng dụng`, không phải "tầng cao nhất của mọi thứ", mà là tầng cao nhất mà `dev web thường làm việc`

# 1. Authentication (Xác thực)
  - Trả lời câu hỏi: `"Bạn là ai?"`

## 1.1. Form login (username/password)
  - Người dùng `nhập username/password`
  - Server `kiểm tra` thông tin
  - Nếu đúng → cấp "vé" (`session/token`) để đi tiếp

## 1.2. Basic Auth
  - **Cách hoạt động**
    + Client gửi request `kèm header`
    + Thay vì dùng login form, Basic Auth `nhét luôn` thông tin vào HTTP header:
    + `Authorization: Basic base64(username:password)`
  - **Ví dụ**
    + username: `hoang`
    + password: `123456`
    + Ghép lại: `hoang:123456`
    + Encode Base64: `aG9hbmc6MTIzNDU2`
    + Request sẽ thành: `Authorization: Basic aG9hbmc6MTIzNDU2`
  - **Server xử lý như thế nào?**
    + Bước 1: Lấy header `Authorization`
    + Bước 2: `Decode Base64` → ra `username:password`
    + Bước 3: `Tách` username/password
    + Bước 4: `So sánh với DB`
    + Nếu đúng → `cho truy cập`
    + Nếu sai → trả `401 Unauthorized`

## 1.3. OAuth2 (login bằng Google, Facebook)
  - OAuth2 là một cơ chế `ủy quyền (authorization framework)`, nhưng thực tế hay dùng luôn để `đăng nhập (login)` bằng Google, Facebook, GitHub,...
  - Hiểu đơn giản: Thay vì tạo account mới, bạn `"nhờ Google/Facebook xác thực giúp bạn là ai"`
  - **Ý tưởng cốt lõi**
    + Thay vì `tự lưu username/password`
    + Thì OAuth2 làm:
      + `Google/Facebook xác thực hộ`
      + App của bạn `chỉ nhận token` + thông tin user
  - **Ví dụ thực tế**
    + Bạn bấm "Login with Google"
    + Không nhập password vào app của bạn
    + Chuyển sang `Google login`
  - **Flow hoạt động** (quan trọng nhất)
    + Bước 1: `Redirect sang Google`
      + App của bạn gửi user sang `accounts.google.com`, kèm:
        + `client_id`
        + `redirect_uri`
        + `scope` (email, profile)
    + Bước 2: `User login Google`
      + User nhập Google account
      + Google `xác thực`
    + Bước 3: Google trả về `Authorization Code`
      + Google redirect về app: `https://your-app.com/callback?code=XYZ`
    + Bước 4: App `đổi code lấy token`
      + Backend gửi code lên Google → nhận về:
        + `Access Token`
        + `ID Token`
    + Bước 5: App `lấy info user`
      + Từ token, app có thể lấy:
        + email
        + name
        + avatar
    + Bước 6: `Tạo session riêng` cho app
      + App bạn `tạo session / JWT riêng`
      + Coi user `đã login`

## 1.4. JWT (token-based)
  - (Phần này sẽ bổ sung sau)

# 2. Authorization (Phân quyền)
  - Trả lời câu hỏi: `"Bạn được làm gì?"`
  - **Ví dụ**
    + User A:
      + `Xem` bài viết
      + Không được `xóa user`
    + Admin:
      + `Làm được tất cả`

