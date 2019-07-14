package main

import (
	. "github.com/deblk/temp-cc/constant"
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

//ADD

func (t *EnergyTrade) AddResident(stub shim.ChaincodeStubInterface, r *Resident) error {
	logger.Info("Resident Add: enter")
	logger.Debugf("Resident Add: PKs = %+v", r)
	defer logger.Info("Resident Add: exit")

	k, err := t.CreateCompKey(stub, RES_TYPE, []string{r.ID})

	if err != nil {
		return err
	}
	err = t.Put(stub, k, r)
	if err != nil {
		return err
	}
	return nil
}

func (t *EnergyTrade) AddToken(stub shim.ChaincodeStubInterface, tok *Token) error {
	logger.Info("Token Add: enter")
	logger.Debugf("Token Add: PKs = %+v", tok)
	defer logger.Info("Token Add: exit")

	k, err := t.CreateCompKey(stub, TOK_TYPE, []string{tok.ID})

	if err != nil {
		return err
	}
	err = t.Put(stub, k, tok)
	if err != nil {
		return err
	}
	return nil
}

func (t *EnergyTrade) AddEnergy(stub shim.ChaincodeStubInterface, e *Energy) error {
	logger.Info("Energy Add: enter")
	logger.Debugf("Energy Add: PKs = %+v", e)
	defer logger.Info("Energy Add: exit")

	k, err := t.CreateCompKey(stub, ENERGY_TYPE, []string{e.ID})

	if err != nil {
		return err
	}
	err = t.Put(stub, k, e)
	if err != nil {
		return err
	}
	return nil
}

func (t *EnergyTrade) AddCash(stub shim.ChaincodeStubInterface, c *Cash) error {
	logger.Info("Cash Add: enter")
	logger.Debugf("Cash Add: PKs = %+v", c)
	defer logger.Info("Cash Add: exit")

	k, err := t.CreateCompKey(stub, CASH_TYPE, []string{c.ID})

	if err != nil {
		return err
	}
	err = t.Put(stub, k, c)
	if err != nil {
		return err
	}
	return nil
}

func (t *EnergyTrade) AddTransaction(stub shim.ChaincodeStubInterface, tr *EnergyTokenTransaction) error {
	logger.Info("Cash Add: enter")
	logger.Debugf("Cash Add: PKs = %+v", tr)
	defer logger.Info("Cash Add: exit")

	k, err := t.CreateCompKey(stub, TRADE, []string{tr.TransactionID})

	if err != nil {
		return err
	}
	err = t.Put(stub, k, tr)
	if err != nil {
		return err
	}
	return nil
}

//Get

func (t *EnergyTrade) GetResident(stub shim.ChaincodeStubInterface, pks ...string) (*Resident, error) {
	logger.Info("GetResident: enter")
	logger.Debugf("GetResident: PKs = %s", pks)
	defer logger.Info("GetResident: exit")

	var r = new(Resident)

	k, err := t.CreateCompKey(stub, RES_TYPE, pks)
	if err != nil {
		return nil, err
	}
	found, err := t.Get(stub, k, r)
	if err != nil {
		return nil, err
	}
	if !found {
		return nil, nil
	}
	logger.Debugf("Found entity: %v", found)

	return r, nil
}

func (t *EnergyTrade) GetEnergy(stub shim.ChaincodeStubInterface, pks ...string) (*Energy, error) {
	logger.Info("GetEnergy: enter")
	logger.Debugf("GetEnergy: PKs = %s", pks)
	defer logger.Info("GetEnergy: exit")

	var e = new(Energy)

	k, err := t.CreateCompKey(stub, ENERGY_TYPE, pks)
	if err != nil {
		return nil, err
	}
	logger.Debug("Key " + k)
	found, err := t.Get(stub, k, e)
	if err != nil {
		return nil, err
	}
	if !found {
		return nil, nil
	}
	logger.Debugf("Found entity: %v", found)

	return e, nil
}

func (t *EnergyTrade) GetCash(stub shim.ChaincodeStubInterface, pks ...string) (*Cash, error) {
	logger.Info("GetCash: enter")
	logger.Debugf("GetCash: PKs = %s", pks)
	defer logger.Info("GetCash: exit")

	var c = new(Cash)

	k, err := t.CreateCompKey(stub, CASH_TYPE, pks)
	if err != nil {
		return nil, err
	}
	found, err := t.Get(stub, k, c)
	if err != nil {
		return nil, err
	}
	if !found {
		return nil, nil
	}
	logger.Debugf("Found entity: %v", found)

	return c, nil
}

func (t *EnergyTrade) GetToken(stub shim.ChaincodeStubInterface, pks ...string) (*Token, error) {
	logger.Info("GetToken: enter")
	logger.Debugf("GetToken: PKs = %s", pks)
	defer logger.Info("GetToken: exit")

	var tok = new(Token)

	k, err := t.CreateCompKey(stub, TOK_TYPE, pks)
	if err != nil {
		return nil, err
	}
	found, err := t.Get(stub, k, tok)
	if err != nil {
		return nil, err
	}
	if !found {
		return nil, nil
	}
	logger.Debugf("Found entity: %v", found)

	return tok, nil
}
