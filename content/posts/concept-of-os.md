---
title: Tổng quan về OS
date: 2026-05-18
tags: [Operator System]
description: Tổng quan về OS, cung cấp các khái niệm tổng quan nhất về OS
---
# Khái niệm về hệ điều hành 
**Sơ đồ kiến trúc**
![OS](/OS1.png)
![OS](/OS2.png)
- Một/ nhiều CPUs, các thiết bị điều khiển được liên kết bằng `1 hệ thống bus chung` để truy nhập tới bộ nhớ chia sẻ
- Các thiết bị điều khiển và CPU thực hiện `đồng thời`, `cạnh tranh` với nhau
**Các thành phần của một hệ thống tính toán**
- `Phần cứng (Hardware)` : cung cấp `tài nguyên` tính toán cơ bản (CPU, bộ nhớ)
- `Hệ điều hành (OS)` : `điều khiển` và `phối hợp` việc sử dụng phần cứng của các phần mềm 
- Chương trình ứng dụng : sử dụng tài nguyên máy tính phục vụ người dùng 
- Người dùng 
**Vị trí và mục tiêu**
- Hệ điều hành nằm giữa phần cứng hệ thống và phần mềm 
![OS](/OS3.png)
- Mục tiêu : 
  + cung cấp `môi trường` để ng dùng thực hiện các chương trình ứng dụng làm máy tính `dễ sử dụng`, `thuận lợi` , `hiệu quả hơn`.
  + `Chuẩn hóa giao diện người` dùng
  + Sử dụng `hiệu quả` tài nguyên phần cứng , khai thác `tối đa hiệu suất`