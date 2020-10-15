<template>
  <div id="app">
    <div id="nav">
    </div>
    <router-view/>
  </div>
</template>

<style>
  body,html{
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  }
  .el-main::-webkit-scrollbar{
    /*高宽分别对应横竖滚动条的尺寸*/
    width : 8px;
    height: 1px;
  }
  .el-main::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
    border-radius: 5px;
    box-shadow   : inset 0 0 5px rgb(230, 230, 230);
    background   : #ebebeb;
  }
</style>
