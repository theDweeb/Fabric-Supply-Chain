import React, { Component } from 'react';
import './MainNav.css'

class MainNav extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        if (this.props.signedIn === false) {
            return (
                <nav className="dt ma0 bb dark-blue w-100 border-box pa3 ph5-ns shadow-5">
                    <ul className="dtc v-mid w-75 tl">
                        <li
                            className="link dim dark-blue fw4 f6 f5-ns dib mr3 mr4-ns pointer">EnergyXchain</li>
                    </ul>
                    <ul className="dtc v-mid w-75 tr">
                        <li className="link dim light-gray f6 f5-ns dib mr3 mr4-ns pointer" title="About">About</li>
                        <li className="link dim light-gray f6 f5-ns dib pointer" title="Register">Register</li>
                    </ul>
                </nav>
            )
        } else {
            return (
                <nav className="dt ma0 bb dark-blue w-100 border-box pa3 ph5-ns shadow-5">
                    <ul className="dtc v-mid w-75 tl">
                        <li
                            onClick={this.props.onSignOut}
                            className="link dim dark-blue fw4 f6 f5-ns dib mr3 mr4-ns pointer">EnergyXchain</li>
                    </ul>
                    <ul className="dropdown dtc v-mid">
                        <li className="dropbtn dim white fw4 f6 f5-ns dib pointer b">Smart Contracts</li>
                        <div className="dropdown-content center">
                            <li
                                onClick={() => this.props.onRouteChange('buygas')}
                                className="link dim dark-blue f6 f5-ns dib pointer ph4 pv3 center"
                                value="buySell">Buy Gas</li>
                            <li
                                onClick={() => this.props.onRouteChange('sellgas')}
                                className="link dim dark-blue f6 f5-ns dib pointer ph4 pv3 center"
                                value="buySell">Sell Gas</li>
                            <li className="link dim dark-blue f6 f5-ns dib pointer ph4 pv3 center" value="shipping">Shipping</li>
                        </div>
                    </ul>
                    <ul className="dropdown dtc v-mid">
                        <li className="dropbtn dim white fw4 f6 f5-ns dib pointer b mr2 ph4">Admin</li>
                        <div className="dropdown-content center">
                            <li
                                onClick={() => this.props.onRouteChange('createUser')}
                                className="link dim dark-blue f6 f5-ns dib pointer ph4 pv3 center mr2"
                                value="buySell">Create User</li>

                            <li className="link dim dark-blue f6 f5-ns dib pointer ph4 pv3 center" value="createchannel">Create Channel</li>
                            <li className="link dim dark-blue f6 f5-ns dib pointer ph4 pv3 center" value="joinchannel">Join Channel</li>
                            <li 
                            onClick={() => this.props.onRouteChange('uploadCC')}
                            className="link dim dark-blue f6 f5-ns dib pointer ph4 pv3 center" 
                            value="uploadCC">Upload Chaincode</li>
                            <li className="link dim dark-blue f6 f5-ns dib pointer ph4 pv3 center" value="installCC">Install Chaincode</li>
                            <li className="link dim dark-blue f6 f5-ns dib pointer ph4 pv3 center" value="instantiateCC">Instantiate Chaincode</li>
                        </div>
                    </ul>
                </nav>
            )
        }

    }
}

export default MainNav;
