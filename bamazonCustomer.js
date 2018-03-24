var mysql = require('mysql');
var Table = require('terminal-table');
var chalk = require('chalk');
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
});

function afterConnection() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        var t = new Table({
            horizontalLine: true,
            width: ['20%', '50%', '30%']
        });
        t.push(
            ['ID', 'Product Name', 'Price']
        );
        for (var i = 0; i < res.length; i++) {
            t.push(
                [chalk.blue(res[i].item_id), chalk.yellow(res[i].product_name), chalk.green('$' + res[i].price)]
            )
        };
        console.log('WELCOME TO BAMAZON');
        console.log('' + t);
        connection.end();
    })
}