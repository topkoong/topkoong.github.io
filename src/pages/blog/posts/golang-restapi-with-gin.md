---
layout: ../../../layouts/BlogPost.astro
title: '⚡️ พัฒนา REST API เต็มรูปแบบ: CRUD Operations ด้วย Golang และ Gin Framework'
description: 'คู่มือฉบับสมบูรณ์สำหรับนักพัฒนาที่ต้องการสร้าง REST API ที่รวดเร็วและมีประสิทธิภาพด้วย Go โดยใช้ Gin Framework พร้อมการออกแบบสถาปัตยกรรมแบบ Layered (Handler, Service, Repository) การจัดการ Error และการสร้างเอกสาร OpenAPI (Swagger) สำหรับงาน Production'
date: '2022-10-08'
published: true
---

# 🚀 สร้าง Backend API ระดับ Production ด้วย Golang และ Gin

**Golang (Go)** คือตัวเลือกที่ยอดเยี่ยมในการสร้าง **Microservice** ที่ต้องการความเร็วสูง และ **Gin Framework** เป็นเครื่องมือที่ช่วยให้การจัดการ **Routing** และ **JSON** เป็นเรื่องง่าย

บทความนี้จะแสดงวิธีการสร้าง API สำหรับจัดการ **"หนังสือ (Books)"** โดยใช้สถาปัตยกรรม **Layered Architecture** ที่เน้น **Clean Code** และ **Separation of Concerns**

---

## 📋 สิ่งที่ต้องเตรียมก่อนเริ่ม (Prerequisites)

### เครื่องมือและ Software ที่จำเป็น:

- **Go 1.21** หรือสูงกว่า
- **Text Editor/IDE:** VS Code (แนะนำ + Go Extension) หรือ GoLand
- **Postman** หรือ **cURL** สำหรับทดสอบ API
- **Git** สำหรับ Version Control
- ความรู้พื้นฐาน Go syntax และ Package management

### ตรวจสอบ Go Version:

```bash
go version
# ควรเห็น: go version go1.21.x หรือสูงกว่า
```

### ติดตั้ง Go (ถ้ายังไม่มี):

```bash
# macOS (ใช้ Homebrew)
brew install go

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install golang-go

# Windows
# ดาวน์โหลดจาก: https://golang.org/dl/
```

### Setup VS Code สำหรับ Go:

```bash
# ติดตั้ง Go Extension
code --install-extension golang.go

# ติดตั้ง Go tools ที่จำเป็น
go install golang.org/x/tools/gopls@latest
go install github.com/go-delve/delve/cmd/dlv@latest
```

---

## 💡 โครงสร้าง API 3-Layer ใน Golang (Handler, Service, Repository)

ใน Go เราจะใช้ **Interface** และ **Struct** ในการออกแบบสถาปัตยกรรม 3-Layer เพื่อให้โค้ด **Testable** และ **Maintainable**

| Layer                           | Component        | หน้าที่ (What it does)                                                                          | เหตุผลและ Best Practice                                                                                     |
| :------------------------------ | :--------------- | :---------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **1. Handler (Controller)**     | `BookHandler`    | รับ **HTTP Request**, ดึงค่า **Path/Query Params**, เรียก **Service**, และส่ง **HTTP Response** | **BP:** เป็นเพียงชั้นที่จัดการ HTTP Protocol เท่านั้น ห้ามมี Business Logic                                 |
| **2. Service (Business Logic)** | `BookService`    | จัดการ **Business Logic** ทั้งหมด (เช่น การตรวจสอบเงื่อนไข, การคำนวณ) และเรียกใช้ Repository    | **BP:** เป็นหัวใจหลักของ Application ห้าม Controller/Handler ติดต่อ Repository โดยตรง ต้องผ่าน Service เสมอ |
| **3. Repository (Data Access)** | `BookRepository` | ติดต่อกับ **Database** โดยตรง จัดการ **CRUD Operations**                                        | **BP:** เป็น **Interface** ที่กำหนด **Contract** สำหรับการสื่อสารกับ DB เท่านั้น **ห้าม** มี Business Logic |

---

## 🧐 คำอธิบายศัพท์เฉพาะและ Best Practices ใน Golang

| คำศัพท์                   | คำอธิบาย (ภาษาคน)                                                                                                                                                                                                                                         | Best Practice/การใช้งาน                                                                                                                      |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| **Struct**                | **Struct** (Structure) คือ **รูปแบบข้อมูลที่กำหนดเอง (Custom Data Type)** คล้ายกับ **Class** ในภาษาอื่น ๆ แต่ไม่มีแนวคิดเรื่องการสืบทอด (Inheritance) เราใช้ **Struct** ในการกำหนดโครงสร้างของ **Model** (เช่น `Book`)                                    | ใช้ **Struct** สำหรับการสร้าง **Model** (Entity/DTO), **Service** และ **Handler**                                                            |
| **Interface**             | **Interface** คือ **สัญญา (Contract)** ที่กำหนดว่า **Struct** นั้น ๆ ต้องมี Method อะไรบ้าง ถูกใช้เพื่อกำหนด **ความสามารถ** ไม่ใช่ **ข้อมูล**                                                                                                             | ใช้ **Interface** ในการกำหนด **Repository** และ **Service** เพื่อให้โค้ดเกิด **Decoupling** (การแยกส่วน) และง่ายต่อการทำ **Mocking** (ทดสอบ) |
| **ตัวพิมพ์ใหญ่ (Export)** | ใน Go, หากตัวแปร, Struct, หรือ Method ขึ้นต้นด้วย **ตัวพิมพ์ใหญ่** (Uppercase) หมายความว่ามันถูก **Export** (เป็น **Public**) และสามารถถูกเรียกใช้จาก **Package** อื่นได้ หากขึ้นต้นด้วย **ตัวพิมพ์เล็ก** จะเป็น **Private** (ใช้ได้เฉพาะใน Package นั้น) | Method ใน Interface ต้องขึ้นต้นด้วย **ตัวพิมพ์ใหญ่** เสมอ                                                                                    |
| **Error Handling**        | Go ไม่ใช้ `try-catch` แต่ใช้การคืนค่า **Error** เป็นค่าสุดท้ายของ Function เสมอ การจัดการ Error ทำด้วยรูปแบบ `if err != nil { ... }`                                                                                                                      | ควรส่ง Error กลับไปยัง **Handler** เพื่อให้ **Handler** เลือก Status Code ที่เหมาะสม (เช่น 404, 500)                                         |
| **Log (Logging)**         | ใช้ **External Library** หรือ **Standard Library** (`"log"`) เพื่อบันทึกเหตุการณ์ต่างๆ                                                                                                                                                                    | ใช้ `log.Printf` สำหรับเหตุการณ์ทั่วไป และ `log.Fatalf` เมื่อเกิด Error ร้ายแรงที่ต้องหยุด **Application**                                   |

---

---

## 📁 โครงสร้างโปรเจกต์

```
go-book-api/
├── book/
│   ├── model.go          # Data structures (Entity/DTO)
│   ├── repository.go     # Data access layer (Database operations)
│   ├── service.go        # Business logic layer
│   ├── handler.go        # HTTP handlers (Controllers)
│   ├── errors.go         # Custom error types
│   └── middleware.go     # Custom middleware (Error handling, etc.)
├── docs/                 # Swagger generated files (สร้างโดย swag init)
│   ├── docs.go
│   ├── swagger.json
│   └── swagger.yaml
├── main.go               # Application entry point
├── go.mod                # Go module dependencies
├── go.sum                # Dependency checksums
├── .gitignore
└── README.md
```

**คำอธิบายโครงสร้าง:**

| โฟลเดอร์/ไฟล์        | หน้าที่                                               |
| :------------------- | :---------------------------------------------------- |
| `book/model.go`      | กำหนด struct สำหรับ Book entity และ DTO               |
| `book/repository.go` | Interface และ implementation สำหรับติดต่อ data source |
| `book/service.go`    | Business logic และการเรียกใช้ repository              |
| `book/handler.go`    | HTTP request handlers และ response formatting         |
| `book/errors.go`     | Custom error types สำหรับ error handling              |
| `book/middleware.go` | Middleware functions (logging, error handling, etc.)  |
| `docs/`              | Swagger documentation (auto-generated)                |
| `main.go`            | Application setup, routing, และ server startup        |

---

## 🛠️ ขั้นตอนที่ 1: การเตรียมสภาพแวดล้อมและ Swagger Setup

### 1.1 Go Module และ Dependencies

```bash
# 1. สร้าง Go Module และดาวน์โหลด Dependencies
go mod init go-book-api
go get github.com/gin-gonic/gin
go get github.com/google/uuid # สำหรับสร้าง ID
go get github.com/swaggo/gin-swagger # สำหรับ OpenAPI/Swagger UI
go get github.com/swaggo/files # สำหรับ Swagger Files
go install github.com/swaggo/swag/cmd/swag@latest # ติดตั้ง Swagger CLI Tool
```

### 1.2 การสร้างเอกสาร Swagger (OpenAPI)

เราใช้ **Swagger Annotation** (ในรูปแบบ Go Comment) เพื่อให้เครื่องมือ **`swag`** อ่านและสร้างเอกสาร **OpenAPI** ขึ้นมาโดยอัตโนมัติ

> **ขั้นตอน:** รัน `swag init` ใน Terminal หลังจากเขียนโค้ดเสร็จ เพื่อสร้างไฟล์เอกสารในโฟลเดอร์ `docs/`

---

## 💻 ขั้นตอนที่ 2: โค้ดตาม Layered Architecture

### 2.1 Model: `book/model.go` (Data Structure)

```go
package book

import "github.com/google/uuid"

// Book struct: โครงสร้างข้อมูลหนังสือ (ทำหน้าที่คล้าย Entity/DTO)
type Book struct {
	ID     string `json:"id" example:"f47ac10b-58cc-4372-a567-0e02b2c3d479"` // ID ของหนังสือ
	Title  string `json:"title" binding:"required" example:"คู่มือ Go ฉบับเร่งรัด"` // ต้องมี Title (Validation)
	Author string `json:"author" binding:"required" example:"Thai Dev"` // ต้องมี Author (Validation)
}

// NewBookInput struct: ใช้สำหรับรับ Request Body ในการสร้าง (POST)
type NewBookInput struct {
	Title  string `json:"title" binding:"required" example:"Design Pattern"`
	Author string `json:"author" binding:"required" example:"Pro Dev"`
}
```

### 2.2 Repository: `book/repository.go` (Data Access Layer)

**Repository** เป็น **Interface** ที่กำหนด **Contract** สำหรับการทำงานกับ Data Source

```go
package book

import "errors"

// BookRepository Interface: กำหนดสัญญา (Contract) สำหรับการทำงานกับ Data Source
// ทุก Method ขึ้นต้นด้วยตัวพิมพ์ใหญ่ (Exported)
type BookRepository interface {
	FindAll() []Book
	FindByID(id string) (Book, error) // คืนค่า error เป็นค่าสุดท้าย (Idiomatic Go)
	Save(book Book) Book
	Update(book Book) (Book, error)
	Delete(id string) error
}

// mockBookRepository struct: Struct นี้ Implement Interface BookRepository
type mockBookRepository struct {
	books []Book // ข้อมูลจำลอง (จำลอง Database)
}

// NewMockRepository: Constructor สำหรับสร้าง Mock Repository (ถูก Export เพราะขึ้นต้นด้วย New)
func NewMockRepository() BookRepository {
	return &mockBookRepository{
		books: []Book{
			{ID: "1", Title: "คู่มือ Go ฉบับเร่งรัด", Author: "Thai Dev"},
			{ID: "2", Title: "REST API Design", Author: "John Doe"},
		},
	}
}

// Implementations (ตัวอย่าง FindByID)
func (r *mockBookRepository) FindByID(id string) (Book, error) {
	for _, b := range r.books {
		if b.ID == id {
			return b, nil // คืนค่า Book ที่พบ และ nil (ไม่มี error)
		}
	}
	return Book{}, errors.New("Book not found") // ถ้าไม่พบ คืนค่า error
}

// ... Implementations ของ Save, FindAll, Update, Delete ที่เหลือ ...
func (r *mockBookRepository) Save(book Book) Book {
    r.books = append(r.books, book)
    return book
}
func (r *mockBookRepository) FindAll() []Book { return r.books }
func (r *mockBookRepository) Update(book Book) (Book, error) {
    for i, b := range r.books {
        if b.ID == book.ID {
            r.books[i] = book
            return book, nil
        }
    }
    return Book{}, errors.New("Book not found")
}
func (r *mockBookRepository) Delete(id string) error {
    for i, b := range r.books {
        if b.ID == id {
            r.books = append(r.books[:i], r.books[i+1:]...)
            return nil
        }
    }
    return errors.New("Book not found")
}
```

### 2.3 Service: `book/service.go` (Business Logic Layer)

**Service** จัดการ Business Logic และเรียก Repository ผ่าน Interface

```go
package book

import "github.com/google/uuid"

// BookService Interface: กำหนดสัญญา (Contract) สำหรับ Business Logic
type BookService interface {
	GetAllBooks() []Book
	GetBookByID(id string) (Book, error)
	CreateNewBook(input NewBookInput) (Book, error)
	UpdateBook(id string, input NewBookInput) (Book, error)
	DeleteBook(id string) error
}

// bookService struct: ใช้ Repository Interface เพื่อเข้าถึงข้อมูล
type bookService struct {
	repo BookRepository // Dependency Injection: Repository ถูก Inject เข้ามาผ่าน Interface
}

// NewService: Constructor สำหรับสร้าง Service
func NewService(repo BookRepository) BookService {
	return &bookService{repo: repo}
}

// Implementations (ตัวอย่าง CreateNewBook)
func (s *bookService) CreateNewBook(input NewBookInput) (Book, error) {
	// *** Business Logic Zone ***
	// 1. กำหนด ID ใหม่
	newBook := Book{
		ID:     uuid.New().String(), // สร้าง ID ใหม่
		Title:  input.Title,
		Author: input.Author,
	}

	// 2. เรียกใช้ Repository เพื่อบันทึก
	return s.repo.Save(newBook), nil
}

// Implementations (ตัวอย่าง GetBookByID)
func (s *bookService) GetBookByID(id string) (Book, error) {
    // Business Logic: สามารถ Log การเข้าถึงข้อมูล หรือตรวจสอบสิทธิ์ได้ที่นี่
	return s.repo.FindByID(id) // เรียก Repository
}

// ... Implementations ของ GetAllBooks, UpdateBook, DeleteBook ที่เหลือ ...
func (s *bookService) GetAllBooks() []Book { return s.repo.FindAll() }
func (s *bookService) UpdateBook(id string, input NewBookInput) (Book, error) {
    existingBook, err := s.repo.FindByID(id)
    if err != nil {
        return Book{}, err
    }

    existingBook.Title = input.Title
    existingBook.Author = input.Author

    return s.repo.Update(existingBook)
}
func (s *bookService) DeleteBook(id string) error {
    return s.repo.Delete(id)
}
```

### 2.4 Handler: `book/handler.go` (Controller/Presentation Layer)

**Handler** จัดการ HTTP Request, ใช้ **ShouldBindJSON** และ **Error Handling**

```go
package book

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// BookHandler struct: ใช้ Service Interface เพื่อเข้าถึง Business Logic
type BookHandler struct {
	service BookService // Dependency Injection: Service ถูก Inject เข้ามา
}

// NewHandler: Constructor สำหรับสร้าง Handler
func NewHandler(service BookService) *BookHandler {
	return &BookHandler{service: service}
}

// ----------------------------------------------------
// HANDLER FUNCTIONS (CRUD)
// ----------------------------------------------------

// ... Swagger Annotations ...
// @Router /api/v1/books [post]
func (h *BookHandler) CreateBook(c *gin.Context) {
	var input NewBookInput

	// 1. ShouldBindJSON: ดึง JSON จาก Request Body และตรวจสอบ Validation
	// หาก JSON ไม่ถูกต้อง (เช่น ขาด field required) จะคืนค่า error
	if err := c.ShouldBindJSON(&input); err != nil {
		// Error Handling: ส่ง HTTP 400 Bad Request
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	// 2. เรียกใช้ Service
	newBook, err := h.service.CreateNewBook(input)
	if err != nil {
		// Error Handling: ส่ง HTTP 500 Internal Server Error (ถ้าเกิด Error ตอน Save)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create book"})
		return
	}

	// 3. ตอบกลับด้วย HTTP 201 Created
	c.JSON(http.StatusCreated, newBook)
}

// ... Swagger Annotations ...
// @Router /api/v1/books/{id} [get]
func (h *BookHandler) GetBookByID(c *gin.Context) {
	// ดึงค่า ID จาก URL Parameter (Path Parameter)
	id := c.Param("id")

    // เรียกใช้ Service
	book, err := h.service.GetBookByID(id)

	// Error Handling: ตรวจสอบ error จาก Service
	if err != nil {
		// ถ้า Service แจ้งว่าไม่พบข้อมูล
		c.JSON(http.StatusNotFound, gin.H{"message": err.Error()}) // HTTP 404 Not Found
		return
	}

	c.JSON(http.StatusOK, book)
}

// @Summary: ค้นหาหนังสือ (Query Parameter Example)
// ... Swagger Annotations ...
// @Param title query string false "ชื่อหนังสือที่ต้องการค้นหา (Query Parameter)"
// @Router /api/v1/books/search [get]
func (h *BookHandler) SearchBooks(c *gin.Context) {
    // c.Query(): ดึงค่าจาก Query Parameter: /books/search?title=...
    title := c.Query("title")

    if title != "" {
        // Logic: ในโลกจริง Service จะจัดการ Search โดยส่ง title ไปยัง Repository
        c.JSON(http.StatusOK, gin.H{"message": "Searching for title: " + title})
        return
    }

    c.JSON(http.StatusOK, h.service.GetAllBooks())
}

// ... Implementations ของ GetBooks, UpdateBook และ DeleteBook ที่เหลือ ...
func (h *BookHandler) GetBooks(c *gin.Context) {
	books := h.service.GetAllBooks()
	c.JSON(http.StatusOK, books)
}
func (h *BookHandler) UpdateBook(c *gin.Context) {
    id := c.Param("id")
    var input NewBookInput
    if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}
    book, err := h.service.UpdateBook(id, input)
    if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}
    c.JSON(http.StatusOK, book)
}
func (h *BookHandler) DeleteBook(c *gin.Context) {
    id := c.Param("id")
    err := h.service.DeleteBook(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
        return
    }
    c.JSON(http.StatusNoContent, nil)
}
```

---

## 🚨 ขั้นตอนที่ 2.5: การจัดการ Error แบบมืออาชีพ

### 2.5.1 สร้าง Custom Error Types

สร้างไฟล์ `book/errors.go`:

```go
package book

import "fmt"

// ErrorResponse: โครงสร้างสำหรับส่ง Error กลับไปยัง Client
type ErrorResponse struct {
	Error   string `json:"error" example:"Bad Request"`
	Message string `json:"message" example:"Invalid input data"`
	Code    int    `json:"code" example:"400"`
}

// Custom Error Types
type NotFoundError struct {
	Resource string
	ID       string
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s with ID '%s' not found", e.Resource, e.ID)
}

type ValidationError struct {
	Field   string
	Message string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("Validation failed for field '%s': %s", e.Field, e.Message)
}

type InternalError struct {
	Operation string
	Err       error
}

func (e *InternalError) Error() string {
	return fmt.Sprintf("Internal error during %s: %v", e.Operation, e.Err)
}
```

**คำอธิบาย:**

- `ErrorResponse`: struct สำหรับ format ของ error response ที่ส่งกลับไปยัง client
- `NotFoundError`: ใช้เมื่อไม่พบข้อมูลที่ต้องการ (HTTP 404)
- `ValidationError`: ใช้เมื่อข้อมูล input ไม่ถูกต้อง (HTTP 400)
- `InternalError`: ใช้เมื่อเกิด error ภายในระบบ (HTTP 500)

### 2.5.2 สร้าง Error Handler Middleware

สร้างไฟล์ `book/middleware.go`:

```go
package book

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// ErrorHandler: Global error handler middleware
// จัดการ error ทั้งหมดในระบบจากจุดเดียว
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next() // ให้ request ทำงานต่อไปก่อน

		// หลังจาก handler ทำงานเสร็จ ตรวจสอบว่ามี error หรือไม่
		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err

			// ตรวจสอบประเภทของ error และส่ง response ที่เหมาะสม
			switch e := err.(type) {
			case *NotFoundError:
				c.JSON(http.StatusNotFound, ErrorResponse{
					Error:   "Not Found",
					Message: e.Error(),
					Code:    http.StatusNotFound,
				})
			case *ValidationError:
				c.JSON(http.StatusBadRequest, ErrorResponse{
					Error:   "Validation Failed",
					Message: e.Error(),
					Code:    http.StatusBadRequest,
				})
			case *InternalError:
				c.JSON(http.StatusInternalServerError, ErrorResponse{
					Error:   "Internal Server Error",
					Message: e.Error(),
					Code:    http.StatusInternalServerError,
				})
			default:
				c.JSON(http.StatusInternalServerError, ErrorResponse{
					Error:   "Internal Server Error",
					Message: err.Error(),
					Code:    http.StatusInternalServerError,
				})
			}
		}
	}
}

// LoggingMiddleware: บันทึก request และ response
func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Before request
		c.Next()
		// After request - สามารถเพิ่ม logging ได้ตรงนี้
	}
}
```

### 2.5.3 ปรับปรุง Repository ให้ส่ง Custom Error

แก้ไขไฟล์ `book/repository.go`:

```go
// FindByID implementation
func (r *mockBookRepository) FindByID(id string) (Book, error) {
	for _, b := range r.books {
		if b.ID == id {
			return b, nil
		}
	}
	return Book{}, &NotFoundError{Resource: "Book", ID: id}
}

// Update implementation
func (r *mockBookRepository) Update(book Book) (Book, error) {
	for i, b := range r.books {
		if b.ID == book.ID {
			r.books[i] = book
			return book, nil
		}
	}
	return Book{}, &NotFoundError{Resource: "Book", ID: book.ID}
}

// Delete implementation
func (r *mockBookRepository) Delete(id string) error {
	for i, b := range r.books {
		if b.ID == id {
			r.books = append(r.books[:i], r.books[i+1:]...)
			return nil
		}
	}
	return &NotFoundError{Resource: "Book", ID: id}
}
```

### 2.5.4 ปรับปรุง Handler ให้ใช้ Error Context

แก้ไขไฟล์ `book/handler.go`:

```go
// GetBookByID - ปรับปรุงให้ใช้ Error Context
func (h *BookHandler) GetBookByID(c *gin.Context) {
	id := c.Param("id")

	book, err := h.service.GetBookByID(id)
	if err != nil {
		c.Error(err) // เพิ่ม error เข้า context แทนการ handle เอง
		return
	}

	c.JSON(http.StatusOK, book)
}

// UpdateBook - ปรับปรุงให้ใช้ Error Context
func (h *BookHandler) UpdateBook(c *gin.Context) {
	id := c.Param("id")
	var input NewBookInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.Error(&ValidationError{Field: "request body", Message: err.Error()})
		return
	}

	book, err := h.service.UpdateBook(id, input)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, book)
}

// DeleteBook - ปรับปรุงให้ใช้ Error Context
func (h *BookHandler) DeleteBook(c *gin.Context) {
	id := c.Param("id")

	err := h.service.DeleteBook(id)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

// CreateBook - ปรับปรุงให้ใช้ Error Context
func (h *BookHandler) CreateBook(c *gin.Context) {
	var input NewBookInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.Error(&ValidationError{Field: "request body", Message: err.Error()})
		return
	}

	newBook, err := h.service.CreateNewBook(input)
	if err != nil {
		c.Error(&InternalError{Operation: "create book", Err: err})
		return
	}

	c.JSON(http.StatusCreated, newBook)
}
```

---

## 💻 ขั้นตอนที่ 3: Main Application Setup

### 3.1 Main: `main.go` (Application Startup)

ไฟล์หลักที่จัดการการตั้งค่า **Swagger**, **Middleware**, และ **Dependency Injection**

```go
package main

import (
	"log"
	"go-book-api/book"
	"github.com/gin-gonic/gin"

	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/swaggo/files"
	_ "./docs"
)

// @title Book API
// @version 1.0
// @description RESTful API สำหรับจัดการหนังสือด้วย Clean Architecture
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.example.com/support
// @contact.email support@example.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api/v1
// @schemes http https
func main() {
	// 1. Dependency Injection Setup
	bookRepo := book.NewMockRepository()
	bookService := book.NewService(bookRepo)
	bookHandler := book.NewHandler(bookService)

	// 2. สร้าง Gin Router
	router := gin.Default()

	// 3. เพิ่ม Global Middleware
	router.Use(book.ErrorHandler())    // Error handling middleware
	router.Use(book.LoggingMiddleware()) // Logging middleware (optional)

	// 4. Health Check Endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "UP",
			"message": "Service is running",
		})
	})

	// 5. API v1 Routes Group
	v1 := router.Group("/api/v1")
	{
		// Book routes
		v1.GET("/books", bookHandler.GetBooks)
		v1.GET("/books/search", bookHandler.SearchBooks)
		v1.GET("/books/:id", bookHandler.GetBookByID)
		v1.POST("/books", bookHandler.CreateBook)
		v1.PUT("/books/:id", bookHandler.UpdateBook)
		v1.DELETE("/books/:id", bookHandler.DeleteBook)
	}

	// 6. Swagger UI Endpoint
	router.GET("/swagger/*any", ginSwagger.WrapHandler(files.Handler))

	// 7. รัน Server
	log.Println("🚀 Server is starting on :8080")
	log.Println("📚 Swagger UI: http://localhost:8080/swagger/index.html")
	log.Println("❤️  Health Check: http://localhost:8080/health")

	if err := router.Run(":8080"); err != nil {
		log.Fatalf("❌ Server failed to start: %v", err)
	}
}
```

**อธิบายการเปลี่ยนแปลง:**

1. **เพิ่ม Swagger Annotations** สำหรับ metadata ของ API
2. **เพิ่ม Middleware** สำหรับ Error Handling และ Logging
3. **เพิ่ม Health Check Endpoint** สำหรับตรวจสอบสถานะของ service
4. **ปรับปรุง Logging** ให้มี emoji และข้อมูลที่ชัดเจนขึ้น

---

## 📝 OpenAPI (Swagger) Setup: การสร้างเอกสาร API

**OpenAPI** (ที่หลายคนยังเรียกติดปากว่า **Swagger**) คือ **พิมพ์เขียว (Blueprint)** มาตรฐานสากลสำหรับอธิบายว่า REST API ของคุณทำอะไรได้บ้าง

- **มันคืออะไร:** มันคือเอกสารอธิบาย **API Contract** ที่ทั้งคนอ่านและคอมพิวเตอร์อ่านเข้าใจ
- **ทำไมเราถึงใช้มัน:**
  1.  **สร้างเอกสารให้เอง:** เราใช้ **Go Comments** (เช่น `// @Summary`, `// @Param`) ในไฟล์ **Handler** เพื่อให้ **Library** จัดการสร้างหน้าเว็บ **Swagger UI** ให้โดยอัตโนมัติ
  2.  **เป็นสนามเด็กเล่น (Interactive):** **Swagger UI** ช่วยให้คุณและนักพัฒนาคนอื่นสามารถลองยิง **Request** เข้าสู่ API ของเราได้ทันทีผ่านหน้าเว็บ

> 🔗 รัน `swag init` ก่อน แล้วเข้าถึงเอกสารได้ที่: `http://localhost:8080/swagger/index.html`

---

## 🚀 วิธีการ Build, Run และทดสอบ API ด้วย cURL (ภาษาไทย)

### 1\. Build และ Run Project ผ่าน Terminal

คุณสามารถรัน **Application** ได้โดยตรงจากไฟล์ `main.go`

```bash
# รัน Go Application (เซิร์ฟเวอร์จะเริ่มทำงานที่ http://localhost:8080)
go run main.go
```

### 2\. cURL Command (ตัวอย่าง)

#### A. CREATE (POST) - สร้างข้อมูล

```bash
curl -X POST http://localhost:8080/api/v1/books \
-H "Content-Type: application/json" \
-d '{
    "title": "Clean Code with Go",
    "author": "Robert C. Martin"
}'
```

#### B. READ ONE (GET) - ด้วย Path Parameter (ID=1)

```bash
curl -X GET http://localhost:8080/api/v1/books/1
```

#### C. SEARCH (GET) - ด้วย Query Parameter (title=...)

```bash
curl -X GET "http://localhost:8080/api/v1/books/search?title=Clean%20Code"
```

---

---

## 🔍 การแก้ปัญหาที่พบบ่อย (Troubleshooting)

### ปัญหาที่ 1: Port 8080 ถูกใช้งานอยู่แล้ว

**อาการ:**

```
listen tcp :8080: bind: address already in use
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

# หรือเปลี่ยน port ใน main.go
router.Run(":8081")  # ใช้ port อื่นแทน
```

---

### ปัญหาที่ 2: Swagger UI ไม่แสดง

**อาการ:** เข้า `http://localhost:8080/swagger/index.html` แล้วเจอ 404 Not Found

**วิธีแก้:**

```bash
# 1. ตรวจสอบว่ารัน swag init แล้วหรือยัง
swag init

# 2. ตรวจสอบว่ามีโฟลเดอร์ docs/ ถูกสร้างขึ้น
ls -la docs/
# ควรเห็นไฟล์: docs.go, swagger.json, swagger.yaml

# 3. ตรวจสอบว่ามี import docs ใน main.go
# _ "./docs"  // ต้องมีบรรทัดนี้

# 4. ถ้ายังไม่ได้ ลองลบโฟลเดอร์ docs และสร้างใหม่
rm -rf docs/
swag init

# 5. Restart server
go run main.go
```

---

### ปัญหาที่ 3: Module not found / Import cycle

**อาการ:**

```
package book is not in GOROOT
cannot find package
import cycle not allowed
```

**วิธีแก้:**

```bash
# 1. ตรวจสอบ go.mod
cat go.mod
# ควรเห็น: module go-book-api

# 2. ดาวน์โหลด dependencies ใหม่
go mod tidy
go mod download

# 3. ถ้ายังไม่ได้ ลบ go.sum แล้วรันใหม่
rm go.sum
go mod tidy

# 4. ตรวจสอบว่า import path ถูกต้อง
# ต้องเป็น: "go-book-api/book" ไม่ใช่ "./book"

# 5. Clear module cache
go clean -modcache
go mod download
```

---

### ปัญหาที่ 4: JSON Binding Failed

**อาการ:** `ShouldBindJSON` คืนค่า error แม้ส่ง JSON ที่ดูถูกต้อง

**วิธีแก้:**

```bash
# 1. ตรวจสอบ Content-Type header
curl -X POST http://localhost:8080/api/v1/books \
-H "Content-Type: application/json" \  # ← ต้องมี header นี้
-d '{"title": "Test", "author": "Test"}'

# 2. ตรวจสอบ JSON syntax (ใช้ JSON validator)
# https://jsonlint.com/

# 3. ตรวจสอบ struct tags ใน model.go
type NewBookInput struct {
    Title  string `json:"title" binding:"required"`   # ← ต้องตรงกับ JSON key
    Author string `json:"author" binding:"required"`
}

# 4. ใช้ Postman แทน cURL เพื่อดู error ที่ชัดเจนขึ้น
# Postman จะแสดง error message ที่อ่านง่ายกว่า
```

---

### ปัญหาที่ 5: CORS Error (เมื่อเรียกจาก Frontend)

**อาการ:**

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**วิธีแก้:**

```bash
# ติดตั้ง CORS middleware
go get github.com/gin-contrib/cors
```

แก้ไขไฟล์ `main.go`:

```go
import "github.com/gin-contrib/cors"

func main() {
    router := gin.Default()

    // เพิ่ม CORS middleware
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))

    // ... rest of code
}
```

---

### ปัญหาที่ 6: swag: command not found

**อาการ:** รัน `swag init` แล้วเจอ `command not found`

**วิธีแก้:**

```bash
# 1. ติดตั้ง swag CLI
go install github.com/swaggo/swag/cmd/swag@latest

# 2. เพิ่ม GOPATH/bin เข้า PATH
# เพิ่มใน ~/.bashrc หรือ ~/.zshrc:
export PATH=$PATH:$(go env GOPATH)/bin

# Reload shell
source ~/.bashrc  # หรือ source ~/.zshrc

# 3. ตรวจสอบว่าติดตั้งสำเร็จ
swag --version

# 4. ถ้ายังไม่ได้ ลอง install ด้วย go get (สำหรับ Go เวอร์ชันเก่า)
go get -u github.com/swaggo/swag/cmd/swag
```

---

## ⚡ Performance Tips & Best Practices

### 1. ใช้ Gin Release Mode ใน Production

```go
// main.go
func main() {
    // ตั้งค่า Release Mode (ปิด debug logs)
    gin.SetMode(gin.ReleaseMode)

    router := gin.Default()
    // ... rest of code
}
```

หรือตั้งค่าผ่าน Environment Variable:

```bash
export GIN_MODE=release
go run main.go
```

---

### 2. เปิดใช้งาน GZIP Compression

```bash
# ติดตั้ง GZIP middleware
go get github.com/gin-contrib/gzip
```

```go
import "github.com/gin-contrib/gzip"

func main() {
    router := gin.Default()

    // เพิ่ม GZIP compression
    router.Use(gzip.Gzip(gzip.DefaultCompression))

    // ... rest of code
}
```

**ผลลัพธ์:** ลด response size ลงประมาณ 70-90%

---

### 3. ใช้ Context Timeout

```go
import (
    "context"
    "time"
)

// ใน Service Layer
func (s *bookService) GetBookByID(id string) (Book, error) {
    // สร้าง context ที่มี timeout 5 วินาที
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    // ใช้ ctx ในการ query database
    return s.repo.FindByIDWithContext(ctx, id)
}
```

---

### 4. Connection Pool (สำหรับ Database จริง)

```go
import "database/sql"

func setupDatabase() (*sql.DB, error) {
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        return nil, err
    }

    // ตั้งค่า Connection Pool
    db.SetMaxOpenConns(25)                  // จำนวน connection สูงสุด
    db.SetMaxIdleConns(5)                   // จำนวน idle connection
    db.SetConnMaxLifetime(5 * time.Minute)  // อายุของ connection
    db.SetConnMaxIdleTime(10 * time.Minute) // เวลา idle สูงสุด

    return db, nil
}
```

---

### 5. Graceful Shutdown

```go
import (
    "context"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"
)

func main() {
    router := gin.Default()
    // ... setup routes ...

    // สร้าง HTTP Server
    srv := &http.Server{
        Addr:         ":8080",
        Handler:      router,
        ReadTimeout:  10 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  60 * time.Second,
    }

    // รัน server ใน goroutine
    go func() {
        log.Println("🚀 Server starting on :8080")
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("Server error: %v", err)
        }
    }()

    // รอสัญญาณ shutdown (Ctrl+C)
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    log.Println("🛑 Shutting down server...")

    // ให้เวลา 5 วินาทีในการปิด connections ที่มีอยู่
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("❌ Server forced to shutdown:", err)
    }

    log.Println("✅ Server exited gracefully")
}
```

---

### 6. Request Rate Limiting

```bash
# ติดตั้ง rate limiter
go get github.com/ulule/limiter/v3
go get github.com/ulule/limiter/v3/drivers/middleware/gin
```

```go
import (
    "github.com/ulule/limiter/v3"
    mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"
    "github.com/ulule/limiter/v3/drivers/store/memory"
)

func main() {
    router := gin.Default()

    // สร้าง rate limiter (20 requests ต่อนาที)
    rate := limiter.Rate{
        Period: 1 * time.Minute,
        Limit:  20,
    }

    store := memory.NewStore()
    middleware := mgin.NewMiddleware(limiter.New(store, rate))

    // ใช้กับทุก route
    router.Use(middleware)

    // หรือใช้กับ specific route เท่านั้น
    router.POST("/api/v1/books", middleware, bookHandler.CreateBook)

    // ... rest of code
}
```

---

### 7. Structured Logging

```bash
# ติดตั้ง zerolog (high-performance logger)
go get github.com/rs/zerolog/log
```

```go
import (
    "github.com/rs/zerolog"
    "github.com/rs/zerolog/log"
)

func main() {
    // ตั้งค่า logger
    zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
    log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})

    router := gin.Default()

    // Custom logging middleware
    router.Use(func(c *gin.Context) {
        start := time.Now()

        c.Next()

        log.Info().
            Str("method", c.Request.Method).
            Str("path", c.Request.URL.Path).
            Int("status", c.Writer.Status()).
            Int("status", c.Writer.Status()).
            Dur("latency", time.Since(start)).
            Msg("Request completed")
    })

    // ... rest of code
}
```

---

### 8. Response Caching (สำหรับ GET requests)

```bash
# ติดตั้ง cache middleware
go get github.com/gin-contrib/cache
go get github.com/gin-contrib/cache/persistence
```

```go
import (
    "github.com/gin-contrib/cache"
    "github.com/gin-contrib/cache/persistence"
    "time"
)

func main() {
    router := gin.Default()

    // สร้าง in-memory cache store
    store := persistence.NewInMemoryStore(time.Second)

    // Cache GET /books เป็นเวลา 1 นาที
    router.GET("/api/v1/books",
        cache.CachePage(store, time.Minute, bookHandler.GetBooks))

    // Route อื่น ๆ ไม่ cache
    router.GET("/api/v1/books/:id", bookHandler.GetBookByID)
    router.POST("/api/v1/books", bookHandler.CreateBook)

    // ... rest of code
}
```

---

### 9. Database Query Optimization

```go
// ✅ ดี: ใช้ Prepared Statements
func (r *postgresRepository) FindByID(ctx context.Context, id string) (Book, error) {
    query := "SELECT id, title, author FROM books WHERE id = $1"

    var book Book
    err := r.db.QueryRowContext(ctx, query, id).Scan(
        &book.ID, &book.Title, &book.Author,
    )

    return book, err
}

// ❌ ไม่ดี: String concatenation (SQL Injection risk)
func (r *badRepository) FindByID(id string) (Book, error) {
    query := "SELECT * FROM books WHERE id = '" + id + "'"
    // ... อันตราย! เปิดช่องโหว่ SQL Injection
}
```

---

### 10. ใช้ Profiling เพื่อหา Bottlenecks

```go
import _ "net/http/pprof"

func main() {
    router := gin.Default()

    // เปิดใช้งาน pprof (เฉพาะ Development)
    if gin.Mode() == gin.DebugMode {
        router.GET("/debug/pprof/*any", gin.WrapH(http.DefaultServeMux))
    }

    // ... rest of code
}
```

**วิธีใช้ pprof:**

```bash
# รัน API
go run main.go

# ดู CPU profile
go tool pprof http://localhost:8080/debug/pprof/profile

# ดู Memory profile
go tool pprof http://localhost:8080/debug/pprof/heap

# ดู Goroutines
curl http://localhost:8080/debug/pprof/goroutine?debug=1
```

---

## 🚀 การ Deploy สู่ Production

### ขั้นตอนที่ 1: Build Binary File

```bash
# Build สำหรับ Linux (Production Server)
GOOS=linux GOARCH=amd64 go build -o book-api main.go

# Build สำหรับ macOS
GOOS=darwin GOARCH=amd64 go build -o book-api main.go

# Build สำหรับ Windows
GOOS=windows GOARCH=amd64 go build -o book-api.exe main.go

# Build with optimization flags
go build -ldflags="-s -w" -o book-api main.go
# -s: ลบ symbol table
# -w: ลบ DWARF debugging info
# ทำให้ binary เล็กลง 20-30%
```

---

### ขั้นตอนที่ 2: Docker Deployment

#### 2.1 สร้าง `Dockerfile`:

```dockerfile
# Stage 1: Build
FROM golang:1.21-alpine AS builder

# ติดตั้ง dependencies ที่จำเป็น
RUN apk add --no-cache git ca-certificates

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-s -w" \
    -o main .

# Stage 2: Run
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

# Copy binary from builder stage
COPY --from=builder /app/main .
COPY --from=builder /app/docs ./docs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run
CMD ["./main"]
```

#### 2.2 สร้าง `.dockerignore`:

```
# Git
.git
.gitignore

# Documentation
README.md
*.md

# IDE
.vscode
.idea
*.swp
*.swo

# Build artifacts
*.exe
*.test
*.out
main

# Environment
.env
.env.local

# OS
.DS_Store
Thumbs.db

# Go
vendor/
```

#### 2.3 Build และ Run Docker:

```bash
# Build image
docker build -t book-api:latest .

# ตรวจสอบ image size
docker images book-api

# Run container
docker run -p 8080:8080 book-api:latest

# Run in background (detached mode)
docker run -d -p 8080:8080 --name book-api book-api:latest

# View logs
docker logs -f book-api

# Stop container
docker stop book-api

# Remove container
docker rm book-api

# Run with environment variables
docker run -d -p 8080:8080 \
    -e GIN_MODE=release \
    -e DATABASE_URL=postgres://user:pass@host:5432/db \
    --name book-api \
    book-api:latest
```

---

### ขั้นตอนที่ 3: Docker Compose (พร้อม PostgreSQL)

#### สร้าง `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # API Service
  api:
    build: .
    container_name: book-api
    ports:
      - '8080:8080'
    environment:
      - GIN_MODE=release
      - DATABASE_URL=postgres://bookuser:bookpass@db:5432/bookdb?sslmode=disable
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - book-network
    healthcheck:
      test:
        [
          'CMD',
          'wget',
          '--no-verbose',
          '--tries=1',
          '--spider',
          'http://localhost:8080/health',
        ]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: book-db
    environment:
      POSTGRES_DB: bookdb
      POSTGRES_USER: bookuser
      POSTGRES_PASSWORD: bookpass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - '5432:5432'
    restart: unless-stopped
    networks:
      - book-network
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U bookuser -d bookdb']
      interval: 10s
      timeout: 3s
      retries: 5

  # Redis (Optional - สำหรับ Caching)
  redis:
    image: redis:7-alpine
    container_name: book-redis
    ports:
      - '6379:6379'
    restart: unless-stopped
    networks:
      - book-network
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 5

networks:
  book-network:
    driver: bridge

volumes:
  postgres_data:
```

#### สร้าง `init.sql` (Database Schema):

```sql
-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);

-- Insert sample data
INSERT INTO books (id, title, author) VALUES
    ('1', 'คู่มือ Go ฉบับเร่งรัด', 'Thai Dev'),
    ('2', 'REST API Design', 'John Doe')
ON CONFLICT (id) DO NOTHING;
```

#### รัน Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api

# Stop services
docker-compose down

# Stop and remove volumes (ข้อมูลใน DB จะหายด้วย)
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build

# Check service status
docker-compose ps

# Execute command in container
docker-compose exec api sh
docker-compose exec db psql -U bookuser -d bookdb
```

---

### ขั้นตอนที่ 4: Deploy บน Cloud Platforms

#### 4.1 Deploy บน Railway.app

```bash
# 1. ติดตั้ง Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Link to existing project (ถ้ามี)
railway link

# 5. Deploy
railway up

# 6. ดู logs
railway logs

# 7. เปิด web UI
railway open
```

**สร้าง `railway.toml`:**

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "./main"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

---

#### 4.2 Deploy บน Fly.io

```bash
# 1. ติดตั้ง Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Login
fly auth login

# 3. Launch app
fly launch

# 4. Deploy
fly deploy

# 5. Open app
fly open

# 6. ดู logs
fly logs

# 7. Scale app
fly scale count 2  # เพิ่มเป็น 2 instances
```

**สร้าง `fly.toml`:**

```toml
app = "book-api"
primary_region = "sin"  # Singapore

[build]
  dockerfile = "Dockerfile"

[env]
  GIN_MODE = "release"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1

  [[http_service.checks]]
    grace_period = "10s"
    interval = "30s"
    method = "GET"
    timeout = "5s"
    path = "/health"

[[services]]
  protocol = "tcp"
  internal_port = 8080

  [[services.ports]]
    port = 80
    handlers = ["http"]
    force_https = true

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [services.concurrency]
    type = "connections"
    hard_limit = 25
    soft_limit = 20
```

---

#### 4.3 Deploy บน Google Cloud Run

```bash
# 1. ติดตั้ง gcloud CLI
# https://cloud.google.com/sdk/docs/install

# 2. Login
gcloud auth login

# 3. Set project
gcloud config set project YOUR_PROJECT_ID

# 4. Build image ด้วย Cloud Build
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/book-api

# 5. Deploy to Cloud Run
gcloud run deploy book-api \
    --image gcr.io/YOUR_PROJECT_ID/book-api \
    --platform managed \
    --region asia-southeast1 \
    --allow-unauthenticated \
    --set-env-vars GIN_MODE=release

# 6. ดู URL
gcloud run services describe book-api --region asia-southeast1
```

---

#### 4.4 Deploy บน AWS (EC2)

```bash
# 1. Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# 2. ติดตั้ง Docker
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# 3. Clone repository
git clone https://github.com/your-repo/book-api.git
cd book-api

# 4. Build และ Run
docker-compose up -d

# 5. Setup Nginx Reverse Proxy
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/book-api
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/book-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

### ขั้นตอนที่ 5: CI/CD Pipeline

#### GitHub Actions Workflow

สร้างไฟล์ `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  GO_VERSION: '1.21'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: ${{ env.GO_VERSION }}

      - name: Run tests
        run: |
          go test -v -race -coverprofile=coverage.out ./...
          go tool cover -html=coverage.out -o coverage.html

      - name: Upload coverage
        uses: actions/upload-artifact@v3
        with:
          name: coverage
          path: coverage.html

  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Railway
        run: |
          npm i -g @railway/cli
          railway up --service book-api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 📊 Monitoring และ Observability

### 1. Prometheus Metrics

```bash
go get github.com/prometheus/client_golang/prometheus
go get github.com/prometheus/client_golang/prometheus/promhttp
```

```go
import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promauto"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    httpRequestsTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "endpoint", "status"},
    )

    httpRequestDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name: "http_request_duration_seconds",
            Help: "HTTP request duration in seconds",
        },
        []string{"method", "endpoint"},
    )
)

func PrometheusMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()

        c.Next()

        duration := time.Since(start).Seconds()
        status := strconv.Itoa(c.Writer.Status())

        httpRequestsTotal.WithLabelValues(
            c.Request.Method,
            c.FullPath(),
            status,
        ).Inc()

        httpRequestDuration.WithLabelValues(
            c.Request.Method,
            c.FullPath(),
        ).Observe(duration)
    }
}

func main() {
    router := gin.Default()
    router.Use(PrometheusMiddleware())

    // Metrics endpoint
    router.GET("/metrics", gin.WrapH(promhttp.Handler()))

    // ... rest of code
}
```

---

## ✅ สรุป: ทำไม Golang และ Gin ถึงดีสำหรับการสร้าง API?

**Golang** และ **Gin Framework** เป็นตัวเลือกที่ยอดเยี่ยมสำหรับการสร้าง **Microservice API** ที่ต้องการความเร็วสูง

### 🎯 ข้อดีหลัก:

1. **ประสิทธิภาพและความเร็วสูง**

   - Go มี built-in concurrency ด้วย goroutines
   - Gin เป็น framework ที่เร็วที่สุดตัวหนึ่งใน Go ecosystem
   - สามารถ handle traffic หลักหมื่น requests/second

2. **Clean Code ด้วย Layered Architecture**

   - แยกชั้น Handler, Service, Repository ชัดเจน
   - ใช้ Interface เพื่อ Dependency Injection
   - ง่ายต่อการทำ Unit Testing และ Mocking

3. **Deploy ง่ายมาก (Single Binary)**

   - Build ได้เป็นไฟล์ executable ไฟล์เดียว
   - ไม่ต้องติดตั้ง runtime หรือ dependencies
   - Cross-platform compilation ง่าย (Linux, Windows, macOS)

4. **Type Safety และ Compile-time Error Checking**

   - จับ error ได้ตั้งแต่ตอน compile
   - IDE support ดี (autocomplete, refactoring)
   - ลด runtime errors

5. **Ecosystem ที่แข็งแรง**

   - Middleware พร้อมใช้มากมาย (CORS, GZIP, Rate Limiting)
   - Database drivers ครบถ้วน (PostgreSQL, MySQL, MongoDB)
   - Cloud-native tools (Docker, Kubernetes)

6. **Resource Efficient**
   - Memory footprint ต่ำ (เริ่มต้นที่ ~10-20MB)
   - CPU usage ต่ำกว่า Node.js และ Python
   - เหมาะสำหรับ Serverless และ Container

### 📈 Use Cases ที่เหมาะสม:

- ✅ High-performance REST APIs
- ✅ Microservices Architecture
- ✅ Real-time Applications (WebSocket)
- ✅ Cloud-native Applications
- ✅ CLI Tools และ DevOps Automation
- ✅ Data Processing Pipelines

### 🚀 ก้าวต่อไปหลังจากนี้:

1. **Database Integration:** เชื่อมต่อ PostgreSQL/MySQL จริง
2. **Authentication:** JWT, OAuth2
3. **Testing:** Unit tests, Integration tests
4. **Monitoring:** Prometheus, Grafana
5. **Logging:** Structured logging ด้วย Zerolog
6. **Message Queue:** RabbitMQ, Kafka integration
7. **GraphQL:** ทดลองใช้ gqlgen
8. **gRPC:** สร้าง high-performance RPC services

---

## 📚 แหล่งเรียนรู้เพิ่มเติม

### Official Documentation:

- **Go:** https://go.dev/doc/
- **Gin:** https://gin-gonic.com/docs/
- **Swagger:** https://swagger.io/docs/

### Community Resources:

- **Go by Example:** https://gobyexample.com/
- **Effective Go:** https://go.dev/doc/effective_go
- **Awesome Go:** https://awesome-go.com/

### Books:

- **"The Go Programming Language"** by Alan A. A. Donovan
- **"Let's Go"** by Alex Edwards
- **"Web Development with Go"** by Jon Calhoun

---

**Happy Coding! 🎉**

ถ้ามีคำถามหรือพบปัญหา สามารถเปิด Issue ใน GitHub Repository หรือติดต่อผ่าน:

- Email: support@example.com
- Twitter: @yourhandle
- Discord: Your Server Link
