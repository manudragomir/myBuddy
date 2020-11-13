import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonImg } from '@ionic/react';
import { getLogger } from '../core'; 
import {Container, Row, Col, Media, Image, Tabs, Tab, Button} from 'react-bootstrap';
import FileUpload from './FileUpload';




const UserEdit: React.FC<RouteComponentProps> = ({ history }) => {
    const [key, setKey] = useState('posts');
    return (
        <IonPage>
        <IonContent>
            <FileUpload />
        </IonContent>
        </IonPage>
    );
};


export default UserEdit;
