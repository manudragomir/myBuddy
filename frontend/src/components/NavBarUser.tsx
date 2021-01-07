import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import color from '../utils/images/logo_full.png';
import {Plugins} from '@capacitor/core';
const {Storage} = Plugins;
export default function NavBarUser() {
    function handleLogOut(){
        (async() => {await Storage.clear()})();
    }
    return (
        <div>
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/home">
            <img
                alt=""
                src={color}
                width="40"
                height="40"
                className="d-inline-block align-top"
            />{' '}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="#">Our Mission</Nav.Link>
                </Nav>
                <Nav>
                {/* <Nav.Link href="/login" onClick=​​​​​{handleLogOut}>SignOut</Nav.Link>    */}
                <Nav.Link href="/login" onClick={handleLogOut}>SignOut</Nav.Link>
                <Nav.Link href="#">Contact</Nav.Link>
                <Nav.Link href="#">Help</Nav.Link>
                </Nav>   
            </Navbar.Collapse>
        </Navbar>
    </div>
    )
}
