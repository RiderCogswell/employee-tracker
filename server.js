const inquirer = require('inquirer');
const db = require('./db/connection');
const consoleTable = require('console.table');

const PORT = process.env.PORT || 3002;

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// Initial questions list
function startQuestions () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'View Employees By Department',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Add Role',
                'Add Department',
                'Exit'
            ]
        }])
        .then((res) => {
            switch(res.selection) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View Employees By Department':
                    viewEmployeesByDepartment();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Remove Employee':
                    removeEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Exit':
                    db.end();
                    break;
            }
        })
        .catch((err) => {
            if (err) throw err;
        })
}

// GET all employees
function viewAllEmployees() {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, 
               roles.title, department.name AS department, roles.salary, 
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager
               FROM employees
               LEFT JOIN roles ON employees.role_id = role_id
               LEFT JOIN departments ON department.id = roles.department_id
               LEFT JOIN employees manager ON manager.id = employee.manager_id`

    db.query(sql, (err, res) => {
        if (err) throw err
        // writing data to table in console
        consoleTable(res);
        startQuestions();
    });
}