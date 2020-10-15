<template>
  <div class="page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/comment">评论管理</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数">
        </el-table-column>
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数">
        </el-table-column>
        <el-table-column
          prop="comment_status"
          label="状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? '正常':'关闭' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-switch
              :disabled="scope.row.disabled"
              v-model="scope.row.comment_status"
              @change="toggleStatus(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div class="comment_btn">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="10"
          :current-page.sync="page"
          @current-change="onChange"
          :total="commentAll.total_count">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getArticles,changeCommentStatus } from '@/api/article'
export default {
 name: 'CommentIndex',
 components: {},
 props: {},
 data() {
   return {
     tableData: [],
     commentAll:'',
     page:1
   }
 },
 computed: {},
 watch: {},
 created (){
   this.loadArticles()
 },
 mounted (){},
 methods: {
   loadArticles(page=1){
     getArticles({response_type:'comment',page}).then(res =>{
       const result = res.data.data.results
       result.forEach(element => {
         element.disabled = false
       })
       this.tableData = res.data.data.results
       this.commentAll = res.data.data
     })
   },
   onChange(page){
     this.loadArticles(page)
   },
   toggleStatus(comment){
     comment.disabled = true
     changeCommentStatus(comment.id.toString(),comment.comment_status).then(res =>{
        this.$message({
        type:"success",
        message:!comment.comment_status ? "关闭成功":"开启成功"
        })
       comment.disabled = false
     })
   }
 }
}
</script>

<style scoped>
  .el-card >>> .cell{
    text-align: center;
  }
  .comment_btn{
    margin-top: 20px;
    text-align: center;
  }
  .el-card >>> .el-table__row{
    height: 60px;
  }
</style>
