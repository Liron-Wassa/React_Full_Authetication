import React, { Component } from 'react';
import axios from 'axios';

class Confirm extends Component {

    state = {
        message: null
    };

    componentDidMount() {
        axios.post(`/user/confirm/${this.props.match.params.token}`).then(response => {
            this.setState({message: response.data.message});
        }).catch(error => {            
            this.setState({message: error.response.data.message});
        });
    };

    componentWillMount() {
        this.setState({
            error: null,
            message: null
        });
    };

    render() {
        return <h1>{this.state.message}</h1>
    };
};

export default Confirm;