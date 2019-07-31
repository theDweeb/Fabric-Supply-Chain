// Node/Express
var express = require('express');
var router = express.Router();
let appRoot = require('app-root-path');

// Fabric Config/SDK
let fabric = require(`${appRoot}/fabric/channel-util.js`);
let fabConfig = require(`${appRoot}/organizations/transporter/config/fabric-config.js`).TRANSPORTER;

// Endpoints
router.get('/', function(req, res) {
  res.send("GET request from '/transporter/channels'");
});

// Create a channel
router.post('/create', async function(req, res) {
  let request = req.body;

  let org = request.org;
  let admin = fabConfig.adminCred;
  let ordererName = request.ordererName;
  let channelConfigPath = request.channelConfigPath;
  let channelName = request.channelName;

  let response = await fabric.createChannel(org, admin, ordererName, channelConfigPath, channelName);

  res.send(response);
})

// Join a channel
router.post('/join', async function(req, res) {
  let request = req.body;

  let org = request.org;
  let admin = fabConfig.adminCred;
  let ordererName = request.ordererName;
  let channelName = request.channelName;
  let peers = request.peers

  let response = await fabric.joinChannel(org, admin, channelName, ordererName, peers);

  res.send(response);
})

module.exports = router;