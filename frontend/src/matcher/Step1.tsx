import React, { useEffect, useState } from "react";
import { StepComponentProps } from "react-step-builder";
import './matcherQuestionnaire.css';
import { hardcodedOptions } from "./optionItems";
import './selection.css';

const Step1 = (props: StepComponentProps) => {
    let optionItems = hardcodedOptions.map((opt: string) => <option key={opt}>{opt}</option>);
    const [purpose1, SetPurpose1] = useState<string>("DEFAULT");
    const [purpose2, SetPurpose2] = useState<string>("DEFAULT");
    const [isHidden, SetIsHidden] = useState<boolean>(true);

    useEffect( () => {
      if(props.state["purpose1"])
        SetPurpose1(props.state["purpose1"].toString());
      if(props.state["purpose2"])
        SetPurpose2(props.state["purpose2"].toString());
    }, []);

    useEffect( () => {
      if(purpose1 == "DEFAULT" && purpose2 == "DEFAULT"){
        SetIsHidden(true);
      }
      else{
        SetIsHidden(false);
      }
    }, [purpose1, purpose2]);

    const clickNext = () => {
      if(purpose1 == "DEFAULT"){
        SetPurpose1(purpose2);
        SetPurpose2("DEFAULT");
      }
      props.state["purpose1"] = purpose1;
      props.state["purpose2"] = purpose2;
      props.next(); 
    };

    return (
      <div>
        <div className="question-box">
        <h2>What do you want from your dog?</h2>
        <h6>You must choose at least one.</h6>

        <div className="select">
          <select name="purpose1" id="purpose1" value={purpose1} onChange={(e) => {SetPurpose1(e.target.value)}}>
            <option value="DEFAULT">Choose an option</option>
            {optionItems}
          </select>
        </div>

        <div className="select">
          <select name="purpose2" id="purpose2" value={purpose2} onChange={(e) => {SetPurpose2(e.target.value)}}>
          <option value="DEFAULT">Choose an option</option>
            {optionItems}
          </select>
        </div>

        </div>

        <button onClick={clickNext} className="my-btn" style={{left:"80%"}} hidden={isHidden}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Next
        </button>
      </div>
      
    );
};

export default Step1;