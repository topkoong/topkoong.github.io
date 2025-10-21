---
layout: ../../../layouts/BlogPost.astro
title: 'การรับส่งไฟล์แบบปลอดภัยด้วย PGP Encryption 🔒'
description: 'เจาะลึกระบบเข้ารหัสไฟล์ด้วย PGP พร้อมตัวอย่างการใช้งานจริงและการผสานรวมกับ Microservice Architecture'
date: '2024-10-31'
published: true
---

# ระบบรับส่งไฟล์แบบปลอดภัยด้วย PGP

## 📖 บทนำ

**การรักษาความลับและความสมบูรณ์ของข้อมูล (Data Confidentiality and Integrity)** ในการแลกเปลี่ยน **Interface File** ระหว่างระบบภายในและภายนอกองค์กรเป็นสิ่งสำคัญสูงสุด โดยเฉพาะอย่างยิ่งสำหรับข้อมูลที่มีความอ่อนไหว เช่น ข้อมูลทางการเงินหรือข้อมูลส่วนบุคคล

**PGP (Pretty Good Privacy)** จึงถูกนำมาใช้เป็นมาตรฐานการเข้ารหัสแบบ **Asymmetric Encryption** ที่เชื่อถือได้ เพื่อรับประกันความปลอดภัยของข้อมูลในขณะส่งผ่านเครือข่าย

## 🔐 หลักการทำงานของ Asymmetric Encryption

### **พื้นฐานการเข้ารหัสแบบ Asymmetric**

```mermaid
flowchart TD
    A[Public Key] -->|เข้ารหัส| B[Encrypted Data]
    B -->|ส่งผ่าน Network| C[Recipient]
    C -->|ถอดรหัสด้วย Private Key| D[Original Data]
    E[Private Key + Passphrase] -.->|จัดเก็บและใช้ใน Vault| C

    style A fill:#e0f2fe,stroke:#0277bd,stroke-width:2px
    style B fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    style C fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style D fill:#e0f7fa,stroke:#00695c,stroke-width:2px
    style E fill:#ffebee,stroke:#d32f2f,stroke-width:2px
```

### หลักการสำคัญ:

- **Public Key** = ใช้สำหรับ **เข้ารหัส** ข้อมูล (Encryption), สามารถเผยแพร่ได้อย่างอิสระ
- **Private Key** = ใช้สำหรับ **ถอดรหัส** ข้อมูล (Decryption), ต้องถูกเก็บเป็นความลับสูงสุดและไม่ส่งผ่านเครือข่าย
- **Passphrase** = รหัสป้องกัน Private Key, ต้องจัดเก็บแยกจากตัว Private Key (**Separation of Concern**) เพื่อเพิ่มชั้นการป้องกัน (**Defense-in-Depth**)

## 🛠️ การใช้งานพื้นฐาน

### 1. การสร้าง Key Pair

```bash
# ===== การสร้าง Key Pair ด้วย GPG (Gnu Privacy Guard) =====
gpg --gen-key \                    # คำสั่งสร้าง key pair
    --pin-entry-mode loopback \    # ไม่ต้องการ GUI prompt
    --passphrase "your-secure-passphrase" \ # รหัสป้องกัน private key
    --batch \                      # ใช้ batch mode สำหรับ automation
    --yes                          # ตอบ yes อัตโนมัติ

# ===== การ Export Public Key (สำหรับส่งให้ Partner) =====
gpg --armor \                      # แปลงเป็น text format
    --export your@email.com \      # ระบุ Key ID (Email)
    > public_key.asc               # บันทึกเป็นไฟล์

# ===== การ Export Private Key (สำหรับจัดเก็บใน Vault) =====
gpg --armor \                      # แปลงเป็น text format
    --export-secret-key \          # export private key
    your@email.com \               # ระบุ Key ID (Email)
    > private_key.asc              # บันทึกเป็นไฟล์
```

### **2. การเข้ารหัสและถอดรหัส**

```bash
# ===== การเข้ารหัสไฟล์ (ใช้ Public Key ของผู้รับ) =====
gpg --encrypt \
    --recipient "partner@email.com" \  # ระบุ Key ID ของผู้รับปลายทาง
    --armor \                          # สร้างไฟล์ Encrypted Output เป็น Text Format (.asc)
    --output encrypted_file.asc \      # ระบุชื่อไฟล์ Output
    input_file.txt                     # ไฟล์ที่ต้องการเข้ารหัส

# ===== การถอดรหัสไฟล์ (ใช้ Private Key ของตัวเอง) =====
gpg --decrypt \
    --output decrypted_file.txt \      # ระบุชื่อไฟล์ Output ที่ถอดรหัสแล้ว
    encrypted_file.asc                 # ไฟล์ Encrypted Input
```

## 🔄 สถานการณ์การใช้งานจริง

### **สถานการณ์ที่ 1: Partner ส่ง Interface File ให้เรา**

```mermaid
flowchart TD
    A[เรา] -->|1 สร้าง Key Pair| B[Our Keys]
    B -->|2 ส่ง Public Key| C[Partner]
    C -->|3 Partner Import Key| D[Partner Ready]
    D -->|4 เข้ารหัสไฟล์ ใช้ Public Key ของเรา| E[Encrypted File]
    E -->|5 ส่งไฟล์ผ่าน Secure Channel| F[เรา]
    F -->|6 ถอดรหัส ใช้ Private Key ของเรา| G[Decrypted File]

    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style B fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style C fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style D fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style E fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    style F fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style G fill:#e0f7fa,stroke:#00695c,stroke-width:2px
```

### ขั้นตอนการทำงาน:

1.  **เราสร้าง Key Pair** - สร้าง **Public Key** และ **Private Key** โดย **Private Key** และ **Passphrase** จะถูกจัดเก็บใน **HashiCorp Vault**
2.  **ส่ง Public Key ให้ Partner** - ส่ง Public Key ผ่านช่องทางที่ **ปลอดภัย** เช่น **SFTP** หรือ **Secure Web Portal** พร้อมแนบ **Digital Signature** และยืนยัน **Fingerprint**
3.  **Partner Import และ Verify** - Partner ตรวจสอบ **Digital Signature** และ **Fingerprint** ก่อน Import Public Key ของเราเข้าสู่ระบบ
4.  **Partner เข้ารหัสไฟล์** - Partner ใช้ **Public Key ของเรา** ในการเข้ารหัส **Interface File**
5.  **ส่งไฟล์ที่เข้ารหัส** - ส่งไฟล์ที่เข้ารหัสแล้วมาให้เราผ่านช่องทางที่ **ปลอดภัย**
6.  **เราถอดรหัส** - **Decryption Service** ของเราดึง **Private Key + Passphrase** จาก **Vault** มาใช้ในการถอดรหัสไฟล์

**ตัวอย่าง Command:**

```bash
# ===== ฝั่งเรา (เตรียม Key สำหรับ Key Exchange) =====
# 1. Export public key (เพื่อส่งให้ Partner)
gpg --armor --export your@email.com > my_public_key.asc

# 2. (Best Practice) สร้าง Digital Signature เพื่อยืนยันตัวตน
gpg --detach-sign --armor my_public_key.asc

# 3. ส่ง my_public_key.asc และ my_public_key.asc.sig ผ่าน SFTP/Secure Portal

# ===== ฝั่ง Partner (รับและเข้ารหัส) =====
# 1. ตรวจสอบและ Import public key ของเรา
gpg --verify my_public_key.asc.sig my_public_key.asc # ตรวจสอบลายเซ็น
gpg --import my_public_key.asc

# 2. เข้ารหัสไฟล์ด้วย public key ของเรา
gpg --encrypt \
    --recipient "your@email.com" \
    --output encrypted_file.asc \
    input_file.txt

# ===== ฝั่งเรา (Decryption Service - โดย Microservice) =====
# (สมมติว่า Private Key และ Passphrase ถูกดึงจาก Vault มาใช้ใน Process แล้ว)
gpg --decrypt --output decrypted_file.txt encrypted_file.asc
```

### **สถานการณ์ที่ 2: เราส่ง Interface File ให้ Partner**

```mermaid
flowchart TD
    A[Partner System] -->|1 สร้าง Key Pair| B[Partner Keys]
    B -->|2 ส่ง Public Key ผ่าน SFTP Secure Portal| C[เรา Encryption Service]
    C -->|3 เรา Import Verify Key| D[Our Keyring Ready]
    D -->|4 เข้ารหัสไฟล์ ใช้ Public Key ของ Partner| E[Encrypted File]
    E -->|5 ส่งไฟล์ผ่าน Secure Channel| F[Partner System]
    F -->|6 ถอดรหัส ใช้ Private Key ของ Partner| G[Decrypted File]

    style A fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style B fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style C fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style D fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style E fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    style F fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style G fill:#e0f7fa,stroke:#00695c,stroke-width:2px
```

### ขั้นตอนการทำงาน:

1.  **Partner สร้าง Key Pair** - Partner สร้าง **Public Key** และ **Private Key** โดยจัดเก็บ **Private Key** และ **Passphrase** ไว้ในระบบของตนเองอย่าง **ปลอดภัย**
2.  **ส่ง Public Key ให้เรา** - Partner ส่ง **Public Key** ผ่านช่องทางที่ **ปลอดภัย** เช่น **SFTP** หรือ **Secure Web Portal** พร้อมแนบ **Digital Signature**
3.  **เรา Import และ Verify** - **Encryption Service** ของเราตรวจสอบ **Digital Signature** และ **Fingerprint** ก่อน Import **Public Key ของ Partner** เข้าสู่ระบบ
4.  **เราเข้ารหัสไฟล์** - **Encryption Service** ของเราดึง **Public Key ของ Partner** มาใช้ในการเข้ารหัส **Interface File**
5.  **ส่งไฟล์ที่เข้ารหัส** - ส่งไฟล์ที่เข้ารหัสแล้วให้ Partner ผ่านช่องทางที่ **ปลอดภัย** (เช่น SFTP)
6.  **Partner ถอดรหัส** - Partner ใช้ **Private Key + Passphrase** ของตนเองในการถอดรหัสไฟล์

**ตัวอย่าง Command:**

```bash
# ===== ฝั่ง Partner (Key Exchange) =====
# 1. Export public key (พร้อม Digital Signature)
gpg --armor --export partner@email.com > partner_public_key.asc
gpg --detach-sign --armor partner_public_key.asc

# 2. ส่งไฟล์ public key และ signature ให้เราผ่าน Secure Channel

# ===== ฝั่งเรา (Encryption Service - รับ/Verify Key และเข้ารหัส) =====
# 1. ตรวจสอบและ Import public key ของ Partner
gpg --verify partner_public_key.asc.sig partner_public_key.asc # ตรวจสอบลายเซ็น
gpg --import partner_public_key.asc

# 2. เข้ารหัสไฟล์ด้วย public key ของ partner
gpg --encrypt \
    --recipient "partner@email.com" \
    --output encrypted_file.asc \
    input_file.txt

# 3. ส่งไฟล์ encrypted_file.asc ให้ Partner ผ่าน SFTP/Secure Portal

# ===== ฝั่ง Partner (ถอดรหัส) =====
# 1. ถอดรหัสไฟล์ด้วย private key + passphrase
gpg --decrypt --output decrypted_file.txt encrypted_file.asc
# ระบบจะถาม passphrase
```

---

## 🔑 การแลกเปลี่ยน Keys และ Secure Transfer

การแลกเปลี่ยน **Public Key** ต้องทำผ่านช่องทางที่มีความ **ปลอดภัย (Secure Channel)** และมีการตรวจสอบ **Fingerprint** เสมอ เพื่อป้องกันการโจมตีแบบ **Man-in-the-Middle (MITM)**

### วิธีการส่งผ่าน Secure Channel (ช่องทางปฏิบัติจริง)

#### 1. Secure File Transfer Protocol (SFTP) หรือ Secure Web Portal

นี่คือช่องทางหลักและเป็นมาตรฐานที่ใช้ในการแลกเปลี่ยน **Interface File** และ **Keys** ระหว่างองค์กร:

```bash
# ===== การส่ง Public Key ผ่าน SFTP/Secure Portal =====
# 1. Export Public Key
gpg --armor --export your@email.com > my_public_key.asc

# 2. (Best Practice) สร้าง Digital Signature เพื่อยืนยันความถูกต้อง
gpg --detach-sign --armor my_public_key.asc

# 3. ส่งไฟล์ Public Key (.asc) และ Signature (.asc.sig) ไปยัง SFTP Server ปลายทาง
sftp partner_user@secure-server.com
put my_public_key.asc /key_exchange/
put my_public_key.asc.sig /key_exchange/
quit

# ผู้รับจะดาวน์โหลดและใช้คำสั่ง gpg --verify เพื่อตรวจสอบลายเซ็น
```

#### **2. Secure Email Transfer (ทางเลือกฉุกเฉิน)**

หากจำเป็นต้องส่งผ่านอีเมล ควรแนบ Digital Signature และ Fingerprint เพื่อยืนยันตัวตน:

```bash
# ส่งไฟล์ Public Key (.asc) และไฟล์ Signature (.asc.sig)
# พร้อมทั้งส่ง Fingerprint ผ่านช่องทางที่ 3 ที่เชื่อถือได้ (เช่น โทรศัพท์ยืนยัน)
gpg --fingerprint your@email.com
# Output: ABCD 1234 EF56 7890 ABCD 1234 EF56 7890 ABCD 1234
```

## 🔑 การจัดเก็บ Keys ใน Vault (Best Practice)

การจัดการ **Private Key** ของระบบเราและ **Public Key** ของ Partner ต้องทำผ่าน **HashiCorp Vault** เพื่อให้ **Microservice** ดึง Key มาใช้ในการเข้ารหัส/ถอดรหัสได้โดยไม่ต้องเก็บ Key ไว้ในโค้ดหรือ File System ซึ่งเป็นหลักการ **Secret Zero** ที่สำคัญที่สุด

#### ตัวอย่าง Command สำหรับ Vault KV Secret Engine V2

| คำสั่ง                                                                                         | ผลลัพธ์ (ตัวอย่าง)                                                          | คำอธิบาย                                                                                   |
| :--------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| **1. จัดเก็บ Private Key ของเรา**                                                              |                                                                             |                                                                                            |
| `vault kv put secret/pgp/our-system/private-key key="-----BEGIN PGP PRIVATE KEY-----..."`      | `Key Value Secret written to: secret/data/pgp/our-system/private-key`       | จัดเก็บ **Private Key** ของระบบเรา ไว้ใน Vault Path ที่กำหนด                               |
| **2. จัดเก็บ Passphrase ของเรา**                                                               |                                                                             |                                                                                            |
| `vault kv put secret/pgp/our-system/passphrase passphrase="OurSecurePassphrase123!"`           | `Key Value Secret written to: secret/data/pgp/our-system/passphrase`        | จัดเก็บ **Passphrase** **แยก**ไว้คนละ Path เพื่อเพิ่มชั้นการป้องกัน (**Defense-in-Depth**) |
| **3. จัดเก็บ Public Key ของ Partner**                                                          |                                                                             |                                                                                            |
| `vault kv put secret/pgp/partners/system-a/public-key key="-----BEGIN PGP PUBLIC KEY-----..."` | `Key Value Secret written to: secret/data/pgp/partners/system-a/public-key` | จัดเก็บ **Public Key** ของ Partner 'System A' สำหรับการเข้ารหัส                            |

> **หมายเหตุ:** **Microservice** จะใช้ **Vault Client** ในการ **Auth** และดึง Key เหล่านี้มาใช้ในการทำงานแบบ **Runtime** ผ่าน **Service Account** ที่ถูกจำกัดสิทธิ์ (**Least Privilege**)

---

## 🛡️ การตรวจสอบความถูกต้องของ Keys (Verification)

การตรวจสอบนี้สำคัญที่สุดเพื่อยืนยันว่า Key ที่ได้รับมาเป็นของ **Partner จริง ๆ** และไม่มีการแก้ไขระหว่างการแลกเปลี่ยน

#### 1. Fingerprint Verification

คือการตรวจสอบค่าแฮช (**Hash**) สั้นๆ ของ **Public Key** ผ่านช่องทางที่ **เชื่อถือได้** (เช่น การโทรศัพท์ยืนยัน) เพื่อป้องกันการโจมตีแบบ **Man-in-the-Middle (MITM)**

```bash
# ===== คำสั่ง: ตรวจสอบ Fingerprint Key ที่ได้รับมา =====
gpg --fingerprint partner@email.com

# เปรียบเทียบกับ Fingerprint ที่ได้รับแจ้งจาก Partner (ต้องตรงกันทุกตัวอักษร)
```

| ผลลัพธ์ตัวอย่าง                                                                                               | คำอธิบาย                                                                                                                                            |
| :------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pub   rsa3072 2024-01-15 [SC]` <br> `Key fingerprint: **ABCD 1234 EF56 7890 ABCD 1234 EF56 7890 ABCD 1234**` | **Key Fingerprint** 40 ตัวอักษรนี้จะต้องถูกเปรียบเทียบกับค่าที่ได้รับแจ้งจาก Partner ผ่านช่องทางที่ 3 (**Out-of-Band**) **(ต้องตรงกันทุกตัวอักษร)** |

#### 2. Digital Signature Verification

ใช้เพื่อตรวจสอบว่า **Public Key File** ที่ได้รับมาไม่ได้ถูกแก้ไขหรือ **ปลอมแปลง** ระหว่างทาง (**Data Integrity**) โดยใช้ลายเซ็นที่ Partner สร้างขึ้นจาก **Private Key** ของเขา

```bash
# ===== คำสั่ง: ตรวจสอบ Digital Signature ของ Public Key File =====
gpg --verify public_key.asc.sig public_key.asc
```

| ผลลัพธ์ตัวอย่าง                                                                                                                  | คำอธิบาย                                                                                                                                     |
| :------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `gpg: Signature made Tue 10 Jun 2025 10:00:00 AM ICT` <br> `gpg: **Good signature from "Partner System A <partner@email.com>"**` | ระบบยืนยันว่าไฟล์ `public_key.asc` ถูกเซ็นโดย **Private Key** ที่สอดคล้องกับ Key ID ของ Partner **("Good signature..." คือสถานะที่ถูกต้อง)** |
| `gpg: BAD signature from "Partner System A <partner@email.com>"`                                                                 | **สถานะผิดพลาด:** แสดงว่าไฟล์ **Public Key** อาจถูกแก้ไข, ลายเซ็นไม่ตรง, หรือถูกเซ็นด้วย Key ที่หมดอายุ **(ห้าม Import)**                    |

#### **3. Trust Level Setting**

การตั้งค่าระดับความเชื่อถือ (Trust Level) ให้กับ Public Key ของ Partner ใน GPG Keyring

```bash
# ===== คำสั่ง: ตั้งค่า Trust Level (สำหรับ GPG Client) =====
gpg --edit-key partner@email.com # เข้าสู่โหมดแก้ไข Key
trust                             # พิมพ์คำสั่ง 'trust'
# เลือก trust level (เช่น 4 = full trust)
save                              # บันทึกและออกจากโหมดแก้ไข
```

### **Best Practices สำหรับ Key Exchange**

#### 1. Security Checklist (สิ่งที่ต้องปฏิบัติ)

| สถานะ | รายการปฏิบัติ                                    | คำอธิบาย                                                                        |
| :---: | :----------------------------------------------- | :------------------------------------------------------------------------------ |
|  ✅   | ใช้ **Secure Channel** เท่านั้น                  | ห้ามใช้ช่องทางที่ไม่เข้ารหัส (เช่น Email ธรรมดา) ในการส่ง **Public Key**        |
|  ✅   | ตรวจสอบ **Fingerprint** ของ Public Key           | ยืนยันค่า Fingerprint ผ่านช่องทางที่สาม (**Out-of-Band**) เพื่อป้องกัน **MITM** |
|  ✅   | ใช้ **Digital Signature** เพื่อยืนยันความถูกต้อง | ให้ Partner เซ็น Public Key ด้วย Private Key ของตนเอง เพื่อยืนยันตัวตน          |
|  ✅   | ตั้ง **Trust Level** ที่เหมาะสม                  | กำหนดระดับความเชื่อถือใน Keyring ของ GPG (เช่น **Full Trust**)                  |
|  ✅   | เก็บ **Audit Log** ของการแลกเปลี่ยน Keys         | บันทึกรายละเอียดการ Import/Export Key เพื่อการตรวจสอบย้อนหลัง                   |
|  ❌   | **ไม่ส่ง Private Key ผ่าน Network**              | **Private Key** ต้องถูกเก็บใน **Vault** และไม่เคยเผยแพร่สู่ภายนอก               |

#### **2. Automation Script (ตัวอย่างการส่ง Key)**

```bash
#!/bin/bash
# ===== Key Exchange Automation Script (ส่ง Public Key พร้อม Signature) =====

# ตรวจสอบ parameters
if [ $# -ne 2 ]; then
    echo "Usage: $0 <partner_email> <secure_server_user@host>"
    exit 1
fi

PARTNER_EMAIL=$1
SECURE_SERVER=$2

# 1. Export public key (เปลี่ยน your@email.com เป็น Key ID ที่ใช้จริง)
echo "1. Exporting public key..."
gpg --armor --export your@email.com > my_public_key.asc

# 2. สร้าง digital signature (ไฟล์ .asc.sig)
echo "2. Creating digital signature..."
gpg --detach-sign --armor my_public_key.asc

# 3. ส่งผ่าน SFTP (Secure File Transfer Protocol)
echo "3. Uploading to secure server..."
sftp $SECURE_SERVER << EOF
# อัปโหลด Public Key และ Signature ไปยังโฟลเดอร์สำหรับแลกเปลี่ยน Key
put my_public_key.asc /incoming/keys/
put my_public_key.asc.sig /incoming/keys/
quit
EOF

echo "Key exchange completed successfully!"
echo "Partner can download files from: $SECURE_SERVER/incoming/keys/"
```

## 🏗️ การใช้งาน PGP ใน Application Microservice (Spring Boot/Batch)

ในสถาปัตยกรรมที่เน้นความปลอดภัย Microservice (เช่น Spring Boot หรือ Spring Batch) จะทำหน้าที่เป็น Client ในการดึง PGP Keys (ที่จัดเก็บใน Vault) มาใช้ในการเข้ารหัส/ถอดรหัสไฟล์ ณ Runtime

### **ภาพรวมระบบ (Microservice + Vault Integration)**

```mermaid
flowchart TD
    A[External System] -->|1 ส่ง-รับไฟล์| B[Our Microservice (Spring Boot/Batch)];
    B -->|2 ดึง Keys Runtime| C[HashiCorp Vault];
    B -->|3 ใช้ Keys ใน PGP Logic| D[PGP Processing Logic];
    D -->|4 ส่งไฟล์กลับ| A;
    B -->|5 Audit Log| F[Monitoring];

    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style B fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style C fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style D fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    style F fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```

### **Microservice Responsibilities**

Microservice จะถูกแบ่งบทบาทออกเป็น Components ที่ชัดเจน:

#### **1. Application Encryption Component (Outbound File)**

- **รับไฟล์** จาก Internal Application หรือ Spring Batch Reader
- **ดึง Public Key** ของ External System จาก Vault ผ่าน Spring Cloud Vault Client
- **เข้ารหัสไฟล์** ด้วย Public Key ของ External System
- **ส่งไฟล์ที่เข้ารหัส** กลับให้ External System
- **บันทึก Audit Log** ทุกกิจกรรมการเข้ารหัส

#### **2. Application Decryption Component (Inbound File)**

- **รับไฟล์ที่เข้ารหัส** จาก External System ผ่าน Spring Batch Job
- **ดึง Private Key + Passphrase** จาก Vault
- **ถอดรหัสไฟล์** ด้วย Private Key + Passphrase ของเรา
- **ส่งไฟล์ที่ถอดรหัส** ต่อไปให้ Internal Application เพื่อประมวลผล
- **บันทึก Audit Log** ทุกกิจกรรมการถอดรหัส

#### **3. Key Management Service (Maintenance)**

- **จัดการ Public Keys** ของ External Systems
- **จัดการ Private Key + Passphrase** ของเรา
- **ตรวจสอบ Key Expiry** และแจ้งเตือน (Monitor)
- **Rotate Keys** ตามกำหนดเวลา

### **ตัวอย่างการใช้งานจริงใน Microservice (Java/Spring Boot)**

#### **สถานการณ์ที่ 1: External System ส่งไฟล์ให้เรา (Decryption)**

```java
// ===== PGP Decryption Service (Component ภายใน Application Service) =====
@Service
public class PGPDecryptionService {
    // ใช้ VaultClient ที่ Inject มาจาก Spring Cloud Vault
    private final VaultClient vaultClient;

    // ===== รับไฟล์ที่เข้ารหัสจาก External System =====
    @Async
    public void processIncomingEncryptedFile(String externalSystemId,
                                           String encryptedFilePath) {

        try {
            // 1. ดึง Private Key + Passphrase จาก Vault (Runtime Access)
            String privateKey = vaultClient.getSecret("pgp/private-key");
            String passphrase = vaultClient.getSecret("pgp/passphrase");

            // 2. ถอดรหัสไฟล์ด้วย Keys ที่ดึงมา
            String decryptedFilePath = decryptFile(encryptedFilePath,
                                                 privateKey,
                                                 passphrase);

            // 3. บันทึกไฟล์ที่ถอดรหัสแล้ว และบันทึก Audit Log
            fileStorage.storeDecryptedFile(decryptedFilePath);
            auditService.logFileDecryption(...);

        } catch (Exception e) {
            // จัดการ Error เช่น Keys ผิด หรือ Vault Access Error
            auditService.logDecryptionError(...);
        }
    }
}
```

#### **สถานการณ์ที่ 2: เราส่งไฟล์ให้ External System (Encryption)**

```java
// ===== PGP Encryption Service (Component ภายใน Application Service) =====
@Service
public class PGPEncryptionService {

    private final VaultClient vaultClient;
    private final ExternalSystemClient externalSystemClient;
    private final AuditService auditService;

    // ===== ส่งไฟล์ที่เข้ารหัสให้ External System =====
    @Async
    public void sendEncryptedFileToExternalSystem(String externalSystemId,
                                                String filePath) {

        try {
            // 1. ดึง Public Key ของ External System จาก Vault
            String publicKey = vaultClient.getSecret(
                "external-systems/" + externalSystemId + "/public-key");

            // 2. เข้ารหัสไฟล์
            String encryptedFilePath = encryptFile(filePath, publicKey);

            // 3. ส่งไฟล์ที่เข้ารหัสให้ External System
            externalSystemClient.uploadFile(externalSystemId, encryptedFilePath);

            // 4. บันทึก Audit Log
            auditService.logFileEncryption(externalSystemId,
                                         filePath,
                                         encryptedFilePath);

        } catch (Exception e) {
            // จัดการ error
            auditService.logEncryptionError(externalSystemId,
                                          filePath,
                                          e.getMessage());
        }
    }
}
```

### **การจัดการ Keys ใน Vault**

การจัดเก็บ PGP Keys ทั้งหมดต้องทำผ่าน HashiCorp Vault เพื่อให้ Microservice สามารถดึง Key มาใช้ในการทำงานได้ ณ Runtime โดยไม่ต้องมีการ Hardcode หรือจัดเก็บใน File System

```bash
# ===== การจัดเก็บ Keys ใน Vault KV Secret Engine V2 =====

# 1. Private Key และ Passphrase ของเรา (สำหรับ Decryption)
vault kv put secret/pgp/private-key key="-----BEGIN PGP PRIVATE KEY-----..."
vault kv put secret/pgp/passphrase passphrase="OurSecurePassphrase123!"

# 2. Public Keys ของ External Systems (สำหรับ Encryption)
vault kv put secret/external-systems/system-a/public-key \
    key="-----BEGIN PGP PUBLIC KEY-----..."
vault kv put secret/external-systems/system-b/public-key \
    key="-----BEGIN PGP PUBLIC KEY-----..."

# 3. การเข้าถึง Keys (Least Privilege):
# Microservice จะใช้ Service Account Token (ผ่าน Kubernetes Auth Method)
# เพื่อ Authenticate กับ Vault และดึง keys ที่จำเป็นสำหรับการเข้ารหัส/ถอดรหัสเท่านั้น
```

### **การ Monitor และ Alert**

Service ต้องมีการตรวจสอบ (Monitor) สถานะของ Keys และบันทึกกิจกรรมต่างๆ เพื่อรักษาความปลอดภัย และเตรียมพร้อมสำหรับการหมุนเวียน Keys (Rotation)

```java
// ===== Key Monitoring Service (Java/Spring Boot @Scheduled) =====
@Service
public class KeyMonitoringService {

    @Scheduled(fixedRate = 86400000) // ตรวจสอบทุก 24 ชั่วโมง (86.4 ล้าน ms)
    public void checkKeyExpiry() {

        // ตรวจสอบ keys ที่จะหมดอายุใน 30 วันล่วงหน้า
        List<KeyInfo> expiringKeys = vaultClient.getExpiringKeys(30);

        for (KeyInfo key : expiringKeys) {
            // ส่ง alert ไปยัง Security Team หรือ Operation Team
            alertService.sendKeyExpiryAlert(key);
        }
    }

    @EventListener
    public void handleEncryptionError(EncryptionErrorEvent event) {
        // แจ้งเตือนเมื่อเกิด error ในการเข้ารหัส (เช่น Public Key ของ Partner ผิดพลาด)
        alertService.sendEncryptionErrorAlert(event);
    }

    @EventListener
    public void handleDecryptionError(DecryptionErrorEvent event) {
        // แจ้งเตือนเมื่อเกิด error ในการถอดรหัส (เช่น ไฟล์เสียหาย หรือ Private Key ผิด)
        alertService.sendDecryptionErrorAlert(event);
    }
}
```

### **Best Practices สำหรับ Microservice**

#### 1. Security 🔒

- **ใช้ Vault** สำหรับจัดการ **Keys** และ **Secrets** ทั้งหมด (Secret Zero Principle)
- **แยก Private Key และ Passphrase** ในการจัดเก็บ (Defense-in-Depth)
- **ใช้ Service Account** ที่จำกัดสิทธิ์ (**Least Privilege**) สำหรับการเข้าถึง Vault
- **เข้ารหัสข้อมูล** ในทุกสถานะ (**in transit** และ **at rest**)

#### 2. Monitoring 📊

- **Audit Log** ทุกการเข้ารหัส/ถอดรหัส (เพื่อการตรวจสอบย้อนหลัง)
- **Monitor Key Expiry** และแจ้งเตือนล่วงหน้า (เพื่อวางแผน Key Rotation)
- **Track Error Rates** และ performance metrics ของ PGP Component
- **Alert on Security Events** เช่น failed decryption attempts

#### 3. Scalability 🚀

- **Async Processing** สำหรับการเข้ารหัส/ถอดรหัสไฟล์ (ไม่บล็อก Main Thread)
- **Queue-based Processing** สำหรับไฟล์ขนาดใหญ่และปริมาณงานสูง
- **Horizontal Scaling** ของ Microservice ที่รัน PGP Logic
- **Caching** สำหรับ frequently used keys (ลด Latency ในการเรียก Vault)

#### 4. Error Handling 🚧

- **Retry Logic** สำหรับ transient failures (ความล้มเหลวชั่วคราว)
- **Circuit Breaker** สำหรับ external system calls (ป้องกันการเรียกซ้ำระบบภายนอกที่ไม่ตอบสนอง)
- **Dead Letter Queue (DLQ)** สำหรับไฟล์ที่ไม่สามารถประมวลผลได้ (ตรวจสอบสาเหตุภายหลัง)
- **Graceful Degradation** เมื่อ Vault ไม่สามารถเข้าถึงได้ (เช่น การใช้ Local Cache ชั่วคราว ภายใต้เงื่อนไขที่ปลอดภัย)

---

## 📋 สรุป

การใช้งาน **PGP Encryption** สำหรับการรับส่งไฟล์แบบปลอดภัยในสถาปัตยกรรม **Microservice** มุ่งเน้นไปที่การผสานรวม **HashiCorp Vault** โดยมีขั้นตอนหลักดังนี้:

1.  **การสร้าง Key Pair** - สร้าง public key และ private key พร้อม passphrase
2.  **การแลกเปลี่ยน Public Keys** - ผ่าน secure channel พร้อมการตรวจสอบความถูกต้อง (**Verification**)
3.  **การเข้ารหัสไฟล์** - ใช้ public key ของผู้รับ
4.  **การส่งไฟล์** - ควรส่งผ่านช่องทางที่ **ปลอดภัย** (แม้ไฟล์จะเข้ารหัสแล้วก็ตาม)
5.  **การถอดรหัส** - ใช้ private key + passphrase ของผู้รับ (ที่ดึงมาจาก Vault)

ในระบบ **Microservice** การจัดการ keys จะทำผ่าน **Vault** เพื่อความปลอดภัย และมีการ **Monitor** ตลอดเวลาเพื่อให้แน่ใจว่าระบบทำงานได้อย่างต่อเนื่องและปลอดภัย
