import { IonItem, IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import React, {useState, useEffect, ChangeEvent} from "react";
import { StepComponentProps } from "react-step-builder";
import { getDogSkills } from "./apiCalls";
import './matcherQuestionnaire.css';
import './selection.css';


const Step2 = (props: StepComponentProps) => {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [optionSkills, setOptionSkills] = useState<string[]>([]);
    const [optionItems, setOptionsItems] = useState<any>();

    useEffect(() => {
        getDogSkills().then(e => setOptionSkills(e));
        console.log("get server", props.state["skillsWanted"]);
        setSelectedSkills(props.state["skillsWanted"] as string[]);
    }, []);

    useEffect( () => {
        console.log("apelat", props.state["skillsWanted"])
        if(selectedSkills !== [])
            props.state["skillsWanted"] = selectedSkills;
        console.log("save in props", props.state["skillsWanted"])
    }, [selectedSkills]);

    useEffect(() => {
      setOptionsItems(optionSkills.map((opt: string) => <IonSelectOption key={opt} value={opt}>{opt}</IonSelectOption>));
    }, [optionSkills]);
    
    return (
      <div>
        <div className="question-box">
        <h2>Choose 5 skills that you think your dog should have.</h2>
        <h6>Don't forget. It is said that dogs look like their owner, so you could simply match the skills you have.</h6>        
        

        <IonItem>
            <IonLabel>Skills</IonLabel>
            <IonSelect value={selectedSkills} multiple={true} cancelText="Nope" okText="Okay!" 
                        onIonChange={(e) => {setSelectedSkills(e.detail.value);}}>
              {optionItems}
            </IonSelect>
          </IonItem>
          
        {/* <select className="selectpicker" value={selectedSkills} name="skills" id="skills" multiple style={{height:"80%", width:"80%"}} onChange={(e) => {handleChange(e);}}>
          {optionItems}
        </select> */}

        </div>

        <button onClick={props.next} className="my-btn" style={{left:"80%"}}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Next
        </button>

        <button onClick={props.prev} className="my-btn" style={{margin:"0"}}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Prev
        </button>
        
      </div>
    );
};

export default Step2;