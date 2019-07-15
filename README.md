#Hyperledger Fabric Supply Chain Network

### Step 1
#### Start the network with couchDB
```
cd Fabric-Network
./byfn.sh up -s couchdb
```
*Wait for E2E test to finish*
### Step 2
#### Start the CA's for each organization
```
docker-compose -f docker-compose-ca.yaml up -d
```
*You can remove the **-d** above if you want to read logs (you will need to open another terminal)*
### Step 3
#### Start the node app + SDK
```
cd ../Fabric-Node-SDK
node ./bin/www
```
*This will start the server on port 3000*
*There are only two routes at the moment:*
  ###### /producer/index
  ###### /producer/query
  
### Step 4
*open a new terminal*
```
curl -X "http://localhost:3000/producer/query"
```
*This will add a user hard coded on the query endpoint*
*The name is misleading but I am just using it to test at the moment*
