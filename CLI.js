// Creates variables that hold the various npm packages required
var mysql = require('mysql');
var Table = require('terminal-table');
var chalk = require('chalk');
var inquirer = require('inquirer');
var ManagerTasks = require('./bamazonManager.js')
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'db_bamazon'
});
// Creates an object that holds all of the exported methods
var newUser = new ManagerTasks();
// The start menu that asks who the user is
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
            // Runs the customer interface
            newUser.newUserSelect();
            break;
            case 'Manager':
            // Runs the manager interface
            newUser.managerMenu();
            break;
            default:
            console.log('What did you do?')
            
        }
    });

