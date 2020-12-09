import React, {useContext, useState} from 'react';
import {
    IonCol,
    IonContent,
    IonGrid,
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
import {PostProps} from "./PostProps";
import {getNewsFeed} from "./newsFeedApi";

const NewsFeed: React.FC<RouteComponentProps> = (history) => {
    const {posts, fetching, fetchingError, fetchNewsFeed, disableInfiniteScroll} = useContext(NewsFeedContext);
    const [newsFeedTypes] = useState(["All", "Adoption", "Lost", "Adopted", "Found", "MyBuddy"])
    const [filter, setFilter] = useState<string | undefined>(undefined);

    async function fetchNewsFeedPosts() {
        await fetchNewsFeed?.();
    }

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
                                <IonSelect value={filter} placeholder="Select Type"
                                           onIonChange={e => setFilter(e.detail.value)}>
                                    {newsFeedTypes.map(type => <IonSelectOption key={type}
                                                                                value={type}>{type}</IonSelectOption>)}
                                </IonSelect>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonItemDivider>

                {posts?.map(({id, user, body, date, latitude, longitude, tags}) =>
                    <Post key={id} id={id} user={user} body={body} date={date} latitude={latitude} longitude={longitude}
                          tags={tags}/>
                )}

                <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                                   onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading more buddies...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
};

export default NewsFeed;
