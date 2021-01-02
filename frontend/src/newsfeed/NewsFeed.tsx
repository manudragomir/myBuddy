import React, {useContext, useEffect, useState} from 'react';
import {
    IonAlert, IonButton,
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
    IonRow, IonSearchbar,
    IonSelect,
    IonSelectOption, IonSlide, IonSlides, IonSpinner, IonText,
    useIonViewWillEnter
} from '@ionic/react';
import {Post} from "./Post";
import NavBar from '../components/NavBar';
import {NewsFeedContext} from "./NewsFeedProvider";
import {RouteComponentProps} from "react-router";
import {colorFilter, sad, sadOutline} from "ionicons/icons";
import my_img from '../utils/images/all.png'
import {newsFeedTypes} from "./NewsFeedTypes";

const NewsFeed: React.FC<RouteComponentProps> = (history) => {
    const {posts, fetching, fetchingError, fetchNewsFeed, disableInfiniteScroll} = useContext(NewsFeedContext);
    const [currentType, setCurrentType] = useState<string | undefined>("All")
    const [init, setInit] = useState<boolean>(true)
    const [searchTags, setSearchTags] = useState<string[] | undefined> (undefined)
    const [tags, setTags] = useState<string[] | undefined>(undefined)
    const [tagError, setTagError] = useState(false)

    async function fetchNewsFeedPosts(allTags: string[] | undefined) {
        console.log(`[DEBUG] TAG ${allTags}`)

        await fetchNewsFeed?.(currentType, allTags);

        if (posts?.length === 0) setTagError(true)

        if (init) setInit(false);
    }

    useEffect(() => {
        if (!init) fetchNewsFeedPosts(tags)
    }, [currentType])

    useIonViewWillEnter(async () => {
        await fetchNewsFeedPosts(tags);
    });

    async function searchNext($event: CustomEvent<void>) {
        console.log("NEXT")
        await fetchNewsFeedPosts(tags);
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return (
        <IonPage>
            <IonContent className={"news-feed-content"} fullscreen>
                {console.log(posts)}
                <IonItemDivider className={"menu-row"} sticky>
                    <IonGrid>
                        <IonRow>
                            <IonCol size={"12"} size-sm >
                                <NavBar/>
                            </IonCol>
                        </IonRow>
                        <div className={"wrapper-div"}>
                            <div className={"search-bar-div"}>
                                <IonSearchbar className={"tags-search-bar"} placeholder={"search by tags"}
                                              onIonChange={(e) => {
                                                  const value = e.detail.value?.split(" ")
                                                  value?.length === 1 && value[0] === "" ? setSearchTags(undefined) : setSearchTags(value)
                                              }} animated/>
                            </div>
                            <div className={"button-search-div"}>
                                <IonButton color={"dark"} className={"search-button"}
                                           onClick={() => {setTags(searchTags); fetchNewsFeedPosts(searchTags);}}>Search</IonButton>
                            </div>
                        </div>
                    </IonGrid>
                </IonItemDivider>

                <div className="title ion-padding">
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
