import request from '@/utils/request'
import {
    praseStrEmpty
} from "@/utils/ruoyi";

const evidenceApi = {
    list(query) {
        return request({
            url: '/evidence/package/list',
            method: 'get',
            params: query
        })
    },
    exportRole(query) {
        return request({
            url: '/evidence/package/export',
            method: 'get',
            params: query
        })
    },
    move(id) {
        return request({
            url: '/evidence/package/' + id,
            method: 'post'
        })
    },
    infoList(data) {
        return request({
            url: '/evidence/package/detail/list',
            method: 'post',
            data
        })
    },
    exportInfo(query) {
        return request({
            url: '/evidence/package/detail/export',
            method: 'get',
            params: query
        })
    },
    downZip(query) {
        return request({
            url: '/evidence/package/download',
            method: 'get',
            params: query
        })
    },
    delData(id) {
        return request({
            url: '/evidence/package/' + id,
            method: 'delete'
        })
    },
    delDataAll() {
        return request({
            url: '/evidence/package/removeAll',
            timeout: 600000,
            method: 'delete'
        })
    },
    deleteEvidenceMaterial(data) {
        return request({
            url: '/evidence/package/deleteEvidenceMaterial',
            method: 'post',
            data
        })
    },
    getEvidenceMaterialDetail(query) {
        return request({
            url: '/evidence/package/getEvidenceMaterialDetail',
            method: 'get',
            params: query
        })
    },
}

// 下载用户导入模版
export default evidenceApi
