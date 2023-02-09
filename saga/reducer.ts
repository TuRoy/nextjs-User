import { actionTypes } from "./action";
import { HYDRATE } from "next-redux-wrapper"

const initialState = {
    loginRequest: null,
    loading: false,
    todoList: null,
    size: null,
}


function reducer(state = initialState, action: any) {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload }
        case actionTypes.LOGIN_REQUEST:
            return {
                ...state,
                ...{ loginRequest: action.payload }
            }
        case actionTypes.SET_SIZE:
            return {
                ...state,
                ...{ size: action.payload }
            }
        case actionTypes.SET_LOADING:
            return {
                ...state,
                ...{ loading: action.payload }
            }
        case actionTypes.TODOLIST_REQUEST:
            return {
                ...state,
                ...{ loading: action.payload }
            }
        case actionTypes.TODOLIST_DATA_SUCCESS:
            return {
                ...state,
                ...{ todoList: action.payload }
            }
        // case actionTypes.DELETE_REQUEST:
        //     return {
        //         ...state,
        //         ..
        //     }
        default:
            return state
    }
}

export default reducer