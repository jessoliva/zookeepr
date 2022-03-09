const path = require('path');
const router = require('express').Router();

// '/' route points us to the root route of the server, this is the route used to create a homepage for a server
// Unlike most GET and POST routes that deal with creating or return JSON data, this GET route has just one job to do, and that is to respond with an HTML page to display in the browser
// So instead of using res.json(), we're using res.sendFile(), & all we have to do is tell them where to find the file we want our server to read and send back to the client
// Notice in the res.sendFile() that we're using the path module again to ensure that we're finding the correct location for the HTML code we want to display in the browser. This way, we know it will work in any server environment!
// __dirname = directory name of whichever directory this project is in
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});
// so basically whenever someone visits this site, this root route will send the html page --> 
// just going to main root http://localhost:3001
// GET route to serve index.html to the root path of our server


// This route will take us to /animals http://localhost:3001/animals
// This is the second route we've created so far that doesn't have the term api thrown into it. This is intentional, because when we create routes we need to stay organized and set expectations of what type of data is being transferred at that endpoint
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});


// http://localhost:3001/zookeepers
// Linking between pages no longer needs .html extensions. It just needs the associated route name
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});


// Catch route requests that don't exist
// The * will act as a wildcard, meaning any route that wasn't previously defined will fall under this request and will receive the homepage as the response
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});
// order of routes matter!! this * one should come last!

// export the router
module.exports = router;