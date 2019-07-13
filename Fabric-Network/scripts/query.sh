#!bin/bash
export CHANNEL_NAME=mychannel
peer chaincode query -C $CHANNEL_NAME -n mycc -c '{"Args":["query","a"]}'