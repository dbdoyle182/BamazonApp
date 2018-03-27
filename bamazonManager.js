var mysql = require('mysql');
var Table = require('terminal-table');
var chalk = require('chalk');
var inquirer = require('inquirer');
var UserSelect = require('./bamazonCustomer.js')
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'taffy182!',
    database: 'db_bamazon'
});

var ManagerTasks = function () {
    var manager = this;
    this.newUserSelect = function() {
        var newUser = new UserSelect();
        newUser.connectToDatabase();
    };
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
                    [chalk.blue(res[i].item_id), chalk.yellow(res[i].product_name), chalk.green('$' + res[i].price), chalk.red(res[i].stock_quantity)]
                )
            };
            console.log('Welcome to the inventory management services')
            console.log('' + t)
    }
    this.viewInventory = function() {
        connection.query('SELECT * FROM products', function(err, res) {
            manager.tableBuild(err, res);
            manager.endMenu();
        });
    };
    this.viewLowInventory = function () {
        connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res){
            manager.tableBuild(err, res);
            manager.endMenu();
        });
    };
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
    this.addNewItem = function() {
        inquirer
            .prompt([
                {
                    message: 'What is the name of the item?',
                    name: 'Item'
                },{
                    type: 'list',
                    message: 'What department is this found in?',
                    choices: ['Electronics','Pet Goods', 'Appliances', 'Baby Products', 'Clothing', 'Home Improvement', 'Medicine', 'Toys and Games', 'Home Decor'],
                    name: 'Department'
                },{
                    message: 'How much does this item cost?',
                    name: 'Price'
                },{
                    message: 'How much of the item is in stock?',
                    name: 'Quantity'
                }
            ]).then(function(response) {
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
    }
    this.managerMenu = function () {
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'What task would you like to perform?',
                    choices: ['View Inventory','View Low Inventory','Update Inventory','Add a new item'],
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
                    default: console.log('Something went terribly wrong')
                }
            })
    };
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
var newManager = new ManagerTasks();
newManager.managerMenu();
module.exports = ManagerTasks;