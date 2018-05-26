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
    if (err){
        throw err;
    } 
    // console.log("connected as id " + connection.threadId + "\n");
    readDB();
  });  // establishes connection to database and fires off readDB function

function buyProducts(){
    inquirer.prompt([
        {
            type: "input",
            name: "product",
            message: "Please enter in the id of product you would like to buy: ",
            validate: function(value){
                if (!isNaN(parseInt(value))){
                    return true;
                }
                else{
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many would you like to buy? ",
            validate: function(value){
                if (!isNaN(parseInt(value)) || parseInt(value) <= 0){
                    return true;
                }
                else{
                    return false;
                }
            }
        }
    ]).then(function(response){
        quantityUpdate(response.product, parseInt(response.quantity));
    })
}; // asks user what item number they would like to purchase and the quantity
   // validates for both that they are a number and not negative
   // fires off quantityUpdate function with user's responses as arguments

function readDB(){
    connection.query( "SELECT * FROM products", function(err, res){
        if (err){
            throw err;
        }
        var table = new AsciiTable("Products");
        table
            .setHeading("id", "Product Name", "Department Name", "Price", "Quantity");
            for (var i = 0; i < res.length; i++){
                table.addRow(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity);   
            }
        console.log(table.toString());
        buyProducts();
    })

}; // reads from DB, displays all content in terminal and fires off buyProducts function

function quantityUpdate(id, quantity){
    connection.query("SELECT stock_quantity, price FROM products WHERE item_id =?", [id], function(err, results){
        // console.log(results[0].stock_quantity);
        // console.log(results[0].price);
        if (quantity > results[0].stock_quantity){
            console.log("Insufficient Inventory!".red);
            console.log("Please try again from the below inventory.")
            console.log("");
            readDB();
        }
        else{
            var newQuantity = results[0].stock_quantity - quantity;
            totalPurchase += (quantity * results[0].price);
            plusTax = totalPurchase * 1.0875;
            connection.query("UPDATE products SET stock_quantity=? WHERE item_id =?", [newQuantity, id], function(err, results){
                if (err) throw err;
                console.log("Purchase successful".green);
                 console.log("Total purchase(with tax): $" + plusTax.toFixed(2));
                 console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - -".rainbow);
                 console.log("");
                anotherPurchase();
            })
        }
    });
}; // checks if quantity passed through is higher or lower than inventory for user selected item id
   // if higher, lets user know not enough inventory and brings up inventory and purchase option again(readDB function)
   // else, subtracts user quantity from inventory number and updates the inventory at that item id
    // also informs the user of their total purchase so far, including tax
    // fires anotherPurchase function 

function anotherPurchase(){
    inquirer.prompt({
        type: "confirm",
        name: "another",
        message: "Would you like to make another purchase?"
        }
    ).then(function(res){
        if (res.another === true){
            readDB();
        }
        else{
            connection.end();
            return 0;
        }
    });
}; // runs inquirer to ask if they want to make another purchase
   // if yes, runs through readDB function again
   //else, terminates connection to DB and ends application
