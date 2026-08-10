---
title: File I/O & Java NIO Basics
date: 2026-08-06
tags: [java, io, nio, file, csv]
description: Kiến thức nền tảng về File I/O, BufferedReader/Writer, Java NIO và cách xây dựng CSV Parser.
---

# File I/O là gì?

**File I/O (Input/Output)** là cơ chế giúp chương trình đọc dữ liệu từ file và ghi dữ liệu xuống file.

## Mục đích ra đời

- Lưu trữ dữ liệu lâu dài thay vì chỉ tồn tại trong RAM.
- Đọc/Ghi các loại file như `.txt`, `.csv`, `.json`, `.xml`, hình ảnh,...
- Là nền tảng cho logging, cấu hình, upload/download file,...


# Kiến trúc File I/O

```text
File <--> Java Program
```

Java thực chất chỉ làm việc với **byte**, sau đó chuyển đổi thành ký tự nếu cần.


# Byte Stream vs Character Stream

## Byte Stream

Làm việc trực tiếp với byte.

**Class chính**

- `InputStream`
- `OutputStream`

**Dùng cho**

- Image
- PDF
- Video
- ZIP
- File nhị phân



## Character Stream

Làm việc với ký tự Unicode.

**Class chính**

- `Reader`
- `Writer`

**Dùng cho**

- TXT
- CSV
- XML
- HTML
- JSON


# BufferedReader / BufferedWriter

## Vì sao ra đời?

`FileReader` và `FileWriter` đọc/ghi từng ký tự nên phải truy cập ổ cứng rất nhiều lần.

Giải pháp:

- Đọc một khối dữ liệu vào **Buffer (RAM)**.
- Chương trình thao tác trên Buffer trước.
- Giảm số lần truy cập ổ cứng ⇒ tăng hiệu năng.



## BufferedReader

Đọc file theo dòng.

```java
BufferedReader br = new BufferedReader(new FileReader("data.txt"));

String line;
while ((line = br.readLine()) != null) {
    System.out.println(line);
}
```

### Ưu điểm

- Đọc nhanh hơn
- Có `readLine()`
- Phù hợp file văn bản



## BufferedWriter

Ghi dữ liệu vào Buffer trước khi ghi xuống ổ cứng.

```java
BufferedWriter bw = new BufferedWriter(new FileWriter("data.txt"));

bw.write("Hello");
bw.newLine();
bw.write("Java");

bw.close();
```

### `flush()`

- Ghi dữ liệu trong Buffer xuống file.
- Không đóng file.

`close()` sẽ tự gọi `flush()` trước khi đóng.



# Java NIO

**NIO (New I/O)** được giới thiệu từ Java 1.4 nhằm cải thiện hiệu năng của `java.io`.

## Mục tiêu

- Tăng tốc độ đọc/ghi file.
- Giảm sao chép dữ liệu.
- Hỗ trợ xử lý nhiều kết nối đồng thời.
- API hiện đại và linh hoạt hơn.


## Thành phần quan trọng

### Path

Thay thế `File`.

```java
Path path = Paths.get("students.csv");
```


### Files

Tiện ích thao tác file.

```java
Files.readString(path);

Files.readAllLines(path);

Files.writeString(path, "Hello");
```

### Channel & Buffer

Mô hình của NIO:

```text
File
   ↓
Channel
   ↓
Buffer
   ↓
Program
```

Ưu điểm:

- Đọc/Ghi theo khối dữ liệu.
- Hiệu năng cao.
- Hỗ trợ Non-blocking I/O.



# IO vs NIO

| IO | NIO |
|----|-----|
| Stream | Channel |
| Blocking | Có thể Non-blocking |
| Đơn giản | Hiệu năng cao hơn |
| Phù hợp ứng dụng nhỏ | Phù hợp server lớn |


# CSV (Comma-Separated Values)

Ví dụ

```csv
id,name,age
1,Hoang,20
2,Nam,21
```

Mỗi dòng là một bản ghi, mỗi cột được phân tách bằng dấu `,`.



# Khi nào dùng gì?

| Trường hợp | Nên dùng |
|------------|----------|
| Đọc file text | `BufferedReader` |
| Ghi file text | `BufferedWriter` |
| Đọc toàn bộ file nhỏ | `Files.readString()` |
| Đọc tất cả các dòng | `Files.readAllLines()` |
| File nhị phân | `InputStream` / `OutputStream` |
| Server hiệu năng cao | Java NIO |
| CSV đơn giản | `BufferedReader` + `split()` |
| CSV chuẩn | OpenCSV / Apache Commons CSV |



# Tổng kết

- **File I/O** giúp đọc và ghi dữ liệu giữa chương trình và ổ cứng.
- **Byte Stream** dành cho dữ liệu nhị phân.
- **Character Stream** dành cho dữ liệu văn bản.
- **BufferedReader/Writer** sử dụng Buffer để tăng hiệu năng.
- **Java NIO** cung cấp API hiện đại với `Path`, `Files`, `Channel`, `Buffer`.
- Có thể tự xây dựng CSV Parser để hiểu cách xử lý dữ liệu trước khi sử dụng thư viện chuyên dụng.