import React, {useEffect} from 'react';
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
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReportIcon from '@material-ui/icons/Report';
import PersonIcon from '@material-ui/icons/Person';
import {PostProps} from "./PostProps";
import {IonAlert, IonBadge, IonFabButton, IonIcon, IonPopover} from '@ionic/react';
import "../newsfeed/newsFeed.css"
import {sendReport} from "./newsFeedApi";
import {eye} from "ionicons/icons";
import {PostMap} from "../map/PostMap";
import {Badge} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
        root: {
            width: "60%",
            // maxWidth: '85%',
            marginLeft: '20%',
            paddingTop: '1%',
            paddingBottom: '5%',
            transition: 'opacity 500ms ease-in',
            background: 'linear-gradient(90deg, #fff4f4 1%, #fff6e4 29.5%, #fff6e4 30.33%, #f8fdfd 120%) !important'
        },
        media: {
            paddingTop: '36.25%', // 16:9
            padding: '20%',
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
            backgroundColor: "#dbd55b",
            width: '6vh',
            height: '6vh',
        },

        lightbox: {
            position: "absolute",
            zIndex: 1000,
            width: "100%",
            height: "100%",
        },
        lightbox_area: {
            position: "relative",
            margin: "50px",
            background: "#fff",
            width: "400px",
            height: "300px",
            padding: "23px",
            border: "1px solid #444",
            borderRadius: "20px",
        },

    }))
;


export const Post: React.FC<PostProps> = ({id, user, body, date, latitude, longitude, tags, type}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [reported, setReported] = React.useState(false);
    const [path, setPath] = React.useState<string>("");
    const [popoverState, setShowPopover] = React.useState({showPopover: false, event: undefined});
    const [profileSrc,setProfileSrc]=React.useState<string>("");

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleReportClick = () => {
        setReported(true);
    };

    const getTags = () => {
        let tagString = ""
        tags.forEach(tag => tagString += tag + " ")
        return tagString
    }

    useEffect(()=>{
        setPath("/visit/"+user.username);
        console.log("/visit/"+user.username);
        setProfileSrc(`https://proiectcolectivmybuddy.s3.eu-central-1.amazonaws.com/testFolder/${user.username}.jpg`);
    },[])

    return (
        <Card className={classes.root}>

            {reported &&
            <IonAlert
                isOpen={true}
                onDidDismiss={() => setReported(false)}
                cssClass="my-custom-class"
                header={'REPORT'}
                subHeader={'How would you describe the problem?'}
                inputs={[
                    {
                        name: 'Fake post',
                        type: 'radio',
                        label: 'Fake post',
                        value: 'Fake post',
                        checked: true
                    },
                    {
                        name: 'Inappropriate content',
                        type: 'radio',
                        label: 'Inappropriate content',
                        value: 'Inappropriate content'
                    },
                    {
                        name: 'Spam',
                        type: 'radio',
                        label: 'Spam',
                        value: 'Spam'
                    },
                    {
                        name: 'Violence',
                        type: 'radio',
                        label: 'Violence',
                        value: 'Violence',
                    },
                    {
                        name: 'Other reason',
                        type: 'radio',
                        label: 'Other reason',
                        value: 'Other reason',
                    }
                ]}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Confirm Cancel');
                        }
                    },
                    {
                        text: 'Ok',
                        handler: (reason) => {
                            console.log(reason)
                            console.log('Confirm Ok');
                            sendReport(id, reason);
                        }
                    }
                ]}
            />}

            <IonPopover
                animated={true}
                showBackdrop={true}
                cssClass='map-popover'
                event={popoverState.event}
                isOpen={popoverState.showPopover}
                onDidDismiss={() => setShowPopover({showPopover: false, event: undefined})}>
                <PostMap
                    lat={Number(latitude)}
                    lng={Number(longitude)}
                    onMapClick={console.log('onMapClick')}
                    onMarkerClick={console.log('onMarkerClick')}
                />
            </IonPopover>

            <CardHeader
                avatar={
                    <Badge color={"error"} badgeContent={type}>
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            <img src={profileSrc} alt="R"/>
                        </Avatar>
                    </Badge>
                }
                action={
                    <IonFabButton color={"transparent"} className={"eye-button"} onClick={
                        (e: any) => {
                            e.persist();
                            setShowPopover({showPopover: true, event: e});
                        }}
                    >
                        <IonIcon className={"eye-icon"} icon={eye}/>
                    </IonFabButton>
                }
                title={`${user.username}`}
                subheader={`${date}`}
            >
            </CardHeader>
            <CardMedia
                className={classes.media}
                image={`https://proiectcolectivmybuddy.s3.eu-central-1.amazonaws.com/testFolder/${id}.jpg`}
                title="titlu imagine"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {getTags().includes("#shelter") && <IonBadge color="danger">#shelter</IonBadge>}
                    <br/>{getTags().replace("#shelter", "")}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon/>
                </IconButton>

                <IconButton aria-label="message" onClick={() => handleReportClick()}>
                    <ReportIcon/>
                </IconButton>

                <IconButton aria-label="message" href={path}>
                    <PersonIcon/>
                </IconButton>

                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more">
                    <ExpandMoreIcon/>
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>description</Typography>
                    <Typography paragraph>
                        {body}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}
