package main

type Resident struct {
	Alias     string `json:"alias"`
	Cash      string `json:"cash"`
	Energy    string `json:"energy"`
	FirstName string `json:"firstName"`
	ID        string `json:"id"`
	LastName  string `json:"lastName"`
	Tokens    string `json:"tokens"`
	Type      string `json:"type"`
}

type Token struct {
	ID        string `json:"id"`
	Owner     string `json:"owner"`
	OwnerType string `json:"ownerType"`
	Value     float64 `json:"value,string"`
}

type Energy struct {
	ID        string  `json:"id"`
	Owner     string  `json:"owner"`
	OwnerType string  `json:"ownerType"`
	Units     string  `json:"units"`
	Value     float64 `json:"value,string"`
}


type Cash struct {
	Currency  string  `json:"currency"`
	ID        string  `json:"id"`
	Owner     string  `json:"owner"`
	OwnerType string  `json:"ownerType"`
	Value     float64 `json:"value,string"`
}

type EnergyTokenTransaction struct {
	EnergyDec     string  `json:"energyDec"`
	EnergyInc     string  `json:"energyInc"`
	Rate          float64 `json:"rate,string"`
	Timestamp     string  `json:"timestamp"`
	TokenDec      string  `json:"tokenDec"`
	TokenInc      string  `json:"tokenInc"`
	TransactionID string  `json:"transactionId"`
	Value         float64 `json:"value,string"`
}
