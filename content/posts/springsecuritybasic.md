---
title: Spring Security Basic
date: 2026-04-17
tags: [java, spring, security]
description: Kiến thức căn bản, phổ biến về spring
---
# Spring Security: FilterChain, AuthenticationManager, SecurityContext

# 1. FilterChain
  - Mọi request HTTP đi vào đều phải đi qua một `chuỗi filter` (Filter Chain)
  - **Flow tổng quát**
    + `Request → Filter 1 → Filter 2 → Filter 3 → ... → Controller`
  - Nếu qua filter nào `fail` → request bị `chặn luôn`
  - Filter Chain là `xương sống` của Spring Security: mọi cơ chế xác thực / phân quyền đều cài cắm dưới dạng filter

## 1.1. Các filter phổ biến
  - **SecurityContextPersistenceFilter** (Spring Security 5) / **SecurityContextHolderFilter** (Spring Security 6)
    + Lấy thông tin user đã login `từ session`
    + Đặt vào `SecurityContextHolder` ở đầu request
    + `Lưu lại` vào session ở cuối request
  - **UsernamePasswordAuthenticationFilter**
    + Xử lý `login form` (username/password)
    + Mặc định bắt request `POST /login`
  - **BasicAuthenticationFilter**
    + Xử lý `Basic Auth` (header `Authorization: Basic ...`)
    + Decode `base64` → lấy username/password
  - **BearerTokenAuthenticationFilter**
    + Xử lý `JWT` (header `Authorization: Bearer <token>`)
    + Parse token → validate → tạo `Authentication`
  - **CsrfFilter**
    + Kiểm tra `CSRF token`
    + Mặc định bật với session-based auth
  - **ExceptionTranslationFilter**
    + Xử lý lỗi auth
    + `AuthenticationException` → `401 Unauthorized`
    + `AccessDeniedException` → `403 Forbidden`
  - **FilterSecurityInterceptor** / **AuthorizationFilter** (Spring Security 6)
    + Filter `cuối cùng` của chain
    + Thực hiện `authorization`: check user có quyền truy cập endpoint không
  - **LogoutFilter**
    + Bắt request `POST /logout`
    + Clear `SecurityContext` + invalidate session

## 1.2. Thứ tự filter quan trọng
  - Filter chạy theo `thứ tự cố định` do Spring quy định
  - Ví dụ:
    + `SecurityContextPersistenceFilter` phải chạy `trước` các authentication filter
    + `AuthorizationFilter` phải chạy `sau cùng` (vì cần biết user là ai mới phân quyền được)
  - Có thể thêm `custom filter` bằng:
    + `addFilterBefore(...)`
    + `addFilterAfter(...)`
    + `addFilterAt(...)`

---

# 2. AuthenticationManager
  - **Tại sao cần có AuthenticationManager?**
    + Nếu không có nó:
      + Mỗi filter phải `tự xử lý login`
      + Không `mở rộng` được nhiều loại auth
      + Không support `JWT, OAuth2, Basic Auth` cùng lúc
  - **AuthenticationManager giúp**
    + `Tách logic xác thực` ra khỏi filter
    + `Dễ mở rộng` thêm kiểu login mới
    + `Hỗ trợ nhiều kiểu login` song song

## 2.1. AuthenticationManager là gì?
  - AuthenticationManager = `bộ điều phối xác thực`
  - **Chịu trách nhiệm**
    + Nhận thông tin đăng nhập (username/password, token,...)
    + `Kiểm tra` tính hợp lệ
    + Trả về `kết quả xác thực` (thành công / thất bại)
  - **Interface chính**
    + `Authentication authenticate(Authentication authentication) throws AuthenticationException`
  - Trả về:
    + `Authentication object` đã được `xác thực` (nếu đúng)
    + Throw `AuthenticationException` (nếu sai)

## 2.2. Vị trí trong Spring Security
  - **Luồng tổng quát**
    + `Request login`
    + → Filter (`UsernamePasswordAuthenticationFilter`)
    + → `AuthenticationManager`
    + → `AuthenticationProvider`
    + → `UserDetailsService`
    + → `Database / memory`
  - Nghĩa là:
    + AuthenticationManager `KHÔNG tự verify` user
    + Nó chỉ `"giao việc"` cho các `AuthenticationProvider`

## 2.3. Authentication object là gì?
  - Là object chứa `toàn bộ thông tin xác thực`
  - **Chứa các trường**
    + `principal` → username hoặc UserDetails
    + `credentials` → password / token
    + `authorities` → list role (ROLE_USER, ROLE_ADMIN,...)
    + `authenticated` → đã xác thực hay chưa (`true / false`)
    + `details` → thông tin request (IP, sessionId,...)
  - **Các implementation phổ biến**
    + `UsernamePasswordAuthenticationToken` → form login / Basic Auth
    + `BearerTokenAuthenticationToken` → JWT
    + `OAuth2AuthenticationToken` → OAuth2
    + `AnonymousAuthenticationToken` → user chưa login
  - **Lưu ý quan trọng**
    + Trước khi authenticate: `authenticated = false`, có `password thật`
    + Sau khi authenticate: `authenticated = true`, `credentials = null` (xóa password đi cho an toàn)

## 2.4. AuthenticationManager hoạt động như thế nào?
  - **Bước 1: Nhận request login**
    + User gửi: `POST /login` với `username=admin`, `password=123`
  - **Bước 2: Filter tạo Authentication object**
    + `Authentication authRequest = new UsernamePasswordAuthenticationToken(username, password)`
    + Lúc này `authenticated = false`
  - **Bước 3: Gửi vào AuthenticationManager**
    + `Authentication authResult = authenticationManager.authenticate(authRequest)`
  - **Bước 4: Delegation sang AuthenticationProvider**
    + AuthenticationManager thường là: `ProviderManager`
    + Nó `loop qua nhiều provider`:
      + `DaoAuthenticationProvider` (login DB)
      + `JwtAuthenticationProvider` (JWT)
      + `LdapAuthenticationProvider` (LDAP)
      + `OAuth2LoginAuthenticationProvider` (OAuth2)
  - **Bước 5: Provider xử lý thật**
    + Ví dụ với DB login (`DaoAuthenticationProvider`):
      + Gọi `UserDetailsService.loadUserByUsername(username)`
      + Lấy user từ DB
      + So sánh password bằng `PasswordEncoder` (BCrypt)
  - **Bước 6: Trả về Authentication đã xác thực**
    + Nếu đúng:
      + `new UsernamePasswordAuthenticationToken(userDetails, null, authorities)`
      + `authenticated = true`, `credentials = null`

## 2.5. ProviderManager (quan trọng nhất)
  - Đây là implementation `phổ biến nhất` của `AuthenticationManager`
  - **Cách làm việc**
    + Loop qua list `AuthenticationProvider`:
      + `try authenticate`
      + Nếu `success` → return ngay
      + Nếu `fail` → thử provider tiếp theo
    + Nếu `tất cả` đều fail → throw `AuthenticationException`
  - Có thể có `parent ProviderManager` → tạo cấu trúc phân cấp

## 2.6. AuthenticationProvider (liên quan chặt)
  - AuthenticationManager `không làm việc trực tiếp`, mà gọi `AuthenticationProvider.authenticate()`
  - **Interface**
    + `boolean supports(Class<?> authentication)` → có hỗ trợ loại token này không
    + `Authentication authenticate(Authentication auth)` → xác thực thực sự
  - **Các provider phổ biến**
    + `DaoAuthenticationProvider` → lấy user từ `UserDetailsService` + check password
    + `JwtAuthenticationProvider` → verify JWT signature + expiry
    + `LdapAuthenticationProvider` → xác thực qua LDAP
    + `RememberMeAuthenticationProvider` → cookie remember-me

## 2.7. UserDetailsService (bổ sung)
  - Interface đơn giản để `nạp user từ nguồn dữ liệu`
  - **Method duy nhất**
    + `UserDetails loadUserByUsername(String username) throws UsernameNotFoundException`
  - **Implementation phổ biến**
    + `InMemoryUserDetailsManager` → user lưu in-memory (chỉ dùng demo / test)
    + `JdbcUserDetailsManager` → user lưu trong DB qua JDBC
    + Custom service → tự code, load từ JPA Repository / MongoDB / API,...
  - **UserDetails** là interface mô tả user
    + `getUsername()`
    + `getPassword()` (đã hash)
    + `getAuthorities()` → list role
    + `isAccountNonExpired() / isAccountNonLocked() / isEnabled()` → các flag trạng thái

## 2.8. PasswordEncoder (bổ sung)
  - Dùng để `hash` password và `so sánh` khi login
  - **Các implementation phổ biến**
    + `BCryptPasswordEncoder` → `khuyến nghị` (chậm có chủ đích → chống brute-force)
    + `Argon2PasswordEncoder` → mới hơn, mạnh hơn BCrypt
    + `Pbkdf2PasswordEncoder`
    + `NoOpPasswordEncoder` → `KHÔNG dùng production` (plain text)
  - **Hai method chính**
    + `encode(rawPassword)` → trả ra hash để lưu DB
    + `matches(rawPassword, hashed)` → so sánh password user nhập với hash trong DB

---

# 3. SecurityContext

## 3.1. SecurityContext là gì?
  - SecurityContext = `nơi lưu thông tin user đang đăng nhập`
  - **Cụ thể chứa**
    + `Authentication object`
      + `principal` (user)
      + `credentials` (password, token,...)
      + `authorities` (role: ROLE_USER, ROLE_ADMIN,...)
  - **Tóm lại**
    + `SecurityContext → Authentication → User info + Roles`

## 3.2. SecurityContext được lưu ở đâu?
  - Spring dùng class static: `SecurityContextHolder`
  - **3 strategy lưu trữ**
    + `MODE_THREADLOCAL` (mặc định)
      + Mỗi `thread` có context riêng
      + User A không ảnh hưởng User B
      + Vì mỗi request = 1 thread riêng (trong servlet model)
    + `MODE_INHERITABLETHREADLOCAL`
      + Context được `kế thừa` sang thread con
      + Dùng cho `async` / `spawn thread`
    + `MODE_GLOBAL`
      + 1 context dùng chung toàn app
      + `Hiếm khi dùng` (chỉ cho standalone app)
  - **Cấu hình**
    + `SecurityContextHolder.setStrategyName(MODE_INHERITABLETHREADLOCAL)`

## 3.3. Flow hoạt động (quan trọng nhất)
  - **Bước 1: User gửi request login**
    + Ví dụ: `POST /login` với `username + password`
  - **Bước 2: AuthenticationFilter xử lý**
    + Ví dụ: `UsernamePasswordAuthenticationFilter`
    + Tạo object `Authentication` (`chưa xác thực`)
  - **Bước 3: AuthenticationManager xác thực**
    + Gọi `UserDetailsService`
    + Gọi `PasswordEncoder.matches(...)`
    + Nếu đúng → trả `Authentication` với `isAuthenticated = true`
  - **Bước 4: Lưu vào SecurityContext**
    + `SecurityContextHolder.getContext().setAuthentication(auth)`
    + Tại đây: user `chính thức "logged in"`
  - **Bước 5: Lưu vào Session (nếu dùng session)**
    + Spring dùng `SecurityContextPersistenceFilter` (hoặc `SecurityContextHolderFilter` ở Spring Security 6)
    + Lưu `SecurityContext` vào `HTTP Session`
    + Để request sau `không cần login lại`
  - **Bước 6: Request tiếp theo**
    + Filter sẽ:
      + Lấy `SecurityContext` từ Session
      + Set lại vào `SecurityContextHolder`
  - **Bước 7: Authorization (phân quyền)**
    + Khi gọi API, ví dụ `/admin`:
      + Spring check `SecurityContext → Authentication → roles`
      + Nếu không có `ROLE_ADMIN` → reject (`403`)

## 3.4. Sơ đồ tổng thể
  - `Request`
    + ↓ `Filter`
    + ↓ `AuthenticationManager`
    + ↓ `Authentication`
    + ↓ `SecurityContext`
    + ↓ `SecurityContextHolder (ThreadLocal)`
    + ↓ `Controller xử lý`

## 3.5. Lấy user trong code kiểu gì?
  - **Cách 1: Trong Controller (verbose)**
    + `Authentication auth = SecurityContextHolder.getContext().getAuthentication()`
    + `String username = auth.getName()`
    + `Collection<? extends GrantedAuthority> roles = auth.getAuthorities()`
  - **Cách 2: Annotation (gọn hơn)**
    + `@AuthenticationPrincipal UserDetails user`
    + `@AuthenticationPrincipal CustomUser user`
  - **Cách 3: Inject Authentication trực tiếp vào controller method**
    + `public ResponseEntity<?> me(Authentication auth) { ... }`
  - **Cách 4: SecurityContextHolder ở service / non-controller**
    + `SecurityContextHolder.getContext().getAuthentication()`
    + Dùng khi không có request scope (background job,...)

## 3.6. JWT thì SecurityContext hoạt động sao?
  - **KHÁC SESSION**
    + `Không lưu session`
    + Mỗi request phải:
      + `Đọc JWT` từ header
      + `Validate JWT` (signature + expiry)
      + `Tạo Authentication` object
      + `Set vào SecurityContext`
  - Nghĩa là:
    + `JWT → parse → Authentication → SecurityContext`
    + Xong request là `mất` (`stateless`)
  - **Config Spring Security cho JWT**
    + `sessionManagement().sessionCreationPolicy(STATELESS)`
    + Disable `CSRF` (vì không dùng session-based)
    + Disable `form login`
    + Thêm custom `JwtAuthenticationFilter` vào chain

## 3.7. Lỗi hay gặp (rất quan trọng)
  - **SecurityContext null**
    + Do:
      + Chưa authenticate
      + Filter chưa chạy (sai thứ tự / chưa add vào chain)
      + Endpoint nằm ngoài Spring Security
  - **Mất login khi request mới (session)**
    + Do:
      + Không lưu session
      + Hoặc config `stateless` mà không dùng JWT
      + Cookie session bị clear / chưa được gửi
  - **Sai thread (mất context khi async)**
    + Do `ThreadLocal`
    + Async / multithread → context `không tự truyền` sang thread con
    + Giải pháp:
      + `MODE_INHERITABLETHREADLOCAL`
      + Hoặc `DelegatingSecurityContextRunnable` / `DelegatingSecurityContextExecutor`
      + Hoặc `@Async` với `SecurityContextHolder` strategy phù hợp
  - **Context bị clear giữa chừng**
    + Do gọi `SecurityContextHolder.clearContext()` ở chỗ nào đó
    + Hoặc filter logout chạy nhầm

## 3.8. Tóm tắt dễ nhớ
  - SecurityContext = `"bộ nhớ user hiện tại"`
  - **Nó**
    + Chứa `Authentication`
    + Được giữ bởi `SecurityContextHolder` (mặc định `ThreadLocal`)
    + Sống theo `request` (stateless / JWT) hoặc theo `session` (form login)

---

# 4. Tổng kết liên kết 3 thành phần
  - **FilterChain**: cổng vào, mọi request đi qua từng filter một
  - **AuthenticationManager**: trái tim xác thực, được filter gọi để verify user
  - **SecurityContext**: bộ nhớ chứa user sau khi xác thực, để các bước sau (authorization, controller) đều biết user là ai
  - **Liên kết**
    + `Filter` bắt request → tạo `Authentication` chưa xác thực
    + `Filter` gọi `AuthenticationManager` để xác thực
    + `AuthenticationManager` ủy quyền cho `AuthenticationProvider`
    + `Provider` dùng `UserDetailsService` + `PasswordEncoder` để verify
    + Verify xong → `Filter` set `Authentication` vào `SecurityContext`
    + Các filter sau (như `AuthorizationFilter`) đọc `SecurityContext` để phân quyền
    + Controller dùng `@AuthenticationPrincipal` để lấy user
