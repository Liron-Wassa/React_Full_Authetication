import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import React, { useEffect } from 'react';

const Login = (props) => {

    const loginInput = {
        email: null,
        password: null
    };

    useEffect(() => {
        return () => {
            props.cleanMessages();
        }
        // eslint-disable-next-line
    }, []);

    const loginInputHandler = (e) => {                
        loginInput[e.target.name] = e.target.value;        
    };

    let errorMessage = null;
    if (props.error) {
        errorMessage = <Alert variant="warning" onClose={props.closeAlert} dismissible>{props.error}</Alert>;
    };
    if (props.isLoading) {
        errorMessage = <Spinner animation="border" variant="primary" />;
    };
    return (
        <div className = "container">
            <h1>Login</h1>
            {errorMessage}
            <Form onSubmit = {(e) => {e.preventDefault(); props.login(loginInput)}}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Email" name="email" onChange={loginInputHandler} />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={loginInputHandler} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <br/>
                <NavLink to="/forgot">Forgot?</NavLink>
            </Form>
        </div>
    )
}

export default Login;