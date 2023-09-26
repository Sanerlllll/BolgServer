<template>
  <div class="app-container">
    <!-- 表格数据 -->
    <el-table :data="data" stripe style="width: 100%" border v-loading="listLoading" 
    element-loading-text="加载数据中"
    highlight-current-row>
      <el-table-column  label="序号" width="50" align="center">
        <template slot-scope="scope">{{scope.$index + (currentPage - 1)* eachPage +1}}</template>
      </el-table-column>
      <el-table-column  label="头像" align="center">
        <template slot-scope="scope">
          <el-image
            style="width:30px;"
            :src="scope.row.avatar"
            fit="contain"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column  label="昵称" align="center">
        <template slot-scope="scope">{{scope.row.nickname}}</template>
      </el-table-column>
      <el-table-column  label="内容" align="center">
        <template slot-scope="scope">{{scope.row.content}}</template>
      </el-table-column>
      <el-table-column  label="创建日期" width="230" align="center">
        <template slot-scope="scope">{{scope.row.createDate}}</template>
      </el-table-column>
      <el-table-column  label="操作"  align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="3000">
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteMessage(scope.row)"></el-button>
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
import { getMessages,delMessage } from '@/api/message';
import { server_URL} from '@/urlConfig';
import {formatDate} from '@/utils/tools';

export default {
  data(){
    return {
      data:[],//评论数据
      eachPage:5,//每页显示条数
      currentPage:1,//当前页码，默认为1
      totalPage:0,//总页数
      count:0,//数据总条数
      listLoading:false,//是否正在加载中
      pagerCurrentPage:1,//分页栏的当前页码，主要用于每条显示条数的改变
    }
  },
  created(){
    this.fetchData();
  },
  methods:{
    fetchData(){
        this.listLoading = true;
        getMessages(this.currentPage,this.eachPage).then((resp)=>{
        this.listLoading = false;
        this.data = resp.data.rows;
        // console.log(this.data);
        for(var i of this.data){  
        i.createDate = formatDate(i.createDate);//格式化日期
        i.avatar =  server_URL + i.avatar;//格式化图片地址
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
     // 删除数据
    deleteMessage({id}){
      this.$confirm('此操作将永久删除该留言, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delMessage(id).then(() => {
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
      this.currentPage = 1;
      this.pagerCurrentPage = 1;//将页数回到第一页
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