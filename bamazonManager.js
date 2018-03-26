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
        console.log(UserSelect);
    };

}

var newManagerTasks = new ManagerTasks();
newManagerTasks.newUserSelect();