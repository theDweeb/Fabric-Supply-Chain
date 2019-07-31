'use strict'
const appRoot = require('app-root-path');
const logger = require(`${appRoot}/fabric/winston`).getLogger(module);
const Client = require('fabric-client');


// Getters

// getClient returns a Client instance with the associated connection profile / organization
let getClient = async function(org, user) {
    let username;
    if(user.id == undefined) {
        username = user.username
    } else {
        username = user.id;
    }
    let orgName = org.toLowerCase();
    logger.debug(`(GET) org name: ${orgName}`);
    logger.debug(`(GET) username: ${username}`)
    try {
        /* Producer */
        if(orgName == "producer") {
            let cp = `${appRoot}/organizations/producer/config/cp-local.json`;

            let client = Client.loadFromConfig(cp);
            logger.debug(`(GET) Connection profile loaded for organization: ${orgName}`);
    
            await client.initCredentialStores();
    
            let userContext = await client.getUserContext(username, true);
            if(!userContext) {
                logger.error(`(GET) User: ${username} was not found. (helper.getClient)`);
                return false;
            } else {
                logger.debug(`(GET) User: ${username} is registered and enrolled`);
            }
    
            logger.debug(`(GET) Successfully retrieved client: ${username} from organzation: ${orgName}.`)
            return client;
        }
        /* Consumer */
        else if(orgName == "consumer") {
            let cp = `${appRoot}/organizations/consumer/config/cp-local.json`;
    
            let client = Client.loadFromConfig(cp);
            logger.debug(`(GET) Connection profile loaded for organization: ${orgName}`);
    
            await client.initCredentialStores();
    
            let userContext = await client.getUserContext(username, true);
            if(!userContext) {
                logger.error(`(GET) User: ${username} was not found. (helper.getClient)`);
                return false;
            } else {
                logger.debug(`(GET) User: ${username} is registered and enrolled`);
            }
    
            logger.debug(`(GET) Successfully retrieved client: ${username} from organzation: ${orgName}.`)
            return client;
        }
        /* Shipper */
        else if(orgName == "shipper") {
            let cp = `${appRoot}/organizations/shipper/config/cp-local.json`;
    
            let client = Client.loadFromConfig(cp);
            logger.debug(`(GET) Connection profile loaded for organization: ${orgName}`);
    
            await client.initCredentialStores();
    
            let userContext = await client.getUserContext(username, true);
            if(!userContext) {
                logger.error(`(GET) User: ${username} was not found. (helper.getClient)`);
                return false;
            } else {
                logger.debug(`(GET) User: ${username} is registered and enrolled`);
            }
    
            logger.debug(`(GET) Successfully retrieved client: ${username} from organzation: ${orgName}.`)
            return client;
        }
        /* Transporter */
        else if(orgName == "transporter") {
            let cp = `${appRoot}/organizations/transporter/config/cp-local.json`;
    
            let client = Client.loadFromConfig(cp);
            logger.debug(`(GET) Connection profile loaded for organization: ${orgName}`);
    
            await client.initCredentialStores();
    
            let userContext = await client.getUserContext(username, true);
            if(!userContext) {
                logger.error(`(GET) User: ${username} was not found. (helper.getClient)`);
                return false;
            } else {
                logger.debug(`(GET) User: ${username} is registered and enrolled`);
            }
    
            logger.debug(`(GET) Successfully retrieved client: ${username} from organzation: ${orgName}.`)
            return client;
        }

        else {
            logger.error(`Connection profile '${orgName}' not found.`)
            throw new Error(`User not found`)
        }
    } catch(error) {
        return error;
    }
}

// Setters

// setClient sets the current signing authority to the user/organization
let setClient = async function(org, user) {
    let username;
    if(user.id == undefined) {
        username = user.username
    } else {
        username = user.id;
    }
    let orgName = org.toLowerCase();

    try {
        /* Producer */
        if(orgName == "producer") {
            let cp = `${appRoot}/organizations/producer/config/cp-local.json`;
    
            let client = Client.loadFromConfig(cp);
            logger.debug(`(SET) Connection profile loaded for organization: ${orgName}`);
    
            await client.initCredentialStores();

            return await client.setUserContext(user);
        }
        /* Consumer */
        else if(orgName == "consumer") {
            let cp = `${appRoot}/organizations/consumer/config/cp-local.json`;
    
            let client = Client.loadFromConfig(cp);
            logger.debug(`(SET) Connection profile loaded for organization: ${orgName}`);
    
            await client.initCredentialStores();
              
            return await client.setUserContext(user);
        }
        /* Shipper */
        else if(orgName == "shipper") {
            let cp = `${appRoot}/organizations/shipper/config/cp-local.json`;
    
            let client = Client.loadFromConfig(cp);
            logger.debug(`(SET) Connection profile loaded for organization: ${orgName}`);
    
            await client.initCredentialStores();
              
            return await client.setUserContext(user);
        }
        /* Transporter */
        else if(orgName == "transporter") {
            let cp = `${appRoot}/organizations/transporter/config/cp-local.json`;
    
            let client = Client.loadFromConfig(cp);
            logger.debug(`(SET) Connection profile loaded for organization: ${orgName}`);
    
            await client.initCredentialStores();
              
            return await client.setUserContext(user);
        }

        else {
            logger.error(`Connection profile '${orgName}' not found.`)
        }
    } catch (error) {
        return error;
    }
    
}

exports.getClient = getClient;
exports.setClient = setClient;