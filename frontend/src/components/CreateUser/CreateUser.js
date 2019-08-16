import React, { Component } from 'react';

class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            password: ''
        }
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    onPasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    onSubmit = () => {
        fetch(`http://localhost:3000/${this.props.activeOrg}/users/create`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.input,
                secret: this.state.password,
                org: this.props.activeOrg,
                roles: ["dev"],
                affiliation: "org1.department1"
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.success === true) {
                alert(`Successfully created user: ${this.state.input}`)
            } else {
                alert(`Failed to create user: ${data.message}`)
            }
        })
    }

    render() {
        return (
            <article className="br3 background b--black-10 mv1 w-100 w-50-m w-25-l mw6 shadow-4 center">
                <main className=" black-80 ma5">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0 tc navy">Create User</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6 dark-blue tc" htmlFor="username">Username</label>
                                <input
                                    onChange={this.onInputChange}
                                    className="pa2 input-reset  bg-transparent hover-bg-light-blue ba dark-blue hover-white w-100"
                                    type="text"
                                    name="organization"
                                    id="organization" />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6 dark-blue tc" htmlFor="password">Password</label>
                                <input
                                    onChange={this.onPasswordChange}
                                    className="b pa2 input-reset  bg-transparent hover-bg-light-blue ba dark-blue hover-white w-100"
                                    type="password"
                                    name="password"
                                    id="password" />
                            </div>
                        </fieldset>
                        <div className="center">
                            <input
                                onClick={this.onSubmit}
                                className="b ph3 pv2 input-reset ba b--dark-blue bg-transparent grow pointer f6 dib navy"
                                type="submit"
                                value="Log In" />
                        </div>
                    </div>
                </main>
            </article>
        )
    }
}

export default CreateUser;
