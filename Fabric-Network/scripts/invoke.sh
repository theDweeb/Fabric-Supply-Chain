#!bin/bash
export CORE_PEER_TLS_ENABLED=true
export CHANNEL_NAME=mychannel
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/energyXchain.com/orderers/orderer.energyXchain.com/msp/tlscacerts/tlsca.energyXchain.com-cert.pem
export PEER0_ORG1_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/producer.energyXchain.com/peers/peer0.producer.energyXchain.com/tls/ca.crt
export PEER0_ORG2_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/consumer.energyXchain.com/peers/peer0.consumer.energyXchain.com/tls/ca.crt
export PEER0_ORG3_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/shipper.energyXchain.com/peers/peer0.shipper.energyXchain.com/tls/ca.crt
export PEER0_ORG4_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/transporter.energyXchain.com/peers/peer0.transporter.energyXchain.com/tls/ca.crt

peer chaincode invoke -o orderer.energyXchain.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n mycc -c '{"Args":["invoke","a","b","10"]}'


peer chaincode invoke -o orderer.energyXchain.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n mycc --peerAddresses peer0.producer.energyXchain.com:7051 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses peer0.consumer.energyXchain.com:9051 --tlsRootCertFiles $PEER0_ORG2_CA --peerAddresses peer0.shipper.energyXchain.com:11051 --tlsRootCertFiles $PEER0_ORG3_CA --peerAddresses peer0.transporter.energyXchain.com:13051 --tlsRootCertFiles $PEER0_ORG4_CA -c '{"Args":["invoke","a","b","10"]}'
