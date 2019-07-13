#!/bin/bash

export CORE_PEER_LOCALMSPID=ConsumerMSP
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/consumer.energyXchain.com/peers/peer0.consumer.energyXchain.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/consumer.energyXchain.com/peers/peer0.consumer.energyXchain.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/consumer.energyXchain.com/peers/peer0.consumer.energyXchain.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/consumer.energyXchain.com/users/Admin@consumer.energyXchain.com/msp