import { all, call, takeEvery, put, takeLatest } from 'redux-saga/effects'
import { notification } from 'antd';
import Cookies from 'js-cookie'
import { actionTypes, companyRequest, findonecompanySuccess, getalltodoRequest, getCompanySuccess, setLoading, setSizeData, settoken, todolistData } from './action'
import axiosConfig from '@/config/AxiosConfig';



const getalltodoApi = async (data: any) => {
    return await axiosConfig.get(`/list-users?filter={"limit": ${data.pagesize}, "skip": ${(data.pages - 1) * data.pagesize}, "include": [{"relation": "company"}]}`)
}

const getallcompanyApi = async () => {
    return await axiosConfig.get(`/companies?filter={ "include": [{"relation": "listuser"}]}`)
}

const findonecompanyApi = async (data: any) => {
    return await axiosConfig.get(`/companies/${data}?filter={"include": [{"relation": "listuser"}]}`,)
}

const deletecompanyApi = async (data: any) => {
    return await axiosConfig.delete(`/companies/${data}`,)
}

const deleteApi = async (data: any) => {
    return await axiosConfig.delete(`/list-users/${data.id}`,)
}

const createcompanyApi = async (data: any) => {
    return await axiosConfig.post(`/companies`, data)
}

const postApiLogin = async (data: any) => {
    return await axiosConfig.post('/users/login', data)
}

const postApiRegister = async (data: any) => {
    return await axiosConfig.post('/signup', data)
}

function* findonecompanySaga({ payload }: any): any {
    const { ID } = payload
    yield put(setLoading(true))
    const res = yield call(findonecompanyApi, ID)
    if (res) {
        yield put(findonecompanySuccess(res.data))
        yield put(setLoading(false))
    }
}

function* deletecompanySaga({ payload }: any): any {
    const { ID } = payload
    yield put(setLoading(true))
    const res = yield call(deletecompanyApi, ID)
    if (res) {
        yield put(getalltodoRequest(true))
        yield put(companyRequest(true))
        yield put(setLoading(false))
    }
}

function* getallcompanySaga({ payload }: any): any {
    yield put(setLoading(true))
    const res = yield call(getallcompanyApi)
    if (res.data) {
        yield put(getCompanySuccess(res.data))
        yield put(setLoading(false))
    }
}

function* createcompanySaga({ payload }: any): any {
    const { company, city } = payload
    yield put(setLoading(true))
    const res = yield call(createcompanyApi, { name: company, city })
    if (res.data) {
        yield put(companyRequest(true))
        yield put(setLoading(false))
    }
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
                , "include": [{"relation": "company"}]}`)
    }
    if (data.role) { return await axiosConfig.get(`/list-users?filter={"limit":  ${data.pagesize}, "skip":${(data.pages - 1) * data.pagesize} ,"where": {"role": "${data.role}"}, "include": [{"relation": "company"}]}`) }
    if (data.search && data.role) {
        return await axiosConfig.get(`/list-users?filter={
            "limit":  ${data.pagesize}, 
            "skip":${(data.pages - 1) * data.pagesize}, 
            "where": {
                "role" : "${data.role}",
                "username": {"like": "${data.search}"}
                },
            "include": [{"relation": "company"}]
            }`)
    }
    if (!data.role && !data.search) {
        return await axiosConfig.get(`/list-users?filter={ "limit":  ${data.pagesize}, "skip":${(data.pages - 1) * data.pagesize}, "include": [{"relation": "company"}]}`)

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

function* loginSaga({ payload }: any): any {
    const { email, password, callback } = payload
    yield put(setLoading(true))
    const res = yield call(postApiLogin, { email, password })
    if (res) {
        Cookies.set('cookie-todo', res.data.token, { expires: new Date(Date.now() + 180000000) })
        yield put(setLoading(false))
        yield put(settoken(res.data.token))
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

    const { id, username, role, address, birthday, company } = payload
    const res = yield call(putApi, { id: id, username, role, birthday, address, companyId: company })
    if (res) {
        yield put(setLoading(false))
        yield put(getalltodoRequest(true))
        yield put(companyRequest(true))
        notification.open({
            message: "change success",
        });
    }
}

function* addSaga({ payload }: any): any {
    const { username, birthday, role, address, company } = payload
    yield put(setLoading(true))
    const res = yield call(addApi, { username, birthday, role, address, companyId: company })
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
        yield takeEvery(actionTypes.FIND_ONE_COMPANY_REQUEST, findonecompanySaga),
        yield takeEvery(actionTypes.DELETE_COMPANY_REQUEST, deletecompanySaga),
        yield takeEvery(actionTypes.CREATE_COMPANY_REQUEST, createcompanySaga),
        yield takeEvery(actionTypes.GETALLCOMPANY_REQUEST, getallcompanySaga),
        yield takeEvery(actionTypes.FILTER_REQUEST, findSaga),
        yield takeLatest(actionTypes.LOGIN_REQUEST, loginSaga),
        yield takeEvery(actionTypes.REGISTER_REQUEST, registerSaga),
        yield takeEvery(actionTypes.DELETE_REQUEST, deleteSaga),
        yield takeEvery(actionTypes.ADD_REQUEST, addSaga),
        yield takeEvery(actionTypes.GETALLTODO_REQUEST, getalltodoSaga),
        yield takeEvery(actionTypes.CHANGE_REQUSET, changeSaga),
        yield takeEvery(actionTypes.FIND_ROLE_REQUEST, FindRoleSaga)
    ])
}

export default rootSaga