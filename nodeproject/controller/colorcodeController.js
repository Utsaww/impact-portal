var colorcodeModule = require("../model/colorcode.js");
var db = require("../db.js");
var ObjectId = require('mongodb').ObjectID;
var mysql = require('mysql');

var connection = mysql.createPool({
    host     : '192.168.248.4',
    user     : 'root',
    password : 'delta',
    database : 'impact'
  });
var getcompanys = (req, res) => {
    var query1 = {};
    if (req.body.clientid != null) {
        query1.clientid = req.body.clientid;
    }
    colorcodeModule.find(query1, function (err, impacts) {
        if (err) {
            res.status(500);
            res.send("internal error");
        } else {
            res.status(200);
            res.json(impacts);
        }
    });
}

var getcompanysAll = (req, res) => {
    
    if (req.body.clientid != null) {
        var clientid= req.body.clientid;
    }
    else{
        res.send("Please select client");
    }
    var sql = `select type,companyid, '#e7e7e7' as colorcode, companyname as companystring, client, issueid
        from
        (select 'WEB' as type, wm_company_issue.id as companyid, wm_company_issue.name as companyname,
        wm_issue.client as client,wm_issue.id as issueid 
        from wm_issue join wm_company_issue on wm_company_issue.id=wm_issue.companyissue
        and wm_issue.client = ?
        and wm_issue.deleted=0
        UNION
        select 'PRINT' as type, KeywordID as companyid, CompanyS as companyname,
        clientid as client, '' as issueid
        from clientkeyword where clientid = ?
        and CompanyS <> ''
        group by CompanyS) as t
        group by companyname, type
        order by companyname`;
    
    connection.query(sql,[clientid, clientid], function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
       //console.log('The solution is: ', results);
      if(results.length >0){
        res.json(results)
      }
      else{
        
        res.send({
          "code":204,
          "success":"Please select client"
        });
      }
    }
    
  });
}
var insertdata = (req, res) => {
  var data = req.body.data;
  var clientid = req.body.clientid;
  var a = {'clientid': clientid};
  colorcodeModule.remove(a, function (err, impacts) {
    if (err) {
        res.status(500);
        res.send("internal error");
    } else {
      
      var colorcodeM = new colorcodeModule(data);

      colorcodeM.save(function(err){
        if(err){
            res.status(500);
            res.send("internal error");
            // res.send(err);
        }else{
            res.status(200);
            res.send(colorcodeM);
        }
      });
        // res.status(200);
        // res.json(impacts);
    }
  });
}
var resetdata = (req, res) => {
  var clientid = req.body.clientid;
  var a = {'clientid': clientid};
  colorcodeModule.remove(a, function (err, impacts) {
    if (err) {
        res.status(500);
        res.send("internal error");
    } else {
        res.status(200);
        res.json(impacts);
    }
  });
}
module.exports = {
    getcompanys: getcompanys,
    getcompanysAll:getcompanysAll,
    insertdata: insertdata ,
    resetdata: resetdata
}