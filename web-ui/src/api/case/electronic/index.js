import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

const electronicApi = {
    //宜丰签章信息
    electronYF(query) {
        return request({
            url: '/sign/electron/YF',
            method: 'get',
            params: query
        })
    },
    //艾民签章信息
    electronAM(query) {
        return request({
            url: '/sign/electron/AM',
            method: 'get',
            params: query
        })
    },
    //签章信息
    electronSign(signId) {
        return request({
            url: `/sign/electron/${signId}`,
            method: 'get',
        })
    },
    //修改签章审核信息
    editElectron(query) {
        return request({
            url: '/sign/electron',
            method: 'put',
            params: query
        })
    },
    //审核列表信息
    applyList(query) {
        return request({
            url: '/sign/apply/list',
            method: 'get',
            params: query
        })
    },
    //审核
    applyCheck(query) {
        return request({
            url: '/sign/apply/check',
            method: 'post',
            params: query
        })
    },
    //审核
    applyCheckAll(query) {
        return request({
            url: '/sign/apply/checkAll',
            method: 'post',
            timeout:500000,
            params: query
        })
    },
    // //查看案件信息
    // applyCheck(caseId) {
    //     return request({
    //         url: ` /sign/apply/clerical/${caseId}`,
    //         method: 'get',
    //     })
    // },
}

// 电子签章管理
export default electronicApi
