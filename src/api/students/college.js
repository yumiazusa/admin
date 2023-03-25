/*
 * @Author: yumiazusa yumiazusa@hotmail.com
 * @Date: 2023-03-21 14:20:13
 * @LastEditors: yumiazusa yumiazusa@hotmail.com
 * @LastEditTime: 2023-03-22 11:29:12
 * @FilePath: /www/miledo/admin/src/api/students/college.js
 * @Description:学院年级班级管理API
 */
import request from '@/utils/request'
// 学院年级班级
export function collegeIndex(data) {
  return request({
    url: '/students/college/index',
    method: 'get',
    params:data
  })
}
// 调整状态
export function collegeStatus(data) {
    return request({
        url: '/students/college/status',
        method: 'put',
        data:data
    })
}
// 添加管理员
export function collegeStore(data) {
  return request({
      url: '/students/college/store',
      method: 'post',
      data:data
  })
}

// 编辑页面数据
export function collegeEdit(data) {
  return request({
      url: '/students/college/edit',
      method: 'get',
      params:data
  })
}
// 编辑提交
export function collegeUpdate(data) {
  return request({
      url: '/students/college/update',
      method: 'put',
      data:data
  })
}
//修改密码
export function collegeChangePwd(data){
  return request({
    url: '/students/college/changePwd',
    method: 'put',
    data:data
})
}

// 初始化密码
export function collegeUpdatePwd(data) {
  return request({
      url: '/students/college/updatePwd',
      method: 'put',
      data:data
  })
}