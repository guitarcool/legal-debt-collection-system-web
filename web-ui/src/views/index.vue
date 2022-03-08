<template>
  <div class="app-container">
    <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList">
      <template #default>
        <el-form-item label="类型：">
          <el-select size="small" v-model="queryParams.type" placeholder="请选择">
            <el-option
                    v-for="item in messageOptions"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
                  v-model="queryParams.content"
                  placeholder="请输入搜索关键字，包括单号、类型、正文内容、审批意见"
                  clearable
                  size="small"
                  style="width: 480px"
                  @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </template>
      <template #filter>
        <el-form-item label="状态：" class="custom-radio1">
          <el-radio-group v-model="queryParams.isread" @change="changeStatus">
            <el-radio :label="0">未读</el-radio>
            <el-radio label="">全部</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <template #buttonArea>

      </template>
    </search-bar>

    <div class="box-contnet-wrap">
      <el-table class="wrap-table" v-loading="loading" :data="caseList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left"/>
        <el-table-column label="类型" :formatter="statusFormat" prop="type" :show-overflow-tooltip="true" fixed="left" width="80"/>
        <el-table-column label="正文内容" prop="content" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-html="scope.row.content"></span>
          </template>
        </el-table-column>

        <el-table-column label="发起人" prop="createName" width="120"/>
        <el-table-column label="审批人" prop="approverName" width="120"/>
        <el-table-column label="发起时间" prop="createTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成时间" prop="createTime" width="160">
          <template slot-scope="scope" v-if="scope.row.endTime1">
            <span>{{ parseTime(scope.row.endTime1,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="流程状态" prop="status">

        </el-table-column>
        <!--<el-table-column label="还款状态" :formatter="getRepayStatus" prop="repayStatus" width="100">-->

        <!--</el-table-column>-->

        <!--<el-table-column label="操作" width="240" fixed="right" align="center">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button-->
                    <!--size="mini"-->
                    <!--type="primary"-->
                    <!--@click="handleUpdate(scope.row)"-->
                    <!--&gt;查看-->
            <!--</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>

      <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
      />
    </div>

  </div>
</template>

<script>
  import SearchBar from '@/components/SearchBar/index'
  import indexApi from "@/api/index";

  export default {
    name: "index",
    components: {SearchBar},
    data() {
      return {
        options: [{
          value: '信修申请',
          label: '信修申请'
        }, {
          value: '还款反馈审批',
          label: '还款反馈审批'
        }],
        // 遮罩层
        loading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 角色表格数据
        caseList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 50,
          content:'',
          type:'',
          isread:0
        },
        selection:[],
        messageOptions:[]
      };
    },
    created() {
      this.getList();
      //消息类型
      this.getDicts("message_type").then((response) => {
        this.messageOptions = response.data || [];
      });
    },
    // 是否显示过滤栏， 扣除页数，每页显示数，总数量参数，3个内的搜索参数，直接显示一行，不显示过滤
    computed: {
      hasFilter: {
        get() {
          return true
        }
      }
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        indexApi.list(this.queryParams).then(
                response => {
                  console.log(response)
                  this.caseList = response.rows;
                  this.total = response.total;
                  this.loading = false;
                }
        );
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.selection = selection
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      handleUpdate(item) {
        console.log(item)
        if(item.isread == 0){
          indexApi.hasRead(item.id).then(res => {
            console.log(res)
            if (res.code == 200) {
              //this.msgSuccess('操作成功')
              this.goList(item)
              //this.$router.push({path: 'division/list', params: {cid: item.cid}})
            }
          })
        }else{
          this.goList(item)
          //this.$router.push({path: 'division/list', params: {cid: item.cid}})
        }

        //this.$router.push({name: 'divisionInfo', query: {id: item.id}})
      },
      goList(item){
        console.log(item)
        switch (true) {
          case item.type==1:
            this.$router.push({path: 'division/list', params: {cid: item.cid}})
            break;
          case item.type==2:
            this.$router.push({path: 'division/modify', params: {cid: item.cid}})
            break;
          case item.type==3:
            this.$router.push({path: 'division/finance', params: {cid: item.cid}})
            break;
        }
      },
      changeStatus(){
        this.getList();
      },
      // 消息类型字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.messageOptions, row.type);
      },
    }
  };
</script>
<style lang="scss">
  .custom-radio1{
    padding-top: 10px;
    display: flex !important;
    .el-form-item__label{
      width: 60px;
      text-align: left;
      line-height: 20px;
      align-items: flex-start;
    }
    .el-radio{
      /*width: 20%;*/
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
  .wrap-table{
    .cell.el-tooltip{
      white-space: pre-wrap;
    }
  }
</style>
