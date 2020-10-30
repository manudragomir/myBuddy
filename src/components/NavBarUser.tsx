import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import color from '../images/logo_full.png';
export default function NavBarUser() {
    return (
        <div>
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">
            <img
                alt=""
                src={color}
                width="60"
                height="60"
                className="d-inline-block align-top"
            />{' '}
            My Buddy
            </Navbar.Brand>
        </Navbar>
    </div>
    )
}
