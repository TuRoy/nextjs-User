import { all, call, takeEvery, put, takeLatest } from 'redux-saga/effects'
import { notification } from 'antd';
import Cookies from 'js-cookie'
import {
    actionTypes,
    companyRequest,
    findonecompanySuccess,
    getalltodoRequest,
    getCompanySuccess,
    setLoading,
    setSizeData,
    settoken,
    todolistData
} from './action'
import { getApi, deleteApi, postApi, putApi } from '@/config/ApiConfig';

function* findonecompanySaga({ payload }: any): any {
    const { ID } = payload
    yield put(setLoading(true))
    const res = yield call(getApi, { path: 'companies', id: ID, relation: 'listuser' })
    if (res) {
        yield put(findonecompanySuccess(res.data))
        yield put(setLoading(false))
    }
}

function* deletecompanySaga({ payload }: any): any {
    const { ID } = payload
    yield put(setLoading(true))
    const res = yield call(deleteApi, { path: 'companies', id: ID })
    if (res) {
        yield put(getalltodoRequest(true))
        yield put(companyRequest(true))
        yield put(setLoading(false))
    }
}

function* getallcompanySaga({ payload }: any): any {
    yield put(setLoading(true))
    const res = yield call(getApi, { path: 'companies', relation: 'listuser' })
    if (res.data) {
        yield put(getCompanySuccess(res.data))
        yield put(setLoading(false))
    }
}

function* createcompanySaga({ payload }: any): any {
    const { company, city } = payload
    yield put(setLoading(true))
    const res = yield call(postApi, { path: 'companies', data: { name: company, city } })
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
    const res = yield call(getApi, { path: 'users', relation: 'company', pages, pagesize })
    if (res.data) {
        yield put(todolistData(res.data))
        yield put(setSizeData(res.data.length))
        yield put(setLoading(false))
    }
}

function* findSaga({ payload }: any): any {
    yield put(setLoading(true))
    const { search, role, page, pagesizes } = payload
    let pages = page ? page * 1 : 1
    let pagesize = pagesizes ? pagesizes : 5
    const res = yield call(getApi, { path: 'users', search, role: role == 'All' ? null : role, pages, pagesize, relation: 'company' })
    if (res.data) {
        yield put(setSizeData(res.data.length))
        yield put(todolistData(res.data))
        yield put(setLoading(false))
    }

}

function* loginSaga({ payload }: any): any {
    const { email, password, callback } = payload
    yield put(setLoading(true))
    const res = yield call(postApi, { path: 'users/login', data: { email, password } })
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
    const res = yield call(postApi, { path: 'signup', data: { email, password, username } })
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
    const res = yield call(deleteApi, { path: 'users', id: _ID })
    console.log(180, res);
    if (res) {
        yield put(getalltodoRequest(false))
        yield put(setLoading(false))
        notification.open({
            message: " delete success",
        });
    }
}

function* changeSaga({ payload }: any): any {
    yield put(setLoading(true))

    const { id, username, role, address, birthday, company } = payload
    const res = yield call(putApi, { id: id, username, role, birthday, address, companyId: company })
    console.log(res, 228);
    if (!res.response) {
        yield put(setLoading(false))
        yield put(getalltodoRequest(true))
        yield put(companyRequest(true))
        notification.open({
            message: "change success",
        });
    } else {
        yield put(setLoading(false))
        notification.open({
            message: res.response.data.error.message,
        });
    }
}

function* addUserSaga({ payload }: any): any {
    const { username, birthday, role, address, company } = payload
    yield put(setLoading(true))
    const res = yield call(postApi, { path: 'users', data: { username, birthday, role, address, companyId: company } })
    if (res?.data) {
        notification.open({
            message: "create success",
        });
        yield put(setLoading(false))
        yield put(getalltodoRequest(false))
    } else {
        notification.open({
            message: res.response.data.error.message,
        });
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
        yield takeEvery(actionTypes.ADD_REQUEST, addUserSaga),
        yield takeEvery(actionTypes.GETALLTODO_REQUEST, getalltodoSaga),
        yield takeEvery(actionTypes.CHANGE_REQUSET, changeSaga),
    ])
}

export default rootSaga