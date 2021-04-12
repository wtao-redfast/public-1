import logo from './logo.svg';
import './App.css';
import * as React from 'react'; 
import { API } from 'aws-amplify';
import { listNodes } from './graphql/queries';

function App() {
  React.useEffect(() => {
    (async () => {
      let result = await API.get('pingApi', '/ping');
      console.log(result);

      let notesData = await API.graphql({
        query: listNodes
      });
      console.log(notesData);
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
