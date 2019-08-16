import React, { Component } from 'react';
import './App.css';

import MainNav from './components/MainNav/MainNav';
import SignIn from './components/SignIn/SignIn';
import Logo from './components/Logo/Logo';
import CreateUser from './components/CreateUser/CreateUser';
import BuyAsset from './components/BuyAsset/BuyAsset';
import SellAsset from './components/SellAsset/SellAsset';
import Upload from './components/Upload/Upload';

class App extends Component {
  constructor() {
    super();
    this.state = {
      signedIn: false,
      activeOrg: 'none',
      route: ''
    }
  }

  onSignIn = () => {
    console.log("Signed In")
    this.setState({
      signedIn: true
    });
  }

  onSignOut = () => {
    console.log("Signed Out")
    this.setState({
      signedIn: false,
      activeOrg: '',
      route: ''
    });
  }

  setActiveOrg = (org) => {
    this.setState({ activeOrg: org })
  }

  onRouteChange = (route) => {
    this.setState({ route: route });
  }

  render() {
    if (this.state.signedIn === false) {
      return (
        <div>
          <MainNav signedIn={this.state.signedIn} />
          <Logo activeOrg={this.state.activeOrg} />
          <SignIn onSignIn={this.onSignIn} signedIn={this.state.signedIn} activeOrg={this.state.activeOrg} setActiveOrg={this.setActiveOrg} />
        </div>
      )
    } else {
      return (
        <div>
          <MainNav signedIn={this.state.signedIn} onSignOut={this.onSignOut} onRouteChange={this.onRouteChange} route={this.state.route} />
          <Logo activeOrg={this.state.activeOrg} />
          {
            this.state.route === 'createUser'
              ? <CreateUser activeOrg={this.state.activeOrg} />
              : null
          }
          {
            this.state.route === 'buyasset'
              ? <BuyAsset activeOrg={this.state.activeOrg} />
              : null
          }
          {
            this.state.route === 'sellasset'
              ? <SellAsset activeOrg={this.state.activeOrg} />
              : null
          }
          {
            this.state.route === 'uploadCC'
              ? <Upload activeOrg={this.state.activeOrg} onRouteChange={this.onRouteChange}/>
              : null
          }

        </div>
      )
    }
  }
}

export default App;
