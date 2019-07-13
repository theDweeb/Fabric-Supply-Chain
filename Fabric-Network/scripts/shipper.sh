#!/bin/bash

export CORE_PEER_LOCALMSPID=ShipperMSP
export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/shipper.energyXchain.com/peers/peer0.shipper.energyXchain.com/tls/server.crt
export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/shipper.energyXchain.com/peers/peer0.shipper.energyXchain.com/tls/server.key
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/shipper.energyXchain.com/peers/peer0.shipper.energyXchain.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/shipper.energyXchain.com/users/Admin@shipper.energyXchain.com/msp