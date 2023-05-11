import {Button, Card, Col, Form, InputNumber, message, Row, Table} from "antd";
import Big from "big.js";
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
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
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
  tokenALiq: string;
  tokenBLiq: string;
  price: string;
  fees: string;
  curve: string;
}

type Props = {
  priceFunction: (A: Big, B: Big) => Big,
  priceFunctionDesc: string,
  constantCalc: (A: Big, B: Big) => Big,
  title: string
}

export const GenericFunction = ({priceFunction, constantCalc, title} : Props) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [addDisabled, setAddDisabled] = useState<boolean>(false);
  const [initialSet, setInitialSet] = useState<boolean>(false);
  const [initialTokenA, setInitialTokenA] = useState<number>(100);
  const [initialTokenB, setInitialTokenB] = useState<number>(250);
  const [tokenA, setTokenA] = useState<number>(100);
  const [tokenB, setTokenB] = useState<number>(250);
  const [priceB, setPriceB] = useState<Big>(new Big(0));
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
    const price = priceFunction(new Big(tokenB), new Big(tokenA));
    setPriceB(price);
    const initialCurve = constantCalc(new Big(initialTokenA), new Big(initialTokenB)).toNumber();
    console.log(initialCurve)
    setData([{
      tokenA: "",
      tokenB: "",
      fees: "",
      price: `${price.toFixed(5)}`,
      tokenALiq: tokenA.toFixed(5),
      tokenBLiq: tokenB.toFixed(5),
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
    setSwappedTokenA(0);
    setSwappedTokenB(0);
  }

  const buy = (output: number, tokenIn: number, tokenOut: number): { tokenInUpdated: Big, tokenOutUpdated: Big, input: number, output: number, price: Big} => {
    const tokenOutUpdated = new Big(tokenOut - output);
    const price = priceFunction(new Big(tokenIn), tokenOutUpdated);
    const input = price.mul(new Big(output));
    const tokenInUpdated = input.add(new Big(tokenIn));
    return { tokenInUpdated, tokenOutUpdated, input: input.toNumber(), output, price }
  }

  const setSwapTokenA = (value: number | null) => {
    const tokens = Number(value ?? 0)
    const { input, output, price } = buy(tokens, tokenB, tokenA);
    setSwappedTokenA(output);
    setSwappedTokenB(input);
    setPriceB(price);
  };

  const swapTokenA = () => {
    const { tokenInUpdated, tokenOutUpdated, input, output, price } = buy(swappedTokenA, tokenB, tokenA);
    setTokenA(tokenOutUpdated.toNumber());
    setTokenB(tokenInUpdated.toNumber());
    const initialCurve = constantCalc(tokenInUpdated, tokenOutUpdated).toNumber();
    const swap: DataType = {
      tokenA: `-${output.toFixed(5)}`,
      tokenB: `+${input.toFixed(5)}`,
      price: `${price.toFixed(5)} B/A`,
      fees: `0 B`,
      tokenALiq: `${tokenOutUpdated.toFixed(5)}`,
      tokenBLiq: `${tokenInUpdated.toFixed(5)}`,
      curve: `${initialCurve}`
    }
    setData([...data, swap])
    resetData();
  };

  const setSwapTokenB = (value: number | null) => {
    const tokens = Number(value ?? 0)
    const { input, output, price } = buy(tokens, tokenA, tokenB);
    setSwappedTokenB(output);
    setSwappedTokenA(input);
    setPriceB(price.pow(-1));
  };

  const swapTokenB = () => {
    const { tokenInUpdated, tokenOutUpdated, input, output, price } = buy(swappedTokenB, tokenA, tokenB);
    setTokenB(tokenOutUpdated.toNumber());
    setTokenA(tokenInUpdated.toNumber());
    const curve = constantCalc(tokenInUpdated, tokenOutUpdated).toNumber();
    setPriceB(price);
    const swap: DataType = {
      tokenB: `-${output.toFixed(5)}`,
      tokenA: `+${input.toFixed(5)}`,
      price: `${price.pow(-1).toFixed(5)} B/A`,
      fees: `0 A`,
      tokenALiq: tokenInUpdated.toFixed(5),
      tokenBLiq: tokenOutUpdated.toFixed(5),
      curve: `${curve}`
    }
    setData([...data, swap])
    resetData();
  };

  const calcPrice = (base: number, counter: number, delta: number, fees: number): Big => {
    counter = counter - delta * (1 - fees);
    return priceFunction(new Big(base), new Big(counter));
  }



  const reset = () => {
    setTokenA(100);
    setTokenB(250);
    setSwapTokenB(0)
    setSwapTokenA(0)
    setData([])
    setAddDisabled(false);
    setInitialSet(false);
    setPriceB(new Big(0));
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
          <Form.Item label="Price"><b>{priceB.toFixed(5)} B/A</b></Form.Item>
          <Form layout="inline">
            <Form.Item label="Token A:"><InputNumber value={swappedTokenA} onChange={setSwapTokenA} min={0} disabled={!addDisabled}/></Form.Item>
            <Form.Item label="Token B:"><InputNumber value={swappedTokenB} onChange={setSwapTokenB} min={0} disabled={!addDisabled}/></Form.Item>
            <Form.Item label=""><Button onClick={swapTokenA} type="primary" disabled={!addDisabled}>Buy A</Button></Form.Item>
            <Form.Item label=""><Button onClick={swapTokenB} type="primary" disabled={!addDisabled}>Buy B</Button></Form.Item>
          </Form>
          <Table columns={columns} dataSource={data}/>
        </Card>
      </Col>
    </Row>

  </div>
};