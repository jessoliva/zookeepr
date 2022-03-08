// main file that our server will run from
// https://git.heroku.com/tranquil-hamlet-03887.git
// app: https://tranquil-hamlet-03887.herokuapp.com/
// add to the end of the app: api/animals

// to use the filesystem
const fs = require('fs');
// This is another module built into the Node.js API that provides utilities for working with file and directory paths. It ultimately makes working with our file system a little more predictable
const path = require('path');

// use require just like for any other npm package
// this is the use the Express.js npm package
const express = require('express');

// When Heroku runs our app, it sets an environment variable called process.env.PORT
// We're going to tell our app to use that port, if it has been set, and if not, default to port 80
const PORT = process.env.PORT || 3001;

// the express() function is a top-level function exported by the express module
// We assign express() to the app variable so that we can later chain on methods to the Express.js server.
const app = express();

// Both of the below middleware functions need to be set up every time you create a server that's looking to accept POST data
//
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// a method built into Express.js. It takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object
// The 'extended: true' option set inside the method call informs our server that there may be sub-array data nested in it as well, so it needs to look as deep into the POST data as possible to parse all of the data correctly
//
// parse incoming JSON data
app.use(express.json());
// takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object

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


// function that accepts the POST route's req.body value and the array we want to add the data to
// that array will be the animalsArray, because the function is for adding a new animal to the catalog
// We are going to execute this function from within the app.post() route's callback function and when we do, it'll take the new animal data and add it to the animalsArray we passed in, and then write the new array data to animals.json
// After saving it, we'll send the data back to the route's callback function so it can finally respond to the request
function createNewAnimal(body, animalsArray) {
    // body is the req.body sent from POST
    const animal = body;
    // push the animal to the object declared above
    animalsArray.push(animal);

    // write the animal into the file
    // Here, we're using the fs.writeFileSync() method, which is the synchronous version of fs.writeFile() and doesn't require a callback function
    fs.writeFileSync(
        // use the method path.join() to join the value of __dirname, which represents the directory of the file we execute the code in, with the path to the animals.json file. In this case, the path will be from the root of whatever machine this code runs on to the location of our animals.json file
        path.join(__dirname, './data/animals.json'),

        // we need to save the JavaScript array data as JSON, so we use JSON.stringify() to convert it. The other two arguments used in the method, null and 2, are means of keeping our data formatted. The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. The 2 indicates we want to create white space between our values to make it more readable.
        // If we were to leave those two arguments out, the entire animals.json file would work, but it would be really hard to read.
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
  
    return animal;
}


// API endpoint
// route created that front-end can request data from
// handles request to view all animals
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


// API endpoint
// param route needs to be added AFTER the initial GET route
// route to get only 1 animal based on a parameter, here it is id
// handles request to view a single animal based on id
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

// a route that listens for POST requests, not GET requests
// POST requests differ from GET requests in that they represent the action of a client requesting the server to accept data rather than vice versa
// With POST requests, we can package up data, typically as an object, and send it to the server
// req.body property is where we can access that data on the server side & do something with it
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    // Now when we receive new post data to be added to the animals.json file, we'll take the length property of the animals array (because it's a one-to-one representation of our animals.json file data) and set that as the id for the new data. Remember, the length property is always going to be one number ahead of the last index of the array so we can avoid any duplicate values
    // red.body now has an id

    // add animal to json file and animals array in this function
    // animals is the array from line 30
    const animal = createNewAnimal(req.body, animals);  

    res.json(animal);
});


// Now we just need to use one method to make our server listen
// We're going to chain the listen() method onto our server to do it
// changed 3001 to 80 bc Heroku apps get served using port 80
// changed from 80 to environment variable
app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
});