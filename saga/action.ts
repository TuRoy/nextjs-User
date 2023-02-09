export const actionTypes = {
    LOGIN_REQUEST: "LOGIN_REQUEST",
    SET_LOADING: "SET_LOADING",
    REGISTER_REQUEST:"REGISTER_REQUEST",
    TODOLIST_REQUEST: "TODOLIST_REQUEST",
    TODOLIST_DATA_SUCCESS: "TODOLIST_DATA_SUCCESS",
    DELETE_REQUEST: "DELETE_REQUEST",
    ADD_REQUEST: "ADD_REQUEST",
    GETALLTODO_REQUEST: "GETALLTODO_REQUEST",
    CHANGE_REQUSET: "CHANGE_REQUSET",
    FIND_ROLE_REQUEST: "FIND_ROLE_REQUEST",
    FILTER_REQUEST: "FILTER_REQUEST",
    SET_SIZE: "SET_SIZE",
}


export function setSizeData (data:any){
    return {
        type: actionTypes.SET_SIZE,
        payload: data
    }
}

export function filterRequest (data:any){
    return {
        type: actionTypes.FILTER_REQUEST,
        payload: data
    }
}


export function findroleRequest (data:any){
    return {
        type: actionTypes.FIND_ROLE_REQUEST,
        payload: data
    }
}

export function changeRequest (data:any){
    return {
        type: actionTypes.CHANGE_REQUSET,
        payload: data
    }
}

export function getalltodoRequest (data:any){
    return{
        type: actionTypes.GETALLTODO_REQUEST,
        payload: data
    }
}
export function addlistRequest (data:any){
    return{
        type: actionTypes.ADD_REQUEST,
        payload: data
    }
}

export function todolistRequest (data:any){
    return {
        type: actionTypes.TODOLIST_REQUEST,
        payload: data
    }
}

export function todolistData (data:any){
    return{
        type: actionTypes.TODOLIST_DATA_SUCCESS,
        payload: data
    }
}

export function loginRequest (data: any){
    return {
        type: actionTypes.LOGIN_REQUEST,
        payload: data
    }
}


export function setLoading (data: any){
    return {
        type: actionTypes.SET_LOADING,
        payload: data
    }
}

export function registerRequest (data:any){
    return{
        type: actionTypes.REGISTER_REQUEST,
        payload: data
    }
}

export function deleteRequest (data:any){
    return{
        type: actionTypes.DELETE_REQUEST,
        payload: data
    }
}