import { Redirect } from 'react-router';
import { Component } from 'react';
import React from 'react';

class Loggout extends Component {
    
    componentDidMount() {
        this.props.loggout();
    };
    
    render() {        
        return (
            <Redirect to="/" />
        );     
    }
};

export default Loggout;