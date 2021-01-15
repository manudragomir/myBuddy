import React, {useContext, useEffect, useState} from 'react';
import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonPage,
    IonRange,
    IonRow,
    IonSearchbar,
    IonSlide,
    IonSlides,
    IonText,
    useIonViewWillEnter
} from '@ionic/react';
import {Post} from "./Post";
import NavBar from '../components/NavBar';
import {NewsFeedContext} from "./NewsFeedProvider";
import {RouteComponentProps} from "react-router";
import {newsFeedTypes} from "./NewsFeedTypes";
import {location} from "ionicons/icons";

import {Plugins} from "@capacitor/core";
import { NavBarUser } from '../components/NavBarUser';
const Storage = Plugins.Storage;

const NewsFeed: React.FC<RouteComponentProps> = (history) => {
    const {posts, fetching, fetchingError, fetchNewsFeed, disableInfiniteScroll} = useContext(NewsFeedContext);
    const [currentType, setCurrentType] = useState<string | undefined>("All")
    const [init, setInit] = useState<boolean>(true)
    const [searchTags, setSearchTags] = useState<string[] | undefined>(undefined)
    const [tags, setTags] = useState<string[] | undefined>(undefined)
    const [tagError, setTagError] = useState(false)
    const [value, setValue] = useState(0);
    const [firstLoad, setFirstLoad] = useState(true);
    const [rangeValue, setRangeValue] = useState<number>(0);

    const [auth, setAuth] = useState(false);
    const [username, setUsername] = useState<string>("");

    async function fetchNewsFeedPosts(rangeValue: number, allTags: string[] | undefined) {
        await fetchNewsFeed?.(rangeValue, currentType, allTags);

        if (posts?.length === 0) setTagError(true)

        if (init) setInit(false);
    }

    useEffect(() => {
        console.log(`EFFECT>>>> ${rangeValue}`)
        if (!init) fetchNewsFeedPosts(rangeValue, tags)
    }, [rangeValue])

    useEffect(() => {
        if (!init) fetchNewsFeedPosts(rangeValue, tags)
    }, [currentType])

    useIonViewWillEnter(async () => {
        await fetchNewsFeedPosts(rangeValue, tags);
    });

    useEffect(() => {
        (async () => {
            const storage = await Storage.get({ key: 'username' });
            if(storage.value){
                setAuth(true);
                setUsername(storage.value);
            }
        })();
    });
   

    async function searchNext($event: CustomEvent<void>) {
        console.log("NEXT")
        await fetchNewsFeedPosts(rangeValue, tags);
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return (
        <IonPage>
            <IonContent className={"news-feed-content"} fullscreen>
                {console.log(posts)}
                {auth ? <NavBarUser username={username} /> : <NavBar/>}
                <IonItemDivider className={"menu-row"} sticky style={{zIndex: 40}}>
                    <IonGrid>
                        <div className={"wrapper-div"}>
                            <div className={"search-area-div"}>
                                <IonItem className={"search-item"}>
                                    <IonText>search area</IonText>
                                    <IonRange debounce={300} color={"danger"} dualKnobs={false} min={0} max={100}
                                              step={20} snaps={true}
                                              onIonChange={e => setRangeValue(e.detail.value as number)}>
                                        <IonIcon slot="start" icon={location}/>
                                    </IonRange>
                                    {rangeValue === 0 && <IonLabel>everywhere</IonLabel>}
                                    {rangeValue !== 0 && <IonLabel>{rangeValue} km far</IonLabel>}
                                </IonItem>
                            </div>
                            <div className={"search-bar-div"}>
                                <IonSearchbar className={"tags-search-bar"} placeholder={"search by tags"}
                                              onIonChange={(e) => {
                                                  const value = e.detail.value?.split(" ")
                                                  value?.length === 1 && value[0] === "" ? setSearchTags(undefined) : setSearchTags(value)
                                              }} animated/>
                            </div>
                            <div className={"button-search-div"}>
                                <IonButton color={"dark"} className={"search-button"}
                                           onClick={() => {
                                               setTags(searchTags);
                                               fetchNewsFeedPosts(rangeValue, searchTags);
                                           }}>Search</IonButton>
                            </div>
                        </div>
                    </IonGrid>
                </IonItemDivider>
                <div className="title ion-padding" >
                    <h3>Types</h3>
                </div>

                <div className="category-slider ion-padding-start">
                    <IonSlides
                        options={{slidesPerView: "auto", zoom: false, grabCursor: true}}
                    >
                        {newsFeedTypes.map(type =>
                            <IonSlide key={type.typeName}>
                                <IonCol onClick={() => {
                                    setCurrentType(type.typeName)
                                }} key={type.typeName} class={"category-col"}>
                                    <img
                                        className={currentType === type.typeName ? "type-img selected-img" : "type-img"}
                                        alt={type.typeName} src={type.image}/>
                                </IonCol>
                            </IonSlide>
                        )}
                    </IonSlides>
                </div>

                <div className="title ion-padding">
                    <h3>Posts</h3>
                </div>

                {posts?.map(({id, user, body, date, latitude, longitude, tags, type}) =>
                    <Post key={id} id={id} user={user} body={body} date={date} latitude={latitude} longitude={longitude}
                          tags={tags} type={type}/>
                )}

                {!fetching && posts?.length === 0 &&
                <div className={"tag-error-div"}>
                    <IonText>no post matches your search...</IonText>
                </div>
                }
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
