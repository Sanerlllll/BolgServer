<template>
  <div class="app-container">
     <!-- 标题 -->
    <div class="block">项目名称</div>
    <div style="margin-bottom:15px">
      <el-input v-model="form.name" placeholder="请输入项目名称"></el-input>
    </div>
    <!-- 描述 -->
    <div class="block">项目描述（每一次描述以逗号隔开）</div>
    <el-input v-model="form.description" placeholder="请输入项目描述" ></el-input>
    <!-- 链接 -->
    <div class="block">项目链接</div>
    <el-input v-model="form.url" placeholder="请输入项目链接" ></el-input>
    <!-- github地址 -->
    <div class="block">github地址</div>
    <el-input v-model="form.github" placeholder="请输入github地址" ></el-input>
    <!-- 预览图 -->
    <Upload uploadTitle="项目预览图地址" v-model="form.thumb"></Upload>
    <!-- 项目等级 -->
    <div class="block">项目等级</div>
      <el-select v-model="form.order" placeholder="请选择等级">
        <el-option  label="1" value="1"></el-option>
        <el-option  label="2" value="2"></el-option>
        <el-option  label="3" value="3"></el-option>
        <el-option  label="4" value="4"></el-option>
        <el-option  label="5" value="5"></el-option>
      </el-select>
    <!-- 发布 -->
    <div>
      <el-button type="primary" style="margin-top:15px" @click="addProHandle">发布此项目</el-button>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload';
import { addProject } from '@/api/project';
export default {
  components:{
    Upload
  },
  data(){
    return {
      form:{
        name:'',
        description:'',
        url:'',
        thumb:'',
        github:'',
        order:1,
      }
    }
  },
  methods:{
    addProHandle(){
      // 1.根据发布文章的接口文档要求，组装请求体
      let obj = {
        name:this.form.name,
        description:this.form.description.split(','),//将description用逗号分隔
        thumb:this.form.thumb,
        url:this.form.url,
        github:this.form.github,
        order:parseInt(this.form.order)
      };
      // 等同于 let obj = {...this.form} ; obj.description = obj.description.split(',')
      // console.log(this.form);
      // 2.调用接口发送请求
          addProject(obj).then(()=>{
                this.$message.success('项目添加成功');
                this.$router.push('/projectsList');//文章添加成功，跳转到文章列表页
            })
    }
  }
}
</script>

<style lang="scss" scoped>
.block{
  margin:15px;
  font-weight: 100;
}
</style>