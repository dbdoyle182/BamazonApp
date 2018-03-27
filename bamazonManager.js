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
        });
    };
    this.viewLowInventory = function () {
        connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res){
            manager.tableBuild(err, res);
        });
    };

};
var newManager = new ManagerTasks();
newManager.viewLowInventory();
module.exports = ManagerTasks;