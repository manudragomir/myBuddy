import { IonBackButton, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg, IonLabel } from "@ionic/react";
import axios from "axios";
import React, {useState, useEffect} from "react";
import { StepComponentProps } from "react-step-builder";
import { matchDogBreed } from "./apiCalls";
import { Dog } from "./Dog";
import './matcherQuestionnaire.css';
import './selection.css';

const FinalStep = (props: StepComponentProps) => {
  const [hidden, setHidden] = useState<boolean>(false);
  const [breedName, setBreedName] = useState<string | undefined>(undefined);
  const [breedImgSrc, setBreedImgSrc] = useState<string | undefined>(undefined);
  const [imageAvailable, setImageAvailable] = useState<boolean>(false);

  async function fetchPhoto(breed: string)  {
    const url: string = `https://dog.ceo/api/breed/${breed}/images/random`;

    axios.get(url)
      .then((res) => {
        setBreedImgSrc(res.data.message);
        setImageAvailable(true);
    })
      .catch((err) => 
        {
          setImageAvailable(false);
      });
  }

  function getPartAfterSlash(inputString: string){
    const idx = inputString.lastIndexOf('/');
    return inputString.substring(idx + 1);
  }

  const submit = () => {
    const purpose1 = props.state["purpose1"];
    const purpose2 = props.state["purpose2"];
    const dimension = props.state["weight"];
    const price = props.state["price"];
    const watchdog = props.state["watchdog"];
    const skills = props.state["skillsWanted"];
    if(purpose1 && dimension && price && watchdog && skills){
        matchDogBreed(getPartAfterSlash(purpose1 as string), getPartAfterSlash(purpose2 as string), dimension as number,
                      skills as string[],
                      price as number, 
                      watchdog as number)
                      .then((res) => {
                        setImageAvailable(true);
                                      console.log(res); setBreedName(res.name);
                                      setHidden(true);
                                      const retBreedName = res.name.toLocaleLowerCase();
                                      const arrBreedName = retBreedName.split(' ');
                                      if(arrBreedName.length == 1){
                                        fetchPhoto(retBreedName);
                                      }
                                      else if(arrBreedName.length == 2){
                                        fetchPhoto(arrBreedName[1] + '/' + arrBreedName[0]);
                                      }
                                      else{
                                        fetchPhoto(retBreedName); 
                                      }
                                      })
                      .catch((err) => {setImageAvailable(false);});
    }
  }

    return (
      <div>
        <div hidden={hidden}>
          <div className="question-box">
            <h2>Ready to find out?</h2>

            <button onClick={submit} className="my-btn" style={{left:"80%"}}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Done
            </button>

          </div>

          <button onClick={props.prev} className="my-btn" style={{margin:"2vw"}}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
              Prev
          </button>
        </div>

        <div hidden={!hidden}>
          <div className="question-box">
            <h4>Your breed is:</h4>
            <h1>{breedName}</h1>
            <IonImg src={breedImgSrc} hidden={!imageAvailable} style={{width: "40vw"}}/>
            <IonImg src="https://http.cat/404" hidden={imageAvailable} style={{width: "40vw"}}/>
            <IonLabel hidden={imageAvailable}>Not image found for this breed</IonLabel>
          </div>
          <IonButton href="/user">Main page</IonButton>
        </div>
        
        
      </div>

    );
};

export default FinalStep;