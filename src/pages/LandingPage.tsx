import {Coordinates, Mafs, Plot, Theme} from "mafs";
import "mafs/core.css";
import React from "react";
import {Header} from "../components/Header";
import {constantFunc, constantProd, constantSum} from "../utils/functions";

export const LandingPage = () => {

  return <div>
    <Header/>
    <Mafs
      viewBox={{x: [0, 10], y: [0, 10]}}
      width={600}
      height={600}
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
      <Plot.OfX y={constantSum(5)} color={Theme.red} opacity={1}/>
      <Plot.OfX y={constantProd(6.4)} color={Theme.green} opacity={1}/>
      <Plot.OfX y={constantFunc(10)} color={Theme.blue} opacity={1}/>
    </Mafs>
  </div>
}