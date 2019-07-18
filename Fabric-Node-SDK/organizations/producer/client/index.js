var express = require('express');
var router = express.Router();
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/organizations/producer/fabric/fabric-interface`);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("GET request from '/'");
});

router.post('/', function(req, res, next) {
  fabService.makeUser("aswd", "1234")
  res.send("POST request from '/'");
})

module.exports = router;