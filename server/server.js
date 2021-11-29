const express = require('express');
const mysql = require('mysql');


const routes = require('./routes')
const config = require('./config.json')
const cors = require('cors');


const app = express();
app.use(cors({
    origin: '*'
}));

// Route 1 - register as GET 
app.get('/movie', routes.movie)

// Route 2 - register as GET 
app.get('/boxOffice', routes.boxOffice)

// Route 3 - register as GET 
app.get('/hello', routes.hello)



// Route 5 - register as GET 


// Route 6 - register as GET 








app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;