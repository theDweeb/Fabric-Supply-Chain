package main

import "github.com/hyperledger/fabric/core/chaincode/shim"

func (this *EnergyTrade) ProcessTransaction(stub shim.ChaincodeStubInterface, tr *EnergyTokenTransaction) error{
	logger.Debug("ProcessTransaction: Enter")
	defer logger.Debug("ProcessTransaction: Exit")


	var tokensChange = tr.Rate * tr.Value
	logger.Debugf("Tokens change is %d with rate at %d and value at %d", tokensChange, tr.Rate, tr.Value)

	//get all assets

	energyBuyerTokenAsset, err := this.GetToken(stub, []string{tr.TokenDec}...)
	if err != nil{
		logger.Errorf("GetToken: failed: %s", err)
		return err
	}
	energyBuyerEnergyAsset, err := this.GetEnergy(stub, []string{tr.EnergyInc}...)
	if err != nil{
		logger.Errorf("GetEnergy: failed: %s", err)
		return err
	}
	energySellerTokenAsset, err := this.GetToken(stub, []string{tr.TokenInc}...)
	if err != nil{
		logger.Errorf("GetToken: failed: %s", err)
		return err
	}
	energySellerEnergyAsset, err := this.GetEnergy(stub, []string{tr.EnergyDec}...)
	if err != nil{
		logger.Errorf("GetEnergy: failed: %s", err)
		return err
	}

	energyBuyerTokenAsset.Value = energyBuyerTokenAsset.Value - tokensChange
	energySellerTokenAsset.Value = energySellerTokenAsset.Value + tokensChange
	energyBuyerEnergyAsset.Value = energyBuyerEnergyAsset.Value + tr.Value
	energySellerEnergyAsset.Value = energySellerEnergyAsset.Value - tr.Value

	//put back all asset

	err = this.AddEnergy(stub, energyBuyerEnergyAsset)
	if err !=nil{
		logger.Errorf("AddEnergy: failed: %s", err)
		return err
	}
	err = this.AddEnergy(stub, energySellerEnergyAsset)
	if err !=nil{
		logger.Errorf("AddEnergy: failed: %s", err)
		return err
	}
	err = this.AddToken(stub, energyBuyerTokenAsset)
	if err !=nil{
		logger.Errorf("AddToken: failed: %s", err)
		return err
	}
	err = this.AddToken(stub, energySellerTokenAsset)
	if err !=nil{
		logger.Errorf("AddToken: failed: %s", err)
		return err
	}
	txid := stub.GetTxID()
	logger.Debugf("End of transaction, txID is %s",txid)

	tr.TransactionID = txid
	err = this.AddTransaction(stub, tr)
	if err!=nil{
		logger.Debugf("adding transaction error: %v", err)
		return err
	}

	return nil
}
