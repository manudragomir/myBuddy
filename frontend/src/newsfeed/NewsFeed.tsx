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
    const {posts, fetching, fetchingError} = useContext(NewsFeedContext);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [newsFeedPosts, setNewsFeedPosts] = useState<PostProps[]>([])
    const [newsFeedTypes] = useState(["All", "Adoption", "Lost", "Adopted", "Found", "MyBuddy"])
    const [filter, setFilter] = useState<string | undefined>(undefined);
    const SIZE = 2;

    async function fetchNewsFeedPosts() {
        try {
            const posts = await getNewsFeed(page, SIZE);
            if (posts.length > 0) {
                setNewsFeedPosts([...newsFeedPosts, ...posts]);
                setPage(page + 1);
                setDisableInfiniteScroll(posts.length < SIZE);
            } else {
                setDisableInfiniteScroll(true);
            }
        } catch (error) {
            console.log(error);
        }

    }

    useIonViewWillEnter(async () => {
        await fetchNewsFeedPosts();
    });

    async function searchNext($event: CustomEvent<void>) {
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

                {newsFeedPosts?.map(({id, user, body, date, latitude, longitude, tags}) =>
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
