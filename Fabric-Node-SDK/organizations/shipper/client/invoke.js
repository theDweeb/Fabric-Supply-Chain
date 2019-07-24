
// Express/Nodejs 
let express = require('express');
let router = express.Router();
let appRoot = require('app-root-path');

// Config/logger
const fabConfig = require(`${appRoot}/organizations/shipper/config/fabric-config.js`).SHIPPER;
const CHANNEL_NAME = fabConfig.channelName;
const CC_NAME = fabConfig.CCName;
let logger = require(`${appRoot}/fabric/winston`).getLogger(module);

// SDK
let fabric = require(`${appRoot}/fabric/invoke.js`);

// Endpoints
router.get('/', function(req, res) {
    res.send("GET request to 'invoke'");
});

router.post('/', async function(req, res) {
  let request = req.body;
  logger.debug(JSON.stringify(request));

  let user = {
      id: request.id,
      org: request.org
  }

  let args = request.args;
  let fcn = request.fcn;

  let response = await fabric.invoke(user.org, user, CC_NAME, fcn, args, CHANNEL_NAME);

  if(response == "SUCCESS") {
      res.send(`Invoke successful!\n`);
    } else {
      res.send(`Invoke failed!: ` + response + "\n");
    }
});

module.exports = router;