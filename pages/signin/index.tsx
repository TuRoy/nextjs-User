import Head from 'next/head'
// import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Button, Form, Input, Spin } from 'antd';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { loginRequest } from '@/saga/action';
import { useSelector } from 'react-redux/es/exports';
import { useRouter } from 'next/router';

export default function Signin() {
  const loading = useSelector((state:any)=> state.loading) 
  const router = useRouter()
  const dispatch = useDispatch()

  const onFinish = (values: any) => {
    dispatch(loginRequest({
      email: values.Email,
      password: values.password,
      callback: ()=>{
        return router.push(`/dashboard`)
      }
    }))
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {loading ? <div className={styles.loading}><Spin size="large" /></div> : ''}
      <div className={styles.login__block}>
          <h1 className={styles.title__signup}>Login</h1>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            className={styles.form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              // label="Email"
              name="Email"
              rules={[{ required: true, type: "email", message: 'The input is not valid E-mail!' }]}
            >
              <Input className={styles.input}  placeholder="Email"/>
            </Form.Item>
            <Form.Item
            className={styles.input}
              // label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password  className={styles.input}  placeholder="Password"/>
            </Form.Item>

           
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Sign In
              </Button>
              <Link href={'./signup'}> <p className={styles.p}>Tạo tài khoản</p></Link>
            </Form.Item>
          </Form>
        </div>
      </main>
    </>
  )
}
