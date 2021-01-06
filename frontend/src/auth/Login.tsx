import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonFooter } from '@ionic/react';
import { AuthContext } from './AuthProvider';
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
import color from '../utils/images/logo_full.png';
import { Alert, Nav } from 'react-bootstrap';

const log = getLogger('Login');

interface LoginState {
  username?: string;
  password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const { username, password } = state;
  const handleLogin = () => {
    log('handleLogin...');
    login?.(username, password);
  };
  log('render');
  if (isAuthenticated) {
    return <Redirect to={{ pathname: '/' }} />
  }
  return (
    <IonPage>
      <IonContent>
        <NavBar/>
        <Container >
          <Row style={{marginTop:'40px'}}>
            <Col >
            <Card style={{border:"none", marginTop:"40px"}}>
            <Card.Body style={{height:"610px",margin:"70px"}}>
              <Card.Text style={{fontSize:"70px",fontFamily:"Josefin Slab"}}>Log in</Card.Text>
              <Form >
                <Form.Group >
                  <IonInput id="username_input" style={{height:"60px",width:"350px", fontSize:"25px"}}
                    placeholder="enter username"
                    value={username}
                    onIonChange={e => setState({
                      ...state,
                      username: e.detail.value || '' 
                    })}/>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                <IonInput id="password_input" type="password" style={{height:"60px",width:"350px", fontSize:"25px"}}
                  placeholder="enter password"
                  value={password}
                  onIonChange={e => setState({
                    ...state,
                    password: e.detail.value || ''
                  })}/>
              </Form.Group>
              </Form>     
              <IonLoading isOpen={isAuthenticating}/>

              {authenticationError && (
                 <Alert variant='light' style={{color:"#ff8080"}}>
                 Invalid username and password combination.
                 </Alert>
                
              )}

              <Button variant="outline-warning" onClick={handleLogin} style={{backgroundColor: "white",border:"3px solid",
              borderColor:'#aba421',width:"180px",height:"60px",color:"#383a3e",fontWeight:"bold",fontSize:"30px",fontFamily:"Josefin Slab"}}>Login</Button>
              <Nav >
                <Nav.Link href="/signup" style={{color:"#565210",fontSize:"20px",fontFamily:"Josefin Slab"}}>Don't have an account? Sign up now!</Nav.Link>
              </Nav>
            </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{borderRadius:'25px', border:"2px solid",borderColor:"#565210",width:"610px"}}>
              <Card style={{borderRadius:'25px',margin:"20px", backgroundColor:"#aba421",width:"570px"}}>
                <Card.Img src={color} style={{width:"500px",height:"500px",margin:"35px"}} /> 
              </Card>
            </Card>
          </Col>
          </Row>
          </Container>
      </IonContent>
    </IonPage>
  );
};
