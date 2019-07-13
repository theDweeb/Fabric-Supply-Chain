#!/bin/bash

export CORE_PEER_LOCALMSPID=TransporterMSP
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/transporter.energyXchain.com/peers/peer0.transporter.energyXchain.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/transporter.energyXchain.com/peers/peer0.transporter.energyXchain.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/transporter.energyXchain.com/peers/peer0.transporter.energyXchain.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/transporter.energyXchain.com/users/Admin@transporter.energyXchain.com/msp