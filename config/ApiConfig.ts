import axiosConfig from '@/config/AxiosConfig';

export const  putApi = async (data: any) => {
    try {
        let test = await axiosConfig.put(`/users/${data.id}`, data)
        return test
    } catch (error) {
        return error
    }
}

export const getApi = async (data: any) => {
    return await axiosConfig.get(`/${data.path}${data.id ? `/${data.id}`: ''}?filter={${data.pagesize ?`"limit":${data.pagesize},"skip":${(data.pages - 1) * data.pagesize},`:''}"where": {${data.role ? `"role" : "${data.role}"`:''}${data.search ? `${data.role ? ',':''}"username": {"like":"${data.search}"}`:''}},"include": [{"relation": "${data.relation}"}]}`)
}

export const deleteApi = async (data: any) => {
    return await axiosConfig.delete(`/${data.path}/${data.id}`)
}

export const postApi = async (data: any) => {
    console.log(data.data);
    try {
        let test = await axiosConfig.post(`/${data.path}`, data.data)
        return test
    } catch (error) {
        return error
    }
}