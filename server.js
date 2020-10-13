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
            choices: ["See the Org Chart", "Add a department", "Add a role", "Add an employee", "Update an existing employee's role", "Quit"]
        }
    ]).then(choice => {
        if (err) throw err;
        switch (choice) {
            case "See the Org Chart":
                printOrgChart();
                startProgram();
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
            case "Quit":
                connection.end();
                console.log("Have a great day!")
                break;
        }
    })
};

// Display charts in the console
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

// Here, you're joining the data in the two tables where (on) the author ID field on the books table is equal to the id field on the authors table.

function exampleJoinFunction() {
    connection.query("SELECT title, firstName, lastName FROM books INNER JOIN authors ON books.authorId = authors.id", (err, data) => {
        if (err) throw err;
        console.log(data);
    })
};

// Here is an example of adding a new person to a table. Need to ask the user what the person's first and last name are separately. Any datapoint needs its own response. You you'd do an inquirer prompt, then fill out the mysql line with the answers from that:
function exampleAddAuthor() {
    // inquirer prompt delivers answers
    connection.query("`INSERT INTO authors SET ?", {
        firstName: firstName,
        lastName: lastName
    }, (err, data) => {
        if (err) throw err;
        console.log("Author Added");
        setTimeout(startProgram, 2000)
    })
};
// Doing the above will create an author id for the new author, but how do we tie that to the book? 
// Add a new book like the below. Again this would be what would fire after the relevant inquirer prompt collecting all the needed data about the new item to be added. You can reference the able to fill out the list choices by including the inquirer prompt inside a connection query. You could use an if else to give people a go back option. If they choose go back, send them bcak to the beginning. Else move them forward appropriately.

function exampleAddBook() {
    connection.query("SELECT * FROM authors", (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "text",
                name: "bookName",
                message: "enter book name"
            },
            {
                type: "rawlist",
                name: "bookAuthor",
                message: "Select Author of Book",
                choices: function () {
                    const choicesArray = [];
                    for (let i = 0; i < results.length; i++) {
                        choicesArray.push(results[i].firstName + " " + results[i].lastName)
                    }
                    return choicesArray
                }
            }
        ]).then(({ bookName, bookAuthor }) => {
            const [firstName, lastName] = bookAuthor.split(" ");
            const [foundAuthor] = results.filter(author => author.firstName === firstName && author.lastName === lastName)

            connection.query("INSERT INTO books SET ?", {
                title: bookName,
                authorId: foundAuthor.id
            }, (err, data) => {
                if (err) throw err;
                console.log("Book added")
                setTimeout(startProgram, 2000)
            })
        })
    })
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
        connection.query(`INSERT INTO department SET ?`, { name: deptName }, (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log(`${choice.deptName} has been added to the list of departments`);
                startProgram();
            }
        })
    })
};

// Add a role to the database
function addRole() {
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
        }
        // Do I need to insert a question associated with dept ID here?
    ]).then(choices => {
        connection.query("INSERT INTO role SET ?", {
            title: roleTitle,
            salary: roleSalary
        }, (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log(`${choices.roleTitle} with salary of $${choices.roleSalary}.00 has been added to the list of roles`);
                startProgram();
            }
        })
    })
};

// Add an employee to the database
function addEmployee() {
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
        }
        // Do I need to include role and manager ID questions here?
    ]).then(choices => {
        connection.query("INSERT INTO employee SET ?", {
            first_name: employeeFirstName,
            last_name: employeeLastName,
        }, (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log(`${choices.employeeFirstName} ${choices.employeeLastName} has been added to the list of employees`);
                startProgram();
            }
        })
    })
};

// Update employee role
function updateEmployee() {
    inquirer.prompt([
        {
            name: "employeeId",
            type: "number",
            message: "Enter an Employee ID Number"
        },
        {
            name: "employeeRole",
            type: "list",
            message: "Choose a new role ID"
            // choices: need to know how to reference exsting roles and make them choices
        },
    ]).then(choices => {
        connection.query(`UPDATE employee SET ? WHERE ?`,
            [
                {
                    role_id: `${choices.employeeRole}`
                },
                {
                    employee_id: `${employeeId}`
                }
            ],
            (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} updated`)
                startProgram();
            }
        )
    })
};


// Bonus points if you're able to:

// * Update employee managers

// * View employees by manager

// * Delete departments, roles, and employees

// * View the total utilized budget of a department -- ie the combined salaries of all employees in that department
// TODO: Ensure 