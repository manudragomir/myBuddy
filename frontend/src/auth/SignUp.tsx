import React, {useEffect, useState} from 'react'
import {IonButton, IonContent, IonDatetime, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonText} from '@ionic/react';
import './signup.css'
import {Card, Col, Nav, Row} from "react-bootstrap";
import logo from '../utils/images/logo_full.png';
import NavBar from '../components/NavBar';
import {signup} from "./authApi";
import Moment from 'moment';
import PropTypes from "prop-types";
import { Redirect } from 'react-router-dom';

interface SignUpState {
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    validFirstName: boolean,
    validLastName: boolean,
    validEmail: boolean,
    validPassword: boolean,
    validConfirmedPassword: boolean,
    redirect: boolean,
    messageError: string,
    pendingSignup: boolean,
}

const initialState: SignUpState = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    validFirstName: true,
    validLastName: true,
    validEmail: true,
    validPassword: true,
    validConfirmedPassword: true,
    redirect: false,
    messageError: '',
    pendingSignup: false
};

interface SignUpProviderProps {
    children: PropTypes.ReactNodeLike,
}

/*
 The component serves the scope of sign-up functionality
 It ensures the possibility of signing up through the input fields :
 - first and last name
 - date of birth
 - username
 - email
 - password
 - confirm password
 It will redirect the user to a confirmation page if the provided data is secure
 */
export const SignUp: React.FC<SignUpProviderProps> = ({children}) => {

    const [state, setState] = useState<SignUpState>(initialState);
    const [doRedirect, setDoRedirect] = useState<boolean>(false);

    useEffect(handleSubmitEffect, [state.pendingSignup]);
    useEffect(() => {
        if(state.redirect){
            setTimeout(
                function() {
                    setDoRedirect(true);
                }, 5000);
        }
    }, [state.redirect]);

    function handleSubmitEffect() {

        if (!state.pendingSignup) {
            return;
        }

        setState({...state, messageError: ''});
        let canceled = false;
        if (checkIfAllFilled())
            signUp();
        return () => {
            canceled = true;
        }

        async function signUp() {
            try {
                await signup(state.firstName, state.lastName, Moment(state.dateOfBirth).format("YYYY-MM-DD"), state.username, state.email, state.password, state.confirmPassword);
                setState({...state, redirect: true, pendingSignup: false})
            } catch (error) {
                if (canceled) {
                    return;
                }
                console.log(error.response);
                setState({...state, messageError: error.response.data, pendingSignup: false})
            }
        }
    }

    function checkFirstName(name: string) {
        let regex = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")
        if (!regex.test(name)) {
            setState({...state, validFirstName: false});
        } else {
            setState({...state, validFirstName: true});
        }
    }

    function checkLastName(name: string) {
        let regex = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")
        if (!regex.test(name)) {
            setState({...state, validLastName: false});
        } else {
            setState({...state, validLastName: true});
        }
    }

    function checkEmail(email: string) {
        if (email === '')
            return
        let regex = new RegExp("^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,3})+$")
        if (!regex.test(email)) {
            setState({...state, validEmail: false})
        } else {
            setState({...state, validEmail: true})
        }
    }

    function checkPassword(password: string) {
        if (password === '')
            return;
        let regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if (!regex.test(password)) {
            setState({...state, validPassword: false})
        } else {
            setState({...state, validPassword: true})
        }
    }

    function checkConfirmedPass(confirmedPass: string) {
        if (confirmedPass !== state.password)
            setState({...state, validConfirmedPassword: false})
        else
            setState({...state, validConfirmedPassword: true})
    }

    function checkIfAllFilled() {
        const {
            firstName, lastName, dateOfBirth, username, email, password, confirmPassword,
            validFirstName, validLastName, validEmail, validPassword, validConfirmedPassword
        } = state;

        return !(!validFirstName || !validLastName || !validEmail || !validPassword || !validConfirmedPassword ||
            firstName === '' || lastName === '' || dateOfBirth === '' || username === '' ||
            email === '' || password === '' || confirmPassword === '');
    }

    return (
        <IonPage>
            <IonContent>
                <NavBar/>
                <Row style={{marginTop: '40px'}}>
                    <Col id={"inputCol"}>
                        <IonItem>
                            <IonLabel position={"floating"}>First Name</IonLabel>
                            <IonInput name={"firstName"} onIonChange={e => setState({
                                ...state,
                                firstName: e.detail.value || ''
                            })} onIonBlur={() => checkFirstName(state.firstName)}/>
                            {!state.validFirstName && <IonText color={"danger"}> Name is not valid! </IonText>
                            }
                        </IonItem>
                        <IonItem>
                            <IonLabel position={"floating"}>Last Name</IonLabel>
                            <IonInput name={"lastName"} onIonChange={e => setState({
                                ...state,
                                lastName: e.detail.value || ''
                            })} onIonBlur={() => checkLastName(state.lastName)}/>
                            {!state.validLastName &&
                            <IonText color={"danger"}> Last Name is not valid! </IonText>
                            }
                        </IonItem>
                        <IonItem>
                            <IonLabel position={"floating"}>Date of birth</IonLabel>
                            <IonDatetime name={"dateOfBirth"} onIonChange={e => setState({
                                ...state,
                                dateOfBirth: e.detail.value || ''
                            })}/>
                        </IonItem>

                        <IonItem>
                            <IonLabel position={"floating"}>Username</IonLabel>
                            <IonInput name={"username"} onIonChange={e => setState({
                                ...state,
                                username: e.detail.value || ''
                            })}/>
                        </IonItem>

                        <IonItem>
                            <IonLabel position={"floating"}>Email</IonLabel>
                            <IonInput name={"email"} onIonChange={e => setState({
                                ...state,
                                email: e.detail.value || ''
                            })} onIonBlur={() => checkEmail(state.email)}
                            />
                            {!state.validEmail &&
                            <IonText color={"danger"}> Email is not valid. (e.g petlovers@ubbcluj.ro) </IonText>
                            }

                        </IonItem>

                        <IonItem>
                            <IonLabel position={"floating"}>Password</IonLabel>
                            <IonInput name={"password"} type={"password"} onIonChange={e => setState({
                                ...state,
                                password: e.detail.value || ''
                            })} onIonBlur={() => checkPassword(state.password)}/>
                            {!state.validPassword &&
                            <IonText color={"danger"}> Password should contain at least one upper case, one lower
                                case, one digit and one special character. Length should be at least 8.
                            </IonText>
                            }
                        </IonItem>  

                        <IonItem>
                            <IonLabel position={"floating"}>Confirm password</IonLabel>
                            <IonInput name={"confirmPassword"} type={"password"}
                                      onIonChange={e => setState({
                                          ...state,
                                          confirmPassword: e.detail.value || ''
                                      })} onIonBlur={() => checkConfirmedPass(state.confirmPassword)}/>
                            {!state.validConfirmedPassword &&
                            <IonText color={"danger"}> Passwords do not match! </IonText>
                             
                            }
                        </IonItem>
                        {checkIfAllFilled() && <IonButton type={"submit"} color={"warning"} expand={"block"}
                                                          onClick={() => setState({
                                                              ...state,
                                                              pendingSignup: true
                                                          })}>Submit</IonButton>}

                        {!checkIfAllFilled() && <IonButton type={"submit"} color={"warning"} expand={"block"}

                                                           disabled>Submit</IonButton>}
                        {state.messageError != '' && <IonText color={"danger"}> {state.messageError} </IonText>}

                                            
                        {state.redirect &&
                            <Nav>
                                <Nav.Link href="/login"
                                        style={{color: "#565210", fontSize: "20px", fontFamily: "Josefin Slab"}}>
                                            Check your email for confirmation.
                                </Nav.Link>
                            </Nav>
                        }

                        {doRedirect && 
                            <Redirect to={{ pathname: '/login' }}/>
                        }

                    </Col>
                    <Col id={"logoCol"}>
                        <Card id={"logoCardParrent"}>
                            <Card id={"logoCardChild"}>
                                <Card.Img id={"logoCardImg"} src={logo}/>
                            </Card>
                        </Card>
                    </Col>
                </Row>
           </IonContent>
           <IonLoading
                isOpen={state.pendingSignup}
                message={'You are becoming our buddy'}
            />
        </IonPage>
    )
}

export default SignUp;