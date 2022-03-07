// main file that our server will run from
// https://git.heroku.com/tranquil-hamlet-03887.git
// app: https://tranquil-hamlet-03887.herokuapp.com/
// add to the end of the app: api/animals

// use require just like for any other npm package
// this is the use the Express.js npm package
const express = require('express');

// When Heroku runs our app, it sets an environment variable called process.env.PORT
// We're going to tell our app to use that port, if it has been set, and if not, default to port 80
const PORT = process.env.PORT || 3001;

// the express() function is a top-level function exported by the express module
// We assign express() to the app variable so that we can later chain on methods to the Express.js server.
const app = express();

// require the data for route
const { animals } = require('./data/animals');

// This function will take in req.query as an argument and filter through the animals accordingly, returning the new filtered array
function filterByQuery(query, animalsArray) {

    let personalityTraitsArray = [];

    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array no matter if it's a string or an array already
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        // We're revising the filteredResults array for each trait that we loop through with .forEach(). Each iteration revises filteredResults so that it only contains animals that possess the indicated trait. At the end of the .forEach() loop, we'll have a filteredResults array that only contains animals that have all of the traits we're targeting.
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray, but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults array will then contain only the entries that contain the trait, so at the end we'll have an array of animals that have every one of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);
            // animal.personalityTraits.indexOf(trait) !== -1 
            // indexOf() array method, returns the 1st index # @ which a given element can be found in the array --> so it returns the index #
            // returns -1 if it is ot present 
            // so for each animal, return the animal if the indexOf that specific trait is not -1 (meaning if that trait exists in that animal)
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
         filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }

    // return the filtered results:
    return filteredResults;
}


// takes in the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
    // the [0] means to get the first element of that array (should be the only element bc id is unique)
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}


// route created that front-end can request data from
app.get('/api/animals', (req, res) => {

    let results = animals;

    // if there is a query parameter, then filter by it
    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    res.json(results);
});
// the get() method requires two arguments:
// 1st is a string that describes the route the client will have to fetch from && 2nd is a callback function that will execute every time that route is accessed with a GET request
// changed from send to json --> so that the client knows it's receiving json (this changes the headers) --> and to send json data
// res = response --> has json() method
// req = request --> has query property --> it gets all the query parameters after ? and turns it into JSON


// param route needs to be added AFTER the initial GET route
// route to get only 1 animal based on a parameter, here it is id
app.get('/api/animals/:id', (req, res) => {

    // findById method will for sure only return a single animal bc the id is unique
    const result = findById(req.params.id, animals);

    // if no record exists for the animal being searched for, the client receives a 404 error
    if (result) {
        res.json(result);
    } else {
        // send the 404 error code to the client
        res.send(404);
        // We chose to return an error here instead of an empty object or undefined in order to make it clear to the client that the resource they asked for, in this case a specific animal, does not exist.
    }
});


// Now we just need to use one method to make our server listen
// We're going to chain the listen() method onto our server to do it
// changed 3001 to 80 bc Heroku apps get served using port 80
// changed from 80 to environment variable
app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
});