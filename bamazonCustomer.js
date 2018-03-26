var mysql = require('mysql');
var Table = require('terminal-table');
var chalk = require('chalk');
var inquirer = require('inquirer');
var tableLength;
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'taffy182!',
    database: 'db_bamazon'
});
var UserSelect = function() {

    var self = this;

    this.afterConnection = function() {
        connection.query('SELECT * FROM products', function(err, res) {
            if (err) throw err;
            var t = new Table({
                horizontalLine: true,
                width: ['20%', '50%', '30%']
            });
            tableLength = res.length;
            t.push(
                ['ID', 'Product Name', 'Price']
            );
            for (var i = 0; i < tableLength; i++) {
                t.push(
                    [chalk.blue(res[i].item_id), chalk.yellow(res[i].product_name), chalk.green('$' + res[i].price)]
                )
            };
            console.log('WELCOME TO BAMAZON');
            console.log('' + t);
            self.customerPrompt();
        })
    };

    this.updateQuantity = function(newQuantity, newID) {
        connection.query('UPDATE products SET ? WHERE ?', [
            {
                stock_quantity: newQuantity
            },{
                item_id: newID
            }
        ], function(err, result) {
            if (err) throw err;
            
        })
    };

    this.shopAgain = function() {
        inquirer
            .prompt([{
                type: 'confirm',
                message: 'Would you like to continue shopping?',
                name: 'confirm',
                default: true
            }]).then(function(response) {
                if (response.confirm) {
                    self.customerPrompt();
                } else {
                    console.log(chalk.bgMagenta("Have a wonderful day!"));
                    connection.end();
                }
            })
    };

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
                        if(input < 1 || input > (tableLength) || typeof input != 'number') {
                            return "Please choose a valid product ID"
                        }
                        return true;
                    },
                },{
                    message: "How many would you like to purchase?",
                    name: "quantity",
                    validate: function(input) {
                        if(typeof input != "number") {
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
                        var newQuantity = parseInt(res[0].stock_quantity - response.quantity);
                        var newID = parseInt(response.product_id);
                        self.updateQuantity(newQuantity, newID);
                        console.log("Thanks for your order, the total of the purchase is $ " + res[0].price * response.quantity)
                        self.shopAgain();
                    }
            })
        })
    };

    this.connectToDatabase = function () {
        connection.connect(function(err) {
            if (err) throw err;
            self.afterConnection();
        });
    };

};

var UserSelect = new UserSelect();
UserSelect.connectToDatabase();
