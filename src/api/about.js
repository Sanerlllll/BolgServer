import request from '@/utils/request'
//获取关于页面
export function getAbout() {
    return request.get("/api/about");
}

//设置关于页面
export function editAbout(data) {
    return request({
        url: '/api/about',
        method: 'post',
        data
    })
}