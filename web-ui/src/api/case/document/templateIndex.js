import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

const templateApi = {
    //模版列表
    list(query) {
        return request({
            url: '/template/info/list',
            method: 'get',
            params: query
        })
    },
    //详情
    info(id) {
        return request({
            url: '/template/info/' + id,
            method: 'get'
        })
    },
    //详情
    wituoutPermiInfo(id) {
        return request({
            url: '/template/info/wituoutPermi/' + id,
            method: 'get'
        })
    },
    // //文书详情
    // shortMsginfo(id) {
    //     return request({
    //         url: '/shortMsg/wenShuTureContent/' + id,
    //         method: 'get'
    //     })
    // },
    //新增
    add(data) {
        return request({
            url: '/template/info',
            method: 'post',
            params: data
        })
    },
    //修改
    addRecord(data) {
        return request({
            url: '/template/info',
            method: 'put',
            data: data
        })
    },
    //获取签章信息
    signature() {
        return request({
            url: '/template/info/signature/list',
            method: 'get'
        })
    },

    //切换状态
    toggleStatus(id) {
        return request({
            url: '/template/info/switch/' + id,
            method: 'post'
        })
    },
    //查看字段表
    seeFieldTable() {
        return request({
            url: '/template/info/getField',
            method: 'get'
        })
    },
    //没有分页
    templateList(data) {
        return request({
            url: '/template/info/templateList',
            method: 'get',
            params: data
        })
    },
    //案例列表
    caseList(data) {
        return request({
            url: '/case/caseInfo/clericalList',
            method: 'post',
            data
        })
    },
    common(url, data) {
        return request({
            url: url,
            method: 'get',
            timeout: 500000,
            params: data
        })
    },
    // common2(url,data){
    //     return request({
    //         url: url,
    //         method: 'post',
    //         params:data
    //     })
    // },
    common1(url) {
        return request({
            url: url,
            method: 'get',
        })
    },
    //案例详情
    caseInfo(id) {
        return request({
            url: '/case/caseInfo/clerical/' + id,
            method: 'get'
        })
    },
    //文书生成记录
    recordList(query) {
        return request({
            url: '/template/clerical/list',
            method: 'get',
            params: query
        })
    },
    //生成调解文书
    generateBook(query) {
        return request({
            url: '/case/caseInfo/instrument',
            method: 'post',
            data: query
        })
    },
    //查看下载文件列表
    fileList(query) {
        return request({
            url: '/template/info/templateFileList',
            method: 'get',
            params: query
        })
    },
    //组合文件列表
    combinateList(query) {
        return request({
            url: '/template/combinate/list',
            method: 'get',
            params: query
        })
    },
    //组合字段新增
    combinateadd(data) {
        return request({
            url: '/template/combinate',
            method: 'post',
            data: data
        })
    },
    //组合字段修改
    combinateRecord(data) {
        return request({
            url: '/template/combinate',
            method: 'put',
            data: data
        })
    },
    //切换状态
    combinateStatus(data) {
        return request({
            url: '/template/combinate',
            method: 'put',
            data: data
        })
    },
    // 查询组合字段详细
    getField(id) {
        return request({
        url: '/template/combinate/' + id,
        method: 'get'
        })
    },
    // 删除模版
    templatedelete(id) {
        return request({
        url: `/template/info/delete/${id}`,
        method: 'post'
        })
    },
    // 查询证据包
    getEvidenceField() {
        return request({
        url: '/template/info/getEvidenceField',
        method: 'get'
        })
    },
    //批量下载文书
    batchDownloadClerical(data) {
        return request({
            url: '/template/clerical/batchDownloadClerical',
            method: 'post',
            data: data
        })
    },
    //异步列表
    asyncList(data) {
        return request({
            url: '/async/file/list',
            method: 'post',
            data: data
        })
    },
    // 重新执行
    getreExec() {
        return request({
        url: 'async/file/reExec',
        method: 'get'
        })
    },
}

// 下载用户导入模版
export default templateApi
