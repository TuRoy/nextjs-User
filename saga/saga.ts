import axios from 'axios'
import { all, call, takeEvery, put, take, takeLatest } from 'redux-saga/effects'
import { notification } from 'antd';
import Cookies from 'js-cookie'
import { actionTypes, getalltodoRequest, setLoading, setSizeData, todolistData } from './action'
import axiosConfig from '@/config/AxiosConfig';



const getalltodoApi = async (data: any) => {

    return await axiosConfig.get(`/list-users?filter={"limit": ${data.pagesize}, "skip": ${(data.pages - 1) * data.pagesize}}`)
}



function* getalltodoSaga({ payload }: any): any {
    yield put(setLoading(true))
    const { page, pagesizes } = payload
    let pages = page ? page : 1
    let pagesize = pagesizes ? pagesizes : 5
    const res = yield call(getalltodoApi, { pages, pagesize })
    if (res.data) {
        yield put(todolistData(res.data))
        yield put(setSizeData(res.data.length))
        yield put(setLoading(false))
    }
}
const findApi = async (data: any) => {

    if (data.search) {
        return await axiosConfig.get(`/list-users?filter={
             "limit":  ${data.pagesize},
              "skip":${(data.pages - 1) * data.pagesize} ,
               "where": {
                 "username": {"like": "${data.search}"} } 
                }`)
    }
    if (data.role) { return await axiosConfig.get(`/list-users?filter={"limit":  ${data.pagesize}, "skip":${(data.pages - 1) * data.pagesize} ,"where": {"role": "${data.role}"}}`) }
    if (data.search && data.role) {
        return await axiosConfig.get(`/list-users?filter={
            "limit":  ${data.pagesize}, 
            "skip":${(data.pages - 1) * data.pagesize}, 
            "where": {
                "role" : "${data.role}",
                "username": {"like": "${data.search}"}
                }
            }`)
    }
    if (!data.role && !data.search) {
        return await axiosConfig.get(`/list-users?filter={ "limit":  ${data.pagesize}, "skip":${(data.pages - 1) * data.pagesize}`)

    }
}


function* findSaga({ payload }: any): any {
    yield put(setLoading(true))
    const { search, role, page, pagesizes } = payload
    let pages = page ? page * 1 : 1
    let pagesize = pagesizes ? pagesizes : 5
    const res = yield call(findApi, { search, role, pages, pagesize })
    if (res.data) {
        yield put(setSizeData(res.data.length))
        yield put(todolistData(res.data))
        yield put(setLoading(false))
    }

}

const postApiLogin = async (data: any) => {
    return await axios.post('http://localhost:4000/users/login', data)
}

const postApiRegister = async (data: any) => {
    return await axios.post('http://localhost:4000/signup', data)
}

function* loginSaga({ payload }: any): any {
    const { email, password, callback } = payload
    yield put(setLoading(true))
    const res = yield call(postApiLogin, { email, password })
    console.log(69, res);
    if (res) {
        yield put(setLoading(false))
        Cookies.set('cookie-todo', res.data.token, { expires: new Date(Date.now() + 900000) })
        notification.open({
            message: 'login success',
        });
        yield call(callback)
    } else {
        yield put(setLoading(false))
        notification.open({
            message: "error",
        });
    }
}

function* registerSaga({ payload }: any): any {
    const { email, password, username, callback } = payload
    yield put(setLoading(true))
    const res = yield call(postApiRegister, { email, password, username })
    console.log(80, res);
    if (res) {
        yield put(setLoading(false))
        yield call(callback())
        notification.open({
            message: res.data.status,
        });
    } else {
        yield put(setLoading(false))
        notification.open({
            message: res.data.status,
        });
    }
}



const deleteApi = async (data: any) => {
    return await axiosConfig.delete(`/list-users/${data.id}`,)
}


function* deleteSaga({ payload }: any): any {
    yield put(setLoading(true))
    const { _ID } = payload
    const res = yield call(deleteApi, { id: _ID })
    if (res) {
        yield put(getalltodoRequest(false))
        yield put(setLoading(false))
        notification.open({
            message: res.data.status,
        });
    }
    else {
        yield put(setLoading(false))
        notification.open({
            message: res.data.status,
        });
    }
}

const findRoleApi = async (data: any) => {
    return await axiosConfig.get(`/api/todo/findrole/${data.role}`)
}


function* FindRoleSaga({ payload }: any): any {
    yield put(setLoading(true))

    const { role } = payload
    const res = yield call(findRoleApi, { role })
    if (res) {
        yield put(setLoading(false))
        yield put(todolistData(res.data.data))
    }

}

const addApi = async (data: any) => {
    return await axiosConfig.post('/list-users', data)
}
const putApi = async (data: any) => {
    return await axiosConfig.put(`/list-users/${data.id}`, data)
}

function* changeSaga({ payload }: any): any {
    yield put(setLoading(true))

    const { id, username, role, address, birthday } = payload
    const res = yield call(putApi, { id: id, username, role, birthday, address })
    if (res) {
        yield put(setLoading(false))
        yield put(getalltodoRequest(true))
        notification.open({
            message: "change success",
        });
    }
}



function* addSaga({ payload }: any): any {
    const { username, birthday, role, address } = payload
    yield put(setLoading(true))
    const res = yield call(addApi, { username, birthday, role, address })
    if (res) {
        notification.open({
            message: "create success",
        });
        yield put(setLoading(false))
        yield put(getalltodoRequest(false))
    }


}



function* rootSaga(): any {
    yield all([
        yield takeLatest(actionTypes.FILTER_REQUEST, findSaga),
        yield takeEvery(actionTypes.LOGIN_REQUEST, loginSaga),
        yield takeLatest(actionTypes.REGISTER_REQUEST, registerSaga),
        yield takeLatest(actionTypes.DELETE_REQUEST, deleteSaga),
        yield takeLatest(actionTypes.ADD_REQUEST, addSaga),
        yield takeLatest(actionTypes.GETALLTODO_REQUEST, getalltodoSaga),
        yield takeLatest(actionTypes.CHANGE_REQUSET, changeSaga),
        yield takeLatest(actionTypes.FIND_ROLE_REQUEST, FindRoleSaga)
    ])
}


export default rootSaga