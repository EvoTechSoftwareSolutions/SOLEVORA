<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./styles/global.css";
=======
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
>>>>>>> 794c2b409b66fa3ce90662479322780842b0eef6

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);