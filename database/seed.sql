-- Muaraversa Initial Data
-- Version 0.1

-- Default school
INSERT INTO schools
(
    name,
    address
)
SELECT
    'SDN Muarasari 1',
    'Indonesia'
WHERE NOT EXISTS (
    SELECT 1 FROM schools WHERE name = 'SDN Muarasari 1'
);


-- Default admin account
-- Password will be replaced by authentication system later
INSERT INTO users
(
    username,
    password,
    role
)
SELECT
    'admin',
    'change_this_password',
    'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'admin'
);


-- Default class
INSERT INTO classes
(
    school_id,
    class_name
)
SELECT
    1,
    'Kelas 1'
WHERE NOT EXISTS (
    SELECT 1 FROM classes WHERE class_name = 'Kelas 1'
);
