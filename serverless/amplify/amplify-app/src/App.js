import logo from './logo.svg';
import './App.css';
import * as React from 'react'; 
import { API } from 'aws-amplify';
import { listNodes } from './graphql/queries';
import { createNode as CreateNode } from './graphql/mutations';
import { v4 as uuid } from 'uuid';

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

  const onCreateNode = async () => {
    debugger;

    await API.graphql({
      query: CreateNode,
      variables: { input: {
        id: uuid(),
        name: "ghi",
        description: "hola world"
      } }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={onCreateNode}>Create a new note</button>
      </header>
    </div>
  );
}

export default App;
