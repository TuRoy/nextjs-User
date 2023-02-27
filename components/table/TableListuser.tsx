import { deleteRequest, changeRequest, companyRequest } from '@/saga/action';
import { Button, Input, Modal, Table, DatePicker, Radio, Pagination } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@/styles/Home.module.css'
import { useState } from 'react';
import { useRouter } from 'next/router';
import type { ColumnsType } from 'antd/es/table';
import type { DatePickerProps } from 'antd';
import type { RadioChangeEvent } from 'antd';
import dayjs from 'dayjs';

export interface ITableListuserProps {
}

export default function TableListuser(props: ITableListuserProps) {
    const dispatch = useDispatch()
    const dateFormat = 'YYYY/MM/DD';
    const router = useRouter()
    const rolequery = router.query.role
    let data = useSelector((state: any) => state.todoList)
    let companyData = useSelector((state: any) => state.company)
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


    const onchangeModel = (e: any) => {
        let clone = {...dataCreate}
        clone[e.target.id] = e.target.value
        console.log(71, clone);
        console.log(70, e.target.id);
        setDataCreate(clone)
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
            render: (text) => <a key={text}>{text}</a>,
        },
        {
            title: 'Birthday',
            dataIndex: 'birthday',
            key: 'birthday',
            render: (text) => <a key={text}>{(new Date(text)).toLocaleDateString()}</a>,
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
            render: (text) => <div key={text} className={styles.dashboard__flex__center}>
                <Button className={styles.dashboard__input__search} onClick={() => { handleOpenChange(text) }} type="primary" ghost>Change</Button>
                <Button onClick={() => { handleDelete(text) }} danger>delete</Button>
            </div>,
        },

    ];

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

    const onChangeRole = (e: RadioChangeEvent) => {
        setDataCreate({
            username: dataCreate.username,
            address: dataCreate.address,
            birthday: dataCreate.birthday,
            role: e.target.value,
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
    };

    const handlChangePagina = (page: any, pageSize: any) => {
        router.push({
            pathname: '/dashboard',
            query: { role: rolequery ? rolequery : '', page: page, pagesize: 5 }
        })
    }

    return (
        <div>
            <Modal title="Change User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div>
                    <p className={styles.dashboard__color__text}>Username:</p>
                    <Input value={dataCreate.username} id='username' onChange={onchangeModel} placeholder='UserName' type='text'></Input>

                    <p className={styles.dashboard__color__text}> Address: </p>
                    <Input value={dataCreate.address} id='address' onChange={onchangeModel} placeholder='Address' type='text'></Input>

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
        </div>
    );
}
