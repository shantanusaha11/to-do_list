
import React, {useState} from 'react'
import TodoContext from './todoContext'


const TodoState = ({ children }) => {
  const todoInitials = []
  const [todos, setTodos] = useState(todoInitials)
  const host = "https://642d98b266a20ec9cea1ba3f.mockapi.io/api"
  

  // api to set all todos to todos state
  const getTodo = async()=>{
      const response = await fetch(`${host}/todos`,{
          method: "GET",
          headers: { "Content-Type": "application/json" }
      });
      const json = await response.json();
      setTodos(json);
  }

  // api to add new todo and update the todos state
  const addTodo = async(data)=>{
    const response =  await fetch(`${host}/todos`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    const todo = await response.json();
    setTodos(todos.concat(todo));
  }

  // api to edit a todo and update the todos state
  const editTodo = async(data)=>{
    await fetch(`${host}/todos/${data.id}`,{
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }
    )
    let newTodos = JSON.parse(JSON.stringify(todos));
    for (let index = 0; index < todos.length; index++) {
      const element = todos[index];
      if (element.id === data.id) {
        newTodos[index].title = data.title;
        newTodos[index].description = data.description;
        newTodos[index].tags = data.tags;
        newTodos[index].status = data.status;
        newTodos[index].timestamp = data.timestamp;
        newTodos[index].due_date = data.due_date;
        break;
      }
    }
    setTodos(newTodos);
  }

  // api to delete todo of the provided id and updated the state
  const deleteTodo = async(id)=>{
    await fetch(`${host}/todos/${id}`,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    let newTodos = todos.filter((todo)=>{
      return todo.id !== id;
    });
    setTodos(newTodos);
  }
    
  return (
    <TodoContext.Provider value={{todos,getTodo,addTodo,editTodo,deleteTodo}}>{children}</TodoContext.Provider>
  )
}

export default TodoState