import React, {useState} from 'react';
import {IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonPage, useIonViewWillEnter} from '@ionic/react';
import {Post} from "./Post";
import NavBar from '../components/NavBar';

const NewsFeed: React.FC = () => {
    const [items, setItems] = useState<string[]>([]);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);

    async function fetchData() {
        console.log("FETCH DATA");
        const url: string = 'https://dog.ceo/api/breeds/image/random/3';
        const res: Response = await fetch(url);
        res
            .json()
            .then(async (res) => {
                if (res && res.message && res.message.length > 0) {
                    setItems([...items, ...res.message]);
                    setDisableInfiniteScroll(res.message.length < 3);
                } else {
                    setDisableInfiniteScroll(true);
                }
            })
            .catch(err => console.error(err));
    }

    useIonViewWillEnter(async () => {
        await fetchData();
    });

    async function searchNext($event: CustomEvent<void>) {
        await fetchData();
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return (
        <IonPage>
            <IonContent fullscreen>
            <NavBar/>
            {items.map((item: string, i: number) => {
                return <Post key={`${i}`} image={item}></Post>
            })}
            <IonInfiniteScroll disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                <IonInfiniteScrollContent
                    loadingText="loading...">
                </IonInfiniteScrollContent>
            </IonInfiniteScroll>
            </IonContent>
        </IonPage>
        
    );
};

export default NewsFeed;
