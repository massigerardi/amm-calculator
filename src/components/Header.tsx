import {Avatar} from "antd";
import React from "react";

export const Header = () => {
  return <div style={{marginBottom: 20}}>
    <h1>DeFi Talents Assignment 3 - AMM Price Calculation</h1>
    <Avatar src="/masi-happy.jpeg" size="large" alt="massi@ambulando.net"></Avatar>
    <a href="/">Home</a> | <a href="/constant-sum">Constant Sum</a> | <a href="/constant-product">Constant Product</a> | <a href="/constant-function">Constant Function</a> | <a href="/curves">Curves</a>
  </div>
}