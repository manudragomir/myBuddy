import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonImg } from '@ionic/react';
import { getLogger } from '../core'; 
import {Container, Row, Col, Media, Image, Tabs, Tab, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBarUser from '../components/NavBarUser';
import img from '../images/column.png';
import dog from '../images/dog_cut1.jpg';
import profileImg from '../images/logoMyPicture.png';
import { Jumbotron } from '../components/Jumbotron';


const UserPage: React.FC<RouteComponentProps> = ({ history }) => {
    const [key, setKey] = useState('posts');

    return (
        <IonPage>
            <IonContent>
                <NavBarUser/>
                <Container  fluid style={{height: "100%"}}>
                    <Row style={{height:"10px"}}>
                        <Image src={dog} fluid />
                        <Col lg="2"></Col>
                        <Col lg="8">
                            <Tabs 
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={k => k && setKey(k)}
                        >
                            <Tab eventKey="posts" title="Posts" >
                                Posts content
                            </Tab>
                            <Tab eventKey="contact" title="Contact" >
                                Contact content
                            </Tab>
                            </Tabs>
                        </Col>
                        <Col lg="2"></Col>
                    </Row>
                    <Row >
                        <Col  lg="2">
                         <Image src={img} fluid />
                        </Col>
                        <Col lg="8">
                        <Row>
                            <Col lg="3">
                                <Image src={profileImg} roundedCircle />
                            </Col>
                            <Col lg="4">
                            <h5>User Profile</h5>
                                <p>
                                Some things about me...
                                </p>
                                <Button onClick={()=>{return history.push("/user/edit")}} variant="secondary">Edit Profile</Button>
                            </Col>
                        </Row>
                        </Col>
                        <Col lg="2" >      
                        <Image src={img} fluid />
                        </Col>
                    </Row>
                  
                </Container>
            </IonContent>
        </IonPage>
    );
};

export default UserPage;