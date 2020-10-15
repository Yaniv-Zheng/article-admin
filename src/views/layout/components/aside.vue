<template>
  <div>
    <el-menu
      :default-active="$route.path"
      background-color="#fff"
      text-color="#000"
      active-text-color="red"
      router
      >
      <div class="menu_logo"></div>
      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/article">
        <i class="el-icon-folder-opened"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
      <el-menu-item index="/images">
        <i class="el-icon-s-cooperation"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/publish">
        <i class="el-icon-document"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/comment">
        <i class="el-icon-s-comment"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="/fans">
        <i class="el-icon-user-solid"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/install">
        <i class="el-icon-setting"></i>
        <span slot="title">设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'appAside',
    components: {},
    props: {},
    data() {
      return {
      }
    },
    computed: {},
    watch: {},
    created (){},
    mounted (){},
    methods: {}
  }
</script>

<style scoped>
  .menu_logo{
    width: 100%;
    height: 60px;
    background:url('./toutiao.png') no-repeat;
    background-size: 60%;
    background-position: center;
    margin-bottom: 10px;
  }
  .el-menu-item{
    margin-left: 30px;
  }
  .el-menu{
    border-right: none;
  }
</style>
