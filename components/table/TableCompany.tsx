import * as React from 'react';
import { Button, Table, Modal, Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {useState } from 'react';
import styles from '@/styles/Home.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { createCompanyRequest, deletecompanyRequest, findonecompanyRequest } from '@/saga/action';


export interface ITablecompanyProps {
}

export default function Tablecompany(props: any) {
  const [open, setOpen] = useState(false);
  let companyData = useSelector((state: any) => state.company)
  const dispatch = useDispatch()
  let dataCompanyId = useSelector((state: any) => state.findonecompany)


  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }

  const columnModel: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <h3 key={text}>{text}</h3>,
    },
    {
      title: 'address',
      dataIndex: 'address',
      key: 'address',
      render: (text) => <a key={text}>{text}</a>,
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
      render: (text) => <a key={text}>{(new Date(text)).toLocaleDateString()}</a>,

    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text) => <a key={text}>{text}</a>,
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <h3 key={text}>{text}</h3>,
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      render: (text) => <a key={text}>{text}</a>,
    },
    {
      title: 'People',
      dataIndex: 'listuser',
      key: 'listuser',
      render: (text) => <a key={text}>{text?.length ? text?.length : 0}</a>,

    },
    {
      title: 'Show more',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a key={text}>{<Button onClick={() => { handleOpenModel(text) }}> more</Button>}</a>,
    },
    {
      title: 'DELETE',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a key={text}> <div className={styles.dashboard__flex__center}> <Button onClick={() => hanldeDeleteCompany(text)} danger> Delete</Button></div></a>,
    },

  ];
  
  const handleOpenModel = (ID: any) => {
    dispatch(findonecompanyRequest({ ID }))
    setOpen(true)
  }

  const hanldeDeleteCompany = (ID: any) => {
    dispatch(deletecompanyRequest({ ID }))
  }

  const onFinish = (values: any) => {
    console.log('Success:', values);
    dispatch(createCompanyRequest(values))
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <h1 className={styles.table__title}>Company</h1>
      <Table columns={columns} dataSource={companyData} bordered />
      <Form
        className={styles.forms_css}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 400 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <p>Company :</p>
        <Form.Item

          name="company"
          rules={[{ required: true, message: 'Please input your company!' }]}
        >
          <Input placeholder='Company' />
        </Form.Item>
        <p>City :</p>

        <Form.Item

          name="city"
          rules={[{ required: true, message: 'Please input your City!' }]}
        >
          <Input placeholder='City' />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" ghost>
            Create new company
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title={dataCompanyId ? dataCompanyId.name : ''}
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        <div>
          <Table columns={columnModel} dataSource={dataCompanyId ? dataCompanyId.listuser : []} bordered />
        </div>
      </Modal>
    </div>
  );
}
