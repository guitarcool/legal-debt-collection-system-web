import request from '@/utils/request'

const protectApi = {
    propertylist(data) {
        return request({
            url: '/case/property/list',
            method: 'post',
            data
        })
    },
    reviewProperty(data) {
        return request({
            url: '/case/property/review',
            method: 'post',
            data: data
        })
    },
    //修改
    property(data) {
        return request({
            url: '/case/property',
            method: 'put',
            params: data
        })
    },
    //反审
    unReviewProperty(data) {
        return request({
            url: '/case/property/unReview',
            method: 'post',
            data: data
        })
    },
    //修改审核
    updateReviewInfo(data) {
        return request({
            url: '/case/property/updateReviewInfo',
            method: 'post',
            data: data
        })
    },
    //审核获取详情
    propertyInfo(id) {
        return request({
            url: 'case/property/'+id,
            method: 'get',
        })
    },
    //批量解除冻结
    editUnReview(data) {
        return request({
            url: '/case/property/batchUnfreeze',
            method: 'post',
            data: data
        })
    },
    //财保管理-批量审核通过模版下载
    downloadReviewPassTemplate(data) {
        return request({
            url: '/case/property/downloadReviewPassTemplate',
            method: 'post',
            data: data
        })
    },
    //财保管理-批量审核通过
    batchReviewPass(data) {
        return request({
            url: '/case/property/batchReviewPass',
            method: 'post',
            data: data
        })
    },
    //财保管理-批量审核驳回
    batchReviewRefuse(data) {
        return request({
            url: '/case/property/batchReviewRefuse',
            method: 'post',
            data: data
        })
    },
}

// 财保管理接口
export default protectApi
