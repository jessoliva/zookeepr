const router = require('express').Router();

// ../../ bc you have to go back 2 folders from apiRoutes
const { filterByQuery, findById, createNewZookeeper, validateZookeeper } = require("../../lib/zookeepers.js");

const { zookeepers } = require("../../data/zookeepers");

router.get('/zookeepers', (req, res) => {

    // the zookeepers declared above
    let results = zookeepers;

    // if there is a query parameter, then filter by it
    if (req.query) {
        results = filterByQuery(req.query, results);
    }

    res.json(results);
});

router.get('/zookeepers/:id', (req, res) => {

    // findById method will for sure only return a single animal bc the id is unique
    const result = findById(req.params.id, zookeepers);

    // if no record exists for the animal being searched for, the client receives a 404 error
    if (result) {
        res.json(result);
    } else {
        // send the 404 error code to the client
        res.send(404);
        // We chose to return an error here instead of an empty object or undefined in order to make it clear to the client that the resource they asked for, in this case a specific animal, does not exist.
    }
});

router.post('/zookeepers', (req, res) => {

    req.body.id = zookeepers.length.toString();

    if (!validateAnimal(req.body)) {
        res.status(400).send('The zookeeper is not properly formatted.');
    } 
    else {
        const zookeeper = createNewZookeeper(req.body, zookeepers);
        res.json(zookeeper);
    }
});

// export the router
module.exports = router;