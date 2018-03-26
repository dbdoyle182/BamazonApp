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

connection.connect(function(err) {
    if (err) throw err;
    afterConnection();
    connection.end();
});

function afterConnection() {
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
        customerPrompt();
    })
}

function customerPrompt () {
    inquirer
        .prompt ([
            {
                message: "Which product would you like to purchase?",
                name: "product_id",
                validate: function(input) {
                    if(input < 1 || input > (tableLength + 1)) {
                        return "Please choose a valid product ID"
                    }
                    return true;
                }
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
            console.log(response.product_id + "\n" + response.quantity);
            }
        )
}