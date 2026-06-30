CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    flight_no VARCHAR(20) NOT NULL,
    station VARCHAR(10) NOT NULL,
    flight_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    created_by VARCHAR(100),
    approved_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    item_code VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    remarks TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL,
    performed_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approval_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    status VARCHAR(30) NOT NULL,
    comment TEXT,
    approved_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    station VARCHAR(10) NOT NULL,
    item_code VARCHAR(50),
    available_quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0
);

INSERT INTO inventory(station, item_code, available_quantity, reserved_quantity)
VALUES
('AUH', 'MEAL_STANDARD', 1000, 0),
('AUH', 'MEAL_VEG', 500, 0),
('JFK', 'MEAL_STANDARD', 700, 0)
ON CONFLICT DO NOTHING;
