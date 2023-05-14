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

  const priceEquation = `
    x<sup>2</sup> + 5y = k
    (x-dx)<sup>2</sup> + 5(y + dy) = k
    x<sup>2</sup> -2xdx + dx<sup>2</sup> + 5y + 5dy = k
    <s>x<sup>2</sup></s> -2xdx + dx<sup>2</sup> + <s>5y</s> + 5dy = <s>k</s>
    5dy - 2xdx + dx<sup>2</sup> = 0
    dy = dx (2x - dx) / 5 
    P = dy/dx = (2x - dx) / 5 
  `

  return <div>
    <HighLevelFunction priceFunction={priceFunc} constantCalc={constantCalc} title="Constant Function: x^2 + 5 * y = c" priceEquation={priceEquation} />
  </div>

};