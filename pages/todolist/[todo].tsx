import * as React from 'react';
import styles from '@/styles/Home.module.css'
import { Table, Button, Modal, Input, DatePicker, Space, Drawer, Form, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useDispatch, useSelector } from 'react-redux';
import { addlistRequest, changeRequest, deleteRequest, findroleRequest, todolistRequest } from '@/saga/action';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons'
import Cookies from 'js-cookie'
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';





export default function Todo(props: any) {
  // const role = Cookies.get('todo-role')
  // const username = Cookies.get('todo-username')
  const { RangePicker } = DatePicker;


  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    dispatch(todolistRequest({ IDuser: IDuser, start: dateString[0], end: dateString[1] }))
    router.push({
      pathname: `/todolist/${IDuser}`,
      query: { start: dateString[0], end: dateString[1] },
    })
  };

  // const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
  //   console.log('onOk: ', value);
  // };




  const router = useRouter()
  const [cookie, setCookie] = useState({ role: '', token: '', username: '' });
  const [inputSelect, setInputSelect] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState({ username: '', id: '', IDuser: '', role: '', address: '', birthday: '' })
  const IDuser = props.id
  const dispatch = useDispatch()
  const data = useSelector((state: any) => state.todoList)


  const showModal = (ID: any) => {
    const value = data.find((val: any) => val._id == ID)
    setValues({ username: value.username, id: ID, IDuser, address: value.address, birthday: value.birthday, role: values.role })
    setIsModalOpen(true);
  };

  const handleOk = () => {
    dispatch(changeRequest({
      IDuser,
      id: values.id,
      address: document.querySelector('#input__change__address').value,
      birthday: document.querySelector('#input__change__birthday').value,
      role: inputSelect,
      username: document.querySelector('#input__change__username').value
    }))
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  

  const { role } = router.query
  useEffect(() => {
    
    setCookie({ role: Cookies.get('todo-role'), token: Cookies.get('cookie-todo'), username: Cookies.get('todo-username') })
    const token = Cookies.get('cookie-todo')
    if (token) {
      if(role){
        dispatch(findroleRequest({role: role}))
      }else{ 
        dispatch(todolistRequest({ IDuser: IDuser }))
      }
    } else {
      router.push('/')
    }
  }, [router])






  interface DataType {
    key: string;
    address: string;
  }



  const handleDelete = (ID: any) => {
    dispatch(deleteRequest({ _ID: ID, IDuser: IDuser }))
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'role',
      dataIndex: 'role',
      key: 'role',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'address',
      dataIndex: 'address',
      key: 'address',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'birthday',
      dataIndex: 'birthday',
      key: 'birthday',
      render: (text) => <a>{(new Date(text)).toDateString()}</a>,
    },
    {
      title: 'Edit',
      dataIndex: '_id',
      key: '_id',
      render: (text) => <div>
        <Button onClick={function () { showModal(text) }} className={styles.todo__btn__change}>Change</Button>
        <Button onClick={function () { handleDelete(text) }} danger>Delete</Button>
      </div>,
    },
  ];



  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };


  const onFinish = (values: any) => {
    console.log(document.querySelector('#select__role'))
    dispatch(addlistRequest({
      IDuser,
      username: values.username,
      address: values.address,
      birthday: document.querySelector('#input__birthday').value,
      role: inputSelect,
    }))
    setOpen(false);
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const dateFormat = 'YYYY/MM/DD';


const handleFilterRole =(value:any)=>{
  router.push({
    pathname: `/todolist/${IDuser}`,
    query: { role: `${value}` },
  })
   if(value == 'all'){
    dispatch(todolistRequest({IDuser:IDuser}))
   }else{
     dispatch(findroleRequest({role: value}))
   }
}
  return (
    <div className={styles.todo__bg}>
      <Drawer
        title="Create a new user"
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            {/* <Button onClick={onClose} type="primary">
              Submit
            </Button> */}
          </Space>
        }
      >

        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Birthday">
            <DatePicker id='input__birthday' />
          </Form.Item>
          <Form.Item label="Role">
            <Select onChange={(value) => {
              setInputSelect(value)
            }} >
              <Select.Option value="admin">admin</Select.Option>
              <Select.Option value="user">user</Select.Option>
            </Select>
          </Form.Item>


          <Form.Item
            label="address"
            name="address"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input />
          </Form.Item>


          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>

      </Drawer>



      <h3 className={styles.title__todo}>{cookie.username?.toUpperCase()}</h3>
      <div className={styles.header__todo}>
        <div>
          <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
            New user
          </Button>
          <br />
          <Select
            defaultValue={role ?role:'all'}
            style={{ width: 120 }}
            onChange={handleFilterRole}
            options={[
              { value: 'admin', label: 'admin' },
              { value: 'user', label: 'user' },
              { value: 'all', label: 'all' },


            ]}
          />
        </div>
        {cookie.role == 'admin' ? <Link href={'/dashboard'}><Button>Dashboard</Button></Link> : ''}
      </div>

      <Modal title={'Change'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input defaultValue={values.username} id='input__change__username' />
          </Form.Item>

          <Form.Item label="Birthday">
            <DatePicker id='input__change__birthday' defaultValue={dayjs(`${values.birthday}`, dateFormat)} />
          </Form.Item>

          <Form.Item label="Role">
            <Select
              style={{ width: 120 }}
              onChange={function (value: any) { setInputSelect(value) }}
              options={[
                { value: 'admin', label: 'admin' },
                { value: 'user', label: 'user' }
              ]}
            />
          </Form.Item>


          <Form.Item
            label="address"
            name="address"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input defaultValue={values.address} id='input__change__address' />
          </Form.Item>
        </Form>
      </Modal>

      {/* <Space direction="vertical" size={12}>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          onChange={onChange}
          onOk={onOk}
        />
      </Space> */}
      <Table columns={columns} dataSource={data ? data : ''} />
    </div>
  );
}





export async function getStaticPaths() {
  const response = await fetch(`http://localhost:4000/api/user/getalluser`)
  const posts = await response.json()

  const paths = posts.data.map((post: any) => ({
    params: { todo: post?._id.toString() },
  }))

  return { paths, fallback: false }
}



export async function getStaticProps({ params }: any) {
  return {
    props: {
      id: params.todo
    }
  }
}