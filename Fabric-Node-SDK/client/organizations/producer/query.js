
let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("GET request to '/'");
});

router.post('/', function(req, res, next) {
  
  // obj = JSON.stringify(req.body)
  // console.log(req.body)
  res.send("POST request to '/'")
})

module.exports = router;