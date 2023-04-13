import React, { useContext, useEffect, useState,useRef } from "react";
import { Table, Space, Tag, Button, Modal, Form, Input, Tooltip, Select, DatePicker,Card } from "antd";
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {showDeleteConfirm, successAlert} from './Alert'
import TodoContext from "../context/todo/todoContext";
import Highlighter from "react-highlight-words";
import dayjs from 'dayjs';


const TableList = ({ allTodos }) => {

  const context = useContext(TodoContext);
  const { editTodo ,deleteTodo } = context;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({title: "", description: "", due_date: "", timestamp: "", tags: [], status: ""})

  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  const [rows, setRows] = useState([]);
  const {TextArea} = Input;
  const [allTags, setAllTags] = useState([]);
    
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);


  useEffect(() => {
    // todos are taken a props and then set in row variable to perform sort
    setRows([...allTodos])
  }, [allTodos]);


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
    const newTags = allTags.filter((tag) => tag !== removedTag);
    setAllTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = (e) => {
    if (inputValue && allTags.indexOf(inputValue)) {
      setAllTags([...allTags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = (e) => {
    const newTags = [...allTags];
    newTags[editInputIndex] = editInputValue;
    setAllTags(newTags);
    setEditInputIndex(-1);
    setInputValue('');
  };

  // Logic for openning the modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    editTodo({...formData, timestamp: dayjs(new Date()).format('hh-mm A'), tags: allTags})
    successAlert("Todo edited successfully");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClick = (data)=>{
    showModal();
    setFormData({...data});
    setAllTags([...data.tags]);
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  // Logic for searching the data in tags column
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input ref={searchInput} placeholder={`Search ${dataIndex}`} value={selectedKeys[0]} onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])} onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)} style={{   marginBottom: 8,   display: 'block', }}/>
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{   width: 90, }}>Search</Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{   width: 90, }}>  Reset</Button>
          <Button type="link" size="small" onClick={() => {confirm({ closeDropdown: false, }); setSearchText(selectedKeys[0]); setSearchedColumn(dataIndex); }}>Filter</Button>
          <Button type="link" size="small" onClick={() => close()}>close</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined, }}/>
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (_, { tags }) =>
      searchedColumn === dataIndex ? (
        <Highlighter highlightStyle={{ backgroundColor: '#ffc069',padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={tags ? tags.toString() : ''}/> ) : (tags),
  });

  // Logic for sorting the data in every column except tags column
  const sortValues = (a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  }

  // Defined columns for table
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => sortValues(a,b)
    },
  
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => sortValues(a,b),
    },
  
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      ...getColumnSearchProps('tags'),
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            return (
              <Tag>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      sorter: (a, b) => sortValues(a,b),
    },
  
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      onFilter: (value, record) => record.status.includes(value),
      filters: [
        {
          text: 'OPEN',
          value: 'OPEN',
        },
        {
          text: 'WORKING',
          value: 'WORKING',
        },
        {
          text: 'DONE',
          value: 'DONE',
        },
        {
          text: 'OVERDUE',
          value: 'OVERDUE',
        },
      ],
    },
  
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      sorter: (a, b) => sortValues(a,b),
    },
  
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_,data) => (
        <Space>
          <Button type='primary' size='large' onClick={()=>handleClick(data)}>Edit</Button>
          <Button type='primary' size='large' onClick={()=>showDeleteConfirm(data.id,deleteTodo)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Your Todos" bordered={false} style={{ width: 1100, marginLeft: 200, marginTop: 10 }}>
      <Table columns={columns} dataSource={rows} rowKey={(row)=>row.id} wrapperCol={{span: 16}} labelCol={{span: 4}} />

      <Modal title="Edit Todo" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form style={{padding: "10px"}} wrapperCol={{span: 16}} labelCol={{span: 4}} >
          <Form.Item label="Title">
              <Input placeholder="Title" maxLength={100} value={formData.title} showCount onChange={(e)=>setFormData({...formData, title: e.target.value})}/>
          </Form.Item>
          <Form.Item label="Description">
              <TextArea rows={4} placeholder="Description" showCount maxLength={1000} value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})}/>
          </Form.Item>
          <Form.Item label="Select">
          <Select placeholder="Status" value={formData.status} onChange={(value)=>setFormData({...formData, status: value})}>
            <Select.Option value="OPEN">OPEN</Select.Option>
            <Select.Option value="WORKING">WORKING</Select.Option>
            <Select.Option value="DONE">DONE</Select.Option>
            <Select.Option value="OVERDUE">OVERDUE</Select.Option>
          </Select>
        </Form.Item>
          <Form.Item label="Tags" >
          <Space size={[0, 8]} wrap>
            <Space size={[0, 8]} wrap>
              {allTags.map((tag, index) => {
                if (editInputIndex === index) {
                  return (<Input ref={editInputRef} key={allTags} size="small" style={{ width: 78,  verticalAlign: 'top' }} value={editInputValue} onChange={handleEditInputChange} onBlur={handleEditInputConfirm} onPressEnter={handleEditInputConfirm}/>);
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
              {inputVisible ? (<Input ref={inputRef} type="text" size="small" style={{ width: 78, verticalAlign: 'top' }} value={inputValue} onChange={handleInputChange} onBlur={handleInputConfirm} onPressEnter={handleInputConfirm}/>
              ) : (<Tag style={{borderStyle: 'dashed'}} onClick={showInput}> <PlusOutlined /> New Tag</Tag>)}
            </Space>
          </Form.Item>
          <Form.Item label="Due Date">
            <DatePicker style={{borderRadius: 0}} placeholder="Due Date" value={dayjs(formData.due_date,"DD/MM/YYYY")} disabledDate={(current) => current && current < dayjs().startOf('day')} onChange={(selectedDate)=> setFormData({...formData, due_date: dayjs(selectedDate).format("DD/MM/YYYY")})}/>
          </Form.Item>
        </Form>
      </Modal>
      </Card>
  );
};

export default TableList;
