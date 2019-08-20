let appRoot = require('app-root-path');
let logger = require(`${appRoot}/fabric/winston`).getLogger(module);
let helper = require(`${appRoot}/fabric/helper.js`);
const User = require('fabric-client').User;
const Client = require('fabric-client');


let createUser = async function (admin, org, user) {
    logger.info(`===================================`);
    logger.info(`========= Create User =============`);
    logger.info(`===================================`);

    let createUserResponse = {
        success: false,
        message: ""
    }

    let newUserObj = {
        name: user.id,
        roles: user.roles,
        affiliation: user.affiliation
    }
    newUser = new User(newUserObj);
    logger.debug(`New user: ${newUser._name}, roles: ${newUser._roles}, affiliation: ${newUser._affiliation}`);

    try {
        // Sets admin for as the security context of this client instance.
        // This admin's signing identity will be used to sign all requests.
        let adminSignature = await helper.setClient(org, admin);
        
        // Returns an instance of the admin User object.
        let adminClient = await helper.getClient(org, admin);

        // Returns an instance of the CA as defined by the settings in the currently loaded connection profile.
        let CA = await adminClient.getCertificateAuthority();

        // Register request used by CA for user registration.
        let registerRequest = {
            enrollmentID: user.id,
            enrollmentSecret: user.secret,
            role: user.role,
            affiliation: user.affiliation
        }

        // The registration returns a secret for the user. Used for enrollment.
        let enrollmentSecret = await CA.register(registerRequest, adminSignature);
        logger.debug(`Successfully registered user: ${user.id}`);

        // Enrollment request used by CA for enrolling the registered user.
        let enrollmentRequest = {
            enrollmentID: user.id,
            enrollmentSecret: enrollmentSecret
        }

        newUser._enrollmentSecret = enrollmentSecret;

        let enrollmentResponse = await CA.enroll(enrollmentRequest);
        logger.debug(`Successfully enrolled user: ${user.id}`);

        await newUser.setEnrollment(enrollmentResponse.key, enrollmentResponse.certificate, adminClient.getMspid());
        logger.debug(`Successfully created user ${user.id} signing identity`);

        await adminClient.setUserContext(newUser, false);
        logger.debug(`Successfully set user ${user.id}'s signing identity.`);

        createUserResponse.success = true
        createUserResponse.message = `Successfully created user: ${user.id}`
    } catch (error) {
        logger.error(`Error: ${error}`);
        createUserResponse.success = false;
        createUserResponse.message = `Error: ${error}`;
    }
    return createUserResponse;
}

let searchUser = async function (org, user) {
    logger.info(`===================================`);
    logger.info(`========= Search User =============`);
    logger.info(`===================================`);

    let username;
    if (user.id == undefined) {
        username = user.username
    } else {
        username = user.id;
    }
    let orgName = org.toLowerCase();

    let searchUserResponse = {
        success: false,
        message: ""
    }
    try {
        /* Producer */
        if (orgName == "producer") {
            let cp = `${appRoot}/organizations/producer/config/cp-local.json`;

            let client = Client.loadFromConfig(cp);
            logger.debug(`(SEARCH) Connection profile loaded for organization: ${orgName}`);

            await client.initCredentialStores();

            let userContext = await client.getUserContext(username, true);
            if (!userContext) {
                let msg = `(SEARCH) User: ${username} was not found`
                logger.error(msg);
                searchUserResponse.success = false;
                searchUserResponse.message = msg;
            } else {
                let msg = `(SEARCH) User: ${username} is registered and enrolled`
                logger.debug(msg);
                searchUserResponse.success = true;
                searchUserResponse.message = msg;
            }
            return searchUserResponse;
        }
        /* Consumer */
        else if (orgName == "consumer") {
            let cp = `${appRoot}/organizations/consumer/config/cp-local.json`;

            let client = Client.loadFromConfig(cp);
            logger.debug(`(SEARCH) Connection profile loaded for organization: ${orgName}`);

            await client.initCredentialStores();

            let userContext = await client.getUserContext(username, true);
            if (!userContext) {
                let msg = `(SEARCH) User: ${username} was not found`
                logger.error(msg);
                searchUserResponse.success = false;
                searchUserResponse.message = msg;
                throw new Error(msg);
            } else {
                let msg = `(SEARCH) User: ${username} is registered and enrolled`
                logger.debug(msg);
                searchUserResponse.success = true;
                searchUserResponse.message = msg;
            }
            return searchUserResponse;
        }
        /* Shipper */
        else if (orgName == "shipper") {
            let cp = `${appRoot}/organizations/shipper/config/cp-local.json`;

            let client = Client.loadFromConfig(cp);
            logger.debug(`(SEARCH) Connection profile loaded for organization: ${orgName}`);

            await client.initCredentialStores();

            let userContext = await client.getUserContext(username, true);
            if (!userContext) {
                let msg = `(SEARCH) User: ${username} was not found`
                logger.error(msg);
                searchUserResponse.success = false;
                searchUserResponse.message = msg;
                throw new Error(msg);
            } else {
                let msg = `(SEARCH) User: ${username} is registered and enrolled`
                logger.debug(msg);
                searchUserResponse.success = true;
                searchUserResponse.message = msg;
            }
            return searchUserResponse;
        }
        /* Transporter */
        else if (orgName == "transporter") {
            let cp = `${appRoot}/organizations/transporter/config/cp-local.json`;

            let client = Client.loadFromConfig(cp);
            logger.debug(`(SEARCH) Connection profile loaded for organization: ${orgName}`);

            await client.initCredentialStores();

            let userContext = await client.getUserContext(username, true);
            if (!userContext) {
                let msg = `(SEARCH) User: ${username} was not found`
                logger.error(msg);
                searchUserResponse.success = false;
                searchUserResponse.message = msg;
                throw new Error(msg);
            } else {
                let msg = `(SEARCH) User: ${username} is registered and enrolled`
                logger.debug(msg);
                searchUserResponse.success = true;
                searchUserResponse.message = msg;
            }
            return searchUserResponse;
        }

        else {
            logger.error(`Connection profile '${orgName}' not found.`)
            throw new Error(`User not found`)
        }
    } catch (error) {
        return error;
    }

};

exports.createUser = createUser;
exports.searchUser = searchUser;