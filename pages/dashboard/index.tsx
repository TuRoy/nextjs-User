import { deleteRequest, getalltodoRequest, addlistRequest, changeRequest, filterRequest } from '@/saga/action';
import { Button, Input, Modal, Table, Drawer, DatePicker, Radio, Select, Tooltip, notification, Pagination  } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@/styles/Home.module.css'
import { useState } from 'react';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';
import type { ColumnsType } from 'antd/es/table';
import type { DatePickerProps } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';







export default function Dashboard(props: any) {
  const dispatch = useDispatch()
  const router = useRouter()



  const rolequery = router.query.role
  const namequery = router.query.search
  const pagequery = router.query.page




  // if (rolequery && rolequery !== "All") {
  //   data = data.filter((val: any) => val.role == rolequery)
  // }
  // if(namequery){
  //   data = data.filter((val: any) => val.username.includes(namequery) )
  // }
  let data = useSelector((state: any) => state.todoList)
  let size = useSelector((state: any) => state.size)

  React.useEffect(() => {
    const username = Cookies.get('todo-username')
    if (!username) {
      router.push('/')
    } else{
      if(rolequery || namequery){
        dispatch(filterRequest({search: namequery, role: rolequery , page: pagequery? pagequery: 1, pagesize: 5}))
      }else{
        dispatch(getalltodoRequest({page: pagani, pagesize: 5}))
      }
    }
  }, [router])

  // ***************************************************


  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (value: any) => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log(dataCreate)
    dispatch(changeRequest(dataCreate))

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  // ***************************************************

  const [dataCreate, setDataCreate] = useState({ username: '', address: '', birthday: '', role: '', id: '' })
  // const [dataChange, setDataChange] = useState({ username: '', address: '', birthday: '', role: '' })
const [pagani, setPagani] = useState(1)


  const handleDelete = (ID: any) => {
    dispatch(deleteRequest({ _ID: ID }))
  }

  const handleOpenChange = (ID: any) => {
    let newdata = data.find((val: any) => val._id == ID)
    setDataCreate({
      username: newdata.username,
      address: newdata.address,
      birthday: newdata.birthday,
      role: newdata.role,
      id: newdata._id,
    })
    showModal(ID)
  }


  const handleCreate = () => {
    dispatch(addlistRequest(dataCreate))
    setOpen(false);
    console.log(dataCreate)
  }

  const onchangeUsername = (e: any) => {
    setDataCreate({
      username: e.target.value,
      address: dataCreate.address,
      birthday: dataCreate.birthday,
      role: dataCreate.role,
      id: dataCreate.id
    })
  }

  const onchangeAddress = (e: any) => {
    setDataCreate({
      username: dataCreate.username,
      address: e.target.value,
      birthday: dataCreate.birthday,
      role: dataCreate.role,
      id: dataCreate.id
    })
  }


  const handleLogout = () => {
    Cookies.set('cookie-todo', '')
    Cookies.set('todo-username', '')
    Cookies.set('todo-role', '')
    router.push('/')
  }
  // ***************************************************



  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Edit',
      dataIndex: '_id',
      key: '_id',
      render: (text) => <div className={styles.dashboard__flex__center}>
        <Button  className={styles.dashboard__input__search} onClick={() => { handleOpenChange(text) }} type="primary" ghost>Change</Button>
        <Button onClick={() => { handleDelete(text) }} danger>delete</Button>
      </div>,
    },

  ];

  // ***************************************************

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // ***************************************************


  const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    setDataCreate({
      username: dataCreate.username,
      address: dataCreate.address,
      birthday: dateString,
      role: dataCreate.role,
      id: dataCreate.id
    })
  };




  const [value, setValue] = useState(1);

  const onChangeRole = (e: RadioChangeEvent) => {
    setDataCreate({
      username: dataCreate.username,
      address: dataCreate.address,
      birthday: dataCreate.birthday,
      role: e.target.value,
      id: dataCreate.id
    })
    setValue(e.target.value);
  };


  const handleChangeRole = (value: string) => {
    router.push({
      pathname: '/dashboard',
      query: { search: nameSearch?nameSearch:'',  role: value, page: 1, pagesize:5 }
    })
    console.log(`selected ${value}`);
  };
  const [nameSearch, setNameSearch] = useState('')

  const  handleChangeSearch = (e:any)=>{
    setNameSearch(e.target.value)
  }

  const handleSearch = ()=>{
    console.log(nameSearch.length)
      router.push({
        pathname: '/dashboard',
        query: { search: nameSearch, role: rolequery? rolequery : '', page: 1, pagesize:5}
      })
    
  }


  const handlChangePagani =(page:any, pageSize:any)=>{
    setPagani(page)
    router.push({
      pathname: '/dashboard',
      query: { search: nameSearch, role: rolequery? rolequery : '', page: page, pagesize:5}
    })
    // if(rolequery || namequery){
    //   dispatch(filterRequest({search: namequery, role: rolequery}))
    // }else{
    //   dispatch(getalltodoRequest({page: page, pagesize: 5}))
    // }
  }

  const dateFormat = 'YYYY/MM/DD';
  return (
    <div className={styles.dashboard__block}>
      <div className={styles.dashboard__flex}>
        <div >
          <Button type="primary" ghost className={styles.dashboard__button__show} onClick={showDrawer}>
            Create new user
          </Button>
          <Select
            defaultValue="All"
            style={{ width: 120 }}
            onChange={handleChangeRole}
            options={[
              { value: 'Admin', label: 'Admin' },
              { value: 'User', label: 'User' },
              { value: 'All', label: 'All' },
            ]}
          />
        </div>
        <div className={styles.dashboard__flex}>
          <Input onChange={handleChangeSearch}  className={styles.dashboard__input__search} type='text' placeholder='Name'></Input>

          <Tooltip title="search">
            <Button onClick={handleSearch} type="dashed" shape="circle" icon={<SearchOutlined />} />
          </Tooltip>
        </div >
        <Button onClick={handleLogout} type="primary" danger>Log out</Button>
      </div>

      <Drawer title="Basic Drawer" placement="right" onClose={onClose} open={open}>
        <p className={styles.dashboard__color__text}>Username:</p>
        <Input   onChange={onchangeUsername} placeholder='UserName' type='text'></Input>

        <p className={styles.dashboard__color__text}> Address: </p>
        <Input  onChange={onchangeAddress} placeholder='Address' type='text'></Input>

        <p className={styles.dashboard__color__text}> Birthday: </p>
        <DatePicker  onChange={onChangeDate} />

        <div className={styles.dashboard__color__text} >
          <Radio.Group onChange={onChangeRole} value={value}>
            <Radio value={'Admin'}>Admin</Radio>
            <Radio value={'User'}>User</Radio>
          </Radio.Group>
        </div>
        <div>
          <Button className={styles.dashboard__button} type='primary' onClick={handleCreate}>Create</Button>
        </div>
      </Drawer>

      <Modal title="Change User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <p className={styles.dashboard__color__text}>Username:</p>
          <Input value={dataCreate.username} onChange={onchangeUsername} placeholder='UserName' type='text'></Input>

          <p className={styles.dashboard__color__text}> Address: </p>
          <Input value={dataCreate.address} onChange={onchangeAddress} placeholder='Address' type='text'></Input>

          <p className={styles.dashboard__color__text}> Birthday: </p>
          <DatePicker onChange={onChangeDate}  defaultValue={dayjs(`${dataCreate.birthday}`, dateFormat)} />

          <div className={styles.dashboard__color__text} >
            <Radio.Group onChange={onChangeRole} value={dataCreate.role} >
              <Radio value={'Admin'}>Admin</Radio>
              <Radio value={'User'}>User</Radio>
            </Radio.Group>
          </div>
        </div>
      </Modal>

      <Table columns={columns} dataSource={data} bordered pagination={false} />

     <div className={styles.dashboard__pagina}> <Pagination onChange={handlChangePagani} defaultCurrent={ 1} total={size*2} />;</div>
    </div>
  );
}


