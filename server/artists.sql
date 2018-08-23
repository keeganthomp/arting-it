DROP DATABASE IF EXISTS tart;
CREATE DATABASE tart;

\c tart

CREATE TABLE artists (
  ID SERIAL PRIMARY KEY,
  first_name VARCHAR,
  last_name VARCHAR,
  specialty VARCHAR,
  age INTEGER,
  location VARCHAR,
  sex VARCHAR,
  avatar VARCHAR,
  art VARCHAR
);

INSERT INTO artists (first_name, last_name, specialty, age, location, sex, avatar, art)
  VALUES ('Keegan', 'Thompson', 'abstract oil', 26, 'Nashville', 'M', 'woo.png', '[art1, art2]');