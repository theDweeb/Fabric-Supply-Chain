import React from 'react'
import './Navigation.css'

const Navigation = ({ onRouteChange, onOrgChange, activeOrg }) => {

    if (activeOrg === 'producer') {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ul>
                    <li onClick={() => onRouteChange('buySell')} className='f3 link dim black underline pa3 pointer nav-item'>Home</li>
                    <li className='f3 link dim white underline pa3 pointer nav-item'>Producer</li>
                    <li onClick={() => onOrgChange('consumer')} className='f3 link dim black underline pa3 pointer nav-item'>Consumer</li>
                </ul>
            </nav>
        )
    } else if (activeOrg === 'consumer') {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ul>
                    <li onClick={() => onRouteChange('buySell')} className='f3 link dim black underline pa3 pointer nav-item'>Home</li>
                    <li onClick={() => onRouteChange('buySell')} className='f3 link dim white underline pa3 pointer nav-item'>Consumer</li>
                    <li onClick={() => onOrgChange('producer')} className='f3 link dim black underline pa3 pointer nav-item'>Producer</li>
                </ul>
            </nav>
        )
    }
}

export default Navigation;