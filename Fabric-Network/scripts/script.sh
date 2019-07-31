#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Build your first network (BYFN) end-to-end test"
echo
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
TIMEOUT="$4"
VERBOSE="$5"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${LANGUAGE:="golang"}
: ${TIMEOUT:="10"}
: ${VERBOSE:="false"}
LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
COUNTER=1
MAX_RETRY=10

#CC_SRC_PATH="github.com/chaincode/chaincode_example02/go/"
CC_SRC_PATH="github.com/chaincode/CC_BuySell/"

if [ "$LANGUAGE" = "node" ]; then
	CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/chaincode_example02/node/"
fi

if [ "$LANGUAGE" = "java" ]; then
	CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/chaincode_example02/java/"
fi

echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

createChannel() {
	setGlobals 0 1

	if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
                set -x
		peer channel create -o orderer.energyXchain.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx >&log.txt
		res=$?
                set +x
	else
				set -x
		peer channel create -o orderer.energyXchain.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
		res=$?
				set +x
	fi
	cat log.txt
	verifyResult $res "Channel creation failed"
	echo "===================== Channel '$CHANNEL_NAME' created ===================== "
	echo
}

joinChannel () {
	for org in 1 2 3 4; do
	    for peer in 0 1; do
		joinChannelWithRetry $peer $org
		echo "===================== peer${peer}.org${org} joined channel '$CHANNEL_NAME' ===================== "
		sleep $DELAY
		echo
	    done
	done
}

## Create channel
echo "Creating channel..."
createChannel

## Join all the peers to the channel
echo "Having all peers join the channel..."
joinChannel

## Set the anchor peers for each org in the channel
echo "Updating anchor peers for PRODUCER..."
updateAnchorPeers 0 1
echo "Updating anchor peers for CONSUMER..."
updateAnchorPeers 0 2
echo "Updating anchor peers for SHIPPER..."
updateAnchorPeers 0 3
echo "Updating anchor peers for TRANSPORTER..."
updateAnchorPeers 0 4

## Install chaincode on peer0.org1 and peer0.org2
echo "Installing chaincode on peer0.producer..."
installChaincode 0 1
echo "Installing chaincode on peer1.producer..."
installChaincode 1 1

echo "Install chaincode on peer0.consumer..."
installChaincode 0 2
echo "Install chaincode on peer1.consumer..."
installChaincode 1 2

echo "Installing chaincode on peer0.shipper..."
installChaincode 0 3
echo "Installing chaincode on peer1.shipper..."
installChaincode 1 3

echo "Install chaincode on peer0.transporter..."
installChaincode 0 4
echo "Install chaincode on peer1.transporter..."
installChaincode 1 4

# Instantiate chaincode on peer0.org2
echo "Instantiating chaincode on peer0.consumer..."
instantiateChaincode 0 2

# Query chaincode on peer0.org1
# echo "Querying chaincode on peer0.org1..."
# chaincodeQuery 0 1 10

# echo "Querying chaincode on peer0.org1..."
# chaincodeQuery 0 2 10

# echo "Querying chaincode on peer0.org1..."
# chaincodeQuery 0 3 10

# echo "Querying chaincode on peer0.org1..."
# chaincodeQuery 0 4 10

# Invoke chaincode on peer0.org1 and peer0.org2
# echo "Sending invoke transaction on peer0.org1 peer0.org2..."
# chaincodeInvoke 0 1 0 2 0 3 0 4

# Query on chaincode on peer1.org2, check if the result is 90
# echo "Querying chaincode on peer1.org2..."
# chaincodeQuery 1 2 20

echo
echo "========= All GOOD, BYFN execution completed =========== "
echo

echo
echo "==== Don't forget to remove /hfc-kvs and /hfc-cvs from SDK directory ===="
echo 

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0
