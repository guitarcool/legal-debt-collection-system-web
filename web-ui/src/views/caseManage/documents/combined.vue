<template>
  <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="80%">
    <template v-slot:default>
      <div class="box-contnet-wrap">
        <el-row :gutter="10" class="mb8" style="display: flex;align-items: center;">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-share"
              size="mini"
              @click="handleAddTemplate"
              >新增
            </el-button>
          </el-col>
          <el-tooltip placement="top">
          <div slot="content">
            可用于循环字段：{
            内部订单号 = "loanId"
            名称 = "name"
            合同编号 = "orderNo"
            期数 = "terms"
            本金 = "capital"
            利息 = "interest"
            到期日期 = "dueDate"
            还款成功日期 = "successRepayDate"
            逾期日期 = "overdueDate"
            还款状态 = "status"
            应还金额 = "dueAmount"
            实还金额 = "paidAmount"
            还款本金 = "repayCapital"
            还款利息 = "repayInterest"              
            }
          </div>
          <i class="el-icon-info" style="font-size:20px;text-align:center"></i>
        </el-tooltip>
        </el-row>

        <el-table v-loading="loading" :data="caseList">
          <el-table-column
            label="字段名称"
            prop="fieldName"
            :show-overflow-tooltip="true"
            width="150"
          />
          <el-table-column
            label="字段英文名"
            prop="englishName"
            :show-overflow-tooltip="true"
            width="150"
          />
          <el-table-column
            label="格式类型"
            prop="formatType"
            :formatter="getTemplateTypes"
          />
          <el-table-column
            label="字段内容"
            :show-overflow-tooltip="true"
            prop="fieldContent"
            width="200"
          />
          <el-table-column label="操作" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="edit(scope.row.id)"
                v-hasPermi="['template:info:edit']"
                >编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                v-if="scope.row.status == 1"
                @click="toggle(scope.row)"
                v-hasPermi="['template:info:switch']"
                >停用
              </el-button>
              <el-button
                size="mini"
                type="success"
                v-if="scope.row.status == 0"
                @click="toggle(scope.row)"
                v-hasPermi="['template:info:switch']"
                >启用
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        <addcombined
          :getList="getList"
          :title="addTemplateData.title"
          :show.sync="addTemplateData.dialogVisible"
          :id="addTemplateData.id"
        ></addcombined>
      </div>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
      <!-- <el-button type="primary" @click="submit">确 定</el-button> -->
    </div>
  </Dialog>
</template>

<script>
import Dialog from "@/components/Dialog/index";
import templateApi from "@/api/case/document/templateIndex";
import addcombined from "./addCombined.vue";

export default {
  name: "combined",
  components: { Dialog, addcombined },
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
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      caseList: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      addTemplateData: {
        title: "",
        dialogVisible: false,
        id: "",
      },
      combinationType: [],
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
  created() {
    this.getList();
    //格式类型
    this.getDicts("combination_type").then((response) => {
      this.combinationType = response.data;
    });
  },
  mounted() {},
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      templateApi.combinateList(this.queryParams).then((response) => {
        //console.log(response)
        this.caseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //切换状态
    toggle(val) {
      this.data = {
        id: val.id,
        status: val.status == 1 ? 0 : 1,
      };
      var that = this;
      this.$confirm("是否确认切换?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          templateApi.combinateStatus(this.data).then((res) => {
            that.msgSuccess("操作成功");
            that.getList();
          });
        })
        .catch(() => {});
    },
    //编辑
    edit(id) {
      this.addTemplateData.title = "编辑组合字段";
      this.addTemplateData.dialogVisible = true;
      this.addTemplateData.id = JSON.stringify(id);
    },
    getTemplateTypes(row, column) {
      return this.selectDictLabel(this.combinationType, row.formatType);
    },
    handleAddTemplate() {
      this.addTemplateData.title = "新增组合字段";
      this.addTemplateData.dialogVisible = true;
      this.addTemplateData.id = "";
    },
  },
};
</script>

<style scoped lang="scss">
.el-dialog__body {
  height: 20px;
}

.division-content {
  .radio-box {
    margin: 10px 0 14px;
  }

  > p {
    font-size: 12px;
    color: #1c84c6;
    margin-bottom: 22px;
  }

  .choise-box {
    display: flex;

    .el-radio,
    .el-checkbox {
      justify-content: space-between;
      margin: 0 10px 10px 0;
    }
  }
  .tree-box {
    border: 1px solid #e6ebf5;
    padding: 10px;
  }
  /*自定义横向滚动条*/
  ::-webkit-scrollbar {
    background-color: transparent;
  }
}
</style>
<style lang="scss">
.custom-width {
  .el-form-item__label {
    width: 170px !important;
    text-align: left;
  }

  .el-form-item__content {
    display: flex;
    align-items: center;
  }
}
</style>
