import "mafs/core.css";
import React from "react";
import {constantFunc, constantFuncDer} from "../utils/functions";
import {GenericFunction} from "./GenericFunction";

export const ConstantFunction = () => {
  const priceFunc = (A: number, B: number) => {
    return A / B;
  }

  const constantCalc = (A: number, B: number) => {
    return A**2 + 5*B;
  }


  return <div>
    <GenericFunction constantFunction={constantFunc} constantFunctionDer={constantFuncDer} priceFunction={priceFunc} constant={10} constantCalc={constantCalc} title="x^2 + 5 * y = c TODO" priceFunctionDesc="???"/>
  </div>

};