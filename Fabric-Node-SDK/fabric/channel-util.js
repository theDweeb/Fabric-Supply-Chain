let appRoot = require('app-root-path');
let logger = require(`${appRoot}/fabric/winston`).getLogger(module);
let helper = require(`${appRoot}/fabric/helper.js`);
let fs = require('fs');
let path = require('path');

// Calls the orderer to start building the new channel.
// Once the channel is successfully created by the orderer, the next step is to have each
// organization's peer nodes join the channel, by sending the channel configuration to each of the peer nodes. 
//The step is accomplished by calling the joinChannel() method.
let createChannel = async function(org, admin, ordererName, channelConfigPath, channelName) {

    logger.info(`===================================`);
    logger.info(`======= Create Channel ============`);
    logger.info(`===================================`);

    // Returned by the function
    let createChannelResponse = {
        success: false,
        message: ""
    };

    try {
        // Returns an instance of the admin User object.
        let adminClient = await helper.getClient(org, admin);

        /*
            Channel Request:
            - name: name of channel
            - orderer: An orderer object or orderer name.
            - [envelope]: (Optional) Bytes of the envelope object containing settings and signatures
            - [config]: (Optional) Protobug ConfigUpdate object extracted from a ConfigEnvelope
                created by the configtxgen tool. See: extractChannelConfig()
            - [signatures]: List of signatures required by the channel. (ConfigSignature | Array)
            -txId: TransactionID object with transaction id.
        */

        // Holds an instance of the orderer object as determined by the loaded connection profile.
        // ordererName: Name OR url of the orderer.
        let orderer = adminClient.getOrderer(ordererName);
        logger.debug(`Orderer found: ${orderer}`);

        // Bytes of the envelope object containing all required settings and signatures
        // to initialize this channel. (Created by the configtxgen OR configtxlator tool prior!)
        logger.debug(channelConfigPath)
        let envelope = fs.readFileSync(path.join(__dirname, channelConfigPath));
        logger.debug(`Envelope created for channel: ${channelConfigPath}`);

        // Extracts the protobuf 'ConfigUpdate' object out of the 'ConfigEnvelope' object
        // The returned object may then be signed using the signChannelConfig() method of this class.
        let channelConfig = adminClient.extractChannelConfig(envelope);
        logger.debug(`Config extracted from envelope. ${JSON.stringify(envelope)}`)

        // Uses the client's current signing identity to sign over the configuration bytes
        // and returns a signature ready to be sent to the orderer(s)
        let signature = adminClient.signChannelConfig(channelConfig);
        logger.debug(`Signature is ready to be sent to orderer. ${signature.signature_header}`)

        // New transaction ID built based on the admin credentials (if true)
        let txId = adminClient.newTransactionID();

        let channelRequest = {
            name: channelName,
            orderer: orderer,
            config: channelConfig,
            signatures: [signature],
            txId: txId
        }

        // Calls the orderer to start building a new channel.
        let channelResponse = await adminClient.createChannel(channelRequest);

        if(channelResponse.status === 'SUCCESS') {
            logger.debug(`Channel created successfull! ${channelResponse.status} \n${channelResponse.message}`);
            createChannelResponse.success = true;
            createChannelResponse.message = `Channel ${channelName} created successfully. STATUS: ${channelResponse.status}`;
        } else {
            logger.error(channelResponse.status);
            logger.error(channelResponse.info);
            createChannelResponse.success = false;
            createChannelResponse.message = `Failed to create channel ${channelName} ${channelResponse.status} ${channelResponse.info}`
        }
        return createChannelResponse;
    } catch(error) {
        logger.error(error);
        createChannelResponse.success = false;
        createChannelResponse.message = `Failed to create channel ${channelName}. Error: ${error}`;
        return createChannelResponse;
    }
}

let joinChannel = async function(org, admin, channelName, ordererName, peers) {
    logger.info(`===================================`);
    logger.info(`======== Join Channel =============`);
    logger.info(`===================================`);

    // Returned by the function
    let joinChannelResponse = {
        success: false,
        message: ""
    };

    try {
        // Returns an instance of the admin User object.
        let adminClient = await helper.getClient(org, admin);

        let channel = adminClient.getChannel(channelName);
        logger.debug((channel));
        if(!channel) {
            let msg = `Channel ${channelName} was not defined in connection profile`;
            logger.error(msg);
            throw new Error(msg);
        }

        // Holds an instance of the orderer object as determined by the loaded connection profile.
        // ordererName: Name OR url of the orderer.
        let orderer = adminClient.getOrderer(ordererName);
        logger.debug(`Orderer found: ${orderer}`);

        let ordererRequest = {
            txId: adminClient.newTransactionID(true),
            orderer: orderer
        }

        /*
            Genesis Block: A channel's first block is called the "genesis block". 
            This block captures the initial channel configuration. For a peer node to join the channel, 
            it must be provided the genesis block. This method must be called before calling joinChannel().
        */

        let genesisBlock = await channel.getGenesisBlock(ordererRequest);

        let joinRequest = {
            targets: peers,
            block: genesisBlock,
            txId: adminClient.newTransactionID(true)
        }

        /*
            Join Channel: For a peer node to become part of a channel, it must be sent the genesis block.
            This method sends a join channel proposal to one or more endorsing peers.
        */
        let promises = [];
        let proposalResponse = channel.joinChannel(joinRequest, 60000);

        promises.push(proposalResponse)
        let results = await Promise.all(promises);

        logger.debug(`Results: ${results}`);

        if(results[0][0].status != undefined) {
            let msg = `Error: ${results}`;
            logger.error(`Status ${results[0][0].status}`);
            logger.error(msg);
            joinChannelResponse.success = false;
            joinChannelResponse.message = msg;
            return joinChannelResponse;
        }


        let peerResults = results.pop();
        for(i in peerResults) {
            let results = peerResults[i];

            if(results.response.status === 200){
                let msg = `Peer successfully joined channel ${channelName}`
                logger.debug(msg);
                joinChannelResponse.success = true;
                joinChannelResponse.message = msg;
            } else {
                let msg = `Failed to join peer to channel ${channelName}`;
                logger.error(msg)
                joinChannelResponse.success = false;
                joinChannelResponse.message = msg;
            }

            return joinChannelResponse;
        }

    } catch(error) {
        let msg = `Failed to join channel! ${error}`
        logger.error(msg)
        joinChannelResponse.success = false;
        joinChannelResponse.message = msg;
        return joinChannelResponse;
    }
};

exports.createChannel = createChannel;
exports.joinChannel = joinChannel;
