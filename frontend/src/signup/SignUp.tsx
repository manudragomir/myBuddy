import React from 'react'
import {IonButton, IonContent, IonDatetime, IonInput, IonItem, IonLabel, IonPage, IonText} from '@ionic/react';
import './signup.css'
import {Col, Row, Card} from "react-bootstrap";

class SignUp extends React.Component<any, any> {

    constructor(props: {}) {
        super(props);
        this.state = {
            firstName: null,
            lastName: null,
            dateOfBirth: null,
            username: null,
            email: null,
            password: null,
            confirmPassword: null,
            validFirstName: true,
            validLastName: true,
            validEmail: true,
            validPassword: true,
            validConfirmedPassword: true,
        }
    }

    handleInputChange = (event: any) => {
        event.preventDefault();
        console.log(event.target.name);
        console.log(event.target.value);
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = (event: any) => {
        event.preventDefault()
        if (this.checkIfAllFilled()) {
            console.log("post will be implemented soon");
        } else {
            console.log("check error messages");
        }
    }

    checkFirstName = (name: string) => {
        let regex = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")
        if (!regex.test(name)) {
            this.setState({validFirstName: false});
        } else {
            this.setState({validFirstName: true});
        }
    }

    checkLastName = (name: string) => {
        let regex = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")
        if (!regex.test(name)) {
            this.setState({validLastName: false});
        } else {
            this.setState({validLastName: true});
        }
    }

    checkEmail = (email: string) => {
        if (email === null)
            return
        let regex = new RegExp("^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,3})+$")
        if (!regex.test(email)) {
            this.setState({validEmail: false})
        } else {
            this.setState({validEmail: true})
        }
    }

    checkPassword = (password: string) => {
        if (password === null)
            return;
        let regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if (!regex.test(password)) {
            this.setState({validPassword: false})
        } else {
            this.setState({validPassword: true})
        }
    }

    checkConfirmedPass = (confirmedPass: string) => {
        if (confirmedPass !== this.state.password)
            this.setState({validConfirmedPassword: false})
        else
            this.setState({validConfirmedPassword: true})
    }

    checkIfAllFilled = () => {
        const {
            firstName, lastName, dateOfBirth, username, email, password, confirmPassword,
            validFirstName, validLastName, validEmail, validPassword, validConfirmedPassword
        } = this.state;

        return !(!validFirstName || !validLastName || !validEmail || !validPassword || !validConfirmedPassword ||
            firstName === null || lastName === null || dateOfBirth === null || username === null ||
            email === null || password === null || confirmPassword === null);
    }

    render() {
        return (
            <IonPage>
                <IonContent>
                    <Row style={{marginTop: '40px'}}>
                        <Col id={"inputCol"}>
                            <IonItem>
                                <IonLabel position={"floating"}>First Name</IonLabel>
                                <IonInput name={"firstName"} onIonChange={this.handleInputChange}
                                          onMouseLeave={() => this.checkFirstName(this.state.firstName)}/>
                                {!this.state.validFirstName && <IonText color={"danger"}> Name is not valid! </IonText>
                                }
                            </IonItem>
                            <IonItem>
                                <IonLabel position={"floating"}>Last Name</IonLabel>
                                <IonInput name={"lastName"} onIonChange={this.handleInputChange}
                                          onMouseLeave={() => this.checkLastName(this.state.lastName)}/>
                                {!this.state.validLastName &&
                                <IonText color={"danger"}> Last Name is not valid! </IonText>
                                }
                            </IonItem>

                            <IonItem>
                                <IonLabel position={"floating"}>Date of birth</IonLabel>
                                <IonDatetime name={"dateOfBirth"} onIonChange={this.handleInputChange}/>
                            </IonItem>

                            <IonItem>
                                <IonLabel position={"floating"}>Username</IonLabel>
                                <IonInput name={"username"} onIonChange={this.handleInputChange}/>
                            </IonItem>

                            <IonItem>
                                <IonLabel position={"floating"}>Email</IonLabel>
                                <IonInput name={"email"} onIonChange={this.handleInputChange}
                                          onMouseLeave={() => this.checkEmail(this.state.email)}
                                />
                                {!this.state.validEmail &&
                                <IonText color={"danger"}> Email is not valid. (e.g petlovers@ubbcluj.ro) </IonText>
                                }

                            </IonItem>

                            <IonItem>
                                <IonLabel position={"floating"}>Password</IonLabel>
                                <IonInput name={"password"} type={"password"} onIonChange={this.handleInputChange}
                                          onMouseLeave={() => this.checkPassword(this.state.password)}
                                />
                                {!this.state.validPassword &&
                                <IonText color={"danger"}> Password should contain at least one upper case, one lower
                                    case, one digit and one special character. Length should be at least 8.
                                </IonText>
                                }
                            </IonItem>

                            <IonItem>
                                <IonLabel position={"floating"}>Confirm password</IonLabel>
                                <IonInput name={"confirmPassword"} type={"password"}
                                          onIonChange={this.handleInputChange}
                                          onMouseLeave={() => this.checkConfirmedPass(this.state.confirmPassword)}
                                />
                                {!this.state.validConfirmedPassword &&
                                <IonText color={"danger"}> Confirmed Password is not valid! </IonText>
                                }
                            </IonItem>
                            {this.checkIfAllFilled() && <IonButton type={"submit"} color={"warning"} expand={"block"}
                                                                   onClick={this.handleSubmit}>Submit</IonButton>}
                            {!this.checkIfAllFilled() && <IonButton type={"submit"} color={"warning"} expand={"block"}
                                                                    onClick={this.handleSubmit}
                                                                    disabled>Submit</IonButton>}
                        </Col>
                        <Col id={"logoCol"}>
                            <Card id={"logoCardParrent"}>
                                <Card id={"logoCardChild"}>
                                    <Card.Img id={"logoCardImg"} src={"assets/resources/logo.jpg"}/>
                                </Card>
                            </Card>
                        </Col>
                    </Row>
                </IonContent>
            </IonPage>
        )
    }

}

export default SignUp;