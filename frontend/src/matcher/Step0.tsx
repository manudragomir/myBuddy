import React from "react";
import { StepComponentProps } from "react-step-builder";
import DogAnimation from "./DogAnimation";
import './matcherQuestionnaire.css'

const Step0 = (props: StepComponentProps) => {
    return (
      <div>
        <div className="question-box-start">
        <h1>Match Your Breed</h1>
        <p>We all love dogs here. All of them. From little Chihuaha to German Shepherd. But have you wondered what is the breed that match your personality and your needs the most? 
            Here you can find out. Complete our questionnaire and our AI will recommend you the closest three breed matches.
        </p>
        
        <button className="my-btn" onClick={props.next}>
            Start
        </button>

        </div>


        <footer>
            <DogAnimation/>
        </footer>
      </div>
      
      
    );
};
export default Step0;