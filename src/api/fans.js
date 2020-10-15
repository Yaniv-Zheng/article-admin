import request from '@/utils/request.js'
export const getFans = params => {
  return request({
    method:'GET',
    url:'/mp/v1_0/followers',
    params
  })
}