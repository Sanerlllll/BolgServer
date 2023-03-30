import request from '@/utils/request'
// 获取文章分类
export function getBlogType(){
    return request({
        url:'/api/blogtype',
        method:'get',
    });
}
// 添加文章分类
export function addBlogType(data){
    return request({
        url:'/api/blogtype',
        method:'post',
        data
    });
}
// 删除文章分类
export function delBlogType(id){
    return request({
        url:`/api/blogtype/${id}`,
        method:'delete',
    });
}
// 修改文章分类
export function updateBlogType(editInfo){
    return request({
        url:`/api/blogtype/${editInfo.id}`,
        method:'put',
        data:editInfo.data
    });
}
// 获取一个分类
export function getOneBlogType(id){
    return request({
        url:`/api/blogtype/${id}`,
        method:'get',
    });
}
