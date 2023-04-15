var articlesModule = require("../model/ArticleModel1.js");
var db = require("../db.js");
var ObjectId = require('mongodb').ObjectID;

//
var get = (req, res) => {


    //res.send(req.query);


    const {
        page,
        perpage
    } = req.query;

    if (req.body.sortdate == 'desc') {
        datesort = -1;
    } else {
        datesort = 1;
    }


    var options = {

        page: parseInt(page, 10) || 1,
        limit: parseInt(perpage, 10) || 10000,
        sort: {
            'captureddatetime': datesort
        }


    }




    articlesModule.paginate({}, options, function (err, impacts) {


        if (err) {
            console.log("error");
            res.status(500);
            res.send("internal error");
        } else {
            res.status(200);
            console.log("sending data");
            // console.log(impacts);
            res.json(impacts);
        }


    });






}

var articlepost = (req, res) => {




    if (req.body.page != null) {
        page = req.body.page;
    } else {
        page = 1;
    }
    if (req.body.perpage != null) {
        perpage = req.body.perpage;
    } else {
        perpage = 5;
    }



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

        page: parseInt(page, 10) || 1,
        limit: parseInt(perpage, 10) || 10000,
        sort: {
            'pubdate': datesort
        }

    }


    // console.log(options);


    var query = {

    };

    /* if(req.body.days=='7'){

         query.captureddatetime = {
             $gte : '2018-10-24 00:00:00',
             $lt: '2018-11-01 23:59:59'
         }

     }
     
     if(req.body.days=='previousmonth'){

         query.captureddatetime = {
             $gte : '2018-10-01 00:00:00',
             $lt: '2018-10-31 23:59:59'
         }

     }
     if(req.body.days=='currentmonth'){

         query.captureddatetime = {
             $gte : '2018-11-01 00:00:00',
             $lt: '2018-11-31 23:59:59'
         }

     }


     if(req.body.days=='previoustopreviousmonth'){

         query.captureddatetime = {
             $gte : '2018-09-01 00:00:00',
             $lt: '2018-09-31 23:59:59'
         }

     }
     */

    fromdate = req.body.fromdate;
    todate = req.body.todate;

    query.pubdate = {
        $gte: todate,
        $lte: fromdate
    }

    /*
        if (req.body.keytype == 2) {
            query.keyword = {
                $elemMatch: {
                    keytpe: 'My Competitor Keyword'
                }
            }
    
    
        }
    
        
        if (req.body.keytype == 1) {
            query.keyword = {
                $elemMatch: {
                    keytpe: 'My Company Keyword'
                }
            }
    
        }
    
        
        if (req.body.keytype == 3) {
    
            query.keyword = {
                $elemMatch: {
                    keytpe: 'My Industry Keyword'
                }
            }
    
        }*/


    if (req.body.type === "web") {
        query.type = 'WEB';
    }
    if (req.body.type === "print") {
        query.type = 'PRINT';
    }


    if (req.body.type != "print" && req.body.type != "web" && req.body.type != "") {
        query.city = req.body.type;
    }


    if (req.body.clientid != null) {
        query.clientid = req.body.clientid;

    }
    if (req.body.keytype != '') {
        query.keyword = {
            $elemMatch: {
                keytpe: req.body.keytype,
                Prominence: req.body.prominance
            }
        }
    }


    if (req.body.company != '') {
        query.keyword = {
            $elemMatch: {
                companys: req.body.company
            }
        }
    }

    if (req.body.author != '') {
        query.journalist = {
            $elemMatch: {
                "$or": [
                    {
                        journalist: { "$eq": author }

                    },
                    {
                        journalist: { "$eq": ' '+author }
                    }
                ]
            }
        }
    }

    /*
    if (req.body.prominance !='') {
        query.keyword = {
            $elemMatch: {
                Prominence: req.body.prominance
            }
        }
    }*/

    // query;

    //res.send(query);




    articlesModule.paginate(query, options, function (err, impacts) {
        // result.docs
        // result.total
        // result.limit - 10
        // result.page - 3
        // result.pages

        if (err) {
            console.log("error");
            res.status(500);
            res.send("internal error");
        } else {
            res.status(200);
            // console.log("sending data");
            //console.log(impacts.docs);
            //	  var a = impacts.docs;
            //	  var headline = [];
            //	  for (i = 0; i < a.length; i++) {
            //	      console.log(a[i][headline]);
            //	  }
            //console.log(headline);
            res.json(impacts);
        }


    });




}


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
            'pubdate': datesort
        }

    }

    //console.log("here")
    //console.log(options);


    var query = {

    };


    fromdate = req.body.fromdate;
    todate = req.body.todate;

    query.pubdate = {
        $gte: todate,
        $lte: fromdate
    }


    if (req.body.keytype == 2) {
        query.keyword = {
            $elemMatch: {
                keytpe: 'My Competitor Keyword'
            }
        }


    }
    if (req.body.keytype == 1) {
        query.keyword = {
            $elemMatch: {
                keytpe: 'My Company Keyword'
            }
        }

    }
    if (req.body.keytype == 3) {

        query.keyword = {
            $elemMatch: {
                keytpe: 'My Industry Keyword'
            }
        }

    }
    if (req.body.type === "web") {
        query.type = 'WEB';
    }
    if (req.body.type === "print") {
        query.type = 'PRINT';
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
            console.log("error");
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




}


articledetailpost = (req, res) => {

    console.log("there");
    /* var articleid = "";
     console.log(typeof(obj));


     for(item in obj){
         console.log(obj[item]);
         articleid+="'"+obj[item]+"'"+",";
     }
     
     articleid = articleid.slice(0,-1);
     console.log(articleid);

     console.log(req.body.articlepara.fromdate);
     
    db.query(`select article.articleid as articleid,article.title as title,article.pubdate AS pubdate,pub_master.Title AS publication,
    substr(full_text,0,300) as full_text
    from
     article 
     join article_image 
     on article.articleid = article_image.articleid 
    and article.pubdate >= '"+req.body.articlepara.fromdate+"' and article.pubdate <= '"+req.body.articlepara.todate+"'
    JOIN pub_master ON pub_master.pubid=article.pubid
    JOIN picklist ON picklist.id=pub_master.place and article.ArticleID in ('1c4c8532-f502-11e8-b139-fcaa14d958a2')
    group by article.articleid
     order by article.pubdate asc `,'',function (error, results, fields) {
         if(error){

         }else{
             res.send(results);
         }
         
    });*/

    //console.log(req.body.articlepara.clientid);

    var query = {

    };

    query.articleid = {
        $eq: req.body.articleids
    }

    query.clientid = req.body.articlepara.clientid;

    articlesModule.find(query, 'qualification', function (err, impacts) {
        // result.docs
        // result.total
        // result.limit - 10
        // result.page - 3
        // result.pages

        if (err) {
            console.log("error");
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


}




articleupdateget = function (req, res) {
    var query = {

    }
    qdata = req.body.data;

    //console.log(qdata);

    sendingid = [];
    //qdata.replace("[","").replace("]","");
    var finaldata;
    var check = req.body.checkedarticles;

    check.forEach(element => {

        query.clientid = req.body.articlepara.clientid;
        query.articleid = element;


        articlesModule.find(query, '_id qualification', function (err, data) {

            if (err) {
                console.log(err);
            } else {
                objid = data[0]['_id'];
                qualificationd = data[0]['qualification'];
                //console.log(objid);
                //console.log(qualificationd.length);
                if (qualificationd.length == 0) {

                    var query2 = {

                    };

                    query2.clientid = req.body.articlepara.clientid;
                    query2._id = objid;

                    // console.log(qdata);

                    articlesModule.update(query2, {
                        '$push': {
                            'qualification': qdata

                        }
                    },
                        function (err3, data3) {
                            if (err3) {
                                console.log(err3);
                            } else {
                                console.log(data3);
                                if (data3['n'] == 1) {
                                    sendingid.push(element);


                                }
                            }
                        }

                    )


                }

            }

        });



    });

    setTimeout(() => {
        console.log(sendingid);
        res.json(sendingid);
    }, 10000);


}



var clienteditions = (req, res) => {
    var query = {};
    fromdate = req.body.fromdate;
    todate = req.body.todate;
    query.type = 'PRINT';
    query.pubdate = {
        $gte: todate,
        $lte: fromdate
    }

    query.clientid = req.body.clientid;
    var q = [
        {
            $match:
                query
        },
        {
            $group:
            {
                _id: "$city"
            }
        }, { $sort: { _id: 1 } }
    ];

    articlesModule.aggregate(q, function (err, impacts) {
        if (err) {
            console.log("error" + err);
            res.status(500);
            res.send("internal error");
        } else {
            res.status(200);

            //console.log(impacts);
            res.json(impacts);
        }
    });
}



var journalistData = (req, res) => {
    var query = {};
    //company filter
    if (req.body.company) {
        var comFilter = req.body.company;
        //query = { $and: [{ 'keyword.companys': { $eq: comFilter } }, { 'keyword.companys': { $ne: "null" } }] };
	 query = { $and: [{ 'keyword.companyissue': { $eq: comFilter } }] };
    }

    //chart Data Filter Keytype and Prominent

    if (req.body.keytype) {
        var keytype = req.body.keytype;
        var prominence = req.body.prominance;
        if(prominence=='passing'){
            query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $ne: 'headline mention' } },{ 'keyword.Prominence': { $ne: 'prominent' } }] };
        }else{
        query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $eq: prominence } }] };
        }
        
    }

    fromdate = req.body.fromdate;
    todate = req.body.todate;
    query.pubdate = {
        $gte: todate,
        $lte: fromdate
    }
    query.clientid = req.body.clientid;

    if (req.body.pubsort) {
        query.publication = req.body.pubsort;
    }


    // Journalist Filter    
    if (req.body.author) {
        var author = req.body.author;
        query.journalist = {
           $elemMatch: {
                "$or": [
                    {
                        journalist: { "$eq": author }

                    },
                    {
                        journalist: { "$eq": ' '+author }
                    }
                ]
            }
        }
    } else {

        query.journalist = {
            $elemMatch: {
                "$and": [
                    {
                        journalist: { "$ne": "" }

                    },
                    {
                        journalist: { "$ne": "null" }
                    }
                ]
            }
        }
    }


    //Word Filter
    if (req.body.word) {
        var word = req.body.word;
        var word1 = new RegExp(word);
        query.headline = { $regex: word1 }
    }



    //filter by city and web    
    if (req.body.type != "print" && req.body.type != "web" && req.body.type != "") {
        query.city = req.body.type;
    }

    if (req.body.type === "web") {
        query.type = 'WEB';
    }

    if (req.body.type === "print") {
        query.type = 'PRINT';
    }
    var q = [
        {
            $match:
                query
        },
        {
            "$unwind": "$journalist"
        },
        {
            $group: {
                _id: {
                    'journalist': {"$trim":{"input":"$journalist.journalist"}}
                }, count: {
                    $sum: 1
                }
            }
        },
        {
            $project: { _id: 0, journalist: '$_id.journalist', totalcount: '$count' }
        },
        {
            $sort: {
                "totalcount": -1
            }
        }
    ];

    articlesModule.aggregate(q, function (err, impacts) {
        if (err) {
            console.log("error" + err);
            res.status(500);
            res.send("internal error");
        } else {
            res.status(200);
            //console.log(impacts);
            res.json(impacts);
        }
    });
}




var publicationData = (req, res) => {
    var query = {rejected: { $ne: "1" }};
    //company filter
    if (req.body.company) {
        var comFilter = req.body.company;
        //query = { $and: [{ 'keyword.companys': { $eq: comFilter } }, { 'keyword.companys': { $ne: "null" } }] };
	 query = { $and: [{ 'keyword.companyissue': { $eq: comFilter } },{rejected: { $ne: "1" }}] };
    }

    //chart Data Filter Keytype and Prominent

    if (req.body.keytype) {
        var keytype = req.body.keytype;
        var prominence = req.body.prominance;
        if(prominence=='passing'){
            query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $ne: 'headline mention' } },{ 'keyword.Prominence': { $ne: 'prominent' } }] };
        }else{
        query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $eq: prominence } }] };
        }
        
    }


    fromdate = req.body.fromdate;
    todate = req.body.todate;
    query.pubdate = {
        $gte: todate,
        $lte: fromdate
    }
    query.clientid = req.body.clientid;

    if (req.body.pubsort) {
        query.publication = req.body.pubsort;
    }


    // Journalist Filter    
    if (req.body.author) {
        var author = req.body.author;
        query.journalist = {
            $elemMatch: {
                "$or": [
                    {
                        journalist: { "$eq": author }

                    },
                    {
                        journalist: { "$eq": ' '+author }
                    }
                ]
            }
        }
    }
    //Word Filter
    if (req.body.word) {
        var word = req.body.word;
        var word1 = new RegExp(word);
        query.headline = { $regex: word1 }
    }


    //filter by city and web    
    if (req.body.type != "print" && req.body.type != "web" && req.body.type != "") {
        query.city = req.body.type;
    }

    if (req.body.type === "web") {
        query.type = 'WEB';
    }

    if (req.body.type === "print") {
        query.type = 'PRINT';
    }
    
     if (req.body.keytype) {
    var q = [
	{"$unwind":"$keyword"},
        {
            $match:
                query
        },
        {
            "$group":{"_id":{"Prominence":"$keyword.Prominence","keytpe":"$keyword.keytpe","clientid":"$clientid","articleid":"$articleid","publication":"$publication"}}
        },
	{"$group":{"_id":{"publication":"$_id.publication"},"count":{"$sum":1}}}
	,
        {
            $project: { _id: 0, publication: '$_id.publication', totalcount: '$count' }
        },
        {
            $sort: {
                "totalcount": -1
            }
        }
    ];
}else{
     var q = [
        {
            $match:
                query
        },
        {
            $group: {
                _id: {
                    'publication': "$publication"
                }, count: {
                    $sum: 1
                }
            }
        },
        {
            $project: { _id: 0, publication: '$_id.publication', totalcount: '$count' }
        },
        {
            $sort: {
                "totalcount": -1
            }
        }
    ];
}

    articlesModule.aggregate(q, function (err, impacts) {
        if (err) {
            console.log("error" + err);
            res.status(500);
            res.send("internal error");
        } else {
            res.status(200);
            //console.log(impacts);
            res.json(impacts);
        }
    });
}



var companyData = (req, res) => {
    
    
    var query = {rejected: { $ne: "1" }};
    if (req.body.company) {
	var comFilter = req.body.company;
	query = {$and: [{'keyword.companyissue': {$eq: comFilter}}, {'keyword.companyissue': {$ne: "null"}},{rejected: { $ne: "1" }}]};
    } else {
	query = {$and: [{'keyword.companyissue': {$ne: "null"}}, {'keyword.companyissue': {$ne: null}}, {'keyword.companyissue': {$ne: ""}},{rejected: { $ne: "1" }}]};
    }
       
    //chart Data Filter Keytype and Prominent

    if(req.body.keytype){
	    var keytype = req.body.keytype;
            var prominence = req.body.prominance;
        //query = {$and: [{'keyword.keytpe': {$eq: keytype}}, {'keyword.Prominence': {$eq: prominence}},{'keyword.companys': {$ne: "null"}}]};
        
        if(prominence=='passing'){
            query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $ne: 'headline mention' } },{ 'keyword.Prominence': { $ne: 'prominent' } },{'keyword.companyissue': {$ne: "null"}}, {'keyword.companyissue': {$ne: null}}, {'keyword.companyissue': {$ne: ""}}] };
        }else{
        query = {$and: [{'keyword.keytpe': {$eq: keytype}}, {'keyword.Prominence': {$eq: prominence}},{'keyword.companyissue': {$ne: "null"}}, {'keyword.companyissue': {$ne: null}}, {'keyword.companyissue': {$ne: ""}}]};
        }
    }


   






    
    fromdate = req.body.fromdate;
    todate = req.body.todate;
    query.pubdate = {
	$gte: todate,
	$lte: fromdate
    }
    query.clientid = req.body.clientid;
    
    if(req.body.pubsort){
	query.publication = req.body.pubsort;
    }
  

// Journalist Filter    
   if(req.body.author){
       var author = req.body.author;
    query.journalist = {
	$elemMatch: {
                "$or": [
                    {
                        journalist: { "$eq": author }

                    },
                    {
                        journalist: { "$eq": ' '+author }
                    }
                ]
            }
    }	
    }
//Word Filter
    if(req.body.word){
	var word = req.body.word;
	var word1 = new RegExp(word);
	query.headline = { $regex:   word1 } 
    }
    

//filter by city and web    
    if (req.body.type != "print" && req.body.type != "web" && req.body.type != "") {
	query.city = req.body.type;
    }

    if (req.body.type === "web") {
	query.type = 'WEB';
    }

    if (req.body.type === "print") {
	query.type = 'PRINT';
    }
    var q = [
        {
            "$unwind": "$keyword"
        },
	{
	    $match:
		    query
	},
	
	{"$group":{"_id":{"companys":"$keyword.companyissue","keytpe":"$keyword.keytpe","clientid":"$clientid","articleid":"$articleid"}}},
	{"$group":{"_id":{"companys":"$_id.companys","keytpe":"$_id.keytpe"},"count": {"$sum": 1}}},
	{
	    $project: {_id: 0, companys: '$_id.companys', keytpe: '$_id.keytpe', totalcount: '$count'}
	},
	{
	    $sort: {
		"totalcount": -1
	    }
	}
    ];

    articlesModule.aggregate(q, function (err, impacts) {
	if (err) {
	    console.log("error" + err);
	    res.status(500);
	    res.send("internal error");
	} else {
	    res.status(200);
	    //console.log(impacts);
	    res.json(impacts);
	}
    });
}




var headlineData = (req, res) => {
    var query = {rejected: { $ne: "1" }};
    //company filter    
    if (req.body.company) {
        var comFilter = req.body.company;
        //query = { $and: [{ 'keyword.companys': { $eq: comFilter } }, { 'keyword.companys': { $ne: "null" } }] };
	 query = { $and: [{ 'keyword.companyissue': { $eq: comFilter } },{rejected: { $ne: "1" }}] };
    }

    //chart Data Filter Keytype and Prominent

    if (req.body.keytype) {
        var keytype = req.body.keytype;
        var prominence = req.body.prominance;
        if(prominence=='passing'){
            query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $ne: 'headline mention' } },{ 'keyword.Prominence': { $ne: 'prominent' } },{rejected: { $ne: "1" }}] };
        }else{
        query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $eq: prominence } },{rejected: { $ne: "1" }}] };
        }
        
    }

    fromdate = req.body.fromdate;
    todate = req.body.todate;
    //Word Filter
    if (req.body.word) {
        var word = req.body.word;
        var word1 = new RegExp(word);
        query.headline = { $regex: word1 }
    }

    query.pubdate = {
        $gte: todate,
        $lte: fromdate
    }
    query.clientid = req.body.clientid;
    //publication filter    
    if (req.body.pubsort) {
        query.publication = req.body.pubsort;
    }

    // Journalist Filter    
    if (req.body.author) {
        var author = req.body.author;
        query.journalist = {
            $elemMatch: {
                "$or": [
                    {
                        journalist: { "$eq": author }

                    },
                    {
                        journalist: { "$eq": ' '+author }
                    }
                ]
            }
        }
    }


    //filter by city and web    
    if (req.body.type != "print" && req.body.type != "web" && req.body.type != "") {
        query.city = req.body.type;
    }

    if (req.body.type === "web") {
        query.type = 'WEB';
    }

    if (req.body.type === "print") {
        query.type = 'PRINT';
    }
    var q = [
        {
            $match:
                query
        },
        {
            $group: {
                _id: {
                    'headline': "$headline", "articleid": "$articleid"
                }
            }
        },
        {
            $project: { _id: 0, headline: '$_id.headline' }
        }
    ];

    articlesModule.aggregate(q, function (err, impacts) {

        if (err) {
            console.log("error" + err);
            res.status(500);
            res.send("internal error");
        } else {
            res.status(200);
            //console.log(impacts);
            var s = '';
            for (var i = 0; i < impacts.length; i++) {
                s = s + ' ' + impacts[i].headline;
            }
	    
	    s = s.replace(/[^a-zA-Z'-]/g, ' ');
	    
            s = remove_stopwords(s);
	   
            s = s.split(" ");
            s = s.filter(s => s.length > 1);
            s = arrayCountValues(s);
            res.json(s);
        }
    });
}

function arrayCountValues(arr) {
    //count
    var v, freqs = {};

    // for each v in the array increment the frequency count in the table
    for (var i = arr.length; i--;) {
        v = arr[i];
        if (freqs[v]) freqs[v] += 1;
        else freqs[v] = 1;
    }
    //sort object
    var sortable = [];
    for (var vehicle in freqs) {
        sortable.push([vehicle, freqs[vehicle]]);
    }

    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });
    // return the frequency table
    //first 50 element
    return sortable.slice(0, 70);
}

function remove_stopwords(str) {
    var stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now','rs','cr','pts','Rs','day','sec','new','co','https','http','vs','$','o','¢','£','¥','€','HT','%','knows','#','you',]
    res = []
    words = str.split(' ')
    for (i = 0; i < words.length; i++) {
        if (!stopwords.includes(words[i].toLowerCase())) {
	    
	    if(words[i]=='Covid-'){
		w = 'Covid-19';
	    }else if(words[i]=='COVID-'){
		w = 'COVID-19';
	    }else if(words[i]=='covid-'){
		w = 'covid-19';
	    }else{
		w = words[i];
	    }
	    
            res.push(w)
        }
    }
    return (res.join(' '))
}


var allData = (req, res) => {
    var query = {rejected: { $ne: "1" }};
    //company filter    
    if (req.body.company) {
        var comFilter = req.body.company;
        //query = { $and: [{ 'keyword.companys': { $eq: comFilter } }, { 'keyword.companys': { $ne: "null" } }] };
	 query = { $and: [{ 'keyword.companyissue': { $eq: comFilter } },{rejected: { $ne: "1" }}] };
    }

    //chart Data Filter Keytype and Prominent

    if (req.body.keytype) {
        var keytype = req.body.keytype;
        var prominence = req.body.prominance;
        if(prominence=='passing'){
            query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $ne: 'headline mention' } },{ 'keyword.Prominence': { $ne: 'prominent' } },{rejected: { $ne: "1" }}] };
        }else{
        query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $eq: prominence } },{rejected: { $ne: "1" }}] };
        }
        
    }
    fromdate = req.body.fromdate;
    todate = req.body.todate;

    articleskip = req.body.articleskip;
    articlelimit = req.body.articlelimit;
    query.pubdate = {
        $gte: todate,
        $lte: fromdate
    }
    query.clientid = req.body.clientid;
    if (req.body.pubsort) {
        query.publication = req.body.pubsort;
    }
    // Journalist Filter    
    if (req.body.author) {
        var author = req.body.author;
        query.journalist = {
            $elemMatch: {
                "$or": [
                    {
                        journalist: { "$eq": author }

                    },
                    {
                        journalist: { "$eq": ' '+author }
                    }
                ]
            }
        }
    }

    //Word Filter
    if (req.body.word) {
        var word = req.body.word;
        var word1 = new RegExp(word);
        query.headline = { $regex: word1 }
    }


    //filter by city and web    
    if (req.body.type != "print" && req.body.type != "web" && req.body.type != "") {
        query.city = req.body.type;
    }

    if (req.body.type === "web") {
        query.type = 'WEB';
    }

    if (req.body.type === "print") {
        query.type = 'PRINT';
    }




    var q = [
        {
            "$unwind": "$keyword"
        },
	{
            $match:
                query
        },
        
        {
            $group: {
                _id: {
                    "articleid": "$articleid", 'clientid': "$clientid", 'headline': "$headline", "type": "$type", "url": "$url", "publication": "$publication", "city": "$city", "pubdate": "$pubdate"
                }
            }
        },
        {
            $project: { _id: 0, headline: '$_id.headline', articleid: '$_id.articleid', clientid: '$_id.clientid', type: '$_id.type', url: '$_id.url', publication: '$_id.publication', city: '$_id.city', pubdate: '$_id.pubdate' }
        },
        {
            $sort: {
                "captureddatetime": -1
            }
        },
        {
            "$skip": articleskip
        },
        {
            "$limit": articlelimit
        }
    ];

    articlesModule.aggregate(q, function (err, impacts) {

        if (err) {
            console.log("error" + err);
            res.status(500);
            res.send("internal error");
        } else {
            res.status(200);
            res.json(impacts);
        }
    });
}

var chartData = (req, res) => {
    var query = {rejected: { $ne: "1" }};

    //company filter
    if (req.body.company) {
        comFilter = req.body.company
        //query = { $and: [{ 'keyword.companys': { $eq: comFilter } }, { 'keyword.Prominence': { $ne: "null" } }] };
	 query = { $and: [{ 'keyword.companyissue': { $eq: comFilter } },{rejected: { $ne: "1" }}] };
    } else {
        //query = { 'keyword.Prominence': { $ne: "null" } };
    }


    //chart Data Filter Keytype and Prominent

    if (req.body.keytype) {
        var keytype = req.body.keytype;
        var prominence = req.body.prominance;
        if(prominence=='passing'){
            query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $ne: 'headline mention' } },{ 'keyword.Prominence': { $ne: 'prominent' } },{rejected: { $ne: "1" }}] };
        }else{
        query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $eq: prominence } },{rejected: { $ne: "1" }}] };
        }
        
    }
    fromdate = req.body.fromdate;
    todate = req.body.todate;
    query.pubdate = {
        $gte: todate,
        $lte: fromdate
    }
    query.clientid = req.body.clientid;
    if (req.body.pubsort) {
        query.publication = req.body.pubsort;
    }

    // Journalist Filter    
    if (req.body.author) {
        var author = req.body.author;
        query.journalist = {
            $elemMatch: {
                "$or": [
                    {
                        journalist: { "$eq": author }

                    },
                    {
                        journalist: { "$eq": ' '+author }
                    }
                ]
            }
        }
    }

    //Word Filter
    if (req.body.word) {
        var word = req.body.word;
        var word1 = new RegExp(word);
        query.headline = { $regex: word1 }
    }



    //filter by city and web    
    if (req.body.type != "print" && req.body.type != "web" && req.body.type != "") {
        query.city = req.body.type;
    }

    if (req.body.type === "web") {
        query.type = 'WEB';
    }

    if (req.body.type === "print") {
        query.type = 'PRINT';
    }

    var q = [
	{
            "$unwind": "$keyword"
        },
        {
            $match:
                query
        },
        
        {"$group":{"_id":{"Prominence":"$keyword.Prominence","keytpe":"$keyword.keytpe","clientid":"$clientid","articleid":"$articleid"}}},
	{"$group":{"_id":{"Prominence":"$_id.Prominence","keytpe":"$_id.keytpe"},"count": {"$sum": 1}}},
        {"$project":{"_id":0,"Prominence":"$_id.Prominence","keytpe":"$_id.keytpe","totalcount":"$count"}}
    ];

    articlesModule.aggregate(q, function (err, impacts) {
        if (err) {
            console.log("error" + err);
            res.status(500);
            res.send("internal error");
        } else {
            res.status(200);
            //console.log(impacts);
            res.json(impacts);
        }
    });
}


var chartPassingData = (req, res) => {
    var query = {rejected: { $ne: "1" }};




    //chart Data Filter Keytype and Prominent

    if (req.body.keytype) {
        var keytype = req.body.keytype;
        var prominence = req.body.prominance;
        if(prominence=='passing'){
        query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $ne: 'headline mention' } },{ 'keyword.Prominence': { $ne: 'prominent' } },{rejected: { $ne: "1" }}] };  
        }else{
            query = { $and: [{ 'keyword.keytpe': { $eq: keytype } }, { 'keyword.Prominence': { $eq: 'headline mention' } },{ 'keyword.Prominence': { $eq: 'prominent' } },{rejected: { $ne: "1" }}] };   
        } 
    }else{
        query = { $and: [{ 'keyword.Prominence': { $ne: 'headline mention' } },{ 'keyword.Prominence': { $ne: 'prominent' } },{rejected: { $ne: "1" }}] };
    }


    //company filter
    if (req.body.company) {
        comFilter = req.body.company
        //query = { $and: [{ 'keyword.companys': { $eq: comFilter } }, { 'keyword.Prominence': { $ne: "null" } }] };
	 query = { $and: [{ 'keyword.companyissue': { $eq: comFilter } },{rejected: { $ne: "1" }}] };
    } else {
        //query = { 'keyword.Prominence': { $ne: "null" } };
    }


    fromdate = req.body.fromdate;
    todate = req.body.todate;
    query.pubdate = {
        $gte: todate,
        $lte: fromdate
    }
    query.clientid = req.body.clientid;
    if (req.body.pubsort) {
        query.publication = req.body.pubsort;
    }

    // Journalist Filter    
    if (req.body.author) {
        var author = req.body.author;
        query.journalist = {
            $elemMatch: {
                "$or": [
                    {
                        journalist: { "$eq": author }

                    },
                    {
                        journalist: { "$eq": ' '+author }
                    }
                ]
            }
        }
    }

    //Word Filter
    if (req.body.word) {
        var word = req.body.word;
        var word1 = new RegExp(word);
        query.headline = { $regex: word1 }
    }



    //filter by city and web    
    if (req.body.type != "print" && req.body.type != "web" && req.body.type != "") {
        query.city = req.body.type;
    }

    if (req.body.type === "web") {
        query.type = 'WEB';
    }

    if (req.body.type === "print") {
        query.type = 'PRINT';
    }

    var q = [
	{
            "$unwind": "$keyword"
        },
        {
            $match:
                query
        },

        {"$group":{"_id":{"Prominence":"$keyword.Prominence","keytpe":"$keyword.keytpe","clientid":"$clientid","articleid":"$articleid"}}},
	{"$group":{"_id":{"Prominence":"$_id.Prominence","keytpe":"$_id.keytpe"},"count": {"$sum": 1}}},
        {"$project":{"_id":0,"Prominence":"$_id.Prominence","keytpe":"$_id.keytpe","totalcount":"$count"}}
    ];

    articlesModule.aggregate(q, function (err, impacts) {
        if (err) {
            console.log("error" + err);
            res.status(500);
            res.send("internal error");
        } else {
            res.status(200);
            //console.log(impacts);
            res.json(impacts);
        }
    });
}

module.exports = {
    get: get,
    articlepost: articlepost,
    excelpost: excelpost,
    articledetailpost: articledetailpost,
    articleupdateget: articleupdateget,
    clienteditions: clienteditions,
    journalistData: journalistData,
    publicationData: publicationData,
    companyData: companyData,
    headlineData: headlineData,
    allData: allData,
    chartData: chartData,
    chartPassingData:chartPassingData
}