<template>
  <div>
    <!-- 组件标题 -->
    <div class="block">{{uploadTitle}}</div>
    <!-- 上传图片控件 -->
    <el-upload
    class="avatar-uploader"
    action="/api/upload"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :headers="headers">
        <img v-if="value" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import {server_URL} from '@/urlConfig.js';

export default {
    props:['uploadTitle','value'],//标题 图片地址
    computed:{
        imageUrl(){
            if(this.value){
                return server_URL + this.value;
            }
        },
        headers(){
            return {
                Authorization:'Bearer '+localStorage.getItem('adminToken')
            }
        }
    },
    methods:{
      // 上传成功调用的函数
        handleAvatarSuccess(resp){
          // 可以拿到upload接口的返回结果
            if(!resp.code && resp.data){
                // 图片上传成功
                // 父组件通过v-model与子组件的value绑定，也就是与form.midImg绑定
                //当触发input事件时，子组件向父组件传递resp.data,也就是修改后的图片地址，
                // 则父组件中v-model绑定的数据（即图片地址）随之发生变化，图片修改成功
                this.$emit('input',resp.data);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.block{
    margin:15px ;
    font-weight: 100;
}
.avatar-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>