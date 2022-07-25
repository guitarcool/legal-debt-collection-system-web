import request from '@/utils/request'
import {
    praseStrEmpty
} from "@/utils/ruoyi";

const importApi = {
    list(query) {
        return request({
            url: '/case/event/list',
            method: 'get',
            params: query
        })
    },
    hasRead(id) {
        return request({
            url: '/case/event/' + id,
            method: 'post'
        })
    },
    // getAccountList(data) {
    //     return request({
    //         url: '/breathe/getAccountList',
    //         method: 'post',
    //         params: data
    //     })
    // },
    //获取token
    initBreathe(accountId) {
        return request({
            url: `/breathe/init?accountId=${accountId}`,
            method: 'post'
        })
    },
    //查询是否为催收员
    isRoleBreathe() {
        return request({
            url: '/breathe/isRole',
            method: 'post'
        })
    },
    //电话日志
    breatheLog(data) {
        return request({
            url: '/breathe/log',
            method: 'post',
            data
        })
    },
}

// 下载用户导入模版
export default importApi
