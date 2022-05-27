import request from '@/utils/request'
import {
    praseStrEmpty
} from "@/utils/ruoyi";

const shortLinkApi = {
    //列表
    list(data) {
        return request({
            url: '/shortLinkVisitLog/list',
            method: 'post',
            data
        })
    },
    //下载
    shortLinkExport(data) {
        return request({
            url: '/shortLinkVisitLog/export',
            method: 'post',
            data
        })
    },
    //ip文件列表
    employList(data) {
        return request({
            url: '/employeeIpBind/list',
            method: 'post',
            data
        })
    },
    //ip文件列表新增
    combinateAdd(data) {
        return request({
            url: '/employeeIpBind/bind',
            method: 'post',
            data
        })
    },
    //ip文件列表修改
    combinateEdit(data) {
        return request({
            url: '/employeeIpBind/edit',
            method: 'post',
            data
        })
    },
    //ip文件列表删除
    combinateStatus(id) {
        return request({
            url: '/employeeIpBind/del/' + id,
            method: 'post',
        })
    },
}

// 下载用户导入模版
export default shortLinkApi
