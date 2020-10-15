<template>
  <div class="page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/install">设置</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="install_form">
        <el-form ref="infoForm" :model="user" label-width="50px" :rules="rules" style="width: 40%">
          <el-form-item label="头像">
            <div class="head_portrait">
              <el-image
                style="width: 100px; height: 100px;margin-top:15px;margin-bottom:-15px"
                :src="user.photo"
                fit="fill">
              </el-image>
              <el-button icon="el-icon-picture" size="mini" @click="$refs.file.click()">更换头像</el-button>
              <input type="file" ref="file" hidden @change="onChangeFile"/>
            </div>
          </el-form-item>
          <el-form-item label="ID">
            {{ user.id }}
          </el-form-item>
          <el-form-item label="手机">
            {{ user.mobile }}
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="user.email" placeholder="请输入邮箱" style="width: 200px;min-width:100px"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="name">
            <el-input
              type="text"
              placeholder="请输入昵称"
              v-model="user.name"
              maxlength="7"
              show-word-limit
              style="width: 200px;min-width:100px"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="介绍" prop="intro">
            <el-input type="textarea" style="width: 200px;min-width:100px" v-model="user.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveSettings" :loading="loading">保存设置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      @opened="onDialog"
      @closed="onClosed"
      >
      <div>
        <img
          style="max-width: 100%; height: 300px;display:block"
          :src="uploadImg"
          ref="crop_img"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onChangePhoto" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers,changePhoto,changeUsers } from '@/api/user'
import globalbus from '@/utils/globalbus'
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';

export default {
 name: 'InstallIndex',
 components: {
   Cropper,
   globalbus
 },
 props: {},
 data() {
   return {
    user:{},
    dialogVisible: false,
    uploadImg:"",
    cropper:null,
    loading:false,
    rules: {
      name: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
      ],
      intro: [
        { required: true, message: '请输入内容', trigger: 'blur' },
        { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ]
    },
    userInfo:{}
   }
 },
 computed: {},
 watch: {},
 created (){
   this.loadUser()
 },
 mounted (){},
 methods: {
   loadUser(){
     getUsers().then(res =>{
       this.user = res.data.data
     })
   },
   onChangeFile(){
     this.dialogVisible=true
     const file = this.$refs.file
     const blobData = window.URL.createObjectURL(file.files[0])
     this.uploadImg = blobData
     this.$refs.file.value=""
   },
   onDialog(){
     //cropper裁切必须img为可见状态 在dialog完全打开后使用
     const image = this.$refs['crop_img'];
     this.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'none',
      cropBoxResizable: false
    })
   },
   onClosed(){
     this.cropper.destroy()
   },
   onChangePhoto(){
     this.loading = true
     this.cropper.getCroppedCanvas().toBlob((blob) => {
      const fd = new FormData()
      fd.append('photo', blob)
      changePhoto(fd).then(res =>{
        this.dialogVisible = false
        this.user.photo = window.URL.createObjectURL(blob)
        this.loading = false
        globalbus.$emit('user_img',this.user)
      })
    })
   },
   saveSettings(){
     this.loading = true
     changeUsers(this.user).then(res =>{
       this.loading = false
       this.$message({
         type:"success",
         message:"修改成功"
       })
     })
   }
 }
}
</script>

<style scoped>
  .el-card >>> .el-card__body{
    display: flex;
    justify-content: center;
  }
  .el-card >>>.el-form-item__error{
    width: 200px;
  }
</style>
