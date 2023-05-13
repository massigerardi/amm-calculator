import {Table} from "antd";
import React from "react";

export const columns = [
  {
    title: 'Cost',
    dataIndex: 'cost',
    key: 'cost',
  },
  {
    title: 'Collected Fees',
    dataIndex: 'fees',
    key: 'fees',
  },
  {
    title: 'dy',
    dataIndex: 'dy',
    key: 'tokenA',
  },
  {
    title: 'dx',
    dataIndex: 'dx',
    key: 'tokenB',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Liquidity Y',
    dataIndex: 'liqY',
    key: 'tokenALiq',
  },
  {
    title: 'Liquidity X',
    dataIndex: 'liqX',
    key: 'tokenBLiq',
  },
  {
    title: 'Constant',
    dataIndex: 'curve',
    key: 'curve',
  },
];

export interface DataType {
  dy: string;
  dx: string;
  liqY: string;
  liqX: string;
  price: string;
  fees: string;
  cost: string;
  curve: string;
}


export const TxTable = (data: DataType[]):JSX.Element => {
  return <>
    <Table columns={columns} dataSource={data} />
    </>
}