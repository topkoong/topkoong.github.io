---
layout: ../../../layouts/BlogPost.astro
title: 'เจาะลึก SQL Subquery: วิธีการใช้งานและเทคนิคการเขียนเพื่อประสิทธิภาพสูงสุด 🚀'
description: 'เรียนรู้การใช้งาน SQL Subquery ตั้งแต่พื้นฐานจนถึงเทคนิคขั้นสูง พร้อมตัวอย่างการใช้งานจริง และกลยุทธ์การเลือกใช้ JOIN หรือ CTE เพื่อ Performance ที่ดีกว่า'
date: '2024-06-13'
published: true
---

# เจาะลึก SQL Subquery: วิธีการใช้งานและเทคนิคการเขียนเพื่อประสิทธิภาพสูงสุด

## 📖 บทนำ

**SQL Subquery** คือการเขียน Query ซ้อน Query หรือที่เรียกว่า **"Inner Query"** ซึ่งใช้ผลลัพธ์ของมันส่งต่อไปให้ **"Outer Query"** ประมวลผลต่อ เครื่องมือนี้ทำให้เราสามารถจัดการกับเงื่อนไขและการคำนวณที่ซับซ้อนได้ในประโยค SQL เดียว การเข้าใจ Subquery อย่างลึกซึ้งจึงเป็นทักษะสำคัญที่ช่วยยกระดับการเขียนโค้ดของคุณให้มีประสิทธิภาพและยืดหยุ่น

---

## 🔍 Subquery คืออะไร?

**Subquery** คือ Query ที่ถูกฝังอยู่ในวงเล็บภายใน Query หลัก มันจะทำหน้าที่ **"คำนวณก่อน"** หรือ **"ดึงข้อมูลชั่วคราว"** ก่อนที่ Query หลักจะดำเนินการต่อ

### โครงสร้างพื้นฐาน

```sql
SELECT column1
FROM table1
WHERE column_filter = (
    -- Subquery อยู่ตรงนี้ (จะรันก่อนเสมอ)
    SELECT calculated_value FROM table2 WHERE condition
);
```

---

## 🎯 ประเภทของ Subquery และการใช้งาน

เราแบ่ง Subquery ออกเป็น 3 ประเภทหลัก ตามลักษณะของผลลัพธ์ที่คืนกลับมา:

### 1. Scalar Subquery (คืนค่าเดียว: Single Row, Single Column)

คืนค่าข้อมูลเพียง **1 แถว และ 1 คอลัมน์** เท่านั้น ใช้สำหรับเปรียบเทียบค่าเดียว หรือนำไปแสดงผล

#### ตัวอย่างที่ 1: การเปรียบเทียบกับค่าเฉลี่ยรวม (ใช้ใน WHERE)

**โจทย์:** แสดงเฉพาะสินค้าที่มีราคาสูงกว่าราคาเฉลี่ยของสินค้าทั้งหมดในฐานข้อมูล

```sql
SELECT product_name, price
FROM products
WHERE price > (
    -- Scalar Subquery: คืนค่าราคาเฉลี่ยรวม (เช่น 14062.50)
    SELECT AVG(price)
    FROM products
);
```

**อธิบาย:** Database รัน Subquery เพื่อหาค่า `AVG(price)` ออกมาเป็นตัวเลขเดียว จากนั้น Outer Query จะใช้ตัวเลขนั้นเป็นเกณฑ์ในการกรอง

#### ตัวอย่างที่ 2: การแสดงค่ารวมที่คำนวณมา (ใช้ใน SELECT)

**โจทย์:** แสดงข้อมูลสินค้าทุกชิ้น พร้อมระบุว่าราคาสินค้าชิ้นนั้นสูงกว่าราคาเฉลี่ยรวมของสินค้าทั้งหมดอยู่เท่าไร

```sql
SELECT
    product_name,
    price,
    -- Scalar Subquery: ถูกใช้ในการคำนวณ
    price - (SELECT AVG(price) FROM products) AS difference_from_average
FROM products;
```

**อธิบาย:** Scalar Subquery ถูกใช้เป็นตัวเลขคงที่ในการคำนวณ Column ใหม่ (`difference_from_average`) สำหรับทุกแถวใน Outer Query

### 2. Column Subquery (คืนค่าหลายแถว, Single Column)

คืนค่าข้อมูล **หลายแถว แต่มีเพียง 1 คอลัมน์** ใช้สำหรับเปรียบเทียบกับชุดค่า (Set of values) โดยใช้ Operators เช่น **`IN`**, **`NOT IN`**, **`ANY`**, **`ALL`**

#### ตัวอย่างที่ 3: การกรองด้วยชุด ID (ใช้กับ IN)

**โจทย์:** ดึงข้อมูลออเดอร์ทั้งหมดที่ถูกสั่งโดยลูกค้าที่ลงทะเบียนในปี 2023

```sql
SELECT order_id, customer_id, order_date
FROM orders
WHERE customer_id IN (
    -- Column Subquery: คืนชุดของ customer_id ที่เข้าเงื่อนไข (เช่น 'C001', 'C002', ...)
    SELECT customer_id
    FROM customers
    WHERE registration_date BETWEEN '2023-01-01' AND '2023-12-31'
);
```

**อธิบาย:** Subquery สร้างลิสต์ของ ID ลูกค้าที่ลงทะเบียนในปี 2023 จากนั้น Outer Query ใช้ `IN` เพื่อเลือกเฉพาะออเดอร์ของลูกค้าในลิสต์นั้น

#### ตัวอย่างที่ 4: การเปรียบเทียบกับทุกค่าในชุด (ใช้กับ ALL)

**โจทย์:** หาผลิตภัณฑ์ที่มีราคาสูงกว่าราคาสินค้าทั้งหมดในหมวดหมู่ 'Home' (คือแพงกว่าสินค้า Home ที่แพงที่สุด)

```sql
SELECT product_name, price, category
FROM products
WHERE price > ALL (
    -- Column Subquery: คืนชุดของราคาในหมวดหมู่ 'Home' (เช่น 5000.00, 2500.00)
    SELECT price
    FROM products
    WHERE category = 'Home'
);
```

**อธิบาย:** `> ALL` หมายถึงต้องมากกว่าทุกค่าที่คืนมา ดังนั้นสินค้าที่แสดงออกมาจะมีราคาสูงกว่า 5000.00

### 3. Table Subquery (คืนค่าหลายแถว, Multiple Columns)

คืนค่าข้อมูล **หลายแถว และ หลายคอลัมน์** ใช้สำหรับสร้างตารางเสมือนชั่วคราว มักใช้ใน **`FROM`** Clause หรือใช้กับ **`EXISTS`**

#### ตัวอย่างที่ 5: การวิเคราะห์ยอดขายตามเมือง (ใช้ใน FROM)

**โจทย์:** แสดงยอดขายรวมของแต่ละเมือง พร้อมกับจำนวนลูกค้าทั้งหมดในเมืองนั้น ๆ

```sql
SELECT
    c.city,
    total_sales.city_total_sales
FROM customers c
JOIN (
    -- Table Subquery: สร้างตารางชั่วคราว 'total_sales' ที่มี city และยอดรวม
    SELECT
        c_inner.city,
        SUM(o.total_amount) AS city_total_sales
    FROM customers c_inner
    JOIN orders o ON c_inner.customer_id = o.customer_id
    GROUP BY c_inner.city
) total_sales ON c.city = total_sales.city
GROUP BY c.city, total_sales.city_total_sales;
```

**อธิบาย:** Subquery ถูกรันก่อนเพื่อสรุปยอดขายรายเมือง จากนั้น Outer Query จะ `JOIN` ตารางชั่วคราวนี้เข้ากับตาราง `customers` หลักเพื่อรวมข้อมูลลูกค้าที่ไม่ได้สั่งซื้อเข้ามาด้วย (ถ้าใช้ `LEFT JOIN`) หรือใช้เพื่อจัดระเบียบการแสดงผล

---

## 🔄 Correlated Subquery: กับดัก Performance (ย้ำอีกครั้ง!)

**Correlated Subquery** คือ Subquery ที่อ้างอิง Column จาก Query หลัก ซึ่งทำให้มันต้องถูกรันซ้ำสำหรับ **ทุก ๆ แถว** ใน Outer Query

### ตัวอย่างที่ 6: การหา Max Per Group (Max-per-group)

**โจทย์:** หาออเดอร์ล่าสุดของลูกค้าแต่ละคน (เป็นตัวอย่างคลาสสิกของ Correlated Subquery)

```sql
SELECT order_id, customer_id, order_date
FROM orders o1
WHERE order_date = (
    -- Correlated Subquery: รันซ้ำเพื่อหา Max(order_date) ของลูกค้าที่ตรงกัน (o2.customer_id = o1.customer_id)
    SELECT MAX(order_date)
    FROM orders o2
    WHERE o2.customer_id = o1.customer_id
);
```

**อธิบาย:** หากตาราง `orders` มี 10,000 แถว Subquery นี้อาจต้องถูกรันใกล้เคียง 10,000 ครั้ง ทำให้ Performance ตกอย่างมาก **ในกรณีนี้ การใช้ Window Function (เช่น `ROW_NUMBER()`) จะมีประสิทธิภาพสูงกว่ามาก**

---

## 🚀 สรุป: กลยุทธ์การใช้งานเพื่อ Performance

การเลือกใช้ Subquery หรือเครื่องมืออื่น ๆ ขึ้นอยู่กับวัตถุประสงค์และผลลัพธ์ที่ต้องการ:

| สถานการณ์                         | ทางเลือกที่ดีที่สุด   | เหตุผล                                                                 |
| :-------------------------------- | :-------------------- | :--------------------------------------------------------------------- |
| **เชื่อมข้อมูลระหว่างตาราง**      | **JOIN**              | Database Optimizer จัดการได้ดีกว่า และใช้ Index ได้เต็มที่             |
| **สร้างตารางสรุปชั่วคราว**        | **CTE (WITH Clause)** | โค้ดเป็นระเบียบ อ่านง่าย และ Performance มักดีกว่า Correlated Subquery |
| **ตรวจสอบว่ามีข้อมูลอยู่หรือไม่** | **EXISTS**            | หยุดการค้นหาเร็ว เหมาะสำหรับเงื่อนไข `TRUE/FALSE`                      |
| **ต้องคำนวณค่าเดียวแบบ Dynamic**  | **Scalar Subquery**   | เหมาะสมที่สุดในการใช้ใน `WHERE` หรือ `SELECT`                          |
