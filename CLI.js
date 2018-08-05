// Creates variables that hold the various npm packages required
var inquirer = require('inquirer');
var SupervisorTasks = require('./bamazonSupervisor')
// Creates an object that holds all of the exported methods
var newUser = new SupervisorTasks();
// The start menu that asks who the user is
inquirer
    .prompt([
        {
            type: 'list',
            message: 'Welcome to Bamazon, who are you?',
            name: 'position',
            choices: ['Customer', 'Manager', 'Supervisor','Quit']
        }
    ]).then(function(response) {
        switch (response.position) {
            case 'Customer':
            // Runs the customer interface
            newUser.newCustomer();
            break;
            case 'Manager':
            // Runs the manager interface
            newUser.newManager();
            break;
            case 'Supervisor':
            newUser.promptSupervisor()
            break;
            default:
            connection.end();
        }
    });

