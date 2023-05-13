import Big from "big.js";
import "mafs/core.css";
import React from "react";
import {HighLevelFunction} from "./HighLevelFunction";

export const ConstantFunction = () => {
  const priceFunc = (Y: Big, X: Big, dx: Big): Big => {
    return X.mul(2).minus(dx).div(5);
  }

  const constantCalc = (X: Big, Y: Big): Big => {
    return X.pow(2).add(Y.mul(new Big(5)));
  }


  return <div>
    <HighLevelFunction priceFunction={priceFunc} constantCalc={constantCalc} title="Constant Function: x^2 + 5 * y = c TODO" />
  </div>

};