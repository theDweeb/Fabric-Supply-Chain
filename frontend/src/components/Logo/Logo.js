import React from 'react'
import Tilt from 'react-tilt'
import './Logo.css'
import logo from './blockchain.png'
const Logo = ({ activeOrg }) => {

    if (activeOrg === 'producer') {
        return (
            <div className="ma4 mt0">
                <Tilt className="Tilt br2 shadow-2 producer" options={{ max: 55, reverse: true }} style={{ height: 150, width: 150 }} >
                    <div style={{ color: 'white' }} className='pa3'>Producer</div>
                    <div className="Tilt-inner pa3"><img style={{ height: 75, width: 75 }} src={logo} alt="logo" /></div>
                </Tilt>
            </div>
        )
    } else if (activeOrg === 'consumer') {
        return (
            <div className="ma4 mt0">
                <Tilt className="Tilt br2 shadow-2 consumer" options={{ max: 55, reverse: true }} style={{ height: 150, width: 150 }} >
                    <div style={{ color: 'white' }} className='pa3'>Consumer</div>
                    <div className="Tilt-inner pa3"><img style={{ height: 75, width: 75 }} src={logo} alt="logo" /></div>
                </Tilt>
            </div>
        )
    }
}

export default Logo;