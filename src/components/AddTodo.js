import React,{useState, useEffect, useRef, useContext} from 'react';
import {Form, Input, DatePicker, Button, Tag, Tooltip, Space, Select, Card} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {successAlert} from './Alert';
import todoContext from '../context/todo/todoContext'
import dayjs from 'dayjs'


const AddTodo = () => {
  const {addTodo} = useContext(todoContext)
  const {TextArea} = Input;
  
  const [formData, setFormData] = useState({title: "", description: "", due_date: "", timestamp: "", tags: [], status: ""})
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const [inputTags, setInputTags] = useState([])
  const editInputRef = useRef(null);
  const inputRef = useRef(null);
  
  // Logic for editing the tags
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);

  const handleClose = (removedTag) => {
    const newTags = inputTags.filter((tag) => tag !== removedTag);
    setInputTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = (e) => {
    if (inputValue && inputTags.indexOf(inputValue)) {
      setInputTags([...inputTags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = (e) => {
    const newTags = [...inputTags];
    newTags[editInputIndex] = editInputValue;
    setInputTags(newTags);
    setEditInputIndex(-1);
    setInputValue('');
  };
  

  // calling api to send data to server
  const sendFormData = ()=>{
    addTodo({...formData, timestamp: dayjs(new Date()).format('DD/MM/YYYY hh-mm A'), tags: inputTags});
    setFormData({title: "", description: "", due_date: "", timestamp: "", tags: [], status: ""})
    setInputTags([]);
  }
  
  
  const submitForm = (e)=>{
    e.preventDefault();
    sendFormData();
    successAlert("Todo added successfully");
  }
  
  return (
    <Card title="Add Todo" bordered={true} style={{ width: 1300, marginLeft: 100, marginTop: 10 }}>
      <Form wrapperCol={{span: 16}} labelCol={{span: 4}} onFinishFailed={(errorInfo) =>console.log('Failed:', errorInfo)}>
        <Form.Item label="Title" name="title" rules={[{required: true, message: 'Please input your title!'}]}>
            <Input placeholder="Title" maxLength={100} value={formData.title} showCount onChange={(e)=>setFormData({...formData, title: e.target.value})}/>
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{required: true, message: 'Please input your description!'}]}>
            <TextArea rows={4} placeholder="Description" value={formData.description} showCount maxLength={1000} onChange={(e)=>setFormData({...formData, description: e.target.value})}/>
        </Form.Item>
        <Form.Item label="Status" name="status" rules={[{required: true, message: 'Please input your status!'}]}>
            <Select placeholder="Status" onChange={(value)=>{setFormData({...formData, status: value})}}>
              <Select.Option value="OPEN">OPEN</Select.Option>
              <Select.Option value="WORKING">WORKING</Select.Option>
              <Select.Option value="DONE">DONE</Select.Option>
              <Select.Option value="OVERDUE">OVERDUE</Select.Option>
            </Select>
          </Form.Item>
        <Form.Item label="Tags" name="allTags" requiredMark="optional">
          <Space size={[0, 8]} wrap>
          <Space size={[0, 8]} wrap>
            {inputTags.map((tag, index) => {
              if (editInputIndex === index) {
                return (<Input ref={editInputRef} key={tag} size="small" style={{  width: 78,  verticalAlign: 'top' }} value={editInputValue} onChange={handleEditInputChange} onBlur={handleEditInputConfirm} onPressEnter={handleEditInputConfirm}/>);
              }
              const isLongTag = tag.length > 20;
              const tagElem = (
                <Tag key={tag} closable={tag} style={{ userSelect: 'none' }} onClose={() => handleClose(tag)}>
                  <span onDoubleClick={(e) => { setEditInputIndex(index); setEditInputValue(tag); }}>
                    {tag}
                  </span>
                </Tag>
              );
              return isLongTag ? (<Tooltip title={tag} key={tag}>{tagElem}</Tooltip>) : (tagElem);
            })}
          </Space>
          {inputVisible ? (<Input ref={inputRef} type="text" size="small" style={{ width: 78, verticalAlign: 'top' }} onChange={handleInputChange} onBlur={handleInputConfirm} onPressEnter={handleInputConfirm}/>
          ) : (<Tag style={{borderStyle: 'dashed'}} onClick={showInput}> <PlusOutlined /> New Tag</Tag>)}
          </Space>
        </Form.Item>
        <Form.Item label="Due Date" requiredMark="optional">
            <DatePicker style={{borderRadius: 0}} placeholder="Due Date" disabledDate={(current) => current && current < dayjs().startOf('day')} onChange={(selectedDate)=> setFormData({...formData, due_date: dayjs(selectedDate).format("DD/MM/YYYY")})}/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4}}>
          <Button type='primary' size='large' htmlType='submit' onClick={(e)=>submitForm(e)}>Submit</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default AddTodo