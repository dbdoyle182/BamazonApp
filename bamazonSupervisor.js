// Creates variables for all of the npm packages required
var UserSelect = require('./bamazonCustomer');
var ManagerSelect = require('./bamazonManager');
var mysql = require('mysql');
var Table = require('terminal-table');
var chalk = require('chalk');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'db_bamazon'
});


// Creates a constructor function that will have all of the available methods for the supervisor
var Supervisor = function () {
    // Variable to control the context of this
    var supervisor = this;

    //Place the customer constructor into the supervisor
    this.newCustomer = function () {
        var newCustomer = new UserSelect();
        newCustomer.connectToDatabase();
    };
    // Method for running the manager constructor
    this.newManager = function () {
        var newManager = new ManagerSelect();
        newManager.managerMenu();
    };

    // Method to create the table

    this.createTable = function(err, res) {
        if(err) throw err;
            
            var t = new Table({
                horizontalLine: true,
                width: ["10%","30%","20%","20%","20%"]
            });
            t.push(
                ["ID","Name","Overhead Costs","Product Sales","Total Profit"]
            );
            for (let item in res) {
                console.log(res[item])
                t.push([chalk.red(res[item].department_id), chalk.blue(res[item].department_name), chalk.magenta(res[item].over_head_costs), chalk.yellow(res[item].product_sales), chalk.green(res[item].total_profit)])
            }
            console.log("Welcome to Supervisor Department management")
            console.log('' + t)
            supervisor.promptSupervisor()
    }
    // Method to display the full table and products
    this.tableViewAll = function () {
        connection.query('SELECT * FROM products', function (err, res) {

            if (err) throw err;
            var t = new Table({
                horizontalLine: true,
                width: ['10%', '30%', '10%', '10%', '20%', '10%', '10%']
            });
            tableLength = res.length;
            t.push(
                ['ID', 'Product Name', 'Price', 'Quantity', 'Department', 'Items Bought', 'Total Sales']
            );
            for (var i = 0; i < tableLength; i++) {
                t.push(
                    [chalk.blue(res[i].item_id), chalk.yellow(res[i].product_name), chalk.green('$' + (res[i].price).toFixed(2)), chalk.red(res[i].stock_quantity), chalk.red(res[i].department_name), chalk.red(res[i].item_bought), chalk.red(`$${res[i].item_sales.toFixed(2)}`)]
                )
            };
            console.log('Welcome to the supervisor management services')
            console.log('' + t)
            supervisor.promptSupervisor()
        });
    }

    // Method to view a table of departments and sales
    this.tableViewDepartments = function () {
        connection.query("SELECT departProd.department_id, departProd.department_name, departProd.over_head_costs, SUM(departProd.product_sales) as product_sales, (SUM(departProd.product_sales) - departProd.over_head_costs) as total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.item_sales, 0) as product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as departProd GROUP BY department_id", function (err, res) {
            supervisor.createTable(err, res)
        })
    }

    // Method that allows the supervisor to see the sales by department
    this.viewDepartmentSales = function () {
        const departmentnames = [];
        connection.query("SELECT department_name FROM departments" , function(err, res){
            
            if (err) throw err;
            
            for (let name in res) {
                departmentnames.push(res[name].department_name)
            }
            inquirer
                .prompt([{
                    type: 'list',
                    message: 'Which department did you want to check?',
                    choices: departmentnames, 
                    name: 'Department'
                }]).then(function(answer) {
                    console.log(answer.Department)
                    connection.query(
                        "SELECT departProd.department_id, departProd.department_name, departProd.over_head_costs, SUM(departProd.product_sales) as product_sales, (SUM(departProd.product_sales) - departProd.over_head_costs) as total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.item_sales, 0) as product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as departProd WHERE department_name = '" + answer.Department + "' GROUP BY department_id",
                        function(err, res) {
                        supervisor.createTable(err, res)
                        
                        })
            })
        
        })
        
    };

    // Method that allows the supervisor to create a new department
    this.createDepartment = function () {
        inquirer
            .prompt([{
                name: "name",
                message: "What is the department name?",
                validate: function(input) {
                    if(input.length < 1) {
                        return "Please enter a department name"
                    }
                    return true;
                }
            },
            {
                name: "overhead",
                message: "What is the overhead cost?",
                validate: function(input) {
                    if(isNaN(input)) {
                        return "Please enter a numeric value for quantity"
                    }
                    return true; 
                },
                filter: function(input) {
                    return parseInt(input)
                }
            }
        ]).then(function(val){
            connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)",
            [val.name, val.overhead], 
            function(err, res) {
                if (err) throw err;

                console.log("Thanks for adding this department!");
                supervisor.promptSupervisor();
            })
        });
        
    };

    // Method that creates the supervisor menu
    this.promptSupervisor = function () {
        inquirer
            .prompt([{
                type: "list",
                name: "choice",
                message: "What would you like to do?",
                choices: ["View All Products", "View All Departments", "View Product Sales by Department", "Create New Department", "Quit"]
            }])
            .then(function (answer) {
                // Checking to see what option the user chose and running the appropriate function
                switch (answer.choice) {
                    case "View All Products":
                        supervisor.tableViewAll();
                        break;
                    case "View All Departments":
                        supervisor.tableViewDepartments();
                        break;
                    case "View Product Sales by Department":
                        supervisor.viewDepartmentSales();
                        break;
                    case "Create New Department":
                        supervisor.createDepartment();
                        break;
                    case "Quit":
                        connection.end();
                        break;
                    default:
                        console.log("How?");
                        break;
                }
            });
    }



};

// NewSupervisor.tableViewAll();
// Exports the constructor to any files
module.exports = Supervisor;