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
import photo from '../utils/images/createPost.png';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Room from '@material-ui/icons/Room';
import Pets from '@material-ui/icons/Pets';
import ControlPoint from '@material-ui/icons/ControlPoint';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import {NavBarUser} from '../components/NavBarUser';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Button from '@material-ui/core/Button';
import { Input, InputLabel } from '@material-ui/core';
import { PostContext } from './PostProvider';
import Moment from 'moment';
import { MyMap } from './GeoMap';
import CancelIcon from '@material-ui/icons/Cancel';
import { getLocation } from './mapApi';
import { useMyLocation } from './useMyLocation';
import {Plugins} from "@capacitor/core";
const Storage = Plugins.Storage;



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
 
const tags = [
    '#cat',
    '#dog',
    '#cute',
    '#rabbit',
    '#friendly',
    '#funny',
    '#chameleon',
    '#horse',
    '#shelter'
  ];
 
  function getStyles(tag: string, tagName: string[], theme: Theme) {
    return {
      fontWeight:
        tagName.indexOf(tag) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  

/*
    The component presents a page to the user interface when is trying to add a post
    The input fields are : description, location, tags, the type of the post and the picture/image of the pet corresponding to the pet
    The component gets the information from the input fields and at the click on the "upload" button,
    the handle method is called and the callback from "PostProvider" is put im execution
 */
export const AddPost: React.FC<RouteComponentProps> = ({history}) => {
    const theme = useTheme();
    const classes = useStyles();
    const [tagName, setTagName] = React.useState<string[]>([]);
    const [body,setBody]= React.useState<string>("");
    const [mandatoryTag, setMandatoryTag] = React.useState<string>("");
    const [file, setFile] = useState<FileList | null>(null);
    const [imgSrc,setImgSrc] = useState<string | undefined>(photo);
    const { posts,saving,savingError,addPost } = useContext(PostContext);

    // for map
    const myLocation = useMyLocation();
    const { latitude: lat, longitude: lng } = myLocation.position?.coords || {}
    const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });
    const [latitude,setLatitude] = useState(0);
    const [longitude,setLongitude] = useState(0);
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
      (async () => {
          const storage = await Storage.get({ key: 'username' });
          if(storage.value){
              setUsername(storage.value);
          }
      })();
  });
  
    const handleChangeMandatory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMandatoryTag(event.target.value);
  };

  const handleChangeBody = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setBody(event.target.value);
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTagName(event.target.value as string[]);
  };

  function getType(str: string): string{
    switch(str){
      case 'adoption':
        return 'Adoption';
      case 'lost':
        return 'Lost';
      case 'mybuddy':
        return 'MyBuddy';
      default:
        return 'MyBuddy';
    }
  }

  const handleSavePost = () => {
    const date= Moment(Date.now()).format("YYYY-MM-DD")
    const post = {id:undefined, user:undefined,body: body, date: date,tags: tagName, type: getType(mandatoryTag),latitude:latitude,longitude:longitude}
    console.log(post);
    console.log(file);
    console.log(addPost);
    addPost && file && addPost(post,file).then(() => history.goBack());
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

  return (
    <IonPage>
      <IonContent>
        <NavBarUser username={username}/>
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
                                <h3>"where your pet goes online"</h3>
                            </Card.Title>
                            <div style={{ margin: "50pm" }}>
                                <div className={classes.margin}>
                                    <Grid container spacing={1} alignItems="flex-end">
                                    <Grid item>
                                        {/* <Room fontSize="large"/> */}
                                        <StyledPopover
                                              event={popoverState.event}
                                              isOpen={popoverState.showPopover}
                                              onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
                                              
                                              >
                                                  <IconButton onClick={(e: any) => {
                                                        setShowPopover({ showPopover: false, event: e })
                                                      }}
                                                  >
                                                    <CancelIcon fontSize="large"/>
                                                  </IconButton>
                                                  {/* <div>latitude: {lat}</div>     
                                                  <div>longitude: {lng}</div>   */}
                                                  {lat && lng &&
                                                    <MyMap
                                                      lat={lat}
                                                      lng={lng}
                                                      onMapClick={log('onMap')}
                                                      onMarkerClick={getLatLng()}
                                                  />} 
                                            </StyledPopover>
                                            <IconButton aria-label="mapPopover" onClick={
                                                (e: any) => {
                                                  e.persist();
                                                  setShowPopover({ showPopover: true, event: e })
                                                }}>
                                              <Room fontSize="large"/>
                                            </IconButton>
                                    </Grid>
                                    <Grid item>
                                      <TextField id="input-with-icon-grid" label="find me here" fullWidth value={"You're here "+latitude.toFixed(2)+" "+longitude.toFixed(2)}/>
                                    </Grid>
                                    </Grid>
                                </div>
                                <div className={classes.margin}>
                                    <Grid container spacing={1} alignItems="flex-end">
                                    <Grid item>
                                        <IconButton>
                                          <Pets fontSize="large"/>
                                        </IconButton>                                    
                                    </Grid>
                                    <Grid item>
                                        <TextField id="input-with-icon-grid" label="about the pet" fullWidth onChange={handleChangeBody}/>
                                    </Grid>
                                    </Grid>
                                </div>
                            </div>
                            {/* <br></br>
                            <br></br> */}
                            <FormControl component="fieldset">
                            <FormLabel component="legend">Whose pet is it?</FormLabel>
                            <br></br>
                            <RadioGroup row aria-label="position" name="position" defaultValue="top" onChange={handleChangeMandatory}>
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
                            <Card>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="mutiple-chip-label">Tags</InputLabel>
                                    <Select
                                    labelId="mutiple-chip-label"
                                    id="mutiple-chip"
                                    multiple
                                    value={tagName}
                                    onChange={handleChange}
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={(selected) => (
                                        <div className={classes.chips}>
                                        {(selected as string[]).map((value) => (
                                            <Chip key={value} label={value} className={classes.chip} />
                                        ))}
                                        </div>
                                    )}
                                    MenuProps={MenuProps}
                                    >
                                    {tags.map((tag) => (
                                        <MenuItem key={tag} value={tag} style={getStyles(tag, tagName, theme)}>
                                        {tag}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </Card>
                        </Card.Body>        
                        <Button
                          variant="contained"
                          color="default"
                          className={classes.button}
                          startIcon={<DoneAllIcon />}
                          onClick={handleSavePost}
                        >
                          Upload
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
  function log(source: string) {
    return (e: any) => console.log(source, e.latLng.lat(), e.latLng.lng());
  }

  function getLatLng(){
    return (e:any) => {console.log(getLocation(e.latLng.lat(),e.latLng.lng()));setLatitude(e.latLng.lat());setLongitude(e.latLng.lng())};
  }
};

export default AddPost;
