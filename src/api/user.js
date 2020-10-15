/*
 用户相关请求模块
*/
import request from '@/utils/request.js'
export const login_res = data => {
  return request({
    method:'POST',
    url:'/mp/v1_0/authorizations',
    data
  })
}

export const getUsers = () => {
  return request({
    method:'GET',
    url:'/mp/v1_0/user/profile'
  })
}

//编辑头像
export const changePhoto = data => {
  return request({
    method:'PATCH',
    url:'/mp/v1_0/user/photo',
    data
  })
}

//修改用户基本信息
export const changeUsers = data => {
  return request({
    method:'PATCH',
    url:'/mp/v1_0/user/profile',
    data
  })
}