import React from 'react'
import TodoState from './context/todo/todoState'
import Home from './components/Home';

const App = () => {
  
  return (
    <TodoState>
      <React.Fragment>
        <Home/>
      </React.Fragment>
    </TodoState>
  );
}

export default App;
