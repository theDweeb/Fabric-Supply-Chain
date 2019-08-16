import React, { Component } from 'react';

class BuyGas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seller: '',
            volume: '',
            deliverypoints: ''
        }
    }

    onSellerChange = (event) => {
        this.setState({ seller: event.target.value });
    }

    onVolumeChange = (event) => {
        this.setState({ volume: event.target.value })
    }

    onDeliveryChange = (event) => {
        this.setState({ deliverypoints: event.target.value })
    }

    onSubmit = () => {
        fetch(`http://localhost:3000/${this.props.activeOrg}/chaincode/invoke`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                org: this.props.activeOrg,
                id: "admin",
                fcn: "initBuySell",
                args: [this.props.activeOrg,this.state.seller,new Date(),this.state.volume, this.state.deliverypoints],
                CCName: "mycc",
                channelName: "mychannel"
            })
        })
            .then(response => response.json())
            .then(data => {
                alert(`${data.message}\n
                Gas bought: ${this.state.volume}\n
                Seller: ${this.state.seller}\n
                Delivery Points: ${this.state.deliverypoints}`);
            })
    }

    render() {
        return (
            <article className="br3 background b--black-10 w-100 w-50-m w-25-l mw6 shadow-4 center">
                <main className=" black-80 ma5">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0 tc navy">Buy/Sell Agreement</legend>
                            <div className="mt3">
                                <label className="b db fw6 lh-copy f6 dark-blue tc" htmlFor="buyer">Buyer<span className="b red">(YOU)</span></label>
                                <input
                                    className="pa2 input-reset  bg-transparent hover-bg-light-blue ba dark-blue hover-white w-100"
                                    type="text"
                                    name="buyer"
                                    id="buyer"
                                    value={this.props.activeOrg}
                                    readOnly />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6 dark-blue tc" htmlFor="seller">Seller</label>
                                <input
                                    onChange={this.onSellerChange}
                                    className="pa2 input-reset  bg-transparent hover-bg-light-blue ba dark-blue hover-white w-100"
                                    type="text"
                                    name="seller"
                                    id="seller"
                                    placeholder="Enter Seller Name" />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6 dark-blue tc" htmlFor="gasvolume">Gas Volume</label>
                                <input
                                    onChange={this.onVolumeChange}
                                    className="pa2 input-reset  bg-transparent hover-bg-light-blue ba dark-blue hover-white w-100"
                                    type="text"
                                    name="gasvolume"
                                    id="gasvolume"
                                    placeholder="Enter Gas Volume Amount" />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6 dark-blue tc" htmlFor="deliverypoints">Delivery Points</label>
                                <input
                                    onChange={this.onDeliveryChange}
                                    className="pa2 input-reset  bg-transparent hover-bg-light-blue ba dark-blue hover-white w-100"
                                    type="text"
                                    name="deliverypoints"
                                    id="deliverypoints"
                                    placeholder="Enter Delivery Points" />
                            </div>
                        </fieldset>
                        <div className="center">
                            <input
                                onClick={this.onSubmit}
                                className="b ph3 pv2 input-reset ba b--dark-blue bg-transparent grow pointer f6 dib navy"
                                type="submit"
                                value="Submit" />
                        </div>
                    </div>
                </main>
            </article>
        )
    }
}

export default BuyGas;
