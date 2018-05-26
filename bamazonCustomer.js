var mysql = require("mysql");
var inquirer = require("inquirer");

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
    console.log("connected as id " + connection.threadId + "\n");
    readDB();
  });

function readDB(){
    connection.query( "SELECT * FROM bamazonDB", function(err, res){
        if (err){
            throw err;
        }
        console.log(res);
        connection.end(); 
    })
} // reads DB and displays all content in terinal

//TODO use a table displaying package to pretty it up