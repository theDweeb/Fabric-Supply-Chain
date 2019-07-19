'use strict'
const appRoot = require('app-root-path');
const logger = require(`${appRoot}/fabric/winston`).getLogger(module);
const Client = require('fabric-client');

// Getters
let getClient = async function(org, user) {
    let username = user.username;
    logger.debug("Loading connection profile...")
    if(org === "Producer" || "producer") {
        logger.debug(`Connection profile '${org}' loaded.`)
        let cp = `${appRoot}/organizations/producer/config/cp-local.json`;

        logger.debug(`Setting up client for organization: ${org}`);
        let client = Client.loadFromConfig(cp);
        
        logger.debug('Setting state.')
        await client.initCredentialStores();

        if(username) {
            let user = await client.getUserContext(username, true);
            if(!user) {
                logger.error(`User: ${username} was not found. (helper.getClient)`);
                throw new Error(`User: ${username} was not found. (helper.getClient)`);
            } else {
                logger.debug(`User: ${username} is registered and enrolled`);
            }
        } else {
            logger.error(`Username undefined or empty. (helper.getClient)`);
            throw new Error(`Username undefined or empty. (helper.getClient)`);
        }

        logger.debug(`Successfully retrieved client: ${username} from organzation: ${org}.`)
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
    }
}

let getCA = async function(client) {
    
}


// Setters
let setClient = async function(org, user) {
    let username = user.username;
    logger.debug("Loading connection profile...")
    if(org === "Producer" || "producer") {
        logger.debug(`Connection profile '${org}' loaded.`)
        let cp = `${appRoot}/organizations/producer/config/cp-local.json`;

        logger.debug(`Setting up client for organization: ${org}`);
        let client = Client.loadFromConfig(cp);
        
        logger.debug('Setting state.')
        await client.initCredentialStores();

        if(username) {
            let newContext = await client.setUserContext(user, true);
            if(!newContext) {
                logger.error(`User: ${username} was not found. (helper.getClient)`);
                throw new Error(`User: ${username} was not found. (helper.getClient)`);
            } else {
                logger.debug(`User: ${username} is registered and enrolled`);
                logger.debug(`Successfully retrieved client: ${username} from organzation: ${org}.`)
                return newContext;
            }
        } else {
            logger.error(`Username undefined or empty. (helper.getClient)`);
            throw new Error(`Username undefined or empty. (helper.getClient)`);
        }
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
}

exports.getClient = getClient;
exports.setClient = setClient;