import React from "react";
import TodoState from "./context/todo/todoState";
import Home from "./components/Home";

const App = () => {
  return (
    <TodoState>
      <Home />
    </TodoState>
  );
};

export default App;
