
// Express/Nodejs 
let express = require('express');
let router = express.Router();
let appRoot = require('app-root-path');

// Config/logger
const producer = require(`${appRoot}/organizations/producer/config/fabric-config.js`).PRODUCER;
const CHANNEL_NAME = producer.channelName;
const CC_NAME = producer.CCName;
let logger = require(`${appRoot}/fabric/winston`).getLogger(module);

// SDK
let fabric = require(`${appRoot}/fabric/invoke.js`);


router.get('/', function(req, res) {
    res.send("GET request to 'invoke'");
});

router.post('/', async function(req, res) {

/*
curl -d '{"username":"admin", "fnc": "set", "arg1": "a", "arg2": "30"}' -H "Content-Type: application/json" -X POST http://localhost:3000/producer/invoke
curl -d '{"username":"admin", "fnc": "set", "args": {""}}' -H "Content-Type: application/json" -X POST http://localhost:3000/producer/invoke
*/
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