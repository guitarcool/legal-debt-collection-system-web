import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

const cuttingAfterApi = {
    //列表
    list(data) {
        return request({
            url: '/case/postAdjudged/list',
            method: 'post',
            data
        })
    },
    //history列表
    historical(data) {
        return request({
            url: '/case/historical/list',
            method: 'post',
            data
        })
    },
    //裁后案件概述详情第一部分
    postAdjudgedInfo(id) {
        return request({
            url: '/case/postAdjudged/getCaseOverview?caseId='+id,
            method: 'get'
        })
    },
    //裁后案件详情第二部分
    getCaseBaseInfo(data) {
        return request({
            url: `/case/postAdjudged/getCaseBaseInfo?caseId=${data.caseId}&type=${data.type}`,
            method: 'get'
        })
    },
    //案件详情第三部分
    getMediationObject(data) {
        return request({
            url: `/case/postAdjudged/getMediationObject?caseId=${data.caseId}`,
            method: 'get'
        })
    },
    //裁后案件详情第四部分
    getCaseRecordInfo(data) {
        return request({
            url: `/case/postAdjudged/getCaseRecordInfo?caseId=${data.caseId}&type=${data.type}`,
            method: 'get'
        })
    },
    //一键外呼详情
    breatheInfo(id) {
        return request({
            url: '/breathe/getCallInfo/'+id,
            method: 'get'
        })
    },    
    //调解记录
    record(id){
        return request({
            url: '/case/postAdjudged/getMediationRecord/'+id,
            method: 'get'
        })
    },
    //切换有效性
    toggole(data){
        return request({
            url: '/case/postAdjudged/switchValidity',
            method: 'post',
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
    //新增调解记录
    addRecord(data){
        return request({
            url: '/case/postAdjudged/addMediationRecord',
            method: 'post',
            data:data
        })
    },
    //获取list
    getListByIds(ids,callObject,filterMedLabel,filterNetworkStatus,filterRealtimeStatus,path){
        return request({
            url: `/breathe/getListByIds?id=${ids}&callObject=${callObject}&filterMedLabel=${filterMedLabel}&filterNetworkStatus=${filterNetworkStatus}&filterRealtimeStatus=${filterRealtimeStatus}&path=${path}`,
            method: 'post',
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
    //新增联系人信息
    addPhone(data){
        return request({
            url: '/case/postAdjudged/addRelatedInfo',
            method: 'post',
            data:data
        })
    },
    //新增网调信息
    addNetworkAdjustRecord(data){
        return request({
            url: '/case/postAdjudged/addNetworkAdjustRecord',
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
    //申请案件信修
    applyCaseEdit(data){
        return request({
            url: '/case/postAdjudged/applyLetterRepair',
            method: 'post',
            params:data
        })
    },
    //申请案件信修
    applyLetterRepairAll(data){
        return request({
            url: '/case/postAdjudged/applyLetterRepairAll',
            timeout:500000,
            method: 'post',
            params:data
        })
    },
    //增加已拨次数
    addPhoneNumber(data){
        return request({
            url: '/case/postAdjudged/addDialedNumber',
            method: 'post',
            params:data
        })
    },
    //下载模版
    importFiledCaseTemplate(data) {
        return request({
            url: '/case/postAdjudged/importFiledCaseTemplate',
            method: 'post',
            data
        })
    }, 
    //下载模版
    importJudgedTemplate(data) {
        return request({
            url: '/case/postAdjudged/importJudgedTemplate',
            method: 'post',
            data
        })
    },   
    // 批量待执行立案
    pendingExecute(ids){
        return request({
            url: '/case/postAdjudged/pendingExecute/'+ids,
            method: 'post',
        })
    },  
    // 批量待执行立案
    pendingExecuteAll(data){
        return request({
            url: '/case/postAdjudged/pendingExecuteAll',
            timeout:500000,
            method: 'post',
            data
        })
    },  
    //下载模版
    importExecutedTemplate(data) {
        return request({
            url: '/case/postAdjudged/importExecutedTemplate',
            method: 'post',
            data
        })
    }, 
    //下载模版
    importEnforcedTemplate(data) {
        return request({
            url: '/case/postAdjudged/importEnforcedTemplate',
            method: 'post',
            data
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
        url: '/case/postAdjudged/batchSMS',
        method: 'post',
        timeout:500000,
        data: data
        })
    }, 
    // 发送短信集合
    batchSMSAll(data) {
        return request({
        url: '/shortMsg/clerical/batchSMSAll',
        method: 'post',
        timeout:500000,
        data: data
        })
    }, 
    // 发送文书短信集合
    batchClericalSMSAll(data) {
        return request({
        url: '/shortMsg/batchClericalSMSAll',
        method: 'post',
        timeout:500000,
        data: data
        })
    },  
    // 发送文书短信集合
    sendSmsWenshu(data) {
        return request({
        url: '/shortMsg/batchClericalSMS',
        method: 'post',
        data: data
        })
    },  
    // 重发短信集合
    sendSmsBatchResend(data) {
        return request({
        url: '/shortMsg/batchResend',
        method: 'post',
        data: data
        })
    },    
    // 重发短信集合
    batchResendAll(data) {
        return request({
        url: '/shortMsg/batchResendAll',
        method: 'post',
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
    //裁后调解记录优化
    postAdjudgedBatchExport(query){
        return request({
            url: '/case/postAdjudged/batchExportMediationRecord',
            method: 'get',
            params: query
        })
    },
    //裁后调解记录优化
    batchExportMediationRecordAll(query){
        return request({
            url: '/case/postAdjudged/batchExportMediationRecordAll',
            method: 'get',
            timeout:500000,
            params: query
        })
    },
    //分案调解记录优化
    assignmentMediationRecordAll(query){
        return request({
            url: '/case/assignment/batchExportMediationRecordAll',
            method: 'get',
            timeout:500000,
            params: query
        })
    },
    //裁后网调记录记录优化
    batchExportNetworkAdjustRecord(query){
        return request({
            url: '/case/postAdjudged/batchExportNetworkAdjustRecord',
            method: 'get',
            params: query
        })
    },   
    //裁后网调记录记录优化
    batchExportNetworkAdjustRecordAll(query){
        return request({
            url: '/case/postAdjudged/batchExportNetworkAdjustRecordAll',
            method: 'get',
            timeout:500000,
            params: query
        })
    },  
    //分案网调记录记录优化
    assignmentNetworkAdjustRecordAll(query){
        return request({
            url: '/case/assignment/batchExportNetworkAdjustRecordAll',
            method: 'get',
            timeout:500000,
            params: query
        })
    },  
    //裁后案件编辑获取详情
    getCaseEditData(caseId) {
        return request({
            url: '/case/postAdjudged/getCaseEditData?caseId='+caseId,
            method: 'get'
        })
    },  
    // 裁后案件编辑发送
    updateCaseEditData(data) {
        return request({
        url: '/case/postAdjudged/updateCaseEditData',
        method: 'post',
        data: data
        })
    },         
}

// 下载用户导入模版
export default cuttingAfterApi
