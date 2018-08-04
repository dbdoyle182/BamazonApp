// Requiring all of the various npm packages and global variables
var mysql = require('mysql');
var Table = require('terminal-table');
var chalk = require('chalk');
var inquirer = require('inquirer');
var tableLength;
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'db_bamazon'
});

// Constructor that builds the customer object
var UserSelect = function() {
    // Stores this referring to the constructor variable to enable recursion
    var self = this;
    // This creates the table that appears in the customer interface
    this.afterConnection = function() {
        // Querying the database to present all products
        connection.query('SELECT * FROM products', function(err, res) {
            if (err) throw err;
            var t = new Table({
                horizontalLine: true,
                width: ['20%', '50%', '30%']
            });
            // Reassigns table length variable to match the current length of the database response
            tableLength = res.length;
            t.push(
                ['ID', 'Product Name', 'Price']
            );
            // Loops through query results to push individual items into our table
            for (var i = 0; i < tableLength; i++) {
                var num = (res[i].price).toFixed(2);
                console.log(num)
                t.push(
                    [chalk.blue(res[i].item_id), chalk.yellow(res[i].product_name), chalk.green('$ ' + num)]
                )
            };
            console.log('WELCOME TO BAMAZON');
            console.log('' + t);
            // This calls the function which customers can purchase items
            self.customerPrompt();
        })
    };
    // Function that updates the database after a customer purchases an item
    this.updateQuantity = function(newQuantity, newID, purchased, sales) {
        connection.query('UPDATE products SET ? WHERE ?', [
            {
                stock_quantity: newQuantity,
                item_bought: purchased,
                item_sales: sales
            },{
                item_id: newID
            }
        ], function(err, result) {
            if (err) throw err;
            
        })
    };
    // Function that allows recursion so customers may continue to shop for as long as they like
    this.shopAgain = function() {
        inquirer
            .prompt([{
                type: 'confirm',
                message: 'Would you like to continue shopping?',
                name: 'confirm',
                default: true
            }]).then(function(response) {
                // If they select yes then rerun the application if no exit the application
                if (response.confirm) {
                    self.customerPrompt();
                } else {
                    console.log(chalk.bgMagenta("Have a wonderful day!"));
                    connection.end();
                }
            })
    };
    // Function for the prompt that collects customer selection and performs appropriate actions with the response
    this.customerPrompt = function() {
        inquirer
            .prompt ([
                {
                    message: "Which product would you like to purchase?",
                    name: "product_id",
                    filter: function(input) {
                        return parseInt(input);
                    },
                    validate: function(input) {
                        if(input < 1 || input > (tableLength) || isNaN(input)) {
                            return "Please choose a valid product ID"
                        }
                        return true;
                    },
                },{
                    message: "How many would you like to purchase?",
                    name: "quantity",
                    validate: function(input) {
                        if(isNaN(input)) {
                            return "Please enter a numeric value for quantity"
                        }
                        return true; 
                    },
                    filter: function(input) {
                        return Math.abs(input)
                    }
                    
                }
            ]).then(function(response){
                connection.query('SELECT * FROM products WHERE ?', {item_id: response.product_id}, function(err, res) {
                    if (err) throw err;
                    if (res[0].stock_quantity < response.quantity) {
                        console.log(chalk.red("Not enough of the product in stock, SORRY!"));
                        self.shopAgain();
                    } else {
                        console.log(chalk.yellow("We have that in stock!"));
                        // Creates a variable with updated stock quantity
                        var newQuantity = parseInt(res[0].stock_quantity - response.quantity);
                        // Creates a variable that holds the customers selected item id
                        var newID = parseInt(response.product_id);
                        // Creates a variable with updated total purchased of an item (All time)
                        var purchased = parseInt(res[0].item_bought) + parseInt(response.quantity);
                        // Creates a variable with updated total sales of an item (All time; In dollars)
                        var sales = parseInt(res[0].item_sales) + parseInt(res[0].price * response.quantity);
                        // Calls previous function and passes arguments provided by the previous query
                        self.updateQuantity(newQuantity, newID, purchased, sales);
                        console.log("Thanks for your order, the total of the purchase is $ " + res[0].price * response.quantity)
                        self.shopAgain();
                    }
            })
        })
    };
    // Function that establishes connection to the database
    this.connectToDatabase = function () {
        connection.connect(function(err) {
            if (err) throw err;
            self.afterConnection();
        });
    };

};


// Exports this constructor for use in other JavaScript files
module.exports = UserSelect;
