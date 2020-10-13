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
    salary DECIMAL(8,2) NOT NULL,
    dept_name VARCHAR(30),
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_title VARCHAR(30),
    department_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name) 
VALUES ("Engineering");

INSERT INTO employee (first_name, last_name, role_title, department_name) 
VALUES ("John", "Smith", "Junior Engineer", "Engineering");
INSERT INTO employee (first_name, last_name, role_title, department_name) 
VALUES ("Jackie", "Martin", "Engineering Manager", "Engineering");

INSERT INTO role (title, salary, dept_name) 
VALUES ("Engineering Manager", 120000, "Engineering");
INSERT INTO role (title, salary, dept_name) 
VALUES ("Junior Engineer", 70000, "Engineering");