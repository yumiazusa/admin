/*
 * @Author: yumiazusa yumiazusa@hotmail.com
 * @Date: 2023-03-14 23:51:48
 * @LastEditors: yumiazusa yumiazusa@hotmail.com
 * @LastEditTime: 2023-03-21 14:22:26
 * @FilePath: /www/miledo/admin/src/api/students/students.js
 * @Description: 学生管理API
 */

import request from '@/utils/request'
// 管理员列表
export function studentsIndex(data) {
  return request({
    url: '/students/students/index',
    method: 'get',
    params:data
  })
}
// 调整状态
export function studentsStatus(data) {
    return request({
        url: '/students/students/status',
        method: 'put',
        data:data
    })
}
// 添加管理员
export function studentsStore(data) {
  return request({
      url: '/students/students/store',
      method: 'post',
      data:data
  })
}

// 编辑页面数据
export function studentsEdit(data) {
  return request({
      url: '/students/students/edit',
      method: 'get',
      params:data
  })
}
// 编辑提交
export function studentsUpdate(data) {
  return request({
      url: '/students/students/update',
      method: 'put',
      data:data
  })
}
//修改密码
export function studentsChangePwd(data){
  return request({
    url: '/students/students/changePwd',
    method: 'put',
    data:data
})
}

// 初始化密码
export function studentsUpdatePwd(data) {
  return request({
      url: '/students/students/updatePwd',
      method: 'put',
      data:data
  })
}