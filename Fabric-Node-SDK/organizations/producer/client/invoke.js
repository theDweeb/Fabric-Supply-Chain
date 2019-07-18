
// Express/Nodejs 
let express = require('express');
let router = express.Router();
let appRoot = require('app-root-path');

// Config/logger
const fabConfig = require(`${appRoot}/organizations/producer/config/fabric-config.js`);
const CP = fabConfig.CP;
const CHAN = fabConfig.CHANNEL;
let logger = require(`${appRoot}/fabric/winston`).getLogger(module);

// Fabric SDK
const Client = require('fabric-client');
let client = Client.loadFromConfig(`${appRoot}/organizations/producer/config/${CP}`);

router.get('/', function(req, res) {
    res.send("GET request to 'invoke'");
});

router.post('/', function(req, res) {

/*
curl -d '{"username":"admin", "fnc": "set", "arg1": "a", "arg2": "30"}' -H "Content-Type: application/json" -X POST http://localhost:3000/producer/invoke
curl -d '{"username":"admin", "fnc": "set", "args": {""}}' -H "Content-Type: application/json" -X POST http://localhost:3000/producer/invoke
*/
    let reqObj = req.body;

    logger.debug('Initializing');
    return client.initCredentialStores()
    .then(() => {
        logger.debug('Getting user credentials');
        return client.getUserContext(reqObj.username, true);
    }).then((user) => {
        if(user == null) {
            logger.warn('User in store not found ' + reqObj.username)
            throw new Error('User in store not found ' + reqObj.username)
        }
        logger.debug('Found user ' + user.getName());
    
        return client.setUserContext(user)
    }).then((user) => {
        logger.debug("Set user context: " + user.getName());

        logger.debug("Invoking chaincode");
        Client.setConfigSetting('request-timeout', 60000);

        let channel = client.getChannel(CHAN.chanName);
        logger.debug('Invoking on channel ' + channel);

        let txID = client.newTransactionID();

        let args = [];
        args.push(reqObj.arg1.toString());
        args.push(reqObj.arg2.toString());

        logger.debug("args: " + args)
        const request = {
            chaincodeId: CHAN.ccName,
            fcn: reqObj.fcn,
            args: args,
            chainId: CHAN.chanName,
            txId: txID
        }

        logger.debug("Invoke request: " + JSON.stringify(request));

        return channel.sendTransactionProposal(request, 90000)
    }).then((results) => {
        logger.debug('Transaction proposal sent')
        const proposalResponses = results[0];
        const proposal = results[1];

        logger.debug("Proposal results: " + results)

        logger.debug("Prosal responses: " + JSON.stringify(results[0][0].response.status))
        let all_good;

        logger.debug(results)
        
            if(results[0][0].response.status == 200) {
                logger.debug('Proposal response success: ' + JSON.stringify(proposalResponses))
                all_good = true;
            }else {
                let msg = "Proposal response failed:" + proposalResponses.response.message
                logger.warn(msg); 
            }

            if(all_good) {
                logger.debug("Sending proposals off");
        
                const request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal
                }
                let channel = client.getChannel(CHAN.chanName);
        
                return channel.sendTransaction(request)
                .then((response) => {
                    if(response.status === 'SUCCESS') {
                        logger.debug("Successfully sent transaction to orderer(s)")
                    }
                    else{
                        let m = "Failed to order the transaction. Error code: " + response.status + ", message: " + response.message;
                        logger.error(m);
                        throw new Error(m);
                    }
                    res.send("Invoke  " + response.status + "\n")
                }).catch(err => {
                    res.send(err);
                })
            }
            else{
                logger.error("Failed to send off proposals, all_good = " + all_good);
            }
            
    }).catch(err => {
        logger.error(err)
        res.send(err + "\n")
    })
});

module.exports = router;