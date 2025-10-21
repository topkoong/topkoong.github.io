---
layout: ../../../layouts/BlogPost.astro
title: 'Materialized Views: กลยุทธ์ทรงพลังในการเร่ง Query และลดภาระ Server'
description: 'เจาะลึก Materialized Views ตัวช่วยสำคัญสำหรับ Data Warehouse และระบบ Reporting ที่ต้องการความเร็วและประสิทธิภาพสูงสุด พร้อมเทคนิค Performance Tuning'
date: '2024-04-31'
published: true
---

# Materialized Views: กลยุทธ์ทรงพลังในการเร่ง Query และลดภาระ Server

ในโลกของฐานข้อมูลขนาดใหญ่ (Big Data) การสร้างรายงาน (Reporting) และการวิเคราะห์ข้อมูล (Analytics) มักจะต้องเจอกับ **Complex Queries** ที่มีการรวมข้อมูล (JOIN) และการคำนวณสรุป (Aggregation) ซึ่งใช้ทรัพยากรของ Server (CPU, I/O) สูงมาก

หาก Query เหล่านี้ถูกรันซ้ำ ๆ เพื่อสร้าง Dashboard ที่ข้อมูลไม่ได้เปลี่ยนแปลงแบบ Real-time **นี่คือต้นตอของปัญหาความช้า (Performance Bottleneck) และภาระงานที่หนักเกินความจำเป็นบน Server**

**Materialized View (MV)** คือกลยุทธ์สำคัญที่จะช่วยแก้ปัญหานี้

---

## 🏗️ 1. Standard View: จุดเริ่มต้นที่ไม่ได้ช่วยเรื่องความเร็ว

ก่อนจะพูดถึง MV เรามาทำความเข้าใจกับ **Standard View** หรือ **Virtual Table**

**Standard View** คือ **Object** ที่เก็บ **"สูตร"** ของ SQL Query ไว้ แต่ **ไม่ได้เก็บ Physical Data จริง ๆ** ทุกครั้งที่คุณเรียกใช้ View Database จะรัน Query นั้นซ้ำใหม่ทั้งหมด

- **ข้อดี:** ข้อมูลเป็น **Real-time** เสมอ
- **ข้อเสีย:** ไม่ได้ช่วยเรื่อง **Performance** เพราะต้องทำงานหนักทุกครั้งที่ถูกเรียกใช้

---

## 🎯 2. Materialized Views: การเปลี่ยน "สูตร" เป็น "Snapshot Data"

**Materialized View (MV)** คือการนำผลลัพธ์ของ Query ไป **"Materialize"** หรือ **"เก็บ"** ไว้ในรูปแบบของ **Physical Table** บน Disk

การใช้ MV คือการย้ายภาระการคำนวณจาก **Read Time** (เวลาที่ User Query) ไปเป็น **Write Time** (เวลาที่ Refresh) ทำให้การดึงข้อมูลรายงานเร็วขึ้นหลายเท่า

| Feature           | Standard View                   | Materialized View                           |
| :---------------- | :------------------------------ | :------------------------------------------ |
| **การเก็บข้อมูล** | Virtual Table (ไม่มีข้อมูลจริง) | **Physical Table (เก็บผลลัพธ์สำเร็จรูป)**   |
| **ความเร็ว**      | ช้า (ต้องประมวลผลใหม่ทุกครั้ง)  | **เร็วมาก** (ดึงข้อมูลเหมือนตารางทั่วไป)    |
| **ความสดใหม่**    | Real-time 100%                  | **อาจล่าช้า (Stale)** จนกว่าจะมีการ Refresh |

---

## 📈 3. การสร้าง Materialized View: จากพื้นฐานสู่มืออาชีพ

เราจะมาดูว่า Materialized View จัดการกับ **Complex Query** หลัก ๆ สองประเภทได้อย่างไร: **JOIN** และ **Aggregation**

### 3.1 การรวมข้อมูล (JOIN): พื้นฐานที่กินทรัพยากรสูง

**JOIN คืออะไรและทำเพื่ออะไร?**

**JOIN** คือการนำข้อมูลจากตารางที่แยกกัน (เพื่อลดความซ้ำซ้อนของข้อมูลตามหลักการ Normalization) มารวมกันชั่วคราวตามความสัมพันธ์ของ Primary Key และ Foreign Key

**ตัวอย่างง่าย ๆ ของการ JOIN:**

สมมติเราต้องการทราบว่า "Order ID 101 ซื้อสินค้าชื่ออะไรไป?" เราต้องนำข้อมูลจากตาราง **`orders`** มาเชื่อมกับตาราง **`products`** ผ่านตารางกลาง **`order_items`**

```sql
SELECT
    o.id AS order_id,
    p.name AS product_name
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;
-- Query นี้ต้องอ่านและเปรียบเทียบข้อมูลจาก 3 ตารางทุกครั้ง!
```

**การใช้ MV แก้ปัญหา JOIN:**

MV จะทำการ `JOIN` ตารางเหล่านี้เพียงครั้งเดียวในช่วง Refresh และเก็บผลลัพธ์ไว้ **ทำให้ Query ในภายหลังไม่ต้องทำ JOIN ซ้ำอีกเลย**

### 3.2 การสรุปผล (Aggregation): การคำนวณที่ใช้ CPU หนัก

**Aggregation คืออะไรและทำเพื่ออะไร?**

**Aggregation** คือฟังก์ชันที่ใช้สรุปข้อมูลหลายแถวให้เหลือเพียงแถวเดียว เช่น `SUM()` (รวม), `AVG()` (หาค่าเฉลี่ย), และ `COUNT(DISTINCT)` (นับค่าที่ไม่ซ้ำกัน) **การคำนวณ Aggregation โดยเฉพาะ `COUNT(DISTINCT)` ในข้อมูลขนาดใหญ่ ใช้ CPU และ Memory สูงมาก**

**ตัวอย่างง่าย ๆ ของ Aggregation:**

```sql
-- Query หาจำนวนลูกค้าที่ไม่ซ้ำกันในแต่ละวัน
SELECT
    order_date,
    COUNT(DISTINCT customer_id) AS unique_customers_daily
FROM orders
GROUP BY order_date;
-- การประมวลผล COUNT DISTINCT นี้จะกินทรัพยากรทุกครั้งที่รัน
```

### 3.3 ตัวอย่าง Production Grade (รวม JOIN และ Aggregation)

Materialized View ระดับมืออาชีพจะรวมการ `JOIN` และ `Aggregation` เข้าด้วยกันเพื่อสร้างตารางรายงานสำเร็จรูป

```sql
CREATE MATERIALIZED VIEW mv_monthly_category_sales AS
SELECT
    -- 1. GROUP BY Dimension: สรุปตามเดือนและหมวดหมู่
    DATE_TRUNC('month', o.order_date) AS sale_month,
    p.category AS product_category,

    -- 2. Aggregation Metrics: ค่าที่คำนวณสำเร็จรูป
    SUM(o.total_amount) AS total_sales,
    COUNT(DISTINCT o.customer_id) AS unique_customers

FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
GROUP BY
    DATE_TRUNC('month', o.order_date),
    p.category
WITH DATA;
```

**ผลลัพธ์:** เมื่อคุณ `SELECT *` จาก MV นี้ คุณจะดึงข้อมูลที่ถูกคำนวณและรวมไว้ล่วงหน้าแล้ว **ทั้งหมด**

---

## 🔍 4. การตรวจสอบ Performance ด้วย EXPLAIN ANALYZE

ในฐานะ Data Professional เราจะไม่เชื่อแค่ความรู้สึก แต่เราจะใช้เครื่องมือตรวจสอบแผนการทำงานของ Query (Execution Plan)

**เราตรวจสอบ Performance อย่างไร?**

เราใช้คำสั่ง **`EXPLAIN ANALYZE`** เพื่อดูว่า Database Engine ใช้เวลากับขั้นตอนไหนมากที่สุด

1. **ตรวจสอบ Query ดั้งเดิม (ก่อนใช้ MV):**

   ```sql
   EXPLAIN ANALYZE
   SELECT SUM(o.total_amount) ... FROM orders o JOIN order_items oi ...
   -- ผลลัพธ์: จะเห็นว่าเวลาส่วนใหญ่หมดไปกับ "Hash Join" และ "Grouping" (เช่น 5.2s)
   ```

2. **ตรวจสอบ Query หลังใช้ MV:**

   ```sql
   EXPLAIN ANALYZE
   SELECT total_sales FROM mv_monthly_category_sales WHERE sale_month = '2023-07-01';
   -- ผลลัพธ์: เวลาจะลดลงเหลือเพียง "Index Scan" หรือ "Sequential Scan" ที่เร็วมาก (เช่น 0.05s)
   ```

   **นี่คือหลักฐานที่พิสูจน์ว่า Materialized View ช่วยเร่งความเร็วได้จริง!**

---

## ⚙️ 5. การจัดการ Materialized View (Performance Tuning)

### กลยุทธ์การ Refresh (Data Freshness)

การเลือกเวลาและวิธีการ Refresh MV เป็นสิ่งสำคัญที่สุด เพื่อให้ข้อมูลไม่ล้าสมัยเกินไป:

- **Concurrent Refresh:** ใช้ `REFRESH MATERIALIZED VIEW CONCURRENTLY mv_name;` เพื่อให้ User ยัง Query ข้อมูลเดิมได้ ในขณะที่ข้อมูลใหม่กำลังถูกคำนวณอยู่หลังฉาก (ลด Downtime)
- **Scheduled Refresh:** ตั้งเวลา Refresh ด้วย Cron Job หรือเครื่องมือ ETL (เช่น ทุก 4 ชั่วโมง) ตามความต้องการทางธุรกิจ

### Indexing Best Practices บน MV

อย่าลืมสร้าง **Index** บน MV ใน Columns ที่ใช้ในการกรอง (`WHERE`) หรือจัดเรียง (`ORDER BY`) เพื่อให้การดึงข้อมูลจาก MV มีความเร็วสูงสุด

```sql
-- สร้าง Index บน Columns ที่ใช้บ่อยในการ WHERE clause
CREATE INDEX idx_sales_month
ON mv_monthly_category_sales(sale_month);
```

---

## สรุป

**Materialized View** คือเทคนิคในการทำ **Pre-computation** หรือ **"การคำนวณล่วงหน้า"** เพื่อย้ายงานหนัก (CPU และ I/O) ไปทำในช่วงที่ Server โหลดน้อยที่สุด ทำให้รายงานและ Dashboard ที่คุณเรียกใช้งานนั้น **เร็วขึ้นกว่าเดิมหลายเท่า** โดยมี Trade-off ที่ยอมรับได้คือข้อมูลอาจจะล่าช้าไปเล็กน้อยเมื่อเทียบกับ Real-time
