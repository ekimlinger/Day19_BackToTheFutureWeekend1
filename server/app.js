//********************************************************//
//********** THE ALL-MIGHTY SERVER/APP.JS ****************//
//********************************************************//

var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var pg = require('pg');
var employeeRouter = require('./routes/employee.js');



// Sets up database upon nonexistence
var connectionString;

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/employee_DB';
}

//*********** CONNECTS TO DB TO CREATE TABLES ***********//
pg.connect(connectionString, function(err, client,done){
  if (err){
    console.log('Error connecting to the DB, yall: ', err)
  } else{
    var query = client.query(

      //  CREATES employee_table,
      //          columns:        id, name, number, job, salary

      'CREATE TABLE IF NOT EXISTS employee_table (' +
      'id SERIAL PRIMARY KEY,'+
      "active BOOLEAN NOT NULL DEFAULT 'true',"+
      'name varchar(80) NOT NULL,' +
      'number INTEGER NOT NULL,'+
      'job varchar(80) NOT NULL,'+
      'salary INTEGER NOT NULL);'
    );

    query.on('end',function(){
      done();
      console.log('Successfully ensured our tables exist, OHHHH YEEEAAAAA!');
    });

    query.on('error', function(){
      done();
      console.log('Error creating your tables for you, you should probably do something about that...');
    });
  }
});


// ^^^^Database stuff up there^^^^      //

//******************************************************//



// vvvvvv App stuff down here vvvvvvv   //


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/employee",employeeRouter);


app.set("port",(process.env.PORT || 5000));

app.get("/*", function(req,res){
  var file = req.params[0] || "/views/index.html";
  res.sendFile(path.join(__dirname,"/public/", file));
});

app.listen(app.get("port"),function(){
  console.log("Listening on port: ", app.get("port"));
});

module.exports = app;
