-- =========================
-- DEMO USER
-- Username: demo
-- Password: demo12345
-- =========================

INSERT INTO users (
    username,
    password_hash
)
VALUES (
    'demo',
    '$2b$10$3PdUIEaEgpVlHdNT.FdFIOvfuATH7KR6mbRqh/W5aJvREk91YBtmi'
);

-- =========================
-- DEMO CATEGORIES
-- =========================

INSERT INTO categories (user_id, name)
VALUES
    (1, 'Default'),
    (1, 'Lavoro'),
    (1, 'Studio'),
    (1, 'Hobby');

-- =========================
-- DEMO LINKS - LAVORO
-- =========================

INSERT INTO links (
    user_id,
    category_id,
    title,
    description,
    url,
    image_url
)
VALUES
(
    1,
    2,
    'LinkedIn',
    'Piattaforma professionale e networking.',
    'https://www.linkedin.com',
    'https://www.linkedin.com/favicon.ico'
),
(
    1,
    2,
    'GitHub',
    'Repository e gestione del codice sorgente.',
    'https://github.com',
    'https://github.com/favicon.ico'
);

-- =========================
-- DEMO LINKS - STUDIO
-- =========================

INSERT INTO links (
    user_id,
    category_id,
    title,
    description,
    url,
    image_url
)
VALUES
(
    1,
    3,
    'Angular',
    'Documentazione ufficiale Angular.',
    'https://angular.dev',
    'https://angular.dev/favicon.ico'
),
(
    1,
    3,
    'PostgreSQL',
    'Documentazione ufficiale PostgreSQL.',
    'https://www.postgresql.org',
    'https://www.postgresql.org/favicon.ico'
);

-- =========================
-- DEMO LINKS - HOBBY
-- =========================

INSERT INTO links (
    user_id,
    category_id,
    title,
    description,
    url,
    image_url
)
VALUES
(
    1,
    4,
    'YouTube',
    'Piattaforma video.',
    'https://www.youtube.com',
    'https://www.youtube.com/favicon.ico'
);