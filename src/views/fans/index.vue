<template>
  <div class="page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/fans">活动管理</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-button-group style="margin-left: 35px;">
        <el-button :type="primary" size="small">粉丝列表</el-button>
        <el-button size="small">粉丝画像</el-button>
      </el-button-group>
      <div class="fans_list">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="8" :md="6"  :lg="4" :xl="4" v-for="(img,index) in results" :key="index">
            <div class="fans">
              <el-image :src="img.photo" style="width:70px;height:70px;margin-top:10px" :lazy="true"></el-image>
              <p>{{ img.name }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-pagination
        style="margin-top:30px;text-align:center"
        background
        layout="prev, pager, next"
        :page-size="30"
        :current-page.sync="page"
        @current-change="nextFans"
        :total="data.total_count">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getFans } from '@/api/fans'
export default {
 name: 'FansIndex',
 components: {},
 props: {},
 data() {
   return {
     primary:"primary",
     results:[],
     data:{},
     page:1
   }
 },
 computed: {},
 watch: {},
 created (){
   this.loadFans()
 },
 mounted (){},
 methods: {
   loadFans(page=1,per_page=30){
     getFans({page,per_page}).then(res =>{
       this.results = res.data.data.results
       this.data = res.data.data
     })
   },
   nextFans(){
     this.loadFans(this.page)
   }
 }
}
</script>

<style scoped>
  .fans_list{
    text-align: center;
    margin-left: 35px;
  }
  .fans{
    width:100px;
    height:130px;
    border:2px solid rgb(211, 211, 211);
    border-radius:5px;
    margin-top: 20px;
    font-size: 14px;
  }
</style>
