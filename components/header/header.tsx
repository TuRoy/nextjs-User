import { addlistRequest, companyRequest } from '@/saga/action';
import { Button, Input, Drawer, DatePicker, Radio, Select, Tooltip,} from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@/styles/Home.module.css'
import { useState } from 'react';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';
import { SearchOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import type { RadioChangeEvent } from 'antd';




export interface IHeadersProps {
}

export default function Headers(props: IHeadersProps) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  const router = useRouter()
  const rolequery = router.query.role
  const [dataCreate, setDataCreate] = useState({ username: '', address: '', birthday: '', role: '', id: '', company: '' })
  let companyData = useSelector((state: any) => state.company)

  const [nameSearch, setNameSearch] = useState('')
  const [value, setValue] = useState(1);

  const showDrawer = () => {
    setOpen(true);
  };

  const handleChangeRole = (value: string) => {
    router.push({
      pathname: '/dashboard',
      query: { search: nameSearch ? nameSearch : '', role: value, page: 1, pagesize: 5 }
    })
  };

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

  const handleLogout = () => {
    Cookies.remove('cookie-todo')
    Cookies.remove('todo-username')
    Cookies.remove('todo-role')
    router.push('/')
  }

  const onClose = () => {
    setOpen(false);
  };

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

  const handleCreate = () => {
    dispatch(addlistRequest(dataCreate))
    dispatch(companyRequest(true))
    setOpen(false);
  }

  return (
    <div>
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
    </div>
  );
}
