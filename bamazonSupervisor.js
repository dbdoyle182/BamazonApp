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
    this.newCustomer = function() {
        var newCustomer = new UserSelect();
        newCustomer.connectToDatabase();
    };
    // Method for running the manager constructor
    this.newManager = function () {
        var newManager = new ManagerSelect();
        newManager.managerMenu();
    };
    // Method to display the full table and products
    this.tableViewAll = function() {
        connection.query('SELECT * FROM products', function(err, res) {
            
            if (err) throw err;
                var t = new Table({
                    horizontalLine: true,
                    width: ['10%', '30%', '10%', '10%','20%','10%','10%']
                });
                tableLength = res.length;
                t.push(
                    ['ID', 'Product Name', 'Price', 'Quantity','Department','Items Bought','Total Sales']
                );
                for (var i = 0; i < tableLength; i++) {
                    t.push(
                        [chalk.blue(res[i].item_id), chalk.yellow(res[i].product_name), chalk.green('$' + (res[i].price).toFixed(2)), chalk.red(res[i].stock_quantity), chalk.red(res[i].department_name), chalk.red(res[i].item_bought),chalk.red(`$${res[i].item_sales.toFixed(2)}`)]
                    )
                };
                console.log('Welcome to the supervisor management services')
                console.log('' + t)
        });
    }

    // Method that allows the supervisor to see the sales by department
    this.viewDepartmentSales = function () {
        
    };

    // Method that allows the supervisor to create a new department
    this.createDepartment = function() {
        // Function logic
    };
    
    
    
};
// var NewSupervisor = new Supervisor();
// NewSupervisor.tableViewAll();
// Exports the constructor to any files
module.exports = Supervisor;
