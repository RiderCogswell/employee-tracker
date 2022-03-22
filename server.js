const inquirer = require('inquirer');
const express = require('express');
const db = require('./db/connection');
require('console.table');

const PORT = process.env.PORT || 3002;

db.connect(err => {
    if (err) throw err;
    startQuestions();
});

// Initial questions list
function startQuestions() {
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
    const sql = 
    `SELECT employees.id, employees.first_name, employees.last_name, 
     roles.title, departments.name AS department, roles.salary, 
     CONCAT(manager.first_name, ' ', manager.last_name) AS manager
     FROM employees
     LEFT JOIN roles ON employees.role_id = roles.id
     LEFT JOIN departments ON departments.id = roles.department_id
     LEFT JOIN employees manager ON manager.id = employees.manager_id`

    db.query(sql, (err, res) => {
        if (err) throw err;
        // writiing data to table in console
        console.table(res);
        startQuestions();
    });
};

// VIEW employees by department 
function viewEmployeesByDepartment() {
    const sql = 
    `SELECT departments.id, departments.name, roles.salary
     FROM employees
     LEFT JOIN roles ON employees.role_id = roles.id
     LEFT JOIN departments ON departments.id = roles.department_id
     GROUP BY departments.id, departments.name, roles.salary`;

     db.query(sql, (err, res) => {
        if (err) throw err;
        const deptChoices = res.map((choices) => ({
            value: choices.id, name: choices.name
        }));
        console.table(res);
        getDept(deptChoices);
     });
};

// GET department
function getDept(deptChoices){
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Departments',
                choices: deptChoices  
            }
        ])
        .then((res) => {
            const sql = 
            `SELECT employees.id, employees.first_name,
             employees.last_name, roles.title, departments.name
             FROM employees
             JOIN roles ON employees.role_id = roles.id
             JOIN departments ON departments.id = role.department_id
             WHERE department.id = ?`;

        db.query(sql, (err, res.department, (err, res) => {
            if (err) throw err;
            startQuestions();
            console.table(res);
        }));
    });
};

// Access employees
function addEmployee() {
    const sql = 
    `SELECT roles.id, roles.title, roles.salary FROM roles`;

    db.query(sql, (err, res) => {
        if (err) throw err;
        const roles = res.map(({ id, title, salary }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }));

        console.table(res);
        // initialize 
        employeeRoles(roles);
    });
};

// ACTUALLY add employee
function employeeRoles() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Employee first name:'
            },
        ])
}