import {Button, Card, Col, Form, InputNumber, message, Row, Table} from "antd";
import Big from "big.js";
import "mafs/core.css";
import React, {useState} from "react";
import {Header} from "../components/Header";
import {HowTo} from "../components/howto";
import {columns, DataType } from "../components/TxTable";

type Props = {
  priceFunction: (A: Big, B: Big) => Big,
  constantCalc: (A: Big, B: Big) => Big,
  title: string
}

export const GenericFunction = ({priceFunction, constantCalc, title} : Props) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [addDisabled, setAddDisabled] = useState<boolean>(false);
  const [initialSet, setInitialSet] = useState<boolean>(false);
  const [initY, setInitY] = useState<number>(0);
  const [initX, setInitX] = useState<number>(0);
  const [Y, setY] = useState<number>(0);
  const [X, setX] = useState<number>(0);
  const [price, setPrice] = useState<Big>(new Big(0));
  const [fees, setFees] = useState<number>(0);
  const [dy, setDy] = useState<number>(0);
  const [dx, setDx] = useState<number>(0);
  const [data, setData] = useState<DataType[]>([])

  const changeTokenA = (value: number | null) => {
    const v = Number(value ?? 0)
    setInitY(v);
  };

  const changeTokenB = (value: number | null) => {
    const v = Number(value ?? 0)
    setInitX(v);
  };

  const addFees = (value: number | null) => {
    const v = Number(value ?? 0)
    setFees(v);
  };

  const setInitialLiquidity = () => {
    if (initX === 0 || initY === 0) return;
    setY(initY);
    setX(initX);
    setInitialSet(true);
    setAddDisabled(true);
    const price = priceFunction(new Big(initX), new Big(initY));
    setPrice(price);
    const initialCurve = constantCalc(new Big(initY), new Big(initX)).toNumber();
    console.log(initialCurve)
    setData([{
      dy: "",
      dx: "",
      cost: "",
      fees: "",
      price: `${price.toFixed(5)}`,
      liqY: initY.toFixed(5),
      liqX: initX.toFixed(5),
      curve: `${initialCurve}`
    }])
  }

  const check = (deltaOut: number, tokenOut: number, tokenIn: number):boolean => {
    if (tokenIn === 0 || tokenOut === 0) {
      messageApi.error({
        content: "No Liquidity",
        duration: 10
      })
      return false;
    }
    if (deltaOut === 0) {
      messageApi.error({
        content: "No Swap Value",
        duration: 10
      })
      return false;
    }
    if (deltaOut >= tokenOut) {
      messageApi.error({
        content: "No Enough Liquidity",
        duration: 10
      })
      return false;
    }
    return true;
  }

  const resetData = () => {
    setDy(0);
    setDx(0);
  }

  const buy = (deltaOut: number, tokenIn: number, tokenOut: number): { tokenInUpdated: Big, tokenOutUpdated: Big, cost: number, deltaIn: Big, deltaOut: Big, price: Big, paidFees: Big} => {
    const tokenOutUpdated = new Big(tokenOut - deltaOut);
    const price = priceFunction(new Big(tokenIn), new Big(tokenOutUpdated));
    const deltaIn = price.mul(new Big(deltaOut));
    const paidFees = deltaIn.mul(new Big(fees))
    const cost = deltaIn.add(paidFees);
    const tokenInUpdated = deltaIn.add(new Big(tokenIn));
    return { tokenInUpdated, tokenOutUpdated, cost: cost.toNumber(), deltaIn, deltaOut: new Big(deltaOut), price, paidFees }
  }

  const setSwapTokenY = (value: number | null) => {
    const deltaOut = Number(value ?? 0)
    if (!check(deltaOut, Y, X)) return;
    const { cost, price } = buy(deltaOut, X, Y);
    setDy(deltaOut);
    setDx(cost);
    setPrice(price);
  };

  const swapTokenY = () => {
    if (!check(dy, Y, X)) return;
    const { tokenInUpdated, tokenOutUpdated, cost, deltaIn, deltaOut, price, paidFees } = buy(dy, X, Y);
    setY(tokenOutUpdated.toNumber());
    setX(tokenInUpdated.toNumber());
    const initialCurve = constantCalc(tokenInUpdated, tokenOutUpdated).toNumber();
    const swap: DataType = {
      dy: `-${deltaOut.toFixed(5)}`,
      dx: `+${deltaIn.toFixed(5)}`,
      cost: `+${cost.toFixed(5)}`,
      price: `${price.toFixed(5)} B/A`,
      fees: `${paidFees.toFixed(5)} B`,
      liqY: `${tokenOutUpdated.toFixed(5)}`,
      liqX: `${tokenInUpdated.toFixed(5)}`,
      curve: `${initialCurve}`
    }
    setData([...data, swap])
    resetData();
  };

  const setSwapTokenX = (value: number | null) => {
    const deltaOut = Number(value ?? 0)
    if (!check(deltaOut, X, Y)) return;
    const { cost, price } = buy(deltaOut, Y, X);
    setDx(deltaOut);
    setDy(cost);
    setPrice(price.pow(-1));
  };

  const swapTokenX = () => {
    if (!check(dx, X, Y)) return;
    const { tokenInUpdated, tokenOutUpdated, cost, deltaIn, deltaOut, price, paidFees } = buy(dx, Y, X);
    setX(tokenOutUpdated.toNumber());
    setY(tokenInUpdated.toNumber());
    const curve = constantCalc(tokenInUpdated, tokenOutUpdated).toNumber();
    setPrice(price);
    const swap: DataType = {
      dx: `-${deltaOut.toFixed(5)}`,
      dy: `+${deltaIn.toFixed(5)}`,
      cost: `+${cost.toFixed(5)}`,
      price: `${price.pow(-1).toFixed(5)} B/A`,
      fees: `${paidFees.toFixed(5)} A`,
      liqY: tokenInUpdated.toFixed(5),
      liqX: tokenOutUpdated.toFixed(5),
      curve: `${curve}`
    }
    setData([...data, swap])
    resetData();
  };

  const reset = () => {
    setY(100);
    setX(250);
    setSwapTokenX(0)
    setSwapTokenY(0)
    setFees(0)
    setData([])
    setAddDisabled(false);
    setInitialSet(false);
    setPrice(new Big(0));
  }

  return <div>
    <Header />
    {contextHolder}
    <Row>
      <Col>
        <Card title={<code>{title}</code>}>
          <h3>Init</h3>
          <Form layout="inline">
            <Form.Item label="Tokens:"><InputNumber value={initY} onChange={changeTokenA} addonAfter="Y" disabled={initialSet}/></Form.Item>
            <Form.Item><InputNumber value={initX} onChange={changeTokenB} addonAfter="X" disabled={initialSet}/></Form.Item>
            <Form.Item label="Fees"><InputNumber value={fees} onChange={addFees} disabled={initialSet} addonAfter="%" max={100} min={0} step={0.01} /></Form.Item>
            <Form.Item ><Button onClick={setInitialLiquidity} disabled={addDisabled} type="primary">Create Pool</Button></Form.Item>
            <Form.Item><Button onClick={reset} >Reset</Button></Form.Item>
          </Form>
          <h3>Swap</h3>
          <Form.Item label="Fees" style={{ marginBottom: 0}}><b>{fees}</b></Form.Item>
          <Form layout="inline" style={{marginBottom: 20}}>
            <Form.Item label="Tokens:"><InputNumber value={dy} addonAfter="dy" onChange={setSwapTokenY} min={0} disabled={!addDisabled}/></Form.Item>
            <Form.Item><InputNumber value={dx} addonAfter="dx" onChange={setSwapTokenX} min={0} disabled={!addDisabled}/></Form.Item>
            <Form.Item label="Price"><b>{price.toFixed(5)} B/A</b></Form.Item>
            <Form.Item label=""><Button onClick={swapTokenY} type="primary" disabled={!addDisabled}>Buy Y</Button></Form.Item>
            <Form.Item label=""><Button onClick={swapTokenX} type="primary" disabled={!addDisabled}>Buy X</Button></Form.Item>
          </Form>
          <Table columns={columns} dataSource={data} />
        </Card>
      </Col>
      <Col>
        <HowTo/>
      </Col>
    </Row>

  </div>
};