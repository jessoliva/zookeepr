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
// We're going to tell our app to use that port, if it has been set, and if not, default to port 3001
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

// to display css and javascript files rather than setting up routes for each file
// used the express.static(<directory-name>) method. The way it works is that we provide a file path to a location in our application (in this case, the public folder) and instruct the server to make these files static resources. This means that all of our front-end code can now be accessed without having a specific server endpoint created for it!
app.use(express.static('public'));

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


// validate data from post before writing it to the json file
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    // Array.isArray(value), determines whether the value is an array, returns true if it is, and false otherwise
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
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

    // the animals declared above
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

    // before we create the data and add it to the catalog, we'll pass our data through validateAnimal() 
    // In this case, the animal parameter is going to be the content from req.body, and we're going to run its properties through a series of validation checks. If any of them are false, we will return false and not create the animal data
    // validate data, send data to the function
    // if any data in req.body is incorrect (if it is not true), send 400 error back
    if (!validateAnimal(req.body)) {
        // a response method to relay a message to the client making the request. We send them an HTTP status code and a message explaining what went wrong
        // Anything in the 400 range means that it's a user error and not a server error, and the message can help the user understand what went wrong on their end
        res.status(400).send('The animal is not properly formatted.');
    } 
    // if data is correct, and the function returns true then send that data to createNewAnimal
    else {
        // add animal to json file and animals array in this function
        // animals is the array declared above
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});


// '/' route points us to the root route of the server, this is the route used to create a homepage for a server
// Unlike most GET and POST routes that deal with creating or return JSON data, this GET route has just one job to do, and that is to respond with an HTML page to display in the browser
// So instead of using res.json(), we're using res.sendFile(), & all we have to do is tell them where to find the file we want our server to read and send back to the client
// Notice in the res.sendFile() that we're using the path module again to ensure that we're finding the correct location for the HTML code we want to display in the browser. This way, we know it will work in any server environment!
// __dirname = directory name of whichever directory this project is in
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// so basically whenever someone visits this site, this root route will send the html page --> 
// just going to main root http://localhost:3001
// GET route to serve index.html to the root path of our server

// This route will take us to /animals http://localhost:3001/animals
// This is the second route we've created so far that doesn't have the term api thrown into it. This is intentional, because when we create routes we need to stay organized and set expectations of what type of data is being transferred at that endpoint
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// http://localhost:3001/zookeepers
// Linking between pages no longer needs .html extensions. It just needs the associated route name
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});


// Catch route requests that don't exist
// The * will act as a wildcard, meaning any route that wasn't previously defined will fall under this request and will receive the homepage as the response
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// order of routes matter!! this * one should come last!

// Now we just need to use one method to make our server listen
// We're going to chain the listen() method onto our server to do it
// changed 3001 to 80 bc Heroku apps get served using port 80
// changed from 80 to environment variable
// We can assume that a route that has the term api in it will deal in transference of JSON data, whereas a more normal-looking endpoint such as /animals should serve an HTML page
app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
});