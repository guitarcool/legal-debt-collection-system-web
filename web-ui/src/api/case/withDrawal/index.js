import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

const withDrawalApi = {
    //列表
    list(query) {
        return request({
            url: '/case/withdrawal/list',
            method: 'get',
            params: query
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
    //调解记录优化
    batchExportMediationRecordAll(query){
        return request({
            url: '/case/withdrawal/batchExportMediationRecordAll',
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
    //网调记录优化
    batchExportNetworkAdjustRecordAll(query){
        return request({
            url: '/case/withdrawal/batchExportNetworkAdjustRecordAll',
            method: 'get',
            params: query
        })
    },            
}

// 下载用户导入模版
export default withDrawalApi
