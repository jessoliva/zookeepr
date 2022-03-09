// moved all animal API routes from server.js to here
// removed /api from each address because our router function will append /api to each URL
// change 'app' to 'router'

// Router, allows you to declare routes in any file as long as you use the proper middleware
const router = require('express').Router();

// import the functions
// ../ to exit apiRoutes ../ to exit routes /lib to get into lib folder
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');

// import animals data for route
// pay attention to relative paths!!
const { animals } = require('../../data/animals');

// API endpoint
// route created that front-end can request data from
// handles request to view all animals
router.get('/animals', (req, res) => {

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
router.get('/animals/:id', (req, res) => {

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
router.post('/animals', (req, res) => {
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

// export the router
module.exports = router;