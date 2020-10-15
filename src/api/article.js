/*
 文章相关请求模块
*/
import request from '@/utils/request.js'
export const getArticles = params => {
  return request({
    method:'GET',
    url:'/mp/v1_0/articles',
    params
  })
}

//频道
export const getChannels = ()=> {
  return request({
    method:'GET',
    url:'/mp/v1_0/channels'
  })
}

//删除文章
export const removeArticle = articleId => {
  return request({
    method:'DELETE',
    url:`/mp/v1_0/articles/${articleId}`
  })
}

//发布新建sw文章
export const getPublish = (data, draft=false)=> {
  return request({
    method:'POST',
    url:'/mp/v1_0/articles',
    params:{
      draft //是否存为草稿
    },
    data
  })
}

//编辑文章
export const editArticle = (articleId,data,draft=false) => {
  return request({
    method:'PUT',
    url:`/mp/v1_0/articles/${articleId}`,
    params:{
      draft 
    },
    data
  })
}

//获取指定文章
export const appointArticle = (articleId) => {
  return request({
    method:'GET',
    url:`/mp/v1_0/articles/${articleId}`
  })
}

//上传文章内图片
export const uploadImage = data => {
  return request({
    method:'POST',
    url:'/mp/v1_0/user/images',
    data
  })
}

//改变评论状态
export const changeCommentStatus = (articleId,status) => {
  return request({
    method:'PUT',
    url:'/mp/v1_0/comments/status',
    params:{
      article_id: articleId
    },
    data:{
      allow_comment: status
    }
  })
}