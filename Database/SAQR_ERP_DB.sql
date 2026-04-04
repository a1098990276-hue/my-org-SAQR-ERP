-- =============================================
-- SAQR ERP Database Schema - نظام صقر المحاسبي المتكامل
-- Version: 2.0
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
-- SECTION 1: CORE TABLES - الجداول الأساسية
-- =============================================

-- =============================================
-- Table: Branches - الفروع
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Branches')
BEGIN
    CREATE TABLE Branches (
        BranchID        int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        Address         nvarchar(500)  NULL,
        Phone           nvarchar(20)   NULL,
        Email           nvarchar(255)  NULL,
        TaxNumber       nvarchar(50)   NULL,
        CommercialReg   nvarchar(50)   NULL,
        BranchGroupID   int            NULL,
        IsMain          bit            NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: Users - المستخدمين
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserID      int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        UserName    nvarchar(100)  NOT NULL,
        Email       nvarchar(255)  NOT NULL UNIQUE,
        Password    nvarchar(255)  NOT NULL,
        Phone       nvarchar(20)   NULL,
        Role        nvarchar(50)   NOT NULL DEFAULT 'user',
        BranchID    int            NULL,
        IsActive    bit            NOT NULL DEFAULT 1,
        LastLogin   datetime2      NULL,
        CreatedAt   datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt   datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Users_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID)
    );
END
GO

-- =============================================
-- SECTION 2: CHART OF ACCOUNTS - دليل الحسابات
-- =============================================

-- =============================================
-- Table: AccountGroups - مجموعات الحسابات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AccountGroups')
BEGIN
    CREATE TABLE AccountGroups (
        AccountGroupID  int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        Description     nvarchar(500)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: Accounts - دليل الحسابات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Accounts')
BEGIN
    CREATE TABLE Accounts (
        AccountID       int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(50)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        ParentID        int            NULL,
        AccountType     nvarchar(50)   NOT NULL, -- Asset, Liability, Equity, Revenue, Expense
        AccountNature   nvarchar(20)   NOT NULL DEFAULT 'Debit', -- Debit, Credit
        AccountLevel    int            NOT NULL DEFAULT 1,
        AccountGroupID  int            NULL,
        IsMain          bit            NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        OpeningBalance  decimal(18,2)  NOT NULL DEFAULT 0,
        CurrentBalance  decimal(18,2)  NOT NULL DEFAULT 0,
        Description     nvarchar(500)  NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Accounts_Parent FOREIGN KEY (ParentID)
            REFERENCES Accounts (AccountID),
        CONSTRAINT FK_Accounts_Groups FOREIGN KEY (AccountGroupID)
            REFERENCES AccountGroups (AccountGroupID)
    );
END
GO

-- =============================================
-- Table: CostCenters - مراكز التكلفة
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CostCenters')
BEGIN
    CREATE TABLE CostCenters (
        CostCenterID    int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        ParentID        int            NULL,
        BranchID        int            NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_CostCenters_Parent FOREIGN KEY (ParentID)
            REFERENCES CostCenters (CostCenterID),
        CONSTRAINT FK_CostCenters_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID)
    );
END
GO

-- =============================================
-- Table: Projects - المشاريع
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Projects')
BEGIN
    CREATE TABLE Projects (
        ProjectID       int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        Description     nvarchar(1000) NULL,
        StartDate       date           NULL,
        EndDate         date           NULL,
        Budget          decimal(18,2)  NOT NULL DEFAULT 0,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Active',
        BranchID        int            NULL,
        CostCenterID    int            NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Projects_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_Projects_CostCenters FOREIGN KEY (CostCenterID)
            REFERENCES CostCenters (CostCenterID)
    );
END
GO

-- =============================================
-- SECTION 3: PARTNERS & CUSTOMERS - الشركاء والعملاء
-- =============================================

-- =============================================
-- Table: CustomerGroups - مجموعات العملاء
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CustomerGroups')
BEGIN
    CREATE TABLE CustomerGroups (
        CustomerGroupID int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        DiscountRate    decimal(5,2)   NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: Customers - العملاء
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Customers')
BEGIN
    CREATE TABLE Customers (
        CustomerID      int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        CustomerType    nvarchar(50)   NOT NULL DEFAULT 'Individual', -- Individual, Company
        Phone           nvarchar(20)   NULL,
        Phone2          nvarchar(20)   NULL,
        Email           nvarchar(255)  NULL,
        TaxNumber       nvarchar(50)   NULL,
        CommercialReg   nvarchar(50)   NULL,
        Address         nvarchar(500)  NULL,
        City            nvarchar(100)  NULL,
        Country         nvarchar(100)  NULL DEFAULT 'السعودية',
        PostalCode      nvarchar(20)   NULL,
        CustomerGroupID int            NULL,
        AccountID       int            NULL,
        CreditLimit     decimal(18,2)  NOT NULL DEFAULT 0,
        Balance         decimal(18,2)  NOT NULL DEFAULT 0,
        LoyaltyPoints   int            NOT NULL DEFAULT 0,
        BranchID        int            NULL,
        Notes           nvarchar(1000) NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Customers_Groups FOREIGN KEY (CustomerGroupID)
            REFERENCES CustomerGroups (CustomerGroupID),
        CONSTRAINT FK_Customers_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID),
        CONSTRAINT FK_Customers_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID)
    );
END
GO

-- =============================================
-- Table: Partners - الشركاء
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Partners')
BEGIN
    CREATE TABLE Partners (
        PartnerID       int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        PartnerType     nvarchar(50)   NOT NULL, -- Investor, Partner
        Phone           nvarchar(20)   NULL,
        Email           nvarchar(255)  NULL,
        TaxNumber       nvarchar(50)   NULL,
        Address         nvarchar(500)  NULL,
        SharePercentage decimal(5,2)   NOT NULL DEFAULT 0,
        InvestmentAmount decimal(18,2) NOT NULL DEFAULT 0,
        AccountID       int            NULL,
        JoinDate        date           NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Partners_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID)
    );
END
GO

-- =============================================
-- SECTION 4: SUPPLIERS - الموردين
-- =============================================

-- =============================================
-- Table: SupplierGroups - مجموعات الموردين
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SupplierGroups')
BEGIN
    CREATE TABLE SupplierGroups (
        SupplierGroupID int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: Suppliers - الموردين
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Suppliers')
BEGIN
    CREATE TABLE Suppliers (
        SupplierID      int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        Phone           nvarchar(20)   NULL,
        Phone2          nvarchar(20)   NULL,
        Email           nvarchar(255)  NULL,
        TaxNumber       nvarchar(50)   NULL,
        CommercialReg   nvarchar(50)   NULL,
        Address         nvarchar(500)  NULL,
        City            nvarchar(100)  NULL,
        Country         nvarchar(100)  NULL DEFAULT 'السعودية',
        SupplierGroupID int            NULL,
        AccountID       int            NULL,
        Balance         decimal(18,2)  NOT NULL DEFAULT 0,
        PaymentTerms    int            NOT NULL DEFAULT 0, -- Days
        BranchID        int            NULL,
        Notes           nvarchar(1000) NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Suppliers_Groups FOREIGN KEY (SupplierGroupID)
            REFERENCES SupplierGroups (SupplierGroupID),
        CONSTRAINT FK_Suppliers_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID),
        CONSTRAINT FK_Suppliers_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID)
    );
END
GO

-- =============================================
-- SECTION 5: CASH & BANKS - الصناديق والبنوك
-- =============================================

-- =============================================
-- Table: CashBoxGroups - مجموعات الصناديق
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CashBoxGroups')
BEGIN
    CREATE TABLE CashBoxGroups (
        CashBoxGroupID  int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: CashBoxes - الصناديق
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CashBoxes')
BEGIN
    CREATE TABLE CashBoxes (
        CashBoxID       int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        CashBoxGroupID  int            NULL,
        AccountID       int            NULL,
        BranchID        int            NULL,
        OpeningBalance  decimal(18,2)  NOT NULL DEFAULT 0,
        CurrentBalance  decimal(18,2)  NOT NULL DEFAULT 0,
        Currency        nvarchar(10)   NOT NULL DEFAULT 'SAR',
        ResponsibleUser int            NULL,
        IsDefault       bit            NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_CashBoxes_Groups FOREIGN KEY (CashBoxGroupID)
            REFERENCES CashBoxGroups (CashBoxGroupID),
        CONSTRAINT FK_CashBoxes_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID),
        CONSTRAINT FK_CashBoxes_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_CashBoxes_Users FOREIGN KEY (ResponsibleUser)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: BankGroups - مجموعات البنوك
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BankGroups')
BEGIN
    CREATE TABLE BankGroups (
        BankGroupID     int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: Banks - البنوك
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Banks')
BEGIN
    CREATE TABLE Banks (
        BankID          int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        BankName        nvarchar(100)  NOT NULL,
        AccountNumber   nvarchar(50)   NOT NULL,
        IBAN            nvarchar(50)   NULL,
        SwiftCode       nvarchar(20)   NULL,
        BankGroupID     int            NULL,
        AccountID       int            NULL,
        BranchID        int            NULL,
        OpeningBalance  decimal(18,2)  NOT NULL DEFAULT 0,
        CurrentBalance  decimal(18,2)  NOT NULL DEFAULT 0,
        Currency        nvarchar(10)   NOT NULL DEFAULT 'SAR',
        IsDefault       bit            NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Banks_Groups FOREIGN KEY (BankGroupID)
            REFERENCES BankGroups (BankGroupID),
        CONSTRAINT FK_Banks_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID),
        CONSTRAINT FK_Banks_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID)
    );
END
GO

-- =============================================
-- SECTION 6: EMPLOYEES - الموظفين
-- =============================================

-- =============================================
-- Table: EmployeeGroups - مجموعات الموظفين
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EmployeeGroups')
BEGIN
    CREATE TABLE EmployeeGroups (
        EmployeeGroupID int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: Employees - الموظفين
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Employees')
BEGIN
    CREATE TABLE Employees (
        EmployeeID      int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        JobTitle        nvarchar(100)  NULL,
        Department      nvarchar(100)  NULL,
        Phone           nvarchar(20)   NULL,
        Email           nvarchar(255)  NULL,
        NationalID      nvarchar(20)   NULL,
        PassportNo      nvarchar(20)   NULL,
        Address         nvarchar(500)  NULL,
        HireDate        date           NULL,
        Salary          decimal(18,2)  NOT NULL DEFAULT 0,
        Commission      decimal(5,2)   NOT NULL DEFAULT 0,
        EmployeeGroupID int            NULL,
        AccountID       int            NULL,
        BranchID        int            NULL,
        UserID          int            NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Employees_Groups FOREIGN KEY (EmployeeGroupID)
            REFERENCES EmployeeGroups (EmployeeGroupID),
        CONSTRAINT FK_Employees_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID),
        CONSTRAINT FK_Employees_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_Employees_Users FOREIGN KEY (UserID)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- SECTION 7: EXPENSES & ASSETS - المصروفات والأصول
-- =============================================

-- =============================================
-- Table: ExpenseGroups - مجموعات المصروفات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ExpenseGroups')
BEGIN
    CREATE TABLE ExpenseGroups (
        ExpenseGroupID  int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: ExpenseTypes - أنواع المصروفات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ExpenseTypes')
BEGIN
    CREATE TABLE ExpenseTypes (
        ExpenseTypeID   int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        ExpenseGroupID  int            NULL,
        AccountID       int            NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_ExpenseTypes_Groups FOREIGN KEY (ExpenseGroupID)
            REFERENCES ExpenseGroups (ExpenseGroupID),
        CONSTRAINT FK_ExpenseTypes_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID)
    );
END
GO

-- =============================================
-- Table: AssetGroups - مجموعات الأصول
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AssetGroups')
BEGIN
    CREATE TABLE AssetGroups (
        AssetGroupID    int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        DepreciationRate decimal(5,2)  NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: Assets - الأصول الثابتة
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Assets')
BEGIN
    CREATE TABLE Assets (
        AssetID         int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        Description     nvarchar(500)  NULL,
        AssetGroupID    int            NULL,
        AccountID       int            NULL,
        DepAccountID    int            NULL, -- Depreciation Account
        PurchaseDate    date           NULL,
        PurchaseValue   decimal(18,2)  NOT NULL DEFAULT 0,
        CurrentValue    decimal(18,2)  NOT NULL DEFAULT 0,
        DepreciationRate decimal(5,2)  NOT NULL DEFAULT 0,
        AccumulatedDep  decimal(18,2)  NOT NULL DEFAULT 0,
        Location        nvarchar(200)  NULL,
        BranchID        int            NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Active',
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Assets_Groups FOREIGN KEY (AssetGroupID)
            REFERENCES AssetGroups (AssetGroupID),
        CONSTRAINT FK_Assets_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID),
        CONSTRAINT FK_Assets_DepAccounts FOREIGN KEY (DepAccountID)
            REFERENCES Accounts (AccountID),
        CONSTRAINT FK_Assets_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID)
    );
END
GO

-- =============================================
-- SECTION 8: SHIPPING & DELIVERY COMPANIES
-- =============================================

-- =============================================
-- Table: ShippingCompanies - شركات الشحن
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ShippingCompanies')
BEGIN
    CREATE TABLE ShippingCompanies (
        ShippingCompanyID int          NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        Phone           nvarchar(20)   NULL,
        Email           nvarchar(255)  NULL,
        Address         nvarchar(500)  NULL,
        AccountID       int            NULL,
        DefaultCost     decimal(18,2)  NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_ShippingCompanies_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID)
    );
END
GO

-- =============================================
-- Table: DeliveryCompanyGroups - مجموعة شركات التوصيل
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DeliveryCompanyGroups')
BEGIN
    CREATE TABLE DeliveryCompanyGroups (
        DeliveryGroupID int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: DeliveryCompanies - شركات التوصيل
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DeliveryCompanies')
BEGIN
    CREATE TABLE DeliveryCompanies (
        DeliveryCompanyID int          NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        Phone           nvarchar(20)   NULL,
        Email           nvarchar(255)  NULL,
        Address         nvarchar(500)  NULL,
        DeliveryGroupID int            NULL,
        AccountID       int            NULL,
        CommissionRate  decimal(5,2)   NOT NULL DEFAULT 0,
        DefaultDeliveryCost decimal(18,2) NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_DeliveryCompanies_Groups FOREIGN KEY (DeliveryGroupID)
            REFERENCES DeliveryCompanyGroups (DeliveryGroupID),
        CONSTRAINT FK_DeliveryCompanies_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID)
    );
END
GO

-- =============================================
-- Table: InstallmentCompanies - شركات التقسيط
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'InstallmentCompanies')
BEGIN
    CREATE TABLE InstallmentCompanies (
        InstallmentCompanyID int       NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        Phone           nvarchar(20)   NULL,
        Email           nvarchar(255)  NULL,
        Address         nvarchar(500)  NULL,
        AccountID       int            NULL,
        CommissionRate  decimal(5,2)   NOT NULL DEFAULT 0,
        MaxInstallments int            NOT NULL DEFAULT 12,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_InstallmentCompanies_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID)
    );
END
GO

-- =============================================
-- Table: TechCompanies - الشركات التقنية
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TechCompanies')
BEGIN
    CREATE TABLE TechCompanies (
        TechCompanyID   int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        ServiceType     nvarchar(100)  NULL, -- Payment Gateway, E-Invoice, etc.
        Phone           nvarchar(20)   NULL,
        Email           nvarchar(255)  NULL,
        Address         nvarchar(500)  NULL,
        AccountID       int            NULL,
        APIKey          nvarchar(500)  NULL,
        APISecret       nvarchar(500)  NULL,
        WebhookURL      nvarchar(500)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_TechCompanies_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID)
    );
END
GO

-- =============================================
-- SECTION 9: PRODUCTS & INVENTORY - المنتجات والمخزون
-- =============================================

-- =============================================
-- Table: ProductGroups - مجموعات المنتجات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ProductGroups')
BEGIN
    CREATE TABLE ProductGroups (
        ProductGroupID  int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        ParentID        int            NULL,
        ImageURL        nvarchar(500)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_ProductGroups_Parent FOREIGN KEY (ParentID)
            REFERENCES ProductGroups (ProductGroupID)
    );
END
GO

-- =============================================
-- Table: Units - وحدات القياس
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Units')
BEGIN
    CREATE TABLE Units (
        UnitID          int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(50)   NOT NULL,
        NameEn          nvarchar(50)   NULL,
        IsActive        bit            NOT NULL DEFAULT 1
    );
END
GO

-- =============================================
-- Table: Items - الأصناف والمنتجات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Items')
BEGIN
    CREATE TABLE Items (
        ItemID          int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(50)   NOT NULL UNIQUE,
        Barcode         nvarchar(50)   NULL,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        Description     nvarchar(1000) NULL,
        ItemType        nvarchar(50)   NOT NULL DEFAULT 'Product', -- Product, Service, Combo
        ProductGroupID  int            NULL,
        UnitID          int            NULL,
        PurchasePrice   decimal(18,2)  NOT NULL DEFAULT 0,
        SalePrice       decimal(18,2)  NOT NULL DEFAULT 0,
        MinPrice        decimal(18,2)  NOT NULL DEFAULT 0,
        WholesalePrice  decimal(18,2)  NOT NULL DEFAULT 0,
        CostPrice       decimal(18,2)  NOT NULL DEFAULT 0,
        TaxRate         decimal(5,2)   NOT NULL DEFAULT 15, -- VAT 15%
        DiscountRate    decimal(5,2)   NOT NULL DEFAULT 0,
        MinQuantity     int            NOT NULL DEFAULT 0,
        MaxQuantity     int            NOT NULL DEFAULT 0,
        ReorderLevel    int            NOT NULL DEFAULT 0,
        AccountID       int            NULL, -- Sales Account
        PurchaseAccountID int          NULL,
        ImageURL        nvarchar(500)  NULL,
        HasExpiry       bit            NOT NULL DEFAULT 0,
        HasSerial       bit            NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Items_Groups FOREIGN KEY (ProductGroupID)
            REFERENCES ProductGroups (ProductGroupID),
        CONSTRAINT FK_Items_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID),
        CONSTRAINT FK_Items_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID),
        CONSTRAINT FK_Items_PurchaseAccounts FOREIGN KEY (PurchaseAccountID)
            REFERENCES Accounts (AccountID)
    );
END
GO

-- =============================================
-- Table: ItemUnits - وحدات الصنف
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ItemUnits')
BEGIN
    CREATE TABLE ItemUnits (
        ItemUnitID      int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        ItemID          int            NOT NULL,
        UnitID          int            NOT NULL,
        ConversionRate  decimal(18,4)  NOT NULL DEFAULT 1,
        Barcode         nvarchar(50)   NULL,
        SalePrice       decimal(18,2)  NOT NULL DEFAULT 0,
        PurchasePrice   decimal(18,2)  NOT NULL DEFAULT 0,
        IsDefault       bit            NOT NULL DEFAULT 0,
        CONSTRAINT FK_ItemUnits_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_ItemUnits_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID)
    );
END
GO

-- =============================================
-- Table: WarehouseGroups - مجموعات المخازن
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'WarehouseGroups')
BEGIN
    CREATE TABLE WarehouseGroups (
        WarehouseGroupID int           NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: Warehouses - المخازن ونقاط البيع
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Warehouses')
BEGIN
    CREATE TABLE Warehouses (
        WarehouseID     int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        WarehouseType   nvarchar(50)   NOT NULL DEFAULT 'Warehouse', -- Warehouse, POS
        WarehouseGroupID int           NULL,
        BranchID        int            NULL,
        Address         nvarchar(500)  NULL,
        ResponsibleUser int            NULL,
        IsDefault       bit            NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Warehouses_Groups FOREIGN KEY (WarehouseGroupID)
            REFERENCES WarehouseGroups (WarehouseGroupID),
        CONSTRAINT FK_Warehouses_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_Warehouses_Users FOREIGN KEY (ResponsibleUser)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: ItemStock - رصيد المخزون
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ItemStock')
BEGIN
    CREATE TABLE ItemStock (
        ItemStockID     int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        ItemID          int            NOT NULL,
        WarehouseID     int            NOT NULL,
        Quantity        decimal(18,2)  NOT NULL DEFAULT 0,
        ReservedQty     decimal(18,2)  NOT NULL DEFAULT 0,
        AvailableQty    AS (Quantity - ReservedQty),
        LastUpdated     datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_ItemStock_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_ItemStock_Warehouses FOREIGN KEY (WarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT UQ_ItemStock UNIQUE (ItemID, WarehouseID)
    );
END
GO

-- =============================================
-- SECTION 10: JOURNAL ENTRIES - القيود اليومية
-- =============================================

-- =============================================
-- Table: FiscalYears - السنوات المالية
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'FiscalYears')
BEGIN
    CREATE TABLE FiscalYears (
        FiscalYearID    int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Name            nvarchar(100)  NOT NULL,
        StartDate       date           NOT NULL,
        EndDate         date           NOT NULL,
        IsClosed        bit            NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: JournalEntries - قيود اليومية
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'JournalEntries')
BEGIN
    CREATE TABLE JournalEntries (
        JournalEntryID  int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        EntryNumber     nvarchar(50)   NOT NULL UNIQUE,
        EntryDate       date           NOT NULL,
        EntryType       nvarchar(50)   NOT NULL DEFAULT 'Manual', -- Manual, Auto, Opening, Recurring, Reversing
        Description     nvarchar(500)  NULL,
        Reference       nvarchar(100)  NULL,
        TotalDebit      decimal(18,2)  NOT NULL DEFAULT 0,
        TotalCredit     decimal(18,2)  NOT NULL DEFAULT 0,
        FiscalYearID    int            NULL,
        BranchID        int            NULL,
        CostCenterID    int            NULL,
        ProjectID       int            NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft', -- Draft, Posted, Cancelled
        IsReversed      bit            NOT NULL DEFAULT 0,
        ReversedEntryID int            NULL,
        RecurringConfig nvarchar(MAX)  NULL, -- JSON for recurring settings
        CreatedBy       int            NULL,
        PostedBy        int            NULL,
        PostedAt        datetime2      NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_JournalEntries_FiscalYears FOREIGN KEY (FiscalYearID)
            REFERENCES FiscalYears (FiscalYearID),
        CONSTRAINT FK_JournalEntries_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_JournalEntries_CostCenters FOREIGN KEY (CostCenterID)
            REFERENCES CostCenters (CostCenterID),
        CONSTRAINT FK_JournalEntries_Projects FOREIGN KEY (ProjectID)
            REFERENCES Projects (ProjectID),
        CONSTRAINT FK_JournalEntries_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID),
        CONSTRAINT FK_JournalEntries_PostedBy FOREIGN KEY (PostedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: JournalEntryDetails - تفاصيل القيود
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'JournalEntryDetails')
BEGIN
    CREATE TABLE JournalEntryDetails (
        JournalDetailID int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        JournalEntryID  int            NOT NULL,
        AccountID       int            NOT NULL,
        Debit           decimal(18,2)  NOT NULL DEFAULT 0,
        Credit          decimal(18,2)  NOT NULL DEFAULT 0,
        Description     nvarchar(500)  NULL,
        CostCenterID    int            NULL,
        ProjectID       int            NULL,
        CONSTRAINT FK_JournalDetails_Entries FOREIGN KEY (JournalEntryID)
            REFERENCES JournalEntries (JournalEntryID),
        CONSTRAINT FK_JournalDetails_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID),
        CONSTRAINT FK_JournalDetails_CostCenters FOREIGN KEY (CostCenterID)
            REFERENCES CostCenters (CostCenterID),
        CONSTRAINT FK_JournalDetails_Projects FOREIGN KEY (ProjectID)
            REFERENCES Projects (ProjectID)
    );
END
GO

-- =============================================
-- SECTION 11: VOUCHERS - السندات المالية
-- =============================================

-- =============================================
-- Table: ReceiptVouchers - سندات القبض/التحصيل
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ReceiptVouchers')
BEGIN
    CREATE TABLE ReceiptVouchers (
        ReceiptVoucherID int           NOT NULL IDENTITY(1,1) PRIMARY KEY,
        VoucherNumber   nvarchar(50)   NOT NULL UNIQUE,
        VoucherDate     date           NOT NULL,
        PaymentMethod   nvarchar(50)   NOT NULL DEFAULT 'Cash', -- Cash, Bank, Check, Card
        Amount          decimal(18,2)  NOT NULL,
        CustomerID      int            NULL,
        PartnerID       int            NULL,
        EmployeeID      int            NULL,
        CashBoxID       int            NULL,
        BankID          int            NULL,
        CheckNumber     nvarchar(50)   NULL,
        CheckDate       date           NULL,
        Description     nvarchar(500)  NULL,
        Reference       nvarchar(100)  NULL,
        AccountID       int            NOT NULL,
        JournalEntryID  int            NULL,
        BranchID        int            NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft',
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_ReceiptVouchers_Customers FOREIGN KEY (CustomerID)
            REFERENCES Customers (CustomerID),
        CONSTRAINT FK_ReceiptVouchers_Partners FOREIGN KEY (PartnerID)
            REFERENCES Partners (PartnerID),
        CONSTRAINT FK_ReceiptVouchers_Employees FOREIGN KEY (EmployeeID)
            REFERENCES Employees (EmployeeID),
        CONSTRAINT FK_ReceiptVouchers_CashBoxes FOREIGN KEY (CashBoxID)
            REFERENCES CashBoxes (CashBoxID),
        CONSTRAINT FK_ReceiptVouchers_Banks FOREIGN KEY (BankID)
            REFERENCES Banks (BankID),
        CONSTRAINT FK_ReceiptVouchers_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID),
        CONSTRAINT FK_ReceiptVouchers_JournalEntries FOREIGN KEY (JournalEntryID)
            REFERENCES JournalEntries (JournalEntryID),
        CONSTRAINT FK_ReceiptVouchers_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_ReceiptVouchers_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: PaymentVouchers - سندات الصرف/السداد
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PaymentVouchers')
BEGIN
    CREATE TABLE PaymentVouchers (
        PaymentVoucherID int           NOT NULL IDENTITY(1,1) PRIMARY KEY,
        VoucherNumber   nvarchar(50)   NOT NULL UNIQUE,
        VoucherDate     date           NOT NULL,
        PaymentMethod   nvarchar(50)   NOT NULL DEFAULT 'Cash',
        Amount          decimal(18,2)  NOT NULL,
        SupplierID      int            NULL,
        PartnerID       int            NULL,
        EmployeeID      int            NULL,
        ExpenseTypeID   int            NULL,
        CashBoxID       int            NULL,
        BankID          int            NULL,
        CheckNumber     nvarchar(50)   NULL,
        CheckDate       date           NULL,
        Description     nvarchar(500)  NULL,
        Reference       nvarchar(100)  NULL,
        AccountID       int            NOT NULL,
        JournalEntryID  int            NULL,
        BranchID        int            NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft',
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_PaymentVouchers_Suppliers FOREIGN KEY (SupplierID)
            REFERENCES Suppliers (SupplierID),
        CONSTRAINT FK_PaymentVouchers_Partners FOREIGN KEY (PartnerID)
            REFERENCES Partners (PartnerID),
        CONSTRAINT FK_PaymentVouchers_Employees FOREIGN KEY (EmployeeID)
            REFERENCES Employees (EmployeeID),
        CONSTRAINT FK_PaymentVouchers_ExpenseTypes FOREIGN KEY (ExpenseTypeID)
            REFERENCES ExpenseTypes (ExpenseTypeID),
        CONSTRAINT FK_PaymentVouchers_CashBoxes FOREIGN KEY (CashBoxID)
            REFERENCES CashBoxes (CashBoxID),
        CONSTRAINT FK_PaymentVouchers_Banks FOREIGN KEY (BankID)
            REFERENCES Banks (BankID),
        CONSTRAINT FK_PaymentVouchers_Accounts FOREIGN KEY (AccountID)
            REFERENCES Accounts (AccountID),
        CONSTRAINT FK_PaymentVouchers_JournalEntries FOREIGN KEY (JournalEntryID)
            REFERENCES JournalEntries (JournalEntryID),
        CONSTRAINT FK_PaymentVouchers_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_PaymentVouchers_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- SECTION 12: SALES - المبيعات
-- =============================================

-- =============================================
-- Table: OrderTypes - أنواع الطلبات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OrderTypes')
BEGIN
    CREATE TABLE OrderTypes (
        OrderTypeID     int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1
    );
END
GO

-- =============================================
-- Table: SalesInvoices - فواتير المبيعات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SalesInvoices')
BEGIN
    CREATE TABLE SalesInvoices (
        SalesInvoiceID  int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        InvoiceNumber   nvarchar(50)   NOT NULL UNIQUE,
        InvoiceDate     datetime2      NOT NULL DEFAULT GETDATE(),
        InvoiceType     nvarchar(50)   NOT NULL DEFAULT 'Sales', -- Sales, Cashier, TouchPOS, SelfService
        CustomerID      int            NULL,
        OrderTypeID     int            NULL,
        WarehouseID     int            NOT NULL,
        BranchID        int            NULL,
        EmployeeID      int            NULL,
        CostCenterID    int            NULL,
        ProjectID       int            NULL,
        Subtotal        decimal(18,2)  NOT NULL DEFAULT 0,
        DiscountType    nvarchar(20)   NULL DEFAULT 'Amount', -- Amount, Percentage
        DiscountValue   decimal(18,2)  NOT NULL DEFAULT 0,
        DiscountAmount  decimal(18,2)  NOT NULL DEFAULT 0,
        TaxAmount       decimal(18,2)  NOT NULL DEFAULT 0,
        ShippingAmount  decimal(18,2)  NOT NULL DEFAULT 0,
        Total           decimal(18,2)  NOT NULL DEFAULT 0,
        PaidAmount      decimal(18,2)  NOT NULL DEFAULT 0,
        DueAmount       AS (Total - PaidAmount),
        PaymentStatus   nvarchar(50)   NOT NULL DEFAULT 'Unpaid', -- Paid, Unpaid, Partial
        PaymentMethod   nvarchar(50)   NULL,
        DeliveryStatus  nvarchar(50)   NULL DEFAULT 'Pending',
        DeliveryCompanyID int          NULL,
        ShippingCompanyID int          NULL,
        InstallmentCompanyID int       NULL,
        Notes           nvarchar(1000) NULL,
        InternalNotes   nvarchar(1000) NULL,
        Reference       nvarchar(100)  NULL,
        QRCode          nvarchar(500)  NULL, -- ZATCA QR
        UUID            nvarchar(100)  NULL, -- ZATCA UUID
        JournalEntryID  int            NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft',
        IsReturned      bit            NOT NULL DEFAULT 0,
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_SalesInvoices_Customers FOREIGN KEY (CustomerID)
            REFERENCES Customers (CustomerID),
        CONSTRAINT FK_SalesInvoices_OrderTypes FOREIGN KEY (OrderTypeID)
            REFERENCES OrderTypes (OrderTypeID),
        CONSTRAINT FK_SalesInvoices_Warehouses FOREIGN KEY (WarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT FK_SalesInvoices_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_SalesInvoices_Employees FOREIGN KEY (EmployeeID)
            REFERENCES Employees (EmployeeID),
        CONSTRAINT FK_SalesInvoices_CostCenters FOREIGN KEY (CostCenterID)
            REFERENCES CostCenters (CostCenterID),
        CONSTRAINT FK_SalesInvoices_Projects FOREIGN KEY (ProjectID)
            REFERENCES Projects (ProjectID),
        CONSTRAINT FK_SalesInvoices_DeliveryCompanies FOREIGN KEY (DeliveryCompanyID)
            REFERENCES DeliveryCompanies (DeliveryCompanyID),
        CONSTRAINT FK_SalesInvoices_ShippingCompanies FOREIGN KEY (ShippingCompanyID)
            REFERENCES ShippingCompanies (ShippingCompanyID),
        CONSTRAINT FK_SalesInvoices_InstallmentCompanies FOREIGN KEY (InstallmentCompanyID)
            REFERENCES InstallmentCompanies (InstallmentCompanyID),
        CONSTRAINT FK_SalesInvoices_JournalEntries FOREIGN KEY (JournalEntryID)
            REFERENCES JournalEntries (JournalEntryID),
        CONSTRAINT FK_SalesInvoices_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: SalesInvoiceDetails - تفاصيل فواتير المبيعات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SalesInvoiceDetails')
BEGIN
    CREATE TABLE SalesInvoiceDetails (
        SalesDetailID   int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        SalesInvoiceID  int            NOT NULL,
        ItemID          int            NOT NULL,
        UnitID          int            NULL,
        Quantity        decimal(18,2)  NOT NULL DEFAULT 1,
        UnitPrice       decimal(18,2)  NOT NULL DEFAULT 0,
        DiscountType    nvarchar(20)   NULL,
        DiscountValue   decimal(18,2)  NOT NULL DEFAULT 0,
        DiscountAmount  decimal(18,2)  NOT NULL DEFAULT 0,
        TaxRate         decimal(5,2)   NOT NULL DEFAULT 15,
        TaxAmount       decimal(18,2)  NOT NULL DEFAULT 0,
        Total           decimal(18,2)  NOT NULL DEFAULT 0,
        CostPrice       decimal(18,2)  NOT NULL DEFAULT 0,
        Notes           nvarchar(500)  NULL,
        CONSTRAINT FK_SalesDetails_Invoices FOREIGN KEY (SalesInvoiceID)
            REFERENCES SalesInvoices (SalesInvoiceID),
        CONSTRAINT FK_SalesDetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_SalesDetails_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID)
    );
END
GO

-- =============================================
-- Table: SalesReturns - مرتجعات المبيعات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SalesReturns')
BEGIN
    CREATE TABLE SalesReturns (
        SalesReturnID   int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        ReturnNumber    nvarchar(50)   NOT NULL UNIQUE,
        ReturnDate      datetime2      NOT NULL DEFAULT GETDATE(),
        ReturnType      nvarchar(50)   NOT NULL DEFAULT 'Return', -- Return, CashierReturn, TouchReturn
        OriginalInvoiceID int          NULL,
        CustomerID      int            NULL,
        WarehouseID     int            NOT NULL,
        BranchID        int            NULL,
        Subtotal        decimal(18,2)  NOT NULL DEFAULT 0,
        TaxAmount       decimal(18,2)  NOT NULL DEFAULT 0,
        Total           decimal(18,2)  NOT NULL DEFAULT 0,
        RefundMethod    nvarchar(50)   NULL,
        Reason          nvarchar(500)  NULL,
        JournalEntryID  int            NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft',
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_SalesReturns_OriginalInvoice FOREIGN KEY (OriginalInvoiceID)
            REFERENCES SalesInvoices (SalesInvoiceID),
        CONSTRAINT FK_SalesReturns_Customers FOREIGN KEY (CustomerID)
            REFERENCES Customers (CustomerID),
        CONSTRAINT FK_SalesReturns_Warehouses FOREIGN KEY (WarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT FK_SalesReturns_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_SalesReturns_JournalEntries FOREIGN KEY (JournalEntryID)
            REFERENCES JournalEntries (JournalEntryID),
        CONSTRAINT FK_SalesReturns_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: SalesReturnDetails - تفاصيل مرتجعات المبيعات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SalesReturnDetails')
BEGIN
    CREATE TABLE SalesReturnDetails (
        ReturnDetailID  int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        SalesReturnID   int            NOT NULL,
        ItemID          int            NOT NULL,
        UnitID          int            NULL,
        Quantity        decimal(18,2)  NOT NULL DEFAULT 1,
        UnitPrice       decimal(18,2)  NOT NULL DEFAULT 0,
        TaxRate         decimal(5,2)   NOT NULL DEFAULT 15,
        TaxAmount       decimal(18,2)  NOT NULL DEFAULT 0,
        Total           decimal(18,2)  NOT NULL DEFAULT 0,
        Reason          nvarchar(500)  NULL,
        CONSTRAINT FK_ReturnDetails_Returns FOREIGN KEY (SalesReturnID)
            REFERENCES SalesReturns (SalesReturnID),
        CONSTRAINT FK_ReturnDetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_ReturnDetails_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID)
    );
END
GO

-- =============================================
-- Table: Quotations - عروض الأسعار
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Quotations')
BEGIN
    CREATE TABLE Quotations (
        QuotationID     int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        QuotationNumber nvarchar(50)   NOT NULL UNIQUE,
        QuotationDate   datetime2      NOT NULL DEFAULT GETDATE(),
        QuotationType   nvarchar(50)   NOT NULL DEFAULT 'Standard', -- Standard, Advanced, Cashier
        ValidUntil      date           NULL,
        CustomerID      int            NULL,
        BranchID        int            NULL,
        EmployeeID      int            NULL,
        Subtotal        decimal(18,2)  NOT NULL DEFAULT 0,
        DiscountAmount  decimal(18,2)  NOT NULL DEFAULT 0,
        TaxAmount       decimal(18,2)  NOT NULL DEFAULT 0,
        Total           decimal(18,2)  NOT NULL DEFAULT 0,
        Terms           nvarchar(2000) NULL,
        Notes           nvarchar(1000) NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft', -- Draft, Sent, Accepted, Rejected, Converted
        ConvertedToInvoiceID int       NULL,
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Quotations_Customers FOREIGN KEY (CustomerID)
            REFERENCES Customers (CustomerID),
        CONSTRAINT FK_Quotations_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_Quotations_Employees FOREIGN KEY (EmployeeID)
            REFERENCES Employees (EmployeeID),
        CONSTRAINT FK_Quotations_Invoices FOREIGN KEY (ConvertedToInvoiceID)
            REFERENCES SalesInvoices (SalesInvoiceID),
        CONSTRAINT FK_Quotations_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: QuotationDetails - تفاصيل عروض الأسعار
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'QuotationDetails')
BEGIN
    CREATE TABLE QuotationDetails (
        QuotationDetailID int          NOT NULL IDENTITY(1,1) PRIMARY KEY,
        QuotationID     int            NOT NULL,
        ItemID          int            NOT NULL,
        UnitID          int            NULL,
        Quantity        decimal(18,2)  NOT NULL DEFAULT 1,
        UnitPrice       decimal(18,2)  NOT NULL DEFAULT 0,
        DiscountAmount  decimal(18,2)  NOT NULL DEFAULT 0,
        TaxRate         decimal(5,2)   NOT NULL DEFAULT 15,
        TaxAmount       decimal(18,2)  NOT NULL DEFAULT 0,
        Total           decimal(18,2)  NOT NULL DEFAULT 0,
        Notes           nvarchar(500)  NULL,
        CONSTRAINT FK_QuotationDetails_Quotations FOREIGN KEY (QuotationID)
            REFERENCES Quotations (QuotationID),
        CONSTRAINT FK_QuotationDetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_QuotationDetails_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID)
    );
END
GO

-- =============================================
-- SECTION 13: PURCHASES - المشتريات
-- =============================================

-- =============================================
-- Table: PurchaseOrders - طلبات الشراء
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PurchaseOrders')
BEGIN
    CREATE TABLE PurchaseOrders (
        PurchaseOrderID int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        OrderNumber     nvarchar(50)   NOT NULL UNIQUE,
        OrderDate       datetime2      NOT NULL DEFAULT GETDATE(),
        ExpectedDate    date           NULL,
        SupplierID      int            NOT NULL,
        WarehouseID     int            NOT NULL,
        BranchID        int            NULL,
        Subtotal        decimal(18,2)  NOT NULL DEFAULT 0,
        DiscountAmount  decimal(18,2)  NOT NULL DEFAULT 0,
        TaxAmount       decimal(18,2)  NOT NULL DEFAULT 0,
        ShippingAmount  decimal(18,2)  NOT NULL DEFAULT 0,
        Total           decimal(18,2)  NOT NULL DEFAULT 0,
        Terms           nvarchar(2000) NULL,
        Notes           nvarchar(1000) NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft', -- Draft, Sent, Partial, Completed, Cancelled
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_PurchaseOrders_Suppliers FOREIGN KEY (SupplierID)
            REFERENCES Suppliers (SupplierID),
        CONSTRAINT FK_PurchaseOrders_Warehouses FOREIGN KEY (WarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT FK_PurchaseOrders_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_PurchaseOrders_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: PurchaseOrderDetails - تفاصيل طلبات الشراء
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PurchaseOrderDetails')
BEGIN
    CREATE TABLE PurchaseOrderDetails (
        PODetailID      int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        PurchaseOrderID int            NOT NULL,
        ItemID          int            NOT NULL,
        UnitID          int            NULL,
        Quantity        decimal(18,2)  NOT NULL DEFAULT 1,
        ReceivedQty     decimal(18,2)  NOT NULL DEFAULT 0,
        UnitPrice       decimal(18,2)  NOT NULL DEFAULT 0,
        TaxRate         decimal(5,2)   NOT NULL DEFAULT 15,
        TaxAmount       decimal(18,2)  NOT NULL DEFAULT 0,
        Total           decimal(18,2)  NOT NULL DEFAULT 0,
        CONSTRAINT FK_PODetails_Orders FOREIGN KEY (PurchaseOrderID)
            REFERENCES PurchaseOrders (PurchaseOrderID),
        CONSTRAINT FK_PODetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_PODetails_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID)
    );
END
GO

-- =============================================
-- Table: PurchaseInvoices - فواتير المشتريات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PurchaseInvoices')
BEGIN
    CREATE TABLE PurchaseInvoices (
        PurchaseInvoiceID int          NOT NULL IDENTITY(1,1) PRIMARY KEY,
        InvoiceNumber   nvarchar(50)   NOT NULL UNIQUE,
        SupplierInvoiceNo nvarchar(100) NULL,
        InvoiceDate     datetime2      NOT NULL DEFAULT GETDATE(),
        InvoiceType     nvarchar(50)   NOT NULL DEFAULT 'Purchase', -- Purchase, Cashier, Mobile, External
        SupplierID      int            NOT NULL,
        WarehouseID     int            NOT NULL,
        BranchID        int            NULL,
        PurchaseOrderID int            NULL,
        CostCenterID    int            NULL,
        ProjectID       int            NULL,
        Subtotal        decimal(18,2)  NOT NULL DEFAULT 0,
        DiscountAmount  decimal(18,2)  NOT NULL DEFAULT 0,
        TaxAmount       decimal(18,2)  NOT NULL DEFAULT 0,
        ShippingAmount  decimal(18,2)  NOT NULL DEFAULT 0,
        OtherCosts      decimal(18,2)  NOT NULL DEFAULT 0,
        Total           decimal(18,2)  NOT NULL DEFAULT 0,
        PaidAmount      decimal(18,2)  NOT NULL DEFAULT 0,
        DueAmount       AS (Total - PaidAmount),
        PaymentStatus   nvarchar(50)   NOT NULL DEFAULT 'Unpaid',
        PaymentTerms    int            NOT NULL DEFAULT 0,
        DueDate         date           NULL,
        Notes           nvarchar(1000) NULL,
        JournalEntryID  int            NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft',
        IsReturned      bit            NOT NULL DEFAULT 0,
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_PurchaseInvoices_Suppliers FOREIGN KEY (SupplierID)
            REFERENCES Suppliers (SupplierID),
        CONSTRAINT FK_PurchaseInvoices_Warehouses FOREIGN KEY (WarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT FK_PurchaseInvoices_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_PurchaseInvoices_PurchaseOrders FOREIGN KEY (PurchaseOrderID)
            REFERENCES PurchaseOrders (PurchaseOrderID),
        CONSTRAINT FK_PurchaseInvoices_CostCenters FOREIGN KEY (CostCenterID)
            REFERENCES CostCenters (CostCenterID),
        CONSTRAINT FK_PurchaseInvoices_Projects FOREIGN KEY (ProjectID)
            REFERENCES Projects (ProjectID),
        CONSTRAINT FK_PurchaseInvoices_JournalEntries FOREIGN KEY (JournalEntryID)
            REFERENCES JournalEntries (JournalEntryID),
        CONSTRAINT FK_PurchaseInvoices_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: PurchaseInvoiceDetails - تفاصيل فواتير المشتريات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PurchaseInvoiceDetails')
BEGIN
    CREATE TABLE PurchaseInvoiceDetails (
        PurchaseDetailID int           NOT NULL IDENTITY(1,1) PRIMARY KEY,
        PurchaseInvoiceID int          NOT NULL,
        ItemID          int            NOT NULL,
        UnitID          int            NULL,
        Quantity        decimal(18,2)  NOT NULL DEFAULT 1,
        UnitPrice       decimal(18,2)  NOT NULL DEFAULT 0,
        DiscountAmount  decimal(18,2)  NOT NULL DEFAULT 0,
        TaxRate         decimal(5,2)   NOT NULL DEFAULT 15,
        TaxAmount       decimal(18,2)  NOT NULL DEFAULT 0,
        Total           decimal(18,2)  NOT NULL DEFAULT 0,
        ExpiryDate      date           NULL,
        BatchNo         nvarchar(50)   NULL,
        Notes           nvarchar(500)  NULL,
        CONSTRAINT FK_PurchaseDetails_Invoices FOREIGN KEY (PurchaseInvoiceID)
            REFERENCES PurchaseInvoices (PurchaseInvoiceID),
        CONSTRAINT FK_PurchaseDetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_PurchaseDetails_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID)
    );
END
GO

-- =============================================
-- Table: PurchaseReturns - مرتجعات المشتريات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PurchaseReturns')
BEGIN
    CREATE TABLE PurchaseReturns (
        PurchaseReturnID int           NOT NULL IDENTITY(1,1) PRIMARY KEY,
        ReturnNumber    nvarchar(50)   NOT NULL UNIQUE,
        ReturnDate      datetime2      NOT NULL DEFAULT GETDATE(),
        ReturnType      nvarchar(50)   NOT NULL DEFAULT 'Return', -- Return, CashierReturn, External
        OriginalInvoiceID int          NULL,
        SupplierID      int            NOT NULL,
        WarehouseID     int            NOT NULL,
        BranchID        int            NULL,
        Subtotal        decimal(18,2)  NOT NULL DEFAULT 0,
        TaxAmount       decimal(18,2)  NOT NULL DEFAULT 0,
        Total           decimal(18,2)  NOT NULL DEFAULT 0,
        Reason          nvarchar(500)  NULL,
        JournalEntryID  int            NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft',
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_PurchaseReturns_OriginalInvoice FOREIGN KEY (OriginalInvoiceID)
            REFERENCES PurchaseInvoices (PurchaseInvoiceID),
        CONSTRAINT FK_PurchaseReturns_Suppliers FOREIGN KEY (SupplierID)
            REFERENCES Suppliers (SupplierID),
        CONSTRAINT FK_PurchaseReturns_Warehouses FOREIGN KEY (WarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT FK_PurchaseReturns_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_PurchaseReturns_JournalEntries FOREIGN KEY (JournalEntryID)
            REFERENCES JournalEntries (JournalEntryID),
        CONSTRAINT FK_PurchaseReturns_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: PurchaseReturnDetails - تفاصيل مرتجعات المشتريات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PurchaseReturnDetails')
BEGIN
    CREATE TABLE PurchaseReturnDetails (
        PRDetailID      int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        PurchaseReturnID int           NOT NULL,
        ItemID          int            NOT NULL,
        UnitID          int            NULL,
        Quantity        decimal(18,2)  NOT NULL DEFAULT 1,
        UnitPrice       decimal(18,2)  NOT NULL DEFAULT 0,
        TaxRate         decimal(5,2)   NOT NULL DEFAULT 15,
        TaxAmount       decimal(18,2)  NOT NULL DEFAULT 0,
        Total           decimal(18,2)  NOT NULL DEFAULT 0,
        Reason          nvarchar(500)  NULL,
        CONSTRAINT FK_PRDetails_Returns FOREIGN KEY (PurchaseReturnID)
            REFERENCES PurchaseReturns (PurchaseReturnID),
        CONSTRAINT FK_PRDetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_PRDetails_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID)
    );
END
GO

-- =============================================
-- SECTION 14: INVENTORY MANAGEMENT - إدارة المخزون
-- =============================================

-- =============================================
-- Table: OpeningStock - مخزون أول المدة
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OpeningStock')
BEGIN
    CREATE TABLE OpeningStock (
        OpeningStockID  int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        DocumentNumber  nvarchar(50)   NOT NULL UNIQUE,
        DocumentDate    date           NOT NULL,
        WarehouseID     int            NOT NULL,
        BranchID        int            NULL,
        FiscalYearID    int            NULL,
        Notes           nvarchar(500)  NULL,
        TotalValue      decimal(18,2)  NOT NULL DEFAULT 0,
        JournalEntryID  int            NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft',
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_OpeningStock_Warehouses FOREIGN KEY (WarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT FK_OpeningStock_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_OpeningStock_FiscalYears FOREIGN KEY (FiscalYearID)
            REFERENCES FiscalYears (FiscalYearID),
        CONSTRAINT FK_OpeningStock_JournalEntries FOREIGN KEY (JournalEntryID)
            REFERENCES JournalEntries (JournalEntryID),
        CONSTRAINT FK_OpeningStock_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: OpeningStockDetails - تفاصيل مخزون أول المدة
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OpeningStockDetails')
BEGIN
    CREATE TABLE OpeningStockDetails (
        OpeningDetailID int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        OpeningStockID  int            NOT NULL,
        ItemID          int            NOT NULL,
        UnitID          int            NULL,
        Quantity        decimal(18,2)  NOT NULL DEFAULT 0,
        UnitCost        decimal(18,2)  NOT NULL DEFAULT 0,
        TotalValue      decimal(18,2)  NOT NULL DEFAULT 0,
        ExpiryDate      date           NULL,
        BatchNo         nvarchar(50)   NULL,
        CONSTRAINT FK_OpeningDetails_Opening FOREIGN KEY (OpeningStockID)
            REFERENCES OpeningStock (OpeningStockID),
        CONSTRAINT FK_OpeningDetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_OpeningDetails_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID)
    );
END
GO

-- =============================================
-- Table: StockCount - جرد المخزون
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StockCount')
BEGIN
    CREATE TABLE StockCount (
        StockCountID    int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        CountNumber     nvarchar(50)   NOT NULL UNIQUE,
        CountDate       datetime2      NOT NULL DEFAULT GETDATE(),
        CountType       nvarchar(50)   NOT NULL DEFAULT 'Full', -- Full, Partial, Mobile
        WarehouseID     int            NOT NULL,
        BranchID        int            NULL,
        Notes           nvarchar(500)  NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'InProgress', -- InProgress, Completed, Cancelled
        CompletedAt     datetime2      NULL,
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_StockCount_Warehouses FOREIGN KEY (WarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT FK_StockCount_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_StockCount_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: StockCountDetails - تفاصيل الجرد
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StockCountDetails')
BEGIN
    CREATE TABLE StockCountDetails (
        CountDetailID   int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        StockCountID    int            NOT NULL,
        ItemID          int            NOT NULL,
        SystemQty       decimal(18,2)  NOT NULL DEFAULT 0,
        CountedQty      decimal(18,2)  NOT NULL DEFAULT 0,
        Variance        AS (CountedQty - SystemQty),
        UnitCost        decimal(18,2)  NOT NULL DEFAULT 0,
        Notes           nvarchar(500)  NULL,
        CONSTRAINT FK_CountDetails_StockCount FOREIGN KEY (StockCountID)
            REFERENCES StockCount (StockCountID),
        CONSTRAINT FK_CountDetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID)
    );
END
GO

-- =============================================
-- Table: StockAdjustments - تصحيح الكميات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StockAdjustments')
BEGIN
    CREATE TABLE StockAdjustments (
        AdjustmentID    int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        AdjustmentNumber nvarchar(50)  NOT NULL UNIQUE,
        AdjustmentDate  datetime2      NOT NULL DEFAULT GETDATE(),
        AdjustmentType  nvarchar(50)   NOT NULL, -- Increase, Decrease, Damage, Expired
        WarehouseID     int            NOT NULL,
        BranchID        int            NULL,
        StockCountID    int            NULL,
        Reason          nvarchar(500)  NULL,
        TotalValue      decimal(18,2)  NOT NULL DEFAULT 0,
        JournalEntryID  int            NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft',
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Adjustments_Warehouses FOREIGN KEY (WarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT FK_Adjustments_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_Adjustments_StockCount FOREIGN KEY (StockCountID)
            REFERENCES StockCount (StockCountID),
        CONSTRAINT FK_Adjustments_JournalEntries FOREIGN KEY (JournalEntryID)
            REFERENCES JournalEntries (JournalEntryID),
        CONSTRAINT FK_Adjustments_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: StockAdjustmentDetails - تفاصيل تصحيح الكميات
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StockAdjustmentDetails')
BEGIN
    CREATE TABLE StockAdjustmentDetails (
        AdjustmentDetailID int         NOT NULL IDENTITY(1,1) PRIMARY KEY,
        AdjustmentID    int            NOT NULL,
        ItemID          int            NOT NULL,
        UnitID          int            NULL,
        Quantity        decimal(18,2)  NOT NULL DEFAULT 0,
        UnitCost        decimal(18,2)  NOT NULL DEFAULT 0,
        TotalValue      decimal(18,2)  NOT NULL DEFAULT 0,
        Reason          nvarchar(500)  NULL,
        CONSTRAINT FK_AdjustmentDetails_Adjustments FOREIGN KEY (AdjustmentID)
            REFERENCES StockAdjustments (AdjustmentID),
        CONSTRAINT FK_AdjustmentDetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_AdjustmentDetails_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID)
    );
END
GO

-- =============================================
-- Table: StockTransfers - نقل المخزون
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StockTransfers')
BEGIN
    CREATE TABLE StockTransfers (
        TransferID      int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        TransferNumber  nvarchar(50)   NOT NULL UNIQUE,
        TransferDate    datetime2      NOT NULL DEFAULT GETDATE(),
        FromWarehouseID int            NOT NULL,
        ToWarehouseID   int            NOT NULL,
        BranchID        int            NULL,
        Notes           nvarchar(500)  NULL,
        TotalValue      decimal(18,2)  NOT NULL DEFAULT 0,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft', -- Draft, Sent, Received, Cancelled
        SentAt          datetime2      NULL,
        ReceivedAt      datetime2      NULL,
        ReceivedBy      int            NULL,
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Transfers_FromWarehouse FOREIGN KEY (FromWarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT FK_Transfers_ToWarehouse FOREIGN KEY (ToWarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT FK_Transfers_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_Transfers_ReceivedBy FOREIGN KEY (ReceivedBy)
            REFERENCES Users (UserID),
        CONSTRAINT FK_Transfers_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: StockTransferDetails - تفاصيل نقل المخزون
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StockTransferDetails')
BEGIN
    CREATE TABLE StockTransferDetails (
        TransferDetailID int           NOT NULL IDENTITY(1,1) PRIMARY KEY,
        TransferID      int            NOT NULL,
        ItemID          int            NOT NULL,
        UnitID          int            NULL,
        Quantity        decimal(18,2)  NOT NULL DEFAULT 0,
        ReceivedQty     decimal(18,2)  NOT NULL DEFAULT 0,
        UnitCost        decimal(18,2)  NOT NULL DEFAULT 0,
        TotalValue      decimal(18,2)  NOT NULL DEFAULT 0,
        Notes           nvarchar(500)  NULL,
        CONSTRAINT FK_TransferDetails_Transfers FOREIGN KEY (TransferID)
            REFERENCES StockTransfers (TransferID),
        CONSTRAINT FK_TransferDetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_TransferDetails_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID)
    );
END
GO

-- =============================================
-- Table: StockIssue - صرف مخزني
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StockIssue')
BEGIN
    CREATE TABLE StockIssue (
        IssueID         int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        IssueNumber     nvarchar(50)   NOT NULL UNIQUE,
        IssueDate       datetime2      NOT NULL DEFAULT GETDATE(),
        IssueType       nvarchar(50)   NOT NULL DEFAULT 'Issue', -- Issue, TouchIssue
        WarehouseID     int            NOT NULL,
        BranchID        int            NULL,
        CostCenterID    int            NULL,
        ProjectID       int            NULL,
        EmployeeID      int            NULL,
        Purpose         nvarchar(500)  NULL,
        TotalValue      decimal(18,2)  NOT NULL DEFAULT 0,
        JournalEntryID  int            NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft',
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_StockIssue_Warehouses FOREIGN KEY (WarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT FK_StockIssue_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_StockIssue_CostCenters FOREIGN KEY (CostCenterID)
            REFERENCES CostCenters (CostCenterID),
        CONSTRAINT FK_StockIssue_Projects FOREIGN KEY (ProjectID)
            REFERENCES Projects (ProjectID),
        CONSTRAINT FK_StockIssue_Employees FOREIGN KEY (EmployeeID)
            REFERENCES Employees (EmployeeID),
        CONSTRAINT FK_StockIssue_JournalEntries FOREIGN KEY (JournalEntryID)
            REFERENCES JournalEntries (JournalEntryID),
        CONSTRAINT FK_StockIssue_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: StockIssueDetails - تفاصيل الصرف المخزني
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StockIssueDetails')
BEGIN
    CREATE TABLE StockIssueDetails (
        IssueDetailID   int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        IssueID         int            NOT NULL,
        ItemID          int            NOT NULL,
        UnitID          int            NULL,
        Quantity        decimal(18,2)  NOT NULL DEFAULT 0,
        UnitCost        decimal(18,2)  NOT NULL DEFAULT 0,
        TotalValue      decimal(18,2)  NOT NULL DEFAULT 0,
        Notes           nvarchar(500)  NULL,
        CONSTRAINT FK_IssueDetails_Issues FOREIGN KEY (IssueID)
            REFERENCES StockIssue (IssueID),
        CONSTRAINT FK_IssueDetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_IssueDetails_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID)
    );
END
GO

-- =============================================
-- Table: StockReceipt - توريد مخزني / استلام مخزون
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StockReceipt')
BEGIN
    CREATE TABLE StockReceipt (
        ReceiptID       int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        ReceiptNumber   nvarchar(50)   NOT NULL UNIQUE,
        ReceiptDate     datetime2      NOT NULL DEFAULT GETDATE(),
        ReceiptType     nvarchar(50)   NOT NULL DEFAULT 'Receipt', -- Receipt, Supply
        WarehouseID     int            NOT NULL,
        BranchID        int            NULL,
        SupplierID      int            NULL,
        Source          nvarchar(200)  NULL,
        TotalValue      decimal(18,2)  NOT NULL DEFAULT 0,
        JournalEntryID  int            NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft',
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_StockReceipt_Warehouses FOREIGN KEY (WarehouseID)
            REFERENCES Warehouses (WarehouseID),
        CONSTRAINT FK_StockReceipt_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_StockReceipt_Suppliers FOREIGN KEY (SupplierID)
            REFERENCES Suppliers (SupplierID),
        CONSTRAINT FK_StockReceipt_JournalEntries FOREIGN KEY (JournalEntryID)
            REFERENCES JournalEntries (JournalEntryID),
        CONSTRAINT FK_StockReceipt_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: StockReceiptDetails - تفاصيل التوريد/الاستلام
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'StockReceiptDetails')
BEGIN
    CREATE TABLE StockReceiptDetails (
        ReceiptDetailID int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        ReceiptID       int            NOT NULL,
        ItemID          int            NOT NULL,
        UnitID          int            NULL,
        Quantity        decimal(18,2)  NOT NULL DEFAULT 0,
        UnitCost        decimal(18,2)  NOT NULL DEFAULT 0,
        TotalValue      decimal(18,2)  NOT NULL DEFAULT 0,
        ExpiryDate      date           NULL,
        BatchNo         nvarchar(50)   NULL,
        Notes           nvarchar(500)  NULL,
        CONSTRAINT FK_ReceiptDetails_Receipts FOREIGN KEY (ReceiptID)
            REFERENCES StockReceipt (ReceiptID),
        CONSTRAINT FK_ReceiptDetails_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_ReceiptDetails_Units FOREIGN KEY (UnitID)
            REFERENCES Units (UnitID)
    );
END
GO

-- =============================================
-- SECTION 15: MARKETING & LOYALTY - التسويق والولاء
-- =============================================

-- =============================================
-- Table: Promotions - العروض الترويجية
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Promotions')
BEGIN
    CREATE TABLE Promotions (
        PromotionID     int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(50)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        NameEn          nvarchar(200)  NULL,
        Description     nvarchar(1000) NULL,
        PromotionType   nvarchar(50)   NOT NULL, -- Discount, BuyXGetY, Bundle
        DiscountType    nvarchar(20)   NULL, -- Amount, Percentage
        DiscountValue   decimal(18,2)  NOT NULL DEFAULT 0,
        MinPurchase     decimal(18,2)  NOT NULL DEFAULT 0,
        MaxDiscount     decimal(18,2)  NULL,
        StartDate       datetime2      NOT NULL,
        EndDate         datetime2      NOT NULL,
        UsageLimit      int            NULL,
        UsedCount       int            NOT NULL DEFAULT 0,
        AppliesTo       nvarchar(50)   NOT NULL DEFAULT 'All', -- All, Category, Item
        ProductGroupID  int            NULL,
        ItemID          int            NULL,
        CustomerGroupID int            NULL,
        BranchID        int            NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Promotions_ProductGroups FOREIGN KEY (ProductGroupID)
            REFERENCES ProductGroups (ProductGroupID),
        CONSTRAINT FK_Promotions_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_Promotions_CustomerGroups FOREIGN KEY (CustomerGroupID)
            REFERENCES CustomerGroups (CustomerGroupID),
        CONSTRAINT FK_Promotions_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID)
    );
END
GO

-- =============================================
-- Table: Coupons - الكوبونات والقسائم
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Coupons')
BEGIN
    CREATE TABLE Coupons (
        CouponID        int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(50)   NOT NULL UNIQUE,
        Name            nvarchar(200)  NOT NULL,
        Description     nvarchar(500)  NULL,
        DiscountType    nvarchar(20)   NOT NULL, -- Amount, Percentage
        DiscountValue   decimal(18,2)  NOT NULL DEFAULT 0,
        MinPurchase     decimal(18,2)  NOT NULL DEFAULT 0,
        MaxDiscount     decimal(18,2)  NULL,
        StartDate       datetime2      NOT NULL,
        EndDate         datetime2      NOT NULL,
        UsageLimit      int            NULL,
        UsedCount       int            NOT NULL DEFAULT 0,
        UsageLimitPerCustomer int      NULL DEFAULT 1,
        CustomerGroupID int            NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Coupons_CustomerGroups FOREIGN KEY (CustomerGroupID)
            REFERENCES CustomerGroups (CustomerGroupID)
    );
END
GO

-- =============================================
-- Table: LoyaltyProgram - برنامج نقاط الولاء
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LoyaltyProgram')
BEGIN
    CREATE TABLE LoyaltyProgram (
        ProgramID       int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Name            nvarchar(100)  NOT NULL,
        PointsPerSAR    decimal(10,2)  NOT NULL DEFAULT 1, -- Points earned per SAR spent
        SARPerPoint     decimal(10,2)  NOT NULL DEFAULT 0.1, -- Value of each point in SAR
        MinRedeemPoints int            NOT NULL DEFAULT 100,
        MaxRedeemPercentage decimal(5,2) NOT NULL DEFAULT 50, -- Max % of invoice payable with points
        ExpiryDays      int            NULL, -- Points expiry in days
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: LoyaltyTransactions - معاملات الولاء
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LoyaltyTransactions')
BEGIN
    CREATE TABLE LoyaltyTransactions (
        TransactionID   int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        CustomerID      int            NOT NULL,
        TransactionType nvarchar(50)   NOT NULL, -- Earn, Redeem, Expire, Adjust
        Points          int            NOT NULL,
        BalanceAfter    int            NOT NULL,
        ReferenceType   nvarchar(50)   NULL, -- Invoice, Return, Manual
        ReferenceID     int            NULL,
        Description     nvarchar(500)  NULL,
        ExpiryDate      date           NULL,
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_LoyaltyTransactions_Customers FOREIGN KEY (CustomerID)
            REFERENCES Customers (CustomerID),
        CONSTRAINT FK_LoyaltyTransactions_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- SECTION 16: SUPPORT & FIELD SERVICES
-- =============================================

-- =============================================
-- Table: SupportTickets - تذاكر دعم العملاء
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SupportTickets')
BEGIN
    CREATE TABLE SupportTickets (
        TicketID        int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        TicketNumber    nvarchar(50)   NOT NULL UNIQUE,
        CustomerID      int            NULL,
        Subject         nvarchar(200)  NOT NULL,
        Description     nvarchar(2000) NULL,
        Priority        nvarchar(20)   NOT NULL DEFAULT 'Medium', -- Low, Medium, High, Urgent
        Category        nvarchar(100)  NULL,
        Status          nvarchar(50)   NOT NULL DEFAULT 'Open', -- Open, InProgress, Resolved, Closed
        AssignedTo      int            NULL,
        BranchID        int            NULL,
        Resolution      nvarchar(2000) NULL,
        ResolvedAt      datetime2      NULL,
        ClosedAt        datetime2      NULL,
        CreatedBy       int            NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_SupportTickets_Customers FOREIGN KEY (CustomerID)
            REFERENCES Customers (CustomerID),
        CONSTRAINT FK_SupportTickets_AssignedTo FOREIGN KEY (AssignedTo)
            REFERENCES Employees (EmployeeID),
        CONSTRAINT FK_SupportTickets_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID),
        CONSTRAINT FK_SupportTickets_CreatedBy FOREIGN KEY (CreatedBy)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- Table: FieldSurvey - المسح الميداني
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'FieldSurvey')
BEGIN
    CREATE TABLE FieldSurvey (
        SurveyID        int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        SurveyNumber    nvarchar(50)   NOT NULL UNIQUE,
        SurveyDate      datetime2      NOT NULL DEFAULT GETDATE(),
        CustomerID      int            NULL,
        EmployeeID      int            NOT NULL,
        Location        nvarchar(500)  NULL,
        Latitude        decimal(10,6)  NULL,
        Longitude       decimal(10,6)  NULL,
        Purpose         nvarchar(500)  NULL,
        Findings        nvarchar(2000) NULL,
        Recommendations nvarchar(2000) NULL,
        Photos          nvarchar(MAX)  NULL, -- JSON array of photo URLs
        Status          nvarchar(50)   NOT NULL DEFAULT 'Draft',
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_FieldSurvey_Customers FOREIGN KEY (CustomerID)
            REFERENCES Customers (CustomerID),
        CONSTRAINT FK_FieldSurvey_Employees FOREIGN KEY (EmployeeID)
            REFERENCES Employees (EmployeeID)
    );
END
GO

-- =============================================
-- SECTION 17: RESTAURANT FEATURES - ميزات المطاعم
-- =============================================

-- =============================================
-- Table: CookingMethods - طرق الطبخ
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CookingMethods')
BEGIN
    CREATE TABLE CookingMethods (
        CookingMethodID int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        Description     nvarchar(500)  NULL,
        ExtraCharge     decimal(18,2)  NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: ItemCookingMethods - طرق طبخ الأصناف
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ItemCookingMethods')
BEGIN
    CREATE TABLE ItemCookingMethods (
        ID              int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        ItemID          int            NOT NULL,
        CookingMethodID int            NOT NULL,
        IsDefault       bit            NOT NULL DEFAULT 0,
        CONSTRAINT FK_ItemCooking_Items FOREIGN KEY (ItemID)
            REFERENCES Items (ItemID),
        CONSTRAINT FK_ItemCooking_Methods FOREIGN KEY (CookingMethodID)
            REFERENCES CookingMethods (CookingMethodID)
    );
END
GO

-- =============================================
-- SECTION 18: ACTIVITY & BUSINESS INFO - معلومات النشاط
-- =============================================

-- =============================================
-- Table: BusinessInfo - معلومات النشاط
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BusinessInfo')
BEGIN
    CREATE TABLE BusinessInfo (
        BusinessInfoID  int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        CompanyName     nvarchar(200)  NOT NULL,
        CompanyNameEn   nvarchar(200)  NULL,
        TaxNumber       nvarchar(50)   NULL,
        CommercialReg   nvarchar(50)   NULL,
        Address         nvarchar(500)  NULL,
        City            nvarchar(100)  NULL,
        Country         nvarchar(100)  NULL DEFAULT 'السعودية',
        PostalCode      nvarchar(20)   NULL,
        Phone           nvarchar(20)   NULL,
        Email           nvarchar(255)  NULL,
        Website         nvarchar(255)  NULL,
        LogoURL         nvarchar(500)  NULL,
        Currency        nvarchar(10)   NOT NULL DEFAULT 'SAR',
        TaxRate         decimal(5,2)   NOT NULL DEFAULT 15,
        FiscalYearStart int            NOT NULL DEFAULT 1, -- Month
        InvoicePrefix   nvarchar(10)   NULL,
        InvoiceStartNo  int            NOT NULL DEFAULT 1,
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- SECTION 19: E-INVOICE & INTEGRATIONS - الفوترة والتكامل
-- =============================================

-- =============================================
-- Table: ZATCASettings - إعدادات زاتكا
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ZATCASettings')
BEGIN
    CREATE TABLE ZATCASettings (
        SettingID       int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        BranchID        int            NULL,
        DeviceSerialNo  nvarchar(100)  NULL,
        CSRCommonName   nvarchar(200)  NULL,
        OTP             nvarchar(50)   NULL,
        PrivateKey      nvarchar(MAX)  NULL,
        Certificate     nvarchar(MAX)  NULL,
        CertificateExpiry date         NULL,
        ProductionMode  bit            NOT NULL DEFAULT 0,
        LastInvoiceHash nvarchar(500)  NULL,
        InvoiceCounter  int            NOT NULL DEFAULT 0,
        IsActive        bit            NOT NULL DEFAULT 1,
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_ZATCASettings_Branches FOREIGN KEY (BranchID)
            REFERENCES Branches (BranchID)
    );
END
GO

-- =============================================
-- Table: WhatsAppIntegration - الربط مع واتس اب
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'WhatsAppIntegration')
BEGIN
    CREATE TABLE WhatsAppIntegration (
        IntegrationID   int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Provider        nvarchar(100)  NOT NULL,
        APIKey          nvarchar(500)  NULL,
        APISecret       nvarchar(500)  NULL,
        PhoneNumberID   nvarchar(100)  NULL,
        BusinessAccountID nvarchar(100) NULL,
        WebhookURL      nvarchar(500)  NULL,
        VerifyToken     nvarchar(200)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- SECTION 20: SYSTEM & LICENSE - النظام والترخيص
-- =============================================

-- =============================================
-- Table: SystemLicense - ترخيص النظام
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SystemLicense')
BEGIN
    CREATE TABLE SystemLicense (
        LicenseID       int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        LicenseKey      nvarchar(500)  NOT NULL,
        CustomerName    nvarchar(200)  NOT NULL,
        CustomerEmail   nvarchar(255)  NULL,
        LicenseType     nvarchar(50)   NOT NULL, -- Trial, Basic, Professional, Enterprise
        MaxUsers        int            NOT NULL DEFAULT 1,
        MaxBranches     int            NOT NULL DEFAULT 1,
        Features        nvarchar(MAX)  NULL, -- JSON array of enabled features
        IssueDate       date           NOT NULL,
        ExpiryDate      date           NOT NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        ActivatedAt     datetime2      NULL,
        LastValidated   datetime2      NULL
    );
END
GO

-- =============================================
-- Table: SystemSettings - إعدادات النظام
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SystemSettings')
BEGIN
    CREATE TABLE SystemSettings (
        SettingID       int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        SettingKey      nvarchar(100)  NOT NULL UNIQUE,
        SettingValue    nvarchar(MAX)  NULL,
        SettingType     nvarchar(50)   NOT NULL DEFAULT 'String', -- String, Number, Boolean, JSON
        Description     nvarchar(500)  NULL,
        UpdatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- =============================================
-- Table: AuditLog - سجل التدقيق
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AuditLog')
BEGIN
    CREATE TABLE AuditLog (
        LogID           bigint         NOT NULL IDENTITY(1,1) PRIMARY KEY,
        TableName       nvarchar(100)  NOT NULL,
        RecordID        int            NOT NULL,
        Action          nvarchar(20)   NOT NULL, -- Insert, Update, Delete
        OldValues       nvarchar(MAX)  NULL,
        NewValues       nvarchar(MAX)  NULL,
        UserID          int            NULL,
        IPAddress       nvarchar(50)   NULL,
        UserAgent       nvarchar(500)  NULL,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_AuditLog_Users FOREIGN KEY (UserID)
            REFERENCES Users (UserID)
    );
END
GO

-- =============================================
-- SECTION 21: BRANCH GROUPS - مجموعات الفروع
-- =============================================

-- =============================================
-- Table: BranchGroups - مجموعات الفروع
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BranchGroups')
BEGIN
    CREATE TABLE BranchGroups (
        BranchGroupID   int            NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code            nvarchar(20)   NOT NULL UNIQUE,
        Name            nvarchar(100)  NOT NULL,
        NameEn          nvarchar(100)  NULL,
        IsActive        bit            NOT NULL DEFAULT 1,
        CreatedAt       datetime2      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Add FK for Branches.BranchGroupID
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Branches_Groups')
BEGIN
    ALTER TABLE Branches ADD CONSTRAINT FK_Branches_Groups 
        FOREIGN KEY (BranchGroupID) REFERENCES BranchGroups (BranchGroupID);
END
GO

-- =============================================
-- INSERT DEFAULT DATA - البيانات الافتراضية
-- =============================================

-- Default Account Groups
IF NOT EXISTS (SELECT * FROM AccountGroups)
BEGIN
    INSERT INTO AccountGroups (Code, Name, NameEn) VALUES
    ('AG001', 'الأصول', 'Assets'),
    ('AG002', 'الخصوم', 'Liabilities'),
    ('AG003', 'حقوق الملكية', 'Equity'),
    ('AG004', 'الإيرادات', 'Revenue'),
    ('AG005', 'المصروفات', 'Expenses');
END
GO

-- Default Chart of Accounts
IF NOT EXISTS (SELECT * FROM Accounts)
BEGIN
    -- Level 1 - Main Accounts
    INSERT INTO Accounts (Code, Name, NameEn, AccountType, AccountNature, AccountLevel, IsMain) VALUES
    ('1', 'الأصول', 'Assets', 'Asset', 'Debit', 1, 1),
    ('2', 'الخصوم', 'Liabilities', 'Liability', 'Credit', 1, 1),
    ('3', 'حقوق الملكية', 'Equity', 'Equity', 'Credit', 1, 1),
    ('4', 'الإيرادات', 'Revenue', 'Revenue', 'Credit', 1, 1),
    ('5', 'المصروفات', 'Expenses', 'Expense', 'Debit', 1, 1);

    -- Level 2 - Sub Accounts
    INSERT INTO Accounts (Code, Name, NameEn, ParentID, AccountType, AccountNature, AccountLevel, IsMain) VALUES
    ('11', 'الأصول المتداولة', 'Current Assets', 1, 'Asset', 'Debit', 2, 1),
    ('12', 'الأصول الثابتة', 'Fixed Assets', 1, 'Asset', 'Debit', 2, 1),
    ('21', 'الخصوم المتداولة', 'Current Liabilities', 2, 'Liability', 'Credit', 2, 1),
    ('22', 'الخصوم طويلة الأجل', 'Long-term Liabilities', 2, 'Liability', 'Credit', 2, 1),
    ('31', 'رأس المال', 'Capital', 3, 'Equity', 'Credit', 2, 1),
    ('32', 'الأرباح المحتجزة', 'Retained Earnings', 3, 'Equity', 'Credit', 2, 1),
    ('41', 'إيرادات المبيعات', 'Sales Revenue', 4, 'Revenue', 'Credit', 2, 1),
    ('42', 'إيرادات أخرى', 'Other Revenue', 4, 'Revenue', 'Credit', 2, 1),
    ('51', 'تكلفة المبيعات', 'Cost of Sales', 5, 'Expense', 'Debit', 2, 1),
    ('52', 'المصروفات الإدارية', 'Administrative Expenses', 5, 'Expense', 'Debit', 2, 1),
    ('53', 'مصروفات البيع والتسويق', 'Sales & Marketing Expenses', 5, 'Expense', 'Debit', 2, 1);

    -- Level 3 - Detailed Accounts
    INSERT INTO Accounts (Code, Name, NameEn, ParentID, AccountType, AccountNature, AccountLevel) VALUES
    ('111', 'النقدية', 'Cash', 6, 'Asset', 'Debit', 3),
    ('112', 'البنوك', 'Banks', 6, 'Asset', 'Debit', 3),
    ('113', 'العملاء', 'Accounts Receivable', 6, 'Asset', 'Debit', 3),
    ('114', 'المخزون', 'Inventory', 6, 'Asset', 'Debit', 3),
    ('121', 'المباني', 'Buildings', 7, 'Asset', 'Debit', 3),
    ('122', 'المعدات', 'Equipment', 7, 'Asset', 'Debit', 3),
    ('123', 'السيارات', 'Vehicles', 7, 'Asset', 'Debit', 3),
    ('124', 'الأثاث', 'Furniture', 7, 'Asset', 'Debit', 3),
    ('211', 'الموردين', 'Accounts Payable', 8, 'Liability', 'Credit', 3),
    ('212', 'ضريبة القيمة المضافة', 'VAT Payable', 8, 'Liability', 'Credit', 3),
    ('213', 'رواتب مستحقة', 'Salaries Payable', 8, 'Liability', 'Credit', 3);
END
GO

-- Default Units
IF NOT EXISTS (SELECT * FROM Units)
BEGIN
    INSERT INTO Units (Code, Name, NameEn) VALUES
    ('PC', 'قطعة', 'Piece'),
    ('KG', 'كيلوغرام', 'Kilogram'),
    ('G', 'غرام', 'Gram'),
    ('L', 'لتر', 'Liter'),
    ('ML', 'ملليلتر', 'Milliliter'),
    ('M', 'متر', 'Meter'),
    ('CM', 'سنتيمتر', 'Centimeter'),
    ('BOX', 'صندوق', 'Box'),
    ('PKT', 'علبة', 'Packet'),
    ('DZN', 'درزن', 'Dozen');
END
GO

-- Default Order Types
IF NOT EXISTS (SELECT * FROM OrderTypes)
BEGIN
    INSERT INTO OrderTypes (Code, Name, NameEn) VALUES
    ('DINE', 'محلي', 'Dine In'),
    ('TAKE', 'سفري', 'Takeaway'),
    ('DLVR', 'توصيل', 'Delivery'),
    ('DRIV', 'سيارة', 'Drive Through');
END
GO

-- Default Fiscal Year
IF NOT EXISTS (SELECT * FROM FiscalYears)
BEGIN
    INSERT INTO FiscalYears (Name, StartDate, EndDate, IsActive) VALUES
    ('السنة المالية 2024', '2024-01-01', '2024-12-31', 1);
END
GO

-- Default Loyalty Program
IF NOT EXISTS (SELECT * FROM LoyaltyProgram)
BEGIN
    INSERT INTO LoyaltyProgram (Name, PointsPerSAR, SARPerPoint, MinRedeemPoints, MaxRedeemPercentage, IsActive) VALUES
    ('برنامج نقاط صقر', 1, 0.1, 100, 50, 1);
END
GO

PRINT 'SAQR ERP Database Schema created successfully - تم إنشاء قاعدة بيانات نظام صقر بنجاح';
GO
