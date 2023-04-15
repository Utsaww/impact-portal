var smartanalyseModule = require("../model/ArticleModel1.js");
var db = require("../db.js");
var ObjectId = require("mongodb").ObjectID;
var mysql = require("mysql");

var connection = mysql.createPool({
  host: "192.168.248.4",
  user: "root",
  password: "delta",
  database: "impact",
});
var printChartData = (req, res) => {
  //$match: { $or: [{ author: 'dave' }, { author: 'john' }] }
  if (req.body.dimension == "onlyProminent") {
    var query1 = {
      $or: [
        { "keyword.Prominence": "headline mention" },
        { "keyword.Prominence": "prominent" },
      ],
    };
  } else {
    var query1 = { "keyword.companys": { $ne: null } };
  }
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  query1.type = "PRINT";
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };
  query1["$and"] = [
    {
      "keyword.keytpe": {
        $in: ["My Company Keyword", "My Competitor Keyword"],
      },
    },
  ];
  query1["$and"] = [{ rejected: { $ne: "1" } }];

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
    { $match: { "keyword.companys": { $ne: "null" } } },
    {
      $group: {
        _id: { articleid: "$articleid", companys: "$keyword.companys" },
      },
    },
    {
      $group: {
        _id: "$_id.companys",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];
  smartanalyseModule.aggregate(a, function (err, impacts) {
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
var sourceChartData = (req, res) => {
  if (req.body.dimension == "onlyProminent") {
    var query1 = {
      $or: [
        { "keyword.Prominence": "headline mention" },
        { "keyword.Prominence": "prominent" },
      ],
    };
  } else {
    var query1 = {};
  }
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  query1.type = req.body.type;
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };

  if (req.body.clientid != null) {
    query1.clientid = req.body.clientid;
  }
  query1["$and"] = [
    {
      "keyword.keytpe": {
        $in: ["My Company Keyword", "My Competitor Keyword"],
      },
    },
    { rejected: { $ne: "1" } },
  ];
  // query1["$and"] = [{ rejected: { $ne: "1" } }];
  var issue = "$keyword.companys";
  var nullcond = { $match: { "keyword.companys": { $ne: "null" } } };
  if (req.body.type == "PRINT") {
    issue = "$keyword.companys";
    nullcond = { $match: { "keyword.companys": { $ne: "null" } } };
  } else {
    issue = "$keyword.companyissue";
    nullcond = { $match: { "keyword.companyissue": { $ne: "null" } } };
  }
  if (req.body.type == "PRINT") {
    var a = [
      {
        $match: query1,
      },
      {
        $unwind: "$keyword",
      },
      nullcond,
      {
        $group: {
          _id: {
            companys: issue,
            pub: "$publication",
            city: "$city",
          },
        },
      },
      {
        $group: {
          _id: {
            companys: "$_id.companys",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ];
  } else {
    var a = [
      {
        $match: query1,
      },
      {
        $lookup: {
          from: "companyissue",
          localField: "keyword.keyid",
          foreignField: "issueid",
          as: "issue_company",
        },
      },
      { $unwind: "$issue_company" },
      //   nullcond,
      {
        $group: {
          _id: {
            companys: "$issue_company.companyname",
            pub: "$publication",
            city: "$city",
          },
        },
      },
      {
        $group: {
          _id: { companys: "$_id.companys" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ];
  }

  smartanalyseModule.aggregate(a, function (err, impacts) {
    if (err) {
      //console.log("error 2" + err);
      res.status(500);
      res.send("internal error");
    } else {
      res.status(200);

      // console.log("----------------Ruchi------------------------");
      // console.log(a);
      // console.log("----------------------------------------");
      res.json(impacts);
    }
  });
};
var webChartData = (req, res) => {
  if (req.body.dimension == "onlyProminent") {
    var query1 = {
      $or: [
        { "keyword.Prominence": "headline mention" },
        { "keyword.Prominence": "prominent" },
      ],
    };
  } else {
    // var query1 = { 'keyword.keytpe': { $ne: "My Industry Keyword" } };
    var query1 = { "keyword.companys": { $ne: null } };
  }
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  type = req.body.type;
  query1.type = type;
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };
  query1["$and"] = [
    {
      "keyword.keytpe": {
        $in: ["My Company Keyword", "My Competitor Keyword"],
      },
    },
    { rejected: { $ne: "1" } },
  ];

  if (req.body.clientid != null) {
    query1.clientid = req.body.clientid;
  }
  // query1['$and'] = [{rejected: { $ne: "1" }}];
  //without JOin
  /* var a = [
        {
            $match:
                query1
        },
        { $unwind: "$keyword" },
        { "$match": { "keyword.companyissue": { "$ne": "null" } } },
        {
            $group:
            {
                _id: { articleid: "$articleid", companys: "$keyword.companyissue" }
            }
        }, { $sort: { count: -1 } },
        {
            $group: {
                _id: "$_id.companys",
                count: { $sum: 1 }
            }
        }, { $sort: { count: -1 } }
    ]; */

  //with  JOin
  var a = [
    {
      $match: query1,
    },
    {
      $lookup: {
        from: "companyissue",
        localField: "keyword.keyid",
        foreignField: "issueid",
        as: "issue_company",
      },
    },
    { $unwind: "$issue_company" },
    { $match: { "keyword.companyissue": { $ne: "null" } } },
    {
      $group: {
        _id: {
          articleid: "$articleid",
          companys: "$issue_company.companyname",
        },
      },
    },
    { $sort: { count: -1 } },
    {
      $group: {
        _id: "$_id.companys",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];
  var a = [
    { $match: query1 },
    {
      $lookup: {
        from: "companyissue",
        localField: "keyword.keyid",
        foreignField: "issueid",
        as: "issue_company",
      },
    },
    { $unwind: "$issue_company" },
    {
      $group: {
        _id: {
          articleid: "$articleid",
          companys: "$issue_company.companyname",
        },
      },
    },
    { $sort: { count: -1 } },
    { $group: { _id: "$_id.companys", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ];
  /* smartanalyseModule.aggregate(a, function (err, impacts) {
        if (err) {
            //console.log("error 2" + err);
            res.status(500);
            res.send(a);
        } else {
            res.status(200);

            // //console.log(impacts);
            res.json(impacts);
        }
    }); */
  var aggregation = smartanalyseModule.aggregate(a);
  aggregation.options = { allowDiskUse: true };
  aggregation.exec(function (err, impacts) {
    if (err) {
      //console.log("error 2" + err);
      res.status(500);
      res.send("internal error");
      // console.log("--------------------------------");
      // console.log(query1);
    } else {
      res.status(200);

      // console.log(impacts);
      res.json(impacts);
    }
  });
};
var tvChartData = (req, res) => {
  if (req.body.dimension == "onlyProminent") {
    var query1 = {
      $or: [
        { "keyword.Prominence": "headline mention" },
        { "keyword.Prominence": "prominent" },
      ],
    };
  } else {
    var query1 = { "keyword.companys": { $nin: [null, ""] } };
  }
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  query1.type = "TV";
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };

  query1["$and"] = [
    {
      "keyword.keytpe": {
        $in: ["My Company Keyword", "My Competitor Keyword"],
      },
    },
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
    { $unwind: "$keyword" },
    { $match: { "keyword.companys": { $ne: "null" } } },
    {
      $group: {
        _id: { articleid: "$articleid", companys: "$keyword.companys" },
      },
    },
    { $sort: { count: -1 } },
    {
      $group: {
        _id: "$_id.companys",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];
  smartanalyseModule.aggregate(a, function (err, impacts) {
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
var articlesCount = (req, res) => {
  if (req.body.dimension == "onlyProminent") {
    var query1 = {
      $or: [
        { "keyword.Prominence": "headline mention" },
        { "keyword.Prominence": "prominent" },
      ],
    };
  } else {
    var query1 = {};
  }
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  query1.type = req.body.type;
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };

  if (req.body.counttype == "mycomp") {
    query1["$and"] = [
      { "keyword.keytpe": "My Company Keyword" },
      { rejected: { $ne: "1" } },
    ];
  } else {
    query1["$and"] = [
      {
        "keyword.keytpe": {
          $in: ["My Company Keyword", "My Competitor Keyword"],
        },
      },
      { rejected: { $ne: "1" } },
    ];
  }
  // query1['$and'] = [{rejected: { $ne: "1" }}];
  if (req.body.clientid != null) {
    query1.clientid = req.body.clientid;
  }

  // if (req.body.type == "PRINT") {
  //     query1["keyword.companys"] = { "$ne": "null" };
  // }
  // else {
  //     query1["keyword.companyissue"] = { "$ne": "null" };
  // }
  smartanalyseModule.distinct("articleid", query1, function (err, impacts) {
    if (err) {
      //console.log("error 2" + err);
      res.status(500);
      res.send("internal error");
    } else {
      res.status(200);

      // //console.log(impacts);
      res.json(query1);
    }
  });
};
var publicationCount = (req, res) => {
  if (req.body.dimension == "onlyProminent") {
    var query1 = {
      $or: [
        { "keyword.Prominence": "headline mention" },
        { "keyword.Prominence": "prominent" },
      ],
    };
  } else {
    var query1 = {};
  }
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  query1.type = req.body.type;
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };

  query1["$and"] = [
    { "keyword.keytpe": "My Company Keyword" },
    { rejected: { $ne: "1" } },
  ];
  // query1['$and'] = [{rejected: { $ne: "1" }}];

  if (req.body.clientid != null) {
    query1.clientid = req.body.clientid;
  }
  if (req.body.type == "PRINT") {
    var a = [
      {
        $match: query1,
      },
      {
        $group: {
          _id: "$pubid",
          count: { $sum: 1 },
        },
      },
    ];
  } else {
    var a = [
      {
        $match: query1,
      },
      {
        $group: {
          _id: "$publication",
          count: { $sum: 1 },
        },
      },
    ];
  }
  smartanalyseModule.aggregate(a, function (err, impacts) {
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
var circulationCount = (req, res) => {
  if (req.body.dimension == "onlyProminent") {
    var query1 = {
      $or: [
        { "keyword.Prominence": "headline mention" },
        { "keyword.Prominence": "prominent" },
      ],
    };
  } else {
    var query1 = {};
  }
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  query1.type = req.body.type;
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };
  query1["$and"] = [
    { "keyword.keytpe": "My Company Keyword" },
    { rejected: { $ne: "1" } },
  ];
  // query1['$and'] = [{rejected: { $ne: "1" }}];

  if (req.body.clientid != null) {
    query1.clientid = req.body.clientid;
  }
  var a = [
    {
      $match: query1,
    },
    {
      $group: {
        _id: { articleid: "$articleid", circulation: "$circulation" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $group: {
        _id: null,
        totalcirculation: {
          $sum: {
            $toDouble: "$_id.circulation",
          },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ];

  smartanalyseModule.aggregate(a, function (err, impacts) {
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
var circulationDistinctCount = (req, res) => {
  if (req.body.dimension == "onlyProminent") {
    var query1 = {
      $or: [
        { "keyword.Prominence": "headline mention" },
        { "keyword.Prominence": "prominent" },
      ],
    };
  } else {
    var query1 = {};
  }
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  query1.type = req.body.type;
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };
  query1["$and"] = [
    { "keyword.keytpe": "My Company Keyword" },
    { rejected: { $ne: "1" } },
  ];
  // query1['$and'] = [{rejected: { $ne: "1" }}];

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
          articleid: "$articleid",
          circulation: "$circulation",
        },
        countofArticles: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        countofArticles: -1,
      },
    },
    {
      $group: {
        _id: {
          circulation: "$_id.circulation",
        },
        countofArticles: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        countofArticles: -1,
      },
    },
    {
      $group: {
        _id: null,
        totalcirculation: {
          $sum: {
            $toDouble: "$_id.circulation",
          },
        },
        c: { $sum: 1 },
      },
    },
  ];
  smartanalyseModule.aggregate(a, function (err, impacts) {
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
var circulationDistinctChart = (req, res) => {
  if (req.body.dimension == "onlyProminent") {
    var query1 = {
      $or: [
        { "keyword.Prominence": "headline mention" },
        { "keyword.Prominence": "prominent" },
      ],
    };
  } else {
    var query1 = {};
  }
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  // query1.type = 'PRINT';
  query1.type = req.body.type;
  var cond = { "keyword.companys": { $ne: "null" } };
  if (req.body.type == "PRINT") {
    cond = { "keyword.companys": { $ne: "null" } };
  } else {
    cond = { "keyword.companyissue": { $ne: "null" } };
  }
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };
  query1["$and"] = [
    {
      "keyword.keytpe": {
        $in: ["My Company Keyword", "My Competitor Keyword"],
      },
    },
    { rejected: { $ne: "1" } },
  ];
  // query1['$and'] = [{rejected: { $ne: "1" }}];
  if (req.body.clientid != null) {
    query1.clientid = req.body.clientid;
  }
  var company = "$keyword.companys";
  if (req.body.type == "PRINT") {
    company = "$keyword.companys";
  } else {
    company = "$keyword.companyissue";
  }
  var a = [
    {
      $match: query1,
    },
    {
      $unwind: "$keyword",
    },
    { $match: cond },
    {
      $group: {
        _id: {
          companys: company,
          articleid: "$articleid",
          circulation: "$circulation",
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $group: {
        _id: { companys: "$_id.companys" },
        count: {
          $sum: {
            $toDouble: "$_id.circulation",
          },
        },
        countofArticles: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ];
  smartanalyseModule.aggregate(a, function (err, impacts) {
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
var circulationAllChart = (req, res) => {
  if (req.body.dimension == "onlyProminent") {
    var query1 = {
      $or: [
        { "keyword.Prominence": "headline mention" },
        { "keyword.Prominence": "prominent" },
      ],
    };
  } else {
    var query1 = {};
  }
  fromdate = req.body.fromdate;
  todate = req.body.todate;
  // query1.type = 'PRINT';
  query1.type = req.body.type;
  var cond = { "keyword.companys": { $ne: "null" } };
  if (req.body.type == "PRINT") {
    cond = { "keyword.companys": { $ne: "null" } };
  } else {
    cond = { "keyword.companyissue": { $ne: "null" } };
  }
  query1["$and"] = [
    {
      "keyword.keytpe": {
        $in: ["My Company Keyword", "My Competitor Keyword"],
      },
    },
    { rejected: { $ne: "1" } },
  ];
  // query1['$and'] = [{rejected: { $ne: "1" }}];
  query1.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };
  if (req.body.clientid != null) {
    query1.clientid = req.body.clientid;
  }
  var company = "$keyword.companys";

  if (req.body.type == "PRINT") {
    company = "$keyword.companys";
  } else {
    company = "$keyword.companyissue";
  }
  if (req.body.type == "PRINT") {
    var a = [
      {
        $match: query1,
      },
      {
        $unwind: "$keyword",
      },
      { $match: cond },
      {
        $group: {
          _id: {
            companys: company,
            circulation: "$circulation",
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $group: {
          _id: {
            companys: "$_id.companys",
          },
          count: {
            $sum: {
              $toDouble: "$_id.circulation",
            },
          },
          countofArticles: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ];
  } else {
    var a = [
      {
        $match: query1,
      },
      {
        $unwind: "$keyword",
      },
      { $match: cond },
      {
        $group: {
          _id: {
            companys: company,
            circulation: "$circulation",
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $group: {
          _id: {
            companys: "$_id.companys",
          },
          count: {
            $sum: {
              $toDouble: "$_id.circulation",
            },
          },
          countofArticles: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ];
  }
  smartanalyseModule.aggregate(a, function (err, impacts) {
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
module.exports = {
  printChartData: printChartData,
  webChartData: webChartData,
  tvChartData: tvChartData,
  articlesCount: articlesCount,
  publicationCount: publicationCount,
  circulationCount: circulationCount,
  circulationDistinctCount: circulationDistinctCount,
  sourceChartData: sourceChartData,
  circulationDistinctChart: circulationDistinctChart,
  circulationAllChart: circulationAllChart,
};
