// Node/Express
var express = require('express');
var router = express.Router();
let appRoot = require('app-root-path');

// Config
let fabConfig = require(`${appRoot}/organizations/shipper/config/fabric-config.js`).SHIPPER;
let CHANNEL_NAME = fabConfig.channelName;
let CC_NAME = fabConfig.CCName;

// SDK
let query = require(`${appRoot}/fabric/query.js`);

// Endpoints
router.get('/', function(req, res, next) {
  res.send("GET request from 'query'");
});

router.post('/', async function(req, res, next) {
  let request = req.body;

  let user = {
      id: request.id,
      org: request.org,
      fcn: request.fcn,
      args: request.args
  }

  let response = await query.queryChaincode(user.org, user, CC_NAME, CHANNEL_NAME, user.fcn, user.args);

  if(response.success) {
  res.send(`payload: ${response.error}`);
  } else {
  res.send(`Failed to create user '${user.name}!\n ${response.error}`);
  }
  });

module.exports = router;