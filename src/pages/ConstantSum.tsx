import "mafs/core.css";
import Big from "big.js";
import React from "react";
import {GenericFunction} from "./GenericFunction";

export const ConstantSum = () => {
  const priceFunc = (A: Big, B: Big):Big => {
    return new Big(1);
  }

  const constantCalc = (A: Big, B: Big): Big => {
    return A.add(B);
  }
  return <div>
    <GenericFunction priceFunction={priceFunc} constantCalc={constantCalc} title="Constant Sum: x + y = c" />
  </div>

};