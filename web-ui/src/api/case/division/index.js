import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

const divisionApi = {
    list(data) {
        return request({
            url: '/case/assignment/list',
            method: 'post',
            data
        })
    },
    export(query) {
        return request({
            url: '/case/assignment/export',
            method: 'get',
            params: query
        })
    },
    info(id) {
        return request({
            url: '/case/assignment/'+id,
            method: 'get'
        })
    },
    record(id){
        return request({
            url: '/case/assignment/getMediationRecord/'+id,
            method: 'get'
        })
    },
    userList(){
        return request({
            url: '/case/assignment/userList',
            method: 'get'
        })
    },
    //监督员接口
    supervisorList(){
        return request({
            url: '/case/assignment/supervisorList',
            method: 'get'
        })
    },
    division(data){
        return request({
            url: '/case/assignment/assignmentCase',
            method: 'post',
            data
        })
    },
    divisionAll(data){
        return request({
            url: '/case/assignment/assignmentCaseAll',
            method: 'post',
            timeout:600000,
            data
        })
    },
    supervisorAssignment(data){
        return request({
            url: '/case/assignment/supervisorAssignment',
            method: 'post',
            data
        })
    },
    supervisorAssignmentAll(data){
        return request({
            url: '/case/assignment/supervisorAssignmentAll',
            method: 'post',
            timeout:600000,
            data
        })
    },
    //号码筛选
    screening(data){
        return request({
            url: '/case/assignment/screening',
            method: 'post',
            data
        })
    },
    //号码筛选
    screeningAll(data){
        return request({
            url: '/case/assignment/screeningAll',
            method: 'post',
            timeout:600000,
            data
        })
    },
    //暂停
    suspendCase(ids){
        return request({
            url: `/case/assignment/suspendCase?ids=${ids}`,
            method: 'post',

        })
    },
    //暂停
    suspendCaseAll(){
        return request({
            url: '/case/assignment/suspendCaseAll',
            method: 'get',
            timeout:600000,
        })
    },
    //恢复
    recoverCase(ids){
        return request({
            url: `/case/assignment/recoverCase?ids=${ids}`,
            method: 'post',

        })
    },
    //恢复
    recoverCaseAll(){
        return request({
            url: '/case/assignment/recoverCaseAll',
            method: 'get',
            timeout:600000,
        })
    },
    //退案
    withdrawalCase(ids){
        return request({
            url: `/case/assignment/withdrawalCase?ids=${ids}`,
            method: 'post',
        })
    },
    //退案
    withdrawalCaseAll(){
        return request({
            url: '/case/assignment/withdrawalCaseAll',
            method: 'get',
            timeout:600000,
        })
    },
    //公众号列表查询
    wechatList(data){
        return request({
            url: '/admin/wechat/list',
            method: 'post',
            data
        })
    },
    //公众号绑定
    bindWechat(data){
        return request({
            url: '/admin/wechat/case/bind',
            method: 'post',
            data
        })
    },
    //公众号绑定
    bindWechatAll(data){
        return request({
            url: '/admin/wechat/case/bindAll',
            method: 'post',
            timeout:600000,
            data
        })
    },
    //级联选择接口
    getCascaderData(query) {
        return request({
            url: '/case/cascader/getCascaderData',
            method: 'get',
            params: query
        })
    },
    //批量生成调解文书
    instrumentlist(data) {
        return request({
            url: '/case/caseInfo/instrument/batch',
            method: 'post',
            data
        })
    },
    //全选生成调解文书
    instrumentlistAll(data) {
        return request({
            url: '/case/caseInfo/instrument/batchAll',
            method: 'post',
            data
        })
    },
    //根据部门id获取对应的调解员
    getMediatorList(id) {
        return request({
            url: '/case/assignment/getMediatorList?deptId='+id,
            method: 'get'
        })
    },
    //分案筛选-分案预览
    getAssignCaseInfo(data) {
        return request({
            url: '/case/assignment/getAssignCaseInfo',
            method: 'post',
            data
        })
    },
    //分案筛选-分案预览
    getAssignCaseInfoAll(data) {
        return request({
            url: '/case/assignment/getAssignCaseInfoAll',
            method: 'post',
            data
        })
    },
}

// 下载用户导入模版
export default divisionApi
