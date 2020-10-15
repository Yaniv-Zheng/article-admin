<template>
  <div class="page">
    <div class="images_body">
      <div class="images_btn">
        <el-button
          round
          @click.native="clickAll"
          :type="primary[0]"
          size="small"
          >全部</el-button
        >
        <el-button
          icon="el-icon-star-off"
          @click.native="clickCollect"
          circle
          :type="primary[1]"
          size="small"
        ></el-button>
        <el-row v-if="isShow">
          <span style="margin-left: 20px">
            <el-popover placement="top" width="auto" v-model="visible">
              <p>上传素材</p>
              <el-upload
                class="upload-demo"
                drag
                action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                :headers="uploadHeader"
                name="image"
                :on-success="uploadSuccess"
                multiple
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false"
                  >取消</el-button
                >
                <el-button type="primary" size="mini" @click="visible = false"
                  >确定</el-button
                >
              </div>
              <el-button
                slot="reference"
                icon="el-icon-plus"
                circle
                type="success"
                size="small"
              ></el-button>
            </el-popover>
          </span>
        </el-row>
      </div>
    </div>
    <div class="imgs_body">
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
          @click.native="selectIndex = index"
          v-for="(img, index) in images"
          :key="index"
          lazy
        >
          <div class="imgbox">
            <div class="SelectPic" v-if="!isShow && selectIndex === index"><i class="el-icon-check"></i></div>
            <el-image
              style="width: 100%; height: 150px"
              :src="img.url"
              fit="fit"
            >
            </el-image>
            <div class="img_handle" v-if="isShow">
              <el-button
                size="mini"
                icon="el-icon-star-off"
                :type="img.is_collected ? 'primary' : null"
                circle
                :disabled="img.disabled"
                @click="loadCollectImg(img)"
              ></el-button>
              <el-button
                size="mini"
                icon="el-icon-delete"
                circle
                @click="loadDeleteImg(img.id)"
              ></el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="changeBtn">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="page"
        :page-size="20"
        @current-change="onCurrentChange"
        :total="total_count"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getImage, collectImg, deleteImg } from "@/api/images";
export default {
  name: "MaterialList",
  components: {},
  props: {
    isShow:{
      type:Boolean,
      default:true
    }
  },
  data() {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return {
      primary: ["primary", ""],
      images: [],
      visible: false,
      uploadHeader: {
        Authorization: `Bearer ${user.token}`,
      },
      total_count: null,
      page: 1,
      selectIndex:null //选中图片的索引
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadImages(1, false);
  },
  mounted() {},
  methods: {
    clickbtn(num, val) {
      if (this.primary[num] === "") {
        this.primary = ["", ""];
        this.primary[num] = "primary";
        this.loadImages(1, val);
      }
    },
    clickAll() {
      this.clickbtn(0, false);
    },
    clickCollect() {
      this.clickbtn(1, true);
    },
    loadImages(page = 1, collect = false) {
      this.page = page;
      getImage({
        collect,
        page,
        per_page: 20,
      }).then((res) => {
        const result = res.data.data.results;
        result.forEach((img) => {
          img.disabled = false;
        });
        this.total_count = res.data.data.total_count;
        this.images = res.data.data.results;
      });
    },
    uploadSuccess() {
      this.loadImages(1, false),
        this.$message({
          type: "success",
          message: "上传成功",
        });
    },
    onCurrentChange() {
      this.loadImages(this.page, false);
    },
    loadCollectImg(img) {
      img.disabled = true;
      collectImg(img.id, !img.is_collected).then((res) => {
        img.disabled = false;
        img.is_collected = !img.is_collected;
        if (img.is_collected) {
          this.$message({
            type: "success",
            message: "收藏成功",
          });
        } else {
          this.$message({
            type: "success",
            message: "取消收藏",
          });
        }
      });
    },
    loadDeleteImg(img) {
      deleteImg(img).then((res) => {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.loadImages(1, false);
      });
    }
  },
};
</script>

<style scoped>
.images_body {
  width: 100%;
}
.images_btn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.changeBtn {
  margin-top: 30px;
  text-align: center;
}
.img_handle {
  width: 100%;
  height: 35px;
  background-color: rgb(255, 255, 255);
  text-align: center;
}
.imgbox {
  margin-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}
.SelectPic {
  width: 150px;
  height: 150px;
  font-size: 100px;
  color:rgb(255, 255, 255);
  background-color: rgba(0, 0, 0, 0.253);
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
