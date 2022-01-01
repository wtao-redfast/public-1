import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Home = () => (
  <div>
    <h2>Welcome home</h2>
  </div>
);
const About = () => (
  <div>
    <h2>NOTHING to say about</h2>
  </div>
);

function App() {
  localStorage.setItem('secret', 'hellow world');
  return (
    <div>
      <div>
        <a href="/appb/index.html">to sibling site</a>
      </div>
      <div>
        <a href="/appa/terms/terms.html">Terms and Conditions</a>
      </div>
      <Router>
      <nav>
          <ul>
            <li>
              <Link to="/appa">Home</Link>
            </li>
            <li>
              <Link to="/appa/about">About</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/appa/about">
            <About />
          </Route>
          <Route exact path="/appa">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
