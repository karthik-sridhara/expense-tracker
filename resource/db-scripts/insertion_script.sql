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