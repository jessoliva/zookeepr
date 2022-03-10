// middleware so that our app knows about the routes in animalRoutes.js
// Here we're employing Router as before, but this time we're having it use the module exported from animalRoutes.js
// Doing it this way, we're using apiRoutes/index.js as a central hub for all routing functions we may want to add to the application. It may seem like overkill with just one exported module, but as your application evolves, it will become a very efficient mechanism for managing your routing code and keeping it modularized.
// We've added this code so that later, when we add additional routes, they can all be exported from the same file.

const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');
// const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');

router.use(animalRoutes);
// router.use(zookeeperRoutes);
router.use(require('./zookeeperRoutes')); // shortcut

module.exports = router;


