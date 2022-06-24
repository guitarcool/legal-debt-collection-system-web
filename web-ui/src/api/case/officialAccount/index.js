import request from '@/utils/request'

const officialApi = {
    //获取通话记录报表列表
    wechatList(data) {
        return request({
            url: '/admin/wechat/history/query',
            method: 'post',
            data
        })
    },
    //获取还款查询列表
    repayList(data) {
        return request({
            url: '/admin/wechat/repay/list',
            method: 'post',
            data
        })
    },
    //审核
    repayAudit(data) {
        return request({
            url: '/admin/wechat/repay/audit',
            method: 'post',
            data
        })
    },
    //详情
    repayDetail(id) {
        return request({
            url: '/admin/wechat/repay/detail?id=' + id,
            method: 'get',
        })
    },
    //详情列表
    wechatCaseList(idCard) {
        return request({
            url: '/admin/wechat/case/list?idCard=' + idCard,
            method: 'get',
        })
    },
}

// 下载用户导入模版
export default officialApi
