import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonFooter } from '@ionic/react';
import { getLogger } from '../core';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button' 
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card'
import NavBar from '../components/NavBar';
import Image from 'react-bootstrap/Image'
import color from '../images/logo_full.png';
import { Alert, Nav } from 'react-bootstrap';
import styled from 'styled-components';
 
interface ContainerProps { }
 
const PostContainer = styled(Container)`
  background-image: url() repeat;
`
 
const AddPost: React.FC<ContainerProps> = () => {
  return (
    <IonPage>
      <IonContent>
        <NavBar/>
        <Container fluid style={{height:'100%'}}>
            <Row style={{height:'20%'}}>
                <Col lg="2" style={{background:'red'}}>
                    <p>csadfasdsadasdas</p>
                </Col>
                <Col lg="8" style={{background:'blue'}}>
                </Col>
                <Col lg="2" style={{background:'red'}}>
                </Col>
            </Row>   
            <Row style={{height:'80%'}}>
                <Col lg="2" style={{background:'yellow'}}>
                </Col>
                <Col lg="8" style={{background:'green'}}>
                </Col>
                <Col lg="2" style={{background:'yellow'}}>
                </Col>
            </Row>
            <Row style={{height:'20%'}}>
                <Col lg="2" style={{background:'red'}}>
                </Col>
                <Col lg="8" style={{background:'blue'}}>
                </Col>
                <Col lg="2" style={{background:'red'}}>
                </Col>
            </Row>       
        </Container>
      </IonContent>
    </IonPage>
  );
};
 
export default AddPost;