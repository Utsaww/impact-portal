var movie = require("../model/movieModel");

var get = (req,res)=>{
    movie.find({},'Title',function (err,tutorialspoint) {
        if(err){
            console.log("error");
            res.status(500);
            res.send("internal error");
        }else{
            res.status(200);
            console.log("sending data");
            console.log(tutorialspoint);
            res.send(tutorialspoint);
        }

    }).where('Title').equals('Mistakes that made happy coincidences').limit(20);
}

var add = (req,res)=>{
    var tutorialspoint = new movie(req.body);
    tutorialspoint.save(function(err){
        if(err){
            res.status(500);
            res.send("internal error");
        }else{
            res.status(201);
            res.send(tutorialspoint);
        }
    })
}

var getById = function (req,res) {
    movie.findById(req.params.id,function(err,movie){
        if(err){
            res.status(404);
            res.send("error");
        }else{
            res.status(200);
            res.send(movie);
        }
    })

}

var updateById = function (req,res) {
    movie.findById(req.params.id,function(err,movie){
        if(err){
            res.status(404);
            res.send("error");
        }else{

            movie.title = req.body.title;
            console.log(movie.title);
            movie.save = function (err) {
                if(!err){
                    console.log("not error");
                    res.status(200);
                    console.log(movie)
                    res.send(movie);
                }else{
                    console.log("error");
                    res.status(500);
                    res.send("failed");
                }
            }

        }
    })
}

var pathch = function (req,res) {

    movie.findById(req.params.id,function(err,movie){
       if(!err){
            if(req.body._id){
                delete req.body._id;
            }
           for(p in req.body){
               movie[p] = req.body[p];
           }
            movie.save(function(err){
                if(!err){
                    res.status(200);
                    res.send(movie);
                }
            })
       }

    });


}

module.exports =  {
    get : get,
    add : add,
    getById : getById,
    updateById : updateById,
    pathch : pathch
}