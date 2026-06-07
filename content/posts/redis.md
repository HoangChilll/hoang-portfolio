---
title: redis
date: 2026-06-5
tags: [redis,caching]
description: cơ bản về redis và so sánh với rabbitmq
---

# Redis là gì và so sánh với RabbitMQ

## 1. Redis là gì?

**Redis** (REmote DIctionary Server) là một **in-memory data store** mã nguồn mở, được Salvatore Sanfilippo (antirez) tạo ra năm 2009. Redis lưu dữ liệu trực tiếp trong RAM dưới dạng key-value, hỗ trợ nhiều cấu trúc dữ liệu phong phú (string, list, hash, set, sorted set, stream, bitmap, hyperloglog, geo...).

## 2. Redis sinh ra để giải quyết bài toán gì?

### Bối cảnh ra đời

Antirez đang xây dựng một web analytics tool tên là **LLOOGG.com**. Hệ thống cần ghi nhận hành vi người dùng theo thời gian thực với hàng nghìn lượt ghi mỗi giây. MySQL không thể đáp ứng được tải này — disk I/O trở thành nút cổ chai, và việc scaling theo chiều ngang cũng phức tạp.

Antirez quyết định viết một data store **giữ toàn bộ dữ liệu trong RAM**, tối ưu cho tốc độ ghi/đọc cực cao, và đó là Redis.

### Những bài toán Redis giải quyết tốt
```
| Bài toán                  | Mô tả                         

| **Caching**               | Giảm tải cho database chính, tăng tốc response time | String, Hash |
| **Session storage**       | Lưu session người dùng trong các hệ thống stateless / microservices | Hash, String + TTL          |
| **Rate limiting**         | Giới hạn số request từ một user/IP | String (INCR) + TTL |
| **Real-time leaderboard** | Bảng xếp hạng game, top user, trending | Sorted Set |
| **Counter / analytics**   | Đếm view, like, click theo thời gian thực | String (INCR), HyperLogLog |
| **Pub/Sub**               | Truyền message giữa các service theo mô hình publisher–subscriber | Pub/Sub channel |
| **Queue / Job queue**     | Hàng đợi tác vụ đơn giản | List (LPUSH/RPOP), Stream |
| **Distributed lock**      | Đồng bộ giữa nhiều instance trong cluster | SET NX EX, Redlock |
| **Geo search**            | Tìm địa điểm theo bán kính | Geo (GEOADD, GEOSEARCH) |
| **Full-text search nhẹ**  | Search nhanh trên tập dữ liệu vừa phải | RediSearch module |
```
### Điểm cốt lõi

Redis được sinh ra để **giải quyết bài toán hiệu năng**: khi bạn cần đọc/ghi dữ liệu với độ trễ tính bằng micro-giây, trên tập dữ liệu không quá lớn (vừa với RAM), với cấu trúc dữ liệu phong phú hơn key-value đơn giản.

---

## 3. So sánh Redis và RabbitMQ

Trước hết cần làm rõ: **đây là hai loại công cụ khác nhau về bản chất**, nhưng vùng giao thoa của chúng là **messaging** (Redis có Pub/Sub và Streams, RabbitMQ là message broker chuyên dụng). Vì vậy việc so sánh chủ yếu có ý nghĩa khi xét trong ngữ cảnh "dùng cái nào để truyền message".

### Bản chất

|                    | **Redis**                                      | **RabbitMQ** |

| **Loại**           | In-memory data store (kèm tính năng messaging) | Message broker chuyên dụng |
| **Mục đích chính** | Cache, lưu trữ tốc độ cao, structure data      | Truyền message tin cậy giữa các service |
| **Giao thức**      | RESP (Redis protocol)                          | AMQP 0-9-1 (chính), hỗ trợ MQTT, STOMP |
| **Ngôn ngữ viết**  | C                                              | Erlang |

### So sánh theo khía cạnh messaging
```
| Tiêu chí                    | **Redis (Pub/Sub & Streams)** | **RabbitMQ** |

| **Tốc độ**                  | Cực nhanh (micro-giây), throughput rất cao | Chậm hơn nhưng vẫn rất tốt (hàng chục nghìn msg/s) |
| **Độ tin cậy (durability)** | Pub/Sub: fire-and-forget, mất message nếu subscriber offline. Streams: có persistence       | Mặc định persistent, có ack/confirm, message không mất nếu broker chưa xác nhận |
| **Delivery guarantee**      | Pub/Sub: at-most-once. Streams: at-least-once | At-least-once (mặc định), có thể cấu hình để gần exactly-once |
| **Routing**                 | Đơn giản: theo channel name hoặc pattern | Rất mạnh: exchanges (direct, topic, fanout, headers), bindings, routing keys |
| **Consumer group**          | Có (Redis Streams với XREADGROUP) | Có (queue + multiple consumers, prefetch, fair dispatch) |
| **Acknowledgement**         | Streams có XACK. Pub/Sub không có | Có ack/nack đầy đủ, requeue, DLQ (Dead Letter Queue) |
| **Message ordering**        | Có trong Streams, theo entry ID | Có trong từng queue |
| **Retry & DLQ**             | Phải tự implement | Hỗ trợ sẵn (DLX – Dead Letter Exchange) |
| **Backpressure**            | Hạn chế | Có cơ chế prefetch / QoS tốt |
| **Quản lý / monitoring**    | CLI, RedisInsight | Web UI (RabbitMQ Management) rất đầy đủ |
| **Học & vận hành**          | Dễ tiếp cận, ít khái niệm | Nhiều khái niệm hơn (exchange, binding, vhost, queue type...) |
```
### Khi nào dùng cái nào?

**Chọn Redis khi:**
- Cần cache, session, rate limiting, counter, leaderboard — đây là use case chính
- Cần messaging **siêu nhanh** và chấp nhận có thể mất message (notification real-time, live update không quan trọng)
- Pipeline xử lý event đơn giản, throughput cao, dùng Redis Streams
- Đã có Redis trong stack và không muốn thêm thành phần mới chỉ vì một queue đơn giản

**Chọn RabbitMQ khi:**
- Cần **đảm bảo message không mất** (giao dịch tài chính, đặt hàng, gửi email/SMS)
- Cần **routing phức tạp** (một message đi đến nhiều consumer theo nhiều rule khác nhau)
- Cần **retry, DLQ, delayed message** ngay từ broker
- Hệ thống microservices với nhiều luồng xử lý bất đồng bộ
- Cần backpressure rõ ràng để consumer chậm không bị quá tải

### Tóm tắt một câu

> **Redis** là "dao đa năng tốc độ cao" — nhanh, đa dụng, đơn giản. **RabbitMQ** là "đường ray có công tắc và bộ đếm" — chậm hơn Redis ở mặt thuần messaging, nhưng đảm bảo message đi đúng nơi và không bị mất.

Trong thực tế, **nhiều hệ thống dùng cả hai**: Redis cho cache + pub/sub nhẹ, RabbitMQ (hoặc Kafka) cho các pipeline xử lý nghiệp vụ quan trọng.
