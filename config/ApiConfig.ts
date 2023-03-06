import axiosConfig from '@/config/AxiosConfig';


interface UpdateDataProps {
    path: string,
    documentId: string,
    data: any
}

interface PostDataProps {
    path: string,
    data: object
}

interface DeleteDataProps {
    path: string,
    documentId: string,
}

interface FilterInclude {
    relation: string,
    scope?: Array<FilterInclude>
}

interface GetDataProps {
    path: string,
    documentId?: string,
    filter?: {
        limit?: string,
        skip?: string,
        where?: any,
        include?: Array<FilterInclude | string>
    }
}

export const putApi = async (data: UpdateDataProps) => {
    const url = ['', data.path, data.documentId]?.filter(e => e != undefined).join('/')
    try {
        return await axiosConfig.put(url, data.data)
    } catch (error) {
        return error
    }

}

export const getApi = async (data: GetDataProps) => {
    const url = ['', data.path, data.documentId]?.filter(e => e != undefined).join('/')

    return await axiosConfig.get(
        url,
        {
            params: { filter: data?.filter },

            paramsSerializer: ({
                serialize: (params) => {
                    const aaaa = encodeURIComponent(JSON.stringify(params?.filter))
                    return `filter=${aaaa}`
                }  
            })
        })
}

export const deleteApi = async (data: DeleteDataProps) => {
    const url = ['', data.path, data.documentId]?.filter(e => e != undefined).join('/')
    return await axiosConfig.delete(url)
}

export const postApi = async (data: PostDataProps) => {
    try {
        return await axiosConfig.post(`/${data.path}`, data.data)
    } catch (error) {
        return error
    }
}