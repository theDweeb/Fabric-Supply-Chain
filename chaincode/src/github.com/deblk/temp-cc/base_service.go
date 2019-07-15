package main

import (
	"bytes"
	"encoding/json"
	"errors"

	. "github.com/deblk/temp-cc/constant"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

//Create

func (this *EnergyTrade) CreateResident(stub shim.ChaincodeStubInterface, resId string, resJsonStr string) pb.Response {
	logger.Info("createResident: enter")
	defer logger.Info("createResident: exit")

	logger.Debug("Resident Received : " + resJsonStr)

	if resId == "" {
		var m = "createResident primary key is empty"
		logger.Error(m)
		return shim.Error(errors.New(m).Error())
	}
	var r Resident

	err := json.Unmarshal([]byte(resJsonStr), &r)
	if err != nil {
		logger.Error("createResident: Error during json.Unmarshal: ", err)
		return shim.Error(err.Error())
	}

	err = this.AddResident(stub, &r)

	if err != nil {
		logger.Error("createResident: Error while adding resident %s", err)
		return shim.Error(errors.New("createResident: Error while adding resident").Error())
	}

	return shim.Success(nil)
}

func (this *EnergyTrade) CreateToken(stub shim.ChaincodeStubInterface, tokenId string, tokenJsonStr string) pb.Response {
	logger.Info("createToken: enter")
	defer logger.Info("createToken: exit")

	logger.Debug("Token Received : " + tokenJsonStr)

	if tokenId == "" {
		var m = "createToken primary key is empty"
		logger.Error(m)
		return shim.Error(errors.New(m).Error())
	}
	var tok Token

	err := json.Unmarshal([]byte(tokenJsonStr), &tok)
	if err != nil {
		logger.Error("createToken: Error during json.Unmarshal: ", err)
		return shim.Error(err.Error())
	}

	err = this.AddToken(stub, &tok)

	if err != nil {
		logger.Error("createToken: Error while adding Token %s", err)
		return shim.Error(errors.New("createToken: Error while adding Token").Error())
	}

	return shim.Success(nil)
}

func (this *EnergyTrade) CreateEnergy(stub shim.ChaincodeStubInterface, EnergyId string, EnergyJsonStr string) pb.Response {
	logger.Info("createEnergy: enter")
	defer logger.Info("createEnergy: exit")

	logger.Debug("Energy Received : " + EnergyJsonStr)

	if EnergyId == "" {
		var m = "createEnergy primary key is empty"
		logger.Error(m)
		return shim.Error(errors.New(m).Error())
	}
	var e Energy

	err := json.Unmarshal([]byte(EnergyJsonStr), &e)
	if err != nil {
		logger.Error("createEnergy: Error during json.Unmarshal: ", err)
		return shim.Error(err.Error())
	}

	err = this.AddEnergy(stub, &e)

	if err != nil {
		logger.Error("createEnergy: Error while adding Energy %s", err)
		return shim.Error(errors.New("createEnergy: Error while adding Energy").Error())
	}

	return shim.Success(nil)
}

func (this *EnergyTrade) CreateCash(stub shim.ChaincodeStubInterface, CashId string, CashJsonStr string) pb.Response {
	logger.Info("createCash: enter")
	defer logger.Info("createCash: exit")

	logger.Debug("Cash Received : " + CashJsonStr)

	if CashId == "" {
		var m = "createCash primary key is empty"
		logger.Error(m)
		return shim.Error(errors.New(m).Error())
	}
	var c Cash

	err := json.Unmarshal([]byte(CashJsonStr), &c)
	if err != nil {
		logger.Error("createCash: Error during json.Unmarshal: ", err)
		return shim.Error(err.Error())
	}

	err = this.AddCash(stub, &c)

	if err != nil {
		logger.Error("createCash: Error while adding Cash %s", err)
		return shim.Error(errors.New("createCash: Error while adding Cash").Error())
	}

	return shim.Success(nil)
}

//Get

func (this *EnergyTrade) RetrieveResident(stub shim.ChaincodeStubInterface, resId string) pb.Response {
	logger.Info("RetrieveResident: enter")
	defer logger.Info("RetrieveResident: exit")

	if resId == "" {
		logger.Error("RetrieveResident resId is empty.")
		return shim.Error(errors.New("RetrieveResident resId is empty").Error())
	}

	pks := []string{resId}

	resObj, err := this.GetResident(stub, pks...)
	if err != nil {
		logger.Error("RetrieveResident: GetResident error %s", err)
		return shim.Error(err.Error())
	}

	if resObj == nil {
		logger.Error("RetrieveResident: Resident obj is null")
		return shim.Error(errors.New("RetrieveResident: Resident obj is null").Error())
	}

	jsonRes, _ := json.Marshal(resObj)
	return shim.Success([]byte(jsonRes))
}

func (this *EnergyTrade) RetrieveToken(stub shim.ChaincodeStubInterface, TokenId string) pb.Response {
	logger.Info("RetrieveToken: enter")
	defer logger.Info("RetrieveToken: exit")

	if TokenId == "" {
		logger.Error("RetrieveToken TokenId is empty.")
		return shim.Error(errors.New("RetrieveToken TokenId is empty").Error())
	}

	pks := []string{TokenId}

	TokenObj, err := this.GetToken(stub, pks...)
	if err != nil {
		logger.Error("RetrieveToken: GetToken error %s", err)
		return shim.Error(err.Error())
	}

	if TokenObj == nil {
		logger.Error("RetrieveToken: Token obj is null")
		return shim.Error(errors.New("RetrieveToken: Token obj is null").Error())
	}

	jsonToken, _ := json.Marshal(TokenObj)
	return shim.Success([]byte(jsonToken))
}

func (this *EnergyTrade) RetrieveCash(stub shim.ChaincodeStubInterface, CashId string) pb.Response {
	logger.Info("RetrieveCash: enter")
	defer logger.Info("RetrieveCash: exit")

	if CashId == "" {
		logger.Error("RetrieveCasht CashId is empty.")
		return shim.Error(errors.New("RetrieveCash CashId is empty").Error())
	}

	pks := []string{CashId}

	CashObj, err := this.GetCash(stub, pks...)
	if err != nil {
		logger.Error("RetrieveCash: GetCash error %s", err)
		return shim.Error(err.Error())
	}

	if CashObj == nil {
		logger.Error("RetrieveCash: Cash obj is null")
		return shim.Error(errors.New("RetrieveCash: Cash obj is null").Error())
	}

	jsonCash, _ := json.Marshal(CashObj)
	return shim.Success([]byte(jsonCash))
}

func (this *EnergyTrade) RetrieveEnergy(stub shim.ChaincodeStubInterface, EnergyId string) pb.Response {
	logger.Info("RetrieveEnergy: enter")
	defer logger.Info("RetrieveEnergy: exit")

	if EnergyId == "" {
		logger.Error("RetrieveEnergyEnergy EnergyId is empty.")
		return shim.Error(errors.New("RetrieveEnergy EnergyId is empty").Error())
	}

	pks := []string{EnergyId}

	EnergyObj, err := this.GetEnergy(stub, pks...)
	if err != nil {
		logger.Error("RetrieveEnergy: GetEnergy error %s", err)
		return shim.Error(err.Error())
	}

	if EnergyObj == nil {
		logger.Error("RetrieveEnergy: Energy obj is null")
		return shim.Error(errors.New("RetrieveEnergy: Energy obj is null").Error())
	}

	jsonEnergy, _ := json.Marshal(EnergyObj)
	return shim.Success([]byte(jsonEnergy))
}

func (this *EnergyTrade) EnergyTokenTransaction(stub shim.ChaincodeStubInterface, transaction string) pb.Response {
	logger.Info("EnergyTokenTransaction: enter")
	defer logger.Info("EnergyTokenTransaction: exit")

	var tr EnergyTokenTransaction

	err := json.Unmarshal([]byte(transaction), &tr)
	if err != nil {
		logger.Error("createResident: Error during json.Unmarshal: ", err)
		return shim.Error(err.Error())
	}

	logger.Debug("converted trade input to trade output %v", tr)

	err = this.ProcessTransaction(stub, &tr)
	if err != nil {
		logger.Error("Error making transaction EnergyToken")
		return shim.Error(err.Error())
	}
	logger.Debug("Energy Trade success")
	return shim.Success(nil)
}

func (t *EnergyTrade) GetAllTransactions(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("GetAllTransactions: enter")
	defer logger.Info("GetAllTransactions: exit")

	transactionIterator, err := stub.GetStateByPartialCompositeKey(TRADE, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer transactionIterator.Close()

	var buffer bytes.Buffer
	buffer.WriteString("[")
	commaHelper := false
	for transactionIterator.HasNext() {
		item, err := transactionIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		if commaHelper == true {
			buffer.WriteString(",")
		}
		buffer.WriteString(string(item.Value))
		commaHelper = true
		logger.Debugf("Iterator: %+v", item)
	}
	buffer.WriteString("]")

	var transactions []EnergyTokenTransaction
	err = json.Unmarshal(buffer.Bytes(), &transactions)
	if err != nil {
		logger.Error("Unmarshal transaction array failed")
		return shim.Error(err.Error())
	}

	transactionsAsJson, _ := json.Marshal(transactions)

	return shim.Success([]byte(transactionsAsJson))

}
