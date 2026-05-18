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
- **Các thành phần của một hệ thống tính toán**
- `Phần cứng (Hardware)` : cung cấp `tài nguyên` tính toán cơ bản (CPU, bộ nhớ)
- `Hệ điều hành (OS)` : `điều khiển` và `phối hợp` việc sử dụng phần cứng của các phần mềm 
- Chương trình ứng dụng : sử dụng tài nguyên máy tính phục vụ người dùng 
- Người dùng 
- **Vị trí và mục tiêu**
- Hệ điều hành nằm giữa phần cứng hệ thống và phần mềm 
![OS](/OS3.png)
- Mục tiêu : 
  + cung cấp `môi trường` để ng dùng thực hiện các chương trình ứng dụng làm máy tính `dễ sử dụng`, `thuận lợi` , `hiệu quả hơn`.
  + `Chuẩn hóa giao diện người` dùng
  + Sử dụng `hiệu quả` tài nguyên phần cứng , khai thác `tối đa hiệu suất`
## Cấu trúc phân lớp của một hệ thống tính toán 
**Giả lập một máy ảo**
- `Ẩn giấu chi tiết` phải thực hiện và các chức năng của phần cứng
- `Đơn giản hóa` vấn đề lập trình 
  + Không phải làm việc với `dãy nhị phân` 
  + Mỗi chương trình nghĩ nó `sở hữu toàn bộ` CPU, bộ nhớ , thiết bị
  + Giúp `giao tiếp` với thiết bị dễ dàng hơn so với phần cứng thuần túy 
- Các CT hoạt động `không ảnh hưởng` đến nhau 
- Máy ảo 
  + `Thử nghiệm` hệ điều hành
  + `Kiểm tra` các phần mềm khác
  ![OS](/images/OS4.png)
## Quản lý tài nguyên của hệ thống
  - Tài nguyên hệ thống được CT sử dụng để thực hiện công việc xác định
  - Các chương trình đòi hỏi về mặt `thời gian`(sử dụng) và `không gian`(nhớ)
  - HDH phải quản lý để máy tính hoạt động hiệu quả nhất :
    + `Phân phối` tài nguyên
    + `Giải quyết` tranh chấp 
    + `Quyết định` thứ tự cấp phát
# Lịch sử phát triển 
  - 48-70: cứng đắt, nhân rẻ
  - 70-81: cứng rẻ, nhân đắt
  - 81-_: cứng rất rẻ, nhân rất chát
  - 85 : các hệ thống phân tán
  - 95 : thiết bị di động
## Lịch sử phát triển của máy tính điện tử 
  - 46 : `máy ENIAC` ra đời 18k ống chân không , 7k điện trở , 5m mối kim loại
![OS](/images/OS5.png)
  - 48 -70 :
    + máy tính `1-5m $` phục vụ `quân sự `
    + `thiếu tương tác` ng dùng và máy 
    + `Không phân biệt` người dùng, người lập trình, thao tác viên
    + 1 người dùng tại 1 thời điểm :
      + Viết chương trình ( nhiều bìa đục lộ)
      + Bìa đầu là mồi (bootstraps loader) được đọc vào bộ nhớ và thực hiện
      + Lệnh trong chương trình mồi đọc vào bộ nhớ và thực hiện các lệnh nằm trên các tấm bìa sau vào bộ nhớ và thực hiện (chương trình ứng dụng)
      + Xem xét các đèn hiệu (kết quả ), thực hiện gỡ rối
    + `Khó gỡ rối `
    + `Lãng phí máy` 
    + Giải pháp : xử lý theo lô `(batch processing)`
    + Xử lý theo lô có thao tác viên chuyên nghiệp 
      + Người lập trình đưa cho thao tác viên
      + Tt viên kết hợp chương trình thành các lô
      + Máy tính thực hiện từng chương trình
      + Thao tác viên lấy kết quả in và gửi người lập trình
    + `Thay` bìa đục lỗ bằng `băng từ` ==> máy tính ngoại vi độc lập làm nhiệm vụ đọc ghi dữ liệu
![OS](/images/OS6.png)
    + `Thiết bị ngoại vi` được thiết kế để có thể truy nhập bộ nhớ trực tiếp (DMA:Direct Memory Access) bởi sử dụng cơ chế ngắt và kênh vào ra.
      + HĐH yêu cầu thiết bị vào/ra thực hiện rồi tiếp tục thực hiện công việc.
      + HĐH sẽ nhận tín hiệu ngắt khi các thiết bị vào ra thực hiện xong yêu cầu
    + ⇒Cho phép overlap giữa tính toán và vào ra, nghĩa là thay vì để CPU thực hiện việc đọc ghi dữ liệu thì thiết bị ngoại vi sẽ xử lý điều đó giúp hệ điều hành làm việc khác.
    + Lập trình lại CPU để dễ dàng hoán đổi giữa các chương trình (CT)
    + Phần cứng: bộ nhớ có kích thước lớn và rẻ hơn. Một vài CT thực hiện đồng thời : Đa chương trình
    + ⇒ HDH phải `quản lý tất cả` dẫn đến vượt tầm kiểm soát
![OS](/images/OS7.png)
    + 56 bởi Patrick và Mock 
    + Chức năng tự động thực hiện 1 ct mới khi ct cũ kết thúc
    + Được sử dụng trên khoảng 40 máy 704
  - 70 -84
    + máy tính giá 10k được dùng rộng rãi
    + HDH ổn định
    + Thiết bị đầu cuối giá rẻ cho phép người dùng cùng tương tác 1 hệ thống tại 1 thời điểm 
    + Video display terminal( DEC VT100)
  - 81-95 
    + máy tính 1000$, nhân công 100k$/năm => máy tính được dùng trong nhiều việc
    + Tính toán cá nhân
    + Tài nguyên phần cứng bị giới hạn
    + Máy tính cá nhân trở nên mạnh
    + Giao diện người dùng theo đồ họa(MAC, WIN)
![OS](/images/OS8.png)
  - Gia đoạn phát triển của HDH mạng và HDH phân tán
    + `Mạng cục bộ`
    + `dịch vụ tính toán lưu trữ`
    + Vấn đề độ trễ truyền thông,virus (`love letter virus` 05/2000),..
    + hơn 45m máy bị nhiễm
    + ăn cắp thông tin 
![OS](/images/OS9.png)
  - 95-_:
    + Thiết bị di động trở nên phổ biến
    + Mạng diện rộng, mạng không dây
    + Hệ thống ngang hàng 
    + Điện toán đám mây
# Định nghĩa và phân loại hệ điều hành
## Định nghĩa
  - Người sử dụng : Hệ điều hành là `hệ thống chương trình` phục vụ `khai thác` hệ thống tính toán một cách `thuận lợi`
  - Người quản lý : Hệ điều hành là hệ thống chương trình phục vụ `quản lý` chặt
chẽ và sử dụng tối ưu các `tài nguyên` của hệ thống tính toán
  - Quan điểm kỹ thuật : Hệ điều hành là một hệ thống chương trình trang bị cho một máy tính cụ thể để tạo ra một `máy tính logic` mới với `tài nguyên mới` và `khả năng mới`
  - Quan điểm hệ thống : Hệ điều hành là một hệ thống `mô hình hoá`, mô phỏng hoạt động của `máy tính`, của `người sử dụng` và của các `thao tác viên`, hoạt động trong `chế độ đối thoại` nhằm tạo môi trường `khai thác thuận lợi` hệ thống máy tính và `quản lý tối ưu tài nguyên` của hệ thống.

## Phân loại 
  - **Hệ thống xử lý theo lô đơn chương trình**
    + Thực hiện các chương trình (Job) `lần lượt` theo những chỉ thị đã được `xác định` trước.
    + Khi 1 Job kết thúc, hệ thống `tự động thực hiện Job tiếp theo` mà không cần sự can thiệp từ bên ngoài
    + Phải tồn tại `bộ giám sát` thực hiện dãy các Job và bộ giám sát phải thường trú trong hệ thống
    + Đòi hỏi `tổ chức hàng đợi công việc` (Job queue)
    + Vấn đề: khi chương trình `truy nhập thiết bị vào/ra`; processor rơi vào `trạng thái chờ đợi`
![OS](/images/OS10.png)
  - **Hệ thống xử lý theo lô đa chương trình**
    + Cho phép thực hiện `nhiều chương trình đồng thời`
      + Nạp `một phần mã và dữ liệu` của các chương trình/tiến trình vào bộ nhớ (`phần còn lại` sẽ được nạp tại `thời điểm thích hợp`).=>Chương trình sẵn sàng được thực hiện
      + `Thực hiện chương trìn`h như hệ thống `đơn chương trình`
      + Nếu chương trình `thực hiện vào ra`, processor được `chuyển giao` cho chương trình đang `sẵn sàng khác`
    + Ưu điểm 
      + `Tiết kiệm` bộ nhớ 
      + Hạn chế `thời gian rỗi` của processor
    + Nhược điểm 
      + `Chi phí cao` cho điều phối processor ➔Chương trình nào tiếp theo sẽ được sử dụng processor?
      + Giải quyết vấn đề `chia sẻ bộ nhớ` giữa các chương trình ?
![OS](/images/OS11.png)
  - **Hệ thống phân chia thời gian**
    + `Chia sẻ thời gian` của processor cho các chương trình/tiến trình đang sẵn sàng thực hiện  
    + Nguyên tắc giống như hệ thống xử lý theo lô đa chương trình (`nạp một phần` của các chương trình)
    + Processor được `phân phối lại` phụ thuộc chủ yếu vào `sự điều phối` của HĐH
    + `Thời gian hoán đổi` giữa các tiến trình `nhỏ`, các chương trình cảm giác `song song`
    + Thường được gọi: `HĐH đa nhiệm` (Windows)
  - **Hệ thống chia sẻ thời gian**
![OS](/images/OS12.png)
![OS](/images/OS13.png)
  - **Hệ thống song song**
    + Xây dựng cho các `hệ thống` có `nhiều bộ vi xử lý`
      + Nhiều VXL, công việc `thực hiện nhanh` chóng hơn
      + `Độ tin cậy cao`: hỏng một VXL không ảnh hưởng đến hệ thống
      + Ưu thế hơn hệ thống nhiều máy có một VXL vì cùng `chia sẻ bộ nhớ, thiết bị ngoại vi`...
    + Đa xử lý đối xứng (SMP: symmetric)
      + Mỗi bộ xử lý chạy 1 tiến trình/tiểu trình
      + Các `VXL giao tiếp` với nhau thông qua `1 bộ nhớ dùng chung`
      + Cơ chế chịu lỗi và khả năng cân bằng tải tối ưu
      + Vấn đề: Đồng bộ giữa các VXL
      + Ví dụ: HĐH WinNT
    + Đa xử lý không đối xứng (ASMP: asymmetric)
      + 1 `bộ xử lý chính` kiểm soát toàn bộ hệ thống
      + Các bộ xử lý khác thực hiện theo lệnh của bộ xử lý chính hoặc theo những chỉ thị đã được định nghĩa trước
      + Mô hình này theo dạng `quan hệ chủ tớ`:Bộ xử lý chính sẽ lập lịch cho các bộ xử lý khác
      + VD: IBM System/360