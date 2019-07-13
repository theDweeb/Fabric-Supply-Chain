require('dotenv').config();
let config = require('./config')
//let CP = config.CP
let CP = 'local.json'

let CHANNEL = {
    "chanName":"foo",
    "ccName":"mycc",
    "ccVer":"v1"
};

module.exports =  {CP, CHANNEL};