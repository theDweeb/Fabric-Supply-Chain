'use strict'
// Express/Nodejs 
let express = require('express');
let router = express.Router();
let appRoot = require('app-root-path');

// Fabric SDK
const Client = require('fabric-client');
const User = require('fabric-client/lib/User.js');

// Config
const fabConfig = require(`${appRoot}/organizations/producer/config/fabric-config.js`);
const CP = fabConfig.CP;
const CHAN = fabConfig.CHANNEL;
let logger = require(`${appRoot}/fabric/winston`).getLogger(module);

let client = Client.loadFromConfig(`${appRoot}/organizations/producer/config/${CP}`);

let CAService;

router.get('/', function(req, res, next) {
  res.send("GET request to 'createUser'");
});

router.post("/", (req, res) => {
    /*
curl -d '{"username":"USERNAME", "password":"PASSWORD", "roles": "ROLE", "affiliation": "Producer"}' -H "Content-Type: application/json" -X POST http://localhost:3000/producer/createUser
    */
    let user = req.body;

    const newUser = new User(user.username);
    logger.debug('Created new user object' + newUser)
    logger.debug(newUser.getSigningIdentity());

    client.initCredentialStores()
        .then(() => {
            let CACredentials = {
                username: "admin",
                password: "adminpw"
            }

            CAService = client.getCertificateAuthority()
            logger.debug('Getting CA: ' + CAService);



            logger.debug('Setting user ' + CACredentials.username + " context.");
            return client.setUserContext(CACredentials, true)
        }).then((adminUser) => {
            logger.debug('Admin: ' + adminUser)

            // The RegisterRequest object
            let roles = ['client'];
            let affiliation = "org1.department1";
            let registerRequest = {
                enrollmentID: user.username,
                enrollmentSecret : user.password,
                roles: roles,
                affiliation: affiliation
            }

            logger.debug('Register request: ' + registerRequest.enrollmentID + ", " + registerRequest.affiliation);

            return CAService.register(registerRequest, adminUser)
        }).then((enrollSecret) => {
            logger.debug('Registered ' + user.username + " successfully.")
           
            // The EnrollmentRequest object
            let enrollmentRequest = {
                enrollmentID: user.username,
                enrollmentSecret: enrollSecret
            }
            newUser._enrollmentSecret = enrollSecret;
            console.log(enrollSecret)
            logger.debug('EnrollmentRequest: ' + JSON.stringify(enrollmentRequest));

            return CAService.enroll(enrollmentRequest);
        }).then((enrollment) => {

            logger.debug('Enrollment successful ' + user.username)
            logger.debug('Enrollment response: ' + enrollment)
            newUser.setRoles(['client']);
            newUser.setAffiliation("org1.department1");

            return newUser.setEnrollment(enrollment.key, enrollment.certificate, client.getMspid());
        }).then(() => {
            logger.debug(newUser.isEnrolled()); 
            logger.info('User created: ' + newUser);
            return client.setUserContext(newUser, false);
        }).then(() => {
            res.send("Success!\n");
        }).catch((err) =>{
            logger.error("Failed to create user!");
            logger.error(err);
            res.send("Fail!");
            throw err;
        })
});
module.exports = router;