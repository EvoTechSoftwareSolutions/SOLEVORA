import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";

function App() {
  return (
    <Router>
      <UserRoutes />
    </Router>
  );
}

export default App;