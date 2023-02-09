import axios from 'axios'
import { all, call, takeEvery, put, take, takeLatest } from 'redux-saga/effects'
import { notification } from 'antd';
import Cookies from 'js-cookie'
import { actionTypes, getalltodoRequest, setLoading, setSizeData, todolistData, todolistRequest } from './action'



const getalltodoApi = async (data: any) => {
    return await axios.get(`http://localhost:4000/api/todo/getalltodo?page=${data.page}&pagesize=${data.pagesize}`)
}



function* getalltodoSaga({ payload }: any): any {
    const { page, pagesize} = payload
    const res = yield call(getalltodoApi, {page, pagesize})
    if (res.data.data) {
        console.log(22, res.data)
        yield put(todolistData(res.data.data))
        yield put(setSizeData(res.data.size))
        // notification.open({
        //     message: res.data.status,
        // });
    } else {
        notification.open({
            message: res.data.status,
        });
    }
}
const findApi = async (data: any) => {
    return await axios.get(`http://localhost:4000/api/todo/find?search=${data.search}&role=${data.role}&page=${data.page}&pagesize=${data.pagesize}`)
}


function* findSaga({ payload }: any): any {
    const { search, role, page, pagesize } = payload
    const res = yield call(findApi, { search, role , page, pagesize})
    if(res.data.data){
        console.log(res.data.size);
        yield put(setSizeData(res.data.size))
        yield put(todolistData(res.data.data))
    }

}

const postApiLogin = async (data: any) => {
    return await axios.post('http://localhost:4000/api/user/signin', data)
}

const postApiRegister = async (data: any) => {
    return await axios.post('http://localhost:4000/api/user/signup', data)
}

function* loginSaga({ payload }: any): any {
    const { email, password, callback } = payload
    yield put(setLoading(true))
    const res = yield call(postApiLogin, { email, password })
    if (res.data.token) {
        yield put(setLoading(false))
        Cookies.set('cookie-todo', res.data.token, { expires: new Date(Date.now() + 120000) })
        Cookies.set('todo-username', res.data.data.username, { expires: new Date(Date.now() + 120000) })
        Cookies.set('todo-role', res.data.data.role, { expires: new Date(Date.now() + 120000) })
        notification.open({
            message: res.data.status,
        });
        yield call(callback, res.data.data._id)
    } else {
        yield put(setLoading(false))
        notification.open({
            message: res.data.status,
        });
    }
}

function* registerSaga({ payload }: any): any {
    const { email, password, username, callback } = payload
    yield put(setLoading(true))
    const res = yield call(postApiRegister, { email, password, username })
    if (res.data.data) {
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


const postApiTodolist = async (data: any) => {
    return await axios.get(`http://localhost:4000/api/todo/getlogged/${data}`)
}

function* todolistSaga({ payload }: any): any {
    yield put(setLoading(true))
    const { IDuser } = payload
    const res = yield call(postApiTodolist, IDuser)
    console.log(868686, res);
    if (res.data.data) {
        yield put(setLoading(false))
        yield put(todolistData(res.data.data))
    } else {
        yield put(setLoading(false))
    }
}

const deleteApi = async (data: any) => {
    return await axios.delete(`http://localhost:4000/api/todo/delete/${data.id}`,)
}

function* deleteSaga({ payload }: any): any {
    yield put(setLoading(true))
    const { _ID, IDuser } = payload
    const res = yield call(deleteApi, { id: _ID })
    if (res.data.status == "delete success") {
        yield put(todolistRequest({ IDuser }))
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
    return await axios.get(`http://localhost:4000/api/todo/findrole/${data.role}`)
}


function* FindRoleSaga({ payload }: any): any {
    const { role } = payload
    const res = yield call(findRoleApi, { role })
    if (res) {
        yield put(todolistData(res.data.data))
    }

}

const addApi = async (data: any) => {
    return await axios.post('http://localhost:4000/api/todo/create', data)
}
const putApi = async (data: any) => {
    return await axios.put('http://localhost:4000/api/todo/update', data)
}

function* changeSaga({ payload }: any): any {
    const { id, username, role, address, birthday } = payload
    const res = yield call(putApi, { id: id, username, role, birthday, address })
    console.log(144, res);
    if (res) {
        yield put(getalltodoRequest(true))
        notification.open({
            message: res.data.status,
        });
    }
}



function* addSaga({ payload }: any): any {
    const { username, birthday, role, address, IDuser } = payload
    yield put(setLoading(true))
    const res = yield call(addApi, { username, birthday, role, address, IDuser })
    if (res.data.data) {
        notification.open({
            message: res.data.status,
        });
        yield put(setLoading(false))
        yield put(getalltodoRequest(false))
        //    yield put(todolistRequest({IDuser}))
    } else {
        notification.open({
            message: res.data.status,
        });
        yield put(setLoading(false))
    }


}



function* rootSaga(): any {
    yield all([
        yield takeLatest(actionTypes.FILTER_REQUEST, findSaga),
        yield takeEvery(actionTypes.LOGIN_REQUEST, loginSaga),
        yield takeLatest(actionTypes.REGISTER_REQUEST, registerSaga),
        // yield takeLatest(actionTypes.TODOLIST_REQUEST, todolistSaga),
        yield takeLatest(actionTypes.DELETE_REQUEST, deleteSaga),
        yield takeLatest(actionTypes.ADD_REQUEST, addSaga),
        yield takeLatest(actionTypes.GETALLTODO_REQUEST, getalltodoSaga),
        yield takeLatest(actionTypes.CHANGE_REQUSET, changeSaga),
        yield takeLatest(actionTypes.FIND_ROLE_REQUEST, FindRoleSaga)



    ])
}


export default rootSaga