const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password",
    database: "org_chartDB"
});

// Connects to database and begins program when you run node server.js in the console
connection.connect(err => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startProgram();
});

// Directs user to appropriate prompts based on their choice. Also provides checkpoint to return user to start until they choose to quit the program
function startProgram() {
    inquirer.prompt([
        {
            name: "startQuestion",
            type: "list",
            message: "What would you like to do?",
            choices: ["See the Org Chart", "Add a department", "Add a role", "Add an employee", "Update an existing employee's role", "Delete an Employee", "Delete a Role", "Delete a Department", "Quit"]
        }
    ]).then(choice => {
        switch (choice.startQuestion) {
            case "See the Org Chart":
                printOrgChart();
                break;
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
            case "Delete an Employee":
                deleteEmployee();
                break;
            case "Delete a Role":
                deleteRole();
                break;
            case "Delete a Department":
                deleteDepartment();
                break;
            case "Quit":
                connection.end();
                console.log("Have a great day!");
                break;
        }
    })
};

// Display charts in the console
function printOrgChart() {
    connection.query("SELECT first_name, last_name, title, dept_name, salary FROM employee INNER JOIN role ON role.title = employee.role_title", (err, data) => {
        if (err) {
            throw err;
        } else {
            console.table(data);
            setTimeout(startProgram, 1000);
        };
    });
};

// Add a department to the database
function addDepartment() {
    inquirer.prompt([
        {
            name: "deptName",
            type: "input",
            message: "What is the department called?"
        }
    ]).then(choice => {
        connection.query(`INSERT INTO department SET ?`, { name: choice.deptName }, (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log(`${choice.deptName} has been added to the list of departments`);
                setTimeout(startProgram, 1000);
            }
        })
    })
};

// Add a role to the database
function addRole() {
    connection.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "What is the role called?"
            },
            {
                name: "roleSalary",
                type: "number",
                message: "What is the associated salary? (Number only)"
            },
            {
                name: "deptName",
                type: "rawlist",
                message: "What department does this position roll up to?",
                choices: function () {
                    const deptArray = [];
                    for (let i = 0; i < results.length; i++) {
                        deptArray.push(results[i].name);
                    }
                    return deptArray;
                }
            }
        ]).then(({ roleTitle, roleSalary, deptName }) => {
            const [foundDept] = results.filter(dept => dept.name === deptName)
            connection.query("INSERT INTO role SET ?", {
                title: roleTitle,
                salary: roleSalary,
                dept_name: deptName,
                department_id: foundDept.id
            }, (err, data) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`${roleTitle} with salary of $${roleSalary} has been added to the list of roles in the ${deptName} department`);
                    setTimeout(startProgram, 1000)
                }
            })
        })
    })
};

// Add an employee to the database
function addEmployee() {
    connection.query("SELECT * FROM role", (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "employeeFirstName",
                type: "input",
                message: "Please enter the employee's first name:"
            },
            {
                name: "employeeLastName",
                type: "input",
                message: "Please enter the employee's last name:"
            },
            {
                name: "employeeRole",
                type: "rawlist",
                message: "Choose a role for the new employee:",
                choices: function () {
                    const roleArray = [];
                    for (let i = 0; i < results.length; i++) {
                        roleArray.push(results[i].title);
                    }
                    return roleArray;
                }
            }
        ]).then(({ employeeFirstName, employeeLastName, employeeRole }) => {
            const [foundRole] = results.filter(roleChoice => roleChoice.title === employeeRole)
            connection.query("INSERT INTO employee SET ?", {
                first_name: employeeFirstName,
                last_name: employeeLastName,
                role_title: employeeRole,
                role_id: foundRole.id
            }, (err, data) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`New ${employeeRole} ${employeeFirstName} ${employeeLastName} has been added to the list of employees`);
                    setTimeout(startProgram, 1000);
                }
            })
        })
    })
};

// Update employee role
function updateEmployee() {
    connection.query("SELECT * FROM employee INNER JOIN role ON role.id = employee.role_id", (err, results) => {
        inquirer.prompt([
            {
                name: "employeeName",
                type: "rawlist",
                message: "Choose an Employee:",
                choices: function () {
                    if (err) throw err;
                    const employeeArray = [];
                    for (let i = 0; i < results.length; i++) {
                        let employeeFullName = results[i].id + " " + results[i].first_name + " " + results[i].last_name;
                        employeeArray.push(employeeFullName);
                    }
                    return employeeArray;
                }
            },
            {
                name: "employeeRole",
                type: "list",
                message: "Choose a new role:",
                choices: function () {
                    const roleArray = [];
                    for (let i = 0; i < results.length; i++) {
                        roleArray.push(results[i].title);
                    }
                    return roleArray;
                }
            }
        ]).then(({ employeeName, employeeRole }) => {
            const [id, firstName, lastName] = employeeName.split(" ");
            connection.query(`UPDATE employee SET role_title = '${employeeRole}' WHERE id = ${id}`,
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee updated`)
                    setTimeout(startProgram, 1000);
                }
            )
        })
    }
    )
};

// Delete employee
function deleteEmployee() {
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "deleteEmployee",
                type: "rawlist",
                message: "Which employee should be deleted?",
                choices: function () {
                    if (err) throw err;
                    const deleteArray = [];
                    for (let i = 0; i < results.length; i++) {
                        let employeeFullName = results[i].id + " " + results[i].first_name + " " + results[i].last_name;
                        deleteArray.push(employeeFullName);
                    }
                    return deleteArray;
                }
            }
        ]).then(({deleteEmployee}) => {
            const [id, firstName, lastName] = deleteEmployee.split(" ");
            connection.query(`DELETE FROM employee WHERE id = ${id}`, (err, data) => {
                if (err) throw err;
                console.log(`${firstName} ${lastName} has been deleted`)
            })
        })
    })
};

// Delete Employees
function deleteEmployee() {
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "deleteEmployee",
                type: "rawlist",
                message: "Which employee should be deleted?",
                choices: function () {
                    if (err) throw err;
                    const deleteArray = [];
                    for (let i = 0; i < results.length; i++) {
                        let employeeFullName = results[i].id + " " + results[i].first_name + " " + results[i].last_name;
                        deleteArray.push(employeeFullName);
                    }
                    return deleteArray;
                }
            }
        ]).then(({deleteEmployee}) => {
            const [id, firstName, lastName] = deleteEmployee.split(" ");
            connection.query(`DELETE FROM employee WHERE id = ${id}`, (err, data) => {
                if (err) throw err;
                console.log(`${firstName} ${lastName} has been deleted`)
                setTimeout(startProgram, 1000);
            })
        })
    })
};

// Delete Roles
function deleteRole() {
    connection.query("SELECT * FROM role", (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "deleteRole",
                type: "rawlist",
                message: "Which role should be deleted?",
                choices: function () {
                    if (err) throw err;
                    const deleteArray = [];
                    for (let i = 0; i < results.length; i++) {
                        let fullRole = results[i].id + " " + results[i].title;
                        deleteArray.push(fullRole);
                    }
                    return deleteArray;
                }
            }
        ]).then(({deleteRole}) => {
            const [id, roleName] = deleteRole.split(" ");
            connection.query(`DELETE FROM role WHERE id = ${id}`, (err, data) => {
                if (err) throw err;
                console.log(`${roleName} has been deleted`)
                setTimeout(startProgram, 1000);
            })
        })
    })
};

// Delete Departments
function deleteDepartment() {
    connection.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "deleteDepartment",
                type: "rawlist",
                message: "Which department should be deleted?",
                choices: function () {
                    if (err) throw err;
                    const deleteArray = [];
                    for (let i = 0; i < results.length; i++) {
                        let fullDept = results[i].id + " " + results[i].name;
                        deleteArray.push(fullDept);
                    }
                    return deleteArray;
                }
            }
        ]).then(({deleteDepartment}) => {
            const [id, deptName] = deleteDepartment.split(" ");
            connection.query(`DELETE FROM department WHERE id = ${id}`, (err, data) => {
                if (err) throw err;
                console.log(`${deptName} has been deleted`)
                setTimeout(startProgram, 1000);
            })
        })
    })
};