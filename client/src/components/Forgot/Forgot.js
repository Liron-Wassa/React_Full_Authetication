import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import React, { useEffect } from 'react';

const Forgot = (props) => {

    let forgotInput = '';
    let sucssesMessage = null;
    let errorMessage = null;

    useEffect(() => {
        return () => {
            props.cleanMessages();
        }
        // eslint-disable-next-line
    }, []);

    if (props.error) {
        errorMessage = <Alert variant="warning" onClose={props.closeAlert} dismissible>{props.error}</Alert>;
    };
    if (props.isLoading) {
        errorMessage = <Spinner animation="border" variant="primary" />;
    };
    if (props.message) {
        sucssesMessage = <h1>{props.message}</h1>
    }
    else {
        sucssesMessage = (
            <React.Fragment>
                <h1>Forgot password</h1>
                <Form onSubmit = {(e) => {e.preventDefault(); props.onSendRequest(forgotInput)}}>
                    {errorMessage}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Email" name="email" onChange={(e) => forgotInput = e.target.value} />
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </React.Fragment>
        );
    }

    return (
        <div className="container">
            {sucssesMessage}
        </div>
    );
};

export default Forgot;