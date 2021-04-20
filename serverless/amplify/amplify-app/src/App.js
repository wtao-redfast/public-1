import logo from './logo.svg';
import './App.css';
import * as React from 'react'; 
import { API } from 'aws-amplify';
import { listTodos } from './graphql/queries';
import { createTodo } from './graphql/mutations';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { Auth } from 'aws-amplify';
import { useHistory } from "react-router-dom";

function App() {
  let history = useHistory();

  React.useEffect(() => {
    (async () => {
      let result = await API.get('apiTodoList', '/todo/version');
      console.log(result);

      let todos = await API.graphql({
        query: listTodos
      });
      console.log(todos);
    })();
  }, []);

  const onCreateToDoLambda = async () => {
    await API.post('apiTodoList', '/todo/', {
      body: {
        id: uuid(),
        name: 'burge king',
        description: 'hello world',
        completed: true
      }
    });
  };

  const onCreateToDoGraph = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      await API.graphql({
        query: createTodo,
        variables: { input: {
          id: uuid(),
          name: moment().format('MMMM Do YYYY, h:mm:ss a'),
          description: 'hola world',
          completed: false
        } }
      });
    } catch(e) {
      console.log(e);
      history.push('/login')
    }
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <button style={{height: '50px'}} onClick={onCreateToDoGraph}>Create a new todo with GraphQL</button>
        <button style={{height: '50px'}} onClick={onCreateToDoLambda}>Create a new todo with Lambda</button>
      </header>
    </div>
  );
}

export default App;
