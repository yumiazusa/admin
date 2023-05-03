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
// 添加学院年级系部层次
export function collegeStore(data) {
  return request({
      url: '/students/college/store',
      method: 'post',
      data:data
  })
}
// 获取学院年级系部层次选择列
export function getAttrList() {
  return request({
    url: '/students/college/attr',
    method: 'get'
  })
}
// 添加班级
export function classStore(data) {
  return request({
      url: '/students/college/classStore',
      method: 'post',
      data:data
  })
}
// 编辑班级信息
export function classEdit(id,type) {
  return request({
      url: '/students/college/edit',
      method: 'get',
      params:{'id':id,'type':type}
  })
}
// 编辑学院年级系部层次班级
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