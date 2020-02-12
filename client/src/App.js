import React from "react";
import { useRoutes } from "./routes";
import { Navbar } from "./components/Navbar";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const routes = useRoutes();
  return (
    <Router>
      <Navbar />
      <div className="App">{routes}</div>
    </Router>
  );
}

export default App;
