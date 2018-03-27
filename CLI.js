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
var newUser = new ManagerTasks();
inquirer
    .prompt([
        {
            type: 'list',
            message: 'Welcome to Bamazon, who are you?',
            name: 'position',
            choices: ['Customer', 'Manager']
        }
    ]).then(function(response) {
        switch (response.position) {
            case 'Customer':
            newUser.newUserSelect();
            break;
            case 'Manager':
            newUser.managerMenu();
            break;
            default:
            console.log('What did you do?')
            
        }
    })

