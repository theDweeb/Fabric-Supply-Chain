// Node/Express
var express = require('express');
var router = express.Router();
let appRoot = require('app-root-path');

// Fabric Config/SDK
let fabric = require(`${appRoot}/fabric/chaincode-util.js`);
let fabConfig = require(`${appRoot}/organizations/transporter/config/fabric-config.js`).TRANSPORTER;

// Endpoints
router.get('/', function(req, res) {
  res.send("GET request from '/transporter/chaincode'");
});

// Install chaincode 
router.post('/install', async function(req, res) {
  let request = req.body;

  let org = request.org;
  let admin = fabConfig.adminCred;
  let peers = request.peers;
  let CCPath = request.CCPath;
  let CCName = request.CCName;
  let CCVersion = request.CCVersion;
  let CCType = request.CCType;

  let response = await fabric.installChaincode(org, admin, peers, CCPath, CCName, CCVersion, CCType)

  res.send(response);
});

// Instantiate chaincode
router.post('/instantiate', async function(req, res) {
  let request = req.body;

  let org = request.org;
  let admin = fabConfig.adminCred;
  let peers = request.peers;
  let channelName = request.channelName;
  let CCName = request.CCName;
  let CCVersion = request.CCVersion;
  let CCType = request.CCType;
  let fcn = request.fcn;
  let args = request.args;

  let response = await fabric.instantiateChaincode(org, admin, peers, channelName, CCName, CCVersion, CCType, fcn, args)

  res.send(response);
});

// Query function on blockchain
router.post('/query', async function(req, res) {
  let request = req.body;

  let user = {
      id: request.id,
      org: request.org,
      fcn: request.fcn,
      args: request.args
  }

  let CCName = request.CCName;
  let channelName = request.channelName;

  let response = await fabric.queryChaincode(user.org, user, CCName, channelName, user.fcn, user.args);

  res.send(response);
  });

// Invoke function on blockchain
router.post('/invoke', async function(req, res) {
  let request = req.body;

  let user = {
      id: request.id,
      org: request.org
  }

  let args = request.args;
  let fcn = request.fcn;
  let CCName = request.CCName;
  let channelName = request.channelName;

  let response = await fabric.invokeChaincode(user.org, user, CCName, fcn, args, channelName);

  res.send(response)
});

module.exports = router;