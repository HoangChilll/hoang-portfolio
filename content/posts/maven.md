---
title: Maven & Gradle Fundamentals
date: 2026-08-06
tags: [java, maven, gradle, build-tool, dependency]
description: Kiến thức nền tảng về Maven và Gradle: Dependency, Repository, Lifecycle, Plugin.
---

# Maven & Gradle Fundamentals

## 1. Tại sao Maven/Gradle ra đời?

Trước đây, khi phát triển Java, mỗi thư viện đều phải tải thủ công dưới dạng `.jar`, sau đó thêm vào project.

Ví dụ:

```
lib/
    spring.jar
    mysql.jar
    junit.jar
    lombok.jar
```

Nhược điểm:

- Phải tự tải từng thư viện.
- Dễ thiếu dependency.
- Khó nâng cấp phiên bản.
- Khó chia sẻ project cho người khác.

Để giải quyết vấn đề đó, **Build Tool** ra đời.

Hai Build Tool phổ biến nhất:

- Maven
- Gradle

---

# Build Tool là gì?

Build Tool là công cụ tự động hóa quá trình build project.

Thay vì tự làm từng bước:

- Download thư viện
- Compile
- Chạy test
- Đóng gói
- Triển khai

chỉ cần chạy một lệnh:

```bash
mvn package
```

hoặc

```bash
./gradlew build
```

Build Tool sẽ tự thực hiện toàn bộ quy trình.

---

# Dependency

## Dependency là gì?

Dependency là thư viện mà project cần để hoạt động.

Ví dụ:

Project cần sử dụng

- Spring MVC
- Jackson
- MySQL Driver
- Lombok

thì các thư viện này chính là **dependency**.

Ví dụ:

```java
@RestController
```

Annotation này thuộc thư viện:

```
spring-web
```

Nếu xóa dependency đó, project sẽ không compile được.

---

## Khai báo Dependency

Trong Maven:

```xml
<dependencies>

    <dependency>

        <groupId>org.springframework.boot</groupId>

        <artifactId>spring-boot-starter-web</artifactId>

        <version>3.5.0</version>

    </dependency>

</dependencies>
```

Maven sẽ tự tải thư viện.

---

## groupId

Định danh tổ chức hoặc công ty phát hành thư viện.

Ví dụ:

```
org.springframework

com.google

org.apache
```

---

## artifactId

Tên của thư viện.

Ví dụ:

```
spring-web

spring-security

spring-data-jpa
```

---

## version

Phiên bản của thư viện.

Ví dụ:

```
3.5.0
```

---

# Transitive Dependency

Một dependency có thể phụ thuộc vào nhiều dependency khác.

Ví dụ:

```
Project

↓

spring-boot-starter-web

↓

spring-web

↓

jackson

↓

tomcat

↓

logging
```

Mặc dù chỉ khai báo:

```
spring-boot-starter-web
```

Maven vẫn tự tải toàn bộ thư viện phụ thuộc.

Đây gọi là **Transitive Dependency**.

---

# Repository

## Repository là gì?

Repository là nơi lưu trữ **artifact**.

Artifact là sản phẩm Maven quản lý.

Ví dụ:

```
spring-web.jar

mysql-connector.jar

lombok.jar
```

---

## Local Repository

Kho lưu trữ nằm trên máy tính.

Đường dẫn:

Windows

```
C:\Users\<username>\.m2\repository
```

Linux/macOS

```
~/.m2/repository
```

Lần đầu build:

```
Project

↓

Remote Repository

↓

Download

↓

Lưu vào .m2
```

Những lần sau:

```
Project

↓

.m2

↓

Dùng luôn
```

Không cần tải lại.

---

## Remote Repository

Là kho lưu trữ trên Internet.

Ví dụ:

- Maven Central

Chứa hàng triệu thư viện Java.

Nếu Local Repository chưa có dependency thì Maven sẽ tải từ Remote Repository.

---

## Repository nội bộ công ty

Nhiều công ty sử dụng:

- Nexus
- Artifactory

để lưu các thư viện nội bộ.

Quy trình:

```
Developer

↓

Company Repository

↓

Maven Central
```

Nhờ đó các project trong công ty có thể dùng chung thư viện.

---

# Lifecycle

## Lifecycle là gì?

Lifecycle là chuỗi các bước Maven thực hiện để build project.

```
validate

↓

compile

↓

test

↓

package

↓

install

↓

deploy
```

Mỗi phase đều có một nhiệm vụ riêng.

---

## validate

Kiểm tra project.

Ví dụ:

- pom.xml hợp lệ hay không.
- Thiếu dependency hay không.

Nếu lỗi, Maven dừng ngay.

---

## compile

Biên dịch mã nguồn.

```
.java

↓

.class
```

Thực chất Maven gọi trình biên dịch Java (`javac`).

---

## test

Chạy Unit Test.

Nếu test thất bại, Maven sẽ dừng quá trình build.

---

## package

Đóng gói project.

Ví dụ:

```
.class

↓

.jar
```

hoặc

```
.war
```

Đây là sản phẩm có thể chạy hoặc phát hành.

---

## install

Sau khi package xong, Maven copy artifact vào Local Repository (`.m2`).

```
Project

↓

package

↓

myapp.jar

↓

.m2/repository
```

Nhờ đó các project khác trên cùng máy có thể sử dụng.

---

## deploy

Upload artifact lên Remote Repository.

Ví dụ:

- Nexus
- Artifactory

để các thành viên khác hoặc CI/CD có thể tải về.

---

# Tính kế thừa của Lifecycle

Các phase không hoạt động độc lập.

Ví dụ:

```
mvn package
```

Maven sẽ chạy:

```
validate

↓

compile

↓

test

↓

package
```

Nếu chạy:

```
mvn install
```

Maven sẽ chạy:

```
validate

↓

compile

↓

test

↓

package

↓

install
```

Nếu chạy:

```
mvn deploy
```

Maven sẽ chạy toàn bộ Lifecycle.

---

# Plugin

## Plugin là gì?

Plugin là thành phần thực hiện công việc trong từng phase của Lifecycle.

Có thể hiểu:

```
Lifecycle

↓

Quy trình

Plugin

↓

Người thực hiện
```

Ví dụ:

Compile

↓

```
maven-compiler-plugin
```

Test

↓

```
maven-surefire-plugin
```

Package

↓

```
maven-jar-plugin
```

Spring Boot

↓

```
spring-boot-maven-plugin
```

Lifecycle chỉ định **phải làm gì**, còn Plugin quyết định **làm bằng cách nào**.

---

# Maven Build Flow

```
Source Code

↓

Dependency Resolution

↓

validate

↓

compile

↓

test

↓

package

↓

install

↓

deploy
```

---

# Maven vs Gradle

| Maven | Gradle |
|--------|---------|
| XML (`pom.xml`) | Groovy/Kotlin DSL |
| Dễ học | Linh hoạt hơn |
| Convention-based | Configurable hơn |
| Chậm hơn ở project lớn | Nhanh hơn nhờ Incremental Build và Build Cache |

---

# Tổng kết

## Repository

Trả lời câu hỏi:

> Artifact được lưu ở đâu?

- Local Repository (`.m2`)
- Remote Repository (Maven Central)
- Company Repository (Nexus, Artifactory)

---

## Lifecycle

Trả lời câu hỏi:

> Maven phải làm những bước nào để tạo ra sản phẩm?

```
validate

↓

compile

↓

test

↓

package

↓

install

↓

deploy
```

---

## Dependency

Thư viện mà project cần để hoạt động.

---

## Transitive Dependency

Dependency của dependency.

Maven sẽ tự động tải toàn bộ.

---

## Plugin

Thành phần thực hiện công việc trong từng phase của Lifecycle.

Lifecycle định nghĩa **quy trình**, Plugin thực thi **quy trình**.

---

## Tổng kết

- **Dependency** → Project cần thư viện gì?
- **Repository** → Thư viện được lưu ở đâu?
- **Lifecycle** → Maven build theo những bước nào?
- **Plugin** → Thành phần thực hiện từng bước build.