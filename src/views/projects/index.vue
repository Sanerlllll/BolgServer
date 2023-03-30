<template>
  <div class="app-container">
    <!-- 表格数据 -->
    <el-table :data="data" stripe style="width: 100%" border v-loading="listLoading" highlight-current-row>
      <el-table-column  label="序号" width="50" align="center">
        <template slot-scope="scope">{{scope.$index +1}}</template>
      </el-table-column>
      <el-table-column  label="项目名称" width="180" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank" class="proName">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column label="项目描述" align="center">
        <!-- 调用toString()方法转为字符串形式 -->
        <template slot-scope="scope">{{scope.row.description.toString()}}</template>
      </el-table-column>
      <el-table-column  label="预览图" align="center" width="150">
        <template slot-scope="scope">
          <el-image
            style="width:100px;"
            :src="scope.row.thumb2"
            fit="contain"
            :preview-src-list="srcList">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column  label="操作"  align="center" width="150">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="github" placement="top" :hide-after="3000">
            <el-button type="primary" icon="iconfont icon-github-fill" class="github" circle size="mini" @click="openGitHubHandle(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="3000">
            <el-button type="warning" icon="el-icon-edit" circle size="mini" @click="editProHandle(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="3000">
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteProHandle(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- 编辑页面 -->
    <el-dialog
      title="请编辑该项目信息"
      :visible.sync="dialogFormVisible"
      fullscreen      
      >
      <el-form :model="form">
        <el-form-item label="项目名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="项目描述（每一项描述以逗号分隔）">
          <el-input v-model="form.description"></el-input>
        </el-form-item>    
        <el-form-item label="项目链接">
          <el-input v-model="form.url"></el-input>
        </el-form-item>  
        <el-form-item label="Github地址">
          <el-input v-model="form.github"></el-input>
        </el-form-item>
        <el-form-item label="预览图">
          <Upload v-model="form.thumb"></Upload>
        </el-form-item>
        <el-form-item label="排序等级">
          <el-select v-model="form.order" placeholder="请选择等级">
            <el-option  label="1" value="1"></el-option>
            <el-option  label="2" value="2"></el-option>
            <el-option  label="3" value="3"></el-option>
            <el-option  label="4" value="4"></el-option>
            <el-option  label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { server_URL} from '@/urlConfig';
import Upload from '@/components/Upload';
import {getProject,updateProject,delProject} from '@/api/project';
export default {
  data(){
    return {
      data:[],//存储远程请求返回的数据
      listLoading:false,//是否正在加载中
      srcList:[],//放大预览图
      dialogFormVisible:false,//编辑页面是否显示
      form:{
        name:'',
        description:'',
        github:'',
        thumb:'',
        url:'',
        order:1,
      }
    }
  }, 
  components:{
    Upload
  },
  created(){
    this.fetchData();
  },
  methods:{
    fetchData(){
      this.listLoading = true
      getProject().then((resp) => {
        this.listLoading = false;
        this.data = resp.data;
        // console.log(resp.data);
        // 处理图片地址
        for(var i of this.data){  
        // i.createDate = formatDate(i.createDate);//格式化日期
        i.thumb2 =  server_URL + i.thumb;//格式化图片地址
        this.srcList.push(i.thumb);
        }
        // console.log(this.data);
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
    // 打开github
    openGitHubHandle(proInfo){
      window.open(proInfo.github);
    },
    // 编辑项目
    editProHandle(proInfo){
      this.dialogFormVisible = true;
      // 回填表单数据,且将description转为字符串形式
      this.form = {...proInfo,description:proInfo.description.toString()};
      // console.log(typeof this.form.order);
    },
    // 确认编辑
    confirmEditHandle(){
      // 对部分数据做处理
      let obj = {...this.form};
      obj.description = this.form.description.split(',');//以逗号分隔
      obj.order = parseInt(this.form.order);//转类型
      updateProject(obj.id,obj).then(()=>{
        this.dialogFormVisible = false;
        this.fetchData();
        this.$message.success('修改成功');
      })
    },
    // 删除项目
    deleteProHandle(proInfo){
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delProject(proInfo.id).then(() => {
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
    
  }

}
</script>

<style lang="scss" scoped>
.proName:hover{
  color:rgb(163,163,163);
}
.github{
  background-color:rgb(163,163,163);
  border-color: rgb(163,163,163);;
}
</style>