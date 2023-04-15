var articlesModule = require("../model/ArticleModel1.js");
const searchModel = require("../model/sqModel.js");
var msqlDbConnection = require("../db.js");
var request = require("request");
var get = (req, res) => {
  const { page, perpage } = req.query;

  if (req.body.sortdate == "desc") {
    datesort = -1;
  } else {
    datesort = 1;
  }

  var options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(perpage, 10) || 100,
    sort: {
      captureddatetime: datesort,
    },
  };

  articlesModule.paginate({}, options, function (err, impacts) {
    if (err) {
      console.log("error 1");
      res.status(500);
      res.send("internal error");
    } else {
      res.status(200);
      console.log("sending data");
      res.json(impacts);
    }
  });
};

var articlepost = (req, res) => {
  let page = req.body.page ? req.body.page : 1;

  let perpage = req.body.perpage ? req.body.perpage : 100;

  if (req.body.sortnews == "asc") {
    sortnews = -1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        headline: sortnews,
      },
    };
  } else if (req.body.sortnews == "desc") {
    sortnews = 1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        headline: sortnews,
      },
    };
  }

  if (req.body.sortpub == "asc") {
    sortpub = -1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        publication: sortpub,
      },
    };
  } else if (req.body.sortpub == "desc") {
    sortpub = 1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        publication: sortpub,
      },
    };
  }

  if (req.body.sortedi == "asc") {
    sortedi = -1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        city: sortedi,
      },
    };
  } else if (req.body.sortedi == "desc") {
    sortedi = 1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        city: sortedi,
      },
    };
  }

  if (req.body.sortprominence == "asc") {
    sortpro = -1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        "keyword.pscore": sortpro,
      },
    };
  } else if (req.body.sortprominence == "desc") {
    sortpro = 1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        "keyword.pscore": sortpro,
      },
    };
  }

  if (req.body.sortdate == "asc") {
    datesort = -1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        pubdate: datesort,
      },
    };
  } else if (req.body.sortdate == "desc") {
    datesort = 1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        pubdate: datesort,
      },
    };
  } else if (req.body.sortdate == "current") {
    datesort = -1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        captureddatetime: datesort,
      },
    };
  }

  var query = {};
  // query = {
  //   rejected: { $eq: "0" },
  // };
  let fromdate = req.body.fromdate;
  let todate = req.body.todate;

  query.pubdate = {
    $gte: todate,
    $lte: fromdate,
  };

  if (req.body.clientid != null) {
    query.clientid = req.body.clientid;
  }

  if (
    req.body.type != "All" &&
    req.body.type != "" &&
    req.body.type != undefined
  ) {
    var alltoUppercase = req.body.type.toUpperCase();
    var toArray = alltoUppercase.split(",");
    toArray = toArray.filter((item) => item);
    query.type = { $in: toArray };
  }

  if (
    req.body.publicationFilter != "" &&
    req.body.publicationFilter != undefined
  ) {
    var FinalPub = req.body.publicationFilter;
    query.publication = { $in: FinalPub };
  }
  if (req.body.editionFilter != "" && req.body.editionFilter != undefined) {
    var FinalCity = req.body.editionFilter;
    FinalCity.push("");
    query.city = { $in: FinalCity };
  }

  if (req.body.languageFilter != "" && req.body.languageFilter != undefined) {
    var FinalLanguage = req.body.languageFilter;
    query.language = { $in: FinalLanguage };
  }

  if (req.body.showcasefilter === "1") {
    query.showcase = "1";
  }

  if (req.body.newscategoryFilter === "Newspaper") {
    query.newscategory = {
      $in: ["Newspaper", "Supplement"],
    };
  }

  if (req.body.newscategoryFilter === "Magazine") {
    query.newscategory = "Magazine";
  }

  if (req.body.qualificatinFilter === "1") {
    query.qualification = {
      $gt: { $size: 0 },
    };
  }

  if (req.body.keytype == 2) {
    query.keyword = {
      $elemMatch: {
        keytpe: "My Competitor Keyword",
      },
    };
  }

  if (req.body.keytype == 1) {
    query.keyword = {
      $elemMatch: {
        keytpe: "My Company Keyword",
      },
    };
  }

  if (req.body.keytype == 3) {
    query.keyword = {
      $elemMatch: {
        keytpe: "My Industry Keyword",
      },
    };
  }

  if (req.body.keytype.length > 1) {
    var keysstring = req.body.keytype;
    var toArray = keysstring.split(",");
    toArray = toArray.filter((item) => item);
    query.keyword = { $elemMatch: { $or: [{ keytpe: { $in: toArray } }] } };
  }

  if (req.body.keywordFilter.length > 0) {
    if (req.body.keytype.length > 1) {
      var FinalKeyword = req.body.keywordFilter;
      var comOrKey = req.body.company_keyword;
      if (comOrKey == "ccom") {
        query.keyword = {
          $elemMatch: {
            $or: [
              {
                companyissue: { $in: FinalKeyword },
              },
              {
                companys: { $in: FinalKeyword },
              },
            ],
            $and: [
              {
                keytpe: { $in: toArray },
              },
            ],
          },
        };
      } else {
        query.keyword = {
          $elemMatch: {
            $or: [
              {
                keyword: { $in: FinalKeyword },
              },
              {
                companys: { $in: FinalKeyword },
              },
            ],
            $and: [
              {
                keytpe: { $in: toArray },
              },
            ],
          },
        };
      }
    } else {
      var FinalKeyword = req.body.keywordFilter;
      var comOrKey = req.body.company_keyword;
      if (comOrKey == "ccom") {
        query.keyword = {
          $elemMatch: {
            $or: [
              {
                companys: { $in: FinalKeyword },
              },
              {
                companyissue: { $in: FinalKeyword },
              },
            ],
          },
        };
      } else {
        query.keyword = {
          $elemMatch: {
            $or: [
              {
                keyword: { $in: FinalKeyword },
              },
              {
                companys: { $in: FinalKeyword },
              },
            ],
          },
        };
      }
    }
  }

  query.rejected = 0;
  var options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(perpage, 10) || 100,
  };
  if (
    req.body.fullTextKeyword != "" &&
    typeof req.body.fullTextKeyword !== "undefined"
  ) {
    //FullText Search
    let fullTextKeyword = req.body.fullTextKeyword;
    let within_check = req.body.within_check;
    request.post(
      {
        url: "http://localhost:3000/search/getarticles",
        method: "POST",
        body: {
          fullTextKeyword: fullTextKeyword,
          within_check: within_check,
          fdate: todate,
          tdate: fromdate,
          page: req.body.page,
          perpage: req.body.perpage,
          clientid: req.body.clientid,
        },
        json: true,
      },
      function (error, response, body) {
        query.articleid = {
          $in: body.articleids, //where in condition
        };
        // debugger;
        options.page = parseInt(page, 10) || options.page; // update page option
        options.limit = parseInt(perpage, 10) || options.limit; // update perpage option
        articlesModule.paginate(query, options, function (err, impacts) {
          if (err) {
            console.log("error 2" + err);
            res.status(500);
            res.send("internal error");
          } else {
            res.status(200);
            console.log("sending data");
            res.json(impacts);
            console.log(impacts.articleid);
          }
        });
      }
    );
  } else {
    articlesModule.paginate(query, options, function (err, impacts) {
      if (err) {
        console.log("error 2" + err);
        res.status(500);
        res.send("internal error");
      } else {
        res.status(200);
        console.log("sending data");
        res.json(impacts);
      }
    });
  }
};
debugger;
var getrejectedArticles = (req, res) => {
  if (req.body.page != null) {
    page = req.body.page;
  } else {
    page = 1;
  }

  if (req.body.perpage != null) {
    perpage = req.body.perpage;
  } else {
    perpage = 3200;
  }

  if (req.body.sortnews == "asc") {
    sortnews = -1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 3200,
      sort: {
        headline: sortnews,
      },
    };
  } else if (req.body.sortnews == "desc") {
    sortnews = 1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 3200,
      sort: {
        headline: sortnews,
      },
    };
  }

  if (req.body.sortpub == "asc") {
    sortpub = -1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        publication: sortpub,
      },
    };
  } else if (req.body.sortpub == "desc") {
    sortpub = 1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        publication: sortpub,
      },
    };
  }
  if (req.body.sortprominence == "asc") {
    sortpro = -1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        companysort: sortpro,
      },
    };
  } else if (req.body.sortprominence == "desc") {
    sortpro = 1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        companysort: sortpro,
      },
    };
  }

  if (req.body.sortdate == "asc") {
    datesort = -1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        pubdate: datesort,
      },
    };
  } else if (req.body.sortdate == "desc") {
    datesort = 1;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perpage, 10) || 100,
      sort: {
        pubdate: datesort,
      },
    };
  }

  var query = {};

  query = {
    rejected: "1",
  };

  fromdate = req.body.fromdate;
  todate = req.body.todate;

  if (req.body.keytype == 2) {
    // options.sort.competitionsort = sortpro;

    query.keyword = {
      $elemMatch: {
        keytpe: "My Competitor Keyword",
      },
    };
  }
  if (req.body.keytype == 1) {
    // options.sort.companysort = sortpro;
    query.keyword = {
      $elemMatch: {
        keytpe: "My Company Keyword",
      },
    };
  }
  if (req.body.keytype == 3) {
    // options.sort.industrysort = sortpro;
    query.keyword = {
      $elemMatch: {
        keytpe: "My Industry Keyword",
      },
    };
  }
  if (req.body.type === "web") {
    query.type = "WEB";
  }
  if (req.body.type === "print") {
    query.type = "PRINT";
  }
  if (req.body.type === "tv") {
    query.type = "TV";

    query.pubdate = {
      $gte: todate,
      $lte: fromdate,
    };
  } else {
    query.pubdate = {
      $gte: todate,
      $lte: fromdate,
    };
  }
  if (req.body.clientid != null) {
    query.clientid = req.body.clientid;
  }
  if (
    req.body.publicationFilter != "" &&
    req.body.publicationFilter != undefined
  ) {
    var FinalPub = req.body.publicationFilter;
    query.publication = { $in: FinalPub };
  }
  if (req.body.editionFilter != "" && req.body.editionFilter != undefined) {
    var FinalCity = req.body.editionFilter;
    query.city = { $in: FinalCity };
  }

  if (req.body.languageFilter != "" && req.body.languageFilter != undefined) {
    var FinalLanguage = req.body.languageFilter;
    query.language = { $in: FinalLanguage };
  }

  if (req.body.keywordFilter != "" && req.body.keywordFilter != undefined) {
    var FinalKeyword = req.body.keywordFilter;
    query.keyword = {
      $elemMatch: {
        keyword: { $in: FinalKeyword },
      },
    };
  }
  if (req.body.showcasefilter === "1") {
    query.showcase = "1";
  }
  // query;

  //res.send(query);

  articlesModule.paginate(query, options, function (err, impacts) {
    if (err) {
      console.log("error 2" + err);
      res.status(500);
      res.send("internal error");
    } else {
      res.status(200);
      console.log("sending data");
      // console.log(impacts);
      res.json(impacts);
    }
  });
};

var excelpost = (req, res) => {
  if (req.body.sortdate == "asc") {
    datesort = -1;
  } else {
    datesort = 1;
  }

  if (req.body.sortnews == "asc") {
    sortnews = -1;
  } else {
    sortnews = 1;
  }
  if (req.body.sortpub == "asc") {
    sortpub = -1;
  } else {
    sortpub = 1;
  }

  var options = {
    sort: {
      pubdate: datesort,
      headline: sortnews,
      publication: sortpub,
    },
  };

  console.log("here");

  var query = {};

  fromdate = req.body.fromdate;
  todate = req.body.todate;

  if (req.body.keytype == 2) {
    query.keyword = {
      $elemMatch: {
        keytpe: "My Competitor Keyword",
      },
    };
  }
  if (req.body.keytype == 1) {
    query.keyword = {
      $elemMatch: {
        keytpe: "My Company Keyword",
      },
    };
  }
  if (req.body.keytype == 3) {
    query.keyword = {
      $elemMatch: {
        keytpe: "My Industry Keyword",
      },
    };
  }
  if (req.body.type === "web") {
    query.type = "WEB";
  }
  if (req.body.type === "print") {
    query.type = "PRINT";
  }
  if (req.body.type === "tv") {
    query.type = "TV";

    query.pubdate = {
      $gte: todate,
      $lte: fromdate,
    };
  } else {
    query.pubdate = {
      $gte: todate,
      $lte: fromdate,
    };
  }
  if (req.body.clientid != null) {
    query.clientid = req.body.clientid;
  }

  // query;

  //res.send(query);

  articlesModule.find(query, function (err, impacts) {
    // result.docs
    // result.total
    // result.limit - 10
    // result.page - 3
    // result.pages

    if (err) {
      console.log("error 3");
      console.log(err);
      res.status(500);
      res.send("internal error");
    } else {
      res.status(200);
      console.log("sending data");
      // console.log(impacts);
      res.json(impacts);
    }
  });
};

articledetailpost = (req, res) => {
  var query = {};

  query.articleid = {
    $eq: req.body.articleids,
  };

  query.clientid = req.body.articlepara.clientid;

  articlesModule.find(query, "qualification", function (err, impacts) {
    if (err) {
      console.log("error 4");
      console.log(err);
      res.status(500);
      res.send("internal error");
    } else {
      res.status(200);
      console.log("sending data");
      // console.log(impacts);
      res.json(impacts);
    }
  });
};

articleupdateget = function (req, res) {
  var query = {};
  var copyarticleid = req.body.articleid;
  var clientid = req.body.clientid;

  if (isNaN(copyarticleid)) {
    var sel =
      "select keywordlog.clientid as clientid,ifnull(qualificationcommentandshowcase.showcase,0) as showcase, ifnull( qualificationcommentandshowcase.comment,'') as comment, group_concat(distinct concat(qualificationlabels.name,'>',qualificationdropdown1.name)) as dd1, group_concat(distinct concat(qualificationlabels.name,'>', qualificationdropdown2.name)) as dd2,keywordlog.articleid as articleid FROM keywordlog join article on keywordlog.articleid=article.ArticleId join qualificationlabels on qualificationlabels.clientid=keywordlog.clientid join qualificationdropdown1selection on qualificationdropdown1selection.article=keywordlog.articleid left join qualificationdropdown2selection on qualificationdropdown2selection.article=keywordlog.articleid left join qualificationcommentandshowcase on qualificationcommentandshowcase.article=keywordlog.articleid  join qualificationdropdown1 on qualificationdropdown1.label=qualificationlabels.id and qualificationdropdown1.id=qualificationdropdown1selection.dropdown1 and keywordlog.articleid=qualificationdropdown1selection.article  left join qualificationdropdown2 on qualificationdropdown2.dropdown1=qualificationdropdown1.id and qualificationdropdown2.id=qualificationdropdown2selection.dropdown2 and keywordlog. articleid=qualificationdropdown2selection.article where article.ArticleID='" +
      copyarticleid +
      "' and keywordlog.clientid='" +
      clientid +
      "' group by keywordlog.articleid,keywordlog.clientid";
    var qs1 = " qualificationdropdown1selection ";
    var qs2 = " qualificationdropdown2selection ";
    var qcomment = " qualificationcommentandshowcase ";
  } else {
    var sel =
      `select wm_article.id as articleid,qualificationlabels.clientid as clientid,
 group_concat(distinct concat(qualificationlabels.name,'>',qualificationdropdown1.name)) as dd1,
	group_concat(distinct concat(qualificationlabels.name,'>', qualificationdropdown2.name)) as dd2,
	wm_qualificationcommentandshowcase.comment as comment,
	wm_qualificationcommentandshowcase.showcase as showcase
	from wm_article
    join wm_article_issue on wm_article_issue.article=wm_article.id
    join wm_issue on wm_article_issue.issue=wm_issue.id and  wm_issue.deleted=0 and wm_article.id='` +
      copyarticleid +
      `' and wm_issue.client='` +
      clientid +
      `'
	join wm_qualificationdropdown1selection on wm_qualificationdropdown1selection.article=wm_article.id
	join qualificationlabels on qualificationlabels.clientid=wm_issue.client
	join qualificationdropdown1 on qualificationdropdown1.label=qualificationlabels.id and qualificationdropdown1.id=wm_qualificationdropdown1selection.dropdown1 and wm_article.id=wm_qualificationdropdown1selection.article
	left join wm_qualificationdropdown2selection on wm_qualificationdropdown2selection.article=wm_article.id
	left join qualificationdropdown2 on qualificationdropdown2.dropdown1=qualificationdropdown1.id and qualificationdropdown2.id=wm_qualificationdropdown2selection.dropdown2 and wm_article.id=wm_qualificationdropdown2selection.article
	left join wm_qualificationcommentandshowcase on wm_article.id = wm_qualificationcommentandshowcase.article
    group by articleid,clientid`;
    var qs1 = " wm_qualificationdropdown1selection ";
    var qs2 = " wm_qualificationdropdown2selection ";
    var qcomment = " wm_qualificationcommentandshowcase ";
  }

  var articleids = req.body.checkedarticles;

  articleids.forEach(function (articleid) {
    if (isNaN(articleid)) {
      //Update mongo

      // console.log(sel);
      msqlDbConnection.query(sel, "", function (error, results) {
        var dd1 = results[0].dd1;
        var dd2 = results[0].dd2;
        var showcase = results[0].showcase;
        var comment = results[0].comment;
        var a = { dd1: dd1, dd2: dd2, comment: comment };

        var articleidCond = {
          $and: [{ articleid: articleid }, { clientid: clientid }],
        };

        articlesModule.updateOne(
          articleidCond,
          {
            $set: { qualification: a, showcase: showcase },
          },
          function (err, result1) {
            if (err) {
              //console.log("error 5");
              // console.log(err);
              //status = true;
              //res.status(500);
              //res.send("internal error");
            } else {
              //Delete already inserted article
              var qd1 =
                "delete from qualificationdropdown1selection where clientid='" +
                clientid +
                "' and article='" +
                articleid +
                "'";
              msqlDbConnection.query(qd1);
              // console.log(q1);
              var qd2 =
                "delete from qualificationdropdown2selection where clientid='" +
                clientid +
                "' and article='" +
                articleid +
                "'";
              msqlDbConnection.query(qd2);

              var qd3 =
                "delete from qualificationcommentandshowcase where client='" +
                clientid +
                "' and article='" +
                articleid +
                "'";
              msqlDbConnection.query(qd3);

              //Insert article
              var q1 =
                "insert into qualificationdropdown1selection (article,label,dropdown1,clientid) select '" +
                articleid +
                "' as article,label,dropdown1,clientid from " +
                qs1 +
                "  where clientid='" +
                clientid +
                "' and article='" +
                copyarticleid +
                "'";
              msqlDbConnection.query(q1);
              console.log(q1);
              var q2 =
                "insert into qualificationdropdown2selection (article,dropdown1,dropdown2,clientid) select '" +
                articleid +
                "' as article,dropdown1,dropdown2,clientid from " +
                qs2 +
                " where clientid='" +
                clientid +
                "' and article='" +
                copyarticleid +
                "'";
              msqlDbConnection.query(q2);

              var q3 =
                "insert into qualificationcommentandshowcase(article,client,comment,showcase) select '" +
                articleid +
                "' as article,client,comment,showcase from " +
                qcomment +
                " where client='" +
                clientid +
                "' and article='" +
                copyarticleid +
                "'";
              msqlDbConnection.query(q3);

              //res.status(200);
              //status = true;
              //console.log("sending data");
              //res.json(result1);
            }
          }
        );
      });
    } else {
      //web
      //Update mongo
      console.log(sel);
      msqlDbConnection.query(sel, "", function (error, results) {
        var dd1 = results[0].dd1;
        var dd2 = results[0].dd2;
        var showcase = results[0].showcase;
        var comment = results[0].comment;
        var a = { dd1: dd1, dd2: dd2, comment: comment };

        var articleidCond = {
          $and: [{ articleid: articleid }, { clientid: clientid }],
        };

        articlesModule.updateOne(
          articleidCond,
          {
            $set: { qualification: a, showcase: showcase },
          },
          function (err, result1) {
            if (err) {
              //console.log("error 5");
              // console.log(err);
              //status = true;
              //res.status(500);
              //res.send("internal error");
            } else {
              //Delete already inserted article
              var qd1 =
                "delete from wm_qualificationdropdown1selection where clientid='" +
                clientid +
                "' and article='" +
                articleid +
                "'";
              msqlDbConnection.query(qd1);
              // console.log(q1);
              var qd2 =
                "delete from wm_qualificationdropdown2selection where clientid='" +
                clientid +
                "' and article='" +
                articleid +
                "'";
              msqlDbConnection.query(qd2);

              var qd3 =
                "delete from wm_qualificationcommentandshowcase where client='" +
                clientid +
                "' and article='" +
                articleid +
                "'";
              msqlDbConnection.query(qd3);

              //Insert article

              var q1 =
                "insert into wm_qualificationdropdown1selection (article,label,dropdown1,clientid) select '" +
                articleid +
                "' as article,label,dropdown1,clientid from " +
                qs1 +
                "  where clientid='" +
                clientid +
                "' and article='" +
                copyarticleid +
                "'";
              msqlDbConnection.query(q1);
              console.log(q1);
              var q2 =
                "insert into wm_qualificationdropdown2selection (article,dropdown1,dropdown2,clientid) select '" +
                articleid +
                "' as article,dropdown1,dropdown2,clientid from " +
                qs2 +
                " where clientid='" +
                clientid +
                "' and article='" +
                copyarticleid +
                "'";
              msqlDbConnection.query(q2);

              var q3 =
                "insert into wm_qualificationcommentandshowcase(article,client,comment,showcase) select '" +
                articleid +
                "' as article,client,comment,showcase from " +
                qcomment +
                " where client='" +
                clientid +
                "' and article='" +
                copyarticleid +
                "'";
              msqlDbConnection.query(q3);
              //res.status(200);
              //status = true;
              //console.log("sending data");
              //res.json(result1);
            }
          }
        );
      });
    }
  });
  res.status(200);
  status = true;
  console.log("sending data");
  res.json("yes");
};

RejectarticlesList = function (req, res) {
  var articleids = req.body.articleids;
  var articleidsMon = req.body.articleids;
  var condition = "";
  var status = false;
  var clientid = req.body.articlepara.clientid;
  var selRejectReason = req.body.articlepara.selRejectReason;
  var userEmail = req.body.articlepara.userEmail;
  var contactId = 0;

  //********************************************MysqL Update**********************************************************************//
  var sql =
    "select contactid from clientcontacts where email=? and clientid=? limit 1";
  msqlDbConnection.query(
    sql,
    [userEmail, clientid],
    function (error, results, fields) {
      if (error) {
        console.log("error ocurred", error);
        res.send({
          code: 400,
          failed: "error ocurred",
        });
      } else {
        contactId = results[0].contactid;
        var printRejectInsert = "";
        var printArticleIsStrings = "";
        var webArticleIsStrings = "";
        var webRejectInsert = "";
        articleids.forEach(function (articleid) {
          if (isNaN(articleid)) {
            printArticleIsStrings += "'" + articleid + "',";
            printRejectInsert +=
              "(" +
              selRejectReason +
              ",'rejected by click','" +
              clientid +
              "','" +
              articleid +
              "'," +
              contactId +
              "),";
          } else {
            webArticleIsStrings += "'" + articleid + "',";
            webRejectInsert +=
              "(" +
              selRejectReason +
              ",'rejected by click','" +
              clientid +
              "','" +
              articleid +
              "'," +
              contactId +
              "),";
          }
        });
        if (printArticleIsStrings != "" && webArticleIsStrings != "") {
          printRejectInsert = printRejectInsert.replace(/,\s*$/, "");
          printArticleIsStrings = printArticleIsStrings.replace(/,\s*$/, "");
          var sqlDel =
            "delete from rejection where client=? and article in(" +
            printArticleIsStrings.split(/,\s*/) +
            ")";
          msqlDbConnection.query(
            sqlDel,
            [clientid],
            function (error, results, fields) {
              if (error) {
                console.log("error ocurred", error);
                res.send({
                  code: 400,
                  failed: "error ocurred",
                });
              } else {
                var insDta =
                  "insert into rejection (reason,remarks,client,article,contactid) values " +
                  printRejectInsert.split(/,\s*/);
                msqlDbConnection.query(
                  insDta,
                  [],
                  function (error, results, fields) {
                    if (error) {
                      console.log("error ocurred", error);
                      res.send({
                        code: 400,
                        failed: "error ocurred",
                      });
                    } else {
                      var sqlUpdateKeywordLog =
                        "update keywordlog set rejected = 1 where clientid =? and articleid in(" +
                        printArticleIsStrings.split(/,\s*/) +
                        ")";
                      msqlDbConnection.query(
                        sqlUpdateKeywordLog,
                        [clientid, printArticleIsStrings],
                        function (error, results, fields) {
                          if (error) {
                            console.log("error ocurred", error);
                            res.send({
                              code: 400,
                              failed: "error ocurred",
                            });
                          } else {
                            webArticleIsStrings = webArticleIsStrings.replace(
                              /,\s*$/,
                              ""
                            );
                            webRejectInsert = webRejectInsert.replace(
                              /,\s*$/,
                              ""
                            );
                            var sqlDel =
                              "delete from wm_rejection where client=? and article in(" +
                              webArticleIsStrings.split(/,\s*/) +
                              ")";
                            msqlDbConnection.query(
                              sqlDel,
                              [clientid],
                              function (error, results, fields) {
                                if (error) {
                                  console.log("error ocurred", error);
                                  res.send({
                                    code: 400,
                                    failed: "error ocurred",
                                  });
                                } else {
                                  var insDta =
                                    "insert into wm_rejection (reason,remarks,client,article,contactid) values " +
                                    webRejectInsert.split(/,\s*/);
                                  msqlDbConnection.query(
                                    insDta,
                                    [],
                                    function (error, results, fields) {
                                      if (error) {
                                        console.log("error ocurred", error);
                                        res.send({
                                          code: 400,
                                          failed: "error ocurred",
                                        });
                                      } else {
                                        var articleidCond = {
                                          $and: [
                                            {
                                              articleid: { $in: articleidsMon },
                                            },
                                            { clientid: clientid },
                                          ],
                                        };

                                        // console.log(articleidCond);
                                        articlesModule.update(
                                          articleidCond,
                                          {
                                            $set: { rejected: "1" },
                                          },
                                          { multi: true },
                                          function (err, result1) {
                                            if (err) {
                                              console.log("error 5");
                                              // console.log(err);
                                              status = true;
                                              res.status(500);
                                              res.send("internal error");
                                            } else {
                                              res.status(200);
                                              status = true;
                                              console.log("sending data");
                                              res.json(result1);
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        } else if (printArticleIsStrings != "" && webArticleIsStrings == "") {
          printRejectInsert = printRejectInsert.replace(/,\s*$/, "");
          printArticleIsStrings = printArticleIsStrings.replace(/,\s*$/, "");
          var sqlDel =
            "delete from rejection where client=? and article in(" +
            printArticleIsStrings.split(/,\s*/) +
            ")";
          msqlDbConnection.query(
            sqlDel,
            [clientid],
            function (error, results, fields) {
              if (error) {
                console.log("error ocurred", error);
                res.send({
                  code: 400,
                  failed: "error ocurred",
                });
              } else {
                var insDta =
                  "insert into rejection (reason,remarks,client,article,contactid) values " +
                  printRejectInsert.split(/,\s*/);
                msqlDbConnection.query(
                  insDta,
                  [],
                  function (error, results, fields) {
                    if (error) {
                      console.log("error ocurred", error);
                      res.send({
                        code: 400,
                        failed: "error ocurred",
                      });
                    } else {
                      var sqlUpdateKeywordLog =
                        "update keywordlog set rejected = 1 where clientid =? and articleid in(" +
                        printArticleIsStrings.split(/,\s*/) +
                        ")";
                      msqlDbConnection.query(
                        sqlUpdateKeywordLog,
                        [clientid, printArticleIsStrings],
                        function (error, results, fields) {
                          if (error) {
                            console.log("error ocurred", error);
                            res.send({
                              code: 400,
                              failed: "error ocurred",
                            });
                          } else {
                            var articleidCond = {
                              $and: [
                                { articleid: { $in: articleidsMon } },
                                { clientid: clientid },
                              ],
                            };

                            // console.log(articleidCond);
                            articlesModule.update(
                              articleidCond,
                              {
                                $set: { rejected: "1" },
                              },
                              { multi: true },
                              function (err, result1) {
                                if (err) {
                                  console.log("error 5");
                                  // console.log(err);
                                  status = true;
                                  res.status(500);
                                  res.send("internal error");
                                } else {
                                  res.status(200);
                                  status = true;
                                  console.log("sending data");
                                  res.json(result1);
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        } else if (printArticleIsStrings == "" && webArticleIsStrings != "") {
          webArticleIsStrings = webArticleIsStrings.replace(/,\s*$/, "");
          webRejectInsert = webRejectInsert.replace(/,\s*$/, "");
          var sqlDel =
            "delete from wm_rejection where client=? and article in(" +
            webArticleIsStrings.split(/,\s*/) +
            ")";
          msqlDbConnection.query(
            sqlDel,
            [clientid],
            function (error, results, fields) {
              if (error) {
                console.log("error ocurred", error);
                res.send({
                  code: 400,
                  failed: "error ocurred",
                });
              } else {
                var insDta =
                  "insert into wm_rejection (reason,remarks,client,article,contactid) values " +
                  webRejectInsert.split(/,\s*/);
                msqlDbConnection.query(
                  insDta,
                  [],
                  function (error, results, fields) {
                    if (error) {
                      console.log("error ocurred", error);
                      res.send({
                        code: 400,
                        failed: "error ocurred",
                      });
                    } else {
                      var articleidCond = {
                        $and: [
                          { articleid: { $in: articleidsMon } },
                          { clientid: clientid },
                        ],
                      };

                      // console.log(articleidCond);
                      articlesModule.update(
                        articleidCond,
                        {
                          $set: { rejected: "1" },
                        },
                        { multi: true },
                        function (err, result1) {
                          if (err) {
                            console.log("error 5");
                            // console.log(err);
                            status = true;
                            res.status(500);
                            res.send("internal error");
                          } else {
                            res.status(200);
                            status = true;
                            console.log("sending data");
                            res.json(result1);
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }

        //	    if (webArticleIsStrings != '') {
        //
        //
        //	    }
      }
    }
  );
  //**************************************************Mysql Update end******************************************************************
};

articlesById = function (req, res) {
  var articleids = req.body.articleids;
  // var idscommasep = "";
  var query = {};

  // Object.keys(articleids).forEach(function(k){
  //     idscommasep+=articleids[k]+", ";
  // // });
  // console.log(idscommasep.slice(0, -2));
  query.articleid = {
    $in: articleids,
  };
  query.clientid = req.body.articlepara.clientid;

  articlesModule.find(query, function (err, impacts) {
    if (err) {
      console.log("error 6");
      console.log(err);
      res.status(500);
      res.send("internal error");
    } else {
      res.status(200);
      console.log("sending data");
      // console.log(impacts);
      res.json(impacts);
    }
  });
};

sendmail = function (req, res) {};
updateshowcase = function (req, res) {
  var articleids = req.body.articleid;
  var condition = "";
  var status = false;
  var clientid = req.body.articlepara.clientid;
  var userEmail = req.body.articlepara.userEmail;
  var articleidCond = {
    articleid: articleids,
    clientid: clientid,
  };
  var articleidCondFind = {
    articleid: articleids,
    clientid: clientid,
    showcase: 1,
  };
  var showcasevalue = 1;
  articlesModule.find(articleidCondFind, function (err, impacts) {
    if (err) {
      console.log("error 3");
      //console.log(err);
      res.status(500);
      res.send("internal error");
    } else {
      if (impacts.length > 0) {
        showcasevalue = 0;
      }
      articlesModule.updateOne(
        articleidCond,
        {
          $set: { showcase: showcasevalue },
        },
        { multi: true },
        function (err, result1) {
          if (err) {
            console.log("error 7");
            // console.log(err);
            status = true;
            res.status(500);
            res.send("internal error");
          } else {
            res.status(200);
            status = false;
            console.log("sending data");
            // console.log(impacts);
            //res.json(articleidCond);
            //mysql
            if (showcasevalue == 1) {
              if (isNaN(articleids)) {
                var insDta =
                  "insert into qualificationcommentandshowcase (article, client,showcase) values ('" +
                  articleids +
                  "','" +
                  clientid +
                  "','" +
                  showcasevalue +
                  "')";
              } else {
                var insDta =
                  "insert into wm_qualificationcommentandshowcase (article, client,showcase) values ('" +
                  articleids +
                  "','" +
                  clientid +
                  "','" +
                  showcasevalue +
                  "')";
              }
            } else {
              if (isNaN(articleids)) {
                var insDta =
                  "delete from qualificationcommentandshowcase where article='" +
                  articleids +
                  "' and client='" +
                  clientid +
                  "'";
              } else {
                var insDta =
                  "delete from wm_qualificationcommentandshowcase where article='" +
                  articleids +
                  "' and client='" +
                  clientid +
                  "'";
              }
            }
            // console.log(insDta);
            msqlDbConnection.query(
              insDta,
              [],
              function (error, results, fields) {
                if (error) {
                  console.log("error ocurred", error);
                  res.send({
                    code: 400,
                    failed: "error ocurred",
                  });
                }
              }
            );
            if (isNaN(articleids)) {
              var LogQuery =
                "insert into qualification_log(user_id,client_id,article_id,date_time)values('" +
                userEmail +
                "','" +
                clientid +
                "','" +
                articleids +
                "',NOW())";
            } else {
              var LogQuery =
                "insert into wm_qualification_logs(user_id,client_id,article_id,date_time)values('" +
                userEmail +
                "','" +
                clientid +
                "','" +
                articleids +
                "',NOW())";
            }
            // console.log(LogQuery);

            msqlDbConnection.query(
              LogQuery,
              [],
              function (error, results, fields) {
                if (error) {
                  console.log("error ocurred", error);
                  res.send({
                    code: 400,
                    failed: "error ocurred",
                  });
                }
                res.json(articleidCond);
              }
            );

            //res.json(articleidCond);
            //mysql
          }
        }
      );
    }
  });
};

getsummary = function (req, res) {
  var articleid = req.body.articleid;
  // console.log(articleid);
  if (isNaN(articleid)) {
    var sql = `select group_concat(full_text) as full_text,
    group_concat( distinct concat(journalist.fname , ' ' , journalist.lname) separator ', '  ) as journalist
     from article_image
     left join article_journalist on article_journalist.ArticleID=article_image.ArticleID
     and article_journalist.ArticleID= ?
     left join journalist on journalist.jourid=article_journalist.journalistid
     where article_image.articleid= ?`;
  } else {
    var sql = `select CONVERT(CAST(CONVERT(description USING latin1) AS BINARY) USING utf8) as full_text,journalist from wm_article where id = ?`;
  }
  msqlDbConnection.query(
    sql,
    [articleid, articleid],
    function (error, results, fields) {
      if (error) {
        console.log("error ocurred", error);
        res.send({
          code: 400,
          failed: "error ocurred",
        });
      } else {
        //console.log('The solution is: ', results);
        if (results.length > 0) {
          res.json(results);
        } else {
          res.send({});
        }
      }
    }
  );
};

getclientkeyword = function (req, res) {
  var articleid = req.body.articleid;
  var clientid = req.body.clientid;
  // console.log(articleid);
  if (isNaN(articleid)) {
    var sql =
      "select distinct keyword_master.keyword as keyword,keywordlog.keytype as keytype  from keyword_master join keywordlog on keyword_master.keyid=keywordlog.keyid and keywordlog.clientid = ? and keywordlog.articleid= ? ";
  } else {
    var sql =
      "SELECT wm_issue.name as keyword, wm_issue.type as keytype FROM wm_issue JOIN wm_article_issue ON wm_article_issue.issue=wm_issue.id AND wm_issue.deleted=0 JOIN wm_article ON wm_article_issue.article=wm_article.id where wm_issue.client= ? and wm_article.id= ? ";
  }
  msqlDbConnection.query(
    sql,
    [clientid, articleid],
    function (error, results, fields) {
      if (error) {
        console.log("error ocurred", error);
        res.send({
          code: 400,
          failed: "error ocurred",
        });
      } else {
        //console.log('The solution is: ', results);
        if (results.length > 0) {
          res.json(results);
        } else {
          res.send({});
        }
      }
    }
  );
};

getPublicationList = function (req, res) {
  var filterArtType = req.body.filterArtType;
  if (filterArtType == "Print") {
    //and PrimaryPubID=0
    var sql =
      "select id, name from (select Pubid as id, Title as name from pub_master where deleted=0 group by name order by name asc ) as t group by name";
  } else if (filterArtType == "Web") {
    var sql =
      "select id, name from (select id, name from wm_web_universe where deleted=0 group by name order by name asc ) as t group by name";
  } else {
    var sql =
      "select id, name from (select Pubid as id, Title as name from pub_master where deleted=0 group by name union select id, name from wm_web_universe where deleted=0 group by name order by name asc ) as t group by name";
  }

  msqlDbConnection.query(sql, [], function (error, results, fields) {
    if (error) {
      console.log("error ocurred", error);
      res.send({
        code: 400,
        failed: "error ocurred",
      });
    } else {
      //console.log('The solution is: ', results);
      if (results.length > 0) {
        res.json(results);
      } else {
        res.send({});
      }
    }
  });
};

getEditionList = function (req, res) {
  var pubname = req.body.pubname;

  if (pubname != "") {
    var sql =
      "select picklist.id as id, picklist.name as name from picklist join pub_master on pub_master.place = picklist.id where picklist.id !=0 and pub_master.Title in(?) group by id order by name";
  } else {
    var sql =
      "select picklist.id as id, picklist.name as name from picklist join pub_master on pub_master.place = picklist.id where picklist.id !=0 group by id order by name";
  }

  msqlDbConnection.query(sql, [pubname], function (error, results, fields) {
    if (error) {
      console.log("error ocurred", error);
      res.send({
        code: 400,
        failed: "error ocurred",
      });
    } else {
      //console.log('The solution is: ', results);
      if (results.length > 0) {
        res.json(results);
      } else {
        res.send({});
      }
    }
  });
};

getLanguageList = function (req, res) {
  var pubname = req.body.pubname;
  if (pubname != "") {
    var sql =
      "select id,name from picklist join pub_master on picklist.ID=pub_master.Language where picklist.type='Language' and pub_master.Title in(?) group by id order by name";
  } else {
    var sql =
      "select id,name from picklist where type='Language' group by id order by name";
  }
  msqlDbConnection.query(sql, [pubname], function (error, results, fields) {
    if (error) {
      console.log("error ocurred", error);
      res.send({
        code: 400,
        failed: "error ocurred",
      });
    } else {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.send({});
      }
    }
  });
};

getClientKeywordList = function (req, res) {
  var clientid = req.body.clientid;
  var companttype = req.body.companttype;
  var filterArtType = req.body.filterArtType;
  var company_keyword = req.body.company_keyword;
  companttype = companttype.replace(/,\s*$/, "");
  if (company_keyword == "company") {
    if (filterArtType == "Print") {
      if (companttype != "" && companttype != undefined) {
        var sql =
          "select id, name,KeyType,CompanyS, ktype from (SELECT CAST(keyword_master.keyID as CHAR) as Id, clientkeyword.CompanyS as name,clientkeyword.Type as KeyType,clientkeyword.CompanyS as CompanyS, 'print' as ktype FROM clientkeyword join keyword_master on keyword_master.keyId=clientkeyword.KeywordId where clientid= ? and clientkeyword.Type in (" +
          companttype +
          ") and clientkeyword.CompanyS !='' group by name) as t order by KeyType, name";
      } else {
        var sql =
          "select id, name,KeyType,CompanyS, ktype from (SELECT CAST(keyword_master.keyID as CHAR) as Id, clientkeyword.CompanyS as name,clientkeyword.Type as KeyType,clientkeyword.CompanyS as CompanyS, 'print' as ktype FROM clientkeyword join keyword_master on keyword_master.keyId=clientkeyword.KeywordId where clientid= ? and clientkeyword.CompanyS !='' group by name) as t order by KeyType, name";
      }
    } else if (filterArtType == "Web") {
      if (companttype != "" && companttype != undefined) {
        var sql =
          "select id, name,KeyType,CompanyS, ktype from (select CAST(wm_issue.id as CHAR) as id, CONVERT(CAST(wm_company_issue.name as BINARY) USING utf8)  as name,type as KeyType,'' as CompanyS,'web' as ktype from wm_issue join wm_company_issue on wm_company_issue.id=wm_issue.companyissue where client= '" +
          clientid +
          "' and wm_issue.deleted=0 and type in (" +
          companttype +
          ") group by name) as t order by KeyType, name";
      } else {
        var sql =
          "select id, name,KeyType,CompanyS, ktype from (select CAST(wm_issue.id as CHAR) as id, CONVERT(CAST(wm_company_issue.name as BINARY) USING utf8)  as name,type as KeyType,'' as CompanyS,'web' as ktype from wm_issue join wm_company_issue on wm_company_issue.id=wm_issue.companyissue where client= '" +
          clientid +
          "' and wm_issue.deleted=0 group by name) as t order by KeyType, name";
      }
    } else {
      if (companttype != "" && companttype != undefined) {
        var sql =
          "select id, name,KeyType,CompanyS, ktype from (SELECT CAST(keyword_master.keyID as CHAR) as Id, clientkeyword.CompanyS as name,clientkeyword.Type as KeyType,clientkeyword.CompanyS as CompanyS, 'print' as ktype FROM clientkeyword join keyword_master on keyword_master.keyId=clientkeyword.KeywordId where clientid= ? and clientkeyword.Type in (" +
          companttype +
          ") and clientkeyword.CompanyS !='' group by name union select CAST(wm_issue.id as CHAR) as id, CONVERT(CAST(wm_company_issue.name as BINARY) USING utf8)  as name,type as KeyType,'' as CompanyS,'web' as ktype from wm_issue join wm_company_issue on wm_company_issue.id=wm_issue.companyissue where client= '" +
          clientid +
          "' and wm_issue.deleted=0 and type in (" +
          companttype +
          ") group by name) as t order by KeyType, name";
      } else {
        var sql =
          "select id, name,KeyType,CompanyS, ktype from (SELECT CAST(keyword_master.keyID as CHAR) as Id, clientkeyword.CompanyS as name,clientkeyword.Type as KeyType,clientkeyword.CompanyS as CompanyS, 'print' as ktype FROM clientkeyword join keyword_master on keyword_master.keyId=clientkeyword.KeywordId where clientid= ? and clientkeyword.CompanyS !='' group by name union select CAST(wm_issue.id as CHAR) as id, CONVERT(CAST(wm_company_issue.name as BINARY) USING utf8)  as name,type as KeyType,'' as CompanyS,'web' as ktype from wm_issue join wm_company_issue on wm_company_issue.id=wm_issue.companyissue where client= '" +
          clientid +
          "' and wm_issue.deleted=0 group by name) as t order by KeyType, name";
      }
    }
  } else {
    if (filterArtType == "Print") {
      if (companttype != "" && companttype != undefined) {
        var sql =
          "select id, name,KeyType,CompanyS, ktype from (SELECT CAST(keyword_master.keyID as CHAR) as Id, keyword_master.KeyWord as name,clientkeyword.Type as KeyType,clientkeyword.CompanyS as CompanyS, 'print' as ktype FROM clientkeyword join keyword_master on keyword_master.keyId=clientkeyword.KeywordId where clientid= ? and clientkeyword.Type in (" +
          companttype +
          ") group by name) as t order by KeyType, name";
      } else {
        var sql =
          "select id, name,KeyType,CompanyS, ktype from (SELECT CAST(keyword_master.keyID as CHAR) as Id, keyword_master.KeyWord as name,clientkeyword.Type as KeyType,clientkeyword.CompanyS as CompanyS, 'print' as ktype FROM clientkeyword join keyword_master on keyword_master.keyId=clientkeyword.KeywordId where clientid= ? group by name) as t order by KeyType, name";
      }
    } else if (filterArtType == "Web") {
      if (companttype != "" && companttype != undefined) {
        var sql =
          "select id, name,KeyType,CompanyS, ktype from (select CAST(id as CHAR) as id, CONVERT(CAST(wm_issue.name as BINARY) USING utf8)  as name,type as KeyType,'' as CompanyS,'web' as ktype from wm_issue where client= '" +
          clientid +
          "' and wm_issue.deleted=0 and type in (" +
          companttype +
          ") group by name) as t order by KeyType, name";
      } else {
        var sql =
          "select id, name,KeyType,CompanyS, ktype from (select CAST(id as CHAR) as id, CONVERT(CAST(wm_issue.name as BINARY) USING utf8)  as name,type as KeyType,'' as CompanyS,'web' as ktype from wm_issue where client= '" +
          clientid +
          "' and wm_issue.deleted=0 group by name) as t order by KeyType, name";
      }
    } else {
      if (companttype != "" && companttype != undefined) {
        var sql =
          "select id, name,KeyType,CompanyS, ktype from (SELECT CAST(keyword_master.keyID as CHAR) as Id, keyword_master.KeyWord as name,clientkeyword.Type as KeyType,clientkeyword.CompanyS as CompanyS, 'print' as ktype FROM clientkeyword join keyword_master on keyword_master.keyId=clientkeyword.KeywordId where clientid= ? and clientkeyword.Type in (" +
          companttype +
          ") union select id, CONVERT(CAST(wm_issue.name as BINARY) USING utf8)  as name,type as KeyType,'' as CompanyS,'web' as ktype from wm_issue where client= '" +
          clientid +
          "' and wm_issue.deleted=0 and type in (" +
          companttype +
          ") group by name) as t order by KeyType, name";
      } else {
        var sql =
          "select id, name,KeyType,CompanyS, ktype from (SELECT CAST(keyword_master.keyID as CHAR) as Id, keyword_master.KeyWord as name,clientkeyword.Type as KeyType,clientkeyword.CompanyS as CompanyS, 'print' as ktype FROM clientkeyword join keyword_master on keyword_master.keyId=clientkeyword.KeywordId where clientid= ? union select id, CONVERT(CAST(wm_issue.name as BINARY) USING utf8)  as name,type as KeyType,'' as CompanyS,'web' as ktype from wm_issue where client= '" +
          clientid +
          "' and wm_issue.deleted=0 group by name) as t order by KeyType, name";
      }
    }
  }
  //console.log(sql);
  msqlDbConnection.query(
    sql,
    [clientid, companttype],
    function (error, results, fields) {
      if (error) {
        console.log("error ocurred", error);
        res.send({
          code: 400,
          failed: "error ocurred",
        });
      } else {
        //console.log('The solution is: ', results);
        if (results.length > 0) {
          res.json(results);
        } else {
          res.send({});
        }
      }
    }
  );
};

module.exports = {
  get: get,
  articlepost: articlepost,
  excelpost: excelpost,
  articledetailpost: articledetailpost,
  articleupdateget: articleupdateget,
  sendmail: sendmail,
  updateshowcase: updateshowcase,
  RejectarticlesList: RejectarticlesList,
  articlesById: articlesById,
  getsummary: getsummary,
  getclientkeyword: getclientkeyword,
  getPublicationList: getPublicationList,
  getEditionList: getEditionList,
  getLanguageList: getLanguageList,
  getClientKeywordList: getClientKeywordList,
  getrejectedArticles: getrejectedArticles,
};
