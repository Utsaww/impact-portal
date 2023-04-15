const searchModel = require("../model/sqModel.js");

const getArticles = (req, res) => {
  const _searchKeyword = req.body.fullTextKeyword;
  const withinwords = parseInt(req.body.within_check);
  const slop = withinwords;

  console.log(_searchKeyword);
  console.log(withinwords);
  // console.log("hi");
  const keywords = _searchKeyword
    .replace(/[()]/g, "") // Remove all parentheses
    .match(/"(?:\\.|[^\\"])*"|[^ ]+/g)
    .map((kw) => kw.replace(/"/g, ""))
    .map((kw) => kw.toUpperCase());

  const clientid = req.body.clientid;

  //this is to -date
  const fromDate = new Date(req.body.tdate);
  fromDate.setDate(fromDate.getDate() + 1);
  fromDate.setHours(23);
  fromDate.setMinutes(59);
  fromDate.setSeconds(59);
  fromDate.setMilliseconds(0);

  ///////////////////////////////////////
  //this is from -date
  const toDate = new Date(req.body.fdate);

  let agg;

  let filterArray = [
    {
      range: {
        path: "pubdateRange",
        gte: toDate,
        lte: fromDate,
      },
    },
  ];
  let mustArray = [
    {
      phrase: {
        query: clientid,
        path: ["clientidArray"],
      },
    },
  ];
  let shouldArray = [];

  if (keywords.length === 1) {
    agg = [
      {
        $search: {
          index: "fulltext",
          compound: {
            filter: [
              {
                range: {
                  path: "pubdateRange",
                  gte: toDate,
                  lte: fromDate,
                },
              },
            ],
            must: [
              {
                phrase: {
                  query: clientid,
                  path: ["clientidArray"],
                },
              },

              {
                phrase: {
                  query: keywords[0],
                  path: ["headline", "subtitle", "fulltext"],
                  ...(slop ? { slop } : {}),
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          articleid: 1,
          _id: 0,
        },
      },
    ];
  } else {
    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i];
      const nextKeyword = keywords[i + 1];

      if (nextKeyword === "AND") {
        mustArray.push({
          phrase: {
            query: keyword,
            path: ["headline", "subtitle", "fulltext"],
          },
        });
        i++;
      } else if (nextKeyword === "OR") {
        shouldArray.push({
          phrase: {
            query: keyword,
            path: ["headline", "subtitle", "fulltext"],
          },
        });
        i++;
      } else {
        // if there is no next keyword, check the previous one to decide which array to add the current keyword to
        const prevKeyword = keywords[i - 1];
        if (prevKeyword === "AND") {
          mustArray.push({
            phrase: {
              query: keyword,
              path: ["headline", "subtitle", "fulltext"],
            },
          });
        } else if (prevKeyword === "OR") {
          shouldArray.push({
            phrase: {
              query: keyword,
              path: ["headline", "subtitle", "fulltext"],
            },
          });
        }
      }
    }
    // debugger;
    if (mustArray.length > 0 || shouldArray.length > 0) {
      agg = [
        {
          $search: {
            index: "fulltext",
            compound: {
              filter: filterArray.length > 1 ? filterArray : filterArray[0],
              must: mustArray.length > 1 ? mustArray : mustArray[0],
              should: shouldArray.length > 1 ? shouldArray : shouldArray[0],
              ...(shouldArray.length > 0 && { minimumShouldMatch: 1 }),
            },
          },
        },
        {
          $project: {
            articleid: 1,
            _id: 0,
          },
        },
      ];
    }
  }
  // debugger;
  searchModel.aggregate(agg, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500);
    } else {
      const _articleids = data.map((x) => x.articleid);
      // console.log(_articleids);

      res.status(200).json({ articleids: _articleids });
    }
  });
};

module.exports = {
  getArticles,
};
