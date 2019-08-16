import React, { Component } from 'react';
import Tilt from 'react-tilt';
import logo from './logo.png'

class Logo extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { activeOrg } = this.props
        if (activeOrg === 'producer') {
            return (
                <div>
                    <Tilt className="Tilt ma2 pointer bg-navy br3 shadow-5" options={{ max: 25 }} style={{ height: 150, width: 100 }} >
                        <div className="Tilt-inner bb white">
                            <p className="center ph3 b dim white fw6 f6 f5-ns dib mr3 mr4-ns">Producer</p>
                        </div>
                        <div className="Tilt-inner">
                            <img style={{ height: '100px', width: '100px' }} src={logo} alt="logo" />
                        </div>
                    </Tilt>
                </div>
            )
        } else if (activeOrg === 'consumer') {
            return (
                <div>
                    <Tilt className="Tilt ma2 pointer bg-navy br3 shadow-5" options={{ max: 25 }} style={{ height: 150, width: 100 }} >
                        <div className="Tilt-inner bb white">
                            <p className="center ph3 b dim white fw6 f6 f5-ns dib mr3 mr4-ns">Consumer</p>
                        </div>
                        <div className="Tilt-inner">
                            <img style={{ height: '100px', width: '100px' }} src={logo} alt="logo" />
                        </div>
                    </Tilt>
                </div>
            )
        } else if (activeOrg === 'shipper') {
            return (
                <div>
                    <Tilt className="Tilt ma2 pointer bg-navy br3 shadow-5" options={{ max: 25 }} style={{ height: 150, width: 100 }} >
                        <div className="Tilt-inner bb white">
                            <p className="center ph3 b dim white fw6 f6 f5-ns dib mr3 mr4-ns">Shipper</p>
                        </div>
                        <div className="Tilt-inner">
                            <img style={{ height: '100px', width: '100px' }} src={logo} alt="logo" />
                        </div>
                    </Tilt>
                </div>
            )
        } else if (activeOrg === 'transporter') {
            return (
                <div>
                <Tilt className="Tilt ma2 pointer bg-navy br3 shadow-5" options={{ max: 25 }} style={{ height: 150, width: 100 }} >
                    <div className="Tilt-inner bb white">
                        <p className="center ph3 b dim white fw6 f6 f5-ns dib mr3 mr4-ns">Transporter</p>
                    </div>
                    <div className="Tilt-inner">
                        <img style={{ height: '100px', width: '100px' }} src={logo} alt="logo" />
                    </div>
                </Tilt>
            </div>
            )
        } else {
            return (
                <div>
                    <Tilt className="Tilt" options={{ max: 25 }} style={{ height: 200, width: 160 }} >
                        <div className="Tilt-inner">
                        </div>
                    </Tilt>
                </div>
            )
        }
    }
}

export default Logo;
