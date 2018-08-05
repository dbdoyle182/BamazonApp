// Require various npm packages
var mysql = require('mysql');
var Table = require('terminal-table');
var chalk = require('chalk');
var inquirer = require('inquirer');
var UserSelect = require('./bamazonCustomer.js')
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'db_bamazon'
});
// Beginning of manager constructor
var ManagerTasks = function () {
    // Variable that allows for call of methods inside of methods
    var manager = this;
    // Places the customer constructor into the manager constructor
    this.newUserSelect = function() {
        var newUser = new UserSelect();
        newUser.connectToDatabase();
    };
    // A function that builds the table that appears in the manager database when viewing inventory
    this.tableBuild = function (err, res) {
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
    };
    // Function that allows the manager to view a table with the inventory, similar to customer with the addition of quantity 
    this.viewInventory = function() {
        connection.query('SELECT * FROM products', function(err, res) {
            manager.tableBuild(err, res);
            manager.endMenu();
        });
    };
    // Same as the above function with a where clause added to the query in order to filter products with a low inventory 
    this.viewLowInventory = function () {
        connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res){
            manager.tableBuild(err, res);
            manager.endMenu();
        });
    };
    // Function that allows the manager to update the inventory of an item
    this.updateInventory = function () {
        inquirer
            .prompt([
                {
                    message: 'What is the ID of the item you wish to update?',
                    name: 'Update'
                },{
                    message: 'How much of the item should there be?',
                    name: 'AddStock'
                }
            ]).then(function(response){
                connection.query('UPDATE products SET ? WHERE ?', [
                    {
                        stock_quantity: parseInt(response.AddStock)
                    },{
                        item_id: parseInt(response.Update)
                    }
                ], function(err, res){
                    if(err) throw err;
                    console.log('The item has been updated')
                    manager.endMenu();
                });
            });
    };

    // Function grabs all department names and returns an array with them
    this.grabDepartmentNames = function() {
        const departmentnames = [];
        connection.query("SELECT department_name FROM departments" , function(err, res){
            
            if (err) throw err;
            
            for (let name in res) {
                departmentnames.push(res[name].department_name)
            }
        })
        return departmentnames;
    }
    // Function that allows the manager to add a new item
    this.addNewItem = function() {
        inquirer
            .prompt([
                {
                    message: 'What is the name of the item?',
                    name: 'Item'
                },{
                    type: 'list',
                    message: 'What department is this found in?',
                    choices: manager.grabDepartmentNames(),
                    name: 'Department'
                },{
                    message: 'How much does this item cost?',
                    name: 'Price'
                },{
                    message: 'How much of the item is in stock?',
                    name: 'Quantity'
                }
            ]).then(function(response) {
                // Passes the responses into the database in their corresponding positions
                connection.query('INSERT INTO products SET ?', 
            {
                product_name: response.Item,
                department_name: response.Department,
                price: parseFloat(response.Price),
                stock_quantity: parseInt(response.Quantity)
            }, function(err, res) {
                if (err) throw err;
                console.log('Your item was sucessfully added')
                manager.endMenu();
            })
        })
    };
    // Function for the manager menu that lists the actions that can be performed
    this.managerMenu = function () {
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'What task would you like to perform?',
                    choices: ['View Inventory','View Low Inventory','Update Inventory','Add a new item','Quit'],
                    name: 'Option'
                }
            ]).then(function(response){
                switch (response.Option) {
                    case 'View Inventory':
                        manager.viewInventory();
                        break;
                    case 'View Low Inventory':
                        manager.viewLowInventory();
                        break;
                    case 'Update Inventory':
                        manager.updateInventory();
                        break;
                    case 'Add a new item':
                        manager.addNewItem();
                        break;
                    default: 
                        connection.end();
                }
            })
    };
    // Function that allows for the recursion of the manager application and otherwise ends connection
    this.endMenu = function() {
        inquirer
            .prompt([
                {
                    type: 'confirm',
                    message: 'Would you like to return to the manager menu?',
                    default: true,
                    name: 'confirm'
                }
            ]).then(function(response) {
                if (response.confirm) {
                    manager.managerMenu();
                } else {
                    console.log('Thank you for using the management interface');
                    connection.end();
                }
            })
    }

};

// Exports the manager constructor
module.exports = ManagerTasks;