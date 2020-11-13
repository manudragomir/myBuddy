import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
export default function NavBar() {
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/home">My Buddy</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="#features">Our Mission</Nav.Link>
                <Nav.Link href="#pricing">Help</Nav.Link>
                </Nav>
                <Nav>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="#deets">Contact</Nav.Link>
                </Nav>
                
            </Navbar.Collapse>
            </Navbar>
        </div>
    )
}
