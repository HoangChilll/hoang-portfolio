---
title: JPA và vấn đề xoay quanh nó
date: 2026-05-20
tags: [spring, java,jpa]
description: khái niệm các vấn đề xoay quanh jpa cơ bản 
---
# JPA trong Spring — Toàn tập

---

## 1. JPA là gì?

- **JPA (Java Persistence API)** là một **đặc tả (specification)** của Java EE/Jakarta EE, định nghĩa cách ánh xạ các đối tượng Java (POJO) sang các bảng trong cơ sở dữ liệu quan hệ — kỹ thuật này gọi là **ORM (Object-Relational Mapping)**.

> JPA **không phải là một thư viện cụ thể**, mà là một tập hợp các interface và annotation. Các implementation phổ biến của JPA gồm:
> - **Hibernate** (phổ biến nhất, mặc định trong Spring Boot)
> - EclipseLink
> - OpenJPA

---

## 2. JPA ra đời để giải quyết bài toán gì?

### Vấn đề trước khi có JPA

Trước khi JPA xuất hiện, developer phải làm việc với database thông qua **JDBC thuần**:

```java
// Ví dụ JDBC thuần — verbose, dễ lỗi, khó maintain
Connection conn = DriverManager.getConnection(url, user, pass);
PreparedStatement ps = conn.prepareStatement(
    "SELECT * FROM users WHERE id = ?"
);
ps.setInt(1, userId);
ResultSet rs = ps.executeQuery();

User user = new User();
if (rs.next()) {
    user.setId(rs.getInt("id"));
    user.setName(rs.getString("name"));
    user.setEmail(rs.getString("email"));
}
```

**Những vấn đề của JDBC thuần:**
```
| Vấn đề                                | Mô tả                                                            |

| Boilerplate code                      | Mỗi câu query phải viết lặp đi lặp lại: mở connection,
                                          xử lý ResultSet, đóng connection                                 |
| Object-Relational Impedance Mismatch  | Java dùng object/class, DB dùng table/row — không tự ánh xạ được |
| SQL phụ thuộc DB                      | Câu SQL viết cho MySQL có thể không chạy trên PostgreSQL         |
| Quản lý transaction thủ công          | Dễ quên commit/rollback, dễ gây lỗi nghiêm trọng                 | 
| Không có caching                      | Mỗi lần query là một lần gọi DB                                  |
| Khó test                              | Business logic bị trộn lẫn với SQL                               |
```
### JPA giải quyết như thế nào?

```java
// Với JPA — gọn gàng, không SQL
User user = entityManager.find(User.class, userId);
```

JPA cung cấp:
-  **Ánh xạ tự động** giữa Java object ↔ DB table
-  **JPQL** — query language hướng object, độc lập với DB
-  **Quản lý lifecycle** của entity (persist, merge, remove, detach)
-  **Transaction management** tích hợp
-  **Caching** (L1 mặc định, L2 tuỳ cấu hình)
-  **Lazy loading** — chỉ load dữ liệu khi cần

---

## 3. Spring Data JPA là gì?

**Spring Data JPA** là một layer nằm **trên JPA**, do Spring cung cấp, giúp giảm thiểu thêm boilerplate code khi làm việc với JPA.
- **Boilerplate** là những đoạn code lặp đi lặp lại, dài dòng, không chứa logic nghiệp vụ gì đặc biệt — nhưng bắt buộc phải viết để mọi thứ hoạt động.
```
Ứng dụng của bạn
      ↓
Spring Data JPA   ← giảm boilerplate, tự sinh query
      ↓
JPA (Specification)
      ↓
Hibernate (Implementation)
      ↓
JDBC
      ↓
Database
```

---

## 4. Cài đặt

### Maven (`pom.xml`)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Driver database, ví dụ MySQL -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

### Cấu hình `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=secret
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```
```
| Giá trị `ddl-auto`                              | Mô tả                                |

| `none`                                          | Không làm gì                         |
| `validate`                                      | Kiểm tra schema nhưng không thay đổi |
| `update`                                        | Tự động cập nhật schema (dùng dev)   |
| `create`                                        | Xoá và tạo lại mỗi lần khởi động     |
| `create-drop`                                   | Tạo khi start, xoá khi stop          |

>  **Production**: chỉ dùng `none` hoặc `validate`. Dùng Flyway/Liquibase để quản lý migration.
```
---

## 5. Entity — Trái tim của JPA

### Khai báo Entity cơ bản

```java
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    // Getters & Setters
}
```

### Các annotation phổ biến
```
| Annotation                                 |  Mục đích                                                         
| `@Entity`                                  | Đánh dấu class là một JPA entity                     |
| `@Table`                                   | Chỉ định tên bảng, index, unique constraint          |
| `@Id`                                      | Khai báo primary key                                 |
| `@GeneratedValue`                          | Chiến lược sinh ID (IDENTITY, SEQUENCE, AUTO, TABLE) |
| `@Column`                                  | Tuỳ chỉnh tên cột, kiểu dữ liệu, nullable...         |
| `@Transient`                               | Trường không được lưu xuống DB                       |
| `@Enumerated`                              | Lưu enum dưới dạng STRING hoặc ORDINAL               |
| `@Lob`                                     | Lưu dữ liệu lớn (TEXT, BLOB)                         |
| `@CreatedDate` / `@LastModifiedDate`       | Tự động ghi timestamp (cần `@EnableJpaAuditing`)     |
```
---

## 6. Quan hệ giữa các Entity

### @OneToOne

```java
@Entity
public class UserProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String bio;
    private String avatarUrl;
}
```

### @OneToMany / @ManyToOne

```java
// Phía "một" (Order)
@Entity
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();
}

// Phía "nhiều" (OrderItem)
@Entity
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    private String productName;
    private int quantity;
}
```

### @ManyToMany

```java
@Entity
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}

@Entity
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

---

## 7. Repository — Spring Data JPA

### JpaRepository

```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    // CRUD có sẵn: save, findById, findAll, deleteById...
}
```

**Các method có sẵn từ `JpaRepository`:**

```java
userRepository.save(user);              // INSERT hoặc UPDATE
userRepository.findById(1L);            // SELECT WHERE id = 1
userRepository.findAll();               // SELECT *
userRepository.findAll(PageRequest.of(0, 10)); // Phân trang
userRepository.deleteById(1L);          // DELETE
userRepository.count();                 // COUNT(*)
userRepository.existsById(1L);          // EXISTS
```

### Derived Query Methods (tự sinh query theo tên method)

```java
public interface UserRepository extends JpaRepository<User, Long> {

    // SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // SELECT * FROM users WHERE full_name LIKE %?%
    List<User> findByFullNameContaining(String keyword);

    // SELECT * FROM users WHERE age > ? ORDER BY full_name ASC
    List<User> findByAgeGreaterThanOrderByFullNameAsc(int age);

    // SELECT * FROM users WHERE email = ? AND active = ?
    Optional<User> findByEmailAndActive(String email, boolean active);

    // SELECT COUNT(*) FROM users WHERE active = ?
    long countByActive(boolean active);

    // DELETE FROM users WHERE active = false
    void deleteByActiveFalse();
}
```

### @Query — Viết JPQL hoặc Native SQL

```java
public interface UserRepository extends JpaRepository<User, Long> {

    // JPQL — query theo class/field, không phải tên bảng/cột
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.active = true")
    Optional<User> findActiveByEmail(@Param("email") String email);

    // Native SQL
    @Query(value = "SELECT * FROM users WHERE YEAR(created_at) = :year",
           nativeQuery = true)
    List<User> findUsersCreatedInYear(@Param("year") int year);

    // Update/Delete với @Modifying
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.active = false WHERE u.lastLogin < :date")
    int deactivateInactiveUsers(@Param("date") LocalDateTime date);
}
```

---

## 8. Transaction Management

### @Transactional

```java
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Transactional  // Đảm bảo cả 2 thao tác là atomic
    public Order createOrder(OrderRequest request) {
        // Nếu bất kỳ bước nào fail -> rollback toàn bộ
        Order order = orderRepository.save(new Order(request));
        inventoryRepository.decreaseStock(request.getProductId(), request.getQuantity());
        return order;
    }

    @Transactional(readOnly = true)  // Tối ưu cho read-only operation
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional(rollbackFor = Exception.class)
    public void riskyOperation() throws Exception {
        // rollback kể cả checked exception
    }
}
```

### Propagation — Cách transaction lan truyền

```java
// REQUIRED (mặc định): dùng transaction hiện tại, tạo mới nếu chưa có
@Transactional(propagation = Propagation.REQUIRED)

// REQUIRES_NEW: luôn tạo transaction mới, suspend transaction cũ
@Transactional(propagation = Propagation.REQUIRES_NEW)

// SUPPORTS: dùng transaction nếu có, không tạo mới
@Transactional(propagation = Propagation.SUPPORTS)

// NOT_SUPPORTED: suspend transaction nếu có, chạy không có transaction
@Transactional(propagation = Propagation.NOT_SUPPORTED)

// NEVER: throw exception nếu đang có transaction
@Transactional(propagation = Propagation.NEVER)

// NESTED: tạo savepoint trong transaction hiện tại
@Transactional(propagation = Propagation.NESTED)
```

---

## 9. Fetch Type — LAZY vs EAGER

```java
// LAZY (khuyến nghị): chỉ load khi truy cập
@OneToMany(fetch = FetchType.LAZY)
private List<OrderItem> items;

// EAGER: load ngay cùng entity cha
@ManyToOne(fetch = FetchType.EAGER)
private User user;
```

**Nguyên tắc:**
- `@OneToMany`, `@ManyToMany` → mặc định **LAZY** 
- `@ManyToOne`, `@OneToOne` → mặc định **EAGER** (nên đổi sang LAZY)

---

## 10. Các vấn đề thường gặp

### N+1 Problem

**Vấn đề:** Load 1 danh sách rồi loop để lấy quan hệ → sinh N query thêm.

```java
// ❌ Gây N+1: 1 query lấy orders + N query lấy user của mỗi order
List<Order> orders = orderRepository.findAll();
orders.forEach(o -> System.out.println(o.getUser().getName())); // N query!
```

**Giải pháp — JOIN FETCH:**

```java
// ✅ Chỉ 1 query duy nhất
@Query("SELECT o FROM Order o JOIN FETCH o.user")
List<Order> findAllWithUser();
```

**Giải pháp — @EntityGraph:**

```java
@EntityGraph(attributePaths = {"user", "items"})
List<Order> findByStatus(String status);
```

---

### LazyInitializationException

**Vấn đề:** Truy cập lazy association sau khi session đã đóng.

```java
//  Session đóng sau khi ra khỏi @Transactional
@Transactional
public Order getOrder(Long id) {
    return orderRepository.findById(id).orElseThrow();
}

// Ở controller: order.getItems() -> LazyInitializationException!
```

**Giải pháp:**
1. Dùng `JOIN FETCH` / `@EntityGraph` để load sẵn
2. Dùng DTO để chỉ lấy data cần thiết
3. Mở `spring.jpa.open-in-view=true` (không khuyến nghị cho production)

---

### Vấn đề với @ManyToMany và CascadeType.ALL

```java
//  Nguy hiểm: xoá Student sẽ xoá luôn Course!
@ManyToMany(cascade = CascadeType.ALL)
private Set<Course> courses;

//  Chỉ cascade PERSIST và MERGE
@ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
private Set<Course> courses;
```

---

### Optimistic Locking — Tránh xung đột concurrent update

```java
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int stock;

    @Version  // JPA tự quản lý version, throw OptimisticLockException nếu conflict
    private Long version;
}
```

---

## 11. Auditing — Tự động ghi timestamp và người tạo

```java
// Bật Auditing
@SpringBootApplication
@EnableJpaAuditing
public class Application { ... }

// Base class dùng chung
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(updatable = false)
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;
}

// Entity kế thừa
@Entity
public class User extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // ...
}
```

---

## 12. Phân trang và Sắp xếp

```java
// Controller
@GetMapping("/users")
public Page<User> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "id") String sortBy
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
    return userRepository.findAll(pageable);
}
```

---

## 13. Projection — Chỉ SELECT các field cần thiết

```java
// Interface Projection
public interface UserSummary {
    String getFullName();
    String getEmail();
}

// Repository
List<UserSummary> findByActive(boolean active);

// DTO Projection với @Query
@Query("SELECT new com.example.dto.UserDto(u.id, u.fullName, u.email) FROM User u")
List<UserDto> findAllAsDto();
```

---

## 14. Best Practices tổng hợp

| # | Nguyên tắc                                                                 |

| 1 | Luôn dùng `FetchType.LAZY` cho `@OneToMany` và `@ManyToMany`               |
| 2 | Dùng DTO thay vì trả trực tiếp Entity ra ngoài API                         |
| 3 | Tránh `CascadeType.ALL` cho `@ManyToMany`                                  |
| 4 | Dùng `@Transactional(readOnly = true)` cho các query đọc                   |
| 5 | Dùng `JOIN FETCH` hoặc `@EntityGraph` để giải quyết N+1                    |
| 6 | Không bao giờ dùng `ddl-auto=create/create-drop` ở production              |
| 7 | Dùng `@Version` cho các entity có thể bị concurrent update                 |
| 8 | Bật `show-sql=true` + `format_sql=true` khi debug                          |
| 9 | Dùng Flyway hoặc Liquibase để quản lý schema migration                     |
| 10| Override `equals()` và `hashCode()` dựa trên business key, không phải `id` |

---

## 15. Tóm tắt flow hoàn chỉnh

```
Request → Controller
              ↓
           Service (@Transactional)
              ↓
          Repository (Spring Data JPA)
              ↓
           Hibernate (JPA Implementation)
              ↓
            JDBC
              ↓
           Database
```

```java
// Entity
@Entity
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double price;
    @Version
    private Long version;
    // getters/setters
}

// Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);
    Page<Product> findByPriceLessThan(double price, Pageable pageable);
}

// Service
@Service
@Transactional
public class ProductService {
    @Autowired ProductRepository repo;

    @Transactional(readOnly = true)
    public Page<Product> search(String name, Pageable pageable) {
        return repo.findAll(pageable);
    }

    public Product create(Product product) {
        return repo.save(product);
    }
}

// Controller
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired ProductService service;

    @GetMapping
    public Page<Product> list(Pageable pageable) {
        return service.search("", pageable);
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return service.create(product);
    }
}
```

---

