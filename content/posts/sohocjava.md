---
title: Số học trong java
date: 2026-05-20
tags: [java]
description: quy tắc đặt tên biến, số học trong java
---
# Java: Định Danh, Số Nguyên, Số Thực & Quy Tắc Tính Toán

---

## 1. Định Danh (Identifier)

Định danh là tên do lập trình viên đặt để đại diện cho biến, hằng, phương thức, lớp, ...

### Quy tắc đặt tên hợp lệ

- Chỉ gồm chữ cái (`a-z`, `A-Z`), chữ số (`0-9`), dấu gạch dưới `_`, và ký hiệu `$`.
- **Không được bắt đầu bằng chữ số.**
- **Không được trùng với từ khóa** của Java (`int`, `class`, `return`, ...).
- Phân biệt chữ hoa/thường: `myVar` và `MyVar` là hai định danh khác nhau.

```java
// Hợp lệ
int tuoi;
double _giaTriPI;
String $ten;
float nhietDo2;

// KHÔNG hợp lệ
int 2tuoi;       // bắt đầu bằng số
double my-var;   // chứa dấu gạch ngang
float class;     // trùng từ khóa
```

### Quy ước đặt tên (Convention)
```
| Loại          | Quy ước            | Ví dụ                    |

| Biến / tham số | camelCase         | `soLuong`, `tenSinhVien` |
| Hằng số        | UPPER_SNAKE_CASE  | `MAX_SIZE`, `PI`         |
| Lớp / Interface| PascalCase        | `SinhVien`, `ArrayList`  |
| Phương thức    | camelCase         | `tinhDienTich()`         |
```
---

## 2. Biểu Diễn Số Nguyên (Integer Types)

Java cung cấp 4 kiểu số nguyên, khác nhau về kích thước bộ nhớ và phạm vi giá trị:
```
| Kiểu    | Kích thước | Phạm vi giá trị                                      |

| `byte`  | 1 byte     | -128 → 127                                           |
| `short` | 2 byte     | -32,768 → 32,767                                     |
| `int`   | 4 byte     | -2,147,483,648 → 2,147,483,647 (≈ ±2.1 tỉ)           |
| `long`  | 8 byte     | -9.2 × 10¹⁸ → 9.2 × 10¹⁸                             |
```
```java
byte  b = 100;
short s = 30000;
int   i = 2_000_000;      // dấu _ giúp dễ đọc (Java 7+)
long  l = 9_000_000_000L; // bắt buộc hậu tố L cho long literal
```

---

## 3. Biểu Diễn Số Thực (Floating-Point Types)
```
| Kiểu     | Kích thước | Độ chính xác          | Phạm vi xấp xỉ           |

| `float`  | 4 byte     | ~6–7 chữ số có nghĩa  | ±3.4 × 10³⁸              |
| `double` | 8 byte     | ~15–16 chữ số có nghĩa | ±1.7 × 10³⁰⁸            |
```
```java
float  f = 3.14f;      // bắt buộc hậu tố f hoặc F
double d = 3.14159265358979;  // mặc định là double
double e = 1.5e10;     // ký hiệu khoa học: 1.5 × 10^10
```

> **Lưu ý:** Nếu không có hậu tố `f`, Java mặc định hiểu literal số thực là `double`.  
> `float x = 3.14;` → **Lỗi biên dịch** vì `3.14` là `double`, không thể gán vào `float` mà không ép kiểu.

---

## 4. Ép Kiểu (Type Casting)

### 4.1 Ép kiểu ngầm định – Widening (Ép lên)

Chuyển từ kiểu **nhỏ hơn** lên kiểu **lớn hơn** → Java tự động thực hiện, **không mất dữ liệu**.

```
byte → short → int → long → float → double
```

```java
int    i = 100;
long   l = i;      // tự động: int → long
double d = l;      // tự động: long → double

System.out.println(d); // 100.0
```

### 4.2 Ép kiểu tường minh – Narrowing (Ép xuống)

Chuyển từ kiểu **lớn hơn** xuống kiểu **nhỏ hơn** → **phải ép tường minh**, có thể mất dữ liệu.

```java
double d = 9.99;
int    i = (int) d;   // cắt phần thập phân
System.out.println(i); // 9  ← không phải 10!

long   l = 1_000_000_000_000L;
int    i2 = (int) l;  // mất dữ liệu vì vượt phạm vi int
System.out.println(i2); // kết quả không đoán được!
```

---

## 5. Lỗi Tràn Số (Integer Overflow)

Khi kết quả vượt ra ngoài phạm vi kiểu dữ liệu, Java **không báo lỗi** mà quay vòng (wrap around) — đây là lỗi âm thầm rất nguy hiểm.

```java
int max = Integer.MAX_VALUE; // 2,147,483,647
int overflow = max + 1;
System.out.println(overflow); // -2,147,483,648  ← quay về MIN_VALUE!

byte b = 127;
b++;
System.out.println(b); // -128  ← tràn số!
```

**Cách phòng tránh:**
- Dùng kiểu lớn hơn (`long` thay vì `int`).
- Dùng `Math.addExact()`, `Math.multiplyExact()` — ném ngoại lệ khi tràn số.
- Dùng `BigInteger` cho số nguyên rất lớn.

```java
// An toàn hơn
long result = (long) Integer.MAX_VALUE + 1; // 2,147,483,648

// Hoặc dùng Math.addExact để phát hiện lỗi
int safe = Math.addExact(Integer.MAX_VALUE, 1); // ném ArithmeticException
```

---

## 6. Phép Chia và Các Trường Hợp Đặc Biệt

### 6.1 Chia số nguyên `int / int`

Kết quả luôn là **số nguyên** (cắt phần thập phân). Chia cho `0` sẽ ném **ArithmeticException**.

```java
int a = 7, b = 2;
int ketQua = a / b;
System.out.println(ketQua); // 3  ← không phải 3.5!

// Chia cho 0 → RuntimeException
int c = 5 / 0; // ArithmeticException: / by zero
```

### 6.2 Chia số thực `double / 0`

Chia `double` cho `0` **không ném lỗi** — kết quả là `Infinity` hoặc `NaN`.

```java
double x = 5.0 / 0;    // Infinity
double y = -5.0 / 0;   // -Infinity
double z = 0.0 / 0;    // NaN (Not a Number)

System.out.println(x); // Infinity
System.out.println(z); // NaN

// Kiểm tra NaN
System.out.println(Double.isNaN(z));      // true
System.out.println(Double.isInfinite(x)); // true
```

### 6.3 Chia `int` cho `double` (hoặc ngược lại)

Khi một trong hai toán hạng là `double`, Java **tự động ép lên** `double` và trả về `double`.

```java
int    a = 7;
double b = 2.0;

double ketQua = a / b;
System.out.println(ketQua); // 3.5  ← đúng!

// Ép kiểu tường minh cũng được
double ketQua2 = (double) a / 2;
System.out.println(ketQua2); // 3.5

// Bẫy thường gặp: ép SAU khi đã chia
double sai = (double)(a / 2);
System.out.println(sai); // 3.0  ← chia int trước, ép sau → mất .5
```

---

## 7. Quy Tắc Chung Khi Tính Toán Hỗn Hợp

Java áp dụng **numeric promotion** — tự động nâng kiểu nhỏ lên kiểu lớn hơn trước khi tính:
```
| Toán hạng          | Kết quả                 |

| `int` op `int`     | `int`                   |
| `int` op `long`    | `long`                  |
| `int` op `double`  | `double`                |
| `long` op `double` | `double`                |
| `float` op `double`| `double`                |
| `byte`/`short` op `byte`/`short` | `int` (!) |
```
```java
byte a = 10, b = 20;
// byte c = a + b; // LỖI! a + b tự động thành int
byte c = (byte)(a + b); // phải ép kiểu tường minh

short s1 = 100, s2 = 200;
int tong = s1 + s2; // kết quả là int, OK
```

---

## 8. Tổng Hợp Nhanh — Bảng Tra Cứu
```
| Tình huống                        | Kết quả / Lưu ý                              |

| `int / int`                       | Số nguyên, cắt phần thập phân                |
| `int / 0`                         | `ArithmeticException` (lỗi runtime)          |
| `double / 0`                      | `Infinity` (không lỗi)                       |
| `0.0 / 0`                         | `NaN` (không lỗi)                            |
| `int / double`                    | `double`, kết quả chính xác                  |
| `(double)(int / int)`             | Vẫn mất phần thập phân! Ép sai chỗ           |
| `(double)int / int`               | Đúng — ép trước khi chia                     |
| `int + int` vượt `MAX_VALUE`      | Tràn số âm thầm, không báo lỗi               |
| `byte`/`short` cộng nhau          | Kết quả là `int`, phải ép kiểu để lưu lại    |
| `long` literal không có `L`       | Lỗi biên dịch nếu vượt phạm vi `int`         |
| `float` literal không có `f`      | Lỗi biên dịch (mặc định là `double`)         |
```