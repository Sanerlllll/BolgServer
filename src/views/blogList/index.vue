<template>
  <div class="app-container">
    <!-- 表格数据 -->
    <el-table :data="data" stripe style="width: 100%" border>
      <el-table-column prop="date.id" label="序号" width="50" align="center">
        <template slot-scope="scope">{{scope.$index + (currentPage - 1)* eachPage +1}}</template>
      </el-table-column>
      <el-table-column prop="data.title" label="文章名称" width="180" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="博客预览图"
            width="230"
            trigger="hover"
            >
            <el-image
             style="width:200px;"
             :src="scope.row.thumb"
             fit="contain"
             :preview-src-list="srcList">
            </el-image>
            <a href="#" target="_blank" @click.prevent="goTOTitleHandle(scope.row)" slot="reference">{{scope.row.title}}</a>
          </el-popover>
          
        </template>
      </el-table-column>
      <el-table-column prop="data.description" label="文章描述" align="center">
        <template slot-scope="scope">{{scope.row.description}}</template>
      </el-table-column>
      <el-table-column prop="data.scanNumber" label="浏览数" align="center">
        <template slot-scope="scope">{{scope.row.scanNumber}}</template>
      </el-table-column>
      <el-table-column prop="data.commentNumber" label="评论量" align="center">
        <template slot-scope="scope">{{scope.row.commentNumber}}</template>
      </el-table-column>
      <el-table-column prop="data.category" label="所属分类" align="center">
        <template slot-scope="scope">{{
        scope.row.category.name === null ? "未分类": scope.row.category.name  
        }}</template>
      </el-table-column>
      <el-table-column prop="data.createDate" label="创建日期" width="230" align="center">
        <template slot-scope="scope">{{scope.row.createDate}}</template>
      </el-table-column>
      <el-table-column  label="操作"  align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="3000">
            <el-button type="warning" icon="el-icon-edit" circle size="mini" @click="editBlogHandle(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="3000">
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteBlog(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

  <!-- 分页 -->
    <el-pagination style="margin-top:30px" background 
    layout="prev, pager, next,total,->,sizes,jumper" 
    :page-size="eachPage"
    :page-sizes="[5,10,15,20]"
    :current-page.sync="pagerCurrentPage"
    :total="count"
    @size-change="sizeChangeHandler"
    @current-change="currentChangeHandler"
    @pre-click="preClickHandler"
    @next-click="nextClickHandler"
    ></el-pagination>
  </div>
</template>

<script>
import {getBlogs,delBlog} from '@/api/blog';
import {formatDate} from '@/utils/tools';
import { server_URL,frontEnd_URL} from '@/urlConfig';
export default {
  data(){
    return {
      data:[],//存储远程请求返回的数据
      srcList:[],//预览图
      eachPage:5,//每页显示条数
      currentPage:1,//当前页码，默认为1
      totalPage:0,//总页数
      count:0,//数据总条数
      pagerCurrentPage:1,//分页栏的当前页码
    }
  },
  created(){
    this.fetchData();
  },
  methods:{
    fetchData(){
      getBlogs(this.currentPage,this.eachPage).then((resp) => {
        this.data = resp.data.rows;
        
        // console.log(resp);
        for(var i of this.data){  
        i.createDate = formatDate(i.createDate);//格式化日期
        i.thumb =  server_URL + i.thumb;//格式化图片地址
        this.srcList.push(i.thumb);
        }
        this.count = resp.data.total;
        this.totalPage =Math.ceil(this.count / this.eachPage); //向上取整
        // console.log(this.totalPage)
        // 删除数据后可能存在当前页数大于总页数的情况
        if(this.currentPage > this.totalPage){
          this.currentPage = this.totalPage;
          this.fetchData();
        }

      })
    },
    // 跳转到具体的文章
    goTOTitleHandle(blogInfo){
      // console.log(blogInfo);//相当于scope
      window.open(`${frontEnd_URL}/blog/${blogInfo.id}`);
    },
    // 编辑文章
    editBlogHandle(blogInfo){
      this.$router.push(`/editorBlog/${blogInfo.id}`)
    },
    // 删除数据
    deleteBlog(blogInfo){
      this.$confirm('此操作将永久删除该文章及其评论, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delBlog(blogInfo.id).then(() => {
            this.fetchData();//删除一条数据后要重新获取数据
            this.$message({
            type: 'success',
            message: '删除成功!'
            });
            // console.log(this.totalPage)
          }); 
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
    },
    // 分页相关操作
    // 每页条数改变时触发
    sizeChangeHandler(pageNumber){
      this.eachPage = pageNumber;
      this.pagerCurrentPage=1;
      this.currentPage = 1;
      this.fetchData();

    },
    // 当前页码改变时触发
    currentChangeHandler(newPage){
      this.currentPage = newPage;
      this.fetchData();
    },
    //上一页
    preClickHandler(){
      this.currentPage--;
    },
    // 下一页
    nextClickHandler(){
      this.currentPage++;

    }
  }

}
</script>

<style>

</style>