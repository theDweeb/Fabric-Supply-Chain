let appRoot = require('app-root-path');
let logger = require(`${appRoot}/fabric/winston`).getLogger(module);
let helper = require(`${appRoot}/fabric/helper.js`);

let queryChaincode = async function(org, user, ccName, chanName, fcn, args) {

    let response = {
        success: false,
        error: ''
    }
    
    try {
        let client = await helper.getClient(org, user);
        await helper.setClient(org, user);
    
        let channel = await client.getChannel(chanName);
        logger.debug(`Query on channel: ${channel}`);
    
        let txID = client.newTransactionID();
    
        let request = {
            chaincodeId: ccName,
            fcn : fcn,
            args : args,
            txId :txID
        }
    
        logger.debug('query request :'+JSON.stringify(request))
    
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
          logger.debug("Query Successful with payload: "+ payload)

          response.success = true
          response.error = payload
          return response;
    } catch (error) {
        logger.error(`Error: ${error}`);
        response.success = false;
        response.error = error;
        return response;     
    }
}


exports.queryChaincode = queryChaincode;