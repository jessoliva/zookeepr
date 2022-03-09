const fs = require("fs");
const path = require("path");


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
        // changed ./data to ../data bc this file is now in a folder and not in the root directory
        path.join(__dirname, '../data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
        // we need to save the JavaScript array data as JSON, so we use JSON.stringify() to convert it. The other two arguments used in the method, null and 2, are means of keeping our data formatted. The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. The 2 indicates we want to create white space between our values to make it more readable.
        // If we were to leave those two arguments out, the entire animals.json file would work, but it would be really hard to read.

    );
  
    return animal;
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


// export the functions
module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};