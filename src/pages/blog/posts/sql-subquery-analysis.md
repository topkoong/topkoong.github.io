---
layout: ../../../layouts/BlogPost.astro
title: 'เจาะลึก SQL Subquery: วิธีการใช้งานและเทคนิคการเขียน 🎯'
description: 'เรียนรู้การใช้งาน SQL Subquery ตั้งแต่พื้นฐานจนถึงเทคนิคขั้นสูง พร้อมตัวอย่างการใช้งานจริง'
date: '2024-12-30'
published: true
---

# เจาะลึก SQL Subquery: วิธีการใช้งานและเทคนิคการเขียน

## 📖 บทนำ

SQL Subquery เป็นเครื่องมือที่ทรงพลังสำหรับการเขียน query ที่ซับซ้อน โดยช่วยให้เราสามารถใช้ผลลัพธ์จาก query หนึ่งเป็น input ของ query อื่นได้ การเข้าใจ Subquery จะช่วยให้เราเขียน SQL ได้อย่างมีประสิทธิภาพและแก้ปัญหาที่ซับซ้อนได้ง่ายขึ้น

## 🔍 Subquery คืออะไร?

**Subquery** คือ SQL query ที่อยู่ภายใน query อื่น (เรียกว่า Outer Query หรือ Main Query) โดย Subquery จะถูกประมวลผลก่อน และผลลัพธ์จะถูกใช้โดย Outer Query

### **โครงสร้างพื้นฐาน:**

```sql
SELECT column1, column2, ...
FROM table1
WHERE column1 IN (
    SELECT column1
    FROM table2
    WHERE condition
);
```

## 📊 ตัวอย่างข้อมูลสำหรับการเรียนรู้

ก่อนเริ่มเรียนรู้ Subquery เรามาดูข้อมูลตัวอย่างที่จะใช้ในการอธิบาย:

### **ตาราง customers**

```sql
-- ===== การสร้างตาราง customers =====
-- CREATE TABLE คือคำสั่งสำหรับสร้างตารางใหม่ในฐานข้อมูล
CREATE TABLE customers (
    -- customer_id: เก็บรหัสลูกค้า เป็นข้อความความยาวไม่เกิน 10 ตัวอักษร
    -- PRIMARY KEY: กำหนดให้เป็นคีย์หลัก (ไม่ซ้ำกัน, ไม่เป็น NULL)
    customer_id VARCHAR(10) PRIMARY KEY,

    -- customer_name: เก็บชื่อลูกค้า เป็นข้อความความยาวไม่เกิน 100 ตัวอักษร
    customer_name VARCHAR(100),

    -- email: เก็บอีเมลลูกค้า เป็นข้อความความยาวไม่เกิน 100 ตัวอักษร
    email VARCHAR(100),

    -- city: เก็บเมืองที่ลูกค้าอยู่ เป็นข้อความความยาวไม่เกิน 50 ตัวอักษร
    city VARCHAR(50),

    -- registration_date: เก็บวันที่ลงทะเบียน เป็นประเภทข้อมูล DATE (รูปแบบ: YYYY-MM-DD)
    registration_date DATE
);

-- ===== การเพิ่มข้อมูลลงในตาราง customers =====
-- INSERT INTO คือคำสั่งสำหรับเพิ่มข้อมูลลงในตาราง
INSERT INTO customers VALUES
    -- แถวที่ 1: ข้อมูลของ John Doe (customer_id ต้องไม่ซ้ำกันเพราะเป็น PRIMARY KEY)
    ('C001', 'John Doe', 'john@email.com', 'Bangkok', '2023-01-15'),

    -- แถวที่ 2: ข้อมูลของ Jane Smith
    ('C002', 'Jane Smith', 'jane@email.com', 'Chiang Mai', '2023-02-20'),

    -- แถวที่ 3: ข้อมูลของ Bob Johnson
    ('C003', 'Bob Johnson', 'bob@email.com', 'Phuket', '2023-03-10'),

    -- แถวที่ 4: ข้อมูลของ Alice Brown (เมือง Bangkok ซ้ำกับ John Doe ได้)
    ('C004', 'Alice Brown', 'alice@email.com', 'Bangkok', '2023-04-05'),

    -- แถวที่ 5: ข้อมูลของ Charlie Wilson
    ('C005', 'Charlie Wilson', 'charlie@email.com', 'Pattaya', '2023-05-12');
```

### **ตาราง orders**

```sql
CREATE TABLE orders (
    order_id VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10),
    order_date DATE,
    total_amount DECIMAL(10,2),
    status VARCHAR(20),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

INSERT INTO orders VALUES
('O001', 'C001', '2024-01-15', 1500.00, 'Completed'),
('O002', 'C001', '2024-02-20', 2000.00, 'Completed'),
('O003', 'C001', '2024-03-10', 500.00, 'Completed'),
('O004', 'C002', '2024-01-25', 3000.00, 'Completed'),
('O005', 'C002', '2024-02-15', 1500.00, 'Completed'),
('O006', 'C003', '2024-01-30', 800.00, 'Completed'),
('O007', 'C004', '2024-02-10', 1200.00, 'Completed'),
('O008', 'C005', '2024-03-05', 2500.00, 'Completed');
```

### **ตาราง products**

```sql
CREATE TABLE products (
    product_id VARCHAR(10) PRIMARY KEY,
    product_name VARCHAR(100),
    category VARCHAR(50),
    price DECIMAL(10,2),
    stock_quantity INT
);

INSERT INTO products VALUES
('P001', 'Laptop Dell XPS', 'Electronics', 45000.00, 10),
('P002', 'iPhone 15 Pro', 'Electronics', 35000.00, 25),
('P003', 'Samsung TV 55"', 'Electronics', 25000.00, 8),
('P004', 'Nike Running Shoes', 'Sports', 3500.00, 50),
('P005', 'Adidas T-Shirt', 'Sports', 1200.00, 100),
('P006', 'Coffee Maker', 'Home', 5000.00, 15),
('P007', 'Blender', 'Home', 2500.00, 20),
('P008', 'Yoga Mat', 'Sports', 800.00, 30);
```

## 🎯 ประเภทของ Subquery

### **1. Scalar Subquery (Subquery ที่คืนค่าเดียว)**

Scalar Subquery จะคืนค่าข้อมูลเพียง 1 แถว 1 คอลัมน์ เหมาะสำหรับใช้ใน SELECT, WHERE, HAVING clause

#### **ตัวอย่างที่ 1: หาลูกค้าที่มีมูลค่าออเดอร์สูงกว่าค่าเฉลี่ยทั้งหมด**

```sql
-- ===== วิธีที่ 1: ใช้ Scalar Subquery ใน WHERE =====
SELECT customer_id, customer_name, total_amount
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.total_amount > (
    SELECT AVG(total_amount)
    FROM orders
);
```

**การทำงาน:**

1. **Subquery** `(SELECT AVG(total_amount) FROM orders)` คำนวณค่าเฉลี่ยของ total_amount ทั้งหมด
2. **Outer Query** เปรียบเทียบ total_amount ของแต่ละออเดอร์กับค่าเฉลี่ยที่ได้
3. **ผลลัพธ์** แสดงเฉพาะออเดอร์ที่มีมูลค่าสูงกว่าค่าเฉลี่ย

**ผลลัพธ์:**

```
customer_id | customer_name | total_amount
C001 | John Doe | 1500.00
C001 | John Doe | 2000.00
C002 | Jane Smith | 3000.00
C005 | Charlie Wilson | 2500.00
```

#### **ตัวอย่างที่ 2: แสดงข้อมูลลูกค้าพร้อมจำนวนออเดอร์**

```sql
-- ===== ใช้ Scalar Subquery ใน SELECT =====
SELECT
    customer_id,
    customer_name,
    city,
    (
        SELECT COUNT(*)
        FROM orders
        WHERE customer_id = c.customer_id
    ) as order_count
FROM customers c;
```

**การทำงาน:**

1. **Subquery** นับจำนวนออเดอร์ของแต่ละลูกค้า
2. **Outer Query** แสดงข้อมูลลูกค้าพร้อมจำนวนออเดอร์

**ผลลัพธ์:**

```
customer_id | customer_name | city | order_count
C001 | John Doe | Bangkok | 3
C002 | Jane Smith | Chiang Mai | 2
C003 | Bob Johnson | Phuket | 1
C004 | Alice Brown | Bangkok | 1
C005 | Charlie Wilson | Pattaya | 1
```

### **2. Column Subquery (Subquery ที่คืนค่าหลายแถว 1 คอลัมน์)**

Column Subquery คืนค่าข้อมูลหลายแถวใน 1 คอลัมน์ ใช้กับ operators เช่น IN, NOT IN, ANY, ALL

#### **ตัวอย่างที่ 1: หาลูกค้าที่อยู่ในเมืองเดียวกับลูกค้าที่มีออเดอร์มูลค่าสูงกว่า 2000**

```sql
-- ===== ใช้ Column Subquery กับ IN =====
SELECT customer_id, customer_name, city
FROM customers
WHERE city IN (
    SELECT DISTINCT c.city
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    WHERE o.total_amount > 2000
);
```

**การทำงาน:**

1. **Subquery** หาเมืองที่มีลูกค้าที่มีออเดอร์มูลค่าสูงกว่า 2000
2. **Outer Query** แสดงลูกค้าทั้งหมดที่อยู่ในเมืองเหล่านั้น

**ผลลัพธ์:**

```
customer_id | customer_name | city
C001 | John Doe | Bangkok
C004 | Alice Brown | Bangkok
```

#### **ตัวอย่างที่ 2: หาผลิตภัณฑ์ที่มีราคาสูงกว่าผลิตภัณฑ์ในหมวดหมู่ Sports ทั้งหมด**

```sql
-- ===== ใช้ Column Subquery กับ ALL =====
SELECT product_id, product_name, category, price
FROM products
WHERE price > ALL (
    SELECT price
    FROM products
    WHERE category = 'Sports'
);
```

**การทำงาน:**

1. **Subquery** หาราคาของผลิตภัณฑ์ในหมวดหมู่ Sports ทั้งหมด
2. **Outer Query** แสดงผลิตภัณฑ์ที่มีราคาสูงกว่าราคาสูงสุดในหมวดหมู่ Sports

**ผลลัพธ์:**

```
product_id | product_name | category | price
P001 | Laptop Dell XPS | Electronics | 45000.00
P002 | iPhone 15 Pro | Electronics | 35000.00
P003 | Samsung TV 55" | Electronics | 25000.00
```

### **3. Table Subquery (Subquery ที่คืนค่าหลายแถวหลายคอลัมน์)**

Table Subquery คืนค่าข้อมูลหลายแถวหลายคอลัมน์ ใช้ใน FROM clause หรือกับ EXISTS

#### **ตัวอย่างที่ 1: หาลูกค้าที่มีออเดอร์มูลค่าสูงกว่าค่าเฉลี่ยของลูกค้าคนนั้น**

```sql
-- ===== ใช้ Table Subquery ใน FROM =====
SELECT
    o.order_id,
    o.customer_id,
    c.customer_name,
    o.total_amount,
    avg_amount.customer_average
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN (
    SELECT
        customer_id,
        AVG(total_amount) as customer_average
    FROM orders
    GROUP BY customer_id
) avg_amount ON o.customer_id = avg_amount.customer_id
WHERE o.total_amount > avg_amount.customer_average;
```

**การทำงาน:**

1. **Subquery** คำนวณค่าเฉลี่ยของ total_amount สำหรับแต่ละลูกค้า
2. **Outer Query** เปรียบเทียบ total_amount ของแต่ละออเดอร์กับค่าเฉลี่ยของลูกค้าคนนั้น

**ผลลัพธ์:**

```
order_id | customer_id | customer_name | total_amount | customer_average
O001 | C001 | John Doe | 1500.00 | 1333.33
O002 | C001 | John Doe | 2000.00 | 1333.33
O004 | C002 | Jane Smith | 3000.00 | 2250.00
```

#### **ตัวอย่างที่ 2: หาลูกค้าที่มีออเดอร์อย่างน้อย 1 ออเดอร์**

```sql
-- ===== ใช้ EXISTS =====
SELECT customer_id, customer_name, city
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
);
```

**การทำงาน:**

1. **Subquery** ตรวจสอบว่ามีออเดอร์ของลูกค้าคนนั้นหรือไม่
2. **Outer Query** แสดงลูกค้าที่มีออเดอร์อย่างน้อย 1 ออเดอร์

**ผลลัพธ์:**

```
customer_id | customer_name | city
C001 | John Doe | Bangkok
C002 | Jane Smith | Chiang Mai
C003 | Bob Johnson | Phuket
C004 | Alice Brown | Bangkok
C005 | Charlie Wilson | Pattaya
```

## 🔄 การทำงานของ Subquery แบบ Step-by-Step

### **ตัวอย่างการวิเคราะห์ Subquery ที่ซับซ้อน**

```sql
-- ===== Query ที่ซับซ้อน: หาลูกค้าที่มีออเดอร์มูลค่าสูงกว่าค่าเฉลี่ยของลูกค้าคนนั้น =====
SELECT
    o.order_id,
    o.customer_id,
    c.customer_name,
    o.total_amount,
    (
        SELECT AVG(total_amount)
        FROM orders
        WHERE customer_id = o.customer_id
    ) as customer_average
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.total_amount > (
    SELECT AVG(total_amount)
    FROM orders
    WHERE customer_id = o.customer_id
);
```

### **การทำงานแบบ Step-by-Step:**

#### **Step 1: ประมวลผล Subquery ใน WHERE clause**

```sql
-- สำหรับแต่ละแถวใน orders table
-- Subquery จะคำนวณค่าเฉลี่ยของ total_amount ของลูกค้าคนนั้น

-- ตัวอย่าง: สำหรับ customer_id = 'C001'
SELECT AVG(total_amount)
FROM orders
WHERE customer_id = 'C001';
-- ผลลัพธ์: 1333.33 (จาก 1500 + 2000 + 500 / 3)
```

#### **Step 2: กรองข้อมูลด้วย WHERE condition**

```sql
-- เปรียบเทียบ total_amount กับค่าเฉลี่ยที่ได้
-- ตัวอย่าง: 1500 > 1333.33 → TRUE (แสดงในผลลัพธ์)
-- ตัวอย่าง: 500 > 1333.33 → FALSE (ไม่แสดงในผลลัพธ์)
```

#### **Step 3: ประมวลผล Subquery ใน SELECT clause**

```sql
-- คำนวณค่าเฉลี่ยอีกครั้งสำหรับการแสดงผล
-- (เหมือนกับ Step 1 แต่ใช้สำหรับแสดงผล)
```

#### **Step 4: สร้างผลลัพธ์สุดท้าย**

```sql
-- รวมข้อมูลจาก customers table และแสดงผล
```

**ผลลัพธ์สุดท้าย:**

```
order_id | customer_id | customer_name | total_amount | customer_average
O001 | C001 | John Doe | 1500.00 | 1333.33
O002 | C001 | John Doe | 2000.00 | 1333.33
O004 | C002 | Jane Smith | 3000.00 | 2250.00
```

## ✅ ข้อดี (Pros) ของการใช้ Subquery

### **1. ความยืดหยุ่นสูง**

- สามารถเขียน logic ที่ซับซ้อนได้ใน query เดียว
- ไม่ต้องใช้ temporary tables หรือ multiple queries

### **2. อ่านง่ายและเข้าใจได้**

- Logic อยู่ในที่เดียว ทำให้เข้าใจง่าย
- ไม่ต้องดูหลายไฟล์หรือหลาย query

### **3. ประสิทธิภาพในการพัฒนา**

- เขียนได้เร็ว ไม่ต้องสร้าง temporary tables
- ลดความซับซ้อนของ application code

### **4. ความปลอดภัยของข้อมูล**

- ไม่ต้องสร้าง temporary tables ที่อาจรั่วไหลข้อมูล
- ข้อมูลถูกประมวลผลใน memory

### **5. รองรับ Dynamic Data**

- Subquery จะประมวลผลใหม่ทุกครั้งที่ query ทำงาน
- เหมาะสำหรับข้อมูลที่เปลี่ยนแปลงบ่อย

## ❌ ข้อเสีย (Cons) ของการใช้ Subquery

### **1. ประสิทธิภาพอาจต่ำ**

- Subquery อาจถูกประมวลผลหลายครั้ง (สำหรับแต่ละแถว)
- ไม่มี index optimization เหมือน JOIN

### **2. ความซับซ้อนในการ Debug**

- ยากต่อการ debug เมื่อมีปัญหา
- ไม่สามารถทดสอบ Subquery แยกได้ง่าย

### **3. การบำรุงรักษายาก**

- ยากต่อการแก้ไขเมื่อ business logic เปลี่ยน
- อาจทำให้ query ยาวและซับซ้อนเกินไป

### **4. ข้อจำกัดของ Database Engine**

- บาง database engine อาจไม่รองรับ Subquery บางประเภท
- Performance อาจแตกต่างกันระหว่าง database engines

### **5. การใช้ Memory สูง**

- Subquery อาจใช้ memory มากกว่าการใช้ JOIN
- อาจทำให้ database server ทำงานช้า

## 🎯 เมื่อไหร่ควรใช้ Subquery?

### **1. ใช้ Subquery เมื่อ:**

#### **✅ ต้องการข้อมูลที่ต้องคำนวณแบบ Dynamic**

```sql
-- ตัวอย่าง: หาผลิตภัณฑ์ที่มีราคาสูงกว่าค่าเฉลี่ยของหมวดหมู่
SELECT product_name, price, category
FROM products p1
WHERE price > (
    SELECT AVG(price)
    FROM products p2
    WHERE p2.category = p1.category
);
```

#### **✅ ต้องการตรวจสอบเงื่อนไขที่ซับซ้อน**

```sql
-- ตัวอย่าง: หาลูกค้าที่มีออเดอร์ในทุกหมวดหมู่
SELECT customer_id, customer_name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1
    FROM products p
    WHERE NOT EXISTS (
        SELECT 1
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.customer_id = c.customer_id
        AND oi.product_id = p.product_id
    )
);
```

#### **✅ ต้องการข้อมูลที่ต้อง Aggregate แบบ Conditional**

```sql
-- ตัวอย่าง: แสดงลูกค้าพร้อมจำนวนออเดอร์และมูลค่ารวม
SELECT
    customer_id,
    customer_name,
    (SELECT COUNT(*) FROM orders WHERE customer_id = c.customer_id) as order_count,
    (SELECT SUM(total_amount) FROM orders WHERE customer_id = c.customer_id) as total_spent
FROM customers c;
```

### **2. ใช้ JOIN แทน Subquery เมื่อ:**

#### **✅ ต้องการข้อมูลจากหลายตาราง**

```sql
-- แทนที่จะใช้ Subquery
SELECT customer_name,
       (SELECT COUNT(*) FROM orders WHERE customer_id = c.customer_id) as order_count
FROM customers c;

-- ใช้ JOIN แทน
SELECT c.customer_name, COUNT(o.order_id) as order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;
```

#### **✅ ต้องการประสิทธิภาพสูง**

```sql
-- แทนที่จะใช้ Subquery ใน WHERE
SELECT * FROM orders o
WHERE customer_id IN (
    SELECT customer_id FROM customers WHERE city = 'Bangkok'
);

-- ใช้ JOIN แทน
SELECT o.*
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE c.city = 'Bangkok';
```

## 🚀 เทคนิคการเขียน Subquery ที่มีประสิทธิภาพ

### **1. ใช้ EXISTS แทน IN เมื่อเป็นไปได้**

```sql
-- ❌ ไม่มีประสิทธิภาพ (IN)
SELECT customer_name
FROM customers
WHERE customer_id IN (
    SELECT customer_id FROM orders WHERE total_amount > 1000
);

-- ✅ มีประสิทธิภาพดีกว่า (EXISTS)
SELECT customer_name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.customer_id
    AND o.total_amount > 1000
);
```

### **2. หลีกเลี่ยง Correlated Subquery ใน SELECT**

```sql
-- ❌ Correlated Subquery ใน SELECT (ช้า)
SELECT
    customer_name,
    (SELECT COUNT(*) FROM orders WHERE customer_id = c.customer_id) as order_count
FROM customers c;

-- ✅ ใช้ JOIN แทน (เร็ว)
SELECT
    c.customer_name,
    COUNT(o.order_id) as order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name;
```

### **3. ใช้ Common Table Expression (CTE) สำหรับ Subquery ที่ซับซ้อน**

```sql
-- ✅ ใช้ CTE ทำให้อ่านง่ายและมีประสิทธิภาพ
WITH customer_averages AS (
    SELECT
        customer_id,
        AVG(total_amount) as avg_amount
    FROM orders
    GROUP BY customer_id
)
SELECT
    o.order_id,
    c.customer_name,
    o.total_amount,
    ca.avg_amount
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN customer_averages ca ON o.customer_id = ca.customer_id
WHERE o.total_amount > ca.avg_amount;
```

## 📋 สรุป

SQL Subquery เป็นเครื่องมือที่ทรงพลังสำหรับการเขียน query ที่ซับซ้อน แต่ต้องใช้อย่างเหมาะสม:

### **ข้อดี:**

- ความยืดหยุ่นสูง
- อ่านง่ายและเข้าใจได้
- ประสิทธิภาพในการพัฒนา
- ความปลอดภัยของข้อมูล

### **ข้อเสีย:**

- ประสิทธิภาพอาจต่ำ
- ความซับซ้อนในการ Debug
- การบำรุงรักษายาก

### **เมื่อไหร่ควรใช้:**

- ต้องการข้อมูลที่ต้องคำนวณแบบ Dynamic
- ต้องการตรวจสอบเงื่อนไขที่ซับซ้อน
- ต้องการข้อมูลที่ต้อง Aggregate แบบ Conditional

### **เมื่อไหร่ควรใช้ JOIN แทน:**

- ต้องการข้อมูลจากหลายตาราง
- ต้องการประสิทธิภาพสูง
- ต้องการข้อมูลที่ต้อง Aggregate หลายค่า

การเลือกใช้ Subquery หรือ JOIN ขึ้นอยู่กับความต้องการและข้อจำกัดของระบบ โดยต้องพิจารณาทั้งประสิทธิภาพ ความง่ายในการบำรุงรักษา และความเหมาะสมกับ business logic
