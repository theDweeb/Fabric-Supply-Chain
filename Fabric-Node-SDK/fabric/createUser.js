var express = require('express');
var router = express.Router();
let appRoot = require('app-root-path');
let createUser = require(`${appRoot}/fabric/createUser.js`);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("GET request from 'CREATE USER'");
});

router.post('/', async function(req, res, next) {
  let request = req.body;

  let org = request.org;
  
  let user = {
    name: request.id,
    roles: [request.role],
    affiliation: request.affiliation,
    secret: request.secret
  }

  let admin = {
    username: "admin",
    password: "adminpw"
  }

  let success = await createUser.createUser(admin, org, user);

  if(success) {
    res.send('SUCCESS\n');
  } else {
    res.send('FAILED\n');
  }
  

})

module.exports = router;

/*
curl -d '{"org": "producer", "id": "steve", "secret": "1234", "role": "dev", "affiliation": "org1.department1"}' -H "Content-Type: application/json" -X POST http://localhost:3000/producer/createUser
*/