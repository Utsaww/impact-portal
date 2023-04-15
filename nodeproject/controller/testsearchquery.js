const searchModel = require("../model/sqModel.js");

const getArticles = (req, res) => {
  // console.log(req.body.fullTextKeyword);
  const _searchKeyword = req.body.fullTextKeyword;
  console.log(_searchKeyword);
  const keywords = _searchKeyword
    .match(/"(?:\\.|[^\\"])*"|[^ ]+/g)
    .map((kw) => kw.replace(/"/g, ""))
    .map((kw) => kw.toUpperCase());
  const clientid = req.body.clientid;

  //this is to -date
  const fromDate = new Date(req.body.tdate);
  ///////////////////////////////////////
  //this is from -date
  const toDate = new Date(req.body.fdate);

  // Validate page and limit parameters
  // const page = parseInt(req.body.page || 1);
  // const perpage = parseInt(req.body.limit) || 100;

  let searchAggregation = [];

  // INITIALIZE SEARCH STAGE
  let searchStage = {
    $search: {
      compound: {},
    },
  };
  let filterArray = [];
  let mustArray = [];
  let shouldArray = [];
  let mustNotArray = [];

  const searchTermObject = {
    text: {
      path: ["headline", "subtitle", "fulltext"],
      query: keywords,
    },
  };
  const ratingObject = {
    range: {
      path: "pubdateRange",
      gte: fromDate,
      lte: toDate,
    },
  };

  const genreObject = {
    text: {
      path: "clientidArray",
      query: clientid,
    },
  };

  // IF ARGUMENTS RECEIVED, PUSH ONTO CLAUSE ARRAYS
  if (keywords !== "") {
    shouldArray.push(searchTermObject);
  }

  filterArray.push(ratingObject);

  mustArray.push(genreObject);

  // ASSIGN NEW CLAUSE ARRAYS TO COMPOUND FIELD IN SEARCH STAGE
  searchStage.$search.compound.should = shouldArray;
  searchStage.$search.compound.must = mustArray;
  searchStage.$search.compound.filter = filterArray;

  searchAggregation.push(searchStage, projectStage);
  console.log(JSON.stringify(searchAggregation));
  return searchAggregation;
};

const projectStage = {
  $project: {
    _id: 0,
    articleid: 1,
  },
};
// debugger;
//   searchModel.aggregate(agg, (err, data) => {
//     if (err) {
//       console.log(err);
//       res.status(500);
//     } else {
//       const _articleids = data.map((x) => x.articleid);

//       res
//         .status(200)
//         .json({ articleids: _articleids, page: page, perpage: perpage });
//     }
//   });
// };

module.exports = {
  getArticles,
};
