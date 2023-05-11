import React from 'react';
import {
  BrowserRouter as Router,
  Route, Routes,
} from 'react-router-dom';

import './App.css';
import {ConstantFunction} from "./pages/ConstantFunction";
import {ConstantProduct} from "./pages/ConstantProduct";
import {ConstantSum} from "./pages/ConstantSum";
import {Curves} from "./pages/Curves";
import {LandingPage} from "./pages/LandingPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/curves" element={<Curves />} />
          <Route path="/constant-sum" element={<ConstantSum />} />
          <Route path="/constant-product" element={<ConstantProduct />} />
          <Route path="/constant-function" element={<ConstantFunction />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
