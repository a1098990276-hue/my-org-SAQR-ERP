-- =============================================
-- SAQR ERP Database Schema
-- =============================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'SAQR_ERP_DB')
BEGIN
    CREATE DATABASE SAQR_ERP_DB;
END
GO

USE SAQR_ERP_DB;
GO

-- =============================================
-- Table: Users
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserID      int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        UserName    nvarchar(100)  NOT NULL,
        Email       nvarchar(255)  NOT NULL UNIQUE,
        Password    nvarchar(255)  NOT NULL,
        Role        nvarchar(50)   NOT NULL DEFAULT 'user',
        IsActive    bit            NOT NULL DEFAULT 1,
        CreatedAt   datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt   datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: Customers
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Customers')
BEGIN
    CREATE TABLE Customers (
        CustomerID  int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Name        nvarchar(100)  NOT NULL,
        Phone       nvarchar(20)   NULL,
        City        nvarchar(50)   NULL,
        Balance     decimal(18,2)  NOT NULL DEFAULT 0
    );
END
GO

-- =============================================
-- Table: Suppliers
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Suppliers')
BEGIN
    CREATE TABLE Suppliers (
        SupplierID  int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Name        nvarchar(100)  NOT NULL,
        Phone       nvarchar(20)   NULL,
        City        nvarchar(50)   NULL,
        Balance     decimal(18,2)  NOT NULL DEFAULT 0
    );
END
GO

-- =============================================
-- Table: Items
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Items')
BEGIN
    CREATE TABLE Items (
        ItemID      int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Name        nvarchar(100)  NOT NULL,
        Unit        nvarchar(20)   NULL,
        Price       decimal(18,2)  NOT NULL DEFAULT 0,
        Quantity    int            NOT NULL DEFAULT 0,
        MinQuantity int            NOT NULL DEFAULT 0
    );
END
GO

-- =============================================
-- Table: Invoices
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Invoices')
BEGIN
    CREATE TABLE Invoices (
        InvoiceID   int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        CustomerID  int            NOT NULL,
        Date        datetime2      NOT NULL DEFAULT GETDATE(),
        Total       decimal(18,2)  NOT NULL DEFAULT 0,
        Status      nvarchar(50)   NOT NULL DEFAULT 'unpaid',
        Notes       nvarchar(500)  NULL,
        CONSTRAINT FK_Invoices_Customers FOREIGN KEY (CustomerID)
            REFERENCES Customers (CustomerID)
    );
END
GO

-- =============================================
-- Table: InvoiceDetails
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'InvoiceDetails')
BEGIN
    CREATE TABLE InvoiceDetails (
        InvoiceDetailID int           NOT NULL IDENTITY(1,1) PRIMARY KEY,
        InvoiceID       int           NOT NULL,
        ItemID          int           NOT NULL,
        Quantity        decimal(18,2) NOT NULL DEFAULT 0,
        UnitPrice       decimal(18,2) NOT NULL DEFAULT 0,
        Total           decimal(18,2) NOT NULL DEFAULT 0,
        CONSTRAINT FK_InvoiceDetails_Invoices FOREIGN KEY (InvoiceID)
            REFERENCES Invoices (InvoiceID),
        CONSTRAINT FK_InvoiceDetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID)
    );
END
GO
