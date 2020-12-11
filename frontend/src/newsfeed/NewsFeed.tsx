import React, {useContext, useEffect, useState} from 'react';
import {
    IonAlert,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton,
    IonGrid,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItemDivider,
    IonPage,
    IonRow,
    IonSelect,
    IonSelectOption,
    useIonViewWillEnter
} from '@ionic/react';
import {Post} from "./Post";
import NavBar from '../components/NavBar';
import {NewsFeedContext} from "./NewsFeedProvider";
import {RouteComponentProps} from "react-router";
import {colorFilter} from "ionicons/icons";

const NewsFeed: React.FC<RouteComponentProps> = (history) => {
    const {posts, fetching, fetchingError, fetchNewsFeed, disableInfiniteScroll} = useContext(NewsFeedContext);
    const [newsFeedTypes] = useState(["All", "Adoption", "MyBuddy", "Lost", "Adopted", "Found"])
    const [type, setType] = useState<string | undefined>("All")
    const [init, setInit] = useState<boolean>(true)
    const [showTags, setShowTags] = useState<boolean>(false)
    const [tags, setTags] = useState([])

    async function fetchNewsFeedPosts() {
        await fetchNewsFeed?.(type, tags);
        if (init) setInit(false);
    }

    useEffect(() => {
        if (!init) fetchNewsFeedPosts()
    }, [type])

    useEffect(() => {
        if (!init) fetchNewsFeedPosts()
    }, [tags])


    useIonViewWillEnter(async () => {
        await fetchNewsFeedPosts();
    });

    async function searchNext($event: CustomEvent<void>) {
        console.log("NEXT")
        await fetchNewsFeedPosts();
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                {console.log(posts)}
                <IonItemDivider sticky>
                    <IonGrid>
                        <IonRow>
                            <IonCol size={"12"} size-sm>
                                <NavBar/>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonSelect value={type} placeholder="Select Type"
                                           onIonChange={e => setType(e.detail.value)}>
                                    {newsFeedTypes.map(type =>
                                        <IonSelectOption key={type} value={type}>{type}</IonSelectOption>)}
                                </IonSelect>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonItemDivider>

                {posts?.map(({id, user, body, date, latitude, longitude, tags, type}) =>
                    <Post key={id} id={id} user={user} body={body} date={date} latitude={latitude} longitude={longitude}
                          tags={tags} type={type}/>
                )}

                <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                                   onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading more buddies...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => setShowTags(true)}>
                        <IonIcon icon={colorFilter}/>
                    </IonFabButton>
                </IonFab>

                {showTags &&
                <IonAlert
                    isOpen={true}
                    onDidDismiss={() => setShowTags(false)}
                    cssClass="my-custom-class"
                    header={'TAGS'}
                    subHeader={'Choose your favorite tags'}
                    inputs={[
                        {
                            name: '#dog',
                            type: 'checkbox',
                            label: '#dog',
                            value: '#dog',
                        },
                        {
                            name: '#cat',
                            type: 'checkbox',
                            label: '#cat',
                            value: '#cat'
                        },
                        {
                            name: '#funny',
                            type: 'radio',
                            label: '#funny',
                            value: '#funny'
                        },
                        {
                            name: '#chameleon',
                            type: 'checkbox',
                            label: '#chameleion',
                            value: '#chameleon',
                        },
                        {
                            name: '#friendly',
                            type: 'checkbox',
                            label: '#friendly',
                            value: '#friendly',
                        },
                        {
                            name: '#horse',
                            type: 'checkbox',
                            label: '#horse',
                            value: '#horse',
                        },
                        {
                            name: '#cute',
                            type: 'checkbox',
                            label: '#cute',
                            value: '#cute',
                        },
                        {
                            name: '#rabbit',
                            type: 'checkbox',
                            label: '#rabbit',
                            value: '#rabbit',
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
                            text: 'Filter',
                            handler: (tags) => {
                                console.log(tags)
                                console.log('Confirm Ok');
                                setTags(tags)
                            }
                        }
                    ]}
                />}
            </IonContent>
        </IonPage>
    );
};

export default NewsFeed;
