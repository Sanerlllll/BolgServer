 <template>
  <div class="app-container">
    <!-- 数据表格 -->
    <el-table :data="data" style="width: 100%" border >
      <el-table-column prop="id" label="序号" width="80" align="center">
        <template slot-scope="scope">{{scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="150" align="center">
        <template slot-scope="scope">{{scope.row.title}}</template>
      </el-table-column>
      <el-table-column prop="description" label="描述" align="center">
        <template slot-scope="scope">{{scope.row.description}}</template>
      </el-table-column>
      <el-table-column  label="中图预览"  align="center">
        <template slot-scope="scope">
          <el-image style="width: 100px;" :src="scope.row.midImg2" fit="fit"></el-image>
        </template>
      </el-table-column>
      <el-table-column  label="大图预览"  align="center">
        <template slot-scope="scope">
          <el-image style="width: 100px;" :src="scope.row.bigImg2" fit="fit"></el-image>
        </template>
      </el-table-column>
      <el-table-column  label="操作"  align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="3000">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="editBannerHandle(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹框 -->
    <el-dialog title="请编辑信息" :visible.sync="dialogFormVisible" top="5vh">
      <el-form :model="form">
        <el-form-item label="标题" >
         <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" >
          <el-input v-model="form.description"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
          <!-- 中图 -->
            <el-form-item label="首页中图">
              <Upload v-model="form.midImg" ></Upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <!-- 大图 -->
            <el-form-item label="首页大图">
              <Upload v-model="form.bigImg"></Upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBannerConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
    
  </template>
<script>
import { getBanner,setBanner } from '@/api/banner';
import {server_URL} from '@/urlConfig.js';
import Upload from '@/components/Upload.vue'
export default {
  data(){
    return{
      data:[],//存储远程请求返回的结果
      dialogFormVisible:false,//弹框是否显示
      form:{
        id:'',
        midImg:'',
        bigImg:'',
        title:'',
        discription:'',
      },
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
      getBanner().then((resp)=>{
        this.data = resp.data;
        // console.log(this.data);
        for(var item of this.data){
          item.midImg2 = server_URL + item.midImg;
          item.bigImg2 = server_URL + item.bigImg;
        }
      })
    },
    editBannerHandle(bannerInfo){
      // 1.将bannerInfo数据给弹框
      this.form = {...bannerInfo};//和bannerInfo不是同一个对象
      // console.log(this.form);
      // 2.显示弹框
      this.dialogFormVisible = true;
    },
    // 编辑banner
    editBannerConfirm(){
      // 从表单中拿到用户修改的数据发送到服务器
      // api文档要求三个首页一起提交给服务器
      let arr = [...this.data];//新数组
      for(var i=0; i<arr.length; i++){
        // 如果id相等则证明是要修改的那一条
        if(arr[i].id === this.form.id){
          arr[i] = this.form
        }
      }
      setBanner(arr).then((resp)=>{
        this.dialogFormVisible = false;//修改成功后关掉弹窗
         this.$message({
          message: '修改成功',
          type: 'success'
        });
      this.fetchData();//更新服务器的返回结果
      });
    }
  }
}
</script>

<style>

</style>