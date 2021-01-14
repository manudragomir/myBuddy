import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonPopover} from '@ionic/react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card'
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Image from 'react-bootstrap/Image'
import styled from 'styled-components';
import img from '../utils/images/column.png';
import photo from '../utils/images/logoMyPicture.png';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import ContactPhone from '@material-ui/icons/ContactPhone';
import EmojiPeople from '@material-ui/icons/EmojiPeople';
import ContactMail from '@material-ui/icons/ContactMail';
import ControlPoint from '@material-ui/icons/ControlPoint';
import IconButton from '@material-ui/core/IconButton';
import {NavBarUser} from '../components/NavBarUser';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Button from '@material-ui/core/Button';
import { PostContext } from './PostProvider';
import Moment from 'moment';
import { useMyLocation } from './useMyLocation';



const StyledCard = styled(Card)`
    background: url('bck_resized.png') repeat;
    width: 100%;
    height: 100%;
    margin: 0;
`

const StyledPopover = styled(IonPopover)`
    height : 400px;
    width : 400px;
    --backdrop-opacity : 0%;
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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
      },
      chips: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chip: {
        margin: 2,
      },
      noLabel: {
        marginTop: theme.spacing(3),
      },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
 


interface EditUserProps extends RouteComponentProps<{
  username?: string;
}> {}

const UserEdit: React.FC<EditUserProps> = ({ history, match }) => {
    const theme = useTheme();
    const classes = useStyles();

    const [desc,setDesc]= React.useState<string>("");
    const [phone, setPhone] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");

    const [file, setFile] = useState<FileList | null>(null);
    const [imgSrc,setImgSrc] = useState<string | undefined>(photo);
    const { posts,saving,savingError,uploadData,getData} = useContext(PostContext);

  const handleChangeDesc = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setDesc(event.target.value);
  };
  
  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setEmail(event.target.value);
  };

  
  const handleChangePhone = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setPhone(event.target.value);
  };

  const handleSaveProfile = () => {
    const username= match.params.username ? match.params.username : "";
    let has;
    file ? has=true  : has =false;
    file ? file && uploadData && uploadData(username ,email ,phone , desc, has,file).then(() => history.goBack()) : uploadData && uploadData(username ,email ,phone , desc,  has,undefined).then(() => history.goBack());
  };

  useEffect(() => {
    try {
        if (!file) {
          throw new Error('Select a file first!');
        }
        const src=URL.createObjectURL(file[0]);    
        setImgSrc(src);
    } catch (Error) {
        // handle error
    }
  }, [file])

  useEffect(()=>{
    const username= match.params.username ? match.params.username : "";
    const response=getData?.(username);
    response?.then(res=>{
        setEmail(res.email);
        setPhone(res.phone);
        setDesc(res.desc);
        if(res.has){
          setImgSrc(`https://proiectcolectivmybuddy.s3.eu-central-1.amazonaws.com/testFolder/${username}.jpg`);
        }
    }); 
  },[]);

    return (
        <IonPage>
        <IonContent>
        <NavBarUser username={match.params.username}/>
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
                    <Card style={{ padding: "50pm 50pm 100pm 150pm" , height:"100%", width:"100%" }}>
                        <Card.Body>
                            <Card.Title style={{ alignContent: "center", fontFamily:"Josefin Slab", color: "#bfbfbf"}}>
                                <h3>"Update your profile so that people can know you better"</h3>
                            </Card.Title>
                            <div style={{ margin: "100pm" }}>
                                <div className={classes.margin}>
                                    <Grid container spacing={2} alignItems="flex-end">
                                        <Grid item>
                                            <IconButton>
                                            <EmojiPeople fontSize="large"/>
                                            </IconButton>                                    
                                        </Grid>
                                        <Grid item>
                                            <TextField id="input-with-icon-grid" label="about you" value={desc} fullWidth onChange={handleChangeDesc}/>
                                        </Grid>
                                        <Grid item>
                                            <IconButton>
                                            <ContactMail fontSize="large"/>
                                            </IconButton>                                    
                                        </Grid>
                                        <Grid item>
                                            <TextField id="input-with-icon-grid" label="your email" value={email} fullWidth onChange={handleChangeEmail} />
                                        </Grid>
                                        </Grid>
                                        <Grid container spacing={2} alignItems="flex-end">
                                        <Grid item>
                                            <IconButton>
                                            <ContactPhone fontSize="large"/>
                                            </IconButton>                                    
                                        </Grid>
                                        <Grid item>
                                            <TextField id="input-with-icon-grid" label="your phone number" value={phone} fullWidth onChange={handleChangePhone}/>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>                            
                        </Card.Body>        
                        <Button
                          variant="contained"
                          color="default"
                          className={classes.button}
                          startIcon={<DoneAllIcon />}
                          onClick={handleSaveProfile}
                        >
                          Update Profile
                        </Button>            
                    </Card>    
                </Col>

                <Col lg="5" style={{ margin:"0 auto"}}>
                    <br></br>
                    <br></br>
                    <Image src={imgSrc} id="imgid" thumbnail style={{alignContent: "center", verticalAlign: "center", height:"300px", width:"300px", marginTop:"40pm"}}/>
                    <div style={{marginLeft: "220px", alignContent: "center", verticalAlign: "center"}}>
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                    />
                  
                    <input style={{marginLeft:"200pm"}} accept="image/*" className={classes.input} id="icon-button-file" type="file"  onChange={event => setFile(event.target.files)}/>
                    <label htmlFor="icon-button-file" style={{marginLeft:"200pm"}}>
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
        <IonLoading isOpen={saving}/>
        </IonContent>
        </IonPage>
    );
};


export default UserEdit;
