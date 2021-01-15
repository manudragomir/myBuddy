import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import {baseUrl, withLogs} from '../core';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonContent, IonLabel, IonPage } from '@ionic/react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';

const authUrl = `http://${baseUrl}/user/confirm-account`;

const validateURL = (url: string): boolean => {
    return url.indexOf('?token=') >= 0;
};

/*
    The component represents a informative message
 */
export const Confirm : React.FC<RouteComponentProps>= ({history}) => {
    const [mesaj, setMesaj] = useState("Not confirmed :(");
    const [done, setDone] = useState(false);
    const signUpConfirmation = () => { 
        //console.log('[DEBUG] What is this? ' + history.location.search)  
        if (!validateURL(history.location.search)) {
            setMesaj('Invalid URL (are you sure it ends with token=...?)');
            return;
        }
        return axios({
            method: 'get',
            url: authUrl + history.location.search,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            console.log(response.status);
            if(response.status == 200){
                setDone(true);
            }
            setMesaj(response.data);
        }).catch(function (error) {
            console.log(error);
            setMesaj(error.response.data);
        })
    }
    useEffect(()=>{
        signUpConfirmation();
    }, []);
    return (
    <IonPage>
        <IonContent>
        <NavBar/>
        <Container>
          <Row style={{marginTop:'40px', display:'flex'}}>
            <Col style={{display:'flex'}}>
              <IonLabel>{mesaj}</IonLabel>
            </Col>
          </Row>
          <Row>
            <Col style={{display:'flex'}}>
                {done && <Button variant="outline-dark" onClick={() => {history.push("/")}}>Back to login</Button>}
            </Col>
          </Row>
        </Container>
        </IonContent>
        
    </IonPage>)

}