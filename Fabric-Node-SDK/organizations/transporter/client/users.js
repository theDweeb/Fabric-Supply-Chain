// Node/Express
var express = require('express');
var router = express.Router();
let appRoot = require('app-root-path');

// Fabric Config/SDK
let fabric = require(`${appRoot}/fabric/user-util.js`);
let fabConfig = require(`${appRoot}/organizations/transporter/config/fabric-config.js`).TRANSPORTER;

// Endpoints
router.get('/', function(req, res) {
  res.send("GET request from '/'");
});

// Create a user
router.post('/create', async function(req, res) {
  let request = req.body;

  let org = request.org;

  let user = {
    id: request.id,
    roles: [request.roles],
    affiliation: request.affiliation,
    secret: request.secret
  }

  let admin = fabConfig.adminCred;

  let response = await fabric.createUser(admin, org, user);

  res.send(response);
});

// Search for an enrolled user
router.post('/search', async function(req, res) {
  let request = req.body;

  let org = request.org;
  
  let user = {
    id: request.id,
    roles: [request.role],
    affiliation: request.affiliation,
    secret: request.secret
  }

  let response = await fabric.searchUser(org, user);

  res.send(response);
});

module.exports = router;