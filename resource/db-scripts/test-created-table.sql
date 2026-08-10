-- 1. ROLE
INSERT INTO ROLE (id, name) VALUES
('ADMIN', 'Administrator'),
('EMPLOYEE', 'Employee'),
('USER', 'Standard User');

-- 2. APP_USER
INSERT INTO APP_USER (name, gender, dob, email, password, role)
VALUES ('Test User', 1, '1995-06-15', 'testuser@example.com', 'hashed_password_placeholder', 'USER');

-- grab the generated id for use below
-- SELECT id FROM APP_USER WHERE email = 'testuser@example.com';
-- assume it returned id = 1 for the rest of this script

-- 3. CATEGORY
INSERT INTO CATEGORY (name, description, type, isUniversal, user_id)
VALUES 
('Food', 'Groceries and dining', 0, 0, 1),      -- type 0 = expense
('Salary', 'Monthly salary income', 1, 0, 1);    -- type 1 = income

-- 4. BUDGET
INSERT INTO BUDGET (limit_amount, type, category_id, user_id)
VALUES (500.00, 'M', 1, 1);  -- monthly Food budget of 500

-- 5. RECURRING_PAYMENT
INSERT INTO RECURRING_PAYMENT (name, description, recurring, day, month, amount, category_id, user_id)
VALUES ('Netflix Subscription', 'Monthly streaming', 'M', 5, NULL, 15.00, 1, 1);

-- 6. APP_TRANSACTION
INSERT INTO APP_TRANSACTION (name, description, category_id, user_id, amount, transaction_date)
VALUES ('Grocery run', 'Weekly shopping', 1, 1, 45.50, SYSUTCDATETIME());

-- SELECT id FROM APP_TRANSACTION WHERE name = 'Grocery run';
-- assume it returned id = 1

-- 7. PAYMENT (linking to the transaction and recurring payment above)
INSERT INTO PAYMENT (name, description, category_id, user_id, transaction_id, recurring_payment_id, due_date, amount)
VALUES ('Netflix - August', 'Monthly Netflix charge', 1, 1, 1, 1, '2026-08-05', 15.00);








-------------------------------------

-- TEST 1: Try deleting the Category that has a Transaction pointing at it
-- Expect: BLOCKED (FK_Transaction_Category is NO ACTION)
DELETE FROM CATEGORY WHERE id = 1;

-- TEST 2: Try deleting the Recurring_Payment that has a Payment pointing at it
-- Expect: BLOCKED (FK_Payment_RecurringPayment is NO ACTION)
DELETE FROM RECURRING_PAYMENT WHERE id = 1;

-- TEST 3: Try deleting the Transaction that has a Payment pointing at it
-- Expect: BLOCKED (FK_Payment_Transaction is NO ACTION)
DELETE FROM APP_TRANSACTION WHERE id = 1;

-- TEST 4: Delete the User directly
-- Expect: CASCADES through Category, Budget, Recurring_Payment, App_Transaction, Payment
-- This should FAIL too right now, because Payment still references App_Transaction
-- and Recurring_Payment with NO ACTION, and those aren't being cleaned up first.
DELETE FROM APP_USER WHERE id = 1;