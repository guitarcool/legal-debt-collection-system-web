import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

const divisionApi = {
    list(query) {
        return request({
            url: '/case/assignment/list',
            method: 'get',
            params: query
        })
    },
    propertylist(query) {
        return request({
            url: '/case/property/list',
            method: 'get',
            params: query
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
    supervisorAssignment(data){
        return request({
            url: '/case/assignment/supervisorAssignment',
            method: 'post',
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
    //暂停
    suspendCase(ids){
        return request({
            url: `/case/assignment/suspendCase?ids=${ids}`,
            method: 'post',

        })
    },
    //恢复
    recoverCase(ids){
        return request({
            url: `/case/assignment/recoverCase?ids=${ids}`,
            method: 'post',

        })
    },
    //退案
    withdrawalCase(ids){
        return request({
            url: `/case/assignment/withdrawalCase?ids=${ids}`,
            method: 'post',

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
}

// 下载用户导入模版
export default divisionApi
