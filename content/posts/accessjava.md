---
title: Access Modifier
date: 2026-05-20
tags: [java]
description: các quy tắc cơ bản
---
# Java: Access Modifier, Biến Cục Bộ vs Biến Thành Viên & Lỗi Phổ Biến

---

## 1. Bốn Access Modifier trong Java

Access modifier kiểm soát **phạm vi truy cập** của class, biến, phương thức, constructor.

### Bảng tổng quan
```
| Modifier      | Cùng class  | Cùng package   | Lớp con (subclass)  | Khác package  |

| `public`      | ✅          | ✅            | ✅                  | ✅            |
| `protected`   | ✅          | ✅            | ✅                  | ❌            |
| *(default)*   | ✅          | ✅            | ❌                  | ❌            |
| `private`     | ✅          | ❌            | ❌                  | ❌            |

> **Default** (package-private): không viết modifier nào cả, chỉ truy cập được trong cùng package.
```
---

### 1.1 `public` — Truy cập mọi nơi

```java
public class Xe {
    public String tenXe;

    public void chay() {
        System.out.println(tenXe + " đang chạy");
    }
}

// Từ bất kỳ class nào, package nào
Xe x = new Xe();
x.tenXe = "Toyota";   // OK
x.chay();              // OK
```

---

### 1.2 `private` — Chỉ trong cùng class

Dùng để **đóng gói (encapsulation)** — ẩn dữ liệu nội bộ, chỉ cho phép truy cập qua getter/setter.

```java
public class TaiKhoan {
    private double soDu;       // không ai ngoài class này trực tiếp sửa được
    private String matKhau;

    public double getSoDu() {  // getter: đọc giá trị
        return soDu;
    }

    public void napTien(double soTien) { // kiểm soát logic trước khi thay đổi
        if (soTien > 0) {
            soDu += soTien;
        }
    }
}

TaiKhoan tk = new TaiKhoan();
// tk.soDu = -9999;  // LỖI BIÊN DỊCH: soDu là private
tk.napTien(500);     // OK — đi qua phương thức kiểm soát
```

---

### 1.3 `protected` — Cùng package + lớp con

Dùng trong **kế thừa (inheritance)**: lớp cha chia sẻ dữ liệu cho lớp con nhưng ẩn với bên ngoài.

```java
// package: animals
public class DongVat {
    protected String ten;
    protected int tuoi;

    protected void an() {
        System.out.println(ten + " đang ăn");
    }
}

// package: animals (cùng package hoặc lớp con)
public class Cho extends DongVat {
    public void sua() {
        System.out.println(ten + " sủa!"); // OK: kế thừa được trường protected
        an();                               // OK: gọi được phương thức protected
    }
}

// package: khác, không phải lớp con
DongVat dv = new DongVat();
// dv.ten = "Mèo"; // LỖI: không truy cập được từ package khác
```

---

### 1.4 Default (Package-Private) — Chỉ trong cùng package

Không viết modifier → chỉ các class cùng package mới thấy.

```java
// package: com.myapp.util
class TienIch {          // không có public
    int giaTriNoi;       // không có modifier
    
    void xuLy() { ... }  // không có modifier
}

// package: com.myapp.service (khác package)
// TienIch t = new TienIch(); // LỖI: không thấy class TienIch
```

---

### Khi nào dùng cái nào?

```
private   → dữ liệu nội bộ, không muốn ai chạm vào trực tiếp
default   → tiện ích nội bộ trong một package
protected → chia sẻ với lớp con để mở rộng hành vi
public    → API, giao diện với thế giới bên ngoài
```

> **Nguyên tắc vàng:** Luôn bắt đầu với `private`, chỉ mở rộng phạm vi khi thực sự cần thiết.

---

## 2. Biến Cục Bộ vs Biến Thành Viên

### 2.1 Biến thành viên (Instance Variable / Field)

- Khai báo **bên trong class**, ngoài phương thức.
- Thuộc về **đối tượng** — mỗi object có bản sao riêng.
- Tự động khởi tạo giá trị mặc định nếu không gán.
- Tồn tại suốt **vòng đời của object**.

```java
public class SinhVien {
    // Biến thành viên
    String hoTen;      // mặc định: null
    int tuoi;          // mặc định: 0
    double gpa;        // mặc định: 0.0
    boolean daToTNghiep; // mặc định: false
}
```

### 2.2 Biến cục bộ (Local Variable)

- Khai báo **bên trong phương thức, constructor, hoặc khối lệnh**.
- **Không có giá trị mặc định** — phải khởi tạo trước khi dùng.
- Chỉ tồn tại trong **phạm vi khối lệnh chứa nó**, sau đó bị hủy.

```java
public void tinhToan() {
    int ketQua;               // biến cục bộ — chưa khởi tạo
    // System.out.println(ketQua); // LỖI BIÊN DỊCH: chưa gán giá trị!
    
    ketQua = 10 * 5;
    System.out.println(ketQua); // OK: 50
}
// ketQua không còn tồn tại ở đây
```

### 2.3 Bảng so sánh chi tiết
```
| Tiêu chí              | Biến thành viên                   | Biến cục bộ                        |
|-----------------------|-----------------------------------|------------------------------------|
| Vị trí khai báo        | Trong class, ngoài method         | Trong method / block / constructor |
| Phạm vi               | Cả class (phụ thuộc modifier)     | Chỉ trong block khai báo           |
| Giá trị mặc định      | Có (`0`, `false`, `null`, ...)    | **Không có** — phải tự gán         |
| Vòng đời              | Theo object (heap)                | Theo lời gọi method (stack)        |
| Lưu trữ               | Heap memory                       | Stack memory                       |
| Access modifier       | Có thể có (`private`, `public`...)| **Không được dùng**                |
| `static` được không?  | Có                                | Không                              |
```
```java
public class ViDuBien {
    int bienThanhVien = 100;  // biến thành viên, tồn tại trên heap

    public void method() {
        int bienCucBo = 200;  // biến cục bộ, tồn tại trên stack

        // Cả hai đều dùng được ở đây
        System.out.println(bienThanhVien); // 100
        System.out.println(bienCucBo);     // 200
    }

    public void methodKhac() {
        System.out.println(bienThanhVien); // OK: vẫn còn
        // System.out.println(bienCucBo); // LỖI: không tồn tại ở đây
    }
}
```

### Shadowing — Biến cục bộ che biến thành viên

```java
public class ShadowVidu {
    int x = 10; // biến thành viên

    public void method() {
        int x = 99; // biến cục bộ — che biến thành viên!
        System.out.println(x);       // 99  ← biến cục bộ
        System.out.println(this.x);  // 10  ← biến thành viên (dùng this)
    }
}
```

---

## 3. Lỗi Phổ Biến: Trả Về Địa Chỉ Mảng (Array Reference Leak)

### Vấn đề

Trong Java, **mảng là đối tượng**. Biến mảng chỉ lưu **địa chỉ tham chiếu** (reference) đến vùng nhớ thực sự trên heap. Khi trả về mảng từ một phương thức, bạn đang trả về **cùng một địa chỉ** — ai cũng có thể sửa dữ liệu gốc!

```java
public class HocSinh {
    private int[] diemSo = {8, 9, 7, 10};

    // ❌ NGUY HIỂM: trả về trực tiếp mảng nội bộ
    public int[] getDiemSo() {
        return diemSo; // trả về ĐỊA CHỈ của mảng gốc
    }
}

HocSinh hs = new HocSinh();
int[] diem = hs.getDiemSo(); // diem trỏ vào CÙNG mảng với diemSo nội bộ

diem[0] = -999;              // sửa qua biến ngoài...
System.out.println(hs.getDiemSo()[0]); // -999  ← dữ liệu gốc bị thay đổi!
                                        // dù diemSo là private!
```

> **Khai báo `private` không bảo vệ được nội dung mảng** nếu bạn trả về reference trực tiếp.

---

### Giải pháp 1: Trả về bản sao (Defensive Copy)

```java
public class HocSinh {
    private int[] diemSo = {8, 9, 7, 10};

    // ✅ AN TOÀN: trả về bản sao
    public int[] getDiemSo() {
        return diemSo.clone(); // hoặc Arrays.copyOf(diemSo, diemSo.length)
    }
}

HocSinh hs = new HocSinh();
int[] diem = hs.getDiemSo(); // diem là bản sao KHÁC, không liên quan đến gốc

diem[0] = -999;
System.out.println(hs.getDiemSo()[0]); // 8  ← dữ liệu gốc KHÔNG bị ảnh hưởng
```

---

### Giải pháp 2: Lỗi tương tự khi nhận mảng từ bên ngoài (Constructor)

Vấn đề cũng xảy ra theo chiều ngược lại — khi **nhận mảng vào** qua constructor:

```java
public class HocSinh {
    private int[] diemSo;

    // ❌ SAI: lưu trực tiếp reference từ ngoài vào
    public HocSinh(int[] diem) {
        this.diemSo = diem; // diemSo và diem trỏ cùng một mảng!
    }
}

int[] diemNgoai = {8, 9, 7};
HocSinh hs = new HocSinh(diemNgoai);

diemNgoai[0] = 0; // sửa mảng bên ngoài...
System.out.println(hs.getDiemSo()[0]); // 0  ← bị ảnh hưởng!
```

```java
// ✅ ĐÚNG: sao chép mảng khi nhận vào
public HocSinh(int[] diem) {
    this.diemSo = diem.clone(); // bản sao độc lập
}
```

---

### Minh họa bộ nhớ

```
❌ Trả về reference trực tiếp:

 biến ngoài ──┐
              ▼
          [ 8, 9, 7, 10 ]  ← heap (mảng gốc)
              ▲
 diemSo ──────┘

 Cả hai trỏ vào CÙNG một ô nhớ → sửa 1 bên = sửa cả 2


✅ Trả về bản sao (clone):

 biến ngoài ──►  [ 8, 9, 7, 10 ]  ← heap (bản sao)

 diemSo ──────►  [ 8, 9, 7, 10 ]  ← heap (gốc)

 Hai vùng nhớ độc lập → sửa bản sao không ảnh hưởng gốc
```

---

## 4. Lỗi Phổ Biến Khác Liên Quan

### 4.1 Quên `private` cho biến thành viên

```java
public class NganHang {
    public double soDu; // ❌ ai cũng sửa được trực tiếp!
}

NganHang nh = new NganHang();
nh.soDu = -1_000_000; // không có gì ngăn cản
```

**Khắc phục:** Luôn `private` biến thành viên, cung cấp getter/setter có kiểm tra logic.

---

### 4.2 Dùng biến cục bộ chưa khởi tạo

```java
public int tinhTong(int n) {
    int tong;         // khai báo nhưng chưa gán
    for (int i = 1; i <= n; i++) {
        tong += i;    // LỖI BIÊN DỊCH: variable tong might not have been initialized
    }
    return tong;
}
```

```java
// ✅ Sửa: khởi tạo trước
int tong = 0;
```

---

### 4.3 Nhầm biến cục bộ với biến thành viên trong constructor

```java
public class HinhTron {
    private double banKinh;

    // ❌ Lỗi: tham số và biến thành viên trùng tên, thiếu this
    public HinhTron(double banKinh) {
        banKinh = banKinh; // gán biến cục bộ cho chính nó!
    }                      // biến thành viên this.banKinh vẫn = 0.0
}
```

```java
// ✅ Đúng: dùng this để phân biệt
public HinhTron(double banKinh) {
    this.banKinh = banKinh; // biến thành viên = tham số
}
```

---

## 5. Tổng Hợp Nhanh

| Vấn đề                             | Nguyên nhân                              | Cách khắc phục                     

| `private` mà vẫn bị sửa mảng      | Trả về reference trực tiếp              | Dùng `.clone()` hoặc `Arrays.copyOf()` |
| Biến cục bộ dùng chưa gán          | Java không có giá trị mặc định cho local | Luôn khởi tạo trước khi dùng           |
| Biến thành viên bị che (shadowing) | Đặt trùng tên với biến cục bộ           | Dùng `this.tenBien`                    |
| Constructor không gán được         | Thiếu `this.` khi tên tham số trùng tên | Thêm `this.` phía trước                |
| Dữ liệu bị sửa từ ngoài constructor| Nhận reference mảng trực tiếp           | Clone mảng trong constructor           |
