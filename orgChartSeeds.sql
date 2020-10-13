DROP DATABASE IF EXISTS org_chartDB;

CREATE DATABASE org_chartDB;

USE org_chartDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name) 
VALUES ("Engineering");

INSERT INTO employee (first_name, last_name) 
VALUES ("John", "Smith");
INSERT INTO employee (first_name, last_name) 
VALUES ("Jackie", "Martin");

INSERT INTO role (title, salary) 
VALUES ("Engineering Manager", 120000);
INSERT INTO role (title, salary) 
VALUES ("Junior Engineer", 70000);