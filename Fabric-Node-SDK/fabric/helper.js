'use strict'
const appRoot = require('app-root-path');
const logger = require(`${appRoot}/fabric/winston`).getLogger(module);
const Client = require('fabric-client');

// Getters
let getClient = async function(org, user) {
    let username;
    if(user.id == undefined) {
        username = user.username
    } else {
        username = user.id;
    }

    logger.debug("(GET) " + username)
    try {
        if(org === "Producer" || "producer") {
            let cp = `${appRoot}/organizations/producer/config/cp-local.json`;
    
            let client = Client.loadFromConfig(cp);
            logger.debug(`(GET) Connection profile loaded for organization: ${org}`);
    
            await client.initCredentialStores();
    

            let userContext = await client.getUserContext(username, true);
            if(!userContext) {
                logger.error(`(GET) User: ${username} was not found. (helper.getClient)`);
                throw new Error(`(GET) User: ${username} was not found. (helper.getClient)`);
            } else {
                logger.debug(`(GET) User: ${username} is registered and enrolled`);
            }
    
            logger.debug(`(GET) Successfully retrieved client: ${username} from organzation: ${org}.`)
            return client;
        }
        else if(org === "Consumer" || "consumer") {
            logger.debug(`Connection profile '${org}' loaded.`)
            let cp = `${appRoot}/organizations/consumer/config/cp-local.json`;
            return cp;
        }
        else if(org === "Transporter" || "transporter") {
            logger.debug(`Connection profile '${org}' loaded.`)
            let cp = `${appRoot}/organizations/transporter/config/cp-local.json`;
            return cp;
        }
        else if(org === "Shipper" || "shipper") {
            logger.debug(`Connection profile '${org}' loaded.`)
            let cp = `${appRoot}/organizations/shipper/config/cp-local.json`;
            return cp;
        }
        else {
            logger.error(`Connection profile '${org}' not found.`)
            throw new Error(`User not found`)
        }
    } catch(error) {
        return error;
    }
}

let getChannel = async function(client, chanName) {
        let channel = client.getChannel(chanName);
        return channel;
}

let query = async function(client, request, chanName) {
    logger.debug(JSON.stringify(request))
    let channel = client.getChannel(chanName);
    let proposal = channel.queryByChaincode(request)
    return proposal;
}

// Setters
let setClient = async function(org, user) {
    let username;
    if(user.id == undefined) {
        username = user.username
    } else {
        username = user.id;
    }
    logger.debug(username)
    try {
        if(org === "Producer" || "producer") {
            let cp = `${appRoot}/organizations/producer/config/cp-local.json`;
    
            let client = Client.loadFromConfig(cp);
            logger.debug(`(SET) Connection profile loaded for organization: ${org}`);
    
            await client.initCredentialStores();
              
            let newContext = await client.setUserContext(user, true);
            if(!newContext) {
                logger.error(`(SET) User: ${username} was not found. (helper.getClient)`);
                //throw new Error(`User: ${username} was not found. (helper.getClient)`);
            } else {
                logger.debug(`(SET) User: ${username} is registered and enrolled`);
                logger.debug(`(SET) Successfully retrieved client: ${username} from organzation: ${org}.`)
            }

            return newContext;
        }
        else if(org === "Consumer" || "consumer") {
            logger.debug(`Connection profile '${org}' loaded.`)
            let cp = `${appRoot}/organizations/consumer/config/cp-local.json`;
            return cp;
        }
        else if(org === "Transporter" || "transporter") {
            logger.debug(`Connection profile '${org}' loaded.`)
            let cp = `${appRoot}/organizations/transporter/config/cp-local.json`;
            return cp;
        }
        else if(org === "Shipper" || "shipper") {
            logger.debug(`Connection profile '${org}' loaded.`)
            let cp = `${appRoot}/organizations/shipper/config/cp-local.json`;
            return cp;
        }
        else {
            logger.error(`Connection profile '${org}' not found.`)
        }
    } catch (error) {
        return error;
    }
    
}

exports.getClient = getClient;
exports.getChannel = getChannel;
exports.query = query;
exports.setClient = setClient;