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

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("John", "Smith", 2, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Jackie", "Martin", 1);

INSERT INTO role (title, salary, department_id) 
VALUES ("Engineering Manager", 120000, 1);
INSERT INTO role (title, salary, department_id) 
VALUES ("Junior Engineer", 70000);