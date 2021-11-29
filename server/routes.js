const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// ********************************************
//# IMDB: id, cover(url), title, year, original_title, duration, language, description, avg_vote
//# BoxOffice: movie_id, world
//# Bechdel: movie_id, rating
//# Oscar: movie_id, winner
//# Actors: movie_id, name            SIMPLE ROUTE EXAMPLE
// ********************************************

// Route 1 (query movie_info)
async function movie(req, res) {
    var movie_id = req.query.id
    
    var sqlArr = [
        {
            sql:`select id, url, title, year, original_title, duration, language, description, avg_vote from IMDB where id = '${movie_id}'`,
            name:'movie'
        },
        {
            sql: `select world as boxOffice from BoxOffice where id = '${movie_id}'`,
            name: 'boxOffice'
        },
        {
            sql: `select rating as rate from Bechdel where id = '${movie_id}'`,
            name: 'rate'
        },
        {
            sql: `select winner from Oscar where id = '${movie_id}'`,
            name: 'oscar'
        },
        {
            sql: `select name, url from Actors where id = '${movie_id}' limit 3 `,
            name: 'actor'
        },
    ] 
    var allRes = {}
    console.log(movie_id)
    if(movie_id){
        for(let i  = 0;i<=4;i++){
            const al = await connection.query(sqlArr[i].sql)
            
                // (error, results, fields) =>{
                // console.log(11111,results)
                // if(error){
                //     allRes[sqlArr[i].name] = null
                // }else{
                //     allRes[sqlArr[i].name] =results
                // }
            // })
            console.log(1)
               allRes[sqlArr[i].name] =al
               
        }
        console.log(123,allRes)
                res.send({res1:allRes})
    }else{
        res.send({code : -1, message: 'Please enter a valid movie id!'})
    }
    
    
}

// Route 2 (query movie_info)
async function boxOffice(req, res) {
    var movie_id = req.query.id
    console.log(movie_id)
    if(movie_id){
        connection.query(`select id, url, title, year, original_title, duration, language, description, avg_vote from IMDB where id = '${movie_id}'`,function (error, results, fields) {
            console.log(11111,results)
            res.send({results:results})
        })
    }else{
        res.send({code : -1, message: 'Please enter a valid movie id!'})
    }
}

// Route 3 (query movie_info)
async function hello(req, res) {
    var movie_id = req.query.id
    console.log(movie_id)
    if(movie_id){
        connection.query(`select   movie.id as id , movie.url as movie_url, movie.title as title, 
        movie.year as year, movie.original_title as original_title, movie.duration as duration, 
        movie.language as language, movie.description as description, movie.avg_vote as vote, 
        actor.url as actor_url, actor.name as actor_name, bech.rating as score, box.world as boxOffice, 
        oscar.winner as winner
        from IMDB movie
        join BoxOffice box
            on movie.id = box.movie_id
        join Bechdel bech
            on movie.id = bech.movie_id
        join Actors actor
            on movie.id = actor.movie_id
        join Oscar oscar
            on movie.id = oscar.movie_id
        where movie.id = '${movie_id}'
        group by movie.id;`,function (error, results, fields) {
            console.log(11111,results)
            res.send({results:results[0]})
        })
    }else{
        res.send({code : -1, message: 'Please enter a valid movie id!'})
    }
}

// Route 4 (query movie_info)
async function oscar(req, res) {
    var movie_id = req.query.id
    console.log(movie_id)
    if(movie_id){
        connection.query(`select winner from Oscar where id = '${movie_id}'`,function (error, results, fields) {
            console.log(11111,results)
            res.send({results:results})
        })
    }else{
        res.send({code : -1, message: 'Please enter a valid movie id!'})
    }
}

// Route 4 (query movie_info)
async function actors(req, res) {
    var movie_id = req.query.id
    console.log(movie_id)
    if(movie_id){
        connection.query(`select name, url from Actors where movie_id = 'tt0000009' limit 3; id = '${movie_id}'`,function (error, results, fields) {
            console.log(11111,results)
            res.send({results:results})
        })
    }else{
        res.send({code : -1, message: 'Please enter a valid movie id!'})
    }
}









// async function player(req, res) {
//     // TODO: TASK 7: implement and test, potentially writing your own (ungraded) tests
//     var id = req.query.id;
//     connection.query(`
//     select PlayerId, BestPosition from Players where PlayerId = ${id};`,function (error, results1, fields) {
//         //console.log(results1[0].BestPosition,123)
        
//         if(results1[0].BestPosition == 'GK'){
//             debugger
//             connection.query(
//                 `select PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating as Rating, Potential, Club, ClubLogo,
//                 Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition,
//                 BestOverallRating, ReleaseClause, GKPenalties, GKDiving, GKHandling, GKKicking, GKPositioning, GKReflexes
//                 from Players where PlayerId = ${id};`, function (error, results, fields) {
//                     if (error) {
//                         console.log(error)
//                         res.json({ error: error })
//                     } 
//                     res.json({ results: results })
//                 }
//             );
//         }else{
//             connection.query(
//                 `select PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating as Rating, Potential, Club, ClubLogo,
//                 Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition,
//                 BestOverallRating, ReleaseClause, NPassing, NBallControl, NAdjustedAgility, NStamina, NStrength, NPositioning
//                 from Players where PlayerId = ${id};`, function (error, results, fields) {
//                     if (error) {
//                         console.log(error)
//                         res.json({ error: error })
//                     } 
//                     res.json({ results: results })
//                 }
//             );
//         }
//     });

// }





module.exports = {
    movie,
    boxOffice,
    hello,
    
}