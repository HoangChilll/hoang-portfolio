---
title: Docker
date: 2026-05-24
tags: [docker]
description: Docker và các khái niệm căn bản
---
# 🐳 Docker — Toàn cảnh từ A đến Z

> *"Build once, run anywhere."* — Triết lý cốt lõi của Docker

---

## 1. Docker là gì?

**Docker** là một nền tảng mã nguồn mở dùng để **đóng gói, phân phối và chạy ứng dụng** bên trong các môi trường cô lập gọi là **container**.

Thay vì cài đặt ứng dụng trực tiếp lên máy chủ, Docker cho phép bạn đóng gói toàn bộ ứng dụng cùng với mọi thứ nó cần (thư viện, cấu hình, runtime...) vào một **"hộp kín"** — container — và chạy hộp đó ở bất kỳ đâu một cách nhất quán.

---

## 2. Docker ra đời để giải quyết vấn đề gì?

###  Bài toán kinh điển: "Máy tôi chạy được mà!"

Trước khi có Docker, các team phát triển thường gặp phải:
```
| Vấn đề                       | Mô tả |

| **Xung đột môi trường**      | Code chạy tốt trên máy dev nhưng lỗi trên server production |
| **Cài đặt phức tạp**         | Mỗi developer phải tự setup môi trường, dễ sai sót          |
| **Khó scale**                | Triển khai thêm instance mới tốn thời gian cấu hình         |
| **Lãng phí tài nguyên**      | Dùng Virtual Machine (VM) quá nặng cho mỗi ứng dụng         |
```


### Docker giải quyết bằng cách:

- **Chuẩn hóa môi trường**: Mọi người dùng chung một "công thức" (image) → không còn lỗi "chạy được trên máy tôi"
- **Triển khai nhanh**: Khởi động container tính bằng giây, không phải phút như VM
- **Nhẹ hơn VM**: Container chia sẻ kernel của host OS, không cần cả OS riêng
- **Dễ scale & tích hợp CI/CD**: Xây dựng pipeline tự động hóa dễ dàng hơn bao giờ hết

---

## 3. Docker vs Virtual Machine

```
┌─────────────────────────┐     ┌─────────────────────────┐
│      Virtual Machine     │     │         Docker           │
├─────────────────────────┤     ├─────────────────────────┤
│  App A  │  App B         │     │  App A  │  App B         │
├─────────┼────────────────┤     ├─────────┼────────────────┤
│ Guest OS│ Guest OS       │     │  Libs   │  Libs           │
├─────────┴────────────────┤     ├─────────┴────────────────┤
│       Hypervisor         │     │      Docker Engine        │
├──────────────────────────┤     ├──────────────────────────┤
│        Host OS           │     │         Host OS           │
├──────────────────────────┤     ├──────────────────────────┤
│        Hardware          │     │         Hardware          │
└──────────────────────────┘     └──────────────────────────┘
   Nặng (~GBs), chậm khởi động      Nhẹ (~MBs), khởi động giây
```

---

## 4. Các khái niệm căn bản

###  4.1 Image (Hình ảnh)

**Image** là một **bản thiết kế chỉ đọc** (read-only template) để tạo ra container.

- Giống như một **"snapshot"** của môi trường ứng dụng
- Được xây dựng theo từng **layer** (lớp), mỗi lớp là một thay đổi so với lớp trước
- Được lưu trữ và chia sẻ qua **Docker Registry**

```bash
# Tải image từ Docker Hub
docker pull nginx:latest

# Liệt kê các image đang có
docker images
```

---

###  4.2 Container

**Container** là một **phiên bản đang chạy** của một Image.

- Giống như việc "chạy" một chương trình từ file cài đặt
- Mỗi container là **cô lập** với nhau và với hệ thống host
- Có thể **start, stop, restart, delete** bất cứ lúc nào
- Khi xóa container, dữ liệu bên trong **sẽ mất** (trừ khi dùng Volume)

```bash
# Chạy một container từ image nginx
docker run -d -p 8080:80 --name my-nginx nginx

# Liệt kê container đang chạy
docker ps

# Dừng và xóa container
docker stop my-nginx
docker rm my-nginx
```

---

### 📄 4.3 Dockerfile

**Dockerfile** là file văn bản chứa **tập hợp các lệnh** để Docker tự động build một Image.

```dockerfile
# Ví dụ Dockerfile cho ứng dụng Node.js
FROM node:18-alpine          # Dùng image gốc

WORKDIR /app                 # Đặt thư mục làm việc

COPY package*.json ./        # Copy file cấu hình
RUN npm install              # Cài dependencies

COPY . .                     # Copy toàn bộ source code

EXPOSE 3000                  # Khai báo cổng

CMD ["node", "server.js"]    # Lệnh chạy khi container khởi động
```

```bash
# Build image từ Dockerfile
docker build -t my-app:1.0 .
```

---

### 🗄️ 4.4 Docker Registry

**Registry** là **kho lưu trữ và phân phối** Docker Images.

| Registry                      |  Mô tả                                                 |

| **Docker Hub**                | Registry công khai mặc định, miễn phí cho public image |
| **GitHub Container Registry** | Tích hợp với GitHub Actions                            |
| **AWS ECR / GCR / ACR**       | Registry riêng của các cloud provider                  |
| **Self-hosted**               | Tự dựng registry nội bộ (dùng `registry` image)        |

```bash
# Đăng nhập Docker Hub
docker login

# Push image lên registry
docker tag my-app:1.0 username/my-app:1.0
docker push username/my-app:1.0
```

---

###  4.5 Volume

**Volume** là cơ chế để **lưu trữ dữ liệu bền vững** (persistent data) bên ngoài container.

- Dữ liệu trong volume **không bị mất** khi container bị xóa
- Có thể **chia sẻ** giữa nhiều container
- Được quản lý bởi Docker, không phụ thuộc vào cấu trúc thư mục host

```bash
# Tạo volume
docker volume create my-data

# Mount volume vào container
docker run -d -v my-data:/var/lib/mysql mysql:8

# Hoặc bind mount thư mục từ host
docker run -d -v /host/path:/container/path nginx
```

---

### 🌐 4.6 Network

**Docker Network** cho phép các container **giao tiếp với nhau** và với thế giới bên ngoài.
```
| Loại Networ  | Mô tả                                                   |

| **bridge**   | Mặc định; container trong cùng network có thể giao tiếp |
| **host**     | Container dùng thẳng network của host                   |
| **none**     | Container hoàn toàn bị cô lập                           |
| **overlay**  | Dùng cho Docker Swarm, kết nối nhiều host               |
```
```bash
# Tạo network tùy chỉnh
docker network create my-network

# Kết nối container vào network
docker run -d --network my-network --name app my-app
docker run -d --network my-network --name db mysql:8

# Lúc này 'app' có thể kết nối tới 'db' bằng hostname 'db'
```

---

### 🎼 4.7 Docker Compose

**Docker Compose** là công cụ định nghĩa và chạy **ứng dụng multi-container** bằng file YAML.

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb

  db:
    image: postgres:15
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb

volumes:
  postgres-data:
```

```bash
# Khởi động toàn bộ stack
docker compose up -d

# Dừng toàn bộ stack
docker compose down
```

---

## 5. Vòng đời của một Container

```
Dockerfile  ──build──►  Image  ──run──►  Container (Running)
                          ▲                    │
                          │              stop / start
                       pull/push               │
                          │             Container (Stopped)
                       Registry                │
                                           ──rm──► (Deleted)
```bashnphnp
# === IMAGE ===
docker pull <image>           # Tải image
docker build -t <name> .      # Build image từ Dockerfile
docker images                 # Liệt kê image
docker rmi <image>            # Xóa image

# === CONTAINER ===
docker run <image>            # Tạo và chạy container
docker run -d                 # Chạy nền (detached)
docker run -p host:container  # Map cổng
docker run -v vol:path        # Mount volume
docker ps                     # Xem container đang chạy
docker ps -a                  # Xem tất cả container
docker stop <id/name>         # Dừng container
docker start <id/name>        # Khởi động lại container
docker rm <id/name>           # Xóa container
docker logs <id/name>         # Xem log
docker exec -it <id> bash     # Truy cập vào container

# === SYSTEM ===
docker system prune           # Dọn dẹp tài nguyên không dùng
docker stats                  # Xem tài nguyên đang dùng
docker inspect <id>           # Xem thông tin chi tiết
```

---

## 7. Tóm tắt
```
| Khái niệm      | Vai trò                          |

| **Image**      | Bản thiết kế (read-only)         |
| **Container**  | Phiên bản chạy từ Image          |
| **Dockerfile** | Script để build Image            |
| **Registry**   | Kho lưu trữ và chia sẻ Image     |
| **Volume**     | Lưu trữ dữ liệu bền vững         |
| **Network**    | Kết nối giữa các container       |
| **Compose**    | Quản lý nhiều container cùng lúc |
```
---

>  **Bước tiếp theo:** Sau khi nắm vững Docker cơ bản, hãy tìm hiểu **Docker Swarm** hoặc **Kubernetes (K8s)** để quản lý container ở quy mô lớn hơn trong môi trường production.
