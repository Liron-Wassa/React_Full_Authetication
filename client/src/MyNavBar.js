import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import React from 'react';

const MyNavBar = (props) => {

    const style = {
        link: {
            textDecoration: 'none',
            padding: '10px',
            color: 'rgba(0, 0, 0, 0.5)'
        }
    };

    return (
        <div>
            <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">Nav Bar</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {props.isAuthenticated ?
                    <React.Fragment>
                        <NavLink to="/" style={style.link}>home</NavLink>
                        <NavLink to="/profile" style={style.link}>Profile</NavLink>
                        <NavLink to="/loggout" style={style.link}>Loggout</NavLink>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <NavLink to="/" style={style.link} activeClassName={style.active}>home</NavLink>
                        <NavLink to="/register" style={style.link}>Register</NavLink>
                        <NavLink to="/login" style={style.link}>Login</NavLink>
                    </React.Fragment>
                    }
                </Nav>
            </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default MyNavBar;