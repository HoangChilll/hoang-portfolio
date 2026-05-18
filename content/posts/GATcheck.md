---
title: PAPER GATcheck
date: 2026-05-17
tags: [paper, A.i,]
description: cách hiểu của mình về bài báo gatcheck này
---
# GATCheck: A Detailed Analysis of Graph Attention Networks

# 1. Nội dung
  - Bài báo viết về một mô hình neural network trong lĩnh vực `GNN - Graph Attention Network`
  - Sử dụng trong 3 bài toán:
    + `Link Prediction` (dự đoán liên kết)
    + `Multi-class Node Classification` (phân loại nút đa lớp)
    + `Pairwise Node Classification` (phân loại cặp nút)
  - So sánh mô hình này với một số mô hình khác trên thế giới
  - **Hạn chế của GCN**
    + Graph Convolutional Networks (`GCN`) thực hiện `lan truyền thông tin` bằng cách `tổng hợp đặc trưng` từ các node lân cận
    + GCN thường giả định rằng tất cả các node hàng xóm đều `đóng góp với mức độ quan trọng tương tự nhau` sau bước chuẩn hóa ma trận kề
    + Ví dụ trong mạng xã hội:
      + Một `người bạn thân` có thể ảnh hưởng đến người dùng nhiều hơn những `người quen thông thường`
      + Tuy nhiên GCN lại xử lý các node này `gần như tương đương nhau`
  - **GAT giải quyết vấn đề đó**
    + Graph Attention Network (`GAT`) được đề xuất nhằm `tự động học mức độ quan trọng` giữa các node thông qua `cơ chế attention`
    + Thay vì gán `trọng số cố định`, GAT cho phép mô hình học `trọng số attention khác nhau` cho từng node lân cận
    + Giúp mô hình `linh hoạt hơn` và biểu diễn cấu trúc đồ thị `hiệu quả hơn`

# 2. Tổng quan
  - **Bối cảnh**
    + Đồ thị lân cận `size cố định` trong việc truyền thông điệp giữa các node
    + Graph Convolutional Networks (`GCNs`) đối xử với các nodes như nhau bằng cách gắn `trọng số cố định`
  - **Cơ chế attention trong GAT**
    + Hoạt động tương tự như việc xác định `"node nào quan trọng hơn"` đối với node đang xét
  - **Ví dụ**
    + Giả sử node `i` có 3 node lân cận
    + Thay vì lấy `trung bình đặc trưng` của cả 3 node như GCN, GAT sẽ học xem `node nào mang nhiều thông tin hữu ích hơn`
    + Nếu một node có `liên hệ mạnh hơn` với node `i` → mô hình sẽ gán `attention score lớn hơn` cho node đó
  - Nhờ đó, `embedding cuối cùng` của node sẽ phản ánh tốt hơn `cấu trúc và mối quan hệ` trong đồ thị

# 3. Bối cảnh nghiên cứu
  - **Input**
    + Đầu vào là các `node features` ![alt text](/images/gatcheck1.png)

    + `N` là số node
  - **Biến đổi đặc trưng**
    + Layer biến đổi các node bằng cách `nhân với một ma trận M` ![alt text](/images/gatcheck2.png)
    + Tham số của ma trận `có thể học` thông qua mạng `MLP`
  - **Cơ chế attention**
    + Sau bước trên, áp dụng `cơ chế a` để xác định `mức quan trọng` của các node ![alt text](/images/gatcheck3.png)
    + Cơ chế này gọi là `self-attention` hoặc `intra-attention`
  - **Chuẩn hóa trọng số**
    + Trọng số của node `eij` được chuẩn hóa bằng `hàm softmax` ![alt text](/images/gatcheck4.png)
    + Trong đó `aij` là trọng số attention giữa node `i` và node `j`
  - **Công thức attention của GAT**
    + `eij` là trọng số `thô`
    + `||` là hàm `nối chuỗi`
    + `sigma` là hàm phi tuyến `LeakyReLU`
    ![alt text](/images/gatcheck5.png)
    ![alt text](/images/gatcheck6.png)
  - **Tính embedding mới**
    + Sau khi có các trọng số đã chuẩn hóa → tính vector biến đổi đặc trưng của node `i` ![alt text](/images/gatcheck7.png)
    + Nếu muốn `giữ đặc trưng của node i` → kết nối node đó với chính nó (`self-loop`)
  - **Multi-Head Attention**
    + GAT sử dụng `Multi-Head Attention` để quá trình học `ổn định hơn`
    + Mỗi `attention head` có thể học những đặc trưng `khác nhau` của đồ thị
    + Head = một bộ attention `riêng biệt` dùng để học một `perspective` khác của đồ thị ![alt text](/images/gatcheck8.png)
    + Tính embedding mới của node `i` bằng cách `tổng hợp feature` của các node lân cận với trọng số attention, thực hiện cho nhiều attention head
    + `Wk` là ma trận biến đổi có thể học của attention head ở tầng thứ `k`
  - **Tầng output**
    + Lấy `trung bình` thay vì `nối chuỗi`
    ![alt text](/images/gatcheck9.png)
# 4. Các khái niệm
  - **ROC-AUC**
    + Khả năng `phân biệt giữa lớp dương (positive) và lớp âm (negative)` ở mọi `ngưỡng quyết định (threshold)`
  - **Layers (L)**
    + Số lượng `lớp Graph Attention` được sử dụng trong phương pháp
  - **Hidden Dimension (h_dim)**
    + Số chiều của `vector embedding` của các node trong các lớp ẩn
  - **Hidden GAT Layer Attention Heads (K_hid)**
    + Số lượng `attention head` trong các lớp ẩn của mạng GAT
  - **Output GAT Layer Attention Heads (K_out)**
    + Số lượng `attention head` trong lớp đầu ra của mạng GAT
  - **Activation (act)**
    + `Hàm kích hoạt phi tuyến` được sử dụng trong mạng GAT
  - **Aggregation (aggr)**
    + Hàm `tổng hợp (aggregation)` được dùng trong bước `message passing`

# 5. Phân tích

## 5.1. Layers
  - Tăng tầng layers → mô hình `mạnh hơn`
  - Nhưng dễ dẫn đến `overfit` trong dataset nhỏ
  - **Giải pháp**
    + Tăng `trọng số phạt`
    + Hoặc `dropout` (tắt 1 số neuron tạm thời)

## 5.2. Hidden Dimension (h_dim)
  - Khi tăng hidden dimension → `số chiều embedding` của node tăng
  - Giúp mô hình có khả năng `biểu diễn nhiều thông tin hơn`
  - **Nhưng nếu tăng quá lớn**
    + Số lượng `tham số cần học` tăng
    + Trong dataset nhỏ → dễ bị `overfitting` do học quá sát dữ liệu huấn luyện
    + Embedding chiều quá cao → chứa `thông tin dư thừa`
    + Làm giảm khả năng `khái quát hóa` của mô hình

## 5.3. K_hid (Hidden Attention Heads)
  - **Ưu điểm khi dùng nhiều heads**
    + Mô hình `ổn định hơn` trong quá trình huấn luyện
    + Tăng khả năng `biểu diễn đặc trưng` của node
    + Mỗi head có thể tập trung vào những `neighbor khác nhau`
    + Khai thác được `nhiều thông tin hơn` từ đồ thị
  - **Nhưng nếu quá nhiều heads**
    + Hiệu năng có xu hướng `giảm`
    + Số `tham số cần học` tăng đáng kể → nguy cơ `overfitting`, đặc biệt trên dataset nhỏ
    + Tăng `chi phí tính toán` và `bộ nhớ`
  - Cần lựa chọn số attention heads `phù hợp` để cân bằng giữa `khả năng biểu diễn` và `độ phức tạp`

## 5.4. K_out (Output Attention Heads)
  - Tăng output attention heads → thường `cải thiện hiệu năng`
  - **Nguyên nhân**
    + Nhiều heads → tổng hợp thông tin từ `nhiều góc nhìn` khác nhau
    + Làm giảm ảnh hưởng của các attention head `hoạt động kém`
    + `Averaging` ở tầng output giúp giảm `overfitting` so với nối chuỗi vector
  - **Nhược điểm**
    + Nếu output heads quá lớn → `thời gian huấn luyện` và `chi phí tính toán` tăng đáng kể

## 5.5. Activation (act)
  - Kết quả thực nghiệm: hàm `tanh` đạt hiệu năng tốt hơn `ReLU` và `LeakyReLU` trong nhiều trường hợp
  - **Nguyên nhân**
    + `tanh` chuẩn hóa đầu ra trong khoảng `[-1, 1]`
    + Giúp embedding của các node `ổn định hơn` trong huấn luyện
  - **So sánh các hàm**
    + `ReLU`:
      + Ưu điểm: `đơn giản`, `tính toán nhanh`
      + Nhược điểm: dễ gặp hiện tượng `"dead neuron"` (neuron luôn cho đầu ra bằng 0)
    + `LeakyReLU`:
      + Cải thiện ReLU bằng cách cho phép `gradient nhỏ` tồn tại ở miền âm
      + Vẫn chưa đạt hiệu quả tốt bằng `tanh` trong nghiên cứu này
  - Việc lựa chọn activation function ảnh hưởng lớn đến `khả năng hội tụ` và `hiệu năng cuối cùng` của mô hình GAT

# 6. Diễn giải trọng số Attention
  - **Entropy**
    + Khái niệm trong `Information Theory`
    + Đo `mức độ phân tán / hỗn loạn` của một `phân bố xác suất`
    ![alt text](/images/gatcheck10.png)
  - **GAT khi nào thực sự tốt?**
    + GAT chỉ thực sự tốt khi dataset có `entropy thấp`
    + Vì `entropy cao` thì GAT `gần tương đương GCN`
    + GCN (Graph Convolutional Network) tính `average neighbor`
  - **Khi attention distribution có entropy cao**
    + Các attention weights trở nên `gần đồng đều` giữa các neighboring nodes
    + Cơ chế attention của GAT `gần tương đương` phép lấy trung bình neighbor trong GCN
    + Mô hình `mất đi khả năng phân biệt` mức độ quan trọng giữa các node
    + Làm giảm `ưu thế của attention mechanism`
