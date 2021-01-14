import React, {useContext, useEffect, useState} from 'react';
import {

    IonContent,

    IonIcon, IonImg,

    IonPage,

} from '@ionic/react';

import NavBar from '../components/NavBar';

import {RouteComponentProps} from "react-router";

import "./Mission.css";
import logo from  '../utils/images/logo_full.png'
import {Col, Container, Row} from "react-bootstrap";
import {Plugins} from "@capacitor/core";
import { NavBarUser } from '../components/NavBarUser';
const Storage = Plugins.Storage;


const Mission: React.FC<RouteComponentProps> = () => {

    
    const [auth, setAuth] = useState(false);
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        (async () => {
            const storage = await Storage.get({ key: 'username' });
            if(storage.value){
                setAuth(true);
                setUsername(storage.value);
            }
        })();
    });

    return (
        <IonPage>
            <IonContent className={"mission-page-content"} fullscreen>
                {auth ? <NavBarUser username={username}/> : <NavBar/>}
                <Container>
                    <Row>
                    <Col >
                        <IonImg src={logo} className="logoMission"  >
                        </IonImg>
                    </Col>
                    <Col style={{marginTop:'40px'}}>
                        <div className="titlu"> Ce este MyBuddy și cui se adresează?</div>
                        <div className="textStyle" >MyBuddy este o aplicație web destinată comunității iubitorilor de animale, cu două obiective
                            principale : facilitarea găsirii unui nou prieten pufos și crearea unui mediu centralizat pentru cei
                            care și-au pierdut animăluțul și doresc să-l recupereze.</div>

                    </Col>
                    </Row>
                </Container>



            </IonContent>
        </IonPage>
    );
};

export default Mission;
