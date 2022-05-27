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
}

// 下载用户导入模版
export default officialApi
