<template>
  <div class="page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/images">素材管理</a></el-breadcrumb-item>
          </el-breadcrumb>
        </span>
      </div>
      <material-list />
    </el-card>
  </div>
</template>

<script>
import { getImage,collectImg,deleteImg } from '@/api/images'
import MaterialList from '@/components/material'

export default {
 name: 'ImagesIndex',
 components: {
   MaterialList
 },
 props: {},
 data() {
   return {
     
   }
 },
 computed: {},
 watch: {
 },
 created (){
 },
 mounted (){},
 methods: {
   
   uploadSuccess(){
     this.$message({
       type:'success',
       message:'上传成功'
     })
   }
 }
}
</script>

<style scoped>
</style>
