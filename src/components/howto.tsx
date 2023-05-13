import {Card} from "antd";
import React from "react";

export const HowTo = () => {
  return <Card title="How to">
    <ol>
      <li>Set up initial liquidity and possible fees;</li>
      <li>Create Pool;</li>
      <li>Add Token B or Token A in the Buy form;</li>
      <li>Price will change with quantity;</li>
      <li>When Buy Y or X token, the variation in the pool are shown;</li>
      <li>Repeat the process to see how the price changes;</li>
      <li>Reset to start again with a clean pool.</li>
    </ol>
    <h4>Table Columns</h4>
    <ul>
      <li><b>Cost</b>: Final Cost for the buyer</li>
      <li><b>Collected Fees</b>: fees from the sales; <br/>❌ collected fees do not contribute to the pool liquidity</li>
      <li><b>dy</b>: variation of token y in the pool</li>
      <li><b>dx</b>: variation of token x in the pool</li>
      <li><b>Price</b>: price for the sale</li>
      <li><b>Liquidity Y</b>: the quantity of token Y left in the pool</li>
      <li><b>Liquidity X</b>: the quantity of token X left in the pool</li>
      <li><b>Constant</b>: the constant from the AMM function for this pool</li>
    </ul>
  </Card>
}