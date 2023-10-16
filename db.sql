/*
Steps to create the database with PostgreSQL

Launch your terminal and type the following commands:
*/

-- psql
-- CREATE DATABASE Website
-- \q

-- psql -d Website -f db.sql


/* --------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS users
(
    username VARCHAR(128) NOT NULL,
    password VARCHAR(128) NOT NULL,
    admin BOOLEAN DEFAULT FALSE,
    CONSTRAINT pk_users PRIMARY KEY (username, password)
);

-- #############################################################################################################
--
-- IMPORTANT NOTE: The password is stored in plain text. It's made on purpose, the users are created by an 
--                 administrator and some accounts are supposed to be shared!
--
--                 If your application is public and you want to allow users to create their own accounts, you
--                 MUST hash the password, conform to the GDPR law.
--
-- #############################################################################################################


/* --------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS videos
(
    id VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    duration INT NOT NULL,
    CONSTRAINT pk_videos PRIMARY KEY (id)
);

/* --------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS formats
(
    id INT NOT NULL,
    name VARCHAR(25) NOT NULL,
    CONSTRAINT pk_formats PRIMARY KEY (id)
);

/* --------------------------------------------------------- */
CREATE TABLE IF NOT EXISTS downloads
(
    uuid CHAR(36) NOT NULL,
    video VARCHAR(255) NOT NULL,
    format INT NOT NULL,
    status VARCHAR(255),
    speed VARCHAR(255),
    downloaded VARCHAR(255),
    total VARCHAR(255),
    progress INT,
    eta INT,
    CONSTRAINT pk_downloads PRIMARY KEY (uuid, video),
    CONSTRAINT fk_downloads_format FOREIGN KEY (format) REFERENCES formats(id),
    CONSTRAINT fk_downloads_video FOREIGN KEY (video) REFERENCES videos(id)
);

/* --------------------------------------------------------- */
INSERT INTO formats (id, name)
VALUES (1, 'mp3'),
       (2, 'mp4'),
       (3, 'wav')
ON CONFLICT DO NOTHING;


INSERT INTO users (username, password, admin)
VALUES ('admin', 'admin#password', TRUE)
ON CONFLICT DO NOTHING;

-- #############################################################################################################
--
-- IMPORTANT NOTE: PLEASE CHANGE THE PASSWORD ABOVE!
--                 You can use the following command to change the password:
--
--                 UPDATE users SET password = 'YOUR_NEW_PASSWORD' WHERE username = 'admin';
--
-- #############################################################################################################
