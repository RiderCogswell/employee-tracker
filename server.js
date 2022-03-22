const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

// create connection to DB
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RiderCogswell',
    database: 'employee_db'
});

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
            {
                type: "input",
                name: "lastName",
                message: "Employee Last Name: "
            },
            {
                type: "list",
                name: "roleId",
                message: "Employee Role: ",
                choices: roles
            }
        ]).then((res) => {
            const sql = `INSERT INTO employees SET ?`

            db.query(sql, {
                first_name: res.firstName,
                last_name: res.lastName,
                role_id: res.roleId
            }, (err, res) => {
                if (err) throw err;
                startQuestions();
            });
        });
}

function removeEmployee() {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name
                 FROM employees`

    db.query(sql, (err, res) => {
        if (err) throw err;
        const employee = res.map(({ id, first_name, last_name }) => ({
            value: id, 
            name: `${id} ${first_name} ${last_name}`
        }));
        console.table(res);
        getDelete(employee);
    });
};

function getDelete(employee) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Employee To Be Deleted: ',
                choices: employee
            }
        ]).then((res) => {
            const sql = `DELETE FROM employees WHERE ?`;
            db.query(sql, { id: res.employee }, (err, res) => {
                if (err) throw err;
                startQuestions();
            });
        });
};

// UPDATE employee table 
function updateEmployeeRole () {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name,
                 roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                 FROM employees
                 JOIN roles ON employees.role_id = roles.id
                 JOIN departments ON departments.id = roles.department_id
                 JOIN employee manager ON manager.id = employee.manager_id`

    db.query(sql, (err, res) => {
        if (err) throw err;
        const employee = res.map(({ id, first_name, last_name }) => ({
            value: id,
            name: `${first_name} ${last_name}`
        }));
        console.table(res);
        updateRole(employee);
    });
}

function updateRole(employee){
    let sql = 
    `SELECT 
      roles.id, 
      roles.title, 
      roles.salary 
    FROM roles`
  
    db.query(sql,(err, res)=>{
      if(err)throw err;
      let roleChoices = res.map(({ id, title, salary }) => ({
        value: id, 
        title: `${title}`, 
        salary: `${salary}`      
      }));
      console.table(res);
      getUpdatedRole(employee, roleChoices);
    });
}

function getUpdatedRole(employee, roleChoices) {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: `Employee who's role will be Updated: `,
          choices: employee
        },
        {
          type: "list",
          name: "role",
          message: "Select New Role: ",
          choices: roleChoices
        },
  
      ]).then((res)=>{
        let query = `UPDATE employees SET role_id = ? WHERE id = ?`
        db.query(query,[ res.role, res.employee],(err, res)=>{
            if(err)throw err;
            startQuestions();
          });
      });
}

// ADD role
function addRole(){
    var sql = 
    `SELECT 
      departments.id, 
      departments.name, 
      roles.salary
    FROM employees
    JOIN roles
      ON employees.role_id = roles.id
    JOIN departments
      ON departments.id = roles.department_id
    GROUP BY departments.id, departments.name`
  
    db.query(sql,(err, res)=>{
      if(err)throw err;
      const department = res.map(({ id, name }) => ({
        value: id,
        name: `${id} ${name}`
      }));
      console.table(res);
      addToRole(department);
    });
}

function addToRole(department){
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Role title: "
        },
        {
          type: "input",
          name: "salary",
          message: "Role Salary: "
        },
        {
          type: "list",
          name: "department",
          message: "Department: ",
          choices: department
        },
      ]).then((res)=>{
        const sql = `INSERT INTO role SET ?`;
  
        db.query(sql, {
            title: res.title,
            salary: res.salary,
            department_id: res.department
        },(err, res)=>{
            if(err) throw err;
            startQuestions();
        });
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Department name: '
            }
        ]).then((res) => {
            const sql = `INSERT INTO departments SET ?`;
            db.query(sql, {name: res.name}, (err, res) => {
            if (err) throw err;
            startQuestions();
        });
    });
}