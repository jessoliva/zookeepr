// main file that our server will run from
// server.js file should be in charge of starting our server
// https://git.heroku.com/tranquil-hamlet-03887.git
// app: https://tranquil-hamlet-03887.herokuapp.com/api/animals

// The require() statements will read the index.js files in each of the directories indicated. This mechanism works the same way as directory navigation does in a website: If we navigate to a directory that doesn't have an index.html file, then the contents are displayed in a directory listing. But if there's an index.html file, then it is read and its HTML is displayed instead. Similarly, with require(), the index.js file will be the default file read if no other file is provided, which is the coding method we're using here.
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

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
// THIS NEEDS TO GO BEFORE THE ROUTES!!!
app.use(express.static('public'));


// This is our way of telling the server that any time a client navigates to <ourhost>/api, the app will use the router we set up in apiRoutes. If / is the endpoint, then the router will serve back our HTML routes.
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);


// require the data for route
const { animals } = require('./data/animals');


// Now we just need to use one method to make our server listen
// We're going to chain the listen() method onto our server to do it
// changed 3001 to 80 bc Heroku apps get served using port 80
// changed from 80 to environment variable
// We can assume that a route that has the term api in it will deal in transference of JSON data, whereas a more normal-looking endpoint such as /animals should serve an HTML page
app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
});