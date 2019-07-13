var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table")
require('dotenv').config();

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.SECRET_USER,
    password: process.env.SECRET_KEY,
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    runSearch();
});

function runSearch() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would like to do?",
        choices: [
            "Make a purchase",
            "Exit"
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "Make a purchase":
                itemsForSale();
                break;

            case "Exit":
                connection.end();
                break;
        }
    })
}

function itemsForSale() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var arrayTable = [];
        for (var i = 0; i < res.length; i++) {
            arrayTable.push(
                {
                    Id: res[i].id,
                    Item: res[i].product_name,
                    Price: res[i].price
                }
            )
        }
        console.table(arrayTable)
        getAction();

    })
}

function getAction() {
    inquirer.prompt([{
        name: "purchaseId",
        type: "number",
        message: "What is the id of the item you'd like to purchase?",
    }, {
        name: "quantity",
        type: "input",
        message: "How much would you like to purchase?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }
    ]).then(function (answer) {
            connection.query("SELECT * FROM products WHERE ?", { id: answer.purchaseId }, function (err, res) {
                var chosenItem = answer.purchaseId;
                var newQuantity = res[0].stock_quantity - answer.quantity;
                var totalPrice = answer.quantity * res[0].price
                if (res[0].stock_quantity < answer.quantity) {
                    console.log("\nNot enough stock! \n")
                    runSearch();
                } else {
                    console.log("\nUpdating stock...\n");
                    var sql = "UPDATE products SET stock_quantity = " + newQuantity + " WHERE id = " + chosenItem;
                    connection.query(sql, function (err, res) {
                        if (err) throw err
                        console.log(res.affectedRows + " purchase has been completed! Your total was $" + totalPrice + ".00\n");
                        runSearch();
                    });
                }
            });
        })
}