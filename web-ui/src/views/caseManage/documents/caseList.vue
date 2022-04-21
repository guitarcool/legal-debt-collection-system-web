<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="案件批次号：" prop="batchNo">
                    <el-input clearable v-model="queryParams.batchNo" placeholder="请输入案件批次号" size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input clearable v-model="queryParams.id" placeholder="请输入订单号" size="small" style="width: 240px"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="调解员：">
                    <el-select clearable multiple collapse-tags filterable size="small" v-model="queryParams.principals" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="queryParams.respondentName" placeholder="请输入姓名，多个姓名用英文逗号连接" clearable
                        type="textarea" size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input clearable v-model="queryParams.respondentPhone" placeholder="请输入手机号" size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="身份证号：">
                    <el-input v-model="queryParams.respondentIdNo" placeholder="请输入身份证号，多个身份证号用英文逗号连接" clearable size="small"
                        style="width: 240px" type="textarea" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="合同号：">
                    <el-input clearable v-model="queryParams.orderNo" placeholder="请输入合同号，多个合同号用英文逗号连接" type="textarea"
                        size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="queryParams.remark" placeholder="请输入备注查询内容" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
            </template>
            <template #filter>
                <el-form-item label="案件状态：" class="custom-radio">
                    <el-checkbox-group v-model="queryParams.caseStatuss" @change="changeStatus">
                        <el-checkbox v-for="item in statusOptions"  v-show="item.dictValue!=13&&item.dictValue!=0"  :label="item.dictValue"
                            :key="item.dictValue">
                            {{ item.dictLabel }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="还款状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.repayStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in repayStatus" :key="item.dictValue" :label="item.dictValue">
                            {{item.dictLabel}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </template>
            <template #buttonArea></template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button v-if="queryParams.caseStatuss.indexOf('13')>-1 == false" type="danger" size="mini" :disabled="multiple"
                        @click="handleCaseStatusMessage(1)">批量短信发送(旧)
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button v-if="queryParams.caseStatuss.indexOf('13')>-1 == false" type="danger" size="mini" :disabled="multiple"
                        @click="handleCaseStatusMessage(2)">批量短信发送
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button v-if="queryParams.caseStatuss.indexOf('13')>-1 == false" type="success" size="mini"
                        @click="handleCaseStatusMessageAll" v-hasPermi="['shortMsg:clerical:sendsAll']">全选短信发送
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" icon="el-icon-download" size="mini" @click="batchBook"
                        :disabled="multiple" v-hasPermi="['case:clerical:instrumentBatch']">批量生成调解文书
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-download" size="mini" @click="batchBookAll"
                        v-hasPermi="['case:clerical:instrumentBatchAll']">全选生成调解文书
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-share" size="mini" @click="batchMessage"
                        :disabled="multiple" v-hasPermi="['case:clerical:noticeBatch']">批量生成短信/邮件
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-download" size="mini" @click="batchBookTwo"
                        :disabled="multiple" v-hasPermi="['case:clerical:instrumentBatch']">批量生成多人多案文书
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-download" size="mini" @click="batchBookTwoAll"
                        v-hasPermi="['case:clerical:mumc:instrumentBatchAll']">全选生成多人多案文书
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>

            <el-table v-loading="loading" max-height="550" :data="caseList" @sort-change="handleSortChange" ref="multiTable" :row-key="getRowKeys"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="案件分配时间" prop="distributionTime" fixed="left" width="130"
                    sortable="custom" :sort-orders="['descending', 'ascending']">
                    <template slot-scope="scope" v-if="scope.row.distributionTime">
                        <span>{{
              parseTime(scope.row.distributionTime, "{y}-{m}-{d}")
            }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" prop="respondentName" :show-overflow-tooltip="true" fixed="left"
                    width="80" />
                <el-table-column label="订单号" prop="id" :show-overflow-tooltip="true" width="170" />
                <el-table-column label="合同号" prop="orderNo" :show-overflow-tooltip="true" width="120" />
                <el-table-column label="手机号" prop="respondentPhone" width="120" />
                <el-table-column label="合同金额" sortable="custom" :sort-orders="['descending', 'ascending']" prop="contractAmount" width="120" />
                <el-table-column label="剩余期数" prop="remainTerms" width="120" />
                <el-table-column label="剩余待还本金" prop="overdueCapital" width="120" />
                <el-table-column label="剩余待还总额" prop="remainingBalance" width="160">
                </el-table-column>
                <el-table-column label="逾期年利率" prop="overYearRate" width="100" />
                <el-table-column label="调解员" prop="principalName" width="100">
                </el-table-column>
                <el-table-column label="委案状态" :formatter="getEntrustType" prop="entrustStatus">
                </el-table-column>
                <el-table-column label="操作" width="360" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" v-if="scope.row.entrustStatus != 3"
                            @click="handleUpdate(scope.row)" v-hasPermi="['case:clerical:query']">查看
                        </el-button>
                        <el-button size="mini" type="warning" @click="handleMediation(scope.row)"
                            v-hasPermi="['case:clerical:instrument']">生成调解文书
                        </el-button>
                        <el-button size="mini" type="success" @click="handleMessage(scope.row)"
                            v-hasPermi="['case:clerical:notice']">生成短信/邮件
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <mediationBook @refresh="clearSelection" :params="mediationBookData.params" :selection="mediationBookData.selection"
            :title="mediationBookData.title" :show.sync="mediationBookData.dialogVisible" :id="mediationBookData.id"
            :requestApi="mediationBookData.requestApi" :total="mediationBookData.total"></mediationBook>
        <message @refresh="clearSelection" :params="messageData.params" :title="messageData.title"
            :show.sync="messageData.dialogVisible" :requestApi="messageData.requestApi" :id="messageData.id"></message>
        <batchExportDialog @refresh="clearSelection" :title="batchexportDialogData.title"
            :show.sync="batchexportDialogData.dialogVisible" :red="batchexportDialogData.red"
            :params="batchexportDialogData.params" :total="batchexportDialogData.total"></batchExportDialog>
        <!--<divisionDialog @refresh="getList" :title="divisionData.title" :show.sync="divisionData.dialogVisible" :id="divisionData.id" :principal="divisionData.principal" :orgNo="divisionData.orgNo"></divisionDialog>-->
        <!--<recordDialog :title="recordData.title" :show.sync="recordData.dialogVisible" :id="recordData.id"></recordDialog>-->
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import templateApi from "@/api/case/document/templateIndex";
    import mediationBook from "./mediationBook";
    import message from "./caseMessage";
    import batchExportDialog from "./batchExportDialog";
    import divisionApi from "@/api/case/division/index";

    export default {
        name: "caseList",
        components: {
            SearchBar,
            mediationBook,
            message,
            batchExportDialog
        },
        data() {
            return {
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
                repayStatus: [],
                // 查询参数
                searchParams: {},
                queryParams: {
                    id: "",
                    batchNo: "",
                    pageNum: 1,
                    pageSize: 50,
                    principal: "",
                    mediator: "",
                    respondentName: "",
                    respondentPhone: "",
                    respondentIdNo: "",
                    orderNo: "",
                    caseStatuss: [],
                    orderByColumn: "",
                    isAsc: "",
                },
                entrustType: [],
                statusOptions: [],
                recordData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                selection: [],
                mediationBookData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                    requestApi: "",
                    params: "",
                    selection: [],
                    total: ""
                },
                messageData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                    requestApi: "",
                    params: "",
                },
                userList: [],
                getRowKeys(row) {
                    return row.id;
                },
                batchexportDialogData: {
                    title: "",
                    dialogVisible: false,
                    red: "",
                    params: "",
                    total: ""
                },
            };
        },
        created() {
            this.getList(1);
            this.getUsers();
            //案件状态
            this.getDicts("case_status").then((response) => {
                this.statusOptions = response.data;
            });
            //委案状态
            this.getDicts("entrust_status").then((response) => {
                this.entrustType = response.data;
            });
            //还款状态
            this.getDicts("repay_status").then((response) => {
                this.repayStatus = response.data;
            });
        },
        // 是否显示过滤栏， 扣除页数，每页显示数，总数量参数，3个内的搜索参数，直接显示一行，不显示过滤
        computed: {
            hasFilter: {
                get() {
                    return true;
                },
            },
        },
        methods: {
            /** 查询角色列表 */
            getList(type) {
                this.loading = true;
                //查询
                if (type == 1) {
                    this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    templateApi.caseList(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearSelection();
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
                //切换页
                else if (type == 2) {
                    templateApi.caseList(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
            },
            /** 排序触发事件 */
            handleSortChange(column, prop, order) {
                if(column.order){
                    this.searchParams.orderByColumn = column.prop;
                    this.searchParams.isAsc = column.order;
                    this.getList(2);
                }else{
                    this.searchParams.orderByColumn = '';
                    this.searchParams.isAsc = '';
                    this.getList(2);
                }
            },
            //委案状态
            getEntrustType(row, column) {
                return this.selectDictLabel(this.entrustType, row.entrustStatus);
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList(1);
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.selection = selection;
                this.ids = selection.map((item) => item.id);
                this.single = selection.length != 1;
                this.multiple = !selection.length;
            },
            handleUpdate(item) {
                if (['1','2','3','4','5','6'].includes(item.caseStatus)) {
                    this.$router.push({
                        name: 'cutBeforeInfo',
                        query: {
                            beforeId: item.id
                        }
                    })
                } else if (['7','8','9','10','11','12'].includes(item.caseStatus)) {
                    this.$router.push({
                        name: 'cutAfterInfo',
                        query: {
                            afterId: item.id
                        }
                    })
                }
            },
            handleMediation(item) {
                this.mediationBookData.title = "生成调解文书";
                this.mediationBookData.dialogVisible = true;
                this.mediationBookData.id = item.id;
                this.mediationBookData.requestApi = "/case/caseInfo/instrument";
                this.mediationBookData.params = "";
            },
            batchBook() {
                this.mediationBookData.title = "批量生成调解文书";
                this.mediationBookData.dialogVisible = true;
                this.mediationBookData.requestApi = "/case/caseInfo/instrument/batch";
                this.mediationBookData.params = this.ids.join(",");
                this.mediationBookData.id = "";
            },
            batchBookAll() {
                this.mediationBookData.title = "全选生成调解文书";
                this.mediationBookData.dialogVisible = true;
                this.mediationBookData.total = this.total;
                this.mediationBookData.requestApi = "/case/caseInfo/instrument/batchAll";
                this.mediationBookData.id = "";
            },
            batchBookTwo() {
                this.mediationBookData.title = "批量生成多人多案文书";
                this.mediationBookData.selection = this.selection;
                this.mediationBookData.dialogVisible = true;
                this.mediationBookData.requestApi = "/case/caseInfo/mumc/instrument/batch";
                this.mediationBookData.params = this.ids.join(",");
                this.mediationBookData.id = "";
            },
            batchBookTwoAll() {
                this.mediationBookData.title = "全选生成多人多案文书";
                this.mediationBookData.selection = this.selection;
                this.mediationBookData.dialogVisible = true;
                this.mediationBookData.total = this.total;
                this.mediationBookData.requestApi = "/case/caseInfo/mumc/instrument/batchAll";
                this.mediationBookData.params = this.ids.join(",");
                this.mediationBookData.id = "";
            },
            changeStatus() {
                this.getList(1);
            },
            //打开发送短信的弹窗
            handleCaseStatusMessage(type) {
                if (this.selection.filter((item) => item.caseStatus == 13).length > 0) {
                    this.msgError("所选数据存在已结案的数据，不能批量发送短信");
                    return;
                }
                if(type == 1){
                    this.batchexportDialogData.title = "批量短信发送(旧)";
                }else{
                    this.batchexportDialogData.title = "批量短信发送";
                }
                this.batchexportDialogData.dialogVisible = true;
                this.batchexportDialogData.red = false;
                this.batchexportDialogData.params = this.ids.join(",");
            },
            //打开发送短信的弹窗
            handleCaseStatusMessageAll() {
                this.batchexportDialogData.title = "全选短信发送";
                this.batchexportDialogData.dialogVisible = true;
                this.batchexportDialogData.total = this.total;
                this.batchexportDialogData.red = false;
            },
            handleMessage(item) {
                this.messageData.title = "生成短信/邮件";
                this.messageData.dialogVisible = true;
                this.messageData.requestApi = "/case/caseInfo/notice";
                this.messageData.id = item.id;
                this.messageData.params = "";
            },
            batchMessage() {
                this.messageData.title = "批量生成短信/邮件";
                this.messageData.dialogVisible = true;
                this.messageData.requestApi = "/case/caseInfo/notice/batch";
                this.messageData.params = this.ids.join(",");
                this.messageData.id = "";
            },
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.ids = [];
                    this.selection = [];
                }
            },
            //获取调解员
            getUsers() {
                divisionApi.userList().then((response) => {
                    this.userList = response.data.userList || [];
                    // for (var i = 0; i < this.userList.length; i++) {
                    //     this.userList[i].parentId = this.userList[i].deptId
                    //     delete this.userList[i].deptId
                    // }
                });
            },
            resetAll() {},
        },
    };

</script>
<style lang="scss">
    .custom-radio {
        padding-top: 10px;
        display: flex !important;

        .el-form-item__label {
            width: 100px;
            text-align: left;
            line-height: 20px;
            align-items: flex-start;
        }

        .el-radio {
            /*width: 20%;*/
            margin-right: 10px;
            margin-bottom: 20px;
        }
    }

</style>
