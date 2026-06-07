---
title: Anotation Transactional 
date: 2026-04-115
tags: [java, spring, security]
description: Kiến thức căn bản, phổ biến về anotation transactional
---
## 1. `@Transactional` sinh ra để làm gì?

Trong các ứng dụng business, một thao tác nghiệp vụ thường gồm **nhiều câu lệnh DB** phải đi cùng nhau:

```text
Chuyển 100k từ A sang B:
  1) UPDATE account SET balance = balance - 100 WHERE id = A
  2) UPDATE account SET balance = balance + 100 WHERE id = B
```

Nếu bước (1) thành công còn (2) lỗi → tiền bị "bốc hơi". Database cần đảm bảo **hoặc cả hai cùng commit, hoặc cả hai cùng rollback**. Đó là khái niệm **transaction** (giao dịch).

Trước Spring, lập trình viên phải tự viết:

```java
Connection conn = dataSource.getConnection();
try {
    conn.setAutoCommit(false);
    // ... business logic ...
    conn.commit();
} catch (Exception e) {
    conn.rollback();
    throw e;
} finally {
    conn.close();
}
```

→ Code lặp lại, lộn xộn, dễ quên rollback/close, khó test, khó truyền connection xuống các tầng.

**`@Transactional` sinh ra để:**

- Khai báo (declarative) thay vì viết tay (imperative). Chỉ cần annotation, Spring lo phần `begin / commit / rollback / close`.
- Tự động truyền (propagate) transaction giữa các method trong cùng một call chain.
- Tách bạch **business logic** khỏi **transaction management**.
- Quản lý transaction nhất quán giữa nhiều resource (JDBC, JPA, JMS...).

---

## 2. Các khái niệm bổ trợ cần nắm

### 2.1. ACID — bản chất của transaction
```
| Thuộc tính            | Ý nghĩa                                                |

| **A**tomicity         | Cả khối thành công hết, hoặc rollback hết.             |
| **C**onsistency       | DB luôn ở trạng thái hợp lệ trước và sau transaction.  |
| **I**solation         | Các transaction chạy song song không "giẫm chân" nhau. |
| **D**urability        | Đã commit thì còn mãi, kể cả khi crash.                |
```
`@Transactional` là cách Spring giúp bạn đạt được A và I (C và D do DB lo).

### 2.2. `PlatformTransactionManager`

Là interface trung tâm của Spring để quản lý transaction. Spring Boot tự cấu hình implementation phù hợp:

- `DataSourceTransactionManager` — JDBC thuần / MyBatis.
- `JpaTransactionManager` — JPA / Hibernate.
- `JtaTransactionManager` — Distributed transaction (2PC, XA).

Khi gặp `@Transactional`, Spring sẽ uỷ thác cho transaction manager hiện hành để begin/commit/rollback.

### 2.3. Propagation — luồng transaction lồng nhau

Khi method A (đã có transaction) gọi method B (cũng `@Transactional`), B sẽ xử thế nào?
```
| Propagation             | Hành vi                                               |

| `REQUIRED` *(mặc định)* | Có sẵn thì join, chưa có thì tạo mới.                 |
| `REQUIRES_NEW`          | Luôn tạo transaction mới, **suspend** transaction cũ. |
| `SUPPORTS`              | Có thì dùng, không có thì chạy non-transactional.     |
| `NOT_SUPPORTED`         | Suspend transaction hiện tại, chạy non-transactional. |
| `MANDATORY`             | Phải có transaction sẵn, không có là ném exception.   |
| `NEVER`                 | Không được có transaction sẵn, có là ném exception.   |
| `NESTED`                | Tạo savepoint trong transaction cha (chỉ JDBC).       |
```
Ví dụ điển hình của `REQUIRES_NEW`: ghi log audit phải commit kể cả khi business rollback.

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void writeAuditLog(AuditEntry entry) { ... }
```

### 2.4. Isolation level — kiểm soát hiện tượng đọc
```
| Isolation             | Dirty read | Non-repeatable read | Phantom read |

| `READ_UNCOMMITTED`    | ✅ có thể | ✅                  | ✅           |
| `READ_COMMITTED`      | ❌        | ✅                  | ✅           |
| `REPEATABLE_READ`     | ❌        | ❌                  | ✅           |
| `SERIALIZABLE`        | ❌        | ❌                  | ❌           |
```
Mặc định tuỳ DB: MySQL/InnoDB = `REPEATABLE_READ`, PostgreSQL/Oracle/SQL Server = `READ_COMMITTED`.

```java
@Transactional(isolation = Isolation.REPEATABLE_READ)
```

Càng cao càng "an toàn" nhưng càng tốn lock → throughput thấp. Chỉ tăng khi thực sự cần.

### 2.5. Rollback rules

Mặc định Spring **chỉ rollback khi gặp `RuntimeException` hoặc `Error`**. `Checked Exception` (như `IOException`, `SQLException` được wrap) **sẽ commit** — đây là một trong những bẫy phổ biến nhất.

```java
@Transactional(rollbackFor = Exception.class)        // rollback cả checked
@Transactional(noRollbackFor = NotFoundException.class) // không rollback dù là RuntimeException
```

### 2.6. `readOnly`, `timeout`

```java
@Transactional(readOnly = true, timeout = 5)
```

- `readOnly = true` — hint cho JPA/Hibernate skip dirty checking, cho DB tối ưu route đến read replica. Dùng cho query.
- `timeout` (giây) — quá thời gian này thì rollback. Phòng câu query "treo".

### 2.7. Spring làm thế nào? — AOP Proxy

`@Transactional` hoạt động qua **proxy pattern** (JDK dynamic proxy hoặc CGLIB):

```text
Caller → [Proxy] → begin tx → realMethod() → commit/rollback → return
```

Hệ quả quan trọng (sẽ nói kỹ ở phần "vệ sinh"):

1. **Self-invocation không có hiệu lực** — gọi method trong cùng class không đi qua proxy.
2. Method phải **public** (mặc định).
3. Phải được bean Spring quản lý (không `new` tay).

---

## 3. Cách dùng cơ bản

```java
@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final InventoryRepository inventoryRepo;

    @Transactional
    public Order placeOrder(OrderRequest req) {
        Order order = orderRepo.save(new Order(req));
        inventoryRepo.decrease(req.getProductId(), req.getQuantity());
        return order;
    }

    @Transactional(readOnly = true)
    public Order findById(Long id) {
        return orderRepo.findById(id).orElseThrow();
    }
}
```

---

## 4. Vệ sinh xung quanh (Best practices & Pitfalls)

### 4.1. Bẫy self-invocation 

```java
@Service
public class UserService {

    public void register(User u) {
        validate(u);
        save(u);              // ❌ Không đi qua proxy → @Transactional bị bỏ qua
    }

    @Transactional
    public void save(User u) { ... }
}
```

**Cách xử lý:**

- Tách `save` sang một service khác và inject vào.
- Hoặc inject chính `UserService` vào nó (self-inject) qua `@Autowired private UserService self;` rồi gọi `self.save(u)`.
- Hoặc đặt `@Transactional` ở method "ngoài cùng" (`register`).

**Khuyến nghị:** Cách thứ ba là sạch nhất trong đa số trường hợp.

### 4.2. Method phải `public`

`@Transactional` trên `private`, `protected`, `package-private` (với JDK proxy) sẽ **không có tác dụng**. Spring Boot 6+ cho phép override nhưng mặc định vẫn là public-only — đừng dựa vào.

### 4.3. Checked exception không rollback

```java
@Transactional
public void doStuff() throws IOException {
    repo.save(...);
    throw new IOException("oops");  // ❌ Commit chứ không rollback
}
```

**Fix:** `@Transactional(rollbackFor = Exception.class)`, hoặc wrap thành `RuntimeException`.

### 4.4. Đừng "nuốt" exception

```java
@Transactional
public void wrong() {
    try {
        repo.save(...);
        externalCall();
    } catch (Exception e) {
        log.error("oops", e);   //  Spring không biết có lỗi → commit
    }
}
```

Nếu đã catch, hãy **rethrow** hoặc gọi `TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();`.

### 4.5. Đặt `@Transactional` đúng tầng

- ✅ **Service layer** — đúng ranh giới của một use case.
- ❌ Controller — gắn transaction vào HTTP request là sai mục đích.
- ❌ Repository — quá hẹp, một use case thường gồm nhiều repo call.

### 4.6. Giữ transaction NGẮN

Transaction càng dài → lock càng lâu → throughput càng tệ → deadlock càng dễ.

```java
@Transactional
public void bad(Order o) {
    repo.save(o);
    paymentGateway.charge(o);   // ❌ HTTP call trong transaction
    emailService.send(o);       // ❌ Idem
}
```

**Nguyên tắc:** Không gọi I/O ngoài DB (HTTP, gửi mail, SMS, Kafka publish blocking...) **bên trong** transaction. Tách thành:

```java
@Transactional
public Order createOrder(OrderRequest req) { ... }   // chỉ DB

// Ngoài transaction
public void process(OrderRequest req) {
    Order o = createOrder(req);
    paymentGateway.charge(o);
    emailService.send(o);
}
```

Với event-driven có thể dùng `@TransactionalEventListener(phase = AFTER_COMMIT)` để publish event chỉ khi commit thành công.

### 4.7. Dùng `readOnly = true` cho query

Cho phép Hibernate skip dirty checking, một số driver/DB có thể route tới replica → cải thiện hiệu năng đáng kể.

```java
@Transactional(readOnly = true)
public List<Order> search(...) { ... }
```

### 4.8. `LazyInitializationException` & ranh giới session

JPA `LAZY` association chỉ load được khi session/transaction còn mở. Truy cập sau khi method `@Transactional` đã return → `LazyInitializationException`.

**Cách xử lý (theo thứ tự ưu tiên):**

1. Fetch đúng dữ liệu cần trong query (`JOIN FETCH`, `@EntityGraph`).
2. Map sang DTO bên trong transaction.
3. (Tránh) `OSIV` — Open Session In View — tiện nhưng kéo dài session đến hết HTTP response, dễ gây N+1 và transaction "ma".

### 4.9. Tránh N+1 trong transaction dài

Vì transaction mở, lazy load mỗi entity → mỗi vòng lặp một query. Quét code bằng SQL log / `p6spy` / `datasource-proxy` để phát hiện sớm.

### 4.10. Đừng lồng `@Transactional` mà không hiểu propagation

Mặc định `REQUIRED` → method trong tham gia transaction ngoài. Nếu inner rollback-only, outer dù catch exception cũng sẽ ném `UnexpectedRollbackException` khi commit. Khi cần "lỗi inner không kéo theo outer", dùng `REQUIRES_NEW`.

### 4.11. Đừng quên cấu hình transaction cho test

Khi viết integration test với `@SpringBootTest` + `@Transactional`, mỗi test sẽ **rollback** sau khi chạy → tốt cho isolation, nhưng cẩn thận khi test code có `@Async`, `REQUIRES_NEW`, hoặc native query — chúng có thể không thấy data của transaction test.

### 4.12. `@Async` + `@Transactional` không "kế thừa"

Method `@Async` chạy trên thread khác → **không có transaction context** của caller. Nếu method async cần transaction, phải tự annotate `@Transactional` trên nó.

### 4.13. Distributed transaction — cân nhắc kỹ

`@Transactional` chỉ giải quyết transaction trong **một** resource (hoặc XA nếu cấu hình JTA, nhưng nặng nề). Với microservices, thay vì 2PC hãy nghĩ tới:

- **Saga pattern** (orchestration/choreography).
- **Outbox pattern** + CDC (Debezium...).
- Đảm bảo idempotency ở mỗi service.

---

## 5. Checklist nhanh trước khi merge code

- [ ] Method `@Transactional` đặt ở **service layer**, là `public`.
- [ ] Không có **self-invocation** vô hiệu hoá annotation.
- [ ] Không gọi **I/O ngoài** (HTTP, mail, SMS...) bên trong transaction.
- [ ] Read-only query đã gắn `readOnly = true`.
- [ ] Đã cân nhắc `rollbackFor = Exception.class` nếu code có checked exception.
- [ ] Không **catch và nuốt** exception khiến transaction commit nhầm.
- [ ] Không truy cập lazy association sau khi transaction đóng.
- [ ] Hiểu rõ **propagation** nếu method gọi method khác cũng `@Transactional`.
- [ ] Có timeout cho transaction có khả năng "treo".
- [ ] Method `@Async` cần transaction riêng đã được annotate lại.

---

## 6. TL;DR

`@Transactional` = "declarative way" để gói một khối code thành **một** giao dịch DB, dựa trên **AOP proxy**. Hiểu **propagation, isolation, rollback rules** là đủ cho 80% trường hợp. 20% còn lại là tránh các bẫy: self-invocation, checked exception, transaction quá dài, lazy loading sau khi đóng, và lồng transaction sai propagation. Khi đụng tới nhiều service/DB → chuyển sang **Saga** thay vì cố ép distributed transaction.
