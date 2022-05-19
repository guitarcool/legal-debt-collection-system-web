import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

const financeApi = {
    //下载模版
    importTemplate() {
        return request({
            url: '/case/financial/importTemplate',
            method: 'get'
        })
    },
    list(data) {
        return request({
            url: '/case/financial/list',
            method: 'post',
            data
        })
    },
    exportRole(query) {
        return request({
            url: '/case/financial/export',
            method: 'get',
            params: query
        })
    },
    //审核
    applyModify(data) {
        return request({
            url: '/case/financial/review',
            method: 'post',
            params:data
        })
    },
    //撤销审核
    applyunReview(data) {
        return request({
            url: '/case/financial/unReview',
            method: 'post',
            data
        })
    },
    //还款提交人
    submitter(){
        return request({
            url: '/case/financial/getPostName',
            method: 'get'
        })
    }
}

// 下载用户导入模版
export default financeApi
