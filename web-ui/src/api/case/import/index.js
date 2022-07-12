import request from '@/utils/request'
import {
    praseStrEmpty
} from "@/utils/ruoyi";

const importApi = {
    //下载模版
    importTemplate() {
        return request({
            url: '/case/caseInfo/importTemplate',
            method: 'get'
        })
    },
    //证据包下载模版
    evidenceTemplate() {
        return request({
            url: '/evidence/package/importTemplate',
            method: 'get'
        })
    },
    list(data) {
        return request({
            url: '/case/caseInfo/list',
            method: 'post',
            data
        })
    },
    exportRole(query) {
        return request({
            url: '/case/caseInfo/export',
            method: 'get',
            params: query
        })
    },
    //通用弹窗接口
    common(query) {
        return request({
            url: `${query.url}`,
            method: 'get',
            timeout: 500000,
            params: query
        })
    },
    info(id) {
        return request({
            url: '/case/caseInfo/' + id,
            method: 'get'
        })
    },
    //下载短信模版
    downloadSmsTemplate(data) {
        return request({
            url: '/shortMsg/batchGenerateNotice',
            method: 'post',
            data
        })
    },
    //下载短信模版
    downloadcaseInfoTemplate(data) {
        return request({
            url: '/case/caseInfo/clerical/notice/batch',
            method: 'post',
            data
        })
    },
    //下载文书短信模版
    wenShuBatchTemplate(data) {
        return request({
            url: '/shortMsg/batchGenerateClericalNotice',
            method: 'post',
            data
        })
    },
    //下载文书短信模版
    wenShucaseInfoBatchTemplate(data) {
        return request({
            url: '/case/caseInfo/wenshu/notice/wenShuBatch',
            method: 'post',
            data
        })
    },
}
// 下载用户导入模版
export default importApi
