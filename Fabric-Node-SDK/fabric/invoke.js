let appRoot = require('app-root-path');
let logger = require(`${appRoot}/fabric/winston`).getLogger(module);
let helper = require(`${appRoot}/fabric/helper.js`);

let invoke = async function(org, user, CCName, fcn, args, channelName) {

    try {
        let client = await helper.getClient(org, user);
        await helper.setClient(org, user);
        logger.debug("org: " + org);
        logger.debug("CCName: " + CCName);
        logger.debug("fcn: " + fcn);
        logger.debug("args: " + args);
        logger.debug("channelName: " + channelName);



        let channel = await client.getChannel(channelName);
        logger.debug("Invoking on channel " + channelName);

        let txID = client.newTransactionID();

        const request = {
            chaincodeId: CCName,
            fcn: fcn,
            args: args,
            chainId: channelName,
            txId: txID
        }

        logger.debug("Invoke request: " + JSON.stringify(request));

        let results = await channel.sendTransactionProposal(request, 60000);
        logger.debug("Transaction proposal sent!");

        const proposalResponses = results[0];
        const proposal = results[1];
        let proposalStatus = results[0][0].response.status;
        let proposalMessage = results[0][0].response.message;
        logger.debug("Proposal results: " + proposalResponses);

        let success;
        if(proposalStatus == 200) {
            logger.debug("Proposal response: " + JSON.stringify(proposalStatus));
            success = true;
        } else {
            let msg = "Proposal response failed: " + proposalMessage;
            logger.error(msg);
            success = false;
            throw new Error(msg);
        }

        if(success) {
            logger.debug("Sending proposals");

            const request = {
                proposalResponses: proposalResponses,
                proposal: proposal
            }

            let response = await channel.sendTransaction(request);
            if(response.status === 'SUCCESS') {
                logger.debug("Successfully sent transaction to orderer(s)");
            
            } else {
                let msg = "Failed to order the transaction. Error code: " + proposalStatus + ", message: " + proposalMessage;
                logger.error(msg);
                
            }

        } else {
            logger.error("Failed to send off proposals. 'success' = " + success + "\n"  )
        }

        return proposalMessage;

    } catch(error) {
        logger.debug(error);
    }
}

exports.invoke = invoke;