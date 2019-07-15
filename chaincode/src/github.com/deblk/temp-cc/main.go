package main

import (
	. "github.com/deblk/temp-cc/constant"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type EnergyTrade struct {
}

var logger = shim.NewLogger("EnergyTradeMain")

func (this *EnergyTrade) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("Init: enter")
	defer logger.Info("Init: exit")
	return shim.Success(nil)
}

func (this *EnergyTrade) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("Invoke: enter")
	defer logger.Info("Invoke: exit")

	fcn, args := stub.GetFunctionAndParameters()
	logger.Debugf("Invoke function: %s", fcn)

	switch fcn {
	case CREATE_CASH:
		logger.Debugf("Calling func : %s", fcn)
		return this.CreateCash(stub, args[0], args[1])
	case CREATE_ENERGY:
		logger.Debugf("Calling func : %s", fcn)
		return this.CreateEnergy(stub, args[0], args[1])
	case CREATE_RESIDENT:
		logger.Debugf("Calling func : %s", fcn)
		return this.CreateResident(stub, args[0], args[1])
	case CREATE_TOKEN:
		logger.Debugf("Calling func : %s", fcn)
		return this.CreateToken(stub, args[0], args[1])
	case GET_CASH:
		logger.Debugf("Calling func : %s", fcn)
		return this.RetrieveCash(stub, args[0])
	case GET_TOKEN:
		logger.Debugf("Calling func : %s", fcn)
		return this.RetrieveToken(stub, args[0])
	case GET_ENERGY:
		logger.Debugf("Calling func : %s", fcn)
		return this.RetrieveEnergy(stub, args[0])
	case GET_RESIDENT:
		logger.Debugf("Calling func : %s", fcn)
		return this.RetrieveResident(stub, args[0])
	case TRADE:
		logger.Debugf("Calling func : %s", fcn)
		return this.EnergyTokenTransaction(stub, args[0])
	case GET_ALL_TRAN:
		logger.Debugf("Calling func : %s", fcn)
		return this.GetAllTransactions(stub)
	}
	return shim.Error("Invalid Function: " + fcn)
}

func main() {
	err := shim.Start(new(EnergyTrade))
	if err != nil {
		logger.Error("Error starting EnergyTrade CC: %s", err)
	}

}
