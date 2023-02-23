import { deleteRequest, getalltodoRequest, addlistRequest, changeRequest, filterRequest, companyRequest } from '@/saga/action';
import { Button, Input, Modal, Table, Drawer, DatePicker, Radio, Select, Tooltip, Spin, Pagination } from 'antd';
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
import TableCompnent from '@/components/table/table';

export default function Dashboard(props: any) {
  const dispatch = useDispatch()
  const router = useRouter()
  const rolequery = router.query.role
  const namequery = router.query.search
  const pagequery = router.query.page
  let data = useSelector((state: any) => state.todoList)
  let companyData = useSelector((state: any) => state.company)
  const loading = useSelector((state: any) => state.loading)
  const dateFormat = 'YYYY/MM/DD';

  React.useEffect(() => {
    const token = Cookies.get('cookie-todo')
    if (!token) {
      router.push('/')
    } else {
      dispatch(companyRequest(true))


      if (rolequery && namequery) {
        dispatch(filterRequest({ search: namequery, role: rolequery, page: pagequery ? pagequery : 1, pagesize: 5 }))
      }

      if (rolequery) {
        if (rolequery == "All") {
          dispatch(getalltodoRequest({ page: pagequery, pagesize: 5 }))
        } else {
          dispatch(filterRequest({ page: pagequery ? pagequery : 1, pagesize: 5, role: rolequery }))
        }
      }

      if (namequery) {
        dispatch(filterRequest({ page: pagequery ? pagequery : 1, pagesize: 5, search: namequery }))
      }

      if (!rolequery && !namequery) {
        dispatch(getalltodoRequest({ page: pagequery, pagesize: 5 }))
      }

    }
  }, [router])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataCreate, setDataCreate] = useState({ username: '', address: '', birthday: '', role: '', id: '', company: '' })


  const showModal = (value: any) => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    dispatch(changeRequest(dataCreate))
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (ID: any) => {
    dispatch(deleteRequest({ _ID: ID }))
    dispatch(companyRequest(true))
  }

  const handleOpenChange = (ID: any) => {
    let newdata = data.find((val: any) => val.id == ID)
    setDataCreate({
      username: newdata.username,
      address: newdata.address,
      birthday: newdata.birthday,
      role: newdata.role,
      id: newdata.id,
      company: newdata.companyId
    })
    showModal(ID)
  }

  const handleCreate = () => {
    dispatch(addlistRequest(dataCreate))
    dispatch(companyRequest(true))
    setOpen(false);
  }

  const onchangeUsername = (e: any) => {
    setDataCreate({
      username: e.target.value,
      address: dataCreate.address,
      birthday: dataCreate.birthday,
      role: dataCreate.role,
      id: dataCreate.id,
      company: dataCreate.company
    })
  }

  const onchangeAddress = (e: any) => {
    setDataCreate({
      username: dataCreate.username,
      address: e.target.value,
      birthday: dataCreate.birthday,
      role: dataCreate.role,
      id: dataCreate.id,
      company: dataCreate.company
    })
  }

  const handleLogout = () => {
    Cookies.remove('cookie-todo')
    Cookies.remove('todo-username')
    Cookies.remove('todo-role')
    router.push('/')
  }
  
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
      render: (text) => <a>{(new Date(text)).toLocaleDateString()}</a>,
    },

    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text) => <a>{text?.name}</a>,

    },
    {
      title: 'Edit',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <div className={styles.dashboard__flex__center}>
        <Button className={styles.dashboard__input__search} onClick={() => { handleOpenChange(text) }} type="primary" ghost>Change</Button>
        <Button onClick={() => { handleDelete(text) }} danger>delete</Button>
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

  const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    setDataCreate({
      username: dataCreate.username,
      address: dataCreate.address,
      birthday: dateString,
      role: dataCreate.role,
      id: dataCreate.id,
      company: dataCreate.company
    })
  };

  const [value, setValue] = useState(1);

  const onChangeRole = (e: RadioChangeEvent) => {
    setDataCreate({
      username: dataCreate.username,
      address: dataCreate.address,
      birthday: dataCreate.birthday,
      role: e.target.value,
      id: dataCreate.id,
      company: dataCreate.company
    })
    setValue(e.target.value);
  };

  const onChangeCompany = (e: RadioChangeEvent) => {
    setDataCreate({
      username: dataCreate.username,
      address: dataCreate.address,
      birthday: dataCreate.birthday,
      role: dataCreate.role,
      id: dataCreate.id,
      company: e.target.value,
    })
    setValue(e.target.value);
  };


  const handleChangeRole = (value: string) => {
    router.push({
      pathname: '/dashboard',
      query: { search: nameSearch ? nameSearch : '', role: value, page: 1, pagesize: 5 }
    })
  };

  const [nameSearch, setNameSearch] = useState('')

  const handleChangeSearch = (e: any) => {
    setNameSearch(e.target.value)
  }

  const handleSearch = () => {
    console.log(nameSearch.length)
    router.push({
      pathname: '/dashboard',
      query: { search: nameSearch, role: rolequery ? rolequery : '', page: 1, pagesize: 5 }
    })
  }

  const handlChangePagina = (page: any, pageSize: any) => {
    router.push({
      pathname: '/dashboard',
      query: { search: nameSearch, role: rolequery ? rolequery : '', page: page, pagesize: 5 }
    })
  }
  

  return (
    <div className={styles.dashboard__block}>
      {loading ? <div className={styles.loading}><Spin size="large" /></div> : ''}
      <div className={styles.dashboard__flex}>
        <div >
          <Button type="primary" ghost className={styles.dashboard__button__show} onClick={showDrawer}>
            Create new user
          </Button>
          <Select
            defaultValue={'Role'}
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
          <Input onChange={handleChangeSearch} className={styles.dashboard__input__search} type='text' placeholder='Name'></Input>

          <Tooltip title="search">
            <Button onClick={handleSearch} type="dashed" shape="circle" icon={<SearchOutlined />} />
          </Tooltip>
        </div >
        <Button onClick={handleLogout} type="primary" danger>Log out</Button>
      </div>

      <Drawer title="Basic Drawer" placement="right" onClose={onClose} open={open}>
        <p className={styles.dashboard__color__text}>Username:</p>
        <Input onChange={onchangeUsername} placeholder='UserName' type='text'></Input>

        <p className={styles.dashboard__color__text}> Address: </p>
        <Input onChange={onchangeAddress} placeholder='Address' type='text'></Input>

        <p className={styles.dashboard__color__text}> Birthday: </p>
        <DatePicker onChange={onChangeDate} />


        <p className={styles.dashboard__color__text}> Company: </p>
        <Radio.Group onChange={onChangeCompany}  >
          {companyData?.map((value: any) => {
            return (
              <Radio key={value.id} value={value.id}>{value.name}</Radio>
            )

          })}

        </Radio.Group>

        <p className={styles.dashboard__color__text}> Role: </p>
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
          <DatePicker onChange={onChangeDate} defaultValue={dayjs(`${dataCreate.birthday}`, dateFormat)} />
          <p className={styles.dashboard__color__text}> Company: </p>
          <Radio.Group onChange={onChangeCompany} value={dataCreate.company}  >
            {companyData?.map((value: any) => {
              return (
                <Radio value={value.id}>{value.name}</Radio>
              )

            })}

          </Radio.Group>

          <p className={styles.dashboard__color__text}> Role: </p>
          <div className={styles.dashboard__color__text} >
            <Radio.Group onChange={onChangeRole} value={dataCreate.role} >
              <Radio value={'Admin'}>Admin</Radio>
              <Radio value={'User'}>User</Radio>
            </Radio.Group>
          </div>
        </div>
      </Modal>
      <h1 className={styles.table__title}>User</h1>
      <Table columns={columns} dataSource={data} bordered pagination={false} />
      <div className={styles.dashboard__pagina}> <Pagination onChange={handlChangePagina} defaultCurrent={1} total={50} />;</div>

      <h1 className={styles.table__title}>Company</h1>
      <TableCompnent companyData={companyData}></TableCompnent>
    </div>
  );
}


