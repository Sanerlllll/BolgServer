import request from '@/utils/request';
//分页获取文章
export function getBlogs(page = 1,limit = 10){
    return request({
        url:'/api/blog',
        method:'get',
        params:{
            page,
            limit
        }
    })
}
// 删除文章
export function delBlog(id){
    return request({
        url:`/api/blog/${id}`,//动态参数id
        method:'delete',
    })
}
// 添加文章
export function addBlog(data){
    return request({
        url:'/api/blog',
        method:'post',
        data
    })
}
// 修改文章 调用接口时需传一个对象{id:要修改的文章id，data：修改的内容}
export function editorBlog(blogInfo){
    return request({
        url:`/api/blog/${blogInfo.id}`,
        method:'put',
        data:blogInfo.data
    })
}
// 根据id查找某一篇文章
export function findOneBlog(id){
    return request({
        url:`/api/blog/${id}`,
        method:'get'
    })
}