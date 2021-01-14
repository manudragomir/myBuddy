import React, {useState, useEffect} from "react";
import { StepComponentProps } from "react-step-builder";
import './matcherQuestionnaire.css';
import { hardcodedOptions } from "./optionItems";
import './selection.css';

const Step3 = (props: StepComponentProps) => {
    const [price, setPrice] = useState<number>(400);
    const [watchdog, setWatchdog] = useState<number>(5);
    const [dimensions, setDimensions] = useState<number>(5);

    useEffect( () => {
        if(props.state["price"]) setPrice(parseInt(props.state["price"].toString()));
        if(props.state["weight"]) setDimensions(parseInt(props.state["weight"].toString()));
        if(props.state["watchdog"]) setWatchdog(parseInt(props.state["watchdog"].toString()));
    }, []);

    useEffect( () => {props.state["price"] = price}, [price]);
    useEffect( () => {props.state["watchdog"] = watchdog}, [watchdog]);
    useEffect( () => {props.state["weight"] = dimensions}, [dimensions]);

    const setDimensionsMine = (dimensions: number) => {
        setDimensions(Math.min(Math.max(0, dimensions), 100));
    }

    const setPriceMine = (price: number) => {
        setPrice(Math.min(Math.max(0, price), 3000));
    }

    const setWatchdogMine = (watchdog: number) => {
        setWatchdog(Math.min(Math.max(1, watchdog), 10));
    }

    return (
      <div>
        <div className="question-box">
        <h2>Some final choices</h2>

        <div className="user-box">
            <input type="number" name="price" id="price" required value={price} min="0" max="3000" onChange={(e) => {setPriceMine(parseInt(e.target.value))}}/>
            <label>How much would you pay for a dog? Average price for a puppy in LEI is 400.</label>
        </div>

        <div className="user-box">
            <input type="number" name="watchdog" id="watchdog" required value={watchdog} min="1" max="10" onChange={(e) => {setWatchdogMine(parseInt(e.target.value))}}/>
            <label>From a scale of 1 to 10, how much do you need the dog to protect your property?</label>
        </div>

        <div className="user-box">
            <input type="number" name="dimensions" id="dimensions" required value={dimensions} min="1" max="100" onChange={(e) => {setDimensionsMine(parseInt(e.target.value))}}/>
            <label>How many kg do you want your dog to have? small is &lt; 5 kg, big is &gt; 15kg, and medium is between</label>
        </div>

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

export default Step3;