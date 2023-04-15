/*****************MYSQL msqlDbConnection*********************/
var msqlDbConnection = require("../db.js");
var jwt = require("jsonwebtoken");
var express = require("express");
var app = express();

var config = require("../config");
app.set('superSecret', config.secret);

 // used to create, sign, and verify tokens
var userModel = require("../model/userModel.js"); 




/************************************* */


exports.login = (req,res)=>{
    var email= req.body.email;
    var password = req.body.password;

  
    var sql = 'SELECT clientprofile.name,clientprofile.clientid,clientcontacts.email,clientcontacts.passwd,clientcontacts.contactid as contactid FROM clientcontacts join clientprofile on clientcontacts.clientid = clientprofile .clientid WHERE clientprofile.Status !=372 and clientcontacts.email = ? and clientcontacts.passwd = ? ';
    
    msqlDbConnection.query(sql,[email,password], function (error, results, fields) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      // console.log('The solution is: ', results);
      if(results.length >0){
        if(results[0].passwd == password){
//insert user login to log // for geniesis request dated: 01 Jan 2022
userModel.insertMany( { "email": results[0].email, "contactid": results[0].contactid , "logintime" : new Date(Date.now()) } );

            const payload = {
                admin: email 
              };

          
    

        var token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn : 60*60*24 // expires in 24 hours
        });


          res.send({
            "code":200,
            token : token,
            result : email,
            clientid : results[0].clientid,
            "success":"1"
              });
        }
        else{
          res.send({
            "code":204,
            "success":"Email and password does not match"
              });
        }
      }
      else{
        
        res.send({
          "code":204,
          "success":"Email does not exits"
            });
      }
    }
    });
}


 