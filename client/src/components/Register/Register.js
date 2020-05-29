import { Form, Button, Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const Register = (props) => {

    const registerInput = {
        email: null,
        password: null,
    };

    useEffect(() => {
        return () => {
            props.cleanMessages();
        }
        // eslint-disable-next-line
    }, []);

    const registerInputHandler = (e) => {
        registerInput[e.target.name] = e.target.value;
    }

    let errorMessage = null;
    let successMeesage = null;

    if (props.error) {
        errorMessage = <Alert variant="warning" onClose={props.closeAlert} dismissible>{props.error}</Alert>;
    };
    if (props.isLoading) {
        errorMessage = <Spinner animation="border" variant="primary" />;
    };
    if (props.isRegisterd) {        
        return <Redirect to="/login" />;
    };
    if (props.message) {
        successMeesage = <h1>{props.message}</h1>
    }
    else {
        successMeesage = (
            <React.Fragment>
                <h1>Register</h1>
                {errorMessage}
                <Form onSubmit = {(e) => {e.preventDefault(); props.register(registerInput)}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Email" name="email" onChange={registerInputHandler} />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" name="password" onChange={registerInputHandler} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </React.Fragment>
        );
    }

    return <div className = "container">
        {successMeesage}
    </div>
}

export default Register;