import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonImg } from '@ionic/react';
import {authConfig, getLogger} from '../core';
import {Container, Row, Col, Media, Image, Tabs, Tab, Button} from 'react-bootstrap';
import FileUpload from './FileUpload';
import axios from 'axios';


const UserEdit: React.FC<RouteComponentProps> = ({ history }) => {
    const [key, setKey] = useState('posts');

    const doApiCall = () => {
        const post = {
            date: "2020-10-11"
        }
        var raw = JSON.stringify({"date":"2020-11-11"});

        axios.post(
            'http://localhost:8080/post',
            raw,
            authConfig(undefined)
        ).then(resp => {
            console.log("API CALL SUCCESS - response:", resp)
        }).catch(err => {
            console.log("API CALL FAIL - error:", err)
        })
    }

    return (
        <IonPage>
        <IonContent>
            <FileUpload/>
            <IonButton onClick={doApiCall}>Api Call</IonButton>
        </IonContent>
        </IonPage>
    );
};


export default UserEdit;
