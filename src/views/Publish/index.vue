<template>
  <div class="page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item
              ><a href="/publish">发布文章</a></el-breadcrumb-item
            >
          </el-breadcrumb>
        </span>
      </div>
      <el-form ref="publish_form" :rules="formRules" :model="article">
        <el-form-item
          class="publish_title"
          label="标题"
          prop="title"
          label-width="60px"
        >
          <el-input
            type="text"
            placeholder="请输入标题"
            v-model="article.title"
            maxlength="30"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item
          class="publish_text"
          prop="text"
          label="内容"
          label-width="60px"
        >
          <el-tiptap
            class="tiptap"
            height="300px"
            placeholder="请输入文章内容..."
            v-model="article.content"
            :extensions="extensions"
            lang="zh"
          />
        </el-form-item>
        <el-form-item class="publish_img">
          <el-upload
            class="upload-demo"
            ref="upload"
            :on-change="onChange"
            :auto-upload="false"
            :limit="limit"
            action="action"
            :file-list="(fileList[0].url && fileList) || fileListNull"
            list-type="picture"
          >
            <el-button size="small" type="primary" slot="trigger"
              >上传封面图片</el-button
            >
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
            <el-button
              size="small"
              type="primary"
              @click="selectCover"
              style="margin-left: 10px"
              >素材库中选择封面</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item
          class="publish_channel"
          prop="channel"
          label="频道"
          label-width="60px"
        >
          <el-select
            v-model="article.channel_id"
            filterable
            allow-create
            default-first-option
            placeholder="请选择文章标签"
          >
            <el-option
              v-for="(item, index) in channels"
              :key="index"
              :value="item.id"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="publish_btn">
          <el-button type="primary" size="small" @click="onPublish(false)"
            >发表</el-button
          >
          <el-button size="small" @click="onPublish(true)">存入草稿</el-button>
        </div>
      </el-form>
    </el-card>
    <el-dialog
      title="素材库"
      width="45%"
      style="height:600px"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
    >
      <material-list :is-show="false" ref="materialList"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickPutImage"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getChannels,
  getPublish,
  editArticle,
  appointArticle,
  uploadImage,
} from "@/api/article.js";
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TextColor,
  Image,
} from "element-tiptap";
import "element-tiptap/lib/index.css";
import MaterialList from "@/components/material";

export default {
  name: "PublishIndex",
  components: {
    "el-tiptap": ElementTiptap,
    MaterialList,
  },
  props: {},
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (this.article.content === "<p></p>" || this.article.content === "") {
        callback(new Error("请输入文章内容~"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (!this.article.channel_id) {
        callback(new Error("请选择频道~"));
      } else {
        callback();
      }
    };
    return {
      channels: [],
      channelId: null,
      limit: 1,
      article: {
        title: "", //文章标题
        content: "", //文章内容
        cover: {
          type: 1, //
          images: [],
        },
        channel_id: null,
      },
      fileList: [{ name: "封面", url: "" }],
      fileListNull: [],
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TextColor(),
        new Image({
          uploadRequest(file) {
            const fs = new FormData();
            fs.append("image", file);
            return uploadImage(fs).then((res) => {
              return res.data.data.url;
            })
          },
        }),
      ],
      formRules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" },
          {
            min: 5,
            max: 30,
            message: "标题长度请控制到5-30字符之间~",
            trigger: "change",
          },
        ],
        text: [{ validator: validatePass1, trigger: "blur" }],
        channel: [{ validator: validatePass2, trigger: "blur" }],
      },
      dialogVisible: false,
      activeName: "first",
      fileurl: "",
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadChannels();
    if (this.$route.query.id) {
      this.loadArticle();
    }
  },
  mounted() {},
  methods: {
    loadChannels() {
      getChannels().then((res) => {
        this.channels = res.data.data.channels;
      });
    },
    async onChange(file, fileList) {
      const event = event || window.event;
      const img = event.target.files[0];
      this.fileurl = img;
      const fd = new FormData();
      fd.append("image", this.fileurl);
      await uploadImage(fd).then((res) => {
        this.article.cover.images[0] = res.data.data.url;
      })
    },
    onPublish(draft) {
      this.$refs["publish_form"].validate((valid) => {
        if (!valid) {
          return;
        }
        if (this.$route.query.id) {
          editArticle(this.$route.query.id, this.article, draft).then((res) => {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.$router.push("/article");
          });
        } else {
          getPublish(this.article, draft).then((res) => {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.$router.push("/article");
          });
        }
      });
    },
    loadArticle() {
      appointArticle(this.$route.query.id).then((res) => {
        this.article.title = res.data.data.title;
        this.article.content = res.data.data.content;
        this.article.cover.images = res.data.data.cover.images;
        this.fileList[0].url = res.data.data.cover.images[0];
        this.article.channel_id = res.data.data.channel_id;
      });
    },
    selectCover() {
      this.dialogVisible = true;
    },
    clickPutImage() {
      this.dialogVisible = false
      const materialList = this.$refs['materialList']
      this.fileList[0].url = materialList.images[materialList.selectIndex].url
      this.article.cover.images[0] = materialList.images[materialList.selectIndex].url
    }
  },
};
</script>

<style scoped>
.publish_img {
  margin-top: 20px;
  margin-left: 60px;
}
.publish_btn {
  margin-top: 20px;
  margin-left: 60px;
}
</style>
