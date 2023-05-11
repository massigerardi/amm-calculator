import Big from "big.js";
import "mafs/core.css";
import React from "react";
import {GenericFunction} from "./GenericFunction";

export const ConstantFunction = () => {
  const priceFunc = (A: Big, B: Big): Big => {
    return A.div(B);
  }

  const constantCalc = (A: Big, B: Big): Big => {
    return A.pow(2).add(B.mul(new Big(5)));
  }


  return <div>
    <GenericFunction priceFunction={priceFunc} constantCalc={constantCalc} title="x^2 + 5 * y = c TODO" priceFunctionDesc="???"/>
  </div>

};