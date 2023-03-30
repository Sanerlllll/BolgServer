<template>
  <div class="app-container">
    <!-- 标题 -->
    <div class="block">文章标题</div>
    <div style="margin-bottom:15px">
      <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
    </div>
    <!-- 文章编辑 -->
    <div class="block">文章编辑</div>
    <Editor
    ref="toastuiEditor"
    :initialValue="form.editorText"
    height="600px"
    :options="editorOptions"
    ></Editor>
    <!-- 文章描述 -->
    <div class="block">文章描述</div>
    <el-input v-model="form.description" placeholder=" " type="textarea" :rows="6"></el-input>
    <!-- 文章头图 -->
    <Upload uploadTitle="文章头图" v-model="form.thumb"></Upload>
    <!-- 选择分类 -->
    <div class="block">选择分类</div>
    <el-select v-model="form.select" slot="prepend" placeholder="请选择文章分类" @change="changeHandle" >
        <el-option v-for="item in blogType" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <!-- 发布 -->
    <div>
      <el-button type="primary" style="margin-top:15px" @click="addBlogHandle">{{btnContent}}</el-button>
    </div>
  </div>
  
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';//此editor为组件形式
import Upload from '@/components/Upload.vue';
import {getBlogType} from '@/api/blogType';
import {addBlog,editorBlog,findOneBlog} from '@/api/blog';
import "@toast-ui/editor/dist/i18n/zh-cn";
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import uml from '@toast-ui/editor-plugin-uml';
import chart from '@toast-ui/editor-plugin-chart';
export default {
    props:["mode"],
  components:{
    Editor,
    Upload
  },
  data(){
    return {
      form:{
        title:'',//文章标题
        editorText:'',//用户编辑的内容
        description:'',//文章描述
        thumb:'',//文章图片
        select:'',//选择分类
      },
      blogType:[],//存放博客分类的数组
      id:null,//存储传递过来的文章id
      editorOptions:{
        language:'zh-CN',
        plugins: [chart,codeSyntaxHighlight, colorSyntax, tableMergedCell, uml]
      },
      btnContent:'发布文章'
    }
  },
  created(){
    getBlogType().then((resp)=>{
      this.blogType = resp.data;
    });
    if(this.mode === 'edit'){
         // 一进此页面，就拿到传递过来的文章id，根据id获取文章内容，回填到表单
        this.id = this.$route.params.id;
        findOneBlog(this.id).then((resp)=>{
        this.form = resp.data;
        // console.log(resp.data)
        // 因为存在文章未分类情况 因此要处理文章分类
        this.form.select = resp.data.category === null ? '' : resp.data.category.id;
        // 将htmlContent回填到编辑器中
        this.$refs.toastuiEditor.invoke('setHTML',resp.data.htmlContent);
        })
        this.btnContent = '确认修改';
    }
  },
  methods:{
    // 发布文章
    addBlogHandle(){
      // 1.获取整个表单的内容
      let html = this.$refs.toastuiEditor.invoke('getHTML');
      let markdown = this.$refs.toastuiEditor.invoke('getMarkdown');
      // 2.根据发布文章的接口文档要求，组装请求体
      let obj = {
        title:this.form.title,
        description:this.form.description,
        createDate:new Date().getTime(),
        categoryId:this.form.select,
        toc:[],//传递一个空数组，之后在服务器获取
        htmlContent:html,
        thumb:this.form.thumb,
        markdownContent:markdown
      }
      // console.log(obj);
      // 3.将请求对象提交给服务器
      if(obj.title&&obj.description&&obj.htmlContent&&obj.categoryId){
        if(this.mode==='add'){
            // 说明是添加文章
            addBlog(obj).then(()=>{
            this.$router.push('/blogList');//文章添加成功，跳转到文章列表页
             })
        }else{
            // 在文章列表页中编辑修改文章
            editorBlog({
            id:this.form.id,
            data:obj
            }).then(()=>{
                this.$message.success('文章修改成功');
                this.$router.push('/blogList');//文章添加成功，跳转到文章列表页
            })
        }
        
      }else{
        this.$message.error('请填写所有内容')
      }
    },
    // 由于element ui中下拉列表的bug，下拉列表内容修改后需强制更新下拉列表修改后的数据才会显示修改
    // 主要用于文章列表中的编辑
    changeHandle(){
        this.$forceUpdate();//强制更新下拉列表内容
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