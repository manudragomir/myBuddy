import React, { useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Button, Form, FormControl, NavDropdown } from 'react-bootstrap'
import color from '../utils/images/logo_full.png';
import {Plugins} from '@capacitor/core';
import { Redirect, Route, RouteComponentProps } from 'react-router';
import profileImg from '../utils/images/logoMyPicture.png';

const {Storage} = Plugins;
//import color from '../images/logo_full.png';

interface NavBarProps {
    username?:string
}
export const NavBarUser: React.FC<NavBarProps>=({username}) =>{
    const [src,setSrc]=useState<string | undefined>(undefined);
    function handleLogOut(){
        (async() => {await Storage.clear()})();
    }
    useEffect(() => {
        setSrc(`https://proiectcolectivmybuddy.s3.eu-central-1.amazonaws.com/testFolder/${username}.jpg`);
    });
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/home">My Buddy</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <NavDropdown title={
                   <img src={src} alt="User" width="20" height="20" className="rounded-circle"/>
                    
                }  id="basic-nav-dropdown">
                <NavDropdown.Item href="/user">My Profile</NavDropdown.Item>
                <NavDropdown.Item href="/match">AI Match your Dog Breed</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/login" onClick={handleLogOut}>Log Out</NavDropdown.Item>
            </NavDropdown>
            </Nav>
            <Nav>
                <Nav.Link href="/mission">Our Mission</Nav.Link>
                <Nav.Link href="/help">Help</Nav.Link>
                <Nav.Link href="/contact">Contact</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}
