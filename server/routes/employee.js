var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');


if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/employee_DB';
}

router.get("/", function(req,res){

  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("Hey man, we couldn't read anything from your employee_table, sorry :(");
      res.status(500).send(err);
    }else{
      var result = [];

      var query = client.query('SELECT * FROM employee_table');
      query.on('row', function(row){
        done();
        result.push(row);
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ', err);
        res.status(500).send(err);
      });
      query.on('end',function(end){
        done();
        res.send(result);
      });
    }
  });
});

router.post("/", function(req,res){

  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("Hey man, we couldn't read anything from your employee_table, sorry :(");
      res.status(500).send(err);
    }else{
      var result = [];
      var name = req.body.name;
      var number = req.body.number;
      var job = req.body.job;
      var salary = req.body.salary;
      var query = client.query(
                      'INSERT INTO employee_table (name, number, job, salary) VALUES ($1, $2, $3, $4)'+
                      'RETURNING id, active, name, number, job, salary',
                      [name,number,job,salary]);
      query.on('row', function(row){
        done();
        result.push(row);
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ', err);
        res.status(500).send(err);
      });
      query.on('end',function(end){
        done();
        console.log("Done sending: ", result);
        res.send(result);
      });
    }
  });
});

router.put("/deactivate", function(req,res){

  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("Hey man, couldn't update your stuff :(");
      res.status(500).send(err);
    }else{
      console.log("Attempting to change: "+ req.body.id);
      var result = [];
      var id = req.body.id;
      var query = client.query('UPDATE employee_table ' +
                               "SET active='false' " +
                               'WHERE id = ($1) '+
                               'RETURNING id, name, job, salary;', [id]);
      query.on('row', function(row){
        done();
        result.push(row);
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ', err);
        res.status(500).send(err);
      });
      query.on('end',function(end){
        done();
        console.log(result);
        res.send(result);
      });
    }
  });
});

router.put("/reactivate", function(req,res){

  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("Hey man, couldn't update your stuff :(");
      res.status(500).send(err);
    }else{
      console.log("Attempting to change: "+ req.body.id);
      var result = [];
      var id = req.body.id;
      var query = client.query('UPDATE employee_table ' +
                               "SET active='true' " +
                               'WHERE id = ($1) RETURNING id, name, job, salary, active;' , [id]);
      query.on('row', function(row){
        done();
        result.push(row);
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ', err);
        res.status(500).send(err);
      });
      query.on('end',function(end){
        done();
        res.send(result);
      });
    }
  });
});


module.exports = router;
