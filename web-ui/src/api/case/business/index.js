import request from '@/utils/request'
import {
    praseStrEmpty
} from "@/utils/ruoyi";

const businessApi = {
    //获取list
    getPersonal(query) {
        return request({
            url: '/count/personal',
            method: 'get',
            params: query
        })
    },
    //获取excellist
    getExcelList(query) {
        return request({
            url: '/count/excel/list',
            method: 'get',
            params: query
        })
    },
    getTeam(query) {
        return request({
            url: '/count/team',
            method: 'get',
            params: query
        })
    },
    //查询当前用户所在的所有部门
    userDepts(query) {
        return request({
            url: '/system/dept/userDepts',
            method: 'get',
            params: query
        })
    },
    //查询当前用户
    listByDept(deptId) {
        return request({
            url: `/system/user/listByDept/${deptId}`,
            method: 'get',
        })
    },
    //查询产品批次号
    batchNoList(deptId) {
        return request({
            url: `/count/target/product/batchNoList/${deptId}`,
            method: 'get',
        })
    },
    //查询成员回款
    teamUserList(data) {
        return request({
            url: '/count/target/teamUser/list',
            method: 'post',
            data
        })
    },
    //查询成员详情 
    productDetail(query) {
        return request({
            url: '/count/target/teamUser/detail',
            method: 'get',
            params: query
        })
    },
    //查询产品回款
    productList(data) {
        return request({
            url: '/count/target/product/list',
            method: 'post',
            data
        })
    },
    //查询产品详情 
    targetDetail(query) {
        return request({
            url: '/count/target/product/detail',
            method: 'get',
            params: query
        })
    },
    //成员回款目标新增
    teamUserAddOrUpdate(data) {
        return request({
            url: '/count/target/teamUser/addOrUpdate',
            method: 'post',
            data
        })
    },
    //产品回款目标新增
    productAddOrUpdate(data) {
        return request({
            url: '/count/target/product/addOrUpdate',
            method: 'post',
            data
        })
    },
}


export default businessApi
