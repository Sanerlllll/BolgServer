import request from '@/utils/request'
//获取关于页面
export async function getSetting() {
    return await request.get("/api/setting");
  }
  //设置页面
  export function setSetting(data) {
      return request({
          url: '/api/setting',
          method: 'put',
          data
      })
  }
  