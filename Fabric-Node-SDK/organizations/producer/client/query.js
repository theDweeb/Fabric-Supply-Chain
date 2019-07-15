let express = require('express');
let router = express.Router();
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/organizations/producer/fabric/fabric-interface`);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("GET request to 'query'");
});

router.post("/", (req, res) => {
  // Reads in the request body
  let resident = req.body;

  // Creates a resident object
  resObj = {
      firstName: "steve",
      lastName:"f",
      alias: "steve",
      tokens: "10",
      id: "1",
      type: "1",
      cash: "1",
      energy: "1"
      };

      // Arguments needed for invoking the blockchain
      let args = [resident.id, JSON.stringify(resObj)];
  
  // Creates a user for the SDK ONLY! you still need to invoke the blockchain!
  fabService.makeUser(resident.alias, "123456")
  .then(() => {

      // Here the blockchain is invoked! great success!
      fabService.invoke(resident.alias, constants.createResident, args)
  })
  .then(() => {
      res.status(200).send("status 200, Resident " + resident.firstName + " " + resident.lastName + ", ALIAS: " + resident.alias);
      res.status(500).send("status 500, failed")
      res.status(404).send("status 404, failed")
  })

});
module.exports = router;