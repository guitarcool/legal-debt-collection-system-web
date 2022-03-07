import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'


const baseUrl = process.env.VUE_APP_BASE_API;
export function fileUpload(requestApi, formData){
    var url = baseUrl + requestApi;
    const instance = axios.create({
        withCredentials: true
    });
    instance.defaults.headers.common['Authorization'] = 'Bearer ' + getToken()
    return new Promise((resolve,reject) => {
        instance({
            method: 'post',
            url: url,
            data: formData,
            processData: false,   // 告诉axios不要去处理发送的数据(重要参数)
            contentType: false,   // 告诉axios不要去设置Content-Type请求头
        }).then(res => {   // 此处的.then属于axios
            resolve(res)
        }).catch(error => {
            reject(error)
        })
    })

}
