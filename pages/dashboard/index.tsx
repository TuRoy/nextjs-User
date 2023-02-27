import { getalltodoRequest, filterRequest, companyRequest } from '@/saga/action';
import { Spin } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@/styles/Home.module.css'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router';
import TableCompany from '@/components/table/TableCompany';
import Headers from '@/components/header/header';
import TableListuser from '@/components/table/TableListuser';
import { handleDelete } from '@/hhh';
export default function Dashboard(props: any) {
  const dispatch = useDispatch()
  const router = useRouter()
  const rolequery = router.query.role
  const namequery = router.query.search
  const pagequery = router.query.page
  let companyData = useSelector((state: any) => state.company)
  const loading = useSelector((state: any) => state.loading)

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

  return (
    <div className={styles.dashboard__block}>
      <button onClick={()=>{handleDelete('63fc1752bd15e71adc364644')}}>asdasd</button>
      {loading ? <div className={styles.loading}><Spin size="large" /></div> : ''}
      <Headers></Headers>
      <TableListuser></TableListuser>
      <TableCompany companyData={companyData}></TableCompany>
    </div>
  );
}


