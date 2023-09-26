// 评论接口
import request from '@/utils/request'
// 添加评论 :在前台页面新增
// export function addComment(data){
//     return request({
//         url:'/api/comment',
//         method:'post',
//         data
//     });
// }
// 删除评论
export function delComment(id){
    return request.delete(`/api/comment/${id}`); 
}
// 分页获取评论
export function getComment(page=1,limit=10){
    return request({
        url:'/api/comment',
        method:'get',
        params:{
            page,
            limit,
            blogid: 'all'
        }
    });
}
