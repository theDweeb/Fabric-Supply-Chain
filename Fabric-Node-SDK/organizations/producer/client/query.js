let express = require('express');
let router = express.Router();
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/organizations/producer/fabric/fabric-interface`);
const Client = require('fabric-client');
const userUtil = require(`${appRoot}/fabric/user-utils`);
const fabUtil = require(`${appRoot}/fabric/fabric-utils`);
const fabConfig = require(`${appRoot}/organizations/producer/config/fabric-config.js`);
const CP = fabConfig.CP;
const CHAN = fabConfig.CHANNEL;
let logger = require(`${appRoot}/fabric/winston`).getLogger(module);

let client = Client.loadFromConfig(`${appRoot}/organizations/producer/config/${CP}`);

router.get('/', function(req, res, next) {
  res.send("GET request to 'query\n'");
});

router.post("/", (req, res) => {
/*
curl -d '{"username":"admin", "fnc": "query", "args": "a"}' -H "Content-Type: application/json" -X POST http://localhost:3000/producer/query
*/

  let reqObj = req.body;
  let username = reqObj.username;

  // Set the state for the client
  return client.initCredentialStores()
    .then(() => {
      logger.debug('State set!')

      // Get user context (credentials/certs)
      // Returns User context
      return client.getUserContext(username, true)
    }).then((user) => {
      if(user === null){
        logger.warn('User in store not found: ' + username)
        throw new Error('User in store not found '+ username)
      }
      logger.debug('Found user : ' + user.getName())

      // Set the User as the current context to sign off on all requests
      // Returns a Promise of 'user' upon success
      return client.setUserContext(user)
    }).then((user) => {
      logger.debug('User context set: ' + user.getName())
      logger.debug('Channel: ' + CHAN.chanName)
      let channel = client.getChannel(CHAN.chanName);
      logger.info("Query on Channel:" + CHAN.chanName);
      let txID = client.newTransactionID();
      let transientMap = false
  
      const request = {
          chaincodeId: CHAN.ccName,
          fcn : reqObj.fcn,
          args : reqObj.args,
          txId :txID,
      };
      logger.debug('query request :'+JSON.stringify(request))

      // Sends proposal to endorsing peers
      // Returns a Promise for an array of byte array results from all endorsing peers
      return channel.queryByChaincode(request)
    }).then((proposalResponse) => {
      logger.debug('Proposal accepted.')
      let payload = [];

      if(proposalResponse) {
        for(let i = 0; i < proposalResponse.length; i++){
          logger.debug('Response from endorser'+ [i+1] + ": " + proposalResponse[i])
          if(proposalResponse[i] instanceof Error){
            logger.error("Payload error ")
            throw new Error(proposalResponse[i])
            }
            payload.push(proposalResponse[i].toString('utf8'));
          }
      }else{
        let m = 'Failed to get response on query'
        logger.error(m);
        throw new Error(m);
      }
      logger.debug("Query Successful with payload: "+ payload)
      res.send(payload[0] + "\n")
    }).then(() => {
      
    }).catch((err) => {
      res.send("error: " + err + "\n")
    })




});
module.exports = router;