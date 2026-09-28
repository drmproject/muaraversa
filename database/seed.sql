-- Muaraversa Initial Data
-- Version 0.1


INSERT INTO schools
(
    name,
    address
)
VALUES
(
    'SDN Muarasari 1',
    'Indonesia'
);



INSERT INTO users
(
    username,
    password,
    role
)
VALUES
(
    'admin',
    'change_this_password',
    'admin'
);



INSERT INTO classes
(
    school_id,
    class_name
)
VALUES
(
    1,
    'Kelas 1'
);
