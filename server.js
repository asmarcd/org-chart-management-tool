const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password",
    database: "org_chartDB"
});

function startProgram() {
    inquirer.prompt([
        {
            name: "startQuestion",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add a department", "Add a role", "Add an employee", "Update an existing employee's role", "Quit"]
        }
    ]).then(choice => {
        if (err) throw err;
        switch (choice) {
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an existing employee's role":
                updateEmployee();
                break;
            case "Quit":
                connection.end();
                break;
        }
    })
};

function printOrgChart() {
    connection.query(`SELECT * FROM department`, (err, data) => {
        if (err) {
            throw err;
        } else {
            console.table(data);
        };
    });
    connection.query(`SELECT * FROM employee`, (err, data) => {
        if (err) {
            throw err;
        } else {
            console.table(data);
        };
    });
    connection.query(`SELECT * FROM role`, (err, data) => {
        if (err) {
            throw err;
        } else {
            console.table(data);
        };
    });
};


function addDepartment {
    inquirer.prompt([
        {
            name: "deptName",
            type: "input",
            message: "What is the department called?"
        }
    ]).then(choice => {
        connection.connect(err => {
            if (err) throw err;
            console.log("connected as id " + connection.threadId);

            connection.query(`INSERT INTO department(name)VALUES ("${choice.deptName}")`, (err, data) => {
                if (err) {
                    throw err;
                } else {
                    printOrgChart();
                    startProgram();
                }
            })
        })
    })
};

function addRole() { };
function addEmployee() { };
function updateEmployee() { };

// TODO: use inquirer to build command-line application that alows user to:
// * Add departments, roles, employees

// * View departments, roles, employees

// * Update employee roles

// Bonus points if you're able to:

// * Update employee managers

// * View employees by manager

// * Delete departments, roles, and employees

// * View the total utilized budget of a department -- ie the combined salaries of all employees in that department
// TODO: Ensure 