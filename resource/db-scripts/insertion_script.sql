-- ============================================
-- Expense Tracker - Seed Data Script
-- Idempotent: safe to run multiple times without
-- creating duplicates or throwing errors.
-- ============================================

-- 1. ROLE (fixed lookup values)
IF NOT EXISTS (SELECT 1 FROM ROLE WHERE id = 'ADMIN')
    INSERT INTO ROLE (id, name) VALUES ('ADMIN', 'Administrator');

IF NOT EXISTS (SELECT 1 FROM ROLE WHERE id = 'EMPLOYEE')
    INSERT INTO ROLE (id, name) VALUES ('EMPLOYEE', 'Employee');

IF NOT EXISTS (SELECT 1 FROM ROLE WHERE id = 'USER')
    INSERT INTO ROLE (id, name) VALUES ('USER', 'Standard User');


-- 2. APP_USER (one test user per role)
-- NOTE: 'password' column below holds a PLACEHOLDER string only —
-- it is NOT a real bcrypt hash. Replace these test users' passwords
-- via your actual registration/auth flow once that's built, so a
-- real bcrypt hash gets stored instead of this placeholder text.

IF NOT EXISTS (SELECT 1 FROM APP_USER WHERE email = 'admin@expensetracker.test')
    INSERT INTO APP_USER (name, gender, dob, email, password, role)
    VALUES ('Test Admin', 1, '1990-01-01', 'admin@expensetracker.test', 'PLACEHOLDER_HASH_ADMIN', 'ADMIN');

IF NOT EXISTS (SELECT 1 FROM APP_USER WHERE email = 'employee@expensetracker.test')
    INSERT INTO APP_USER (name, gender, dob, email, password, role)
    VALUES ('Test Employee', 0, '1992-05-10', 'employee@expensetracker.test', 'PLACEHOLDER_HASH_EMPLOYEE', 'EMPLOYEE');

IF NOT EXISTS (SELECT 1 FROM APP_USER WHERE email = 'user@expensetracker.test')
    INSERT INTO APP_USER (name, gender, dob, email, password, role)
    VALUES ('Test User', 1, '1995-06-15', 'user@expensetracker.test', 'PLACEHOLDER_HASH_USER', 'USER');


-- ============================================
-- CATEGORY - Seed Data (default/universal categories)
-- Idempotent: safe to run multiple times.
-- These are system-seeded categories: user_id = NULL, isUniversal = 1
-- type: 0 = Expense, 1 = Income (matches Category.isIncome mapping)
-- ============================================

-- Expense categories
IF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE name = 'Food' AND user_id IS NULL)
    INSERT INTO CATEGORY (name, description, icon, type, isUniversal, isActive, user_id)
    VALUES ('Food', 'Groceries and dining out', 'food.svg', 0, 1, 1, NULL);

IF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE name = 'Rent' AND user_id IS NULL)
    INSERT INTO CATEGORY (name, description, icon, type, isUniversal, isActive, user_id)
    VALUES ('Rent', 'Housing and rent payments', 'rent.svg', 0, 1, 1, NULL);

IF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE name = 'Transportation' AND user_id IS NULL)
    INSERT INTO CATEGORY (name, description, icon, type, isUniversal, isActive, user_id)
    VALUES ('Transportation', 'Fuel, public transit, cab fares', 'transport.svg', 0, 1, 1, NULL);

IF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE name = 'Utilities' AND user_id IS NULL)
    INSERT INTO CATEGORY (name, description, icon, type, isUniversal, isActive, user_id)
    VALUES ('Utilities', 'Electricity, water, internet, phone', 'utilities.svg', 0, 1, 1, NULL);

IF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE name = 'Entertainment' AND user_id IS NULL)
    INSERT INTO CATEGORY (name, description, icon, type, isUniversal, isActive, user_id)
    VALUES ('Entertainment', 'Movies, streaming, hobbies', 'entertainment.svg', 0, 1, 1, NULL);

IF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE name = 'Healthcare' AND user_id IS NULL)
    INSERT INTO CATEGORY (name, description, icon, type, isUniversal, isActive, user_id)
    VALUES ('Healthcare', 'Medical expenses and insurance', 'healthcare.svg', 0, 1, 1, NULL);

IF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE name = 'Shopping' AND user_id IS NULL)
    INSERT INTO CATEGORY (name, description, icon, type, isUniversal, isActive, user_id)
    VALUES ('Shopping', 'Clothing, electronics, general purchases', 'shopping.svg', 0, 1, 1, NULL);

-- Income categories
IF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE name = 'Salary' AND user_id IS NULL)
    INSERT INTO CATEGORY (name, description, icon, type, isUniversal, isActive, user_id)
    VALUES ('Salary', 'Monthly salary income', 'salary.svg', 1, 1, 1, NULL);

IF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE name = 'Freelance' AND user_id IS NULL)
    INSERT INTO CATEGORY (name, description, icon, type, isUniversal, isActive, user_id)
    VALUES ('Freelance', 'Freelance and contract income', 'freelance.svg', 1, 1, 1, NULL);

IF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE name = 'Investment' AND user_id IS NULL)
    INSERT INTO CATEGORY (name, description, icon, type, isUniversal, isActive, user_id)
    VALUES ('Investment', 'Dividends, interest, capital gains', 'investment.svg', 1, 1, 1, NULL);

IF NOT EXISTS (SELECT 1 FROM CATEGORY WHERE name = 'Other Income' AND user_id IS NULL)
    INSERT INTO CATEGORY (name, description, icon, type, isUniversal, isActive, user_id)
    VALUES ('Other Income', 'Gifts, refunds, miscellaneous income', 'other-income.svg', 1, 1, 1, NULL);