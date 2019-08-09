import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ContractForm from './components/ContractForm/ContractForm';
import Results from './components/Results/Results';
// import Producer from './components/Producer/Producer';
// import Consumer from './components/Consumer/Consumer';
// import Shipper from './components/Shipper/Shipper';
// import Transporter from './components/Transporter/Transporter';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      route: 'buySell',
      activeOrg: 'producer',
      results: ''
    }
  }

  onRouteChange = (route) => {
    console.log(route);
    this.setState({route: route})
  }

  onOrgChange = (org) => {
    this.setState({activeOrg: org})
  }

  onResultsChange = (results) => {
    console.log(results)
    this.setState({results: results});
  }

  render() {
    return (
      <div className="App" >
        <Particles className='particles' params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} onOrgChange={this.onOrgChange} activeOrg={this.state.activeOrg}/>
        <Logo activeOrg={this.state.activeOrg}/>
        {
          this.state.route === 'buySell'
          ? <ContractForm onRouteChange={this.onRouteChange} onResultsChange={this.onResultsChange}/>
          : <Results results={this.state.results}/>
        }
      </div>
    );
  }
}

export default App;
