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
import NavBarTest from '../components/NavBarTest';
import img from '../utils/images/column.png';
import dog from '../utils/images/dog_cut1.jpg';
import profileImg from '../utils/images/logoMyPicture.png';
import { Post } from './Post';
import { PostProps } from './PostProps';
import { PostContext } from './PostProvider';
import {Plugins} from "@capacitor/core";

const Storage = Plugins.Storage;

interface VisitUserProps extends RouteComponentProps<{
    username?: string;
}> {}


const VisitUser: React.FC<VisitUserProps> = ({history , match}) => {
    const [key, setKey] = useState('posts');

    const {posts, fetching, fetchingError, fetchPosts, disableInfiniteScroll} = useContext(PostContext);
    const [init, setInit] = useState<boolean>(true);
    const [username, setUsername] = useState<string|undefined>(undefined);

    async function fetchUserPosts() {
        await fetchPosts?.();
        //if (init) setInit(false);
    }

    useIonViewWillEnter(async () => {
        //await fetchUserPosts();
    });

    async function searchNext($event: CustomEvent<void>) {
        console.log("NEXT")
        await fetchUserPosts();
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
                                <Col lg="4">
                                    <h3>{match.params.username}</h3>
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
                                                        x.user?.username == username
                                                    ).map(({id, user, body, date, latitude, longitude, tags, type}, index) =>
                                                        (<IonCol size="6" key={index}>
                                                            <Post key={id} id={id} user={user} body={body} date={date} latitude={latitude} longitude={longitude}
                                                                  tags={tags} type={type}/>
                                                        </IonCol>)
                                                    )
                                                }
                                            </IonRow>
                                        </IonGrid>

                                    {!fetching && posts?.length === 0 &&
                                    <div className={"tag-error-div"}>
                                        <IonText>loading...</IonText>
                                    </div>
                                    }
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