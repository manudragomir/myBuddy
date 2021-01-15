import React, {useContext, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MessageIcon from '@material-ui/icons/Message';
import {PostProps} from "./PostProps";
import { Console } from 'console';
import { Badge, FormControlLabel, Grid} from '@material-ui/core';
import styled from 'styled-components';
import {IonPopover} from '@ionic/react';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import {Plugins} from "@capacitor/core";
import {PhotoModal} from "./PhotoModal";

import {PostContext} from './PostProvider';
const Storage = Plugins.Storage;



const useStyles = makeStyles((theme) => ({
    root: {
        width: "80%",
        // maxWidth: '85%',
        marginLeft: '9%',
    },
    media: {
        paddingTop: '36.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: '#8c8c8c',
    },
}));

const StyledPopover = styled(IonPopover)`
    height : 400px;
    width : 400px;
    --backdrop-opacity : 0%;
`

const StyledCard = styled(Card)`
    background: #ffffcc;
    width: 250px;
`

const StyledBadge = styled(Badge)`
    background: #ffffcc;
`

/*
    The component contains the detailed information of a post that will appear in the UserPage and VisitUser components
    It shows the properties of a post entity, along with specialized buttons for CRUD operations ( edit & delete)
 */
export const Post: React.FC<PostProps> = ({id, date, user, body, type, tags, latitude, longitude}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });
    const [forAdoption,setForAdoption]= useState(type==='Adoption');
    const [lost,setLost] = useState(type==='Lost');
    const [myBuddy,setMyBuddy] = useState(type==='MyBuddy');
    const [found,setFound] = useState(false);
    const [adopted,setAdopted] = useState(false);
    const [mandatoryTag,setMandatoryTag]=useState('MyBuddy')
    const [checkedTag,setCheckedTag]=useState('');
    const [profileSrc,setProfileSrc]=React.useState<string>("");

    const [showButtons, setShowButtons]=useState<boolean>(false);

    useEffect(()=>{
        (async () => {
            const storageUser = await Storage.get({ key: 'username' });
            if(storageUser.value && storageUser.value == user?.username){
                setShowButtons(true);
            }
        })();
        setProfileSrc(`https://proiectcolectivmybuddy.s3.eu-central-1.amazonaws.com/testFolder/${user?.username}.jpg`);
    },[])

    const {deletePost} = useContext(PostContext);

    // a specialized useEffect that gives the possibility of changing the type of the post tot the user
    // the values that the user can change to are the opposite ones from the ones
    // contained in the post
    useEffect(()=>{
        if(lost){
            setMandatoryTag('Lost')
        }else if (forAdoption){
            setMandatoryTag('Adoption')
        }else if(found){
            setMandatoryTag('Found')
        }else if(adopted){
            setMandatoryTag('Adopted')
        }
        if(mandatoryTag==='Found'){
            setFound(true);
        }else if(mandatoryTag==='Adopted'){
            setAdopted(true)
        }else if(mandatoryTag==='Adoption'){
            setForAdoption(true)
        }else if(mandatoryTag==='Lost'){
            setLost(true)
        }
    },[mandatoryTag])

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Badge color="error" badgeContent={mandatoryTag}>
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            <img src={profileSrc} alt="R"/>
                        </Avatar>
                    </Badge>
                    
                }
                action={
                    <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                            {
                                !showButtons &&
                                    <PhotoModal id={id}/>
                            }
                            {showButtons &&
                                    <IconButton aria-label="settings" onClick={
                                                (e: any) => {
                                                  e.persist();
                                                  setShowPopover({ showPopover: true, event: e })
                                                }}>
                                            <MoreVertIcon/>
                                    </IconButton> }
                            {showButtons &&
                                <IonPopover
                                              event={popoverState.event}
                                              isOpen={popoverState.showPopover}
                                              onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
                                              
                                    >       
                                    <List>
                                        <ListItem>
                                            <StyledCard>
                                                <CardContent>
                                                <FormControlLabel hidden={!forAdoption}
                                                        control={
                                                            <Checkbox
                                                            color="default"
                                                            inputProps={{ 'aria-label': 'checkboxAdoption' }}
                                                            hidden={!forAdoption}
                                                            value="adopted"
                                                            name="adopted "
                                                            onChange={()=>{setCheckedTag('Adopted');setForAdoption(false);}}

                                                        />
                                                        }
                                                        label="adopted"
                                                    />
                                                    <FormControlLabel hidden={!lost}
                                                        control={
                                                            <Checkbox
                                                            icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                                            checkedIcon={<CheckBoxIcon fontSize="large" />}
                                                            color="default"
                                                            inputProps={{ 'aria-label': 'checkboxLost' }}
                                                            hidden={!lost}
                                                            value="found"
                                                            name="found "
                                                            onChange={()=>{setCheckedTag('Found');setLost(false);}}

                                                        />
                                                        }
                                                        label="found"
                                                    />
                                                    <FormControlLabel hidden={!myBuddy}
                                                        control={
                                                            <Checkbox
                                                            icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                                                            checkedIcon={<CheckBoxIcon fontSize="large" />}
                                                            color="default"
                                                            inputProps={{ 'aria-label': 'checkboxMyBuddy' }}
                                                            hidden={!myBuddy}
                                                            value="lost"
                                                            name="lost "
                                                            onChange={()=>{setCheckedTag('Lost');setMyBuddy(false);}}
                                                        />
                                                        }
                                                        label="lost"
                                                    />
                                                    <FormControlLabel hidden={!found}
                                                        control={
                                                            <Checkbox
                                                            color="default"
                                                            inputProps={{ 'aria-label': 'checkboxFound' }}
                                                            hidden={!found}
                                                            value="lost"
                                                            name="lost "
                                                            onChange={()=>{setCheckedTag('Lost');setFound(false);}}
                                                        />
                                                        }
                                                        label="lost"
                                                    />
                                                     <FormControlLabel hidden={!adopted}
                                                        control={
                                                            <Checkbox
                                                            color="default"
                                                            inputProps={{ 'aria-label': 'checkboxAdopted' }}
                                                            hidden={!adopted}
                                                            value="adoption"
                                                            name="adoption "
                                                            onChange={()=>{setCheckedTag('Adoption');setAdopted(false);}}
                                                        />
                                                        }
                                                        label="adoption"
                                                    />
                                                </CardContent>
                                                <CardActions>
                                                    <IconButton onClick={(e:any)=>{setMandatoryTag(checkedTag);setShowPopover({ showPopover: false, event: e })}}>
                                                    <EditIcon fontSize="small"/>
                                                    edit
                                                    </IconButton>                                                    
                                                </CardActions>
                                            </StyledCard>
                                        </ListItem>
                                        {/* <ListItem hidden={!forAdoption}>
                                            <Checkbox
                                                color="default"
                                                inputProps={{ 'aria-label': 'checkboxAdoption' }}
                                            />
                                            adopted
                                        </ListItem> */}
                                        <ListItem>
                                            {id != null && deletePost != null
                                                ? <IconButton onClick={() => { deletePost?.(id) }}>
                                                    <DeleteIcon fontSize="small"/>
                                                    delete
                                                  </IconButton>
                                                : <IconButton disabled={true}>
                                                    <DeleteIcon fontSize="small"/>
                                                    missing postId or deletePost_func
                                                  </IconButton>
                                            }
                                        </ListItem>
                                        <ListItem>
                                            
                                            <IconButton onClick={(e: any) => {
                                                setShowPopover({ showPopover: false, event: e })
                                                }}
                                            >                                                
                                            <CancelIcon fontSize="small"/>
                                            cancel
                                            </IconButton>
                                        </ListItem>
                                    </List>
                                    </IonPopover> }
                        </Grid>
                    </Grid>
                }
                title= {user?.username}
                subheader={date}
             >

            </CardHeader>
            <CardMedia
                className={classes.media}
                image = {`https://proiectcolectivmybuddy.s3.eu-central-1.amazonaws.com/testFolder/${id}.jpg`}
                title="titlu imagine"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {body}{tags}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon/>
                </IconButton>
                <IconButton aria-label="message">
                    <MessageIcon/>
                </IconButton>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Descriere:</Typography>
                    <Typography paragraph>
                        descriere lungaaaaaaaaaaaaaaa
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}