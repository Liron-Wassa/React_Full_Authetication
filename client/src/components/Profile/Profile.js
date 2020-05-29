import React, { Component } from 'react';
import axios from 'axios';

class Profile extends Component {

    state = {
        error: null,
        secret: null
    };

    componentDidMount() {
        axios.get('/user/profile', {'headers': {'authorization': this.props.token}}).then(response => {
            this.setState({
                error: response.data.message,
                secret: response.data.image
            });
        }).catch(error => {
            this.setState({error: error.response.data.message});
        });
    };

    render() {
        return (
            <div>
                <h1>{this.state.error}</h1>
                {this.state.secret ?
                    <img src={this.state.secret} alt = "profile"/>
                : null}
            </div>
        )
    };
};

export default Profile;