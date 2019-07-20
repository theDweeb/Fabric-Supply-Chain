var express = require('express');
var router = express.Router();
let appRoot = require('app-root-path');
let make = require(`${appRoot}/fabric/createUser.js`);
let helper = require(`${appRoot}/fabric/helper.js`)
let producer = require(`${appRoot}/organizations/producer/config/fabric-config.js`).PRODUCER;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("GET request from '/'");
});

router.post('/create', async function(req, res, next) {
  let request = req.body;

  let org = request.org;
  
  let user = {
    id: request.id,
    roles: [request.roles],
    affiliation: request.affiliation,
    secret: request.secret
  }

  let admin = producer.adminCred;

  let response = await make.createUser(admin, org, user);

  // TODO(steve): Add function to add user asset to blockchain

  if(response.success) {
    res.send(`User creation '${user.id}' success!`);
  } else {
    res.send(`Failed to create user '${user.id}!\n ${response.error}`);
  }
})

router.post('/search', async function(req, res, next) {
  let request = req.body;

  let org = request.org;
  
  let user = {
    id: request.id,
    roles: [request.role],
    affiliation: request.affiliation,
    secret: request.secret
  }

  let response = await helper.getClient(org, user);

  // TODO(steve): Add function to add user asset to blockchain

  if(response != {}) {
    res.send(`User found '${user.id}' success!`);
  } else {
    res.send(`Failed to find user '${user.id}!\n ${response.error}`);
  }
})

module.exports = router;