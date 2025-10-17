---
layout: ../../../layouts/BlogPost.astro
title: '🚀 Spring Boot 3 + Lombok: สร้าง CRUD Microservice API ที่สุดคลีนและเร็ว!'
description: 'เบื่อโค้ดเยอะ? มาดูวิธีสร้าง RESTful CRUD API ฉบับงานจริงด้วย Spring Boot 3, Lombok, และ Spring Data JPA พร้อมเจาะลึก Path/Query Parameters, API Versioning, และเอกสาร OpenAPI (Swagger) สำหรับงาน Production'
date: '2022-10-16'
published: true
---

# 🚀 สร้าง Backend API ฉบับมืออาชีพด้วย Spring Boot 3 (Clean Code + Best Practice)

**Spring Boot** เป็นเครื่องมือหลักในการสร้าง **Microservice** ที่มีประสิทธิภาพสูง บทความนี้จะแสดงวิธีการสร้าง **RESTful CRUD API** สำหรับจัดการ **Resource "Product"** โดยใช้ **External Libraries** และแนวทางปฏิบัติที่ทันสมัย:

- **Lombok:** ลดโค้ด **boilerplate** (โค้ดซ้ำซาก) เช่น Getter/Setter/Constructor
- **OpenAPI (Swagger):** สร้าง Interactive API Documentation อัตโนมัติ
- **Layered Architecture:** การแยกส่วนประกอบเพื่อความยืดหยุ่นในการ Scale และ Maintenance

---

## 📋 สิ่งที่ต้องเตรียมก่อนเริ่ม (Prerequisites)

### เครื่องมือและ Software ที่จำเป็น:

- **Java 17** หรือสูงกว่า (LTS version)
- **Maven 3.6+** หรือ **Gradle 7+**
- **IDE:** IntelliJ IDEA (Community/Ultimate) หรือ VS Code + Java Extension Pack
- **Postman** หรือ **cURL** สำหรับทดสอบ API
- **Git** สำหรับ Version Control
- ความรู้พื้นฐาน Java, OOP, และ Spring Framework

### ตรวจสอบ Java Version:

```bash
java -version
# ควรเห็น: openjdk version "17.0.x" หรือสูงกว่า

mvn -version
# ควรเห็น: Apache Maven 3.6.x หรือสูงกว่า
```

### ติดตั้ง Java (ถ้ายังไม่มี):

```bash
# macOS (ใช้ Homebrew)
brew install openjdk@17

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install openjdk-17-jdk

# Windows
# ดาวน์โหลดจาก: https://adoptium.net/
```

### Setup IntelliJ IDEA:

1. ดาวน์โหลด IntelliJ IDEA: https://www.jetbrains.com/idea/download/
2. ติดตั้ง Plugins:
   - Lombok Plugin (สำหรับ code generation)
   - Spring Boot Assistant
   - Rainbow Brackets (optional, แต่แนะนำ)

### Setup VS Code:

```bash
# ติดตั้ง Extension Pack for Java
code --install-extension vscjava.vscode-java-pack

# ติดตั้ง Spring Boot Extension
code --install-extension vmware.vscode-spring-boot

# ติดตั้ง Lombok Annotations Support
code --install-extension GabrielBB.vscode-lombok
```

---

## 💡 โครงสร้าง Microservice 4-Layer: ทำไมต้องมี Service Layer? (Best Practice)

การสร้าง **Application** ในรูปแบบ **4-Layered Architecture** (Controller, Service, Repository) เป็น **Best Practice** ที่ช่วยให้โค้ดของคุณ **Flexible**, **Maintainable**, และ **Testable** โดยมี **Service Layer** เป็นหัวใจสำคัญที่จัดการ **Business Logic**

| Layer                            | Component            | หน้าที่ (What it does)                                                                                                          | เหตุผลและ Best Practice                                                                                     |
| :------------------------------- | :------------------- | :------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------- |
| **1. Controller (Presentation)** | `ProductController`  | รับ **HTTP Request**, แปลง **JSON** เป็น **Object**, ตรวจสอบ **Validation** เบื้องต้น                                           | **BP:** ควรมี Logic น้อยที่สุด เพียงแค่รับ Input และส่งต่อให้ Service เท่านั้น                              |
| **2. Service (Business Logic)**  | `ProductService`     | จัดการ **Business Logic** ทั้งหมด (เช่น การคำนวณส่วนลด, การตรวจสอบเงื่อนไขสต็อก, Transaction Management) และเรียกใช้ Repository | **BP:** เป็นหัวใจหลักของ Application ห้าม Controller หรือ Repository เข้าถึงกันโดยตรง ต้องผ่าน Service เสมอ |
| **3. Repository (Data Access)**  | `ProductRepository`  | ติดต่อกับ **Database** โดยตรง จัดการ **CRUD Operations**                                                                        | **BP:** เป็น Interface ที่ใช้สื่อสารกับ DB เท่านั้น ห้ามมี Business Logic อยู่ใน Repository                 |
| **4. Model (Data)**              | **Entity** & **DTO** | กำหนดโครงสร้างข้อมูลและควบคุมการรับส่งข้อมูล                                                                                    | **BP:** **Entity** ใช้ Mapping กับ DB **DTO** ใช้สื่อสารกับ Client แยกกันเพื่อ Clean Code และ Security      |

---

## 📁 โครงสร้างโปรเจกต์แบบสมบูรณ์

```
spring-boot-product-api/
├── src/
│   ├── main/
│   │   ├── java/com/example/
│   │   │   ├── ProductApplication.java          # Main application class
│   │   │   ├── config/
│   │   │   │   └── OpenApiConfig.java          # Swagger/OpenAPI configuration
│   │   │   ├── controller/
│   │   │   │   └── ProductController.java      # REST endpoints
│   │   │   ├── service/
│   │   │   │   └── ProductService.java         # Business logic
│   │   │   ├── repository/
│   │   │   │   └── ProductRepository.java      # Data access (JPA)
│   │   │   ├── model/
│   │   │   │   └── Product.java                # Entity (Database mapping)
│   │   │   ├── dto/
│   │   │   │   ├── ProductDTO.java             # Data Transfer Object
│   │   │   │   └── ProductResponseDTO.java     # Response wrapper
│   │   │   └── exception/
│   │   │       ├── ResourceNotFoundException.java
│   │   │       ├── ValidationException.java
│   │   │       └── GlobalExceptionHandler.java # Centralized error handling
│   │   └── resources/
│   │       ├── application.properties           # Development configuration
│   │       ├── application-prod.properties      # Production configuration
│   │       └── application-test.properties      # Test configuration
│   └── test/
│       └── java/com/example/
│           ├── controller/
│           │   └── ProductControllerTest.java
│           ├── service/
│           │   └── ProductServiceTest.java
│           └── repository/
│               └── ProductRepositoryTest.java
├── .gitignore
├── pom.xml                                      # Maven dependencies
├── Dockerfile                                   # Docker configuration
├── docker-compose.yml                           # Multi-container setup
└── README.md
```

**คำอธิบายโครงสร้าง:**

| โฟลเดอร์/ไฟล์ | หน้าที่                                         |
| :------------ | :---------------------------------------------- |
| `controller/` | HTTP request handlers และ response formatting   |
| `service/`    | Business logic layer และ transaction management |
| `repository/` | Database access layer (Spring Data JPA)         |
| `model/`      | JPA entities (database tables)                  |
| `dto/`        | Data Transfer Objects (API request/response)    |
| `exception/`  | Custom exceptions และ global error handling     |
| `config/`     | Application configuration classes               |
| `resources/`  | Properties files, static resources              |
| `test/`       | Unit tests และ integration tests                |

---

## ⚙️ ขั้นตอนที่ 1: การเตรียม Dependencies (pom.xml)

**Dependencies** คือ **External Libraries** ที่เราเรียกให้ **Project** ของเรานำมาใช้งาน การกำหนดใน `pom.xml` (สำหรับ Maven) จะทำให้ **Project** รู้ว่าต้อง **Build** และ **Run** โดยใช้โค้ดจาก **Libraries** เหล่านี้

### 1.1 สร้าง Project ด้วย Spring Initializr

ไปที่ https://start.spring.io/ และเลือก:

- **Project:** Maven
- **Language:** Java
- **Spring Boot:** 3.2.x (latest stable)
- **Packaging:** Jar
- **Java:** 17

**Dependencies ที่ต้องเพิ่ม:**

- Spring Web
- Spring Data JPA
- H2 Database
- Lombok
- Spring Boot DevTools
- Validation

### 1.2 ไฟล์ `pom.xml` ฉบับสมบูรณ์:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>product-api</artifactId>
    <version>1.0.0</version>
    <name>Product API</name>
    <description>RESTful CRUD API with Spring Boot 3</description>

    <properties>
        <java.version>17</java.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- Spring Boot Web: สำหรับสร้าง REST API -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA: สำหรับติดต่อ Database -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- H2 Database: In-memory database สำหรับ Development -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok: ลดโค้ด boilerplate -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Validation: สำหรับ Bean Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- SpringDoc OpenAPI: สร้าง Swagger UI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.3.0</version>
        </dependency>

        <!-- DevTools: Hot reload สำหรับ Development -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Testing Dependencies -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

**คำอธิบาย Dependencies สำคัญ:**

| Dependency                       | ประโยชน์                                       |
| :------------------------------- | :--------------------------------------------- |
| `spring-boot-starter-web`        | สร้าง REST API, รองรับ JSON, Tomcat embedded   |
| `spring-boot-starter-data-jpa`   | ORM สำหรับติดต่อ Database                      |
| `h2`                             | In-memory database (ง่ายสำหรับ Development)    |
| `lombok`                         | Generate Getter/Setter/Constructor อัตโนมัติ   |
| `spring-boot-starter-validation` | Validation annotations (@NotNull, @Size, etc.) |
| `springdoc-openapi`              | สร้าง Swagger UI documentation                 |
| `spring-boot-devtools`           | Auto-restart เมื่อมีการเปลี่ยนโค้ด             |

---

## ⚙️ ขั้นตอนที่ 1.5: Configuration Files

### 1.5.1 Development Configuration: `application.properties`

สร้างไฟล์ `src/main/resources/application.properties`:

```properties
# ===============================
# APPLICATION
# ===============================
spring.application.name=Product API

# ===============================
# SERVER CONFIGURATION
# ===============================
server.port=8080
server.servlet.context-path=/
server.error.include-message=always
server.error.include-binding-errors=always

# ===============================
# H2 DATABASE CONFIGURATION
# ===============================
spring.datasource.url=jdbc:h2:mem:productdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# ===============================
# JPA / HIBERNATE CONFIGURATION
# ===============================
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.use_sql_comments=true

# ===============================
# H2 CONSOLE (Web UI for Database)
# ===============================
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.h2.console.settings.web-allow-others=false

# ===============================
# OPENAPI / SWAGGER CONFIGURATION
# ===============================
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.disable-swagger-default-url=true

# ===============================
# LOGGING CONFIGURATION
# ===============================
logging.level.root=INFO
logging.level.com.example=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %logger{36} - %msg%n

# ===============================
# JACKSON CONFIGURATION (JSON)
# ===============================
spring.jackson.serialization.write-dates-as-timestamps=false
spring.jackson.time-zone=Asia/Bangkok
```

**คำอธิบาย Settings สำคัญ:**

| Property                  | คำอธิบาย                                            |
| :------------------------ | :-------------------------------------------------- |
| `ddl-auto=create-drop`    | สร้างตารางใหม่ทุกครั้งที่รัน (Development เท่านั้น) |
| `show-sql=true`           | แสดง SQL queries ที่ถูก execute                     |
| `format_sql=true`         | จัดรูปแบบ SQL ให้อ่านง่าย                           |
| `h2.console.enabled=true` | เปิดใช้งาน H2 Web Console ที่ `/h2-console`         |
| `include-message=always`  | แสดง error message ใน response                      |

### 1.5.2 Production Configuration: `application-prod.properties`

สร้างไฟล์ `src/main/resources/application-prod.properties`:

```properties
# ===============================
# PRODUCTION CONFIGURATION
# ===============================

# Database (ใช้ PostgreSQL หรือ MySQL จริง)
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

# H2 Console
spring.h2.console.enabled=false

# Logging
logging.level.root=WARN
logging.level.com.example=INFO

# Error Handling
server.error.include-message=never
server.error.include-binding-errors=never
server.error.include-stacktrace=never
```

### 1.5.3 Test Configuration: `application-test.properties`

สร้างไฟล์ `src/main/resources/application-test.properties`:

```properties
# ===============================
# TEST CONFIGURATION
# ===============================
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false
logging.level.root=WARN
```

### 1.5.4 วิธีเปลี่ยน Profile:

```bash
# Development (default)
./mvnw spring-boot:run

# Production
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod

# Test
./mvnw test

# ผ่าน Environment Variable
export SPRING_PROFILES_ACTIVE=prod
./mvnw spring-boot:run

# ผ่าน Command Line Argument
java -jar target/product-api-1.0.0.jar --spring.profiles.active=prod
```

---

## 💻 ขั้นตอนที่ 2: Data Model (Entity และ DTO)

### 2.1 Entity Model: `com.example.model.Product.java`

**Entity** คือ Java Object ที่ใช้ **Mapping** กับตารางใน Database โดยตรง

Entity เป็นคลาสที่แทนโครงสร้างของตารางในฐานข้อมูล โดยแต่ละ Field ในคลาสจะสอดคล้องกับแต่ละ Column ในตาราง ใช้ JPA Annotations เช่น @Entity, @Table, @Id เพื่อกำหนดการ Mapping และใช้งานร่วมกับ ORM (Object-Relational Mapping) เพื่อจัดการข้อมูลในฐานข้อมูลโดยไม่ต้องเขียน SQL โดยตรง

```java
package com.example.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Product Entity
 * แทนตาราง 'products' ใน Database
 */
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_name", columnList = "name"),
    @Index(name = "idx_product_price", columnList = "price")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private Double price;

    @Column(nullable = false)
    private Integer stock;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

**คำอธิบาย Annotations:**

| Annotation           | ความหมาย                                                  |
| :------------------- | :-------------------------------------------------------- |
| `@Entity`            | กำหนดให้คลาสนี้เป็น JPA Entity (ตารางใน Database)         |
| `@Table`             | กำหนดชื่อตารางและ index                                   |
| `@Id`                | กำหนดให้ field นี้เป็น Primary Key                        |
| `@GeneratedValue`    | ให้ Database generate ID อัตโนมัติ (Auto-increment)       |
| `@Column`            | กำหนด properties ของ column (nullable, length, precision) |
| `@CreationTimestamp` | บันทึกเวลาที่สร้างอัตโนมัติ                               |
| `@UpdateTimestamp`   | อัปเดตเวลาแก้ไขอัตโนมัติ                                  |
| `@Data` (Lombok)     | สร้าง Getter, Setter, toString, equals, hashCode          |
| `@Builder` (Lombok)  | สร้าง Builder pattern สำหรับสร้าง Object                  |

### 2.2 DTO Model: `com.example.dto.ProductDTO.java`

**DTO** (Data Transfer Object) ใช้รับและส่งข้อมูลผ่าน API โดยเฉพาะ

DTO เป็นคลาสที่ออกแบบมาเพื่อถ่ายโอนข้อมูลระหว่าง Client และ Server ผ่าน API เท่านั้น ช่วยแยก Structure ของข้อมูลที่แสดงออกไปจาก Entity จริงในฐานข้อมูล ทำให้สามารถควบคุมได้ว่าจะส่งข้อมูลส่วนไหนออกไป ซ่อนข้อมูลที่ Sensitive และป้องกันปัญหา Over-fetching หรือ Expose ข้อมูลที่ไม่จำเป็นออกไป

```java
package com.example.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Value;

/**
 * ProductDTO - Data Transfer Object
 * ใช้สำหรับรับและส่งข้อมูล Product ผ่าน API
 */
@Value
@Builder
@Schema(description = "Product information for create/update operations")
public class ProductDTO {

    @Schema(description = "Product name", example = "MacBook Pro 14\"", required = true)
    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 200, message = "Product name must be between 3 and 200 characters")
    String name;

    @Schema(description = "Product description", example = "Apple M3 Pro chip, 18GB RAM, 512GB SSD")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    String description;

    @Schema(description = "Product price in THB", example = "89900.00", required = true)
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @DecimalMin(value = "0.01", message = "Price must be at least 0.01")
    @DecimalMax(value = "9999999.99", message = "Price must not exceed 9,999,999.99")
    Double price;

    @Schema(description = "Stock quantity", example = "50", required = true)
    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    @Max(value = 999999, message = "Stock must not exceed 999,999")
    Integer stock;
}
```

### 2.3 Response DTO: `com.example.dto.ProductResponseDTO.java`

```java
package com.example.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

/**
 * ProductResponseDTO - Response Object
 * ใช้สำหรับส่งข้อมูล Product กลับไปยัง Client (รวมถึง ID และ timestamps)
 */
@Value
@Builder
@Schema(description = "Product response with all details")
public class ProductResponseDTO {

    @Schema(description = "Product ID", example = "1")
    Long id;

    @Schema(description = "Product name", example = "MacBook Pro 14\"")
    String name;

    @Schema(description = "Product description")
    String description;

    @Schema(description = "Product price", example = "89900.00")
    Double price;

    @Schema(description = "Stock quantity", example = "50")
    Integer stock;

    @Schema(description = "Creation timestamp", example = "2025-01-15T10:30:00")
    LocalDateTime createdAt;

    @Schema(description = "Last update timestamp", example = "2025-01-16T14:20:00")
    LocalDateTime updatedAt;
}
```

**คำอธิบาย Validation Annotations:**

| Annotation                    | ความหมาย                               |
| :---------------------------- | :------------------------------------- |
| `@NotBlank`                   | ห้ามเป็น null, ว่าง, หรือมีแต่ช่องว่าง |
| `@NotNull`                    | ห้ามเป็น null                          |
| `@Size`                       | กำหนดความยาว (min, max)                |
| `@Positive`                   | ต้องเป็นเลขบวก (> 0)                   |
| `@Min` / `@Max`               | กำหนดค่าต่ำสุด/สูงสุด                  |
| `@DecimalMin` / `@DecimalMax` | สำหรับทศนิยม                           |
| `@Schema`                     | Swagger documentation                  |

---

## 🚨 ขั้นตอนที่ 2.5: Exception Handling

### 2.5.1 Custom Exception: `com.example.exception.ResourceNotFoundException.java`

```java
package com.example.exception;

/**
 * Custom Exception สำหรับกรณีไม่พบข้อมูล
 * จะถูกแปลงเป็น HTTP 404 Not Found
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(String.format("%s not found with id: %d", resourceName, id));
    }
}
```

### 2.5.2 Validation Exception: `com.example.exception.ValidationException.java`

```java
package com.example.exception;

/**
 * Custom Exception สำหรับ Validation errors
 * จะถูกแปลงเป็น HTTP 400 Bad Request
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String field, String message) {
        super(String.format("Validation failed for field '%s': %s", field, message));
    }
}
```

### 2.5.3 Global Exception Handler: `com.example.exception.GlobalExceptionHandler.java`

```java
package com.example.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Global Exception Handler
 * จัดการ Error ทุกชนิดในระบบจากจุดเดียว
 * ใช้ @ControllerAdvice เพื่อให้ทำงานกับทุก Controller
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * จัดการ ResourceNotFoundException (HTTP 404)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex,
            WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Not Found");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    /**
     * จัดการ ValidationException (HTTP 400)
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            ValidationException ex,
            WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Validation Error");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /**
     * จัดการ Bean Validation Errors (HTTP 400)
     * เกิดขึ้นเมื่อ @Valid validation ล้มเหลว
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex,
            WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Validation Failed");

        // รวม validation errors ทั้งหมด
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        body.put("errors", errors);
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /**
     * จัดการ IllegalArgumentException (HTTP 400)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex,
            WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /**
     * จัดการ Generic Exception ทั่วไป (HTTP 500)
     * Catch-all สำหรับ errors ที่ไม่ได้ระบุไว้
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalException(
            Exception ex,
            WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message", "An unexpected error occurred");
        body.put("details", ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        // Log error สำหรับ debugging (ใน production ควรใช้ proper logging framework)
        ex.printStackTrace();

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

**คำอธิบาย Annotations:**

| Annotation              | ความหมาย                                                          |
| :---------------------- | :---------------------------------------------------------------- |
| `@RestControllerAdvice` | กำหนดให้คลาสนี้เป็น Global Exception Handler สำหรับทุก Controller |
| `@ExceptionHandler`     | กำหนด method ที่จัดการ exception ชนิดเฉพาะ                        |
| `WebRequest`            | ให้ข้อมูลเกี่ยวกับ HTTP request ที่เกิด error                     |

---

## 💾 ขั้นตอนที่ 3: Repository Layer

### 3.1 Repository Interface: `com.example.repository.ProductRepository.java`

**Repository** ทำหน้าที่เป็นสะพานเชื่อมระหว่างโค้ด Java กับ Database จัดการเฉพาะ **Data Access**

```java
package com.example.repository;

import com.example.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ProductRepository Interface
 * สืบทอดจาก JpaRepository ทำให้ได้ CRUD methods ฟรี ๆ มา
 * JpaRepository<Entity Type, Primary Key Type>
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Custom Query Methods
     * Spring Data JPA จะสร้าง implementation ให้อัตโนมัติ
     * จากชื่อ method
     */

    // หา Products ที่มีชื่อตรงกับ name
    List<Product> findByName(String name);

    // หา Products ที่ชื่อมี keyword (LIKE '%keyword%')
    List<Product> findByNameContainingIgnoreCase(String keyword);

    // หา Products ที่ราคาอยู่ในช่วงที่กำหนด
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);

    // หา Products ที่สต็อกต่ำกว่าค่าที่กำหนด
    List<Product> findByStockLessThan(Integer stock);

    // หา Products ที่ราคามากกว่าค่าที่กำหนด และเรียงตามราคา
    List<Product> findByPriceGreaterThanOrderByPriceAsc(Double price);

    // ตรวจสอบว่ามีสินค้าชื่อนี้อยู่แล้วหรือไม่
    boolean existsByName(String name);

    // นับจำนวนสินค้าที่ชื่อมี keyword
    long countByNameContaining(String keyword);

    /**
     * Custom JPQL Query
     * ใช้เมื่อต้องการ query ที่ซับซ้อนกว่า
     */
    @Query("SELECT p FROM Product p WHERE p.price < :maxPrice AND p.stock > :minStock")
    List<Product> findAffordableProductsInStock(
        @Param("maxPrice") Double maxPrice,
        @Param("minStock") Integer minStock
    );

    /**
     * Native SQL Query
     * ใช้เมื่อต้องการเขียน SQL โดยตรง
     */
    @Query(value = "SELECT * FROM products WHERE LOWER(name) LIKE LOWER(CONCAT('%', :keyword, '%'))",
           nativeQuery = true)
    List<Product> searchByKeyword(@Param("keyword") String keyword);
}
```

**คำอธิบาย JPA Repository Methods:**

| Method Pattern             | SQL ที่ถูกสร้าง                   | ตัวอย่าง                         |
| :------------------------- | :-------------------------------- | :------------------------------- |
| `findBy[Field]`            | `WHERE field = ?`                 | `findByName("MacBook")`          |
| `findBy[Field]Containing`  | `WHERE field LIKE '%?%'`          | `findByNameContaining("Mac")`    |
| `findBy[Field]Between`     | `WHERE field BETWEEN ? AND ?`     | `findByPriceBetween(1000, 5000)` |
| `findBy[Field]LessThan`    | `WHERE field < ?`                 | `findByStockLessThan(10)`        |
| `findBy[Field]GreaterThan` | `WHERE field > ?`                 | `findByPriceGreaterThan(1000)`   |
| `existsBy[Field]`          | `SELECT COUNT(*) WHERE field = ?` | `existsByName("MacBook")`        |
| `countBy[Field]`           | `SELECT COUNT(*) WHERE field = ?` | `countByNameContaining("Mac")`   |

**Methods ที่ได้ฟรีจาก JpaRepository:**

```java
// Create/Update
Product save(Product product)
List<Product> saveAll(Iterable<Product> products)

// Read
Optional<Product> findById(Long id)
List<Product> findAll()
List<Product> findAllById(Iterable<Long> ids)
Page<Product> findAll(Pageable pageable)
boolean existsById(Long id)
long count()

// Delete
void deleteById(Long id)
void delete(Product product)
void deleteAll()
void deleteAll(Iterable<Product> products)
```

---

## 🧑‍💻 ขั้นตอนที่ 4: Service Layer

### 4.1 Service Implementation: `com.example.service.ProductService.java`

**Service Layer** เป็นชั้นที่รับผิดชอบ **Business Logic** ทั้งหมด และควบคุม **Transaction**

Service Layer เป็นส่วนกลางที่ประมวลผลตรรกะทางธุรกิจ เช่น การคำนวณ การตรวจสอบเงื่อนไข การประมวลผลข้อมูลก่อนบันทึก และการเรียกใช้ Repository เพื่อดำเนินการกับฐานข้อมูล นอกจากนี้ยังจัดการ Transaction เพื่อให้มั่นใจว่าการทำงานหลายขั้นตอนจะสำเร็จพร้อมกันหรือ Rollback ทั้งหมดเมื่อเกิดข้อผิดพลาด ใช้ @Service และ @Transactional Annotations

```java
package com.example.service;

import com.example.dto.ProductDTO;
import com.example.dto.ProductResponseDTO;
import com.example.exception.ResourceNotFoundException;
import com.example.exception.ValidationException;
import com.example.model.Product;
import com.example.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ProductService
 * Business Logic Layer สำหรับจัดการ Product
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * สร้าง Product ใหม่
     * @Transactional: ห่อ method ด้วย database transaction
     */
    @Transactional
    public ProductResponseDTO create(ProductDTO productDTO) {
        log.info("Creating new product: {}", productDTO.getName());

        // Business Logic: ตรวจสอบว่าชื่อสินค้าซ้ำหรือไม่
        if (productRepository.existsByName(productDTO.getName())) {
            throw new ValidationException("name", "Product with this name already exists");
        }

        // แปลง DTO เป็น Entity
        Product product = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .stock(productDTO.getStock())
                .build();

        // บันทึกลง Database
        Product savedProduct = productRepository.save(product);

        log.info("Product created successfully with ID: {}", savedProduct.getId());

        // แปลง Entity กลับเป็น Response DTO
        return toResponseDTO(savedProduct);
    }

    /**
     * ดึง Product ทั้งหมด (พร้อม Pagination)
     */
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> findAll(Pageable pageable) {
        log.info("Fetching all products with pagination: page={}, size={}",
                 pageable.getPageNumber(), pageable.getPageSize());

        Page<Product> productPage = productRepository.findAll(pageable);

        return productPage.map(this::toResponseDTO);
    }

    /**
     * ค้นหา Products ตามเงื่อนไข
     */
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> search(String keyword, Double minPrice, Double maxPrice) {
        log.info("Searching products: keyword={}, minPrice={}, maxPrice={}", keyword, minPrice, maxPrice);

        List<Product> products;

        if (keyword != null && !keyword.isBlank()) {
            // ค้นหาตาม keyword
            products = productRepository.findByNameContainingIgnoreCase(keyword);
        } else if (minPrice != null && maxPrice != null) {
            // ค้นหาตามช่วงราคา
            products = productRepository.findByPriceBetween(minPrice, maxPrice);
        } else {
            // ดึงทั้งหมด
            products = productRepository.findAll();
        }

        return products.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * ดึง Product ตาม ID
     */
    @Transactional(readOnly = true)
    public ProductResponseDTO findById(Long id) {
        log.info("Fetching product with ID: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        return toResponseDTO(product);
    }

    /**
     * อัปเดต Product
     */
    @Transactional
    public ProductResponseDTO update(Long id, ProductDTO productDTO) {
        log.info("Updating product with ID: {}", id);

        // ตรวจสอบว่ามี Product อยู่จริง
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        // Business Logic: ถ้าเปลี่ยนชื่อ ต้องตรวจสอบว่าชื่อใหม่ซ้ำกับของอื่นหรือไม่
        if (!existingProduct.getName().equals(productDTO.getName())
            && productRepository.existsByName(productDTO.getName())) {
            throw new ValidationException("name", "Product with this name already exists");
        }

        // Business Logic: ตรวจสอบ stock ว่าเป็นลบหรือไม่
        if (productDTO.getStock() < 0) {
            throw new ValidationException("stock", "Stock cannot be negative");
        }

        // อัปเดตข้อมูล
        existingProduct.setName(productDTO.getName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setStock(productDTO.getStock());

        // บันทึกการเปลี่ยนแปลง
        Product updatedProduct = productRepository.save(existingProduct);

        log.info("Product updated successfully: {}", updatedProduct.getId());

        return toResponseDTO(updatedProduct);
    }

    /**
     * ลบ Product
     */
    @Transactional
    public void delete(Long id) {
        log.info("Deleting product with ID: {}", id);

        // ตรวจสอบว่ามี Product อยู่จริง
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", id);
        }

        // Business Logic: ตรวจสอบเงื่อนไขก่อนลบ (ถ้ามี)
        // เช่น: ห้ามลบถ้ามีคนกำลัง order อยู่

        productRepository.deleteById(id);

        log.info("Product deleted successfully: {}", id);
    }

    /**
     * ดึง Products ที่สต็อกต่ำ
     */
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findLowStockProducts(Integer threshold) {
        log.info("Fetching products with stock less than: {}", threshold);

        List<Product> products = productRepository.findByStockLessThan(threshold);

        return products.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * นับจำนวน Products ทั้งหมด
     */
    @Transactional(readOnly = true)
    public long count() {
        return productRepository.count();
    }

    // ========================================
    // Helper Methods
    // ========================================

    /**
     * แปลง Entity เป็น Response DTO
     */
    private ProductResponseDTO toResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
```

**คำอธิบาย Annotations:**

| Annotation                          | ความหมาย                                                     |
| :---------------------------------- | :----------------------------------------------------------- |
| `@Service`                          | กำหนดให้คลาสนี้เป็น Service Component                        |
| `@RequiredArgsConstructor` (Lombok) | สร้าง Constructor สำหรับ final fields (Dependency Injection) |
| `@Slf4j` (Lombok)                   | สร้าง Logger อัตโนมัติ (ใช้ `log.info()`, `log.error()`)     |
| `@Transactional`                    | ห่อ method ด้วย database transaction                         |
| `@Transactional(readOnly = true)`   | Optimize สำหรับ read operations                              |

---

## 🌐 ขั้นตอนที่ 5: Controller Layer

### 5.1 Controller Implementation: `com.example.controller.ProductController.java`

**Controller** ทำหน้าที่เป็น **API Endpoint** ที่เรียกใช้ **Service** เพื่อทำงาน

Controller เป็นชั้นที่รับ HTTP Request จาก Client (เช่น GET, POST, PUT, DELETE) และส่งต่อไปยัง Service Layer เพื่อประมวลผล จากนั้นจะรับผลลัพธ์กลับมาและส่ง HTTP Response กลับไปยัง Client Controller ไม่ควรมี Business Logic แต่ทำหน้าที่เป็นตัวกลางในการรับส่งข้อมูลเท่านั้น ใช้ @RestController และ @RequestMapping Annotations เพื่อกำหนด Endpoint

```java
package com.example.controller;

import com.example.dto.ProductDTO;
import com.example.dto.ProductResponseDTO;
import com.example.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ProductController
 * REST API Endpoints สำหรับจัดการ Product Resources
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Product Management", description = "APIs for managing product resources")
public class ProductController {

    private final ProductService productService;

    // ========================================
    // CREATE - POST /api/v1/products
    // ========================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Create a new product",
        description = "Creates a new product with the provided information"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Product created successfully",
                    content = @Content(schema = @Schema(implementation = ProductResponseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "409", description = "Product with this name already exists")
    })
    public ProductResponseDTO createProduct(
            @Valid @RequestBody ProductDTO productDTO) {

        log.info("POST /api/v1/products - Creating product: {}", productDTO.getName());

        return productService.create(productDTO);
    }

    // ========================================
    // READ ALL - GET /api/v1/products
    // ========================================

    @GetMapping
    @Operation(
        summary = "Get all products",
        description = "Retrieves a paginated list of all products. Supports sorting and pagination."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Products retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid pagination parameters")
    })
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") @Min(0) int page,

            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = "10") @Min(1) int size,

            @Parameter(description = "Sort field (e.g., 'name', 'price', 'createdAt')")
            @RequestParam(defaultValue = "id") String sortBy,

            @Parameter(description = "Sort direction ('asc' or 'desc')")
            @RequestParam(defaultValue = "asc") String direction) {

        log.info("GET /api/v1/products - page={}, size={}, sortBy={}, direction={}",
                 page, size, sortBy, direction);

        // สร้าง Pageable object
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        // ดึงข้อมูลจาก Service
        Page<ProductResponseDTO> productPage = productService.findAll(pageable);

        // สร้าง Response ที่มี metadata
        Map<String, Object> response = new HashMap<>();
        response.put("products", productPage.getContent());
        response.put("currentPage", productPage.getNumber());
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());
        response.put("pageSize", productPage.getSize());
        response.put("hasNext", productPage.hasNext());
        response.put("hasPrevious", productPage.hasPrevious());

        return ResponseEntity.ok(response);
    }

    // ========================================
    // READ ONE - GET /api/v1/products/{id}
    // ========================================

    @GetMapping("/{id}")
    @Operation(
        summary = "Get product by ID",
        description = "Retrieves a single product by its unique identifier"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Product found",
                    content = @Content(schema = @Schema(implementation = ProductResponseDTO.class))),
        @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ProductResponseDTO getProductById(
            @Parameter(description = "Product ID", required = true, example = "1")
            @PathVariable Long id) {

        log.info("GET /api/v1/products/{} - Fetching product", id);

        return productService.findById(id);
    }

    // ========================================
    // SEARCH - GET /api/v1/products/search
    // ========================================

    @GetMapping("/search")
    @Operation(
        summary = "Search products",
        description = "Search products by keyword or price range"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Search completed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid search parameters")
    })
    public List<ProductResponseDTO> searchProducts(
            @Parameter(description = "Search keyword (searches in product name)")
            @RequestParam(required = false) String keyword,

            @Parameter(description = "Minimum price")
            @RequestParam(required = false) Double minPrice,

            @Parameter(description = "Maximum price")
            @RequestParam(required = false) Double maxPrice) {

        log.info("GET /api/v1/products/search - keyword={}, minPrice={}, maxPrice={}",
                 keyword, minPrice, maxPrice);

        return productService.search(keyword, minPrice, maxPrice);
    }

    // ========================================
    // LOW STOCK - GET /api/v1/products/low-stock
    // ========================================

    @GetMapping("/low-stock")
    @Operation(
        summary = "Get low stock products",
        description = "Retrieves products with stock below the specified threshold"
    )
    public List<ProductResponseDTO> getLowStockProducts(
            @Parameter(description = "Stock threshold", example = "10")
            @RequestParam(defaultValue = "10") Integer threshold) {

        log.info("GET /api/v1/products/low-stock - threshold={}", threshold);

        return productService.findLowStockProducts(threshold);
    }

    // ========================================
    // COUNT - GET /api/v1/products/count
    // ========================================

    @GetMapping("/count")
    @Operation(
        summary = "Count total products",
        description = "Returns the total number of products in the database"
    )
    public ResponseEntity<Map<String, Object>> countProducts() {
        log.info("GET /api/v1/products/count - Counting products");

        long count = productService.count();

        Map<String, Object> response = new HashMap<>();
        response.put("total", count);

        return ResponseEntity.ok(response);
    }

    // ========================================
    // UPDATE - PUT /api/v1/products/{id}
    // ========================================

    @PutMapping("/{id}")
    @Operation(
        summary = "Update product",
        description = "Updates an existing product with new information"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Product updated successfully",
                    content = @Content(schema = @Schema(implementation = ProductResponseDTO.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ProductResponseDTO updateProduct(
            @Parameter(description = "Product ID", required = true)
            @PathVariable Long id,

            @Valid @RequestBody ProductDTO productDTO) {

        log.info("PUT /api/v1/products/{} - Updating product", id);

        return productService.update(id, productDTO);
    }

    // ========================================
    // PARTIAL UPDATE - PATCH /api/v1/products/{id}/stock
    // ========================================

    @PatchMapping("/{id}/stock")
    @Operation(
        summary = "Update product stock",
        description = "Updates only the stock quantity of a product"
    )
    public ProductResponseDTO updateStock(
            @PathVariable Long id,
            @RequestParam Integer stock) {

        log.info("PATCH /api/v1/products/{}/stock - New stock: {}", id, stock);

        // ดึงข้อมูลปัจจุบัน
        ProductResponseDTO current = productService.findById(id);

        // สร้าง DTO ใหม่ที่เปลี่ยนแค่ stock
        ProductDTO updateDTO = ProductDTO.builder()
                .name(current.getName())
                .description(current.getDescription())
                .price(current.getPrice())
                .stock(stock)
                .build();

        return productService.update(id, updateDTO);
    }

    // ========================================
    // DELETE - DELETE /api/v1/products/{id}
    // ========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Delete product",
        description = "Deletes a product by its ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public void deleteProduct(
            @Parameter(description = "Product ID", required = true)
            @PathVariable Long id) {

        log.info("DELETE /api/v1/products/{} - Deleting product", id);

        productService.delete(id);
    }

    // ========================================
    // BULK DELETE - DELETE /api/v1/products
    // ========================================

    @DeleteMapping
    @Operation(
        summary = "Bulk delete products",
        description = "Deletes multiple products by their IDs"
    )
    public ResponseEntity<Map<String, Object>> bulkDeleteProducts(
            @Parameter(description = "List of product IDs to delete")
            @RequestParam List<Long> ids) {

        log.info("DELETE /api/v1/products - Bulk deleting {} products", ids.size());

        int deletedCount = 0;
        List<Long> failedIds = new java.util.ArrayList<>();

        for (Long id : ids) {
            try {
                productService.delete(id);
                deletedCount++;
            } catch (Exception e) {
                failedIds.add(id);
                log.error("Failed to delete product with ID: {}", id);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("deletedCount", deletedCount);
        response.put("failedCount", failedIds.size());
        response.put("failedIds", failedIds);

        return ResponseEntity.ok(response);
    }
}
```

**สรุป HTTP Methods ใน Controller:**

| Method | Endpoint                      | Description                      | Request Body | Response                       |
| :----- | :---------------------------- | :------------------------------- | :----------- | :----------------------------- |
| POST   | `/api/v1/products`            | สร้าง product ใหม่               | ProductDTO   | ProductResponseDTO (201)       |
| GET    | `/api/v1/products`            | ดึง products ทั้งหมด (paginated) | -            | Page<ProductResponseDTO> (200) |
| GET    | `/api/v1/products/{id}`       | ดึง product ตาม ID               | -            | ProductResponseDTO (200)       |
| GET    | `/api/v1/products/search`     | ค้นหา products                   | Query params | List<ProductResponseDTO> (200) |
| GET    | `/api/v1/products/low-stock`  | ดึง products ที่สต็อกต่ำ         | Query params | List<ProductResponseDTO> (200) |
| GET    | `/api/v1/products/count`      | นับจำนวน products                | -            | {total: number} (200)          |
| PUT    | `/api/v1/products/{id}`       | อัปเดต product                   | ProductDTO   | ProductResponseDTO (200)       |
| PATCH  | `/api/v1/products/{id}/stock` | อัปเดตเฉพาะ stock                | Query params | ProductResponseDTO (200)       |
| DELETE | `/api/v1/products/{id}`       | ลบ product                       | -            | No content (204)               |
| DELETE | `/api/v1/products`            | ลบหลาย products                  | Query params | Delete summary (200)           |

---

## 📝 ขั้นตอนที่ 6: OpenAPI Configuration (Optional)

### 6.1 OpenAPI Config: `com.example.config.OpenApiConfig.java`

```java
package com.example.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI Configuration
 * กำหนด metadata สำหรับ Swagger UI
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Product Management API")
                        .version("1.0.0")
                        .description("RESTful API for managing product resources with Spring Boot 3")
                        .contact(new Contact()
                                .name("API Support Team")
                                .email("support@example.com")
                                .url("https://example.com/support"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Development Server"),
                        new Server()
                                .url("https://api.example.com")
                                .description("Production Server")
                ));
    }
}
```

---

## 📝 OpenAPI (Swagger): เอกสาร API อัตโนมัติ

**OpenAPI** (ที่หลายคนยังเรียกติดปากว่า Swagger) คือ **พิมพ์เขียว (Blueprint)** มาตรฐานสากลสำหรับอธิบายว่า REST API ของคุณทำอะไรได้บ้าง

- **มันคืออะไร:** มันคือเอกสารอธิบาย API ที่ทั้งคนอ่านและคอมพิวเตอร์อ่านเข้าใจ
- **ทำไมเราถึงใช้มัน:**
  1. **สร้างเอกสารให้เอง:** **Library** ชื่อ `springdoc-openapi` จะเข้าไปอ่าน **Annotation** (เช่น `@Operation`, `@Parameter`) ที่คุณเขียนใน Controller แล้วจัดการสร้างหน้าเว็บที่ชื่อว่า **Swagger UI** ขึ้นมาให้โดยอัตโนมัติ
  2. **เป็นสนามเด็กเล่น (Interactive):** **Swagger UI** ไม่ได้มีแค่เอกสาร แต่เป็นเหมือน "สนามเด็กเล่น" ให้นักพัฒนาคนอื่น (หรือตัวคุณเอง) สามารถลองยิง **Request** เข้าสู่ API ของเราได้ทันทีผ่านหน้าเว็บ ช่วยให้การทำความเข้าใจและการทดสอบ API เป็นเรื่องง่ายมาก ๆ และมั่นใจได้ว่าเอกสารตรงกับโค้ดเสมอ

> 🔗 คุณสามารถเข้าถึง **Swagger UI** ได้ที่: `http://localhost:8080/swagger-ui.html`

> 🔗 OpenAPI JSON: `http://localhost:8080/api-docs`

---

## 🚀 วิธีการ Build, Run และทดสอบ API

### 1. Build Project

ก่อนนำไปรันในสภาพแวดล้อมจริง (Production) เรามักจะต้อง **Build** **Project** เพื่อสร้างไฟล์ `.jar` ที่เป็นไฟล์ที่สามารถรันได้ทุกที่

```bash
# Clean และ Build Project (สร้างไฟล์ .jar ในโฟลเดอร์ target/)
./mvnw clean package

# Skip tests (ถ้าต้องการ build เร็ว ๆ)
./mvnw clean package -DskipTests

# ตรวจสอบไฟล์ที่ถูกสร้าง
ls -lh target/*.jar
```

### 2. Run Project

#### 2.1 รันผ่าน Maven:

```bash
# รัน Spring Boot ในโหมด Development
./mvnw spring-boot:run

# รันด้วย Production profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod

# รันด้วย JVM arguments (เช่น เพิ่ม memory)
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx512m"
```

#### 2.2 รันจากไฟล์ JAR:

```bash
# รันไฟล์ JAR ที่ build แล้ว
java -jar target/product-api-1.0.0.jar

# รันด้วย Production profile
java -jar target/product-api-1.0.0.jar --spring.profiles.active=prod

# รันด้วย custom port
java -jar target/product-api-1.0.0.jar --server.port=9090

# รันใน background (Linux/macOS)
nohup java -jar target/product-api-1.0.0.jar > app.log 2>&1 &
```

### 3. ทดสอบ CRUD API ด้วย cURL

เราจะใช้ **cURL** (Command Line Tool) เพื่อทดสอบทุกฟังก์ชันของ API

**Base URL:** `http://localhost:8080/api/v1/products`

#### A. CREATE (POST) - สร้างข้อมูล

```bash
# สร้าง Product ใหม่
curl -X POST http://localhost:8080/api/v1/products \
-H "Content-Type: application/json" \
-d '{
    "name": "MacBook Pro 14 inch",
    "description": "Apple M3 Pro chip, 18GB RAM, 512GB SSD",
    "price": 89900.00,
    "stock": 50
}'

# Response (201 Created):
# {
#   "id": 1,
#   "name": "MacBook Pro 14 inch",
#   "description": "Apple M3 Pro chip, 18GB RAM, 512GB SSD",
#   "price": 89900.00,
#   "stock": 50,
#   "createdAt": "2025-01-16T10:30:00",
#   "updatedAt": "2025-01-16T10:30:00"
# }
```

#### B. READ ALL (GET) - ดึงข้อมูลทั้งหมด

```bash
# 1. ดึงทั้งหมดแบบ default pagination
curl -X GET http://localhost:8080/api/v1/products

# 2. ดึงแบบกำหนด page และ size
curl -X GET "http://localhost:8080/api/v1/products?page=0&size=5"

# 3. ดึงแบบเรียงตามราคา (จากต่ำไปสูง)
curl -X GET "http://localhost:8080/api/v1/products?sortBy=price&direction=asc"

# 4. ดึงแบบเรียงตามวันที่สร้าง (ใหม่ไปเก่า)
curl -X GET "http://localhost:8080/api/v1/products?sortBy=createdAt&direction=desc"

# Response (200 OK):
# {
#   "products": [...],
#   "currentPage": 0,
#   "totalItems": 100,
#   "totalPages": 10,
#   "pageSize": 10,
#   "hasNext": true,
#   "hasPrevious": false
# }
```

#### C. READ ONE (GET) - ดึงข้อมูลตาม ID

```bash
# ดึง Product ID = 1
curl -X GET http://localhost:8080/api/v1/products/1

# Response (200 OK):
# {
#   "id": 1,
#   "name": "MacBook Pro 14 inch",
#   "description": "Apple M3 Pro chip, 18GB RAM, 512GB SSD",
#   "price": 89900.00,
#   "stock": 50,
#   "createdAt": "2025-01-16T10:30:00",
#   "updatedAt": "2025-01-16T10:30:00"
# }
```

#### D. SEARCH (GET) - ค้นหาด้วย Query Parameters

```bash
# 1. ค้นหาตามชื่อ (keyword)
curl -X GET "http://localhost:8080/api/v1/products/search?keyword=MacBook"

# 2. ค้นหาตามช่วงราคา
curl -X GET "http://localhost:8080/api/v1/products/search?minPrice=50000&maxPrice=100000"

# 3. ค้นหา Products ที่สต็อกต่ำกว่า 10
curl -X GET "http://localhost:8080/api/v1/products/low-stock?threshold=10"

# 4. นับจำนวน Products ทั้งหมด
curl -X GET http://localhost:8080/api/v1/products/count

# Response:
# {"total": 100}
```

#### E. UPDATE (PUT) - อัปเดตข้อมูล

```bash
# อัปเดต Product ID = 1
curl -X PUT http://localhost:8080/api/v1/products/1 \
-H "Content-Type: application/json" \
-d '{
    "name": "MacBook Pro 14 inch (Updated)",
    "description": "Apple M3 Pro chip, 18GB RAM, 512GB SSD - New Model",
    "price": 85900.00,
    "stock": 45
}'

# Response (200 OK):
# {
#   "id": 1,
#   "name": "MacBook Pro 14 inch (Updated)",
#   "description": "Apple M3 Pro chip, 18GB RAM, 512GB SSD - New Model",
#   "price": 85900.00,
#   "stock": 45,
#   "createdAt": "2025-01-16T10:30:00",
#   "updatedAt": "2025-01-16T14:25:00"
# }
```

#### F. PARTIAL UPDATE (PATCH) - อัปเดตเฉพาะบางส่วน

```bash
# อัปเดตเฉพาะ stock ของ Product ID = 1
curl -X PATCH "http://localhost:8080/api/v1/products/1/stock?stock=100"

# Response (200 OK):
# {
#   "id": 1,
#   "name": "MacBook Pro 14 inch (Updated)",
#   "description": "Apple M3 Pro chip, 18GB RAM, 512GB SSD - New Model",
#   "price": 85900.00,
#   "stock": 100,
#   "createdAt": "2025-01-16T10:30:00",
#   "updatedAt": "2025-01-16T15:10:00"
# }
```

#### G. DELETE (DELETE) - ลบข้อมูล

```bash
# 1. ลบ Product ID = 1
curl -X DELETE http://localhost:8080/api/v1/products/1

# Response (204 No Content)

# 2. Bulk delete - ลบหลาย Products พร้อมกัน
curl -X DELETE "http://localhost:8080/api/v1/products?ids=1,2,3"

# Response (200 OK):
# {
#   "deletedCount": 2,
#   "failedCount": 1,
#   "failedIds": [2]
# }
```

---

## 🔍 การแก้ปัญหาที่พบบ่อย (Troubleshooting)

### ปัญหาที่ 1: Port 8080 ถูกใช้งานอยู่แล้ว

**อาการ:**

```
***************************
APPLICATION FAILED TO START
***************************

Description:
Web server failed to start. Port 8080 was already in use.
```

**วิธีแก้:**

```bash
# macOS/Linux: หา Process ที่ใช้ Port 8080
lsof -i :8080

# Windows
netstat -ano | findstr :8080

# ปิด Process
kill -9 <PID>         # macOS/Linux
taskkill /PID <PID> /F  # Windows

# หรือเปลี่ยน port ใน application.properties
server.port=8081
```

---

### ปัญหาที่ 2: Lombok ไม่ทำงาน (Getters/Setters not found)

**อาการ:**

```
Cannot resolve method 'getName()' in 'Product'
```

**วิธีแก้:**

**สำหรับ IntelliJ IDEA:**

1. ติดตั้ง Lombok Plugin: `Settings` → `Plugins` → ค้นหา "Lombok" → Install
2. Enable Annotation Processing: `Settings` → `Build, Execution, Deployment` → `Compiler` → `Annotation Processors` → เช็ค "Enable annotation processing"
3. Restart IDE

**สำหรับ VS Code:**

```bash
# ติดตั้ง Lombok Annotations Support
code --install-extension GabrielBB.vscode-lombok
```

**สำหรับ Eclipse:**

1. ดาวน์โหลด lombok.jar จาก https://projectlombok.org/download
2. รัน: `java -jar lombok.jar`
3. เลือก Eclipse installation directory
4. Restart Eclipse

---

### ปัญหาที่ 3: H2 Console ไม่เปิด

**อาการ:** เข้า `http://localhost:8080/h2-console` แล้วเจอ 404 หรือ Whitelabel Error

**วิธีแก้:**

ตรวจสอบ `application.properties`:

```properties
# ต้องเปิดใช้งาน H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# ถ้ายังไม่ได้ ลอง disable CSRF (เฉพาะ Development)
spring.h2.console.settings.web-allow-others=true
```

**การเข้าใช้งาน H2 Console:**

1. เปิด http://localhost:8080/h2-console
2. JDBC URL: `jdbc:h2:mem:productdb`
3. Username: `sa`
4. Password: (เว้นว่าง)
5. คลิก "Connect"

---

### ปัญหาที่ 4: Swagger UI ไม่แสดง

**อาการ:** เข้า `http://localhost:8080/swagger-ui.html` แล้วเจอ 404

**วิธีแก้:**

```bash
# 1. ตรวจสอบว่ามี dependency springdoc-openapi
# ดูใน pom.xml ว่ามี dependency นี้หรือไม่:
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>

# 2. Rebuild project
./mvnw clean install

# 3. ลองเข้า URL ทางเลือก:
# http://localhost:8080/swagger-ui/index.html
# http://localhost:8080/api-docs
```

ตรวจสอบ `application.properties`:

```properties
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

---

### ปัญหาที่ 5: Validation ไม่ทำงาน

**อาการ:** ส่ง request ที่ไม่ valid แต่ API ยังรับได้

**วิธีแก้:**

```bash
# 1. ตรวจสอบว่ามี validation dependency
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

# 2. ตรวจสอบว่ามี @Valid ใน Controller
@PostMapping
public ProductResponseDTO createProduct(@Valid @RequestBody ProductDTO productDTO) {
    // ...
}

# 3. ตรวจสอบว่ามี validation annotations ใน DTO
@NotBlank(message = "Product name is required")
String name;
```

---

### ปัญหาที่ 6: Database ไม่ได้ถูกสร้าง (Tables not created)

**อาการ:** API รันได้แต่ query database แล้วเจอ error "Table not found"

**วิธีแก้:**

ตรวจสอบ `application.properties`:

```properties
# ต้องตั้งค่านี้ให้ create tables อัตโนมัติ
spring.jpa.hibernate.ddl-auto=create-drop  # Development
# หรือ
spring.jpa.hibernate.ddl-auto=update       # ถ้าไม่ต้องการลบข้อมูลทุกครั้ง

# เปิดดู SQL ที่ถูก execute
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

ตรวจสอบ logs ว่ามี SQL CREATE TABLE หรือไม่:

```
Hibernate: create table products (...)
```

---

### ปัญหาที่ 7: CORS Error เมื่อเรียกจาก Frontend

**อาการ:**

```
Access to XMLHttpRequest at 'http://localhost:8080/api/v1/products'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**วิธีแก้:**

สร้างไฟล์ `config/CorsConfig.java`:

```java
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // อนุญาตให้เรียกจาก origins เหล่านี้
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:4200"
        ));

        // อนุญาต HTTP methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // อนุญาต headers
        config.setAllowedHeaders(Arrays.asList("*"));

        // อนุญาตให้ส่ง credentials (cookies, authorization headers)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
```

---

### ปัญหาที่ 8: DevTools ไม่ทำงาน (ไม่ Auto-restart)

**อาการ:** แก้โค้ดแล้วต้อง restart server เอง

**วิธีแก้:**

```bash
# 1. ตรวจสอบว่ามี DevTools dependency
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>

# 2. IntelliJ IDEA: Enable automatic build
# Settings → Build, Execution, Deployment → Compiler
# → เช็ค "Build project automatically"

# 3. Enable Registry
# Ctrl+Shift+A (Cmd+Shift+A on Mac) → Registry
# → เช็ค "compiler.automake.allow.when.app.running"

# 4. Restart IDE
```

---

## ⚡ Performance Tips & Best Practices

### 1. Database Indexing

```java
// เพิ่ม indexes ใน Entity
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_name", columnList = "name"),
    @Index(name = "idx_product_price", columnList = "price"),
    @Index(name = "idx_product_stock", columnList = "stock")
})
public class Product {
    // ...
}
```

---

### 2. Use DTOs instead of Entities in Responses

```java
// ❌ ไม่ดี: ส่ง Entity ตรง ๆ
@GetMapping
public List<Product> getAll() {
    return productRepository.findAll();
}

// ✅ ดี: ส่ง DTO
@GetMapping
public List<ProductResponseDTO> getAll() {
    return productService.findAll()
        .stream()
        .map(this::toResponseDTO)
        .collect(Collectors.toList());
}
```

---

### 3. Use @Transactional(readOnly = true) for Read Operations

```java
@Transactional(readOnly = true)  // Optimize read operations
public Page<ProductResponseDTO> findAll(Pageable pageable) {
    return productRepository.findAll(pageable)
        .map(this::toResponseDTO);
}
```

---

### 4. Connection Pool Configuration

```properties
# application.properties

# HikariCP Connection Pool (Default ใน Spring Boot)
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=1200000
spring.datasource.hikari.connection-timeout=20000
```

---

### 5. Enable HTTP/2

```properties
# application.properties
server.http2.enabled=true
```

---

### 6. Enable Response Compression

```properties
# application.properties
server.compression.enabled=true
server.compression.mime-types=application/json,application/xml,text/html,text/xml,text/plain,application/javascript,text/css
server.compression.min-response-size=1024
```

---

### 7. Caching with Spring Cache

```bash
# เพิ่ม dependency
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

```java
@Service
@EnableCaching  // เปิดใช้งาน caching
public class ProductService {

    @Cacheable(value = "products", key = "#id")  // Cache result
    public ProductResponseDTO findById(Long id) {
        // ...
    }

    @CacheEvict(value = "products", key = "#id")  // ลบ cache เมื่ออัปเดต
    public ProductResponseDTO update(Long id, ProductDTO dto) {
        // ...
    }
}
```

---

### 8. Implement Health Checks

```bash
# เพิ่ม Actuator dependency
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```properties
# application.properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

เข้าถึงได้ที่:

- Health: http://localhost:8080/actuator/health
- Metrics: http://localhost:8080/actuator/metrics

---

### 9. Use Pagination for Large Result Sets

```java
// ✅ ดี: ใช้ Pagination
@GetMapping
public Page<ProductResponseDTO> getAll(Pageable pageable) {
    return productService.findAll(pageable);
}

// ❌ ไม่ดี: ดึงทั้งหมดพร้อมกัน
@GetMapping
public List<ProductResponseDTO> getAll() {
    return productService.findAll(); // อาจมีหลักหมื่น records!
}
```

---

### 10. Async Processing สำหรับ Long-running Tasks

```java
@Service
public class ProductService {

    @Async  // ทำงาน asynchronously
    public CompletableFuture<Void> sendNotification(Product product) {
        // ส่ง email notification
        return CompletableFuture.completedFuture(null);
    }
}
```

```java
@Configuration
@EnableAsync  // เปิดใช้งาน async processing
public class AsyncConfig {

    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}
```

---

## 🚀 การ Deploy สู่ Production

### ขั้นตอนที่ 1: Build Production JAR

```bash
# Build production-ready JAR
./mvnw clean package -Pprod -DskipTests

# หรือ build พร้อม run tests
./mvnw clean package -Pprod

# ตรวจสอบ JAR file
ls -lh target/product-api-1.0.0.jar

# ทดสอบรัน JAR
java -jar target/product-api-1.0.0.jar --spring.profiles.active=prod
```

---

### ขั้นตอนที่ 2: Docker Deployment

#### 2.1 สร้าง `Dockerfile`:

```dockerfile
# Multi-stage build สำหรับ optimize image size

# Stage 1: Build
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper และ pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build application
RUN ./mvnw clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# สร้าง non-root user เพื่อความปลอดภัย
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Environment variables
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

#### 2.2 สร้าง `.dockerignore`:

```
# Build artifacts
target/
!target/*.jar

# IDE files
.idea/
.vscode/
*.iml
.classpath
.project
.settings/

# Git
.git/
.gitignore

# Documentation
README.md
*.md

# Environment
.env
.env.local

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Maven
.mvn/wrapper/maven-wrapper.jar
```

#### 2.3 Build และ Run Docker:

```bash
# Build Docker image
docker build -t product-api:latest .

# ตรวจสอบ image size
docker images product-api

# Run container
docker run -d \
    -p 8080:8080 \
    --name product-api \
    -e SPRING_PROFILES_ACTIVE=prod \
    -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/productdb \
    -e SPRING_DATASOURCE_USERNAME=admin \
    -e SPRING_DATASOURCE_PASSWORD=secretpass \
    product-api:latest

# View logs
docker logs -f product-api

# Stop container
docker stop product-api

# Remove container
docker rm product-api

# Access container shell
docker exec -it product-api sh
```

---

### ขั้นตอนที่ 3: Docker Compose (Full Stack)

#### สร้าง `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: product-db
    environment:
      POSTGRES_DB: productdb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secretpass
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - '5432:5432'
    networks:
      - product-network
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U admin -d productdb']
      interval: 10s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  # Spring Boot API
  api:
    build: .
    container_name: product-api
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/productdb
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: secretpass
      JAVA_OPTS: -Xms256m -Xmx512m
    ports:
      - '8080:8080'
    networks:
      - product-network
    healthcheck:
      test:
        [
          'CMD',
          'wget',
          '--no-verbose',
          '--tries=1',
          '--spider',
          'http://localhost:8080/actuator/health',
        ]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
    restart: unless-stopped

  # Redis Cache (Optional)
  redis:
    image: redis:7-alpine
    container_name: product-redis
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - product-network
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  # Nginx Reverse Proxy (Optional)
  nginx:
    image: nginx:alpine
    container_name: product-nginx
    depends_on:
      - api
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    networks:
      - product-network
    restart: unless-stopped

networks:
  product-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

#### สร้าง `init.sql` (Database initialization):

```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table (ถ้า JPA ไม่ได้สร้างให้)
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_product_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_product_created_at ON products(created_at);

-- Insert sample data
INSERT INTO products (name, description, price, stock) VALUES
    ('MacBook Pro 14"', 'Apple M3 Pro chip, 18GB RAM, 512GB SSD', 89900.00, 50),
    ('iPhone 15 Pro', '128GB, Titanium', 39900.00, 100),
    ('AirPods Pro 2', 'Active Noise Cancellation', 8990.00, 200)
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

#### สร้าง `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server api:8080;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    server {
        listen 80;
        server_name localhost;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # API endpoint
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Swagger UI
        location /swagger-ui/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
        }

        # Health check
        location /actuator/health {
            proxy_pass http://backend;
            access_log off;
        }

        # Static files caching
        location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### รัน Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api

# Check service status
docker-compose ps

# Restart specific service
docker-compose restart api

# Stop all services
docker-compose down

# Stop and remove volumes (ข้อมูลจะหาย!)
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build

# Scale API service
docker-compose up -d --scale api=3

# Execute command in container
docker-compose exec api sh
docker-compose exec postgres psql -U admin -d productdb
```

---

### ขั้นตอนที่ 4: Deploy บน Cloud Platforms

#### 4.1 Deploy บน Heroku

```bash
# 1. ติดตั้ง Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Create app
heroku create product-api-spring

# 4. Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# 5. Set environment variables
heroku config:set SPRING_PROFILES_ACTIVE=prod
heroku config:set JAVA_OPTS="-Xmx300m"

# 6. Create Procfile
echo "web: java -Dserver.port=\$PORT \$JAVA_OPTS -jar target/*.jar" > Procfile

# 7. Deploy
git push heroku main

# 8. View logs
heroku logs --tail

# 9. Open app
heroku open
```

---

#### 4.2 Deploy บน Railway

```bash
# 1. ติดตั้ง Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize
railway init

# 4. Add PostgreSQL
railway add

# 5. Deploy
railway up

# 6. View logs
railway logs

# 7. Open dashboard
railway open
```

สร้างไฟล์ `railway.toml`:

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "java -jar /app/app.jar"
healthcheckPath = "/actuator/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[env]
SPRING_PROFILES_ACTIVE = "prod"
```

---

#### 4.3 Deploy บน AWS Elastic Beanstalk

```bash
# 1. ติดตั้ง EB CLI
pip install awsebcli

# 2. Initialize
eb init -p docker product-api --region ap-southeast-1

# 3. Create environment
eb create production-env

# 4. Deploy
eb deploy

# 5. View logs
eb logs

# 6. SSH into instance
eb ssh

# 7. Open app
eb open

# 8. Set environment variables
eb setenv SPRING_PROFILES_ACTIVE=prod
```

สร้างไฟล์ `.ebextensions/options.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    SPRING_PROFILES_ACTIVE: prod
    JAVA_OPTS: '-Xmx512m -Xms256m'
  aws:elasticbeanstalk:environment:proxy:
    ProxyServer: nginx
```

---

#### 4.4 Deploy บน Google Cloud Run

```bash
# 1. ติดตั้ง gcloud CLI
# https://cloud.google.com/sdk/docs/install

# 2. Login
gcloud auth login

# 3. Set project
gcloud config set project YOUR_PROJECT_ID

# 4. Build with Cloud Build
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/product-api

# 5. Deploy to Cloud Run
gcloud run deploy product-api \
    --image gcr.io/YOUR_PROJECT_ID/product-api \
    --platform managed \
    --region asia-southeast1 \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10 \
    --set-env-vars SPRING_PROFILES_ACTIVE=prod

# 6. View service info
gcloud run services describe product-api --region asia-southeast1

# 7. View logs
gcloud logging read "resource.type=cloud_run_revision"
```

---

#### 4.5 Deploy บน Azure App Service

```bash
# 1. ติดตั้ง Azure CLI
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# 2. Login
az login

# 3. Create resource group
az group create --name product-api-rg --location southeastasia

# 4. Create App Service plan
az appservice plan create \
    --name product-api-plan \
    --resource-group product-api-rg \
    --sku B1 \
    --is-linux

# 5. Create Web App
az webapp create \
    --name product-api \
    --resource-group product-api-rg \
    --plan product-api-plan \
    --runtime "JAVA:17-java17"

# 6. Configure deployment
az webapp config appsettings set \
    --name product-api \
    --resource-group product-api-rg \
    --settings SPRING_PROFILES_ACTIVE=prod

# 7. Deploy JAR
az webapp deploy \
    --name product-api \
    --resource-group product-api-rg \
    --src-path target/product-api-1.0.0.jar \
    --type jar

# 8. View logs
az webapp log tail --name product-api --resource-group product-api-rg
```

---

### ขั้นตอนที่ 5: CI/CD Pipeline

#### GitHub Actions Workflow

สร้างไฟล์ `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  JAVA_VERSION: '17'
  MAVEN_OPTS: -Xmx3200m

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: 'maven'

      - name: Run tests
        run: ./mvnw test

      - name: Generate test coverage report
        run: ./mvnw jacoco:report

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./target/site/jacoco/jacoco.xml

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: 'maven'

      - name: Build with Maven
        run: ./mvnw clean package -DskipTests

      - name: Upload JAR artifact
        uses: actions/upload-artifact@v3
        with:
          name: product-api-jar
          path: target/*.jar

  docker:
    name: Build and Push Docker Image
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/product-api:latest
            ${{ secrets.DOCKER_USERNAME }}/product-api:${{ github.sha }}
          cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/product-api:latest
          cache-to: type=inline

  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: docker
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to Railway
        run: |
          npm i -g @railway/cli
          railway up --service product-api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 📊 Monitoring และ Logging

### 1. Application Logging

**สร้างไฟล์ `src/main/resources/logback-spring.xml`:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- Console Appender -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- File Appender -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/application.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/application-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>10MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Error File Appender -->
    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/error.log</file>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/error-%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Root Logger -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="ERROR_FILE"/>
    </root>

    <!-- Package-specific loggers -->
    <logger name="com.example" level="DEBUG"/>
    <logger name="org.springframework.web" level="DEBUG"/>
    <logger name="org.hibernate.SQL" level="DEBUG"/>
</configuration>
```

---

### 2. Prometheus Metrics

```bash
# เพิ่ม dependencies
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

```properties
# application.properties
management.endpoints.web.exposure.include=health,info,prometheus,metrics
management.metrics.export.prometheus.enabled=true
management.endpoint.prometheus.enabled=true
```

เข้าถึง metrics: `http://localhost:8080/actuator/prometheus`

---

## ✅ สรุป: ทำไม Spring Boot ถึงเป็นตัวเลือกที่ดีที่สุดในการสร้าง Microservice?

**Spring Boot** ถูกสร้างขึ้นมาเพื่อแก้ปัญหาความซับซ้อนของการตั้งค่า **Spring Framework** แบบดั้งเดิม ทำให้การสร้าง **Microservice** หรือ **API** กลายเป็นเรื่องง่ายและรวดเร็ว:

### 🎯 ข้อดีหลัก:

1. **ลดเวลาการ Setup (Auto-Configuration)**

   - Spring Boot จัดการการตั้งค่าเริ่มต้น (เช่น การเชื่อมต่อ Database, การตั้งค่า Server) ให้เองโดยอัตโนมัติ
   - ไม่ต้องเสียเวลาเขียนโค้ด Configuration นับร้อยบรรทัด

2. **Embedded Server (รันง่าย)**

   - มาพร้อมกับ Web Server ในตัว (Tomcat, Jetty, Undertow)
   - สร้างไฟล์ `.jar` เดียว แล้วรัน Application ได้ทันทีด้วยคำสั่ง `java -jar`
   - ไม่ต้องติดตั้งหรือตั้งค่า Web Server ภายนอก

3. **Production-Ready Features**

   - **Actuator**: Monitoring สุขภาพของ Microservice
   - **Metrics**: เก็บข้อมูล performance
   - **Security**: Spring Security สำหรับ authentication/authorization
   - **Externalized Configuration**: จัดการ config ผ่าน properties/YAML

4. **Ecosystem ที่สมบูรณ์**

   - Spring Data JPA: ทำงานกับ Database ง่าย
   - Spring Security: Authentication & Authorization
   - Spring Cloud: Microservices patterns (Service Discovery, Load Balancing)
   - Spring Batch: Batch processing

5. **Community Support**

   - Documentation ครบถ้วน
   - Community ใหญ่
   - Libraries และ Plugins มากมาย

6. **Enterprise Ready**
   - ใช้งานจริงใน Production โดยบริษัทชั้นนำทั่วโลก
   - Stable และ Mature
   - Long-term support

### 📈 Use Cases ที่เหมาะสม:

- ✅ Enterprise Applications
- ✅ RESTful APIs และ Microservices
- ✅ E-commerce Platforms
- ✅ Banking และ Financial Systems
- ✅ Healthcare Applications
- ✅ IoT Backend Services

### 🚀 Next Steps:

1. **Security**: เพิ่ม JWT Authentication
2. **Testing**: Unit tests, Integration tests
3. **API Documentation**: Swagger/OpenAPI
4. **Caching**: Redis integration
5. **Message Queue**: RabbitMQ, Kafka
6. **Monitoring**: Prometheus + Grafana
7. **Cloud Deployment**: Kubernetes, AWS, GCP, Azure

---

## 📚 แหล่งเรียนรู้เพิ่มเติม

### Official Documentation:

- **Spring Boot:** https://spring.io/projects/spring-boot
- **Spring Data JPA:** https://spring.io/projects/spring-data-jpa
- **Spring Security:** https://spring.io/projects/spring-security
- **Spring Cloud:** https://spring.io/projects/spring-cloud

### Recommended Books:

- **"Spring Boot in Action"** by Craig Walls
- **"Spring Microservices in Action"** by John Carnell
- **"Pro Spring Boot 2"** by Felipe Gutierrez

### Online Courses:

- Spring Framework Guru
- Baeldung Spring Tutorials
- Java Brains Spring Boot Tutorial

### Community:

- Stack Overflow: [spring-boot] tag
- Spring Community Forums
- Reddit: r/java, r/spring

---

**Happy Coding! 🎉**

ถ้ามีคำถามหรือพบปัญหา สามารถเปิด Issue ใน GitHub Repository หรือติดต่อผ่าน:

- **Email:** support@example.com
- **GitHub:** https://github.com/yourusername/product-api
- **Twitter:** @yourhandle
- **Discord:** Your Server Link

---
