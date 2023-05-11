import {Button, Card, Col, Form, InputNumber, message, Row, Table} from "antd";
import {Coordinates, Mafs, Plot, Theme} from "mafs";
import "mafs/core.css";
import React, {useState} from "react";
import {Header} from "../components/Header";

const columns = [
  {
    title: 'Token A',
    dataIndex: 'tokenA',
    key: 'tokenA',
  },
  {
    title: 'Token B',
    dataIndex: 'tokenB',
    key: 'tokenB',
  },
  {
    title: 'Collected Fees',
    dataIndex: 'fees',
    key: 'fees',
  },
  {
    title: 'Price A',
    dataIndex: 'priceA',
    key: 'priceA',
  },
  {
    title: 'Price B',
    dataIndex: 'priceB',
    key: 'priceB',
  },
  {
    title: 'Liquidity Token A',
    dataIndex: 'tokenALiq',
    key: 'tokenALiq',
  },
  {
    title: 'Liquidity Token B',
    dataIndex: 'tokenBLiq',
    key: 'tokenBLiq',
  },
  {
    title: 'Liquidity Constant',
    dataIndex: 'curve',
    key: 'curve',
  },
];

interface DataType {
  tokenA: string;
  tokenB: string;
  tokenALiq: number;
  tokenBLiq: number;
  priceA: string;
  priceB: string;
  fees: string;
  curve: number;
}

type Props = {
  constantFunction: Function,
  constantFunctionDer: Function,
  priceFunction: Function,
  priceFunctionDesc: string,
  constantCalc: Function,
  constant: number,
  title: string
}

export const GenericFunction = ({constantFunction, constantFunctionDer, priceFunction, constant, constantCalc, title, priceFunctionDesc} : Props) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [addDisabled, setAddDisabled] = useState<boolean>(false);
  const [initialSet, setInitialSet] = useState<boolean>(false);
  const [initialTokenA, setInitialTokenA] = useState<number>(100);
  const [initialTokenB, setInitialTokenB] = useState<number>(250);
  const [tokenA, setTokenA] = useState<number>(100);
  const [tokenB, setTokenB] = useState<number>(250);
  const [priceA, setPriceA] = useState<number>(0);
  const [priceB, setPriceB] = useState<number>(0);
  const [receiveA, setReceiveA] = useState<number>(0);
  const [receiveB, setReceiveB] = useState<number>(0);
  const [newAQty, setNewAQty] = useState<number>(0)
  const [newBQty, setNewBQty] = useState<number>(0)
  const [curve, setCurve] = useState<number>(0)
  const [paidFeesA, setPaidFeesA] = useState<number>(0)
  const [paidFeesB, setPaidFeesB] = useState<number>(0)
  const [fees, setFees] = useState<number>(0);
  const [swappedTokenA, setSwappedTokenA] = useState<number>(0);
  const [swappedTokenB, setSwappedTokenB] = useState<number>(0);
  const [data, setData] = useState<DataType[]>([])

  const changeTokenA = (value: number | null) => {
    const v = Number(value ?? 0)
    setInitialTokenA(v);
  };

  const changeTokenB = (value: number | null) => {
    const v = Number(value ?? 0)
    setInitialTokenB(v);
  };

  const addFees = (value: number | null) => {
    const v = Number(value ?? 0)
    setFees(v);
  };

  const setInitialLiquidity = () => {
    setTokenA(initialTokenA);
    setTokenB(initialTokenB);
    setInitialSet(true);
    setAddDisabled(true);
    setData([{
      tokenA: "",
      tokenB: "",
      priceA: "",
      priceB: "",
      fees: "",
      tokenALiq: tokenA,
      tokenBLiq: tokenB,
      curve: constantCalc(tokenA, tokenB)
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

  const swapTokenA = () => {
    if (!check(swappedTokenA, swappedTokenB, tokenB)) {
      return;
    }
    const realInput = swappedTokenA;
    const price = calcPrice(tokenA, tokenB, realInput, fees);
    const input = realInput * (1 - fees);
    const output = input * price;
    setPaidFeesA(realInput * fees)
    setNewAQty(tokenA + input)
    setNewBQty(tokenB - output)
    setCurve(constantCalc(tokenA + input, tokenB - output))
    setReceiveB(output);
    setPriceB(price)

    const swap: DataType = {
      tokenA: `+${input}`,
      tokenB: `-${output}`,
      priceB: `${price} B/A`,
      priceA: "",
      fees: `${paidFeesA} A`,
      tokenALiq: tokenA + input,
      tokenBLiq: tokenB - output,
      curve: Math.floor(curve)
    }
    setData([...data, swap])
    setTokenA(newAQty);
    setTokenB(newBQty);
    resetData();
  };

  const resetData = () => {
    setSwappedTokenA(0);
    setSwappedTokenB(0);
    setReceiveA(0);
    setReceiveB(0);
    setPaidFeesA(0)
    setPaidFeesB(0)

  }

  const swapTokenB = () => {
    if (!check(swappedTokenB, swappedTokenA, tokenA)) {
      return;
    }
    const realInput = swappedTokenB;
    const price = calcPrice(tokenA, tokenB, realInput, fees);
    const input = realInput * (1 - fees);
    const output = input * price;
    setPaidFeesB(realInput * fees)
    setNewAQty(tokenA - output)
    setNewBQty(tokenB + input)
    setCurve(constantCalc(tokenA - output, tokenB + input))
    setReceiveB(output);
    setPriceB(price)

    const swap: DataType = {
      tokenA: `-${output}`,
      tokenB: `+${input}`,
      priceA: `${price} A/B`,
      priceB: "",
      fees: `${paidFeesB} B`,
      tokenALiq: tokenA - output,
      tokenBLiq: tokenB + input,
      curve: Math.floor(curve)
    }
    setData([...data, swap])
    setTokenA(newAQty);
    setTokenB(newBQty);
    resetData();
  };

  const calcPrice = (base: number, counter: number, delta: number, fees: number) => {
    counter = counter - delta * (1 - fees);
    return priceFunction(base, counter);
  }

  const setSwapTokenA = (value: number | null) => {
    const realInput = Number(value ?? 0);
    setSwappedTokenA(realInput);
    const price = calcPrice(tokenB, tokenA, realInput, fees);
    const input = realInput * (1 - fees);
    const output = input * price;
    setPaidFeesA(realInput * fees)
    setNewAQty(tokenA + input)
    setNewBQty(tokenB - output)
    setCurve(constantCalc(tokenA + input, tokenB - output))
    setReceiveB(output);
    setPriceB(price)
  };

  const setSwapTokenB = (value: number | null) => {
    const realInput = Number(value ?? 0);
    setSwappedTokenB(realInput);
    const price = calcPrice(tokenA, tokenB, realInput, fees);
    const input = realInput * (1 - fees);
    const output = input * price;
    setPaidFeesB(realInput * fees)
    setNewAQty(tokenA - output)
    setNewBQty(tokenB + input)
    setCurve(constantCalc(tokenA - output, tokenB + input))
    setReceiveA(output);
    setPriceA(price)
  };


  const reset = () => {
    setTokenA(100);
    setTokenB(250);
    setSwapTokenB(0)
    setSwapTokenA(0)
    setData([])
    setAddDisabled(false);
    setInitialSet(false);
  }

  return <div>
    <Header />
    {contextHolder}
    <Row>
      <Col>
        <Card title={<code>{title}</code>}>
          <h3>Init</h3>
          <Form layout="inline">
            <Form.Item label="Token A:"><InputNumber value={initialTokenA} onChange={changeTokenA} disabled={initialSet}/></Form.Item>
            <Form.Item label="Token B:"><InputNumber value={initialTokenB} onChange={changeTokenB} disabled={initialSet}/></Form.Item>
            <Form.Item label="Fees"><InputNumber value={fees} onChange={addFees} disabled={initialSet}/></Form.Item>
            <Form.Item ><Button onClick={setInitialLiquidity} disabled={addDisabled} type="primary">Create Pool</Button></Form.Item>
            <Form.Item><Button onClick={reset} >Reset</Button></Form.Item>
          </Form>
          <Form.Item label="Fees" style={{ marginBottom: 0}}><b>{fees}</b></Form.Item>
          <h3>Swap A 🔄 B</h3>
          <Form layout="inline">
            <Form.Item label="Token A:" required={true}><InputNumber value={swappedTokenA} onChange={setSwapTokenA} min={0}/></Form.Item>
            <Form.Item label="Token B"> <InputNumber value={receiveB} disabled={true} controls={false} inputMode="none"/></Form.Item>
            <Form.Item label=""><Button onClick={swapTokenA} type="primary" disabled={!addDisabled}>Swap</Button></Form.Item>
            <Form.Item label="Price"><b>{priceB} B/A</b></Form.Item>
          </Form>
          <h3>Swap B 🔄 A</h3>
          <Form layout="inline">
            <Form.Item label="Token B:" required={true}><InputNumber value={swappedTokenB} onChange={setSwapTokenB} min={0}/></Form.Item>
            <Form.Item label="Token A"> <InputNumber value={receiveA} disabled={true} controls={false} inputMode="none"/></Form.Item>
            <Form.Item label=""><Button onClick={swapTokenB} type="primary" disabled={!addDisabled}>Swap</Button></Form.Item>
            <Form.Item label="Price"><b>{priceA} A/B</b></Form.Item>
          </Form>
          <Table columns={columns} dataSource={data}/>
        </Card>
      </Col>
    </Row>

  </div>
};