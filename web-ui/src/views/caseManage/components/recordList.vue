<template>
  <el-table :data="recordList" style="width: 100%; margin-top: 20px">
    <el-table-column
      prop="medLink"
      :formatter="getCaseStatus"
      label="调解环节"
      :show-overflow-tooltip="true"
      width="120"
    >
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="调解时间"
      width="100"
      :show-overflow-tooltip="true"
    >
    </el-table-column>
    <el-table-column
      prop="medName"
      label="姓名"
      width="100"
      :show-overflow-tooltip="true"
    >
    </el-table-column>
    <el-table-column
      prop="medTel"
      label="电话"
      width="120"
      :show-overflow-tooltip="true"
    >
    </el-table-column>
    <el-table-column
      prop="medContactPerson"
      label="关系"
      width="100"
      :show-overflow-tooltip="true"
    >
    </el-table-column>
    <!--<el-table-column-->
    <!--prop="medContactPerson"-->
    <!--label="关系">-->
    <!--</el-table-column>-->
    <el-table-column
      prop="medContent"
      label="调解内容"
      width="200"
      :show-overflow-tooltip="true"
    >
    </el-table-column>
    <el-table-column
      prop="promiseRepayDate"
      label="承诺还款日"
      width="130"
      :show-overflow-tooltip="true"
    >
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.promiseRepayDate, "{y}-{m}-{d}") }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="repayAmount"
      label="调解还款总额"
      :show-overflow-tooltip="true"
      width="150"
    >
    </el-table-column>
    <el-table-column
      prop="term"
      label="调解详情"
      :show-overflow-tooltip="true"
      width="150"
    >
    </el-table-column>
    <el-table-column
      prop="repayDate"
      label="调解时间"
      :show-overflow-tooltip="true"
      width="150"
    >
    </el-table-column>
    <el-table-column
      prop="medLabel"
      :formatter="getContactStatus"
      label="标签"
      width="120"
      :show-overflow-tooltip="true"
    >
    </el-table-column>
    <el-table-column
      prop="mediatorName"
      label="调解员"
      :show-overflow-tooltip="true"
    >
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "recordList",
  props: {
    recordList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      contactResultOptions: [],
      statusOptions:[]
    };
  },
  created() {
    //联系状态
    this.getDicts("contact_status").then((response) => {
      this.contactResultOptions = response.data;
    });
      //案件状态
      this.getDicts("case_status").then((response) => {
        this.statusOptions = response.data;
      });
  },
  methods: {
    //联系人状态
    getContactStatus(row, column) {
      return this.selectDictLabel(this.contactResultOptions, row.medLabel);
    },
    //案件状态
    getCaseStatus(row, column) {
      return this.selectDictLabel(this.statusOptions, row.medLink);
    },
  },
};
</script>

<style scoped>
</style>
