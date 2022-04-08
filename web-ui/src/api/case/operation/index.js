import request from '@/utils/request'

const operationApi = {
    //获取通话记录报表列表
    callRecordlist(data) {
        return request({
            url: '/report/callRecord/list',
            method: 'post',
            data
        })
    },   
    //通话记录列表导出 
    callRecordexport(query) {
        return request({
            url: '/report/callRecord/export',
            method: 'get',
            params: query
        })
    }, 
    //录音下载
    batchDownloadSoundRecord(query) {
        return request({
            url: '/report/callRecord/batchDownloadSoundRecord',
            method: 'get',
            params: query
        })
    },   
    //获取质检记录报表列表
    callQualitylist(data) {
        return request({
            url: '/report/callQuality/list',
            method: 'post',
            data
        })
    }, 
    //质检记录列表导出 
    callQualityexport(query) {
        return request({
            url: '/report/callQuality/export',
            method: 'get',
            params: query
        })
    },  
    //获取号码筛选报表列表
    screenRecordlist(data) {
        return request({
            url: '/report/screenRecord/list',
            method: 'post',
            data
        })
    },
    //号码筛选列表导出 
    screenRecordexport(query) {
        return request({
            url: '/report/screenRecord/export',
            method: 'get',
            params: query
        })
    }, 
    //获取电子签章列表
    signRecordlist(query) {
        return request({
            url: '/report/signRecord/list',
            method: 'get',
            params: query
        })
    },
    //电子签章导出 
    signRecordexport(query) {
        return request({
            url: '/report/signRecord/export',
            method: 'get',
            params: query
        })
    }, 
    //获取短信列表
    shortMsgRecordlist(data) {
        return request({
            url: '/report/shortMsgRecord/list',
            method: 'post',
            data
        })
    },
    //短信导出 
    shortMsgRecordexport(query) {
        return request({
            url: '/report/shortMsgRecord/export',
            method: 'get',
            params: query
        })
    },
    userList(){
        return request({
            url: '/case/assignment/userList',
            method: 'get'
        })
    },     
}

// 下载用户导入模版
export default operationApi
