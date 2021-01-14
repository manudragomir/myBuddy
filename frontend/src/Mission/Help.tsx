import React, {useContext, useEffect, useState} from 'react';
import {

    IonContent,

    IonImg,

    IonPage,

} from '@ionic/react';

import NavBar from '../components/NavBar';

import {RouteComponentProps} from "react-router";

import "./Mission.css";
import poza1 from  '../utils/images/poza1.jpg'
import poza2 from  '../utils/images/poza2Help.jpg'
import {Col, Container, Row} from "react-bootstrap";
import {Plugins} from "@capacitor/core";
import { NavBarUser } from '../components/NavBarUser';
const Storage = Plugins.Storage;


const Help: React.FC<RouteComponentProps> = () => {
    const [auth, setAuth] = useState(false);
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        (async () => {
            const storage = await Storage.get({ key: 'username' });
            if(storage.value){
                setAuth(true);
                setUsername(storage.value);
            }
        })();
    });

    return (
        <IonPage>
            <IonContent className={"mission-page-content"} fullscreen>
                {auth ? <NavBarUser username={username}/> : <NavBar/>}
                <Container>
                    <Row>
                        <Col >
                            <IonImg src={poza1} className="poza1"  >
                            </IonImg>
                        </Col>
                        <Col style={{marginTop:'40px'}}>
                            <div className="titlu"> Cum functioneaza?</div>
                            <div className="textStyle" >Fiecare membru poate să-și creeze un cont pe
                                platforma noastră, unde va avea posibilitatea să-și
                                contureze un profil personal (hobby-uri, personalitate,
                                calități, defecte etc.). El va putea adăuga poze cu
                                animăluțele sale, descrieri etc..</div>
                            <div className="textStyle" >
                                <div className="titlu2"> Find Me A New Family</div>
                                Poate adăuga anunțuri cu animăluțe cărora se dorește să li găsească o nouă familie. Cei
                                interesați vor putea filtra anunțurile în funcție de preferințe (specie, rasă, vârstă, culoare), dar vor
                                avea și posibilitatea găsirea amicului perfect.  Ne dorim tare să-i avem ca utilizatori și pe cei din serviciile de gestionare a
                                câinilor fără stăpân - persoane din serviciul de ecarisaj - pentru a încuraja adoptarea câinilor din
                                aceste centre. Ei vor putea adăuga anunțuri, care vor fi întotdeauna recomandate de către noi.
                                </div>

                        </Col>
                    </Row>
                    <Row>
                        <Col style={{marginTop:'40px'}}>
                            <div className="titlu2"> Lost My Pet</div>
                            <div className="textStyle" >
                                Pierderea unui animăluț provoacă o durere imensă, însă bucuria revederii este și mai mare, de aceea
                                ne dorim crearea unui mediu în care oamenii vor putea posta articole/tweet-uri cu animăluțe de pe
                                stradă, care par agitate, care au zgardă, dar niciun proprietar în împrejurimi. Se vor putea adăuga
                                poze, locația exactă unde a fost văzut animalul și alte detalii necesare. Totodată, și cei care sunt în
                                situația neplăcută a pierderii animalului, vor putea anunța acest lucru în comunitate. Similar, ei pot
                                adăuga poze, numele la care răspunde animalul și locația unde a fost văzut ultima oară.</div>
                            <div className="textStyle" >
                                <div className="titlu2"> Be A Better Friend For Your Pet</div>

                                Dorim să oferim membrilor posibilitatea de a da sfaturi sau de a ajunge ușor la ele. Astfel, se vor
                                putea adăuga articole cu sfaturi utile despre cum să-ți crești mai bine animăluțul: alimentație
                                sănătoasă, locuri de plimbat pentru căței sau pisici, sfaturi pentru cei care au arici sau peruși, etc.

                            </div>

                        </Col>
                        <Col>
                            <IonImg src={poza2} className="poza1"  >
                            </IonImg>

                        </Col>
                    </Row>
                </Container>



            </IonContent>
        </IonPage>
    );
};

export default Help;
