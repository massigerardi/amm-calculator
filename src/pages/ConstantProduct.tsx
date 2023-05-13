import Big from "big.js";
import {GenericFunction} from "./GenericFunction";

export const ConstantProduct = () => {

  const priceFunc = (A: Big, B: Big): Big => {
    return A.div(B);
  }

  const constantCalc = (A: Big, B: Big): Big => {
    return A.mul(B);
  }


  return <div>
    <GenericFunction priceFunction={priceFunc} constantCalc={constantCalc} title="Constant Product: x * y = c" />
  </div>
}