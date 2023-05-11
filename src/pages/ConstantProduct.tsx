import {constantProd, constantProdDer} from "../utils/functions";
import {GenericFunction} from "./GenericFunction";

export const ConstantProduct = () => {

  const priceFunc = (A: number, B: number) => {
    return A / B;
  }

  const constantCalc = (A: number, B: number) => {
    return A * B;
  }


  return <div>
    <GenericFunction constantFunction={constantProd} constantFunctionDer={constantProdDer} priceFunction={priceFunc} constant={5} constantCalc={constantCalc} title="x * y = c" priceFunctionDesc="y/x"/>
  </div>
}