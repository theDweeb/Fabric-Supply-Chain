let appRoot = require('app-root-path');
let logger = require(`${appRoot}/fabric/winston`).getLogger(module);
let helper = require(`${appRoot}/fabric/helper.js`);
const User = require('fabric-client').User;


let createUser = async function(admin, org, user) {
    logger.debug('----------------------------------------------')
    logger.debug(`--- Creating user for organization: ${org} -`);
    logger.debug(`-------- Admin signing off: ${admin.username} ------------`)
    logger.debug('----------------------------------------------')
    
    let response = {
        success: false,
        error: ''
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

        response.success = true
        return response;
    } catch (error) {
        logger.error(`Error: ${error}`);
        response.success = false;
        response.error = error;
        return response;     
    }
}

exports.createUser = createUser;