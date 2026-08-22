# Expense Tracker — Database Schema

SQL Server schema for the Expense Tracker project. Documents tables, columns, constraints, and the design decisions behind them.

**Database name:** `EXPENSE_TRACKER_AUG_07`

---

## Table Creation Order

Tables must be created in this order due to foreign key dependencies:

```
ROLE → APP_USER → CATEGORY → BUDGET → RECURRING_PAYMENT → APP_TRANSACTION → PAYMENT
```

---

## Naming Conventions

- **Table names**: singular, ALL_CAPS (`CATEGORY`, not `Categories`)
- Reserved SQL Server keywords avoided by prefixing: `APP_USER` (not `USER`), `APP_TRANSACTION` (not `TRANSACTION`)
- **Timestamps**: all stored as UTC using `DATETIME2`, populated via `SYSUTCDATETIME()`. Conversion to/from local time happens at the application layer (Java `Instant` on the backend, browser timezone on the Angular frontend) — never stored with an offset in the DB.
- **Money**: `DECIMAL(12,2)` everywhere — never floating point, to avoid rounding errors.

---

## 1. ROLE

Fixed, admin-seeded lookup table (`ADMIN`, `EMPLOYEE`, `USER`). Not editable through the app.

| Column | Type | Constraints |
|---|---|---|
| id | VARCHAR(20) | PK, NOT NULL |
| name | VARCHAR(100) | NOT NULL, UNIQUE |

**Notes:**
- No delete behavior needed on this table's own columns since nothing references *out* from it — it's purely a referenced/parent table.
- `APP_USER.role → ROLE.id` uses default `NO ACTION` on delete, so a Role can't be removed while Users still reference it.

---

## 2. APP_USER

Represents both end users and staff (Admin/Employee) — role is determined by the `role` FK, not a separate table.

| Column | Type | Constraints |
|---|---|---|
| id | INT IDENTITY(1,1) | PK |
| name | VARCHAR(100) | NOT NULL |
| gender | BIT | NOT NULL |
| dob | DATE | NOT NULL |
| email | VARCHAR(100) | NOT NULL, UNIQUE |
| password | VARCHAR(100) | NOT NULL (stores a bcrypt hash, not plaintext) |
| role | VARCHAR(30) | NOT NULL, FK → ROLE(id) |
| created_by | INT | NULL (unenforced — see note) |
| created_at | DATETIME2 | NOT NULL, DEFAULT SYSUTCDATETIME() |
| modified_by | INT | NULL (unenforced — see note) |
| modified_at | DATETIME2 | NULL |

**Design notes:**
- `password` is sized for a bcrypt hash (60 chars fixed length); column sized to 100 for headroom in case of a future algorithm change.
- `created_by` / `modified_by` are self-referencing (User → User), meaningful because Admin/Employee users can create or edit other users' records. However, **FK enforcement was dropped** on these two columns after hitting a SQL Server error ("may cause cycles or multiple cascade paths") from having two self-referencing `ON DELETE SET NULL` constraints on the same table. The columns still store `id` values, but referential integrity for them is the application's responsibility, not the database's.
- `gender` is a BIT (binary M/F), a deliberate scope decision for this project.
- Only one `role` per user (not a many-to-many), by design decision.

---

## 3. CATEGORY

| Column | Type | Constraints |
|---|---|---|
| id | INT IDENTITY(1,1) | PK |
| name | VARCHAR(50) | NOT NULL |
| description | VARCHAR(300) | NULL |
| icon | VARCHAR(50) | NULL (stores a filename/path reference, not raw image data) |
| type | BIT | NOT NULL (0 = expense, 1 = income) |
| isUniversal | BIT | NOT NULL, DEFAULT 0 |
| isActive | BIT | NOT NULL, DEFAULT 1 |
| user_id | INT | NULL, FK → APP_USER(id) ON DELETE CASCADE |
| created_at | DATETIME2 | NOT NULL, DEFAULT SYSUTCDATETIME() |
| modified_at | DATETIME2 | NULL |

**Constraints:**
- `UNIQUE (name, user_id)` — a name only needs to be unique per owner, not globally (two different users can each have their own "Food" category).

**Design notes:**
- `user_id` is nullable to support `isUniversal = 1` shared/system categories, which have no single owner.
- `isActive` implements **soft delete**: categories are never hard-deleted once Transactions/Budgets reference them (`NO ACTION` from those tables blocks it). Deactivating via `isActive = 0` hides a category from new-transaction dropdowns without breaking historical data.
- `created_by` / `modified_by` were deliberately **not added** to this table — a simplification decision, relying on `user_id` for ownership only.
- `user_id → CASCADE`: deleting a user deletes their personal categories (full account wipe was a deliberate choice).

---

## 4. BUDGET

Represents a **standing spending limit** per category, per period type — not a per-month historical record. One row = "the current cap," continuously in effect until changed.

| Column | Type | Constraints |
|---|---|---|
| id | INT IDENTITY(1,1) | PK |
| limit_amount | DECIMAL(12,2) | NOT NULL |
| type | CHAR(1) | NOT NULL, CHECK IN ('D','W','M','Y') |
| category_id | INT | NOT NULL, FK → CATEGORY(id) |
| user_id | INT | NOT NULL, FK → APP_USER(id) ON DELETE CASCADE |
| created_at | DATETIME2 | NOT NULL, DEFAULT SYSUTCDATETIME() |
| modified_at | DATETIME2 | NULL |

**Constraints:**
- `UNIQUE (type, category_id, user_id)` — a user can have at most one budget per period type per category (e.g. one Monthly Food budget and one Yearly Food budget can coexist, but not two Monthly Food budgets).
- `category_id → NO ACTION` — a Category can't be hard-deleted while a Budget references it (pushes toward `isActive` soft-delete on Category instead).

**Design notes:**
- Actual "spend so far" is **not stored here** — it's calculated dynamically by summing `APP_TRANSACTION.amount` for the matching category and period window, at query/render time. Budget only stores the limit the user set.
- A user can optionally set daily, weekly, monthly, and/or yearly budgets for the same category simultaneously — none are mandatory; absence of a row means that period type simply isn't tracked.

---

## 5. RECURRING_PAYMENT

Represents the **recurrence rule** (e.g. "Netflix, $15, monthly") — distinct from individual occurrences, which live in `PAYMENT`.

| Column | Type | Constraints |
|---|---|---|
| id | INT IDENTITY(1,1) | PK |
| name | VARCHAR(100) | NOT NULL |
| description | VARCHAR(300) | NULL |
| recurring | CHAR(1) | NOT NULL, CHECK IN ('D','W','M','Y') |
| day | INT | NULL |
| month | INT | NULL |
| amount | DECIMAL(12,2) | NOT NULL |
| category_id | INT | NOT NULL, FK → CATEGORY(id) |
| user_id | INT | NOT NULL, FK → APP_USER(id) ON DELETE CASCADE |
| created_at | DATETIME2 | NOT NULL, DEFAULT SYSUTCDATETIME() |
| modified_at | DATETIME2 | NULL |
| isActive | BIT | NOT NULL, DEFAULT 1 |
| endDate | DATE | NULL (null = runs indefinitely) |

**Design notes — `day` / `month` interpretation (see full design note doc for details):**

| recurring | month | day |
|---|---|---|
| D (Daily) | not used | not used |
| W (Weekly) | not used | day-of-week (1–7), required |
| M (Monthly) | not used | day-of-month (1–31), optional |
| Y (Yearly) | month (1–12), required | day-of-month (1–31), required |

This interpretation is **not enforced by the schema** — it must be validated in the application/service layer.

- `isActive` supports pausing/cancelling a recurring rule without deleting history (e.g. cancelled subscriptions). New rows don't need to explicitly insert `isActive` — the default handles it; it's set to `0` only later, on cancellation.
- `endDate` is nullable specifically to support indefinitely-recurring payments (no forced end date).
- `Payment.recurring_payment_id → NO ACTION`: a Recurring Payment can't be deleted while Payments still reference it.

---

## 6. APP_TRANSACTION

The core financial record — an actual income or expense event.

| Column | Type | Constraints |
|---|---|---|
| id | INT IDENTITY(1,1) | PK |
| name | VARCHAR(100) | NOT NULL |
| description | VARCHAR(300) | NULL |
| category_id | INT | NOT NULL, FK → CATEGORY(id) |
| user_id | INT | NOT NULL, FK → APP_USER(id) ON DELETE CASCADE |
| amount | DECIMAL(12,2) | NOT NULL |
| transaction_date | DATETIME2 | NOT NULL |
| created_at | DATETIME2 | NOT NULL, DEFAULT SYSUTCDATETIME() |
| modified_at | DATETIME2 | NULL |

**Design notes:**
- `transaction_date` (when the transaction actually happened) is intentionally separate from `created_at` (when the row was inserted) — a user can log yesterday's expense today.
- No explicit `type` (income/expense) column — deliberately relies on the linked `CATEGORY.type`. Known trade-off: if a category's type is edited later, historical transactions under it change meaning retroactively. Accepted for this project's scope.
- `category_id → NO ACTION` — a Category can't be hard-deleted while Transactions reference it.
- No `created_by` / `modified_by` — deliberate simplification, since a transaction is only ever touched by its owning user.

---

## 7. PAYMENT

Represents an individual bill/payment occurrence — either standalone or generated from a `RECURRING_PAYMENT` rule. Tracks the obligation (due date) separately from its fulfillment (linked transaction).

| Column | Type | Constraints |
|---|---|---|
| id | INT IDENTITY(1,1) | PK |
| name | VARCHAR(100) | NOT NULL |
| description | VARCHAR(300) | NULL |
| category_id | INT | NOT NULL, FK → CATEGORY(id) |
| user_id | INT | NOT NULL, FK → APP_USER(id) ON DELETE CASCADE |
| transaction_id | INT | NULL, FK → APP_TRANSACTION(id), ON DELETE NO ACTION |
| recurring_payment_id | INT | NULL, FK → RECURRING_PAYMENT(id), ON DELETE NO ACTION |
| due_date | DATE | NOT NULL |
| amount | DECIMAL(12,2) | NOT NULL |
| created_at | DATETIME2 | NOT NULL, DEFAULT SYSUTCDATETIME() |
| modified_at | DATETIME2 | NULL |

**Design notes:**
- `transaction_id` starts NULL and is filled in once the payment is completed/paid.
- `completion_date` was deliberately **not included** — considered redundant, since `APP_TRANSACTION.transaction_date` (via `transaction_id`) already answers "when was this completed," once linked.
- Both `transaction_id` and `recurring_payment_id` are `NO ACTION` (not `SET NULL` or `CASCADE`) — this was required to resolve a SQL Server "multiple cascade paths" error caused by two CASCADE routes converging on this table from `APP_USER` (directly via `user_id`, and indirectly via `transaction_id → APP_TRANSACTION → user_id`). See **Known Limitation** below.

---

## Known Limitation: User Deletion Requires Application-Level Ordering

Because `PAYMENT.transaction_id` and `PAYMENT.recurring_payment_id` are `NO ACTION`, **a full user deletion cannot be handled by cascades alone.** Deleting a user directly will fail if any of their Payments still reference a Transaction or Recurring Payment.

**Required deletion order, to be implemented in the Spring Boot service layer (not the database):**

1. Delete the user's `PAYMENT` rows first
2. Delete the user's `APP_TRANSACTION` and `RECURRING_PAYMENT` rows (order between these two doesn't matter, since neither blocks the other)
3. Delete the user's `CATEGORY` and `BUDGET` rows (or let these cascade automatically)
4. Delete the `APP_USER` row itself — at this point, `CATEGORY`, `BUDGET`, `APP_TRANSACTION`, and `RECURRING_PAYMENT` will cascade automatically via their direct `user_id → CASCADE` foreign keys

This was confirmed by testing: attempting to delete a User directly (with dependent Payment rows still in place) throws a foreign key violation, as expected.

---

## Verified Behaviors (via manual testing)

- ✅ Deleting a Category referenced by a Transaction → blocked
- ✅ Deleting a Recurring Payment referenced by a Payment → blocked
- ✅ Deleting a Transaction referenced by a Payment → blocked
- ✅ Deleting a User → cascades through Category, Budget, Recurring Payment, Transaction, and Payment, provided the application-level deletion order above is followed
- ✅ Duplicate `(name, user_id)` on Category → rejected by composite UNIQUE
- ✅ Duplicate `(type, category_id, user_id)` on Budget → rejected by composite UNIQUE
- ✅ Invalid `recurring` / `type` values outside D/W/M/Y → rejected by CHECK constraints

---

## Open Items / Future Considerations

- [ ] Decide whether `day` value for Weekly recurrence should follow ISO-8601 (Monday=1) or another convention — must be consistent app-wide.
- [ ] Decide fallback behavior when `RECURRING_PAYMENT.day` is omitted for Monthly recurrence.
- [ ] Consider whether Admin/Employee edit permissions on `APP_USER` should be restricted at the field level (e.g. can't overwrite `password` via a generic edit endpoint) — an application-layer authorization concern, not a schema one.
- [ ] `created_by` / `modified_by` on `APP_USER` are unenforced at the DB level (no FK constraint) — must be validated entirely in application code.
