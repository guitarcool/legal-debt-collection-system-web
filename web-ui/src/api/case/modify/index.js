import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

const modifyApi = {
    //下载模版
    importTemplate() {
        return request({
            url: '/case/letter/importTemplate',
            method: 'get'
        })
    },
    list(data) {
        return request({
            url: '/case/letter/list',
            method: 'post',
            data
        })
    },
    exportRole(query) {
        return request({
            url: '/case/letter/export',
            method: 'get',
            params: query
        })
    },
    applyModify(data) {
        return request({
            url: '/case/letter/review',
            method: 'post',
            params:data
        })
    },
}

// 下载用户导入模版
export default modifyApi
