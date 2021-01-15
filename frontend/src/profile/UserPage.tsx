import React, {useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {IonCol, IonContent, IonGrid, IonImg, IonPage, IonRow, IonLoading, useIonViewWillEnter, IonToast, IonText, IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/react';
import {Button, Col, Container, Image, Row, Tab, Tabs} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {NavBarUser} from '../components/NavBarUser';
import img from '../utils/images/column.png';
import dog from '../utils/images/dog_cut1.jpg';
import profileImg from '../utils/images/logoMyPicture.png';
import { Post } from './Post';
import { PostProps } from './PostProps';
import { PostContext } from './PostProvider';
import {Plugins} from "@capacitor/core";

const Storage = Plugins.Storage;

/*
    The component shows the profile of the current logged user
    It provides the posts of the logged user and information regarding the user's personal data
 */
const UserPage: React.FC<RouteComponentProps> = ({history}) => {
    const [key, setKey] = useState('posts');
   
    const {posts,deleting, deleteError, fetching,getData, fetchingError, fetchPosts, disableInfiniteScroll} = useContext(PostContext);
    const [init, setInit] = useState<boolean>(true);
    const [username, setUsername] = useState<string|undefined>(undefined);
    const [src,setSrc]=useState<string>("");

    const [hasImage, setHasImage] = useState<boolean>(false);
    const [desc, setDesc]=useState<string>("About you");
    const [phone, setPhone]=useState<string>("Phone number...");
    const [email, setEmail]=useState<string>("Email...");
    

    async function fetchUserPosts() {
        await fetchPosts?.();
        if (init) setInit(false);
    }

    useIonViewWillEnter(async () => {
        //await fetchUserPosts();
    });

    useEffect(()=>{
        setSrc(`https://proiectcolectivmybuddy.s3.eu-central-1.amazonaws.com/testFolder/${username}.jpg`);
    },[username])
    useEffect(() => {
        if(init) fetchUserPosts();
        console.log(posts);
    }, [])

    async function searchNext($event: CustomEvent<void>) {
        console.log("NEXT")
        await fetchUserPosts();
        await ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    useEffect(()=>{
        (async () => {
            const user = await Storage.get({ key: 'username' });
            if(user.value){
                setUsername(user.value);
                const response=getData?.(user.value);
                response?.then(res=>{
                    setEmail(res.email);
                    setPhone(res.phone);
                    setDesc(res.desc);
                    setHasImage(res.has);
                });
                setSrc(`https://proiectcolectivmybuddy.s3.eu-central-1.amazonaws.com/testFolder/${username}.jpg`);
            }

        })();
    });

    useEffect(()=>{
        setSrc(`https://proiectcolectivmybuddy.s3.eu-central-1.amazonaws.com/testFolder/${username}.jpg`);
    },[hasImage]);

    return (
        <IonPage>
            <IonContent>
                <NavBarUser username={username} />
                <Container fluid style={{height: "100%"}}>
                    <Row style={{height: "10px"}}>
                        <Image src={dog} fluid style={{opacity: "60%"}}/>
                        <Col lg="2"></Col>
                        <Col lg="8">
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={key}
                                onSelect={k => k && setKey(k)}
                            >
                                <Tab eventKey="posts" title="Posts">
                                    {posts?.filter((x)=>
                                        x.user?.username == username
                                    ).map(({id, user, body, date, latitude, longitude, tags, type}) =>
                                        <Post key={id} id={id} user={user} body={body} date={date} latitude={latitude} longitude={longitude}
                                              tags={tags} type={type}/>
                                    )}


                                    <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                                                       onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                                        <IonInfiniteScrollContent
                                            loadingText="Loading more buddies...">
                                        </IonInfiniteScrollContent>
                                    </IonInfiniteScroll>
                                    {/* <Post key={`1`} id="1" date="2020-11-11"  body="body" tags={["#dog"]}></Post> */}
                                </Tab>
                            </Tabs>
                        </Col>
                        <Col lg="2"></Col>
                    </Row>
                    <Row>
                        <Col lg="2">
                            {/* <Image src={img} fluid/> */}
                        </Col>
                        <Col lg="8">
                            <Row>
                                <Col lg="3">
                                    {hasImage? <Image src={src} roundedCircle/>
                                    :  <Image src={profileImg} roundedCircle/>}
                                </Col>
                                <Col lg="4">
                                    <h1>{username}</h1>
                                    <h6 style={{color: "black"}}>{desc}</h6>
                                    <h6 style={{color: "black"}}>{email}</h6>
                                    <h6 style={{color: "black"}}>{phone}</h6>
                                    <Button onClick={() => {
                                        return history.push(`/user/edit/${username}`)
                                    }} variant="secondary">Edit Profile</Button>
                                    <Button onClick={() => {
                                        return history.push("/user/post")
                                    }} variant="secondary">Add Post</Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="2">
                            {/* <Image src={img} fluid/> */}
                        </Col>
                    </Row>

                </Container>

                <IonLoading isOpen={deleting}/>
                <IonToast
                  isOpen={(deleteError != null)}
                  message={deleteError?.message || "Network Error while deleting"}
                  position="bottom"
                  buttons={[
                      {
                          side: 'end',
                          text: 'Dismiss',
                          role: 'cancel',
                      }
                  ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default UserPage;