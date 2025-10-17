---
layout: ../../../layouts/BlogPost.astro
title: 'มาทำความรู้จัก Materialized Views: เมื่อเราเบื่อที่จะรัน Query ซ้ำๆ 😫'
description: 'วิธีเซฟ Query ไว้ใช้ซ้ำ ประหยัดเวลา ลด Server Load แถมยังเร็วกว่าเดิม'
date: '2024-12-30'
published: true
---

# Understanding Materialized Views

## 📋 ทำไมต้องใช้ Materialized Views?

ในการทำงานกับข้อมูลขนาดใหญ่ เราต้องเจอกับความท้าทายหลายอย่าง:

- Query ที่ซับซ้อนและใช้เวลานานในการประมวลผล
- Report ที่ต้องรันบ่อยๆ แต่ข้อมูลไม่ได้เปลี่ยนแปลงบ่อย
- Server load ที่สูงเกินไปจากการคำนวณซ้ำๆ

Materialized Views เป็นหนึ่งในวิธีแก้ปัญหาเหล่านี้

## 🔍 Concept & Implementation

### 1. โครงสร้างพื้นฐาน

```sql
-- ตัวอย่างตารางที่ใช้
CREATE TABLE orders (
    id INT PRIMARY KEY,
    order_date DATE,
    customer_id INT,
    total_amount DECIMAL(10,2)
);

CREATE TABLE order_items (
    id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2)
);

CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(50)
);
```

### ข้อมูลตัวอย่าง

1. **ตาราง orders**

```
id  | order_date  | customer_id | total_amount
1   | 2023-06-01 | 101         | 1500.00
2   | 2023-06-15 | 101         | 2000.00
3   | 2023-06-15 | 102         | 3000.00
4   | 2023-07-01 | 101         | 500.00
5   | 2023-07-01 | 102         | 1500.00
```

2. **ตาราง order_items**

```
id  | order_id | product_id | quantity | price
1   | 1        | 1          | 2        | 750.00
2   | 2        | 2          | 1        | 2000.00
3   | 3        | 1          | 3        | 1000.00
4   | 4        | 3          | 1        | 500.00
5   | 5        | 2          | 1        | 1500.00
```

3. **ตาราง products**

```
id  | name          | category
1   | Gaming Mouse  | Electronics
2   | Smart Watch   | Electronics
3   | T-Shirt       | Clothing
```

### 2. การสร้าง Materialized View

```sql
-- สร้าง view เก็บรายงานยอดขายรายเดือน
CREATE MATERIALIZED VIEW monthly_sales_report AS
SELECT
    -- แปลง date เป็นเดือน เช่น 2023-06-15 -> 2023-06-01
    DATE_TRUNC('month', order_date) as sale_month,

    -- ดึง category จากตาราง products
    p.category as product_category,

    -- คำนวณยอดขายรวม
    SUM(total_amount) as total_sales,

    -- นับจำนวนลูกค้าที่ไม่ซ้ำกัน (unique)
    COUNT(DISTINCT o.customer_id) as unique_customers,

    -- คำนวณมูลค่าออเดอร์เฉลี่ย (quantity * price)
    AVG(oi.quantity * oi.price) as avg_order_value
FROM orders o
-- เชื่อมกับตาราง order_items เพื่อดูรายละเอียดสินค้า
JOIN order_items oi ON o.id = oi.order_id
-- เชื่อมกับตาราง products เพื่อดึง category
JOIN products p ON oi.product_id = p.id
-- จัดกลุ่มตามเดือนและ category
GROUP BY
    DATE_TRUNC('month', order_date),
    p.category;
```

### ผลลัพธ์ที่ได้จาก Materialized View

```
sale_month  | product_category | total_sales | unique_customers | avg_order_value
2023-06-01 | Electronics     | 6500.00     | 2               | 1250.00
2023-07-01 | Electronics     | 1500.00     | 1               | 1500.00
2023-07-01 | Clothing        | 500.00      | 1               | 500.00
```

### 3. การใช้งานและประโยชน์

**Query ก่อนใช้ Materialized View (แบบเดิมที่ชอบทำให้ Server ร้อนๆ 🔥):**

```sql
SELECT
    -- GROUP ตามเดือน เช่น 2023-12-15 -> 2023-12-01
    DATE_TRUNC('month', order_date) as sale_month,

    -- ดึง category สินค้า
    p.category,

    -- รวมยอดขาย
    SUM(total_amount)
FROM orders o
-- Join 3 ตาราง ทำให้ query หนักมาก
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
-- GROUP BY แบบลัดๆ โดยอ้างอิงลำดับ column
-- 1 = sale_month, 2 = category
GROUP BY 1, 2;

-- รันทีนึงใช้เวลาตั้ง 5 วินาที แถมยังกิน CPU เพียบ 😱
```

**Query หลังใช้ Materialized View:**

```sql
SELECT sale_month, product_category, total_sales
FROM monthly_sales_report
WHERE sale_month >= '2023-01-01';

-- Execution Time: ~0.1 seconds
```

### 4. การจัดการและอัพเดทข้อมูล

```sql
-- Manual Refresh
REFRESH MATERIALIZED VIEW monthly_sales_report;

-- Concurrent Refresh (ไม่ล็อคตาราง)
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales_report;

-- Conditional Refresh
BEGIN;
    -- เช็คว่ามีข้อมูลใหม่หรือไม่
    IF EXISTS (
        SELECT 1 FROM orders
        WHERE order_date > (SELECT MAX(sale_month) FROM monthly_sales_report)
    ) THEN
        REFRESH MATERIALIZED VIEW monthly_sales_report;
    END IF;
COMMIT;
```

## ⚡ Best Practices & Performance Tips

1. **เลือกใช้ให้เหมาะสม**

   - เหมาะกับข้อมูลที่อัพเดทไม่บ่อย
   - Query ที่ใช้ resources สูง
   - Report ที่ต้องรันประจำ

2. **การสร้าง Index**

   ```sql
   -- สร้าง index บน columns ที่ใช้บ่อย
   CREATE INDEX idx_monthly_sales_date
   ON monthly_sales_report(sale_month);
   ```

3. **Memory Considerations**

   - ระวังเรื่อง storage space
   - พิจารณา partitioning สำหรับข้อมูลขนาดใหญ่

4. **Refresh Strategy**
   - กำหนด refresh schedule ตาม business needs
   - ใช้ concurrent refresh เมื่อต้องการ high availability
   - พิจารณาใช้ incremental refresh สำหรับข้อมูลขนาดใหญ่

> **สรุปข้อดีของ Materialized View:**
>
> - รันครั้งเดียว เก็บไว้ใช้ได้เรื่อยๆ
> - ไม่ต้อง join ตารางใหม่ทุกครั้ง
> - เร็วกว่าเดิมเป็น 50 เท่า
> - Server ไม่ต้องทำงานหนัก ชีวิตดี๊ดี 😎
