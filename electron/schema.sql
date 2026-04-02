-- SQL for roles and permissions
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    role_id INT REFERENCES roles(id),
    password VARCHAR(255) NOT NULL
);

CREATE TABLE fiscal_periods (
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

CREATE TABLE invoice_sequencing (
    id SERIAL PRIMARY KEY,
    invoice_number INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE taxes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rate DECIMAL(5,2) NOT NULL
);

CREATE TABLE discounts (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INT,
    average_cost DECIMAL(10,2) NOT NULL
);

-- Other necessary tables and structures can be defined similarly.
