CREATE DATABASE EXPENSE_TRACKER_AUG_07

CREATE TABLE ROLE (
    id VARCHAR(30) NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE APP_USER (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender BIT NOT NULL,
    dob DATE NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL,
    created_by INT NULL,
    created_at DATETIME2  NOT NULL DEFAULT SYSUTCDATETIME(),
    modified_by INT NULL,
    modified_at DATETIME2  NULL,
    CONSTRAINT FK_AppUser_Role FOREIGN KEY (role) REFERENCES ROLE(id)
);

CREATE TABLE CATEGORY (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(300) NULL,
    icon VARCHAR(50) NULL,
    type BIT NOT NULL,
    isUniversal BIT NOT NULL DEFAULT 0,
    isActive BIT NOT NULL DEFAULT 1,
    user_id INT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    modified_at DATETIME2 NULL,
    CONSTRAINT UQ_Category_Name_User UNIQUE (name, user_id),
    CONSTRAINT FK_Category_User FOREIGN KEY (user_id) REFERENCES APP_USER(id) ON DELETE CASCADE
);

CREATE TABLE RECURRING_PAYMENT (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(300) NULL,
    recurring CHAR(1) NOT NULL,
    day INT NULL,
    month INT NULL,
    amount DECIMAL(12,2) NOT NULL,
    category_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    modified_at DATETIME2 NULL,
    isActive BIT NOT NULL DEFAULT 1,
    endDate DATE NULL,
    CONSTRAINT CK_RecurringPayment_Recurring CHECK (recurring IN ('D', 'W', 'M', 'Y')),
    CONSTRAINT FK_RecurringPayment_Category FOREIGN KEY (category_id) REFERENCES CATEGORY(id),
    CONSTRAINT FK_RecurringPayment_User FOREIGN KEY (user_id) REFERENCES APP_USER(id) ON DELETE CASCADE
);

CREATE TABLE BUDGET (
    id INT IDENTITY(1,1) PRIMARY KEY,
    limit_amount DECIMAL(12,2) NOT NULL,
    type CHAR(1) NOT NULL,
    category_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    modified_at DATETIME2 NULL,
    CONSTRAINT CK_Budget_Type CHECK (type IN ('D', 'W', 'M', 'Y')),
    CONSTRAINT UQ_Budget_Type_Category_User UNIQUE (type, category_id, user_id),
    CONSTRAINT FK_Budget_Category FOREIGN KEY (category_id) REFERENCES CATEGORY(id),
    CONSTRAINT FK_Budget_User FOREIGN KEY (user_id) REFERENCES APP_USER(id) ON DELETE CASCADE
);

CREATE TABLE APP_TRANSACTION (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(300) NULL,
    category_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    transaction_date DATETIME2 NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    modified_at DATETIME2 NULL,
    CONSTRAINT FK_Transaction_Category FOREIGN KEY (category_id) REFERENCES CATEGORY(id),
    CONSTRAINT FK_Transaction_User FOREIGN KEY (user_id) REFERENCES APP_USER(id) ON DELETE CASCADE
);

CREATE TABLE PAYMENT (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(300) NULL,
    category_id INT NOT NULL,
    user_id INT NOT NULL,
    transaction_id INT NULL,
    recurring_payment_id INT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    modified_at DATETIME2 NULL,
    CONSTRAINT FK_Payment_Category FOREIGN KEY (category_id) REFERENCES CATEGORY(id),
    CONSTRAINT FK_Payment_User FOREIGN KEY (user_id) REFERENCES APP_USER(id) ON DELETE CASCADE,
    CONSTRAINT FK_Payment_Transaction FOREIGN KEY (transaction_id) REFERENCES APP_TRANSACTION(id),
    CONSTRAINT FK_Payment_RecurringPayment FOREIGN KEY (recurring_payment_id) REFERENCES RECURRING_PAYMENT(id)
);