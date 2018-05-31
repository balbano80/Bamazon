var mysql = require("mysql");
var inquirer = require("inquirer");
var AsciiTable = require("ascii-table");
require("colors");

var totalPurchase = 0;
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Vtecerh22a",
    database: "bamazonDB"
  });

connection.connect(function(err) {
    if (err) throw err;
    menu();
});  // establishes connection to database

function menu(){
    inquirer.prompt({
        type: "list",
        name: "selection",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add new Product", "Exit"]
    }).then(function(response){
        switch(response.selection) {
            case "View Products for Sale":
                console.log("");
                view();
                break;

            case "View Low Inventory":
                console.log("");
                lowInventory();
                break;

            case "Add to Inventory":
                console.log("");
                addInventory();
                break;

            case "Add new Product":
                console.log("");
                addProduct();
                break;

            case "Exit":
                connection.end();
                return 0;
        };
    });
};  // displays menu and runs appropriate function based on user selection

function view(){
    connection.query( "SELECT * FROM products", function(err, res){
        if (err) throw err;
        var table = new AsciiTable("Products");
        table
            .setHeading("id", "Product Name", "Department Name", "Price", "Quantity", "Product Sales");
            for (var i = 0; i < res.length; i++){
                table.addRow(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity, res[i].product_sales);   
            }
        console.log(table.toString());
        menu();
    });
}; // displays product table to user

function lowInventory(){
    connection.query( "SELECT * FROM products WHERE stock_quantity<5", function(err, res){
        if (err) throw err;
        // console.log(res);
        if (res.length === 0){
            console.log("There are no products that currently have low inventory.")
            console.log("");
        }  // returns message if no products have less than 5 items
        else{
            var table = new AsciiTable("Low Inventory");
            table
                .setHeading("id", "Product Name", "Department Name", "Price", "Quantity");
                for (var i = 0; i < res.length; i++){
                    table.addRow(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity);   
                }
            console.log(table.toString());
        } // if there are products with less than 5 items, display table of said products  
        menu();
    });
};  //returns and displays table of products that have less than 5 items in inventory

function addInventory(){
    connection.query( "SELECT * FROM products", function(err, res){
        if (err) throw err;
        var table = new AsciiTable("Products");
        table
            .setHeading("id", "Product Name", "Department Name", "Price", "Quantity");
            for (var i = 0; i < res.length; i++){
                table.addRow(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity);   
            }
        console.log(table.toString()); // displaying table just for visual
        inquirer.prompt([
            {
                type: "input",
                name: "product",
                message: "Please enter in the id of product you would like to add inventory to: ",
                validate: function(value){
                    if (!isNaN(parseInt(value))){
                        return true;
                    }
                    else{
                        return false;
                    }
                } // id selection with input validation
            },
            {
                type: "input",
                name: "quantity",
                message: "How many items would you like to add?",
                validate: function(value){
                    if (isNaN(parseInt(value)) || parseInt(value) <= 0){
                        return false;
                    }
                    else{
                        return true;
                    }
                } // number of items to add input with validation
            }
        ]).then(function(response){
            connection.query("SELECT stock_quantity FROM products WHERE item_id =?", [response.product], function(err, results){
                if (err) throw err;
                var newQuantity = parseInt(results[0].stock_quantity) + parseInt(response.quantity);
                connection.query("UPDATE products SET stock_quantity=? WHERE item_id =?", [newQuantity, response.product], function(err, results){
                    if (err) throw err;
                    console.log("Added " + response.product + " to stock of item with id " + response.product);
                    console.log("New stock quantity: " + newQuantity);
                    menu();  
                });
 
            });
        }); // add number of input items to input product id 
    });
}; // add items of a product to inventory

function addProduct(){
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Please enter the name of the product to add to inventory: "
        },  // name of product input
        {
            type: "input",
            name: "department",
            message: "Please enter in the department of the product to add to inventory: "
        }, // name of department of product to add input
        {
            type: "input",
            name: "price",
            message: "Please enter in the price of the product to add to inventory: ",
            validate: function(value){
                if (!isNaN(parseInt(value)) || parseInt(value) <= 0){
                    return true;
                }
                else{
                    return false;
                }
            }
        }, // price of product to add input with number validation
        {
            type: "input",
            name: "quantity",
            message: "Please enter in the quantity of product to add to inventory: ",
            validate: function(value){
                if (!isNaN(parseInt(value)) || parseInt(value) <= 0){
                    return true;
                }
                else{
                    return false;
                }
            }
        } // number of items of product to add input with number validation
    ]).then(function(newItem){
        connection.query("INSERT INTO products SET ?",
            {
                product_name: newItem.name,
                department_name: newItem.department,
                price: newItem.price,
                stock_quantity: newItem.quantity
            },
            function(err, res){
                console.log(res.affectedRows + " Product inserted")
            }
        ) // inserting into table
        menu();
    })
}; // add a new product to the product table



