---
title: IoC
date: 2026-05-13
tags: [java,IoC,spring]
description: Một số các cái khái niệm cơ bản xoay quanh IoC
---
# Inversion of Control (IoC) trong Spring Framework

---

## 1. Bài toán xuất phát — Tại sao IoC ra đời?

### Vấn đề của lập trình truyền thống

Trong lập trình hướng đối tượng truyền thống, một class thường **tự tạo ra** các dependency của mình:

```java
public class OrderService {
    private PaymentService paymentService;
    private EmailService emailService;

    public OrderService() {
        this.paymentService = new PaymentService();   // tự khởi tạo
        this.emailService = new EmailService();       // tự khởi tạo
    }

    public void placeOrder(Order order) {
        paymentService.charge(order);
        emailService.sendConfirmation(order);
    }
}
```

Cách viết này thoạt nhìn đơn giản nhưng gây ra hàng loạt vấn đề nghiêm trọng:
```
| Vấn đề                          | Mô tả                                                                         | 

| **Tight Coupling**              | `OrderService` bị gắn chặt vào `PaymentService` và `EmailService` cụ thể.     |
| **Khó test**                    | Không thể thay thế dependency bằng mock/stub khi viết unit test               |
| **Khó mở rộng**                 | Thêm hay thay đổi dependency buộc phải sửa class đang dùng nó                 |
| **Vi phạm OCP**                 | Class phải thay đổi khi dependency thay đổi, vi phạm Open/Closed Principle    |
| **Quản lý vòng đời phức tạp**   | Phải tự quản lý việc tạo, dùng, hủy object —  memory leak or  không nhất quán |
```
### Câu hỏi cốt lõi

> *"Ai nên chịu trách nhiệm tạo ra và quản lý các dependency?"*

Câu trả lời của IoC: **Không phải chính class đó — mà là một entity bên ngoài.**

---

## 2. IoC là gì?

**Inversion of Control (Đảo ngược điều khiển)** là một nguyên lý thiết kế phần mềm, trong đó **luồng điều khiển của chương trình bị đảo ngược** so với lập trình truyền thống.

### So sánh trực quan

```
Truyền thống:
  [OrderService] → tự new PaymentService() → tự điều khiển dependency

IoC:
  [IoC Container] → tạo và inject PaymentService vào OrderService → Container điều khiển
```

Nói cách khác:

- **Trước IoC**: Class A gọi Class B → A kiểm soát B
- **Sau IoC**: Framework/Container tạo A và B, rồi đưa B vào A → Framework kiểm soát cả hai

IoC là một **nguyên lý** (principle), không phải một kỹ thuật cụ thể. Dependency Injection (DI) là cách phổ biến nhất để hiện thực hóa IoC.

---

## 3. IoC Container trong Spring

Spring hiện thực IoC thông qua **IoC Container** — một engine trung tâm chịu trách nhiệm:

1. **Đọc cấu hình** (XML, annotation, Java config)
2. **Khởi tạo** (instantiate) các bean
3. **Cấu hình** (configure) các bean
4. **Quản lý vòng đời** (lifecycle) của bean
5. **Inject dependency** vào đúng chỗ

Spring cung cấp hai interface chính để tương tác với container:

### 3.1. BeanFactory

Interface cơ bản nhất, cung cấp khả năng quản lý và inject bean theo kiểu lazy loading.

```java
BeanFactory factory = new XmlBeanFactory(new ClassPathResource("beans.xml"));
OrderService orderService = (OrderService) factory.getBean("orderService");
```

### 3.2. ApplicationContext *(khuyến nghị dùng)*

Mở rộng `BeanFactory`, thêm nhiều tính năng enterprise:

- Internationalization (i18n)
- Event publication
- AOP integration
- Web support

```java
ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
OrderService orderService = context.getBean(OrderService.class);
```

---

## 4. Dependency Injection (DI) — Hiện thực hóa IoC

DI là cơ chế cụ thể Spring dùng để thực hiện IoC. Có **3 hình thức** chính:

### 4.1. Constructor Injection *(khuyến nghị)*

```java
@Service
public class OrderService {
    private final PaymentService paymentService;
    private final EmailService emailService;

    // Spring tự inject qua constructor
    @Autowired  // có thể bỏ nếu chỉ có 1 constructor (Spring 4.3+)
    public OrderService(PaymentService paymentService, EmailService emailService) {
        this.paymentService = paymentService;
        this.emailService = emailService;
    }
}
```
- dependency được truyền vào lúc object được tạo, object chưa tồn tại nếu chưa có đủ dependency.
**Ưu điểm:**
- Dependency là `final` → bất biến, thread-safe
- Rõ ràng: nhìn vào constructor biết ngay class cần gì
- Dễ unit test (không cần Spring, chỉ cần new)
- Phát hiện circular dependency sớm (tại startup)
-  `Tính bất biến (Immutability)` Constructor cho phép dùng final — field không thể bị thay đổi sau khi tạo. Setter thì không thể dùng final, nghĩa là ai đó có thể gọi setPaymentService(null) bất kỳ lúc nào.
- Với constructor, nếu thiếu dependency thì ứng dụng không khởi động được — lỗi lộ ra ngay. Với setter, object tạo ra thành công, nhưng đến lúc gọi method mới crash NullPointerException — lỗi âm thầm.
- Đây là điểm setter "có lợi thế" kỹ thuật — Spring có thể handle circular dependency với setter vì nó tạo object trước, inject sau. Constructor sẽ throw exception ngay khi startup.
Tuy nhiên, circular dependency bản thân nó là code smell — cần refactor, không nên dùng setter để "né" lỗi này.
- `Code smell` là những dấu hiệu trong code cho thấy có thể đang tồn tại một vấn đề thiết kế — không hẳn là bug, code vẫn chạy được, nhưng nó báo hiệu rằng code đang khó đọc, khó bảo trì, hoặc dễ sinh lỗi về sau.
### 4.2. Setter Injection

```java
@Service
public class OrderService {
    private PaymentService paymentService;

    @Autowired
    public void setPaymentService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```
-  object được tạo ra trước, sau đó Spring mới gọi setter để nhét dependency vào sau.
**Dùng khi:** dependency là tùy chọn (optional), hoặc cần thay đổi sau khi khởi tạo.

### 4.3. Field Injection *(không khuyến nghị)*

```java
@Service
public class OrderService {
    @Autowired
    private PaymentService paymentService;  // inject trực tiếp vào field
}
```

**Nhược điểm:**
- Không thể dùng `final`
- Khó test (phải dùng reflection)
- Che giấu dependency → vi phạm Single Responsibility
- Spring team **không khuyến nghị** dùng trong production code

---

## 5. Bean — Đơn vị cơ bản của IoC Container

**Bean** là một object được Spring IoC Container quản lý. Mọi thứ trong Spring đều xoay quanh bean.

### 5.1. Định nghĩa Bean

**Cách 1: Annotation (phổ biến nhất)**

```java
@Component (không có gì cả)         // generic
@Service (tác dụng chính là làm code dễ đọc và rõ kiến trúc hơn.)          // business logic layer
@Repository ( Spring tự động bắt các exception liên quan đến database (SQLException, Hibernate exception...) vàconvert thành DataAccessException của Spring.)        // data access layer
@Controller (Kết hợp với Spring MVC, các method bên trong có thể dùng @RequestMapping, trả về tên view (HTMLtemplate).)        // web layer
@RestController (Chính là @Controller + @ResponseBody. Mọi method tự động serialize return value thành JSON/XML,không cần ghi @ResponseBody từng method.)     // REST API
```

**Cách 2: Java Config**

```java
@Configuration
public class AppConfig {

    @Bean
    public PaymentService paymentService() {
        return new StripePaymentService(apiKey());
    }

    @Bean
    public OrderService orderService() {
        return new OrderService(paymentService());  // Spring hiểu và tránh tạo mới
    }
}
```

**Cách 3: XML (legacy)**

```xml
<bean id="paymentService" class="com.example.StripePaymentService"/>
<bean id="orderService" class="com.example.OrderService">
    <constructor-arg ref="paymentService"/>
</bean>
```

### 5.2. Bean Scope — Vòng đời của Bean
```
| Scope                      | Mô tả                                       | Dùng khi                      |

| **singleton** *(mặc định)* | Một instance duy nhất trong toàn container  | Stateless service, repository |
| **prototype**              | Tạo instance mới mỗi lần request            | Stateful object               |
| **request**                | Một instance per HTTP request               | Web: dữ liệu request-specific |
| **session**                | Một instance per HTTP session               | Web: dữ liệu user session     |
| **application**            | Một instance per ServletContext             | Web: dữ liệu toàn app         |
| **websocket**              | Một instance per WebSocket session          | WebSocket                     |
``` 
```java
@Component
@Scope("prototype")
public class ShoppingCart {
    private List<Item> items = new ArrayList<>();
    // Mỗi user cần cart riêng → prototype
}
```

---

## 6. Các khái niệm liên quan và mở rộng

### 6.1. @Autowired và quá trình Resolution

Spring tìm bean theo thứ tự:
1. **By Type** (mặc định): tìm bean có type phù hợp
2. **By Qualifier**: nếu có nhiều bean cùng type, dùng `@Qualifier` để chỉ định
3. **By Name**: tên biến trùng với tên bean

```java
// Có 2 implementation của PaymentService
@Component("stripePayment")
public class StripePaymentService implements PaymentService {}

@Component("paypalPayment")
public class PaypalPaymentService implements PaymentService {}

// Inject với @Qualifier
@Autowired
@Qualifier("stripePayment")
private PaymentService paymentService;
```

### 6.2. @Primary

Đánh dấu bean "ưu tiên" khi có nhiều bean cùng type mà không dùng `@Qualifier`:

```java
@Component
@Primary  // được chọn mặc định
public class StripePaymentService implements PaymentService {}
```

### 6.3. Circular Dependency

Xảy ra khi A phụ thuộc B và B phụ thuộc A:

```java
@Service
public class ServiceA {
    @Autowired ServiceB serviceB;  // A cần B
}

@Service
public class ServiceB {
    @Autowired ServiceA serviceA;  // B cần A → CIRCULAR!
}
```

**Kết quả với Constructor Injection:** Spring throw `BeanCurrentlyInCreationException` ngay khi startup → phát hiện sớm.

**Giải pháp:**
- Refactor để phá vỡ vòng tròn (tốt nhất)
- Dùng `@Lazy` để delay việc inject
- Dùng Setter Injection (Spring có thể handle được nhưng vẫn là code smell)

### 6.4. Bean Lifecycle

```
Instantiate → Populate Properties → BeanNameAware → BeanFactoryAware
    → ApplicationContextAware → @PostConstruct → afterPropertiesSet()
    → Custom init-method
    → [Bean sẵn sàng sử dụng]
    → @PreDestroy → destroy() → Custom destroy-method
```

```java
@Component
public class DatabasePool {

    @PostConstruct
    public void init() {
        // Khởi tạo connection pool sau khi bean được tạo
        System.out.println("Pool initialized");
    }

    @PreDestroy
    public void cleanup() {
        // Đóng kết nối trước khi container shutdown
        System.out.println("Pool destroyed");
    }
}
```

---

## 7. IoC và các nguyên lý SOLID

IoC không tự nhiên xuất hiện — nó là kết quả của việc áp dụng nghiêm túc các nguyên lý thiết kế:

| Nguyên lý                     |                                    Liên hệ với IoC               |  

| **D** — Dependency Inversion  | Depend on abstraction (interface), not concretion.               |
| **O** — Open/Closed           | Class mở để mở rộng (swap implementation), đóng để sửa đổi       |
| **S** — Single Responsibility | Class chỉ làm việc của mình, không lo tạo dependency             |
| **L** — Liskov Substitution   | Inject interface → có thể thay thế implementation bất kỳ lúc nào |

---

## 8. Lợi ích thực tiễn

### Unit Testing dễ dàng

```java
// Không cần Spring, test thuần Java
class OrderServiceTest {

    @Test
    void shouldChargePayment() {
        // Arrange
        PaymentService mockPayment = mock(PaymentService.class);
        EmailService mockEmail = mock(EmailService.class);
        OrderService service = new OrderService(mockPayment, mockEmail);  // inject mock

        // Act
        service.placeOrder(new Order());

        // Assert
        verify(mockPayment).charge(any(Order.class));
    }
}
```

### Dễ thay đổi implementation

```java
// Đổi từ Stripe sang PayPal chỉ cần đổi config, không sửa OrderService
@Configuration
public class PaymentConfig {

    @Bean
    public PaymentService paymentService() {
        if (usePayPal) {
            return new PaypalPaymentService();
        }
        return new StripePaymentService();
    }
}
```

---

## 9. Tổng kết

```
Bài toán gốc
    └── Class tự tạo dependency → Tight coupling, khó test, khó mở rộng
            │
            ▼
Nguyên lý giải quyết: Inversion of Control
    └── Đảo ngược: không tự tạo, để bên ngoài inject vào
            │
            ▼
Cơ chế thực hiện: Dependency Injection
    ├── Constructor Injection (khuyến nghị)
    ├── Setter Injection
    └── Field Injection (không khuyến nghị)
            │
            ▼
Hạ tầng thực thi: Spring IoC Container
    ├── ApplicationContext
    ├── Bean management (scope, lifecycle)
    └── Auto-wiring (@Autowired, @Qualifier, @Primary)
            │
            ▼
Kết quả
    ├── Loose coupling
    ├── Dễ test
    ├── Dễ mở rộng
    └── Tuân thủ SOLID
```

> **IoC không phải magic** — đó là một nguyên lý thiết kế để code **loose coupling**, và Spring IoC Container chỉ đơn giản là một framework giúp bạn áp dụng nguyên lý đó ở quy mô lớn, một cách nhất quán và hiệu quả.