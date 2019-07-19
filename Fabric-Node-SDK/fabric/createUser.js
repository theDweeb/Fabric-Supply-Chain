let appRoot = require('app-root-path');
let logger = require(`${appRoot}/fabric/winston`).getLogger(module);
let helper = require(`${appRoot}/fabric/helper.js`);
const Client = require('fabric-client');
const User = require('fabric-client').User;



let createUser = async function(admin, org, user) {
    logger.debug('----------------------------------------------')
    logger.debug(`--- Creating user for organization: ${org} -`);
    logger.debug(`--- Admin signing off: ${admin.username} -----`)
    logger.debug('----------------------------------------------')
    let newUser = new User(user);
    logger.debug(`new user: ${newUser._name}, role: ${newUser._roles}, affiliation: ${newUser._affiliation}`);

    try {
        let client = await helper.setClient(org, admin);
        let adminService = await helper.getClient(org, admin);
        let CA = await adminService.getCertificateAuthority();

        let registerRequest = {
            enrollmentID: user.name,
            enrollmentSecret: user.secret,
            role: user.role,
            affiliation: user.affiliation
        }

        logger.debug(`Registering user: ${user.name}`);
        let enrollmentSecret = await CA.register(registerRequest, client);
        logger.debug(`Successfully registered user: ${user.name}`);
        let enrollmentRequest = {
            enrollmentID: user.name,
            enrollmentSecret: enrollmentSecret
        }

        newUser._enrollmentSecret = enrollmentSecret;

        logger.debug(`Enrolling user: ${user.name}...`);
        let enrollmentResponse = await CA.enroll(enrollmentRequest);
        logger.debug(`Successfully enrolled user: ${user.name}`);
        
        await newUser.setEnrollment(enrollmentResponse.key, enrollmentResponse.certificate, adminService.getMspid());

        logger.debug(`Setting user ${user.name} signing identity.`);
        await adminService.setUserContext(newUser, false);
        logger.debug(`Successfully set user ${user.name}'s signing identity.`);

        return true;

    } catch (error) {
        logger.error(`Error: ${error}`);
        throw new Error(`Error: ${error}`);
    }
}


exports.createUser = createUser;