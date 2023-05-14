import {Button, Card, Col, Form, InputNumber, message, Row, Table} from "antd";
import Big from "big.js";
import "mafs/core.css";
import React, {useState} from "react";
import {Header} from "../components/Header";
import {HowTo} from "../components/howto";
import {columns, DataType} from "../components/TxTable";

type Props = {
  priceFunction: (Y: Big, X: Big, dx: Big) => Big,
  constantCalc: (Y: Big, X: Big) => Big,
  title: string,
  priceEquation: string
}

export const HighLevelFunction = ({priceFunction, constantCalc, title} : Props) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [addDisabled, setAddDisabled] = useState<boolean>(false);
  const [initialSet, setInitialSet] = useState<boolean>(false);
  const [initY, setInitY] = useState<number>(0);
  const [initX, setInitX] = useState<number>(0);
  const [X, setX] = useState<number>(0);
  const [Y, setY] = useState<number>(0);
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
    setX(initX);
    setY(initY);
    setInitialSet(true);
    setAddDisabled(true);
    const price = priceFunction(new Big(initY), new Big(initX), new Big(0));
    setPrice(price);
    const initialCurve = constantCalc(new Big(initX), new Big(initY)).toNumber();
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

  const check = (input: number, output: number, token: number):boolean => {
    if (token === 0) {
      messageApi.error({
        content: "No Liquidity",
        duration: 10
      })
      return false;
    }
    if (input === 0) {
      messageApi.error({
        content: "No Swap Value",
        duration: 10
      })
      return false;
    }
    if (output > token) {
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

  const buy = (dx: number): { newY: Big, newX: Big, cost: number, DY: Big, price: Big, paidFees: Big} => {
    const price = priceFunction(new Big(Y), new Big(X), new Big(dx));
    const dy = price.mul(new Big(dx));
    const paidFees = dy.mul(new Big(fees))
    const cost = dy.add(paidFees);
    return { newY: new Big(Y).add(dy), newX: new Big(X - dx), cost: cost.toNumber(), DY: dy, price, paidFees }
  }

  const setSwapTokenX = (value: number | null) => {
    const dx = Number(value ?? 0)
    const { cost, price } = buy(dx);
    setDx(dx);
    setDy(cost);
    setPrice(price);
  };

  const buyTokenX = () => {
    if (!check(dy, dx, Y)) return;
    const { newY, newX, cost, DY, price, paidFees } = buy(dx);
    setX(newX.toNumber());
    setY(newY.toNumber());
    const curve = constantCalc(newX, newY).toNumber();
    setPrice(price);
    const swap: DataType = {
      dx: `-${dx.toFixed(5)}`,
      cost: `+${cost.toFixed(5)}`,
      dy: `+${DY.toFixed(5)}`,
      price: `${price.toFixed(5)}`,
      fees: `${paidFees.toFixed(5)} A`,
      liqX: newX.toFixed(5),
      liqY: newY.toFixed(5),
      curve: `${curve}`
    }
    setData([...data, swap])
    resetData();
  };

  const reset = () => {
    setX(100);
    setY(250);
    setSwapTokenX(0)
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
            <Form.Item label="Tokens:"><InputNumber value={dy} addonAfter="dy" min={0} disabled={true}/></Form.Item>
            <Form.Item><InputNumber value={dx} addonAfter="dx" onChange={setSwapTokenX} min={0} disabled={!addDisabled}/></Form.Item>
            <Form.Item label="Price"><b>{price.toFixed(5)}</b></Form.Item>
            <Form.Item label=""><Button onClick={buyTokenX} type="primary" disabled={!addDisabled}>Buy X</Button></Form.Item>
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