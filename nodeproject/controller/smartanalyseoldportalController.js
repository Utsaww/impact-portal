var smartanalyseoldportalModule = require("../model/ArticleModel1.js");
var db = require("../db.js");
var ObjectId = require("mongodb").ObjectID;
var mysql = require("mysql");
/*
var connection = mysql.createConnection({
    host     : '192.168.248.4',
    user     : 'root',
    password : 'delta',
    database : 'impact'
  });
*/

var connection = mysql.createPool({
  host: "192.168.248.4",
  user: "root",
  password: "delta",
  database: "impact",
});
var YearChartData = (req, res) => {
  var query1 = {};
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  query1.type = req.body.type;
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };
  query1["$and"] = [
    { "keyword.keytpe": { $in: ["My Company Keyword"] } },
    { rejected: { $ne: "1" } },
  ];
  // query1['$and'] = [{rejected: { $ne: "1" }}];

  // query1.pubdate = {
  //     $gte: "2019-06-23",
  //     $lte: "2019-06-23"
  // }

  if (req.body.clientid != null) {
    query1.clientid = req.body.clientid;
  }
  var a = [
    {
      $match: query1,
    },
    {
      $group: {
        _id: {
          year: {
            $year: {
              $dateFromString: { dateString: "$pubdate", format: "%Y-%m-%d" },
            },
          },
          month: {
            $month: {
              $dateFromString: { dateString: "$pubdate", format: "%Y-%m-%d" },
            },
          },
          article: "$articleid",
        },
      },
    },
    {
      $group: {
        _id: { year: "$_id.year", mon: "$_id.month" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];

  var aggregation = smartanalyseoldportalModule.aggregate(a);
  aggregation.options = { allowDiskUse: true };
  aggregation.exec(function (err, impacts) {
    if (err) {
      //console.log("error 2" + err);
      res.status(500);
      res.send("internal error");
    } else {
      res.status(200);

      // //console.log(impacts);
      res.json(impacts);
    }
  });
};
var AVEChartData = (req, res) => {
  var query1 = {};
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  query1.type = req.body.type;
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };
  // query1['$and'] = [{ "keyword.keytpe": { "$in": ["My Company Keyword"] } }];

  // query1.pubdate = {
  //     $gte: "2019-06-23",
  //     $lte: "2019-06-23"
  // }

  if (req.body.clientid != null) {
    query1.clientid = req.body.clientid;
  }
  var a = [
    {
      $match: query1,
    },
    { $unwind: "$keyword" },
    {
      $group: {
        _id: {
          articleid: "$articleid",
          companys: "$keyword.companys",
          ave: "$ave",
        },
      },
    },
    {
      $group: {
        _id: "$_id.companys",
        count: {
          $sum: { $toDouble: { $substrBytes: ["$_id.ave", 0, 10] } },
        },
        countofArticles: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];
  var companystype = "$keyword.companys";
  var nullcond = "keyword.companys";
  if (req.body.type == "PRINT") {
    companystype = "$keyword.companys";
    nullcond = "keyword.companys";
  } else {
    companystype = "$keyword.companyissue";
    nullcond = "keyword.companyissue";
  }
  // a = [{ $unwind: "$keyword" }, { $match: { nullcond: { "$ne": "null" }, type: req.body.type, pubdate: { "$gte": todate, "$lte": fromdate }, clientid: req.body.clientid } }, {$unwind: "$keyword.companys"}, { $group: { _id: { 'month': { $month: { $dateFromString: { dateString: "$pubdate", format: "%Y-%m-%d" } } }, articleid: "$articleid", companys: companystype, ave: "$ave" } } }, { $group: { _id: { month: "$_id.month", companyst: "$_id.companys" }, count: { $sum: { $toDouble: { $substrBytes: ["$_id.ave", 0, 10] } } }, countofArticles: { $sum: 1 } } }, { $sort: { _id: -1 } }, { $group: { _id: { companys: "$_id.companyst" }, values: { $push: { $floor: { $divide: ["$count", 1000000] } } } } }];

  // query1['$and'] = [{rejected: { $ne: "1" }}];
  a = [
    { $unwind: "$keyword" },
    {
      $match: {
        "keyword.companys": { $ne: "null" },
        type: req.body.type,
        pubdate: { $gte: todate, $lte: fromdate },
        clientid: req.body.clientid,
      },
    },
    { $unwind: "$keyword.companys" },
    {
      $group: {
        _id: {
          year: {
            $year: {
              $dateFromString: { dateString: "$pubdate", format: "%Y-%m-%d" },
            },
          },
          month: {
            $month: {
              $dateFromString: { dateString: "$pubdate", format: "%Y-%m-%d" },
            },
          },
          articleid: "$articleid",
          companys: "$keyword.companys",
          ave: "$ave",
        },
      },
    },
    {
      $group: {
        _id: {
          month: "$_id.month",
          companyst: "$_id.companys",
          year: "$_id.year",
        },
        count: { $sum: { $toDouble: { $substrBytes: ["$_id.ave", 0, 10] } } },
        countofArticles: { $sum: 1 },
      },
    },
    { $sort: { countofArticles: 1 } },
    {
      $group: {
        _id: { companys: "$_id.companyst" },
        values: {
          $push: {
            value: { $divide: ["$count", 1000000] },
            month: "$_id.month",
            year: "$_id.year",
          },
        },
      },
    },
  ];

  smartanalyseoldportalModule.aggregate(a, function (err, impacts) {
    if (err) {
      //console.log("error 2" + err);
      res.status(500);
      res.send("internal error");
    } else {
      res.status(200);

      //console.log(impacts);
      res.json(impacts);
    }
  });
};
var TopTenPubChartData = (req, res) => {
  var query1 = {};
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  query1.type = req.body.type;
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };
  // query1['$and'] = [{ "keyword.keytpe": { "$in": ["My Company Keyword", "My Competitor Keyword"] } }];

  // query1.pubdate = {
  //     $gte: "2019-06-23",
  //     $lte: "2019-06-23"
  // }

  if (req.body.clientid != null) {
    query1.clientid = req.body.clientid;
  }
  var a = [
    {
      $match: query1,
    },
    { $unwind: "$keyword" },
    {
      $group: {
        _id: {
          articleid: "$articleid",
          companys: "$keyword.companys",
          ave: "$ave",
        },
      },
    },
    {
      $group: {
        _id: "$_id.companys",
        count: {
          $sum: { $toDouble: { $substrBytes: ["$_id.ave", 0, 10] } },
        },
        countofArticles: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];
  if (req.body.type == "PRINT") {
    a = [
      { $unwind: "$keyword" },
      {
        $match: {
          "keyword.companys": { $ne: "null" },
          type: req.body.type,
          pubdate: { $gte: todate, $lte: fromdate },
          clientid: req.body.clientid,
          $and: [
            {
              "keyword.keytpe": {
                $in: ["My Company Keyword", "My Competitor Keyword"],
              },
            },
          ],
        },
      },
      { $unwind: "$keyword.companys" },
      {
        $group: {
          _id: {
            publication: "$primarypublication",
            articleid: "$articleid",
            companys: "$keyword.companys",
          },
        },
      },
      {
        $group: {
          _id: { pub: "$_id.publication", companys: "$_id.companys" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $group: {
          _id: { pub: "$_id.pub" },
          values: { $push: { companys: "$_id.companys", count: "$count" } },
          countofval: { $sum: 1 },
          sumofallvals: { $sum: "$count" },
        },
      },
      { $sort: { sumofallvals: -1 } },
      { $limit: 10 },
    ];
  } else {
    a = [
      { $unwind: "$keyword" },
      {
        $match: {
          "keyword.companyissue": { $ne: "null" },
          type: req.body.type,
          pubdate: { $gte: todate, $lte: fromdate },
          clientid: req.body.clientid,
          $and: [
            {
              "keyword.keytpe": {
                $in: ["My Company Keyword", "My Competitor Keyword"],
              },
            },
          ],
        },
      },
      { $unwind: "$keyword.companys" },
      {
        $group: {
          _id: {
            publication: "$publication",
            articleid: "$articleid",
            companys: "$keyword.companyissue",
          },
        },
      },
      {
        $group: {
          _id: { pub: "$_id.publication", companys: "$_id.companys" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $group: {
          _id: { pub: "$_id.pub" },
          values: { $push: { companys: "$_id.companys", count: "$count" } },
          countofval: { $sum: 1 },
          sumofallvals: { $sum: "$count" },
        },
      },
      { $sort: { sumofallvals: -1 } },
      { $limit: 10 },
    ];
  }
  smartanalyseoldportalModule.aggregate(a, function (err, impacts) {
    if (err) {
      //console.log("error 2" + err);
      res.status(500);
      res.send("internal error");
    } else {
      res.status(200);

      //console.log(impacts);
      res.json(impacts);
    }
  });
};
var TopTenJournalistChartData = (req, res) => {
  var query1 = {};
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  query1.type = req.body.type;
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };
  // query1['$and'] = [{ "keyword.keytpe": { "$in": ["My Company Keyword"] } }];

  // query1.pubdate = {
  //     $gte: "2019-06-23",
  //     $lte: "2019-06-23"
  // }

  if (req.body.clientid != null) {
    query1.clientid = req.body.clientid;
  }
  var a = [
    {
      $match: query1,
    },
    { $unwind: "$keyword" },
    {
      $group: {
        _id: {
          articleid: "$articleid",
          companys: "$keyword.companys",
          ave: "$ave",
        },
      },
    },
    {
      $group: {
        _id: "$_id.companys",
        count: {
          $sum: { $toDouble: { $substrBytes: ["$_id.ave", 0, 10] } },
        },
        countofArticles: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];
  // a = [{ $match: { "keyword.companys": { "$ne": "null" }, "journalist.journalist": { "$ne": "" }, type: req.body.type, pubdate: { "$gte": todate, "$lte": fromdate }, clientid: req.body.clientid } }, { $unwind: "$keyword" }, { $unwind: "$journalist" }, { $group: { _id: { 'journalist': "$journalist.journalist", articleid: "$articleid", companys: "$keyword.companys" } } }, { $group: { _id: { jour: "$_id.journalist", companys: "$_id.companys" }, count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $group: { _id: { companys: "$_id.companys" }, values: { $push: { jour: "$_id.jour", count: "$count" } } } }, { $sort: { "values.count": -1 } }];
  a = [
    { $unwind: "$keyword" },
    {
      $match: {
        "keyword.companys": { $ne: "null" },
        "journalist.journalist": { $ne: "" },
        type: req.body.type,
        pubdate: { $gte: todate, $lte: fromdate },
        clientid: req.body.clientid,
        $and: [
          {
            "keyword.keytpe": {
              $in: ["My Company Keyword", "My Competitor Keyword"],
            },
          },
        ],
      },
    },
    { $unwind: "$keyword.companys" },
    { $unwind: "$journalist" },
    {
      $group: {
        _id: {
          journalist: "$journalist.journalist",
          articleid: "$articleid",
          companys: "$keyword.companys",
        },
      },
    },
    {
      $group: {
        _id: { jour: "$_id.journalist", companys: "$_id.companys" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    {
      $group: {
        _id: { jour: "$_id.jour" },
        values: { $push: { companys: "$_id.companys", count: "$count" } },
        countofval: { $sum: 1 },
        sumofallvals: { $sum: "$count" },
      },
    },
    { $sort: { sumofallvals: -1 } },
    { $limit: 10 },
  ];
  smartanalyseoldportalModule.aggregate(a, function (err, impacts) {
    if (err) {
      //console.log("error 2" + err);
      res.status(500);
      res.send("internal error");
    } else {
      res.status(200);

      //console.log(impacts);
      res.json(impacts);
    }
  });
};
var RegionChartData = (req, res) => {
  var query1 = {};
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  query1.type = req.body.type;
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };
  // query1['$and'] = [{ "keyword.keytpe": { "$in": ["My Company Keyword"] } }];

  // query1.pubdate = {
  //     $gte: "2019-06-23",
  //     $lte: "2019-06-23"
  // }

  if (req.body.clientid != null) {
    query1.clientid = req.body.clientid;
  }
  var a = [
    {
      $match: query1,
    },
    { $unwind: "$keyword" },
    {
      $group: {
        _id: {
          articleid: "$articleid",
          companys: "$keyword.companys",
          ave: "$ave",
        },
      },
    },
    {
      $group: {
        _id: "$_id.companys",
        count: {
          $sum: { $toDouble: { $substrBytes: ["$_id.ave", 0, 10] } },
        },
        countofArticles: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];
  a = [
    { $unwind: "$keyword" },
    {
      $match: {
        "keyword.companys": { $ne: "null" },
        type: req.body.type,
        pubdate: { $gte: todate, $lte: fromdate },
        clientid: req.body.clientid,
        $and: [
          {
            "keyword.keytpe": {
              $in: ["My Company Keyword", "My Competitor Keyword"],
            },
          },
        ],
      },
    },
    { $unwind: "$keyword.companys" },
    {
      $group: {
        _id: {
          region: "$region",
          articleid: "$articleid",
          companys: "$keyword.companys",
        },
      },
    },
    {
      $group: {
        _id: { region: "$_id.region", companys: "$_id.companys" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    {
      $group: {
        _id: { region: "$_id.region" },
        values: { $push: { companys: "$_id.companys", count: "$count" } },
      },
    },
    { $sort: { "values.count": -1 } },
  ];
  smartanalyseoldportalModule.aggregate(a, function (err, impacts) {
    if (err) {
      //console.log("error 2" + err);
      res.status(500);
      res.send("internal error");
    } else {
      res.status(200);

      //console.log(impacts);
      res.json(impacts);
    }
  });
};
module.exports = {
  YearChartData: YearChartData,
  AVEChartData: AVEChartData,
  TopTenPubChartData: TopTenPubChartData,
  TopTenJournalistChartData: TopTenJournalistChartData,
  RegionChartData: RegionChartData,
};
