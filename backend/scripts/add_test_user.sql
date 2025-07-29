INSERT INTO users (
    id,
    email,
    password,
    first_name,
    last_name,
    phone,
    balance,
    account_number,
    created_at
) VALUES (
    lower(hex(randomblob(16))), -- generates random UUID
    'priyankaavijay@gmail.com',
    -- Note: Use the same password hashing method as your app
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNVvqn4DOB3sy', -- hash for '.tie5Roanl'
    'Priyankaa',
    'Vijay',
    '9876543210',
    100000.0,
    substr(lower(hex(randomblob(8))), 1, 12), -- random 12-digit account number
    CURRENT_TIMESTAMP
);