<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入要添加的分类" v-model="input" class="input-with-select blogAddInput">
      <el-select v-model="select" slot="prepend" placeholder="请选择" >
        <el-option label="1" value="1"></el-option>
        <el-option label="2" value="2"></el-option>
        <el-option label="3" value="3"></el-option>
        <el-option label="4" value="4"></el-option>
        <el-option label="5" value="5"></el-option>
      </el-select>
      </el-input>
      <el-button type="primary" style="margin-left:20px" @click="addBlogTypeHandle">添加</el-button>
    </div>
    <!-- 表格数据 -->
    <el-table :data="data" stripe style="width: 100%" border>
      <el-table-column prop="date.id" label="序号"  width="80" align="center">
        <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>
      <el-table-column prop="date.name" label="博客实例"  align="center">
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column prop="date.articleCount" label="文章数量"  align="center">
        <template slot-scope="scope">{{scope.row.articleCount}}</template>
      </el-table-column>
      <el-table-column  label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="3000">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="editBlogTypeHandle(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="3000">
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteBlogType(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>  
    <!-- 弹框 -->
    <el-dialog title="编辑文章分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序等级" >
          <el-select v-model="form.order" placeholder="分类等级">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="3"></el-option>
            <el-option label="5" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditBlogHandle">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getBlogType,addBlogType,delBlogType,updateBlogType,getOneBlogType} from '@/api/blogType'
export default {
  data(){
    return {
      data:[],
      input:"",
      select:"1",//文章类别等级
      dialogFormVisible:false,
      form:{
        name:'',
        order:''
      }
    }
  },
  created(){
    this.fetchData();
  },
  methods:{
    fetchData(){
      // 解构data
      getBlogType().then(({data})=>{
        this.data = data;
      });
    },
    // 添加文章类别
    addBlogTypeHandle(){
      if(this.input){
        //输入框有值 则调用添加类别的接口
        addBlogType({name:this.input,order:this.select}).then(()=>{
          // 重新请求数据
          this.fetchData();
          this.$message.success('添加成功');
        })
      }else{
        this.$message.error('分类名称不能为空！')
      }
    },
    // 编辑文章分类
    editBlogTypeHandle(blogTypeInfo){
      // 调用接口将数据会填到表单
      getOneBlogType(blogTypeInfo.id).then((resp)=>{
        this.form = resp.data;
        this.dialogFormVisible = true;
      })
    },
    // 确认编辑文章分类
    confirmEditBlogHandle(){
      updateBlogType({
        id:this.form.id,
        data:this.form
      }).then(()=>{
        this.fetchData();
        this.$message.success('更新分类信息成功');
        this.dialogFormVisible = false;
      })
    },
    // 删除文章分类
    deleteBlogType({id}){
      this.$confirm('此操作将永久删除该文章分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delBlogType(id).then(() => {
            this.fetchData();//删除一条数据后要重新获取数据
            this.$message({
            type: 'success',
            message: '删除成功!'
            });
          }); 
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.blogAddInput{
  width: 400px;
  margin-bottom: 20px;
}
</style>