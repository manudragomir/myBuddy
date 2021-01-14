import React, {useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {
    IonCol,
    IonContent,
    IonGrid,
    IonImg,
    IonInfiniteScroll, IonInfiniteScrollContent,
    IonPage,
    IonRow,
    IonText,
    useIonViewWillEnter
} from '@ionic/react';
import {Button, Col, Container, Image, Row, Tab, Tabs} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBarUser from '../components/NavBarUser';
import profileImg from '../utils/images/logoMyPicture.png';
import { Post } from './Post';
import { PostContext } from './PostProvider';

interface VisitUserProps extends RouteComponentProps<{
    username?: string;
}> {}

/*
    The VisitUser component is similar to the UserPage, but this is presenting the information of other users than the one who is logged in
    The posts are the belonging to the user to whose profile is visited
 */
const VisitUser: React.FC<VisitUserProps> = ({history , match}) => {
    const [key, setKey] = useState('posts');

    const {posts, fetching, fetchingError, fetchPosts, disableInfiniteScroll} = useContext(PostContext);
    const [init, setInit] = useState<boolean>(true);
    const [username, setUsername] = useState<string|undefined>(undefined);

    // async function fetchUserPosts() {
    //     await fetchPosts?.();
    //     if (init) setInit(false);
    // }

    // useIonViewWillEnter(async () => {
    //     //await fetchUserPosts();
    // });

    useEffect(() => {
            (async ()=> {
                if(init) {
                    await fetchPosts?.();
                    // setInit(false);
                }
            })();
    },[])

    async function searchNext($event: CustomEvent<void>) {
        console.log("NEXT")
        await fetchPosts?.();
        await ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    useEffect(()=>{
        const user = match.params.username;
        setUsername(user);
    },[])

    return (
        <IonPage>
            <IonContent className={"news-feed-content"}>
                <NavBarUser/>
                <Container fluid style={{height: "100%"}}>
                    <Row>
                        <Col lg="2">
                            {/* <Image src={img} fluid/> */}
                        </Col>
                        <Col lg="8">
                            <Row>
                                <Col lg="3">
                                    <Image src={profileImg} roundedCircle/>
                                </Col>
                                <Col lg="4" style={{padding:"70px"}}>
                                    <p style={{fontSize: "70px", fontFamily: "Josefin Slab"}}>{match.params.username}</p>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="2">
                            {/* <Image src={img} fluid/> */}
                        </Col>
                    </Row>
                    <Row style={{height: "10px"}}>
                        {/*<Image src={dog} fluid/>*/}
                        <br/>
                        <Col lg="2"></Col>
                        <Col lg="8">
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={key}
                                onSelect={k => k && setKey(k)}
                            >
                                <Tab eventKey="posts" title="Posts">
                                        <IonGrid>
                                            <IonRow>
                                                {
                                                    posts?.filter((x)=>
                                                        x.user?.username === username
                                                    ).map(({id, user, body, date, latitude, longitude, tags, type}, index) =>
                                                        (<IonCol size="6" key={index}>
                                                            <Post key={id} id={id} user={user} body={body} date={date} latitude={latitude} longitude={longitude}
                                                                  tags={tags} type={type}/>
                                                        </IonCol>)
                                                    )
                                                }
                                            </IonRow>
                                        </IonGrid>
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

                </Container>
            </IonContent>
        </IonPage>
    );
};

export default VisitUser;