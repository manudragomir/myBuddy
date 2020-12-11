import React from 'react';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReportIcon from '@material-ui/icons/Report';
import {PostProps} from "./PostProps";
import {IonAlert} from '@ionic/react';
import "../newsfeed/newsFeed.css"
import {sendReport} from "./newsFeedApi";


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
            backgroundColor: "#dbd55b",
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


export const Post: React.FC<PostProps> = ({id,user, body, date, latitude, longitude, tags, type}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [reported, setReported] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleReportClick = () => {
        setReported(true);
    };

    const getTags = ()=>{
        let tagString=""
        tags.forEach(tag=> tagString+=tag+" ")
        return tagString
    }

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

                            sendReport(Number(id),reason);
                        }
                    }
                ]}
            />}
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        R
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={`${user.username}`}
                subheader={`${date} | ${latitude} ${longitude}`}
            >
            </CardHeader>
            <CardMedia
                className={classes.media}
                image={`https://proiectcolectivmybuddy.s3.eu-central-1.amazonaws.com/testFolder/${id}.jpg`}
                title="titlu imagine"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    TAGS: {getTags()}
                    <br/>
                    TYPE: {type.toString()}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon/>
                </IconButton>


                <IconButton aria-label="message" onClick={() => handleReportClick()}>
                    <ReportIcon/>
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
                    <Typography paragraph>description</Typography>
                    <Typography paragraph>
                        {body}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}