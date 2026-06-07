---
title: String trong java
date: 2026-04-17
tags: [java, spring]
description: Kiến thức căn bản, phổ biến về string trong java
---
## 1. Bộ nhớ Stack và Heap

### Stack
- Lưu trữ các **biến cục bộ**, tham số phương thức, và **tham chiếu** (reference) đến object.
- Được quản lý tự động theo cơ chế **LIFO** (Last In, First Out).
- Tốc độ truy cập **nhanh hơn** Heap.
- Kích thước **nhỏ**, cố định — tràn Stack sẽ gây `StackOverflowError`.
- Vòng đời gắn với **block/method** chứa nó: ra khỏi scope là bị giải phóng ngay.

### Heap
- Lưu trữ các **object** (bao gồm mọi String object).
- Được quản lý bởi **Garbage Collector** (GC) của JVM.
- Kích thước **lớn hơn** và linh hoạt hơn Stack.
- Có một vùng đặc biệt gọi là **String Pool** (hay String Constant Pool) nằm trong Heap.

### Mối quan hệ giữa Stack và Heap với String

```
Stack                        Heap
┌─────────────┐              ┌──────────────────────────────┐
│  s1 ──────────────────────►│  "Hello"  (String Pool)      │
│  s2 ──────────────────────►│  "Hello"  (cùng địa chỉ!)   │
│  s3 ──────────────────────►│  new Object "Hello"           │
│             │              │  (ngoài String Pool)          │
└─────────────┘              └──────────────────────────────┘
```

> **Lưu ý quan trọng:** Biến `s1`, `s2`, `s3` trên Stack chỉ là **tham chiếu** (địa chỉ). Object String thực sự nằm trên Heap.

---

## 2. Các Cách Khởi Tạo String

### 2.1 Khởi tạo hằng (String Literal)

```java
String s1 = "Hello";
String s2 = "Hello";
```

- JVM kiểm tra **String Pool** trước.
- Nếu `"Hello"` đã tồn tại → **tái sử dụng** cùng địa chỉ, không tạo object mới.
- `s1 == s2` trả về `true` vì cả hai cùng trỏ vào một object trong Pool.

```
String Pool:
┌──────────┐
│ "Hello"  │ ◄── s1, s2 cùng trỏ vào đây
└──────────┘
```

### 2.2 Khởi tạo tạo Object (dùng `new`)

```java
String s3 = new String("Hello");
String s4 = new String("Hello");
```

- Luôn tạo **object mới** trên Heap, **ngoài** String Pool.
- `s3 == s4` trả về `false` vì hai địa chỉ khác nhau.
- Tốn bộ nhớ hơn → **hạn chế dùng** `new String(...)` trừ khi có lý do đặc biệt.

```
Heap (ngoài Pool):
┌───────────┐   ┌───────────┐
│ "Hello"   │   │ "Hello"   │
│ (object1) │   │ (object2) │
└───────────┘   └───────────┘
    ▲               ▲
    s3              s4
```

### 2.3 Các cách khởi tạo khác

```java
// Từ mảng char
char[] chars = {'H', 'e', 'l', 'l', 'o'};
String s5 = new String(chars);

// Từ StringBuilder / StringBuffer
StringBuilder sb = new StringBuilder("Hello");
String s6 = sb.toString();

// String rỗng
String s7 = "";
String s8 = new String();
```

---

## 3. Các Phép Toán Với String

### 3.1 Phép toán tạo Object mới (Immutable operations)

> String trong Java là **bất biến (immutable)** — mọi thao tác "thay đổi" String đều trả về **object mới**, object gốc **không thay đổi**.
```
| Phép toán          | Ví dụ                           | Kết quả                                  |
|--------------------|---------------------------------|------------------------------------------|
| Nối chuỗi `+`      | `"Hello" + " World"`            | Object mới `"Hello World"`               |
| `concat()`         | `s.concat(" World")`            | Object mới                               |
| `toUpperCase()`    | `s.toUpperCase()`               | Object mới chữ hoa                       |
| `toLowerCase()`    | `s.toLowerCase()`               | Object mới chữ thường                    |
| `trim()`           | `s.trim()`                      | Object mới không có khoảng trắng đầu/cuối|
| `replace()`        | `s.replace("l", "r")`           | Object mới đã thay thế                   |
| `substring()`      | `s.substring(1, 3)`             | Object mới là chuỗi con                  |
| `strip()`          | `s.strip()`                     | Object mới (Unicode-aware trim)          |
```
```java
String s = "Hello";
String s2 = s.toUpperCase();  // s2 = "HELLO", s vẫn là "Hello"

System.out.println(s);   // Hello  → không đổi
System.out.println(s2);  // HELLO  → object mới
System.out.println(s == s2); // false → khác địa chỉ
```

### 3.2 Phép toán KHÔNG làm thay đổi địa chỉ Object

Các phép toán này chỉ **đọc/kiểm tra** String, không tạo object mới (trả về kiểu nguyên thủy hoặc object khác).

| Phép toán               |                  Ví dụ |        Trả về             |
|-------------------------|------------------------|---------------------------|
| `length()`              | `s.length()`           | `int` – độ dài            |
| `charAt()`              | `s.charAt(0)`          | `char` – ký tự tại vị trí |
| `indexOf()`             | `s.indexOf("l")`       | `int` – vị trí đầu tiên   |
| `contains()`            | `s.contains("ell")`    | `boolean`                 |
| `startsWith()`          | `s.startsWith("He")`   | `boolean`                 |
| `endsWith()`            | `s.endsWith("lo")`     | `boolean`                 |
| `isEmpty()`             | `s.isEmpty()`          | `boolean`                 |
| `isBlank()`             | `s.isBlank()`          | `boolean`                 |
| `equals()`              | `s.equals("Hello")`    | `boolean`                 |
| `compareTo()`           | `s.compareTo("Hello")` | `int`                     |

```java
String s = "Hello";
int len = s.length();         // 5, s không đổi
boolean check = s.isEmpty();  // false, s không đổi
// s vẫn là "Hello" với cùng địa chỉ
```

---

## 4. So Sánh String: `==` vs `.equals()`

### 4.1 Toán tử `==`

- So sánh **địa chỉ bộ nhớ** (tham chiếu), **không** so sánh nội dung.
- Trả về `true` chỉ khi hai biến cùng trỏ vào **một object duy nhất**.

```java
String s1 = "Hello";
String s2 = "Hello";
String s3 = new String("Hello");

System.out.println(s1 == s2);  // true  → cùng object trong Pool
System.out.println(s1 == s3);  // false → khác địa chỉ
```

### 4.2 Phương thức `.equals()`

- So sánh **nội dung** (giá trị ký tự) của hai String.
- Phân biệt **chữ hoa/thường**.

```java
System.out.println(s1.equals(s2));  // true
System.out.println(s1.equals(s3));  // true → cùng nội dung "Hello"
System.out.println(s1.equals("hello")); // false → khác hoa/thường
```

### 4.3 Phương thức `.equalsIgnoreCase()`

- So sánh nội dung, **không** phân biệt hoa/thường.

```java
System.out.println("Hello".equalsIgnoreCase("hello")); // true
System.out.println("JAVA".equalsIgnoreCase("java"));   // true
```

### 4.4 Tóm tắt so sánh

| | `==`           | `.equals()` | `.equalsIgnoreCase()` |
| So sánh | Địa chỉ | Nội dung | Nội dung (bỏ qua hoa/thường) |
| Literal vs Literal | `true` | `true` | `true` |
| Literal vs `new` | `false` | `true` | `true` |
| `new` vs `new` | `false` | `true` | `true` |

> ✅ **Quy tắc vàng:** Luôn dùng `.equals()` để so sánh nội dung String. Chỉ dùng `==` khi cố ý muốn kiểm tra cùng tham chiếu.

---

## 5. String vs StringBuilder vs StringBuffer

### 5.1 So sánh tổng quan
```
| Tiêu chí           | `String`               | `StringBuilder`           | `StringBuffer`            |
|--------------------|------------------------|---------------------------|---------------------------|
| **Tính bất biến**  | Immutable              | Mutable                   | Mutable                   |
| **Thread-safe**    | Tốt (immutable)        |  Không                    | Tốt Có (synchronized)     |
| **Hiệu suất**      | Chậm khi nối nhiều     |  Nhanh nhất               |  Chậm hơn StringBuilder   |
| **String Pool**    | Có                     |  Không                    |  Không                    |
| **Dùng khi**       | Chuỗi ít thay đổi      | Nối chuỗi nhiều, 1 thread | Nối chuỗi nhiều, đa luồng |
```
### 5.2 String – Bất biến (Immutable)

```java
String s = "Hello";
s += " World";  // Tạo object mới, object cũ "Hello" bị bỏ
s += "!";       // Lại tạo object mới nữa
// → 3 object được tạo ra, 2 object cũ trở thành rác (GC thu hồi)
```

**Khi nào dùng String:**
- Chuỗi ít hoặc không bị thay đổi.
- Dùng làm key trong `HashMap`, hằng số, tên biến môi trường.

### 5.3 StringBuilder – Nhanh, không thread-safe

```java
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
sb.insert(5, ",");       // "Hello, World"
sb.delete(5, 6);         // "Hello World"
sb.reverse();            // "dlroW olleH"
sb.replace(0, 5, "Java");// "Java olleH"

String result = sb.toString(); // Chuyển về String khi cần
System.out.println(result);
```

**Các phương thức phổ biến của StringBuilder:**
```
| Phương thức                | Mô tả                       |
|----------------------------|-----------------------------|
| `append(x)`                | Thêm vào cuối               |
| `insert(i, x)`             | Chèn tại vị trí i           |
| `delete(start, end)`       | Xóa từ start đến end        |
| `replace(start, end, str)` | Thay thế đoạn ký tự         |
| `reverse()`                | Đảo ngược chuỗi             |
| `deleteCharAt(i)`          | Xóa ký tự tại vị trí i      |
| `charAt(i)`                | Lấy ký tự tại vị trí i      |
| `length()`                 | Độ dài hiện tại             |
| `toString()`               | Chuyển về String            |
```
**Khi nào dùng StringBuilder:**
- Vòng lặp nối chuỗi nhiều lần.
- Xây dựng chuỗi phức tạp trong một luồng duy nhất.

### 5.4 StringBuffer – Thread-safe, chậm hơn StringBuilder

```java
StringBuffer sbf = new StringBuffer("Hello");
sbf.append(" World");
sbf.insert(5, ",");
String result = sbf.toString();
System.out.println(result); // "Hello, World"
```

- API **giống hệt StringBuilder**.
- Mỗi phương thức đều có từ khóa `synchronized` → an toàn khi nhiều thread cùng truy cập.
- Dùng khi cần thao tác chuỗi trong **môi trường đa luồng**.

### 5.5 Minh họa hiệu suất – Nối chuỗi trong vòng lặp

```java
// ❌ Tệ – tạo hàng nghìn object String
String result = "";`
for (int i = 0; i < 10000; i++) {
    result += i;  // Mỗi lần lặp tạo object mới!
}

// ✅ Tốt – chỉ một object StringBuilder được dùng
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
String result = sb.toString();
```

### 5.6 Khi nào dùng loại nào?

```
Chuỗi có thay đổi không?
├── Không → dùng String
└── Có → Có nhiều thread truy cập cùng lúc không?
           ├── Không → dùng StringBuilder  ✅ (ưu tiên)
           └── Có    → dùng StringBuffer
```

---

## 6. Tổng Kết Nhanh
```
| Chủ đề                    | Điểm nhớ                                |
|---------------------------|-----------------------------------------|
| Stack                     | Lưu tham chiếu, vòng đời ngắn, nhanh    |
| Heap / String Pool        | Lưu object, Pool tái dùng literal       |
| Literal `"..."`           | Vào Pool, tái sử dụng nếu đã có         |
| `new String(...)`         | Luôn tạo object mới ngoài Pool          |
| Phép toán String          | Luôn trả về object mới (immutable)      |
| `==`                      | So sánh địa chỉ                         |
| `.equals()`               | So sánh nội dung                        |
| `String`                  | Immutable, pool, dùng cho hằng          |
| `StringBuilder`           | Mutable, nhanh, 1 thread                |
| `StringBuffer`            | Mutable, chậm hơn, đa luồng             |
```