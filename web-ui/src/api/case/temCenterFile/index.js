import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

const temCenterApi = {
    list(query) {
        return request({
            url: '/case/assignment/list',
            method: 'get',
            params: query
        })
    },
    deleteFile(id){
        return request({
            url: '/template/info/templateFile/delete/' + id,
            method: 'post'
        })
    },
    findByUsername(id){
        return request({
            url: '/template/info/findByUsername/' + id,
            method: 'post'
        })
    }
}

// 下载用户导入模版
export default temCenterApi
