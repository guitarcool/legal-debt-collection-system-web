import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

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
    common(query){
        return request({
            url: `${query.url}`,
            method: 'get',
            params: query
        })
    },
    info(id) {
        return request({
            url: '/case/caseInfo/'+id,
            method: 'get'
        })
    },
    //下载短信模版
    downloadSmsTemplate(query){
        return request({
            url: `/case/caseInfo/notice/batch?ids=${query.ids}&phoneStatus=${query.phoneStatus}&applyTime=${query.applyTime}&templateId=${query.templateId}`,
            method: 'get',
        })
    },  
    //下载文书短信模版
    wenShuBatchTemplate(query){
        return request({
            url: `/case/caseInfo/notice/wenShuBatch?ids=${query.ids}&phoneStatus=${query.phoneStatus}&applyTime=${query.applyTime}&templateId=${query.templateId}`,
            method: 'get',
        })
    },     
}
// 下载用户导入模版
export default importApi
