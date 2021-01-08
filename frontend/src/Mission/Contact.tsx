import React, {useContext, useEffect, useState} from 'react';
import {

    IonContent,

    IonIcon, IonImg,

    IonPage,

} from '@ionic/react';

import NavBar from '../components/NavBar';

import {RouteComponentProps} from "react-router";

import "./Mission.css";
import logo from  '../utils/images/PhoneDog.jpg'
import {Col, Container, Row} from "react-bootstrap";



const Contact: React.FC<RouteComponentProps> = () => {


    return (
        <IonPage>
            <IonContent className={"mission-page-content"} fullscreen>
                <NavBar/>
                <Container>
                    <Row>
                        <Col >
                            <IonImg src={logo} className="poza1"  >
                            </IonImg>
                        </Col>
                        <Col style={{marginTop:'40px'}}>
                            <div className="titlu"> Pentru orice nelămurire sau feedback ne puteti contacta la urmatoarele date de contact:</div>
                            <div className="textStyle">
                                myBuddy@petLovers.com
                            </div>
                            <div className="textStyle">
                                0722 22 22 22
                            </div>



                        </Col>
                    </Row>
                </Container>



            </IonContent>
        </IonPage>
    );
};

export default Contact;