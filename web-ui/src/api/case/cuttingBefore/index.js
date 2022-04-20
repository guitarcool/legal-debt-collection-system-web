import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

const cuttingBeforeApi = {
    //列表
    list(data) {
        return request({
            url: '/case/pretrial/list',
            method: 'post',
            data
        })
    },
    //案件概述详情第一部分
    postAdjudgedInfo(id) {
        return request({
            url: '/case/pretrial/getCaseOverview?caseId='+id,
            method: 'get'
        })
    },
    //案件详情第二部分
    getCaseBaseInfo(data) {
        return request({
            url: `/case/pretrial/getCaseBaseInfo?caseId=${data.caseId}&type=${data.type}`,
            method: 'get'
        })
    },
    //案件详情第三部分
    getMediationObject(data) {
        return request({
            url: `/case/pretrial/getMediationObject?caseId=${data.caseId}`,
            method: 'get'
        })
    },
    //案件详情第四部分
    getCaseRecordInfo(data) {
        return request({
            url: `/case/pretrial/getCaseRecordInfo?caseId=${data.caseId}&type=${data.type}`,
            method: 'get'
        })
    },
    // 批量诉前财保
    caseProperty(ids){
        return request({
            url: '/case/property/'+ids,
            method: 'post',
        })
    },
    // 批量诉前财保
    casePropertyAll(ids){
        return request({
            url: '/case/property/all'+ids,
            timeout:500000,
            method: 'post',
        })
    },
     //诉前财保
     property(data){
        return request({
            url: '/case/property',
            method: 'post',
            params:data
        })
    },
    //裁前详情
    info(id) {
        return request({
            url: '/case/pretrial/'+id,
            method: 'get'
        })
    },
    //新增网调信息
    addNetworkAdjustRecord(data){
        return request({
            url: '/case/pretrial/addNetworkAdjustRecord',
            method: 'post',
            data:data
        })
    },
    //调解记录
    record(id){
        return request({
            url: '/case/pretrial/getMediationRecord/'+id,
            method: 'get'
        })
    },
    //新增调解记录
    addRecord(data){
        return request({
            url: '/case/pretrial/addMediationRecord',
            method: 'post',
            data:data
        })
    },
    //新增联系人信息
    addPhone(data){
        return request({
            url: '/case/pretrial/addRelatedInfo',
            method: 'post',
            data:data
        })
    },

    //通用弹窗接口
    common(url,data){
        return request({
            url: url,
            method: 'post',
            data:data
        })
    },
    //通用弹窗接口2
    commonTwo(url,data){
        return request({
            url: url,
            method: 'post',
            params:data
        })
    },
    //申请案件信修
    applyCaseEdit(data){
        return request({
            url: '/case/pretrial/applyLetterRepair',
            method: 'post',
            params:data
        })
    },
    //申请案件信修
    applyLetterRepairAll(data){
        return request({
            url: '/case/pretrial/applyLetterRepairAll',
            method: 'post',
            timeout:500000,
            params:data
        })
    },
    //获取号码list
    getLineList(){
        return request({
            url: '/breathe/getLineList',
            method: 'post',
        })
    },     
    //获取list
    getListByIds(ids,callObject,filterMedLabel,filterNetworkStatus,filterRealtimeStatus,path){
        return request({
            url: `/breathe/getListByIds?id=${ids}&callObject=${callObject}&filterMedLabel=${filterMedLabel}&filterNetworkStatus=${filterNetworkStatus}&filterRealtimeStatus=${filterRealtimeStatus}&path=${path}`,
            method: 'post',
        })
    },       
    //增加已拨次数
    addPhoneNumber(data){
        return request({
            url: '/case/pretrial/addDialedNumber',
            method: 'post',
            params:data
        })
    },
    //新增计划
    addduyansoft(data){
        return request({
            url: '/breathe/createPersonal',
            method: 'post',
            data:data
        })
    },  
    // 发送短信单条
    shortMsg(data) {
        return request({
        url: '/shortMsg/send',
        method: 'post',
        data: data
        })
    },  
    // 发送短信集合
    sendSmsCollection(data) {
        return request({
        url: '/shortMsg/batchSMS',
        method: 'post',
        data: data
        })
    },    
    // 发送短信集合
    sendSmsCollectionAll(data) {
        return request({
        url: '/case/pretrial/batchSMS',
        method: 'post',
        timeout:500000,
        data: data
        })
    },    
    //获取正确的短信内容
    turnContent(data) {
        return request({
        url:'/shortMsg/turnContent',
        method: 'post',
        data: data
        })
    },
    //裁前调解记录优化
    batchExportMediationRecord(query){
        return request({
            url: '/case/pretrial/batchExportMediationRecord',
            method: 'get',
            params: query
        })
    },
    //裁前调解记录优化
    batchExportMediationRecordAll(query){
        return request({
            url: '/case/pretrial/batchExportMediationRecordAll',
            timeout:500000,
            method: 'get',
            params: query
        })
    },
    //裁前网调记录优化
    batchExportNetworkAdjustRecord(query){
        return request({
            url: '/case/pretrial/batchExportNetworkAdjustRecord',
            method: 'get',
            params: query
        })
    }, 
    //裁前网调记录优化
    batchExportNetworkAdjustRecordAll(query){
        return request({
            url: '/case/pretrial/batchExportNetworkAdjustRecordAll',
            timeout:500000,
            method: 'get',
            params: query
        })
    }, 
    //裁前批量电调失败
    batchMediationFailed(data){
        return request({
            url: '/case/pretrial/batchMediationFailed',
            method: 'post',
            data: data
        })
    }, 
    //裁前批量电调失败
    batchMediationFailedAll(data){
        return request({
            url: '/case/pretrial/batchMediationFailedAll',
            timeout:500000,
            method: 'post',
            data: data
        })
    }, 
    //裁前批量待立案
    batchPending(data){
        return request({
            url: '/case/pretrial/batchPending',
            method: 'post',
            data: data
        })
    }, 
    //裁前批量待立案
    batchPendingAll(data){
        return request({
            url: '/case/pretrial/batchPendingAll',
            timeout:500000,
            method: 'post',
            data: data
        })
    }, 
    //裁前案件编辑获取详情
    getCaseEditData(caseId) {
        return request({
            url: '/case/pretrial/getCaseEditData?caseId='+caseId,
            method: 'get'
        })
    },  
    // 裁前案件编辑发送
    updateCaseEditData(data) {
        return request({
        url: '/case/pretrial/updateCaseEditData',
        method: 'post',
        data: data
        })
    },  
    //下载短信模版
    downloadSmsTemplate(query){
        return request({
            url: `/case/pretrial/notice/batch?ids=${query.ids}&phoneStatus=${query.phoneStatus}&applyTime=${query.applyTime}&templateId=${query.templateId}`,
            method: 'get',
        })
    },        
}

// 下载用户导入模版
export default cuttingBeforeApi
