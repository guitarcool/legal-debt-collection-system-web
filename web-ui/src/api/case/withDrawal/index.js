import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

const withDrawalApi = {
    //列表
    list(data) {
        return request({
            url: '/case/withdrawal/list',
            method: 'post',
            data
        })
    },
    //调解记录优化
    batchExportMediationRecord(query){
        return request({
            url: '/case/withdrawal/batchExportMediationRecord',
            method: 'get',
            params: query
        })
    },
    //网调记录优化
    batchExportNetworkAdjustRecord(query){
        return request({
            url: '/case/withdrawal/batchExportNetworkAdjustRecord',
            method: 'get',
            params: query
        })
    },             
}

// 下载用户导入模版
export default withDrawalApi
