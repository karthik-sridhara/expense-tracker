# Expense Tracker — High-Level Design

A full-stack project using **Spring Boot** (backend) and **Angular** (frontend).

---

## 1. Core Entities / Data Model

**User**
- id, name, email, password (hashed), createdAt

**Category**
- id, name, type (INCOME / EXPENSE), icon/color, userId (owned by user, or seed a default set)

**Expense/Transaction**
- id, amount, description, date, type (INCOME / EXPENSE), categoryId, userId, createdAt

**Budget** (optional, stretch goal)
- id, categoryId, monthlyLimit, month/year, userId

**Relationships**
- User (1) → (many) Transactions
- User (1) → (many) Categories
- Category (1) → (many) Transactions

---

## 2. Backend (Spring Boot) Structure

```
com.expensetracker
 ├── config          → SecurityConfig, CORS config
 ├── controller       → AuthController, TransactionController, CategoryController, ReportController
 ├── service          → business logic (interfaces + impl)
 ├── repository       → Spring Data JPA repositories
 ├── entity           → User, Category, Transaction, Budget
 ├── dto              → request/response DTOs (never expose entities directly)
 ├── security         → JWT filter, JWT util, UserDetailsService
 └── exception        → global exception handler (@ControllerAdvice)
```

### Key API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/categories
POST   /api/categories
DELETE /api/categories/{id}

GET    /api/transactions?month=&year=&categoryId=&type=&page=&size=
POST   /api/transactions
PUT    /api/transactions/{id}
DELETE /api/transactions/{id}

GET    /api/reports/summary?month=&year=      → total income, total expense, balance
GET    /api/reports/by-category?month=&year=  → breakdown for pie chart
GET    /api/reports/monthly-trend?year=       → for line/bar chart across months
```

---

## 3. Frontend (Angular) Structure

```
src/app
 ├── core/            → auth service, http interceptor (attach JWT), auth guard
 ├── shared/          → reusable components (modals, buttons, pipes)
 ├── features/
 │   ├── auth/        → login, register components
 │   ├── dashboard/    → summary cards + charts
 │   ├── transactions/ → list, add/edit form, filters
 │   └── categories/   → manage categories
 ├── models/          → Transaction, Category, User interfaces
 └── app-routing.module.ts
```

### Key Screens

- **Login / Register**
- **Dashboard** — total income/expense/balance cards, pie chart (spending by category), line chart (monthly trend)
- **Transactions list** — filterable/sortable table, pagination, add/edit via modal or separate page
- **Categories page** — CRUD for custom categories

---

## 4. Suggested Build Order

1. Backend: entities + repositories + basic CRUD controllers for Category and Transaction (no auth yet)
2. Frontend: connect to backend, list + add transactions, basic table UI
3. Add filtering (by month, category, type) and pagination
4. Add Spring Security + JWT auth, wire up login/register on Angular side with route guards + HTTP interceptor
5. Add dashboard with summary endpoint + charts (ngx-charts or Chart.js)
6. Polish: form validation, error handling, loading states, responsive UI
7. Stretch goals: budgets with limit alerts, CSV export, dark mode, Docker Compose for one-command setup

---

## 5. Skills This Project Reinforces

- Proper DTO usage instead of exposing JPA entities directly
- Pagination and filtering with Spring Data JPA (`Pageable`, `Specification`, or query methods)
- JWT auth end-to-end (issuing, storing in Angular, attaching via interceptor, guarding routes)
- Aggregation queries (`SUM`, `GROUP BY`) for reports endpoints
- Reactive data flow in Angular using RxJS (services returning Observables, async pipe in templates)