---
title: Design partern
date: 2026-04-17
tags: [java, staticfactory]
description: design partern 
---
# Effective Java - Item 1: Consider Static Factory Methods Instead of Constructors

## 1. Bối cảnh ra đời

Trước đây, trong Java, cách phổ biến để tạo object là sử dụng constructor.

```java
User user = new User(...);
```

Điều này hoạt động rất tốt đối với các class đơn giản.

Tuy nhiên, khi Java ngày càng phát triển, các thư viện (JDK), framework và hệ thống lớn xuất hiện, constructor dần bộc lộ nhiều hạn chế trong việc thiết kế API.

Joshua Bloch (tác giả Effective Java và cũng là một trong những kiến trúc sư của Java Collections Framework) đã đề xuất sử dụng **Static Factory Method** như một lựa chọn thay thế constructor trong nhiều trường hợp.

> Lưu ý: Ông không nói "luôn luôn dùng Static Factory", mà là **"Consider..."** (hãy cân nhắc sử dụng).

---

# 2. Bài toán cần giải quyết

Làm thế nào để:

- tạo object dễ đọc hơn
- linh hoạt hơn
- tối ưu hiệu năng
- dễ mở rộng trong tương lai
- thiết kế API đẹp hơn

Constructor không đáp ứng tốt tất cả các yêu cầu trên.

---

# 3. Hạn chế của Constructor

## 3.1 Không thể đặt tên

Ví dụ:

```java
new User(true);
```

Nhìn vào code rất khó hiểu.

`true` nghĩa là gì?

- Admin?
- Verified?
- Active?

Constructor không thể diễn tả mục đích của object được tạo.

---

## 3.2 Luôn tạo object mới

```java
new Integer(10);
new Integer(10);
```

Hai object khác nhau sẽ được tạo.

Trong nhiều trường hợp điều này gây lãng phí bộ nhớ.

---

## 3.3 Không thể trả về implementation khác

Giả sử:

```java
interface Animal
```

Có:

```java
Dog
Cat
Bird
```

Constructor không thể làm:

```java
new Animal(...)
```

để quyết định runtime trả về Dog hay Cat.

---

## 3.4 Không thể thay đổi cách khởi tạo object

Hôm nay:

```java
new Connection();
```

Sau này muốn dùng:

- Connection Pool
- Cache
- Proxy

Toàn bộ code phải sửa.

---

## 3.5 Dễ dẫn đến quá nhiều constructor

Ví dụ:

```java
new User()

new User(name)

new User(name, age)

new User(name, age, email)

new User(name, age, email, address)
```

API trở nên khó đọc và khó bảo trì.

---

# 4. Static Factory Method là gì?

Static Factory Method là **một phương thức static dùng để tạo và trả về object thay vì sử dụng constructor trực tiếp.**

Ví dụ:

```java
public class User {

    private User() {}

    public static User of(String name){
        return new User();
    }
}
```

Sử dụng:

```java
User user = User.of("Hoang");
```

---

# 5. Static Factory giải quyết những gì?

## 5.1 Có tên rõ ràng

```java
User.createAdmin();

User.createGuest();

User.createAnonymous();
```

Tên method diễn tả luôn mục đích tạo object.

Code dễ đọc hơn nhiều so với constructor.

---

## 5.2 Có thể tái sử dụng object (Caching)

Ví dụ:

```java
Integer.valueOf(10)
```

Nếu object đã tồn tại trong cache thì Java sẽ trả lại object cũ thay vì tạo object mới.

Giúp:

- giảm số lượng object
- tiết kiệm bộ nhớ
- tăng hiệu năng

---

## 5.3 Có thể trả về subclass

Ví dụ:

```java
Animal animal = Animal.of("dog");
```

Bên trong:

```java
return new Dog();
```

Người dùng không cần biết implementation cụ thể.

API linh hoạt hơn rất nhiều.

---

## 5.4 Có thể thay đổi implementation mà không ảnh hưởng người dùng

Hôm nay:

```java
return new Connection();
```

Mai:

```java
return connectionPool.getConnection();
```

Code phía ngoài vẫn giữ nguyên.

---

## 5.5 Thiết kế API đẹp hơn

Có thể tạo nhiều cách khởi tạo khác nhau:

```java
User.of(...)

User.from(...)

User.copyOf(...)

User.empty()

User.guest()
```

Mỗi method thể hiện rõ ý nghĩa.

---

# 6. Khi nào nên dùng Static Factory?

Nên dùng khi:

- Muốn đặt tên cho quá trình tạo object.
- Muốn cache object.
- Muốn kiểm soát số lượng object được tạo.
- Muốn trả về implementation khác.
- Muốn dễ thay đổi cách khởi tạo trong tương lai.
- Đang thiết kế API hoặc library.

---

# 7. Khi nào constructor vẫn tốt hơn?

Constructor vẫn là lựa chọn hợp lý nếu:

- Class đơn giản.
- Không cần đặt tên.
- Luôn tạo object mới.
- Không cần cache.
- Không cần trả về subclass.

Ví dụ:

```java
Point point = new Point(3, 4);
```

Constructor ở đây ngắn gọn và dễ hiểu.

---

# 8. Ví dụ trong JDK

Rất nhiều API hiện đại của Java sử dụng Static Factory.

```java
List.of(...)

Set.of(...)

Map.of(...)

Optional.of(...)

Optional.empty()

LocalDate.of(...)

LocalDate.now()

Path.of(...)

Integer.valueOf(...)

Boolean.valueOf(...)
```

Đây đều là các Static Factory Method.

---

# 9. Tổng kết

```
                  Java ngày càng lớn
                         │
                         ▼
          Constructor bộc lộ nhiều hạn chế
                         │
                         ▼
      Không đặt tên được phương thức tạo object
      Luôn tạo object mới
      Không trả về subclass
      Khó thay đổi implementation
      Quá nhiều constructor overload
                         │
                         ▼
      Joshua Bloch đề xuất Static Factory Method
                         │
                         ▼
           User.of(...)
           User.from(...)
           User.create(...)
           User.valueOf(...)
                         │
                         ▼
      ✔ Dễ đọc hơn
      ✔ Linh hoạt hơn
      ✔ Tối ưu bộ nhớ
      ✔ Dễ mở rộng
      ✔ Thiết kế API đẹp hơn
```

---

# Ghi nhớ

> Constructor tập trung vào **việc tạo object**.

> Static Factory tập trung vào **việc thiết kế API để tạo object một cách linh hoạt, dễ đọc và dễ mở rộng**.