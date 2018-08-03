// Creates variables for all of the npm packages required
var bamazonManager = require('./bamazonManager');


// Creates a constructor function that will have all of the available methods for the supervisor
var Supervisor = function () {
    // Method that allows the supervisor to see the sales by department
    this.viewDepartmentSales = function () {
        // Function logic
    };

    // Method that allows the supervisor to create a new department
    this.createDepartment = function() {
        // Function logic
    };
    // Method for running the manager constructor
    this.newManager = function () {
        // Function logic
    };
    // Method for running the customer constructor
    this.newCustomer = function () {
        // Function logic
    };
};

// Exports the constructor to any files
module.exports = Supervisor;
