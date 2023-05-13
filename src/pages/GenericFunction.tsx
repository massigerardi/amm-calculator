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
  constantCalc: (A: Big, B: Big) => Big,
  title: string
}

export const GenericFunction = ({priceFunction, constantCalc, title} : Props) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [addDisabled, setAddDisabled] = useState<boolean>(false);
  const [initialSet, setInitialSet] = useState<boolean>(false);
  const [initialTokenA, setInitialTokenA] = useState<number>(0);
  const [initialTokenB, setInitialTokenB] = useState<number>(0);
  const [tokenA, setTokenA] = useState<number>(0);
  const [tokenB, setTokenB] = useState<number>(0);
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
    if (initialTokenB === 0 || initialTokenA === 0) return;
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
      tokenALiq: initialTokenA.toFixed(5),
      tokenBLiq: initialTokenB.toFixed(5),
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

  const buy = (dx: number, tokenIn: number, X: number): { tokenInUpdated: Big, tokenOutUpdated: Big, cost: number, amount: number, price: Big, paidFees: Big} => {
    const tokenOutUpdated = new Big(X - dx);
    const price = priceFunction(new Big(tokenIn), new Big(tokenOutUpdated));
    const dy = price.mul(new Big(dx));
    const paidFees = dy.mul(new Big(fees))
    const cost = dy.add(paidFees);
    const tokenInUpdated = dy.add(new Big(tokenIn));
    return { tokenInUpdated, tokenOutUpdated, cost: cost.toNumber(), amount: dx, price, paidFees }
  }

  const setSwapTokenA = (value: number | null) => {
    const tokens = Number(value ?? 0)
    const { cost, amount, price } = buy(tokens, tokenB, tokenA);
    setSwappedTokenA(amount);
    setSwappedTokenB(cost);
    setPriceB(price);
  };

  const swapTokenA = () => {
    if (!check(swappedTokenB, swappedTokenA, tokenA)) return;
    const { tokenInUpdated, tokenOutUpdated, cost, amount, price, paidFees } = buy(swappedTokenA, tokenB, tokenA);
    setTokenA(tokenOutUpdated.toNumber());
    setTokenB(tokenInUpdated.toNumber());
    const initialCurve = constantCalc(tokenInUpdated, tokenOutUpdated).toNumber();
    const swap: DataType = {
      tokenA: `-${amount.toFixed(5)}`,
      tokenB: `+${cost.toFixed(5)}`,
      price: `${price.toFixed(5)} B/A`,
      fees: `${paidFees.toFixed(5)} B`,
      tokenALiq: `${tokenOutUpdated.toFixed(5)}`,
      tokenBLiq: `${tokenInUpdated.toFixed(5)}`,
      curve: `${initialCurve}`
    }
    setData([...data, swap])
    resetData();
  };

  const setSwapTokenB = (value: number | null) => {
    const tokens = Number(value ?? 0)
    const { cost, amount, price } = buy(tokens, tokenA, tokenB);
    setSwappedTokenB(amount);
    setSwappedTokenA(cost);
    setPriceB(price.pow(-1));
  };

  const swapTokenB = () => {
    if (!check(swappedTokenA, swappedTokenB, tokenB)) return;
    const { tokenInUpdated, tokenOutUpdated, cost, amount, price, paidFees } = buy(swappedTokenB, tokenA, tokenB);
    setTokenB(tokenOutUpdated.toNumber());
    setTokenA(tokenInUpdated.toNumber());
    const curve = constantCalc(tokenInUpdated, tokenOutUpdated).toNumber();
    setPriceB(price);
    const swap: DataType = {
      tokenB: `-${amount.toFixed(5)}`,
      tokenA: `+${cost.toFixed(5)}`,
      price: `${price.pow(-1).toFixed(5)} B/A`,
      fees: `${paidFees.toFixed(5)} A`,
      tokenALiq: tokenInUpdated.toFixed(5),
      tokenBLiq: tokenOutUpdated.toFixed(5),
      curve: `${curve}`
    }
    setData([...data, swap])
    resetData();
  };

  const reset = () => {
    setTokenA(100);
    setTokenB(250);
    setSwapTokenB(0)
    setSwapTokenA(0)
    setFees(0)
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
            <Form.Item label="Tokens:"><InputNumber value={initialTokenA} onChange={changeTokenA} addonAfter="A" disabled={initialSet}/></Form.Item>
            <Form.Item><InputNumber value={initialTokenB} onChange={changeTokenB} addonAfter="B" disabled={initialSet}/></Form.Item>
            <Form.Item label="Fees"><InputNumber value={fees} onChange={addFees} disabled={initialSet} addonAfter="%" max={100} min={0} step={0.01} /></Form.Item>
            <Form.Item ><Button onClick={setInitialLiquidity} disabled={addDisabled} type="primary">Create Pool</Button></Form.Item>
            <Form.Item><Button onClick={reset} >Reset</Button></Form.Item>
          </Form>
          <h3>Swap</h3>
          <Form.Item label="Fees" style={{ marginBottom: 0}}><b>{fees}</b></Form.Item>
          <Form layout="inline" style={{marginBottom: 20}}>
            <Form.Item label="Tokens:"><InputNumber value={swappedTokenA} addonAfter="A" onChange={setSwapTokenA} min={0} disabled={!addDisabled}/></Form.Item>
            <Form.Item><InputNumber value={swappedTokenB} addonAfter="B" onChange={setSwapTokenB} min={0} disabled={!addDisabled}/></Form.Item>
            <Form.Item label="Price"><b>{priceB.toFixed(5)} B/A</b></Form.Item>
            <Form.Item label=""><Button onClick={swapTokenA} type="primary" disabled={!addDisabled}>Buy A</Button></Form.Item>
            <Form.Item label=""><Button onClick={swapTokenB} type="primary" disabled={!addDisabled}>Buy B</Button></Form.Item>
          </Form>
          <Table columns={columns} dataSource={data} />
        </Card>
      </Col>
      <Col>
        <Card title="How to">
          <ol>
            <li>Set up initial liquidity and possible fees;</li>
            <li>Create Pool;</li>
            <li>Add Token B or Token A in the Buy form;</li>
            <li>Price will change with quantity;</li>
            <li>When Buy A or B token, the variation in the pool are shown;</li>
            <li>Repeat the process to see how the price changes;</li>
            <li>Reset to start again with a clean pool.</li>
          </ol>
          <h4>Table Columns</h4>
          <ul>
            <li><b>Token A</b>: variation of token A</li>
            <li><b>Token B</b>: variation of token B</li>
            <li><b>Collected Fees</b>: fees from the sales; <br/>collected fees do not contribute to the pool liquidity</li>
            <li><b>Price</b>: price for the sale</li>
            <li><b>Liquidity Token A</b>: the quantity of token A left in the pool</li>
            <li><b>Liquidity Token B</b>: the quantity of token B left in the pool</li>
            <li><b>Liquidity Constant</b>: the constant from the AMM function for this pool</li>
          </ul>
        </Card>
      </Col>
    </Row>

  </div>
};