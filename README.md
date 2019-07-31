# Hyperledger Fabric Supply Chain Network
### Four (4) Organizations, each with (atleast) two (2) peers.

# Prerequisites:
- **Node.js version 8.9.0+ (but not higher than 9.0)**
- **Docker and Docker Compose (latest)**
- **Golang (latest) with $GOPATH set**
- **[Chaincode](https://www.github.com/EnergyXChain/CC_BuySell "Buy Sell CC") installed to $GOPATH/src/github.com/EnergyXChain/chaincode**

# Fabric-Network
## Bringing up the network.
Make sure you are in the Fabric-Network directory.
``` bash
cd Fabric-Network
```
### Calling the byfn.sh script with various options:
``` bash
./byfn.sh up -s <couchdb> -o <etcdraft | kafka | solo>
```
**Example bringing up a network using couchdb and etcdraft ordering service**
``` bash
./byfn.sh up -s couchdb -o etcdraft
```

### Once the network is up you will need to start the Certificate Authorities (CA)
``` bash
docker-compose -f docker-compose-ca.yaml up
```
**Add -d at the end of the above command to run in detached mode**

# Node-Express-SDK
## Starting the node app + SDK
Make sure you are in the Fabric-Node-SDK directory
``` bash
cd ../Fabric-Node-SDK
```
### Install the node modules
**Note: I am using node version 8.12.0 with npm version 6.4.1** 

**You cannot use a node version above 9.0!!!**
``` bash
npm install
```

### Starting the node app server
``` bash
npm run dev
```
**The server will started on port 3000 (localhost:3000)**

**This uses a module called 'nodemon' to restart the server whenever a change is made**

### Using the API
#### Send POST requests to the various endpoints:
- **/ORGNAME/users/create**
``` JSON
{
	"id": "Steve",
	"secret": "12345",
	"org": "ORGNAME",
	"roles": ["dev"],
	"affiliation": "org1.department1"
}
```

- **/ORGNAME/users/search**
```JSON
{
	"org": "ORGNAME", 
	"id": "Steve"
}
```

- **/ORGNAME/chaincode/install**
```JSON
{
	"org": "ORGNAME",
	"peers": ["peer0.ORGNAME.energyXchain.com", "peer1.ORGNAME.energyXchain.com"],
	"CCPath": "github.com/EnergyXChain/chaincode/sample/",
	"CCName": "sampleCC",
	"CCVersion":"1.0",
	"CCType":"golang"
}
```

- **/ORGNAME/chaincode/instantiate**
```JSON
{
	"org": "ORGNAME",
	"peers": ["peer0.ORGNAME.energyXchain.com", "peer1.ORGNAME.energyXchain.com"],
	"channelName": "mychannel",
	"CCName": "sampleCC",
	"CCVersion":"1.0",
	"CCType":"golang",
	"fcn": "init",
	"args": ["a","50", "b", "100"]
}
```

- **/ORGNAME/chaincode/invoke**
```JSON
{
	"org": "ORGNAME", 
	"id": "Steve", 
	"fcn": "invoke", 
	"args": ["a", "b", "5"],
	"CCName": "sampleCC",
	"channelName": "mychannel"
}
```

- **/ORGNAME/chaincoke/query**
```
{
	"org": "ORGNAME", 
	"id": "Steve", 
	"fcn": "query", 
	"args": ["a"],
	"CCName": "sampleCC",
	"channelName": "mychannel"
}
```

- **/ORGNAME/channel/create**
```JSON
{
	"org": "ORGNAME", 
	"ordererName": "orderer.energyXchain.com",
	"channelConfigPath": "../../Fabric-Network/channel-artifacts/channel1.tx",
	"channelName": "mychannel1"
}
```

**/ORGNAME/channel/join**
```JSON
{
	"org": "ORGNAME", 
	"ordererName": "orderer.energyXchain.com",
	"channelName": "mychannel1",
	"peers": ["peer0.ORGNAME.energyXchain.com"]
}
```
