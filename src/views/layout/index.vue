<template>
  <el-container class="layout_container">
    <el-aside width="200px"><app-aside class="app_aside" /></el-aside>
    <el-container>
      <el-header class="layout_header">
        <div class="layout_header_title">
          <el-dropdown-item icon="el-icon-more"></el-dropdown-item>
        </div>
        <el-dropdown>
          <div class="el-dropdown-link">
            <img :src="user.photo" />
            <span
              >{{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i
            ></span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <a href="/install" style="text-decoration: none"
              ><el-dropdown-item icon="el-icon-setting"
                >设置</el-dropdown-item
              ></a
            >
            <el-dropdown-item
              icon="el-icon-switch-button"
              @click.native="outLogin"
              >退出</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script>
import appAside from "./components/aside";
import { getUsers } from "@/api/user.js";
import globalbus from "@/utils/globalbus";

export default {
  name: "layoutIndex",
  components: {
    appAside,
    globalbus,
  },
  props: {},
  data() {
    return {
      user: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadUsers(),
      globalbus.$on("user_img", (data) => {
        this.user.photo = data.photo;
      });
  },
  mounted() {},
  methods: {
    loadUsers() {
      getUsers().then((res) => {
        this.user = res.data.data;
      });
    },
    outLogin() {
      this.$confirm("确定退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!",
          });
          window.localStorage.removeItem("user");
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>

<style scoped>
.layout_container {
  position: fixed;
  left: 8%;
  right: 12%;
  top: 20px;
  bottom: 20px;
}
.app_aside {
  height: 100%;
}
.layout_header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(250, 200, 200);
}
.layout_header_title .el-dropdown-menu__item {
  font-size: 30px;
}
.el-dropdown-link img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  margin-right: 10px;
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  font-size: 17px;
}
</style>
