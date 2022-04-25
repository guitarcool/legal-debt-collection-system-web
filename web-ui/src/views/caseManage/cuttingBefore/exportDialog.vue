<template>
  <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
    <template v-slot:default>
      <!-- 查看字段表 -->
      <div class="see-field" v-loading="loading">
        <div class="margin-div">
          <p class="book-title">1、合同号</p>
          <el-input v-model="contractNo" placeholder="请输入合同号" clearable size="small" style="width: 240px" />
        </div>
        <div class="margin-div">
          <p class="book-title">
            {{
              title == "生成律师函短信"
                ? "2、选择律师函短信模版"
                : "2、选择律师函模版"
            }}
          </p>
          <el-scrollbar style="height: 250px">
            <el-input clearable placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
            <el-tree :data="data" class="border-style" :props="defaultProps" node-key="id" :expand-on-click-node="false"
              :filter-node-method="filterNode" ref="tree" @node-click="handleNodeClick" default-expand-all />
          </el-scrollbar>
        </div>
        <div class="margin-div">
          <p class="book-title">3、电子签章设置：</p>
          <ul class="drag-box" ref="parentNode">
            <p v-if="formlist.length==0" style="line-height: 50px;text-align: center">暂无数据</p>
            <li v-else v-for="(item,index) in formlist" :key="index" class="item">
              <p>{{item.name}}</p>
              <el-switch v-model="item.switch" active-color="#13ce66" inactive-color="#ff4949"
                @change="switchChange(item)"></el-switch>
            </li>
          </ul>
        </div>
        <div class="margin-div" v-if="title == '生成律师函'">
          <p class="book-title">4、是否显示页码：</p>
          <el-switch v-model="isShow" active-color="#13ce66" inactive-color="#ff4949" :active-value="1"
            :inactive-value="0">
          </el-switch>
        </div>
        <div class="margin-div" v-if="title == '生成律师函'">
          <p class="book-title">5、申请日期：</p>
          <el-date-picker v-model="applyDate" type="date" placeholder="选择日期" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="margin-div" v-if="title == '生成律师函'">
          <p class="book-title">6、导出文档格式：</p>
          <el-radio-group v-model="suffix">
            <el-radio :label="1">.docx</el-radio>
            <el-radio :label="2">.pdf</el-radio>
            <el-radio :label="3">.xlsx</el-radio>
          </el-radio-group>
        </div>
      </div>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </Dialog>
</template>

<script>
  import Dialog from "@/components/Dialog/index";
  import {
    getToken
  } from "@/utils/auth";
  import axios from "axios";
  import templateApi from "@/api/case/document/templateIndex";
  const mimeMap = {
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    zip: "application/zip",
  };
  export default {
    name: "exportDialog",
    components: {
      Dialog
    },
    props: {
      // 传参控制弹窗显示隐藏
      show: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: "",
      },
      id: {
        type: String,
        default: "",
      },
      contractNo: {
        type: String,
        default: "",
      },
      requestApi: {
        type: String,
        default: "",
      },
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },
    data() {
      return {
        defaultProps: {
          children: "children",
          label: "name",
        },
        filterText: "",
        caseList: [],
        data: [{
          name: "律师函短信模版",
          children: [],
        }, ],
        templateId: "",
        applyDate: "",
        isShow: 0,
        suffix: 1,
        loading: false,
        formlist: [],
        needSignTemplate: null,
      };
    },
    computed: {
      dialogVisible: {
        get() {
          return this.show;
        },
        set(val) {
          this.$emit("update:show", val);
        },
      },
    },
    created() {},
    mounted() {},
    methods: {
      openDialog() {
        this.loading = false;
        this.templateId = "";
        this.applyDate = "";
        this.filterText = "";
        this.suffix = 1;
        this.isShow = 0;
        this.data[0].children = [];
        if (this.title == "生成律师函短信") {
          this.data[0].name = "律师函短信模版";
        }
        if (this.title == "生成律师函") {
          this.data[0].name = "律师函模版";
        }
        this.getList();
      },
      // 提交
      submit() {
        if (!this.templateId) {
          this.msgError("请选择模版");
          return;
        }
        this.loading = true;
        let url = "";
        url = `${this.requestApi}${this.id}/${this.templateId}`;
        if (this.title == "生成律师函") {
          url = `${this.requestApi}${this.id}/${this.templateId}/${this.needSignTemplate}/${this.applyDate}/${
          this.isShow
        }/${
          this.suffix == 1
            ? ".docx"
            : this.suffix == 2
            ? ".pdf"
            : ".xlsx"
        }`;
        }
        const baseUrl = process.env.VUE_APP_BASE_API;
        axios({
            method: "get",
            url: baseUrl + url,
            timeout:600000,
            responseType: "blob",
            headers: {
              Authorization: "Bearer " + getToken()
            },
        }).then((res) => {
          let data = res.data
          let _self = this
          let fileReader = new FileReader();
          fileReader.onload = function () {
            try {
              let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
              _self.$message({
                message: jsonData.msg,
                type: "error",
              }); // 弹出的提示信息
              _self.loading = false;
            } catch (err) { // 解析成对象失败，说明是正常的文件流
              _self.resolveBlob(res, mimeMap.zip);
              _self.dialogVisible = false;
              _self.loading = false;
              _self.$emit('refresh');
            }
          };
          fileReader.readAsText(data) // 注意别落掉此代码，可以将 Blob 或者 File 对象转根据特殊的编码格式转化为内容(字符串形式)
          }).catch((error) => {
            // console.log(error)
            this.loading = false;
          });
      },
      resolveBlob(res, mimeType) {
        const aLink = document.createElement("a");
        var blob = new Blob([res.data], {
          type: mimeType
        });
        // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
        var patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
        var contentDisposition = decodeURI(res.headers["content-disposition"]);
        var result = patt.exec(contentDisposition);
        var fileName = result[1];
        fileName = fileName.replace(/\"/g, "");
        aLink.href = URL.createObjectURL(blob);
        aLink.setAttribute("download", fileName); // 设置下载文件名称
        document.body.appendChild(aLink);
        aLink.click();
        document.body.appendChild(aLink);
        this.dialogVisible = false;
        this.loading = false;
        this.$emit('refresh');
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      //多元调解模版 0
      //诉讼模版    1
      //律师函模版  2
      //债转模版   3
      getList() {
        let param = {
          name: "",
          templateType: "",
          status: "",
        };
        templateApi.templateList(param).then((response) => {
          //console.log(response)
          this.caseList = response.data || [];
          this.caseList.forEach((item) => {
            if (this.title == "生成律师函短信") {
              //律师函短信模版
              if (
                item.formatType == 1 &&
                item.templateType == 2 &&
                item.status == 1
              ) {
                this.data[0].children.push(item);
              }
            }
            if (this.title == "生成律师函") {
              if (
                item.formatType == 0 &&
                item.templateType == 2 &&
                item.status == 1
              ) {
                this.data[0].children.push(item);
              }
            }
          });
        });
      },
      handleNodeClick(data) {
        //console.log(data)
        this.formlist = [];
        if (!data.id) {
          this.$refs.tree.setCurrentKey(null);
          this.templateId = "";
        } else {
          this.templateId = data.id;
          let formData = {
            switch: false,
            name: data.name,
            id: data.id,
          }
          this.formlist.push(formData);
        }
      },
      switchChange(item) {
        this.needSignTemplate = null;
        if (item.switch == true) {
          this.needSignTemplate = item.id;
        }
      }
    },
  };

</script>

<style scoped lang="scss">
  .el-dialog__body {
    height: 20px;
  }

</style>
<style lang="scss">
  .border-style {
    border: 1px solid #e6ebf5;
    padding: 10px;
    min-height: 250px;
    border-top: none;
    border-radius: 4px;

    //margin-bottom: 10px;
    .el-tree-node.is-current>.el-tree-node__content {
      color: #409eff;
      background-color: transparent;
      border-radius: 4px;
    }

    .el-tree-node>.el-tree-node__content:hover {
      background-color: transparent;
    }

    .el-tree-node.is-current>.el-tree-node__content:after {
      content: "\e6da";
      font-family: element-icons !important;
      padding-left: 10px;
      font-weight: bolder;
    }

    .el-tree-node>.el-tree-node__children {
      overflow: unset;
    }
  }

  .margin-div {
    margin-bottom: 20px;
  }

  .book-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #409eff;
  }

  .drag-box {
    border: 1px solid #e6ebf5;
    margin: 10px 0;
    padding: 10px;
    min-height: 50px;

    li {
      list-style: none;
      height: 30px;
      border-bottom: 1px solid #f3eeee;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    li:last-of-type {
      border-bottom: none;
    }
  }

</style>
