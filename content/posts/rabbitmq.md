---
title: RabitMQ
date: 2026-06-01
tags: [data,backend,rabbitmq]
description: cơ bản về rabbitmq
---
# RabbitMQ - Hướng dẫn cơ bản

## 1. RabbitMQ là gì?

**RabbitMQ** là một **message broker** (môi giới tin nhắn) mã nguồn mở, được viết bằng ngôn ngữ Erlang. Nó hoạt động như một "bưu điện" trung gian: nhận tin nhắn (message) từ bên gửi (**producer**), lưu trữ tạm thời trong **queue**, rồi chuyển đến bên nhận (**consumer**).

RabbitMQ triển khai chuẩn giao thức **AMQP (Advanced Message Queuing Protocol)**, ngoài ra còn hỗ trợ MQTT, STOMP, HTTP.

### Các khái niệm cốt lõi
```
| Khái niệm                | Ý nghĩa                                                       |

| **Producer**             | Ứng dụng gửi tin nhắn                                         |
| **Consumer**             | Ứng dụng nhận và xử lý tin nhắn                               |
| **Queue**                | Hàng đợi lưu trữ tin nhắn (FIFO)                              |
| **Exchange**             | Bộ định tuyến, quyết định tin nhắn đi đến queue nào           |
| **Binding**              | "Sợi dây" liên kết Exchange với Queue, kèm routing rule       |
| **Routing Key**          | "Địa chỉ" gắn vào tin nhắn để Exchange định tuyến             |
| **Virtual Host (vhost)** | Không gian ảo, dùng để phân tách môi trường (dev, prod...)    |
| **Connection**           | Kết nối TCP giữa client và broker                             |
| **Channel**              | Kênh logic bên trong 1 connection, giúp tái sử dụng connection|
```
### 4 loại Exchange phổ biến

- **Direct**: định tuyến chính xác theo routing key.
- **Fanout**: broadcast tin nhắn đến tất cả các queue đã bind.
- **Topic**: định tuyến theo mẫu (pattern) với ký tự `*` và `#`.
- **Headers**: định tuyến dựa vào headers của tin nhắn thay vì routing key.

---

## 2. RabbitMQ sinh ra để giải quyết bài toán gì?

Trong hệ thống phần mềm hiện đại (đặc biệt là **microservices**), các service cần giao tiếp với nhau. Nếu giao tiếp trực tiếp (ví dụ qua HTTP đồng bộ), sẽ phát sinh nhiều vấn đề:

### Các vấn đề RabbitMQ giải quyết

1. **Decoupling (Tách rời các service)**
   - Producer và Consumer không cần biết về nhau, không cần online cùng lúc.
   - Khi consumer chết, message vẫn được lưu trong queue, không mất dữ liệu.

2. **Asynchronous Processing (Xử lý bất đồng bộ)**
   - Ví dụ: khi user đăng ký, gửi email xác nhận không cần xử lý ngay lập tức. Đẩy task vào queue, trả response cho user nhanh hơn.

3. **Load Leveling / Buffering (Cân bằng tải)**
   - Khi traffic tăng đột biến (flash sale, peak hour), queue đóng vai trò "bộ đệm". Hệ thống không bị crash mà xử lý dần theo khả năng.

4. **Load Balancing giữa nhiều worker**
   - Nhiều consumer cùng lắng nghe 1 queue → tin nhắn được phân phối đều (round-robin) → scale ngang dễ dàng.

5. **Reliability (Đáng tin cậy)**
   - Hỗ trợ persistent message, acknowledgment, retry → giảm thiểu mất dữ liệu.

6. **Routing linh hoạt**
   - Một message có thể được nhân bản đến nhiều consumer khác nhau qua Exchange (pub/sub pattern).

### Use case thực tế

- Gửi email/SMS/notification hàng loạt
- Xử lý đơn hàng e-commerce (order → payment → shipping → notification)
- Log aggregation
- Video/image processing (upload xong đẩy vào queue để encode)
- Đồng bộ dữ liệu giữa các microservice
- Event-driven architecture

---

## 3. Cài đặt và các lệnh cơ bản

### Cài đặt bằng Docker (nhanh nhất)

```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=admin \
  rabbitmq:3-management
```

- Port `5672`: cổng AMQP để app kết nối.
- Port `15672`: giao diện web quản lý → truy cập `http://localhost:15672`.

### Lệnh quản lý qua `rabbitmqctl`

```bash
# Kiểm tra trạng thái server
rabbitmqctl status

# Khởi động / dừng
rabbitmqctl start_app
rabbitmqctl stop_app

# Quản lý user
rabbitmqctl add_user myuser mypassword
rabbitmqctl delete_user myuser
rabbitmqctl list_users
rabbitmqctl set_user_tags myuser administrator
rabbitmqctl change_password myuser newpassword

# Quản lý vhost
rabbitmqctl add_vhost myvhost
rabbitmqctl delete_vhost myvhost
rabbitmqctl list_vhosts

# Phân quyền
rabbitmqctl set_permissions -p myvhost myuser ".*" ".*" ".*"
rabbitmqctl list_permissions -p myvhost

# Xem thông tin queue, exchange, binding
rabbitmqctl list_queues
rabbitmqctl list_queues name messages consumers
rabbitmqctl list_exchanges
rabbitmqctl list_bindings
rabbitmqctl list_connections
rabbitmqctl list_channels

# Xóa queue rỗng / purge message trong queue
rabbitmqctl purge_queue queue_name
```

### Lệnh `rabbitmq-plugins`

```bash
# Bật plugin quản lý (UI web)
rabbitmq-plugins enable rabbitmq_management

# Liệt kê plugin
rabbitmq-plugins list

# Tắt plugin
rabbitmq-plugins disable rabbitmq_management
```

---

## 4. Kết nối cơ bản (ví dụ với Python và Node.js)

### Python - dùng thư viện `pika`

Cài đặt:
```bash
pip install pika
```

**Producer (gửi message):**

```python
import pika

# Tạo connection đến RabbitMQ
credentials = pika.PlainCredentials('admin', 'admin')
parameters = pika.ConnectionParameters(
    host='localhost',
    port=5672,
    virtual_host='/',
    credentials=credentials
)
connection = pika.BlockingConnection(parameters)
channel = connection.channel()

# Khai báo queue (tạo nếu chưa có, durable=True để queue không mất khi restart)
channel.queue_declare(queue='hello', durable=True)

# Gửi message
channel.basic_publish(
    exchange='',                # default exchange
    routing_key='hello',        # tên queue
    body='Hello RabbitMQ!',
    properties=pika.BasicProperties(delivery_mode=2)  # persistent message
)
print("Đã gửi message")
connection.close()
```

**Consumer (nhận message):**

```python
import pika

credentials = pika.PlainCredentials('admin', 'admin')
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost', credentials=credentials)
)
channel = connection.channel()
channel.queue_declare(queue='hello', durable=True)

# Hàm callback xử lý mỗi khi nhận message
def callback(ch, method, properties, body):
    print(f"Nhận được: {body.decode()}")
    ch.basic_ack(delivery_tag=method.delivery_tag)  # xác nhận đã xử lý xong

# Mỗi lúc chỉ nhận 1 message (fair dispatch)
channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='hello', on_message_callback=callback)

print("Đang chờ message... Nhấn Ctrl+C để thoát")
channel.start_consuming()
```

### Node.js - dùng thư viện `amqplib`

Cài đặt:
```bash
npm install amqplib
```

**Producer:**

```javascript
const amqp = require('amqplib');

async function send() {
  const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
  const channel = await connection.createChannel();
  const queue = 'hello';

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from('Hello RabbitMQ!'), { persistent: true });

  console.log('Đã gửi message');
  setTimeout(() => connection.close(), 500);
}

send();
```

**Consumer:**

```javascript
const amqp = require('amqplib');

async function receive() {
  const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
  const channel = await connection.createChannel();
  const queue = 'hello';

  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1);

  console.log('Đang chờ message...');
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log('Nhận được:', msg.content.toString());
      channel.ack(msg);
    }
  });
}

receive();
```

### Cấu trúc URL kết nối AMQP

```
amqp://[username]:[password]@[host]:[port]/[vhost]
```

Ví dụ:
- `amqp://guest:guest@localhost:5672/` — kết nối mặc định
- `amqp://admin:secret@rabbitmq.example.com:5672/production` — kết nối tới vhost `production`
- `amqps://...` — kết nối có mã hóa TLS

---

## 5. Các pattern thông dụng

1. **Simple Queue** (1 producer → 1 queue → 1 consumer)
2. **Work Queue** (1 producer → 1 queue → nhiều worker chia tải)
3. **Publish/Subscribe** (dùng fanout exchange, broadcast đến nhiều queue)
4. **Routing** (dùng direct exchange, định tuyến theo routing key)
5. **Topics** (dùng topic exchange, định tuyến theo pattern)
6. **RPC** (gửi request - chờ response thông qua queue)

---

## 6. Best Practices

- Luôn dùng **durable queue** + **persistent message** cho dữ liệu quan trọng.
- Dùng **manual acknowledgment** (`basic_ack`) thay vì auto-ack để tránh mất message khi consumer crash.
- Thiết lập **prefetch count** hợp lý để không quá tải consumer.
- Tách **connection** và **channel**: 1 connection cho app, mỗi thread/worker dùng 1 channel riêng.
- Sử dụng **Dead Letter Exchange (DLX)** để xử lý message lỗi.
- Monitor qua giao diện `15672` hoặc tích hợp Prometheus/Grafana.
- Đặt **TTL (time-to-live)** cho message hoặc queue khi cần.

---

## Tài liệu tham khảo

- Trang chủ: <https://www.rabbitmq.com/>
- Tutorial chính thức (6 phần): <https://www.rabbitmq.com/tutorials>
- AMQP 0-9-1 reference: <https://www.rabbitmq.com/amqp-0-9-1-reference.html>
