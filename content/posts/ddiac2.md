---
title: DDIA Ch.2 — Data Models
date: 2026-08-10
tags: [ddia, database, data-model, relational, document, graph, sql, nosql]
description: Tổng quan về Data Models trong DDIA, tại sao chúng sinh ra, bài toán giải quyết, Relational/Document/Graph model và cách chọn model dựa trên access pattern.
---

# 1. Data Model là gì?

**Data Model** là cách biểu diễn thế giới thực thành dữ liệu để hệ thống có thể:

* Lưu trữ
* Truy vấn
* Cập nhật
* Duy trì quan hệ giữa các dữ liệu

Luồng cơ bản:

```text
Real World
    ↓
Application Model
    ↓
Data Model
    ↓
Database Storage
```

Ví dụ:

```text
User ──> Order ──> Product
```

Có thể biểu diễn bằng:

* **Relational** → tables + foreign keys
* **Document** → documents + nesting
* **Graph** → nodes + edges

# 2. Bài toán Data Model giải quyết

Dữ liệu thực tế thường có:

* Entity
* Relationship
* One-to-many
* Many-to-many
* Dữ liệu lồng nhau
* Dữ liệu thay đổi độc lập

Ví dụ:

```text
User
 ├── Orders
 │    ├── Products
 │    └── Payment
 └── Address
```

Vấn đề cần giải quyết:

```text
Lưu dữ liệu thế nào?
Truy vấn thế nào?
Quan hệ biểu diễn thế nào?
Update thế nào?
Giảm duplication thế nào?
```

# 3. Sự tiến hóa của Data Models

```text
Hierarchical
     ↓
Network
     ↓
Relational
     ↓
Document
     ↓
Graph
```

Không phải model sau tốt hơn model trước.

Mỗi model xuất hiện để giải quyết **một kiểu bài toán khác nhau**.

# 4. Hierarchical Model

Dữ liệu được tổ chức thành **tree**:

```text
User
 └── Orders
      ├── Order 1
      └── Order 2
```

### Vấn đề

Tree chỉ biểu diễn tốt quan hệ:

```text
Parent → Child
```

Nhưng dữ liệu thực tế thường có nhiều-to-nhiều:

```text
Order 1 ──> Product A
Order 2 ──> Product A
```

Một Product có nhiều parent → tree trở nên hạn chế.

# 5. Network Model

Cho phép một record có nhiều relationship:

```text
A ───> B
 \     ↑
  ───> C
```

Giải quyết hạn chế của tree.

### Vấn đề

Application phải biết đường đi:

```text
User
 ↓
Orders
 ↓
OrderItems
 ↓
Product
```

→ **Procedural / navigation-based**

Application bị phụ thuộc nhiều vào cấu trúc dữ liệu.


# 6. Relational Model

Dữ liệu được biểu diễn bằng **tables**:

```text
users
orders
order_items
products
```

Quan hệ thông qua:

```text
Primary Key
Foreign Key
JOIN
```

Ví dụ:

```text
users.id
   ↑
orders.user_id

orders.id
   ↑
order_items.order_id

products.id
   ↑
order_items.product_id
```

## Điểm mạnh

Tách:

```text
WHAT
```

khỏi:

```text
HOW
```

SQL mang tính **declarative**:

```sql
SELECT p.*
FROM products p
JOIN order_items oi ON oi.product_id = p.id
WHERE oi.order_id = 101;
```

Database tự quyết định:

* Index nào
* Join order
* Table scan hay index scan
* Join algorithm


# 7. Declarative vs Imperative

## Imperative

Nói cho database **HOW**:

```text
1. Tìm User
2. Lấy Orders
3. Với mỗi Order
4. Lấy Product
```

## Declarative

Nói database **WHAT** muốn:

```sql
SELECT ...
FROM ...
JOIN ...
WHERE ...
```

Database tự tìm cách thực hiện.

→ Đây là một trong những ưu điểm lớn của relational model.


# 8. Document Model

Dữ liệu được lưu dưới dạng document:

```json
{
  "id": 1,
  "name": "Hoang",
  "address": {
    "city": "Ha Noi"
  },
  "orders": [
    {
      "id": 101,
      "items": [...]
    }
  ]
}
```

Ví dụ tiêu biểu: MongoDB.

## Bài toán giải quyết

Nếu application thường xuyên đọc một aggregate cùng nhau:

```text
User
 ├── Profile
 ├── Address
 └── Orders
```

Có thể lưu gần nhau:

```text
User Document
```

→ Ít JOIN hơn, đọc aggregate tự nhiên hơn.



# 9. Vấn đề của Document Model

Nếu một dữ liệu được dùng ở rất nhiều nơi:

```text
Product A
   ↓
1,000,000 Orders
```

Embedding Product vào từng Order tạo duplication.

```text
Order 1 → Product A
Order 2 → Product A
Order 3 → Product A
...
```

Khi Product thay đổi:

```text
iPhone → iPhone 17
```

có thể phải update rất nhiều document.

→ **Denormalization làm read dễ hơn nhưng update và consistency khó hơn.**


# 10. Normalization vs Denormalization

## Normalization

Tránh duplicate dữ liệu:

```text
products
---------
id | name

order_items
-----------
order_id | product_id
```

### Ưu điểm

* Ít duplication
* Update dễ
* Consistency tốt

### Nhược điểm

* Cần JOIN
* Query có thể phức tạp hơn

---

## Denormalization

Duplicate dữ liệu để tối ưu read:

```json
{
  "orderId": 101,
  "product": {
    "id": 1,
    "name": "iPhone"
  }
}
```

### Ưu điểm

* Read nhanh
* Ít JOIN
* Phù hợp với aggregate

### Nhược điểm

* Duplicate
* Update khó
* Có nguy cơ inconsistency



# 11. Graph Model

Graph biểu diễn:

```text
Node + Edge
```

Ví dụ:

```text
Hoang
  │
  ├──BOUGHT──> iPhone
  │                │
  │                └──MADE_BY──> Apple
  │
  └──LIVES_IN──> Hanoi
```

## Khi nào phù hợp?

Khi **relationship chính là dữ liệu quan trọng**.

Ví dụ:

```text
Social Network
Recommendation
Fraud Detection
Knowledge Graph
Dependency Graph
```

Các query dạng:

```text
Ai follow Hoang?
Ai follow người mà Hoang follow?
Có đường nào từ A → B?
```

→ Graph model rất tự nhiên.


# 12. Ba Model — So sánh

| Model      | Biểu diễn           | Điểm mạnh                           | Điểm yếu                           |
| ---------- | ------------------- | ----------------------------------- | ---------------------------------- |
| Relational | Tables + FK         | Quan hệ rõ, query mạnh, consistency | JOIN có thể phức tạp               |
| Document   | Documents + nesting | Aggregate tự nhiên, ít JOIN         | Duplication, relationship phức tạp |
| Graph      | Nodes + Edges       | Relationship/traversal              | Không phù hợp mọi workload         |



# 13. Schema-on-Write vs Schema-on-Read

## Schema-on-Write

Database enforce schema khi ghi.

Ví dụ:

```sql
CREATE TABLE users (
    id BIGINT,
    name VARCHAR(100),
    age INT
);
```

Đặc trưng của relational database.



## Schema-on-Read

Dữ liệu linh hoạt hơn, application quyết định cách hiểu.

Ví dụ:

```json
{
  "name": "Hoang"
}
```

Document khác:

```json
{
  "name": "Hoang",
  "age": 20
}
```

→ Document model thường linh hoạt hơn về schema.

> **Schema-less ≠ No schema**

Nó thường có nghĩa là database không enforce schema cứng theo cùng cách như relational database.


# 14. Object-Relational Impedance Mismatch

Application thường dùng object:

```java
class User {
    String name;
    Address address;
    List<Order> orders;
}
```

Relational database lại dùng:

```text
users
addresses
orders
```

Phải chuyển đổi:

```text
Java Objects
     ↕
   ORM
     ↕
Relational Tables
```

Ví dụ JPA/Hibernate:

```java
@OneToMany
private List<Order> orders;
```

ORM giảm vấn đề này nhưng **không loại bỏ nó**.

Vẫn cần hiểu:

* JOIN
* Lazy/Eager loading
* N+1 query
* Index
* Query execution


# 15. Access Pattern — Ý quan trọng nhất

Không nên bắt đầu bằng:

```text
"Tôi dùng PostgreSQL."
```

hay:

```text
"Tôi dùng MongoDB."
```

Hãy bắt đầu bằng:

```text
Application cần query gì?
```

Cần xác định:

1. Query nào xuất hiện nhiều nhất?
2. Read hay Write nhiều?
3. Relationship có phức tạp không?
4. Entity nào thay đổi độc lập?
5. Có cần consistency mạnh không?
6. Dữ liệu nào thường được đọc cùng nhau?
7. Có nhiều-to-nhiều không?
8. Có traversal nhiều bước không?

Sau đó mới chọn Data Model.

# 16. Ví dụ

## E-commerce

```text
User
Order
Product
Seller
Category
Review
```

Quan hệ:

```text
User → Orders
Order → Products
Product → Seller
Product → Category
User → Reviews
Product → Reviews
```

→ **Relational** thường rất phù hợp.


## Social Network

```text
Hoang
  ↓
Follows
  ↓
User A
  ↓
Follows
  ↓
User B
```

Query chủ yếu là relationship/traversal.

→ **Graph** phù hợp.

## CMS / Blog

```text
Article
 ├── Author
 ├── Content
 ├── Tags
 └── Comments
```

Nếu thường xuyên đọc toàn bộ article aggregate:

→ **Document** có thể phù hợp.


# 17. Cách thiết kế Database

Một quy trình tốt:

```text
1. Xác định Domain
        ↓
2. Xác định Entities
        ↓
3. Xác định Relationships
        ↓
4. Xác định Access Patterns
        ↓
5. Xác định Read / Write Pattern
        ↓
6. Chọn Data Model
        ↓
7. Chọn Database
        ↓
8. Thiết kế Schema + Index
```

**Không nên chọn database trước rồi mới ép dữ liệu vào nó.**


# 18. Mental Model cần nhớ

```text
                DATA
                  │
        ┌─────────┼─────────┐
        ↓         ↓         ↓
   Relational  Document   Graph
        │         │         │
      Tables   Documents   Nodes
      JOIN      Nesting    Edges
      FK        Embedding  Traversal
```

Không có:

```text
Best Data Model
```

Mà có:

```text
Best Data Model
        ↓
for a specific workload
and access pattern
```


# 19. Liên hệ với Java/Spring

Với Spring Boot + JPA, cần đặc biệt hiểu:

```text
Domain Model
      ↓
Entity / Relationship
      ↓
Relational Model
      ↓
Normalization
      ↓
JOIN
      ↓
Index
      ↓
ORM / JPA
      ↓
Query Behavior
```

Các concept cần nắm chắc:

```text
Normalization
Denormalization
Access Pattern
JOIN
Index
Foreign Key
ORM Impedance Mismatch
Lazy/Eager Loading
N+1 Query
```

# 20. Core Takeaway

> **Data Model là abstraction quyết định cách entities và relationships được biểu diễn.**

Mỗi model đánh đổi giữa:

```text
Simplicity
Flexibility
Consistency
Duplication
Read Performance
Write Performance
Relationship Complexity
```

Và nguyên tắc quan trọng nhất:

> **Đừng thiết kế database chỉ dựa trên dữ liệu. Hãy thiết kế dựa trên cách application sẽ sử dụng dữ liệu.**
