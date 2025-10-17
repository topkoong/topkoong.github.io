---
layout: ../../../layouts/BlogPost.astro
title: 'Secret Management กับ Vault แบบเจาะลึก: Production-Grade Security 🔐'
description: 'การจัดการ Secrets ทั้ง Text-based และ File-based ใน Microservices ด้วย HashiCorp Vault และ Kubernetes Auth Method เพื่อให้เข้าถึงข้อมูลได้อย่างปลอดภัยและจำกัดสิทธิ์ (Least Privilege).'
date: '2024-05-30'
published: true
---

# Secret Management Deep Dive: Production-Grade Implementation

## 📋 การวิเคราะห์และเตรียมการ

ขั้นตอนแรกที่สำคัญคือการวิเคราะห์ความต้องการของทุกทีม เพื่อออกแบบระบบให้รองรับการใช้งานได้อย่างเหมาะสมและปลอดภัย

### การสำรวจความต้องการ

> การจัดกลุ่ม secrets ตาม service และประเภทการใช้งาน ช่วยให้วางแผนสิทธิ์และการเข้าถึงได้ง่ายขึ้น

```
Team A/
├── Payment Service/          # ต้องการความปลอดภัยสูงเพราะเกี่ยวกับเงิน
│   ├── Database Credentials  # เก็บ username/password สำหรับ database
│   ├── Payment Gateway Keys  # API keys สำหรับเชื่อมต่อ payment gateway
│   └── Encryption Keys      # Keys สำหรับเข้ารหัสข้อมูลบัตรเครดิต (Text-based/File-based)
└── Notification Service/     # ต้องการความปลอดภัยปานกลาง
├── Email Service Creds  # SMTP credentials
└── Line Notify Token    # Token สำหรับส่งแจ้งเตือน
```

### โครงสร้าง Vault Path สำหรับ Multiple Environments

การออกแบบ **Vault Path Structure** ที่ดีเป็นก้าวแรกของการทำ **Least Privilege** และการป้องกันการใช้ **Secrets** ผิด **Environment** ซึ่งในบริบทขององค์กรที่มีหลาย **Environment** โครงสร้างแบบ **Hierarchical** จะมีความชัดเจนที่สุด

> เราใช้ **Vault KV Secret Engine V2** เพื่อจัดการ Secret Versioning และแยก Environment อย่างชัดเจน:

```
secret/
├── dit/                    # Development Integration Test (DIT)
│   ├── team-a/
│   │   ├── payment-service/
│   │   └── notification-service/
│   └── team-b/
├── sit/                    # System Integration Test (SIT/SIT2/SIT3)
│   ├── team-a/
│   │   ├── payment-service/
│   │   └── notification-service/
│   └── team-b/
├── uat/                    # User Acceptance Test (UAT/UAT2)
│   ├── team-a/
│   │   ├── payment-service/
│   │   └── notification-service/
│   └── team-b/
└── prod/                   # Production (PROD) - ต้องการการดูแลเป็นพิเศษ
├── team-a/
│   ├── payment-service/
│   └── notification-service/
└── team-b/
```

---

## 🔑 การตั้งค่า Kubernetes Authentication

# ขั้นตอนการเชื่อม Kubernetes กับ Vault

**Kubernetes Authentication Method** คือกลไกที่อนุญาตให้ **Service Accounts** ภายใน Cluster ยืนยันตัวตนกับ Vault โดยไม่ต้องใช้ **Hardcoded Credentials**

### 1. สร้าง Service Account

> Service Account คือตัวแทนของ service ที่จะใช้ขอ **Lease Token**

```yaml
# service-account.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: payment-service-sa # ชื่อต้องตรงกับที่ระบุใน deployment
  namespace: team-a # แยก namespace ตามทีม
```

### 2. กำหนด Vault Policy (Least Privilege)

> Policy คือกฎการเข้าถึง Secret Path โดยใช้ Wildcard (`+`) สำหรับ Environment

```hcl
# payment-service-policy.hcl
# อนุญาตให้ "read" Secrets ทั้งหมดใน path ของ payment-service ทุก Environment
path "secret/data/+/team-a/payment-service/*" {
 capabilities = ["read"]     # ให้สิทธิ์แค่อ่านอย่างเดียวเท่านั้น
}

# ตัวอย่าง path สำหรับ PGP Private Key (File-based secret)
path "secret/data/+/team-a/payment-service/pgp-private-key" {
 capabilities = ["read"]
}
```

### 3. Vault Role Configuration

> Role เป็นตัวเชื่อม Service Account กับ Policy เพื่อกำหนดสิทธิ์การเข้าถึง

```bash
# Map service account กับ policy ผ่าน role
vault write auth/kubernetes/role/payment-service \
    bound_service_account_names=payment-service-sa \  # ชื่อ Service Account
    bound_service_account_namespaces=team-a \        # Namespace ที่อนุญาตให้ใช้ Role นี้
    policies=payment-service-policy \                # Policy ที่ใช้กำหนดสิทธิ์
    ttl=1h                                          # Lease Token จะหมดอายุใน 1 ชั่วโมง
```

---

## 🔄 Flow การทำงานละเอียด: Authentication Workflow

นี่คือขั้นตอนการทำงานที่ละเอียดของ **Spring Boot Microservice** ในการขอ **Secret** จาก Vault ผ่าน **Kubernetes Authentication**:

| ขั้นตอน                           | Component                               | Action                                                         | คำอธิบาย (Comments)                                                                                                                                                                           |
| :-------------------------------- | :-------------------------------------- | :------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Pod Mount Token**            | **Kubernetes**                          | `Volume Mount`                                                 | **Kubernetes** จะ **Mount JWT Token** (Service Account Token) ไปยัง Path มาตรฐาน `/var/run/secrets/kubernetes.io/serviceaccount/token` ภายใน Pod ของ **Spring Boot Service** โดยอัตโนมัติ     |
| **2. Authentication Request**     | **Spring Boot**                         | `POST /v1/auth/kubernetes/login`                               | **Spring Boot** ใช้ **JWT Token** ที่ได้จาก **Mount Path** ในการ **Login** ไปที่ **Vault** พร้อมระบุ **Role** (`payment-service`)                                                             |
| **3. Token Review**               | **Vault** $\leftrightarrow$ **K8s API** | `TokenReview API`                                              | **Vault** ติดต่อ **Kubernetes API Server** เพื่อ **Verify** ว่า **JWT Token** ที่ส่งมานั้น **Valid** จริง และ **ตรวจสอบความถูกต้อง** ของ `Service Account` และ `Namespace` ที่ระบุใน **Role** |
| **4. Policy Check & Token Issue** | **Vault**                               | `Client Token Generation`                                      | เมื่อยืนยันถูกต้อง **Vault** จะออก **Lease Token** ที่มี **Policy** (`payment-service-policy`) ผูกอยู่ และกำหนด **TTL** (เช่น 1h) ให้                                                         |
| **5. Secret Access**              | **Spring Boot**                         | `GET /v1/secret/data/sit/team-a/payment-service/db-credential` | **Spring Boot** ใช้ **Lease Token** ที่ได้มาใน **Header: X-Vault-Token** เพื่อ **Request** ขอ **Secret** จาก Path ที่ได้รับอนุญาต                                                             |

### Visual Flow Diagram

> **แผนผังแสดงขั้นตอนการขอ Token และการตรวจสอบสิทธิ์**

```
[Service-A (Spring Boot)] <--- 1. Service Account Token (JWT) ---> [Kubernetes]

[Service-A (Spring Boot)] ---> 2. Login Request (JWT + Role) ---> [Vault]

[Vault] <--- 3. Token Review ---> [Kubernetes API Server]

[Vault] <--- 4. (Valid) ---> [Kubernetes API Server]

[Vault] ---> 5. Lease Token ---> [Service-A (Spring Boot)]
```

### Spring Boot Configuration

> การตั้งค่า Spring Boot เพื่อเชื่อมต่อกับ Vault โดยระบุ **Role** ที่ผูกกับ **Service Account**

```yaml
spring:
  cloud:
    vault:
      kubernetes:
        role: payment-service # ต้องตรงกับ role ที่สร้างไว้ใน Vault
        service-account-token-file: /var/run/secrets/kubernetes.io/serviceaccount/token # Path มาตรฐานที่ K8s Mount JWT Token เข้ามา
```

### Code Snippets ที่เพิ่มความชัดเจน

1.  **Spring Boot Pod Configuration (Kubernetes YAML)**

    ```yaml
    # ใน Deployment/StatefulSet ของ Spring Boot Microservice
    spec:
      serviceAccountName: payment-service-sa # Service Account Name ที่สร้างไว้
      containers:
        - name: payment-ms
          # Kubernetes จะ Mount JWT Token มาที่ Path นี้อัตโนมัติ
          volumeMounts:
            - name: service-account-token
              mountPath: /var/run/secrets/kubernetes.io/serviceaccount
    ```

2.  **Authentication Request ไปที่ Vault**

    ```java
    // ภายใน Vault Client Library (Client-side)
    // ใช้ JWT Token ที่ Mount มาจาก K8s ในการ Authenticate
    POST /v1/auth/kubernetes/login
    {
      "role": "payment-service",              // Role ที่ผูกกับ Policy และ Service Account ใน Vault
      "jwt": "<service-account-token>"        // JWT Token ที่อ่านจาก /var/run/secrets/.../token
    }
    ```

3.  **Vault Response (Success)**
    ```json
    {
      "auth": {
        "client_token": "<lease-token-with-policy>", // Token ที่มีอายุจำกัด (e.g., 1h)
        "policies": ["payment-service-policy"], // Policy ที่อนุญาตให้ 'read' Path ที่จำเป็นเท่านั้น
        "lease_duration": 3600 // TTL = 3600 วินาที (1 ชั่วโมง)
      }
    }
    ```

---

## 📝 Secret Mapping Example และ File Security

Vault รองรับการจัดเก็บ **Secret** ได้หลากหลายประเภท โดยเฉพาะ **Text-based** และ **File-based**

### 1. Text-based Secrets (e.g., API Keys, Passwords)

> ตัวอย่างการเก็บ Credentials และ API Keys

```yaml
secret/sit/team-a/payment-service/db-cred:
  username: 'user_sit_payment'
  password: 'super_secure_password_sit'
  host: 'db-sit.internal'
  port: '5432'

secret/sit/team-a/payment-service/api-keys:
  gateway_key: 'KEY-SIT-XYZ-123' # Key สำหรับ authentication
  gateway_secret: 'SECRET-SIT-ABC-456' # Secret สำหรับเซ็น request
```

### 2. File-based Secrets (e.g., Certificates, Private Keys)

> ตัวอย่างการเก็บ PGP Private Key ที่ใช้ในการรับส่งไฟล์อย่างปลอดภัย

```yaml
secret/sit/team-a/payment-service/pgp-private-key:
  pgp_private_key: |
    -----BEGIN PGP PRIVATE KEY BLOCK-----
    Version: GnuPG v1.4.10 (GNU/Linux)
    lQeGBF2424YBCACz4PzX/n... (Content of Private Key file)
    ...
    =yR4s
    -----END PGP PRIVATE KEY BLOCK-----
```

**การใช้งาน:** แอปพลิเคชันจะดึงเนื้อหา **Text** นี้ไป **Write** เป็นไฟล์ชั่วคราว (Temporary File) ใน **In-Memory Volume** ภายใน Pod เพื่อใช้งานในการ **Decryption** โดยไม่เก็บไฟล์ไว้บน Disk ถาวร

---

## 💡 Best Practices

### การจัดการ Secrets

**1. Naming Convention**

> การตั้งชื่อที่เป็นระบบช่วยให้จัดการง่าย

`<env>/<team>/<service>/<secret-name>`

**2. Version Control**

> แนวทางในการจัดการเวอร์ชันของไฟล์ Configuration เพื่อความปลอดภัย

- เก็บ **Template** ของ Configuration (ใช้ Placeholder) แทน
- **ห้าม** เก็บ **Actual Secrets** ใน **Source Code Repository** เด็ดขาด
- ใช้ Placeholder หรือ Environment Variable แทนค่าจริงในการกำหนดค่า

**3. Rotation Policy**

> การกำหนดนโยบายหมุนเวียน Secrets ตามรอบเวลา หรือเมื่อมีเหตุการณ์ด้านความปลอดภัย

```bash
# ตัวอย่างการหมุนเวียน Database Credentials
vault write /secret/data/dit/team-a/payment-service/db-cred \
  data=@new-credentials.json
```

---

## 🛡️ Security Guidelines

### Access Control

**1. Least Privilege**

> หลักการให้สิทธิ์น้อยที่สุดที่จำเป็น (**Must-Have Principle**)

- ให้สิทธิ์เฉพาะ **Capabilities** ที่จำเป็น (เช่น `read` เท่านั้น)
- แยก **Policy** ตาม **Service** และ **Environment**
- กำหนด **TTL (Time-To-Live)** ที่เหมาะสม เพื่อจำกัดความเสียหายหาก Token รั่วไหล

### 2. Audit

> **การตรวจสอบกิจกรรมและการใช้งานระบบ**

- **Vault Audit Logs** จะบันทึกทุกคำขอเข้า/ออก รวมถึงการยืนยันตัวตน (**Authentication**) และการเข้าถึงข้อมูลลับ (**Secret Access**)

```hcl
path "audit/" {
  capabilities = ["read"]  # เปิดให้อ่าน audit log ได้
}
```

### Monitoring

**1. Metrics ที่สำคัญ**

> ตัวชี้วัดหลักที่ต้องติดตามเพื่อตรวจสอบความปลอดภัยและเสถียรภาพของระบบ Vault

- **Token usage** (อัตราการใช้งาน Lease Token และการต่ออายุ)
- **Authentication failures** (ความล้มเหลวในการล็อกอินที่ไม่สำเร็จหรือผิดปกติ)
- **Secret access patterns** (รูปแบบการเข้าถึง Secrets ที่เกินขอบเขตหรือน่าสงสัย)

**2. Alert Rules**

> กฎการแจ้งเตือนที่สำคัญซึ่งควรตั้งค่าเพื่อรับมือกับเหตุการณ์ด้านความปลอดภัย

- เมื่อมีการ **Access ผิดปกติ** (เช่น พบ Access Denied จำนวนมาก)
- เมื่อ **Secret ใกล้หมดอายุ** หรือ **Token Renewal** ล้มเหลว
- เมื่อมีการ **Rotate Key/Secret**

---

## ⚡ Performance Tips

> เทคนิคการทำให้ระบบทำงานได้เร็วและเสถียร

- ใช้ **Client-side Cache** อย่างเหมาะสม (ลดการเรียก Vault บ่อยๆ)
- จัดการ **Connection Pool** ของ Vault Client (รองรับการใช้งานพร้อมกัน)
- ตั้ง **Timeout** ที่เหมาะสม (ป้องกันระบบค้างเมื่อ Vault มีปัญหา)
- **Monitor Lease Token Lifecycle** (ดูแลอายุและการต่ออายุ Token อย่างมีประสิทธิภาพ)
