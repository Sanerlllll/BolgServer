import request from '@/utils/request'
// 获取留言
export function getMessages(page = 1, limit = 10) {
    return request.get("/api/message", {
        params: {
            page,
            limit,
        },
    });
}
// 删除留言
export function delMessage(id) {
    return request.delete(`/api/message/${id}`);
}