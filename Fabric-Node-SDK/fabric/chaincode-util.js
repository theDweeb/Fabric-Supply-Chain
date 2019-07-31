let appRoot = require('app-root-path');
let logger = require(`${appRoot}/fabric/winston`).getLogger(module);
let helper = require(`${appRoot}/fabric/helper.js`);

let installChaincode = async function(org, admin, peers, CCPath, CCName, CCVersion, CCType) {

    logger.info(`===================================`);
    logger.info(`====== Installing Chaincode =======`);
    logger.info(`===================================`);
    logger.info(JSON.stringify(peers));
    let installChaincodeResponse = {
        success: false,
        message: ''
    };

    try{
        // Returns an instance of the admin User object.
        let adminClient = await helper.getClient(org, admin);
        
        // New transactionID object with admin (true)
        let txId = adminClient.newTransactionID(true);

        /*
        Chaincode Install Request
        - targets: (Optional) An array of Peer objects OR peer names where the chaincode will be installed.
        - chaincodePath: The path to the location of the source code of the chaincode.
        - metadataPath: (Optional) The path to the top-level directory containing metadata descriptors.
        - chaincodeId: Name of the chaincode.
        - chaincodeVersion: Version string of the chaincode, such as 'v1'.
        - chaincodePackage: (Optional) Byte array of the archive content for the chaincode source.
        - chaincodeType: (Optional) Type of chaincode (golang, node, java).
        - channelNames: (Optional) when no targets are provided the common CP will be searched for suitable target peers.
        - txId: (Optional) Transaction ID object.
        */

        let chaincodeRequest = {
            targets: peers,
            chaincodePath: CCPath,
            chaincodeId: CCName,
            chaincodeVersion: CCVersion,
            chaincodeType: CCType,
            txId: txId
        };
        logger.debug(`Chaincode request ready to be sent. ${JSON.stringify(chaincodeRequest)}`)

        // A chaincode must be installed to peers and instantiated on a channel before it can be called to process transactions.
        // Only the peer organization's ADMIN identities are allowed to perform this operation.
        let chaincodeResponse = await adminClient.installChaincode(chaincodeRequest);
        let proposalResponses = chaincodeResponse[0];
        let status;
        if(proposalResponses[0].status != undefined) {
            status = proposalResponses[0].status;
        } else {
            status = proposalResponses[0].response.status;
        }

        if(status === 200) {
            for(let response in proposalResponses) {
                let status = proposalResponses[response].response.status;
                let message = proposalResponses[response].response.message;
                if(proposalResponses[response].response.status === 200){
                    logger.debug(`Successfully installed chaincode ${CCName} ${CCVersion}`);
                    logger.debug(`on peers: ${peers}`);
                    installChaincodeResponse.success = true;
                    installChaincodeResponse.message = `Successfully installed chaincode ${CCName} ${CCVersion} on peers: ${peers}`;
                } else {
                    logger.debug(`Proposal response status: ${status}`);
                    logger.debug(`Proposal response message: ${message}`);
                    installChaincodeResponse.success = false;
                    installChaincodeResponse.message = `Failed to installed chaincode ${CCName} ${CCVersion}. Status: ${JSON.stringify(proposalResponses[response].response.status)}`;
                    throw new Error(message);
                }
            }
        } else {
            
            logger.error(`Chaincode NOT installed (STATUS: ${status}) Message:  ${JSON.stringify(proposalResponses[0].message)}`);
            installChaincodeResponse.success = false;
            installChaincodeResponse.message = `Chaincode NOT installed. Response: ${JSON.stringify(proposalResponses[0].message)}`
        }

    } catch(error) {
        logger.error(error);
        installChaincodeResponse.success = false;
        installChaincodeResponse.message = `Failed to installed chaincode ${CCName} ${CCVersion}. Error: ${JSON.stringify(error)}`;
        
    }
    return installChaincodeResponse;
}

let instantiateChaincode = async function(org, admin, peers, channelName, CCName, CCVersion, CCType, fcn, args) {

    logger.info(`===================================`);
    logger.info(`===== Instantiating Chaincode =====`);
    logger.info(`===================================`);


    logger.info(JSON.stringify(peers));
    let installChaincodeResponse = {
        success: false,
        message: ''
    };

    try {
        // Returns an instance of the admin User object.
        let adminClient = await helper.getClient(org, admin);

        let channel = adminClient.getChannel(channelName);
        if(!channel) {
            let msg = `Channel ${channelName} was not defined in the connection profile`;
            logger.error(msg);
            throw new Error(msg);
        }

        let txId = adminClient.newTransactionID(true);
        let txString = txId.getTransactionID();

        let chaincodeRequest = {
            targets: peers,
            chaincodeType: CCType,
            chaincodeId: CCName,
            chaincodeVersion: CCVersion,
            txId: txId,
            fcn: fcn,
            args: args  
        }

        logger.info('This can take a few seconds...');
        let proposalResponse = await channel.sendInstantiateProposal(chaincodeRequest, 400000);

        let responses = proposalResponse[0];
        let proposal = proposalResponse[1];
        let success;

        logger.debug(`responses: ${responses}`)

        for(let response in responses) {
            if(responses[response].response.status === 200) {
                logger.debug(`Instantiate proposal was good ${response}`);
                success = true;
            }
            else {
                logger.debug(`Instantiate proposal was bad ${response}`);
                success = false;
            }
        }

        if(success) {
            logger.debug(`Successfully sent proposal: Status ${responses[0].response.status}`)
            let promises = [];
            let eventHub = channel.getChannelEventHubsForOrg();
            logger.debug(`Found ${eventHub.length}`);

            eventHub.forEach((hub) => {
                let instantiatePromise = new Promise((resolve,reject) => {
                    let timeout = setTimeout(() => {
                        let msg = `REQUEST_TIMEOUT ${hub.getPeerAddr()}`;
                        logger.error(msg);
                        hub.disconnect();
                    }, 300000);

                    hub.registerTxEvent(txString, (tx, code, blockNum) => {
                        logger.debug(`The chaincode instantiate has been commited on peer ${hub.getPeerAddr()}`);
                        logger.debug(`Transaction ${tx}, Status ${code}, Block ${blockNum}`);

                        clearTimeout(timeout);

                        if(code !== 'VALID') {
                            let msg = `The chaincode instantiate was invalid. Code: ${code}`;
                            logger.error(msg);
                            reject(new Error(msg));
                        } else {
                            let msg = `Status ${code}`;
                            resolve(msg);
                        }
                    }, (error) => {
                        clearTimeout(timeout);
                        logger.error(error);
                        reject(error);
                    }, {unregister: true, disconnect: true});

                    hub.connect();
                });
                promises.push(instantiatePromise);
            });

            let ordererRequest = {
                txId: txId,
                proposalResponses: responses,
                proposal: proposal
            };

            let transactionResponse = channel.sendTransaction(ordererRequest);

            promises.push(transactionResponse);

            let results = await Promise.all(promises);

            let response = results.pop();

            if(response.status === 'SUCCESS') {
                logger.debug('Successfully sent transaction to the orderer(s)');
            } else {
                let msg = `Failed to order transaction. Status ${response.status}`;
                logger.error(msg);
                throw new Error(msg);
            }

            for(let i in results) {
                let hubResults = results[i];
                let hub = eventHub[i];

                logger.debug(`Event results for hub ${hub.getPeerAddr()}`);
                if(typeof hubResults === 'string') {
                    logger.debug(`${hubResults}: ${CCName} on channel ${channelName}`);
                } else {
                    let msg = hubResults.toString();
                    logger.error(msg);
                }
            }
        } else {
            let msg = 'Failed to send proposal and recieve responses';
            logger.error(msg);
        }
    } catch(error) {
        logger.error(error);
    }
};

let queryChaincode = async function(org, user, ccName, chanName, fcn, args) {

    logger.info(`===================================`);
    logger.info(`======= Query Chaincode ===========`);
    logger.info(`===================================`);

    let response = {
        success: false,
        message: ''
    }
    
    try {
        let client = await helper.getClient(org, user);
 
        let channel = await client.getChannel(chanName);
        logger.debug(`Query on channel: ${channel}`);
    
        let txID = client.newTransactionID();
    
        let request = {
            chaincodeId: ccName,
            fcn : fcn,
            args : args,
            txId :txID
        }
    
        logger.debug(`query request : ${JSON.stringify(request)}`)
    
        let proposalResponse = await channel.queryByChaincode(request);
        logger.debug(`Proposal accepted.`)
    
        let payload = []
    
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
          logger.debug(`Query Successful with payload: ${payload}`)

          response.success = true
          response.message = payload
          return response;
    } catch (error) {
        logger.error(`Error: ${error}`);
        response.success = false;
        response.message = error;
        return response;     
    }
}

let invokeChaincode = async function(org, user, CCName, fcn, args, channelName) {

    logger.info(`===================================`);
    logger.info(`======= Invoking Chaincode ========`);
    logger.info(`===================================`);

    let invokeResponse = {
        success: false,
        message: ''
    };

    try {
        let client = await helper.getClient(org, user);
        if(!client) {
            let msg = (`User ${user} was not found OR authorized to perform the invoke!`)
            invokeResponse.success = false;
            invokeResponse.message = msg;
            return invokeResponse;
        }
        logger.debug(`Organization: ${org}`);
        logger.debug(`Chaincode name: ${CCName}`);
        logger.debug(`Function call: ${fcn}`);
        logger.debug(`Function arguments: ${args}`);

        let channel = await client.getChannel(channelName);
        logger.debug(`Invoking on channel ${channelName}`);

        let txID = client.newTransactionID();

        const request = {
            chaincodeId: CCName,
            fcn: fcn,
            args: args,
            chainId: channelName,
            txId: txID
        }

        logger.debug(`Invoke request: ${JSON.stringify(request)}`);

        let results = await channel.sendTransactionProposal(request, 60000);
        logger.debug("Transaction proposal sent!");

        const proposalResponses = results[0];
        const proposal = results[1];
        
        if(!proposalResponses[0].response) {
            logger.error(proposalResponses);
            invokeResponse.success = false;
            invokeResponse.message = `Failed to send transaction proposal: ${proposalResponses}`;
            return invokeResponse;
        }

        let proposalStatus = results[0][0].response.status;
        let proposalMessage = results[0][0].response.message;

        logger.debug(`Proposal status: ${JSON.stringify(proposalStatus)}`);

        let success;
        if(proposalStatus == 200) {
            success = true;
        } else {
            let msg = `Proposal response failed: ${proposalMessage}`;
            logger.error(msg);
            success = false;
        }

        if(success) {
            logger.debug("Sending proposals");

            const request = {
                proposalResponses: proposalResponses,
                proposal: proposal
            }

            let transactionResponse = await channel.sendTransaction(request);
            if(transactionResponse.status === 'SUCCESS') {
                logger.debug("Successfully sent transaction to orderer(s)");
                logger.debug(JSON.stringify(transactionResponse));

                invokeResponse.success = true;
                invokeResponse.message = `Transaction status: ${transactionResponse.status}`;
            
            } else {
                let msg = `Failed to order the transaction. Error code: ${proposalStatus}, message: ${proposalMessage}`;
                logger.error(msg);
                invokeResponse.success = false;
                invokeResponse.message = `Transaction status: ${transactionResponse.status}`;
            }

        } else {
            logger.error(`Failed to send off proposals. 'success' = ${success}`)
        }

        return invokeResponse;

    } catch(error) {
        logger.debug(error);
    }
}

exports.installChaincode = installChaincode;
exports.instantiateChaincode = instantiateChaincode;
exports.queryChaincode = queryChaincode;
exports.invokeChaincode = invokeChaincode;