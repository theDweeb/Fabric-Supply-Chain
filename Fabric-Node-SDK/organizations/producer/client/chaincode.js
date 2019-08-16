// Node/Express
var express = require('express');
var router = express.Router();
let appRoot = require('app-root-path');
const IncomingForm = require('formidable').IncomingForm
const fs = require('fs')
const path = require('path')

// Fabric Config/SDK
let fabric = require(`${appRoot}/fabric/chaincode-util.js`);
let fabConfig = require(`${appRoot}/organizations/producer/config/fabric-config.js`).PRODUCER;

// Endpoints
router.get('/', function (req, res) {
  res.send("GET request from '/producer/chaincode'");
});

// Install chaincode 
router.post('/install', async function (req, res) {
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
router.post('/instantiate', async function (req, res) {
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
router.post('/query', async function (req, res) {
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
router.post('/invoke', async function (req, res) {
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

router.post('/upload', async function (req, res) {
  let form = new IncomingForm()


  form.on('file', (field, file) => {
    console.log(JSON.stringify(file));
    //let newpath = path.join(__dirname, 'uploads', file.name);/home/steve/go/src/github.com/theDweeb
    let newpath = `${process.env.GOPATH}/src/github.com/theDweeb/uploads/${file.name}`;
    let oldpath = file.path;
    let filename = file.name;
    fs.rename(oldpath, newpath, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log(`Successfully uploaded ${filename} to ${newpath}`)
      }
    })
    form.on('close', () => {
      fs.unlink(oldpath, (err) => {
        if (err) throw err;
        console.log(`${oldpath} deleted`)
        res.json(`Successfully uploaded ${filename} to ${newpath}\n${oldpath} deleted`)
      })

    })
  })


  form.parse(req)
})

module.exports = router;