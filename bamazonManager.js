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
        message: "\nWhat would like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                newProduct();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var arrayTable = [];
        for (var i = 0; i < res.length; i++) {
            arrayTable.push(
                {
                    Id: res[i].id,
                    Item: res[i].product_name,
                    Department: res[i].department_name,
                    Price: res[i].price,
                    Stock: res[i].stock_quantity

                }
            )
        }
        console.table(arrayTable)
        runSearch();

    })
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 10", function (err, res) {
        if (err) throw err;
        var arrayTable = [];
        for (var i = 0; i < res.length; i++) {
            arrayTable.push(
                {
                    Id: res[i].id,
                    Item: res[i].product_name,
                    Department: res[i].department_name,
                    Price: res[i].price,
                    Stock: res[i].stock_quantity

                }
            )
        }
        console.table(arrayTable)
        runSearch();

    })
}

function addInventory() {
    inquirer.prompt([{
        name: "itemId",
        type: "input",
        message: "\nWhat is the id of the item you'd like to add more stock to?\n?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }, {
        name: "quantity",
        type: "number",
        message: "How much stock would you like to add?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }
    ]).then(function (answer) {
        connection.query("SELECT * FROM products WHERE ?", { id: answer.itemId }, function (err, res) {
            var chosenItem = answer.itemId;
            var newQuantity = res[0].stock_quantity + answer.quantity;
            var sql = "UPDATE products SET stock_quantity = " + newQuantity + " WHERE id = " + chosenItem;
            connection.query(sql, function (err, res) {
                if (err) throw err
                console.log("\n" + res.affectedRows + " item has been restocked!\n");
                runSearch();
            });

        });
    });
}

function newProduct() {
    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "\nWhat is the name of the new product?\n?",
    }, {
        name: "department",
        type: "input",
        message: "\nWhat department does the new product belong in?\n?",
    },{
        name: "price",
        type: "number",
        message: "\nWhat is the products price?\n?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    },
    {
        name: "quantity",
        type: "number",
        message: "How much stock do we have?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }
    ]).then(function (answer) {
        console.log("Inserting a new product...\n");
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.name,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " product inserted!\n");
                runSearch();
            }
        );
    })

}