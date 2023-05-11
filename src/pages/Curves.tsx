import {Checkbox, Col, Form, InputNumber, Row} from 'antd';
import type {CheckboxChangeEvent} from 'antd/es/checkbox';
import {Coordinates, Mafs, Plot, Theme} from "mafs";
import "mafs/core.css";
import React, {useState} from "react";
import {Header} from "../components/Header";
import {
  constantFunc,
  constantFuncDer,
  constantProd,
  constantProdDer,
  constantSum,
  constantSumDer
} from "../utils/functions";

export const Curves = () => {

  const [opacityA, setOpacityA] = useState<number>(0)
  const [opacityB, setOpacityB] = useState<number>(0)
  const [opacityC, setOpacityC] = useState<number>(0)
  const [opacityD, setOpacityD] = useState<number>(0)
  const [k, setK] = useState<number>(5)

  const changeConstant = (value: number | null) => {
    setK(value ?? 1)
  }

  const onChange = (curve: string) => (e: CheckboxChangeEvent) => {
    switch (curve) {
      case ("A"): if (opacityA === 1) setOpacityA(0); else setOpacityA(1); break;
      case ("B"): if (opacityB === 1) setOpacityB(0); else setOpacityB(1); break;
      case ("C"): if (opacityC === 1) setOpacityC(0); else setOpacityC(1); break;
      case ("D"): if (opacityD === 1) setOpacityD(0); else setOpacityD(1); break;
    }
  };

  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } }

  return <div>
    <Header/>
    <Row>
      <Col span={12}>
        <Form {...layout} layout="horizontal" >
          <Form.Item><Checkbox onChange={onChange("A")}><code>y + x = {k} ↔️ y = {k} - x | dy/dx = 1</code></Checkbox></Form.Item>
          <Form.Item><Checkbox onChange={onChange("B")}><code>y * x = {k} ↔️ y = {k} / x | dy/dx = -{k}/x<sup>2</sup></code></Checkbox></Form.Item>
          <Form.Item><Checkbox onChange={onChange("C")}><code>x<sup>2</sup> + 5 * y = {k*5} ↔️ y = ({k*5} - x<sup>2</sup>)/5 | dy/dx = 2x/5</code></Checkbox></Form.Item>
          <Form.Item><Checkbox onChange={onChange("D")}>Show Derivatives <code>dy/dx</code></Checkbox></Form.Item>
          <Form.Item label="Constant"><InputNumber defaultValue={k} onChange={changeConstant} min={5}/></Form.Item>
        </Form>
      </Col>
      <Col span={2}>
        <Mafs
          viewBox={{x: [0, 10], y: [0, 10]}}
          width={800}
          height={800}
        >
          <Coordinates.Cartesian
            xAxis={{
              lines: 1,
              labels: (x) => `${x}k`
            }}
            yAxis={{
              lines: 1,
              labels: (x) => `${x}k`
            }}
          />
          <Plot.OfX y={constantSum(k)} color={Theme.blue} opacity={opacityA}/>
          <Plot.OfX y={constantProd(k)} color={Theme.red} opacity={opacityB}/>
          <Plot.OfX y={constantFunc(k*5)} color={Theme.green} opacity={opacityC}/>
          <Plot.OfX y={constantSumDer(k)} color={Theme.indigo} opacity={opacityA*opacityD}/>
          <Plot.OfX y={constantProdDer(k)} color={Theme.violet} opacity={opacityB*opacityD}/>
          <Plot.OfX y={constantFuncDer(k*5)} color={Theme.yellow} opacity={opacityC*opacityD}/>
        </Mafs>
      </Col>
    </Row>
  </div>
}