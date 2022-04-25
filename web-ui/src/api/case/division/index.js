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
    propertylist(data) {
        return request({
            url: '/case/property/list',
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
            data:data
        })
    },
    divisionAll(data){
        return request({
            url: '/case/assignment/assignmentCaseAll',
            method: 'post',
            timeout:600000,
            data:data
        })
    },
    supervisorAssignment(data){
        return request({
            url: '/case/assignment/supervisorAssignment',
            method: 'post',
            data:data
        })
    },
    supervisorAssignmentAll(data){
        return request({
            url: '/case/assignment/supervisorAssignmentAll',
            method: 'post',
            timeout:600000,
            data:data
        })
    },
    reviewProperty(data){
        return request({
            url: '/case/property/review',
            method: 'post',
            data:data
        })
    },
    //修改
    property(data){
        return request({
            url: '/case/property',
            method: 'put',
            params:data
        })
    }, 
    //号码筛选
    screening(ids,jump,status,radioStatus){
        return request({
            url: `/case/assignment/screening?ids=${ids}&jump=${jump}&status=${status}&type=${radioStatus}`,
            method: 'post',

        })
    },
    //号码筛选
    screeningAll(ids,jump,status,radioStatus){
        return request({
            url: `/case/assignment/screeningAll?ids=${ids}&jump=${jump}&status=${status}&type=${radioStatus}`,
            method: 'post',
            timeout:600000,
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
            data:data
        })
    },
    //公众号绑定
    bindWechat(data){
        return request({
            url: '/admin/wechat/case/bind',
            method: 'post',
            data:data
        })
    },
    //公众号绑定
    bindWechatAll(data){
        return request({
            url: '/admin/wechat/case/bindAll',
            method: 'post',
            timeout:600000,
            data:data
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
}

// 下载用户导入模版
export default divisionApi
