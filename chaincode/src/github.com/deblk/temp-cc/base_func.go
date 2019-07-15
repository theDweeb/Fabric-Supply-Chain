package main

import (
	"encoding/json"
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func(this *EnergyTrade) CreateCompKey(stub shim.ChaincodeStubInterface, objType string, attr []string) (string, error){
	return stub.CreateCompositeKey(objType, attr)
}

func (this *EnergyTrade) Get(stub shim.ChaincodeStubInterface, k string, entity interface{}) (bool, error){
	logger.Debug("Get: enter")
	defer logger.Debug("Get: exit")

	logger.Debug("Getting from store with key: %q", k)

	entityBytes, err := stub.GetState(k)
	if err!=nil{
		return false, err
	}

	if entityBytes == nil {
		logger.Debugf("Get: key %q not found", k)
		return false, nil
	}

	logger.Debugf("Get: Got raw data: %s", entityBytes)
	err = json.Unmarshal(entityBytes, entity)
	if err != nil{
		logger.Errorf("Get: Unmarshall failed: %s", err)
		return false, err
	}
	return true, nil
}

func (this *EnergyTrade) Put(stub shim.ChaincodeStubInterface, k string, entity interface{}) error{
	logger.Debug("Put: enter")
	logger.Debugf("Put: storing for key: %s", k)
	defer logger.Debug("Put: exit")

	entityBytes, err := json.Marshal(entity)
	if err != nil{
		return err
	}
	logger.Debugf("Put: marshalled data: %q", entityBytes)
	return stub.PutState(k, entityBytes)
}