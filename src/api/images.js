/*
  图片相关
*/
import request from '@/utils/request.js'

export const getImage = params => {
  return request({
    method:'GET',
    url:'/mp/v1_0/user/images',
    params
  })
}

//收藏图片
export const collectImg = (imgId,collect) => {
  return request({
    method:'PUT',
    url:`/mp/v1_0/user/images/${imgId}`,
    data:{
      collect
    }
  })
}

//删除图片
export const deleteImg = imgId => {
  return request({
    method:'DELETE',
    url:`/mp/v1_0/user/images/${imgId}`
  })
}

//编辑头像
export const changeImg = data => {
  return request({
    method:'PATCH',
    url:'/mp/v1_0/user/photo',
    data
  })
}