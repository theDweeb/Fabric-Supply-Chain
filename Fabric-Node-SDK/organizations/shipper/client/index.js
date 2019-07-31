var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("GET request from '/'");
});

router.post('/', async function(req, res, next) {
  res.send("POST request from '/'");
})

module.exports = router;