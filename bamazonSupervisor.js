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

connection.connect(function(err){
if (err) throw err;
// console.log("connected as id " + connection.threadId + "\n");
menu();
});  // establishes connection to database and fires off menu function

function menu(){
    inquirer.prompt({
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: ["View Product Sales by Department", "Create New Department", "Exit"]
    }).then(function(response){
        if (response.choice === "View Product Sales by Department"){
            departmentRead();
        }
        else if (response.choice === "Create New Department"){
            addDepartment();
        }
        else{
            connection.end();
            return 0;
        }
    });
}; // displays menu options and runs appropriate function based on user selection

function departmentRead(){
    connection.query( "SELECT * FROM departments", function(err, res){
        // console.log(res);
        if (err) throw err;
        var salesArr = [];   
        var query ="SELECT product_sales, products.department_name FROM products INNER JOIN departments ON products.department_name = departments.department_name";
        connection.query(query, function(err, response){
            if (err) throw err;
            // console.log(response);
            for (var i = 0; i < res.length; i++){
                var tempSales = 0.00;
                // console.log("Department: " + res[i].department_name);
                for (var j = 0; j < response.length; j++){
                    if (response[j].department_name === res[i].department_name){
                        tempSales+= parseFloat(response[j].product_sales);
                        // console.log(tempSales);
                    } // if department_name of department array object = department_name of products array object
                      // add to tempSales
                } // looping through products return array
                salesArr.push(tempSales);  // once going through all of products array, push the tempSales figure into salesArr array
                // console.log(salesArr);
            } // looping through department return array
            var profitArr = [];
            for (var k = 0; k < res.length; k++){
                var tempProfit = salesArr[k] - parseFloat(res[k].over_head_costs);
                profitArr.push(tempProfit);
            } // computing profit for each department and pushing to profitArr array
            var table = new AsciiTable("Department Overview");
            table
                .setHeading("Department ID", "Department Name", "Over Head Costs", "Product Sales", "Total Profit");
                for (var i = 0; i < res.length; i++){
                    table.addRow(res[i].department_id, res[i].department_name, res[i].over_head_costs, salesArr[i].toFixed(2), profitArr[i].toFixed(2)); 
                }  // creating visual table
            console.log(table.toString());
            menu();
        });
    });
};  //creates visual table with appropriate values 

function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department to add: "
        },
        {
            type: "input",
            name: "overhead",
            message: "What is the over head costs for the deparment to add: "
        }     
    ]).then(function(response){
        connection.query("INSERT INTO departments SET ?",
        {
            department_name: response.name,
            over_head_costs: response.overhead,
        },
        function(err, res){
            console.log(res.affectedRows + " Department inserted")
        }
    )
    menu();
    });
}; // add department to departments table