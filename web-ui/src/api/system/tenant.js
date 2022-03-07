import request from '@/utils/request'

// 查询角色列表
export function listTenant(query) {
  return request({
    url: '/system/tenantManage/page',
    method: 'get',
    params: query
  })
}

// 查询角色列表
export function infoTenant(tenantId) {
  return request({
    url: '/system/tenantManage/getInfo/' + tenantId,
    method: 'get',
  })
}

// 新增角色
export function addTenant(data) {
  return request({
    url: '/system/tenantManage/save',
    method: 'post',
    params: data
  })
}

// 修改角色
export function updateTenant(data) {
  return request({
    url: '/system/tenantManage/save',
    method: 'post',
    params: data
  })
}

// 删除角色
export function delTenant(tenantId) {
  return request({
    url: '/system/tenantManage/delete/' + tenantId,
    method: 'post'
  })
}
