let express = require('express');
let router = express.Router();
let appRoot = require('app-root-path');
const constants = require(`${appRoot}/fabric/constants.js`);
let fabService = require(`${appRoot}/organizations/producer/fabric/fabric-interface`);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("GET request to 'query'");
});

router.post("/", (req, res) => {
  // Reads in the request body
  //let resident = req.body;

  // Creates a resident object
  resObj = {
      firstName: "hank",
      lastName:"hill",
      alias: "hank",
      tokens: "idtok2",
      id: "idres2",
      type: "Prosumer",
      cash: "idcash2",
      energy: "iden2"
      };

      // Arguments needed for invoking the blockchain
      let args = [resObj.id, JSON.stringify(resObj)];
  
  // Creates a user for the SDK ONLY! you still need to invoke the blockchain!
  fabService.makeUser(resObj.alias, "123456")
  .then(() => {

      // Here the blockchain is invoked! great success!
      fabService.invoke(resObj.alias, constants.createResident, args)
  })
  .then(() => {
      res.status(200).send("status 200, Resident " + resObj.firstName + " " + resObj.lastName + ", ALIAS: " + resObj.alias);
      res.status(500).send("status 500, failed")
      res.status(404).send("status 404, failed")
  })

});
module.exports = router;