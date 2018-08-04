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
    this.tableView = function() {
        if (err) throw err;
            var t = new Table({
                horizontalLine: true,
                width: ['20%', '40%', '20%', '20%']
            });
            tableLength = res.length;
            t.push(
                ['ID', 'Product Name', 'Price', 'Quantity']
            );
            for (var i = 0; i < tableLength; i++) {
                t.push(
                    [chalk.blue(res[i].item_id), chalk.yellow(res[i].product_name), chalk.green('$' + (res[i].price).toFixed(2)), chalk.red(res[i].stock_quantity)]
                )
            };
            console.log('Welcome to the inventory management services')
            console.log('' + t)
    }
    // Method that allows the supervisor to see the sales by department
    this.viewDepartmentSales = function () {
        
    };

    // Method that allows the supervisor to create a new department
    this.createDepartment = function() {
        // Function logic
    };
    
    
    
};

// Exports the constructor to any files
module.exports = Supervisor;
