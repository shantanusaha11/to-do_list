import React, {useContext,useEffect} from 'react'
import AddTodo from './AddTodo'
import TableList from './TableList'
import TodoContext from '../context/todo/todoContext'

const Home = () => {
  const context = useContext(TodoContext);
  const {getTodo, todos} = context;

  //called getTodo api to send and render todos to the Table component 
  useEffect(() => {
    getTodo();
    //eslint-disable-next-line
  }, [])
  
  return (
    <React.Fragment>
        <AddTodo/>
        <TableList allTodos={todos}/>
    </React.Fragment>
  )
}

export default Home