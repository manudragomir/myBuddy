import React from "react";
import FinalStep from "./FinalStep";
import Step0 from "./Step0";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { Steps, Step } from "react-step-builder";
import Step3 from "./Step3";

const Matcher: React.FC = () => {
  return (
    <div className="matcher">
      <Steps>
        <Step component={Step0} />
        <Step component={Step1} />
        <Step component={Step2} />
        <Step component={Step3} />
        <Step component={FinalStep} />
      </Steps>

    </div>
  );
}
export default Matcher;