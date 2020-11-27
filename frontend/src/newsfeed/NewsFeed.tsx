import React, {useContext, useState} from 'react';
import {IonContent, IonList, IonPage} from '@ionic/react';
import {Post} from "./Post";
import NavBar from '../components/NavBar';
import {NewsFeedContext} from "./NewsFeedProvider";
import {RouteComponentProps} from "react-router";
import {PostProps} from "./PostProps";

const NewsFeed: React.FC<RouteComponentProps> = (history) => {
    const [items, setItems] = useState<PostProps[]>([]);
    const {posts, fetching, fetchingError} = useContext(NewsFeedContext);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);

    //pagination will be implemented soon.
    return (
        <IonPage>
            <IonContent fullscreen>
                {console.log(posts)}
                <NavBar/>
                <IonList>
                    {posts?.map(({id, body, date, latitude, longitude, user_id, tags}) =>
                        <Post key={id} id={id} body={body} date={date} latitude={latitude} longitude={longitude}
                              user_id={user_id} tags={tags}/>
                    )}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default NewsFeed;
