var mysql = require('mysql');
var Table = require('terminal-table');
var chalk = require('chalk');
var inquirer = require('inquirer');
var ManagerTasks = require('./bamazonManager.js')
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'taffy182!',
    database: 'db_bamazon'
});
var positionOfUser = 'customer';

if (positionOfUser === 'customer') {
    var newCustomer = new ManagerTasks();
    newCustomer.newUserSelect();
}