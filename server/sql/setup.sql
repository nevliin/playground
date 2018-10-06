DROP TABLE IF EXISTS auth_token;
DROP TABLE IF EXISTS auth_user_role;
DROP TABLE IF EXISTS auth_user;
DROP TABLE IF EXISTS auth_role;

CREATE TABLE auth_role(
    id INT PRIMARY KEY,
    display_name VARCHAR(60),
    name VARCHAR(60),
    power INT,
    created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE auth_user(
	id INT PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(60) UNIQUE,
    salted_hash VARCHAR(255) NOT NULL,
    created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE auth_user_role(
    user_id INT,
    role_id INT,
    FOREIGN KEY (user_id) REFERENCES auth_user(id),
    FOREIGN KEY (role_id) REFERENCES auth_role(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE auth_token(
	id INT PRIMARY KEY AUTO_INCREMENT,
	user_id INT REFERENCES auth_users(id),
    token VARCHAR(255) NOT NULL,
    valid INT NOT NULL DEFAULT 1,
    created_on TIMESTAMP DEFAULT NOW()
);

