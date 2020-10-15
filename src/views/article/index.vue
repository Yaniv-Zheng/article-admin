<template>
  <div class="article">
    <el-card class="box-card-select">
      <div slot="header" class="clearfix">
        <div class="article_nav">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/article">内容管理</a></el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="article_screening">
        <span>状态：</span>
        <el-radio-group v-model="status">
          <el-radio :label="null">全部</el-radio>
          <el-radio :label="0">草稿</el-radio>
          <el-radio :label="1">待审核</el-radio>
          <el-radio :label="2">审核通过</el-radio>
          <el-radio :label="3">审核失败</el-radio>
          <el-radio :label="4">已删除</el-radio>
        </el-radio-group>
      </div>
      <div class="channel_select">
        <span>频道：</span>
        <el-select v-model="channelId" placeholder="请选择频道">
          <el-option
            :value="null"
            label="全部">
          </el-option>
          <el-option
            v-for="(item,index) in channels"
            :key="index"
            :value="item.id"
            :label="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="select_time">
        <span>日期：</span>
        <el-date-picker
          v-model="rangeDate"
          type="daterange"
          value-format="yyyy-MM-dd"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <div class="query_btn">
        <el-button type="primary" :disabled="loading" @click="loadArticles(1)">查询</el-button>
      </div>
    </el-card>
    <el-card class="box-card-article">
      <div slot="header" class="clearfix">
        <span>查询到 {{card_num}} 条结果：</span>
      </div>
      <div class="cards">
        <el-table
          v-loading="loading"
          :data="articles"
          style="width: 100%">
          <el-table-column
            label="封面">
            <template slot-scope="scope">
              <el-image :src="scope.row.cover.images[0]" lazy fit="scale-down" class="article_cover" :preview-src-list="scope.row.cover.images">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <!-- <img :src = "scope.row.cover.images[0]" class="article_cover"/> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].title }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="pubdate"
            label="发布时间">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="$router.push('/publish?id='+scope.row.id.toString())">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="loadRemoveArticle(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="this.card_num"
        :disabled="loading"
        @current-change="onCurrentChange"
        :current-page.sync="page"
        >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getArticles,getChannels,removeArticle } from '@/api/article.js'
export default {
 name: 'ArticleIndex',
 components: {},
 props: {},
 data() {
   return {
     radio: 5,
     channelId:null,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value1: '',
        rangeDate:null,

        card_num:0,
        articles:[],
        articleStatus:[
          {status:0,title:"草稿",type:""},
          {status:1,title:"待审核",type:"warning"},
          {status:2,title:"审核通过",type:"success"},
          {status:3,title:"审核失败",type:"info"},
          {status:4,title:"已删除",type:"danger"}
        ],
        status:null,
        channels:[],
        beginPubdate:null,
        endPubdate:null,
        loading:true,
        page:1 //当前所在页数
   }
 },
 computed: {},
 watch: {},
 created (){
   this.loadArticles()
   this.loadChannels()
 },
 mounted (){},
 methods: {
   loadArticles(page){
     getArticles({
       page,
       status:this.status,
       channel_id:this.channelId,
       begin_pubdate:this.rangeDate ? this.rangeDate[0] : null,
       end_pubdate:this.rangeDate ? this.rangeDate[1] : null
     }).then(res => {
       this.card_num = res.data.data.total_count
       this.articles = res.data.data.results
       this.loading = false
     })
   },
   onCurrentChange(page){
     this.loadArticles(page)
   },
   loadChannels(){
    getChannels().then(res =>{
      this.channels = res.data.data.channels
    })
  },
  loadRemoveArticle(target){
    this.$confirm('确定删除吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      removeArticle(target.toString()).then(res =>{
        //删除成功 更新当前文章列表
        this.loadArticles(this.page)
      })
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

<style scoped>
  .article_screening span,.channel_select span,.select_time span{
    font-size: 14px;
    margin-right: 20px;
  }
  .channel_select,.select_time{
    margin-top: 20px;
  }
  .box-card-article{
    margin-top: 20px;
  }
  .pagination{
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .el-card  >>> .cell{
    text-align: center;
  }
  .article_cover{
    width: 100px;
    height: 100px;
  }
  .query_btn{
    margin-top: 20px;
  }
  .cards >>> .image-slot{
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-button--mini{
    margin-left: 10px;
  }
  .el-button--mini, .el-button--mini.is-round{
    margin-top: 10px;
  }
</style>
