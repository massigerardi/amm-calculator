import "mafs/core.css";
import React from "react";
import {constantSum, constantSumDer} from "../utils/functions";
import {GenericFunction} from "./GenericFunction";

export const ConstantSum = () => {
  const priceFunc = (A: number, B: number) => {
    return 1;
  }

  const constantCalc = (A: number, B: number) => {
    return A + B;
  }
  return <div>
    <GenericFunction constantFunction={constantSum} constantFunctionDer={constantSumDer} priceFunction={priceFunc} constant={5} constantCalc={constantCalc} title="x + y = c" priceFunctionDesc="1"/>
  </div>

};