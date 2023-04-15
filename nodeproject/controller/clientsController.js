/*****************MYSQL msqlDbConnection*********************/
var jwt = require("jsonwebtoken");
var express = require("express");
var app = express();
var msqlDbConnection = require("../db.js");
var config = require("../config");
app.set('superSecret', config.secret);

 // used to create, sign, and verify tokens
 



/************************************* */


exports.getclients = (req,res)=>{

  var email= req.body.email;
  


  //var sql = 'SELECT clientprofile.name,clientprofile.clientid FROM clientcontacts join clientprofile on clientcontacts.clientid = clientprofile .clientid WHERE clientcontacts.email = ?  and (clientprofile.status= 366 or clientprofile.status = 373) ';
  
  var sql = `select distinct clientprofile.wm_status,clientprofile.status,
  clientcontacts.enableforqlikview as enabledforqlikview,
  clientcontacts.wm_enableforprint as enabledforprint,
  clientcontacts.wm_enableforweb as enabledforweb,
  clientcontacts.enableforbr as enableforbr,
    clientcontacts.dashboard as enablefordash,
     clientprofile.wm_enablefortwitter as enablefortwitter,
  clientprofile.clientid as clientid,
  clientprofile.name as name,
  clientprofile.broadcastcid as brid,
  clientcontacts.dashboard
  from clientprofile
  join clientcontacts on clientprofile.clientid=clientcontacts.clientid
  and clientcontacts.email = ?
  and
  (
  (clientcontacts.wm_enableforprint=1 and clientprofile.status<>372  )
  or
  (
  clientcontacts.wm_enableforweb=1 and clientprofile.wm_status<>372 )
  or
  (
  clientcontacts.wm_enableforprint=0 and clientprofile.wm_status<>372
  )
  or
  (clientcontacts.enableforbr=1 and clientprofile.broadcastcid is not null )
    #or
  #(
  #clientcontacts.enablefortwitter=1 and clientprofile.wm_twitter_status<>372 )
  )
    
  and clientprofile.deleted<>1
  group by clientprofile.clientid order by clientprofile.name`;
  
  // console.log(sql);
  // console.log(email);
  msqlDbConnection.query(sql,[email], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
     //console.log('The solution is: ', results);
    var finalresult=[];
    for(var i=0;i<results.length;i++){
        if(results[i].status == 372 && results[i].wm_status == 372){
        }
        else{
          finalresult.push(results[i]);
        }
    }
    if(finalresult.length >0){
      res.json(finalresult)
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


 