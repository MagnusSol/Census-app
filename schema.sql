CREATE TABLE admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE participants (
  email VARCHAR(255) PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  dob DATE NOT NULL
);

CREATE TABLE work (
  id INT PRIMARY KEY AUTO_INCREMENT,
  participant_email VARCHAR(255),
  companyname VARCHAR(255) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  FOREIGN KEY (participant_email) REFERENCES participants(email)
);

CREATE TABLE home (
  id INT PRIMARY KEY AUTO_INCREMENT,
  participant_email VARCHAR(255),
  country VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  FOREIGN KEY (participant_email) REFERENCES participants(email)
);
