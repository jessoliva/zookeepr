// main file that our server will run from

// use require just like for any other npm package
// this is the use the Express.js npm package
const express = require('express');

// the express() function is a top-level function exported by the express module
// We assign express() to the app variable so that we can later chain on methods to the Express.js server.
const app = express();

// require the data for route
const { animals } = require('./data/animals');

// route created that front-end can request data from
app.get('/api/animals', (req, res) => {
    let results = animals;
    console.log(req.query)
    res.json(results);
});
// the get() method requires two arguments:
// 1st is a string that describes the route the client will have to fetch from && 2nd is a callback function that will execute every time that route is accessed with a GET request
// changed from send to json --> so that the client knows it's receiving json (this changes the headers) --> and to send json data
// res = response --> has json() method
// req = request --> has query property --> it gets all the query parameters after ? and turns it into JSON


// Now we just need to use one method to make our server listen
// We're going to chain the listen() method onto our server to do it
app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
});