---
title: Enums nâng cao, annotations, reflection intro
date: 2026-05-18
tags: [java,spring,enum,anotation,reflection]
description: Tổng quan về enum,anotation,reflection
---
## 1. Enum
### Tại sao sinh ra?
Khi một biến chỉ được phép nhận một tập giá trị hữu hạn, cố định.

**Không tốt:**
```java
String status = "ACTIVE";
status = "ACTVE"; // typo vẫn compile
status = "hello"; // vẫn compile
Dùng Enum:

java
enum UserStatus {
    ACTIVE,
    INACTIVE,
    BANNED
}

UserStatus status = UserStatus.ACTIVE;
Bản chất
Enum là một type riêng, mỗi constant là một instance của Enum.

Enum có thể chứa:

Field

Constructor

Method

Behavior

java
enum UserStatus {
    ACTIVE("Đang hoạt động"),
    BANNED("Bị khóa");

    private final String description;

    UserStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
Enum nâng cao: behavior theo trạng thái
java
enum OrderStatus {
    PENDING {
        public boolean canCancel() { return true; }
    },
    DELIVERED {
        public boolean canCancel() { return false; }
    };

    public abstract boolean canCancel();
}
Khi nào dùng?
Nên dùng khi tập giá trị hữu hạn và tương đối cố định:

UserStatus

OrderStatus

PaymentStatus

Direction

DayOfWeek

Không nên dùng Enum cho dữ liệu thay đổi thường xuyên từ database, ví dụ Category.

2. Annotation
Tại sao sinh ra?
Để gắn metadata (thông tin mô tả) trực tiếp vào code.

Ví dụ:

java
@Service
class UserService {}
@Service nói cho framework biết: Class này là một Spring Service.

Các ví dụ khác:

@Override

@Transactional

@Entity

@GetMapping("/users")

Annotation tự nó không làm gì
Annotation chủ yếu là metadata.

java
@Service
class UserService {}
@Service không tự tạo object. Framework như Spring phải đọc annotation và xử lý nó.

Annotation tự tạo
java
@interface Role {
    String value();
}
Dùng:

java
@Role("ADMIN")
class UserController {}
Annotation có thể đặt trên:
Class / Type

Method

Field

Parameter

Constructor

...

@Retention
Quy định annotation tồn tại đến khi nào:

java
@Retention(RetentionPolicy.RUNTIME)
Các mức chính:

SOURCE → chỉ trong source code

CLASS → được lưu trong .class

RUNTIME → có thể đọc lúc chương trình chạy

Spring thường cần RUNTIME vì phải đọc annotation bằng Reflection lúc runtime.

@Target
Quy định annotation được đặt ở đâu:

java
@Target(ElementType.METHOD)
→ Chỉ dùng cho method.

Một số target:

TYPE

METHOD

FIELD

PARAMETER

CONSTRUCTOR

3. Reflection
Tại sao sinh ra?
Thông thường compiler biết trước class và method:

java
User user = new User();
user.getName();
Nhưng framework cần khả năng: Khám phá và thao tác với class/object mà không cần biết trước mọi thứ tại compile time. Đó là Reflection.

Reflection có thể làm gì?
Từ:

java
Class<?> clazz = User.class;
Có thể lấy:

java
clazz.getDeclaredMethods();       // methods
clazz.getDeclaredFields();        // fields
clazz.getDeclaredConstructors();  // constructors
clazz.getSuperclass();            // class cha
clazz.getInterfaces();            // interfaces
Kiểm tra annotation:

java
clazz.isAnnotationPresent(Service.class);
Tạo object:

java
Object obj = clazz.getDeclaredConstructor().newInstance();
4. Annotation + Reflection
Đây là phần quan trọng nhất khi học Spring.

Ví dụ:

java
@Service
class UserService {}
Spring có thể dùng Reflection để:

text
Scan class
   ↓
Phát hiện @Service
   ↓
Biết đây là Spring Bean
   ↓
Tạo object
   ↓
Đưa object vào IoC Container
Tương tự:

java
@Autowired
private UserService userService;
Spring đọc:

Field: userService

Type: UserService

Annotation: @Autowired

Sau đó tìm UserService trong Container và inject vào.

5. Reflection + Annotation + Spring
Ví dụ:

java
@Service
public class UserService {

    @Transactional
    public void createUser() {
        ...
    }
}
Tư duy bên dưới:

text
@Service
    ↓
Metadata
    ↓
Reflection đọc
    ↓
Spring đăng ký Bean

@Transactional
    ↓
Metadata
    ↓
Spring đọc bằng Reflection
    ↓
Proxy/AOP bao quanh method
    ↓
BEGIN TRANSACTION
    ↓
createUser()
    ↓
COMMIT / ROLLBACK
6. Tại sao Spring dùng các thứ này?
Spring muốn em khai báo ý định thay vì tự viết toàn bộ infrastructure.

Thay vì:

java
beginTransaction();
try {
    createUser();
    commit();
} catch (Exception e) {
    rollback();
}
Chỉ cần:

java
@Transactional
public void createUser() {
    ...
}
Đây là tư tưởng declarative programming: Mô tả "muốn gì", framework lo "làm thế nào".

7. Hạn chế của Reflection
Reflection rất mạnh nhưng không nên lạm dụng:

Có overhead runtime

Ít type-safe hơn code trực tiếp

Lỗi có thể chỉ xuất hiện lúc runtime

Khó refactor/debug hơn

Có thể phá encapsulation

Reflection chủ yếu hữu ích cho framework, infrastructure và các trường hợp dynamic.

8. Cần nhớ gì?
Khái niệm	Bản chất	Mục đích
enum	Một type có tập giá trị hữu hạn	Type safety + mô hình hóa trạng thái
annotation	Metadata gắn vào code	Mô tả code cho compiler/framework/tool
reflection	Khám phá/thao tác code lúc runtime	Đọc class, method, field, annotation...
Mental Model
text
Enum
→ Tạo tập giá trị có type riêng

Annotation
→ Gắn metadata vào code

Reflection
→ Đọc metadata/code lúc runtime

Spring
→ Dùng Reflection + Annotation + Proxy + Container
→ Tự động hóa DI, Bean management, AOP, Transaction...
Một câu để nhớ
Enum = dữ liệu có tập giá trị cố định.
Annotation = metadata mô tả code.
Reflection = cơ chế đọc/thao tác code lúc runtime.
Spring = framework tận dụng chúng để tự động hóa.