import React from 'react'
import './ContractForm.css'

class ContractForm extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      SellerName: '',
      BuyerName: '',
      GasAmount: '',
      DeliveryPoints: ''
    }
  }

  onSellerChange = (event) => {
    this.setState({ SellerName: event.target.value })
  }
  onBuyerChange = (event) => {
    this.setState({ BuyerName: event.target.value })
  }
  onGasChange = (event) => {
    this.setState({ GasAmount: event.target.value })
  }
  onDeliveryChange = (event) => {
    this.setState({ DeliveryPoints: event.target.value })
  }

  onSubmit = () => {
    fetch(`http://localhost:3000/${this.state.BuyerName}/chaincode/invoke`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        org: this.state.BuyerName,
        id: "admin",
        fcn: "initBuySell",
        args: [this.state.BuyerName,this.state.SellerName,new Date(),this.state.GasAmount, this.state.DeliveryPoints],
        CCName: "mycc",
        channelName: "mychannel"
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.props.onResultsChange(data);
      this.props.onRouteChange('results');
    })
  }

  render() {
    const { onRouteChange } = this.props;
    return (
      <main className="pa2 black-80">
        <div className="measure center shadow-5 pa4 br3 pattern">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f4 fw6 ph0 mh0">Buy / Sell Agreement</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="SellerName">Seller Name</label>
              <input
                onChange={this.onSellerChange}
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="text"
                name="SellerName"
                id="SellerName"
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="BuyerName">Buyer Name</label>
              <input 
              onChange={this.onBuyerChange}
              className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
              type="text" 
              name="BuyerName" 
              id="BuyerName" 
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="GasAmount">Gas Amount</label>
              <input 
              onChange={this.onGasChange}
              className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
              type="text" 
              name="GasAmount" 
              id="GasAmount" />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="DeliveryPoints">Delivery Points</label>
              <input 
              onChange={this.onDeliveryChange}
              className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
              type="text" 
              name="DeliveryPoints" 
              id="DeliveryPoints" />
            </div>

          </fieldset>
          <div className="">
            <input
              onClick={this.onSubmit}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Submit" />
          </div>
        </div>
      </main>
    );
  }

}

export default ContractForm;