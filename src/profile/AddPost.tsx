import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonFooter } from '@ionic/react';
import { getLogger } from '../core';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card'
import NavBar from '../components/NavBar';
import Image from 'react-bootstrap/Image'
import color from '../images/logo_full.png';
import { Alert, Nav } from 'react-bootstrap';
import styled from 'styled-components';

import img from '../images/column.png';
import photo from '../images/createPost.png';
import new_photo from '../images/pa.png';

import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import AccountCircle from '@material-ui/icons/AccountCircle';
import Room from '@material-ui/icons/Room';
import Pets from '@material-ui/icons/Pets';
import ControlPoint from '@material-ui/icons/ControlPoint';

import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

import IconButton from '@material-ui/core/IconButton';
import { DoneAll } from '@material-ui/icons';
import NavBarUser from '../components/NavBarUser';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Button from '@material-ui/core/Button';


const StyledCard = styled(Card)`
    background: url('bck_resized.png') repeat;
    width: 100%;
    height: 100%;
    margin: 0;
`

interface ContainerProps { }

const PostContainer = styled(Container)`
  background-image: url() repeat;
`

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    root: {
        '& > *': {
          margin: theme.spacing(1),
        },
      },
    input: {
        display: 'none',
    },
    button: {
      margin: theme.spacing(1),
    },
}));

const AddPost: React.FC<RouteComponentProps> = ({history}) => {
  const classes = useStyles();
  const [selectedValue, setSelectedValue] = React.useState('a');
  const [file, setFile] = useState<FileList | null>(null);
  const [image,setImage]=useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <IonPage>
      <IonContent>
        <NavBarUser/>
        <Container fluid style={{height:'100%'}}>
            <Row style={{height:'15%', padding: "0"}}>
                <Col lg="1" style={{ padding: "0"}}>
                    <StyledCard style={{ backgroundImage: `url(${img})` }}></StyledCard>
                </Col>
                <Col lg="10" style={{ padding: "0"}}>
                    <StyledCard style={{ backgroundImage: `url(${img})` }}></StyledCard>
                </Col>
                <Col lg="1" style={{ padding: "0"}}>
                    <StyledCard style={{ backgroundImage: `url(${img})` }}></StyledCard>
                </Col>
            </Row>   
            <Row style={{height:'70%', padding: "0"}}>
                <Col lg="1" style={{ padding: "0"}}>
                    <StyledCard style={{ backgroundImage: `url(${img})` }}></StyledCard>
                </Col>
                
                <Col lg="5" style={{ padding: "0"}} >
                    <Card style={{ padding: "50px 50px 100px 150px" , height:"100%", width:"100%" }}>
                        <Card.Body>
                            <Card.Title style={{ alignContent: "center", fontFamily:"Josefin Slab", color: "#bfbfbf"}}>
                                <h3>"where your pet goes online"</h3>
                            </Card.Title>
                            <div style={{ margin: "50px" }}>
                                <div className={classes.margin}>
                                    <Grid container spacing={1} alignItems="flex-end">
                                    <Grid item>
                                        <Room fontSize="large"/>
                                    </Grid>
                                    <Grid item>
                                        <TextField id="input-with-icon-grid" label="find me here" fullWidth/>
                                    </Grid>
                                    </Grid>
                                </div>
                                <div className={classes.margin}>
                                    <Grid container spacing={1} alignItems="flex-end">
                                    <Grid item>
                                        <Pets fontSize="large"/>
                                    </Grid>
                                    <Grid item>
                                        <TextField id="input-with-icon-grid" label="about the pet" fullWidth/>
                                    </Grid>
                                    </Grid>
                                </div>
                            </div>
                            
                            <FormControl component="fieldset">
                            <FormLabel component="legend">Whose pet is it?</FormLabel>
                            <br></br>
                            <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                <FormControlLabel
                                value="adoption"
                                control={<Radio color="secondary" />}
                                label="Adoption"
                                labelPlacement="bottom"
                                />
                                <FormControlLabel
                                value="myBuddy"
                                control={<Radio color="secondary" />}
                                label="My Buddy"
                                labelPlacement="bottom"
                                />
                                <FormControlLabel
                                value="lost"
                                control={<Radio color="secondary" />}
                                label="Lost"
                                labelPlacement="bottom"
                                />
                            </RadioGroup>
                            </FormControl>
                        </Card.Body>        
                        <Button
                          variant="contained"
                          color="default"
                          className={classes.button}
                          startIcon={<DoneAllIcon />}
                          onClick={() => {
                            return history.push("/user")
                        }}
                        >
                          Upload
                        </Button>            
                    </Card>    
                </Col>

                <Col lg="5" style={{ margin:"0 auto"}}>
                    <Image src={photo} id="imgid" thumbnail style={{alignContent: "center", verticalAlign: "center", height:"300px", width:"300px", marginTop:"40px"}}/>
                    <div style={{marginLeft: "270px", alignContent: "center", verticalAlign: "center"}}>
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                    />
                    <input accept="image/*" className={classes.input} id="icon-button-file" type="file"  onChange={event => {setFile(event.target.files)}}/>
                    <label htmlFor="icon-button-file">
                        <IconButton color="default" aria-label="upload picture" component="span">
                            <ControlPoint fontSize="large" />
                        </IconButton>
                    </label>
                    </div>
                </Col>  
                
                <Col lg="1" style={{ padding: "0"}}>
                    <StyledCard style={{ backgroundImage: `url(${img})` }}></StyledCard>
                </Col>
            </Row>
            <Row style={{height:'15%', padding: "0"}}>
                <Col lg="1" style={{ padding: "0"}}>
                    <StyledCard style={{ backgroundImage: `url(${img})`}}></StyledCard>
                </Col>
                <Col lg="10" style={{ padding: "0"}}>
                    <StyledCard style={{ backgroundImage: `url(${img})`}}></StyledCard>
                </Col>
                <Col lg="1" style={{ padding: "0"}}>
                    <StyledCard style={{ backgroundImage: `url(${img})` }}></StyledCard>
                </Col>
            </Row>       
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default AddPost;