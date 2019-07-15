var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("GET request from '/'");
});

router.post('/', function(req, res, next) {
  
  // obj = JSON.stringify(req.body)
  // console.log(req.body)
  res.send("POST request from '/'");
})

module.exports = router;