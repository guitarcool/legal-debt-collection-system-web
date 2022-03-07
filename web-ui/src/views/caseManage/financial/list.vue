<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="案件批次号：" prop="batchNo">
                    <el-input v-model="queryParams.batchNo" placeholder="请输入案件批次号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input v-model="queryParams.caseId" placeholder="请输入订单号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="还款提交人：">
                    <el-select clearable size="small" v-model="queryParams.createId" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="汇款时间：">
                    <!--<el-date-picker-->
                    <!--v-model="queryParams.remittanceTime"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期"-->
                    <!--format="yyyy-MM-dd"-->
                    <!--value-format="yyyy-MM-dd">-->
                    <!--</el-date-picker>-->
                    <el-date-picker size="small" v-model="chooseDaterange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="queryParams.respondentName" placeholder="请输入姓名" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="queryParams.respondentPhone" placeholder="请输入手机号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="身份证号：">
                    <el-input v-model="queryParams.respondentIdNo" placeholder="请输入身份证号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>

                <el-form-item label="合同号：">
                    <el-input v-model="queryParams.orderNo" placeholder="请输入合同号，多个合同号用英文逗号连接" clearable type="textarea"
                        size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="账龄（M）：">
                    <el-input size="small" clearable style="width:100px" v-model="queryParams.overdueStartAge" />~
                    <el-input size="small" clearable style="width:100px" v-model="queryParams.overdueEndAge" />
                </el-form-item>
            </template>
            <template #filter>
                <el-form-item label="案件类型：" class="custom-radio">
                    <el-radio-group v-model="queryParams.caseType" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in caseTypes" :key="item.dictValue" :label="item.dictValue">
                            {{item.dictLabel}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="汇款类型：" class="custom-radio">
                    <el-radio-group v-model="queryParams.repayType" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in remittanceTypes" :key="item.dictValue" :label="item.dictValue">
                            {{item.dictLabel}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="还款状态：" class="custom-radio">
                    <!--paymentStatus-->
                    <el-radio-group v-model="queryParams.repayStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in paymentStatus" :key="item.dictValue" :label="item.dictValue">
                            {{item.dictLabel}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审核状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.reviewStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in auditStatus" :key="item.dictValue" :label="item.dictValue">
                            {{item.dictLabel}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </template>
            <template #buttonArea>
            </template>
        </search-bar>
        <div class="queryDiv">
            查询结果统计：<span>列表案件量：{{otherParam.caseTotalCount?otherParam.caseTotalCount:''}}件；</span><span>列表标的金额：{{otherParam.subjectTotalAmount?otherParam.subjectTotalAmount:''}}元；</span><span>列表剩余待还总额：{{otherParam.totalRemainingBalance?otherParam.totalRemainingBalance:''}}元；</span>
        </div>
        <div class="box-contnet-wrap" style="margin-top:0">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="warning" size="mini" @click="handleExport" :disabled="multiple"
                        icon="el-icon-download" v-hasPermi="['case:financial:export']">导出
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" size="mini" @click="handleAdd" v-hasPermi="['case:financial:import']">
                        批量导入还款信息
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(1)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="caseList" ref="multiTable" :row-key="getRowKeys"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="还款ID" prop="id" width="60" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="案件分配时间" prop="distributionTime" fixed="left" width="120"
                    :render-header="renderDisTime">
                    <template slot-scope="scope" v-if="scope.row.distributionTime">
                        <span>{{
                    parseTime(scope.row.distributionTime, "{y}-{m}-{d}")
                    }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" width="80" prop="respondentName" :show-overflow-tooltip="true"
                    fixed="left" />
                <el-table-column label="案件状态" width="150" :show-overflow-tooltip="true" :formatter="statusFormat"
                    prop="caseStatus">
                </el-table-column>
                <el-table-column label="订单号" prop="caseId" width="170" :show-overflow-tooltip="true" />
                <el-table-column label="合同号" width="150" prop="orderNo" :show-overflow-tooltip="true" />
                <el-table-column label="手机号" width="150" prop="respondentPhone" />
                <el-table-column label="案件类型" width="150" :show-overflow-tooltip="true" :formatter="caseTypeFormat"
                    prop="caseType">
                </el-table-column>
                <el-table-column label="账龄" prop="overdueAge" />
                <el-table-column label="标的金额" width="150" :render-header="rendersubjectAmount" prop="subjectAmount" />
                <el-table-column label="已还金额" width="150" :render-header="renderpaidAmount" prop="paidAmount" />
                <el-table-column label="剩余待还总额" width="150" :render-header="renderremainingBalance"
                    prop="remainingBalance" />
                <el-table-column label="还款类型" width="150" prop="type">
                    <template slot-scope="scope">
                        <span>{{scope.row.type== 1?'结清':'部分还款'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="还款状态" width="150" :show-overflow-tooltip="true" :formatter="repayStatusFormat"
                    prop="repayStatus">
                </el-table-column>
                <el-table-column label="汇款账户" width="150" prop="accountNo" />
                <el-table-column label="汇款金额" width="150" prop="amount" />
                <el-table-column label="收款类型" width="150" :show-overflow-tooltip="true" :formatter="repayTypeFormat"
                    prop="repayType">
                </el-table-column>
                <el-table-column label="收款账户" width="150" prop="accountNoShou" />
                <el-table-column label="收款账户名" width="150" prop="accountName" />
                <el-table-column label="开户行名称" width="150" prop="openbankName" />
                <el-table-column label="回款渠道" width="150" :show-overflow-tooltip="true" :formatter="payChannalFormat"
                    prop="payChannal">
                </el-table-column>
                <el-table-column label="逾期年利率" prop="overYearRate" width="100" />
                <el-table-column label="汇款时间" width="150" :render-header="renderremittanceTime" prop="remittanceTime">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.remittanceTime,'{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="交易流水号" width="150" prop="serialNo" />
                <el-table-column label="审核状态" :formatter="reviewStatusFormat" prop="reviewStatus"></el-table-column>
                <el-table-column label="提交人" prop="createName" />
                <el-table-column label="审核人" prop="reviewName" />
                <el-table-column label="委案状态" :formatter="getEntrustType" prop="entrustStatus">
                </el-table-column>
                <el-table-column label="操作" width="250" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" @click="seeErweima(scope.row)">汇款凭证
                        </el-button>
                        <el-button size="mini" type="primary" v-if="scope.row.reviewStatus == 0"
                            @click="apply(scope.row)" v-hasPermi="['case:financial:review']">审核
                        </el-button>
                        <el-button size="mini" type="warning" v-if="scope.row.entrustStatus != 3"
                            @click="handleUpdate(scope.row)" v-hasPermi="['case:pretrial:query']">查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>

        <importDialog @refresh="getList(1)" :title="addData.title" :show.sync="addData.dialogVisible" :id="addData.id">
        </importDialog>
        <erweima :title="erweimaData.title" :url="erweimaData.url" :show.sync="erweimaData.dialogVisible">
        </erweima>
        <applyAudit @refresh="getList(1)" :title="applyData.title" :show.sync="applyData.dialogVisible" :id="applyData.id"
            :item="applyData.item"></applyAudit>
        <exportDialog  @refresh="getList(1)" :title="exportData.title" :show.sync="exportData.dialogVisible"
            :ids="exportData.ids" :requestApi="exportData.requestApi"></exportDialog>
    </div>
</template>

<script>
    import SearchBar from '@/components/SearchBar/index'
    import financeApi from "@/api/case/finance/index";
    import importDialog from './importDialog'
    import applyAudit from './applyAudit'
    import erweima from '../components/erweima'
    import divisionApi from "@/api/case/division/index";
    import exportDialog from "../components/exportDialog";


    export default {
        name: "list",
        components: {
            SearchBar,
            importDialog,
            erweima,
            applyAudit,
            exportDialog
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
                // 查询参数
                searchParams:{},
                queryParams: {
                    caseId: '',
                    id: '',
                    batchNo: '',
                    pageNum: 1,
                    pageSize: 10,
                    respondentName: '',
                    respondentPhone: '',
                    respondentIdNo: '',
                    orderNo: '',
                    repayType: '',
                    repayStatus: '',
                    postUserId: '',
                    remittanceTime: '',
                    caseType: '',
                    reviewStatus: '',
                    isAsc: "",
                },
                statusOptions: [], //案件状态
                remittanceTypes: [], //汇款类型
                payChannalOptions: [], //回款类型
                paymentStatus: [], //还款状态
                auditStatus: [], //审核状态
                caseTypes: [], //案件类型
                otherParam: {},
                addData: {
                    title: '',
                    dialogVisible: false,
                    id: ''
                },
                applyData: {
                    title: '',
                    dialogVisible: false,
                    id: -999,
                    item: ''
                },
                selection: [],
                erweimaData: {
                    dialogVisible: false,
                    title: '',
                    url: '',
                    item: ''
                },
                chooseDaterange: [],
                userList: [],
                entrustType: [],
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    requestApi: "",
                },
                getRowKeys(row) {
                    return row.id;
                },
            }
        },
        created() {
            this.getList(1);
            this.handleSubmitter();
            //案件类型
            this.getDicts("case_type").then((response) => {
                this.caseTypes = response.data;
            });
            //案件状态
            this.getDicts("case_status").then((response) => {
                this.statusOptions = response.data;
            });
            //汇款类型
            this.getDicts("remittance_status").then((response) => {
                this.remittanceTypes = response.data;
            });
            //还款状态
            this.getDicts("repay_status").then((response) => {
                this.paymentStatus = response.data;
            });
            //审核状态
            this.getDicts("audit_status").then((response) => {
                this.auditStatus = response.data;
            });
            //回款状态
            this.getDicts("payChannal_options").then((response) => {
                this.payChannalOptions = response.data;
            });
            //委案状态
            this.getDicts("entrust_status").then((response) => {
                this.entrustType = response.data;
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
            getList(type) {
                this.loading = true;
                //查询
                if(type == 1){
		            this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    financeApi.list(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearSelection();
                        this.ids = [];
                        this.selection = [];
                        this.otherParam = response.otherParam || {};
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
                //切换页
                else if(type == 2){
                    financeApi.list(this.searchParams).then((response) => {
                        this.otherParam = response.otherParam || {};
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList(1);
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.selection = selection
                this.ids = selection.map(item => item.id)
                this.single = selection.length != 1
                this.multiple = !selection.length
            },
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection() //清除选中的数据
                }
            },
            /** 导出按钮操作 */
            handleExport() {
                this.exportData.ids = this.ids.toString()
                this.exportData.title = "案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.requestApi = "/case/financial/export";
            },
            changeStatus() {
                this.getList(1);
            },
            //案件类型
            caseTypeFormat(row, column) {
                return this.selectDictLabel(this.caseTypes, row.caseType);
            },
            // 案件状态
            statusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.caseStatus);
            },
            //还款状态
            repayStatusFormat(row, column) {
                return this.selectDictLabel(this.paymentStatus, row.repayStatus);
            },
            //还款类型
            repayTypeFormat(row, column) {
                return this.selectDictLabel(this.remittanceTypes, row.repayType);
            },
            //回款类型
            payChannalFormat(row, column) {
                return this.selectDictLabel(this.payChannalOptions, row.payChannal);
            },
            //审核状态
            reviewStatusFormat(row, column) {
                return this.selectDictLabel(this.auditStatus, row.reviewStatus);
            },
            //委案状态
            getEntrustType(row, column) {
                return this.selectDictLabel(this.entrustType, row.entrustStatus);
            },
            btnDisTime1() {
                this.queryParams.orderByColumn = "distributionTime asc";
                this.getList(1);
            },
            btnDisTime2() {
                this.queryParams.orderByColumn = "distributionTime desc";
                this.getList(1);
            },
            btnsubjectAmount1() {
                this.queryParams.orderByColumn = "subjectAmount asc";
                this.getList(1);
            },
            btnsubjectAmount2() {
                this.queryParams.orderByColumn = "subjectAmount desc";
                this.getList(1);
            },
            btnPaidAmount1() {
                this.queryParams.orderByColumn = "paidAmount asc";
                this.getList(1);
            },
            btnPaidAmount2() {
                this.queryParams.orderByColumn = "paidAmount desc";
                this.getList(1);
            },
            btnremainingBalance1() {
                this.queryParams.orderByColumn = "remainingBalance asc";
                this.getList(1);
            },
            btnremainingBalance2() {
                this.queryParams.orderByColumn = "remainingBalance desc";
                this.getList(1);
            },
            btnremittanceTime1() {
                this.queryParams.orderByColumn = "remittanceTime asc";
                this.getList(1);
            },
            btnremittanceTime2() {
                this.queryParams.orderByColumn = "remittanceTime desc";
                this.getList(1);
            },
            renderDisTime() {
                return (
                    <div style="display: flex;align-items: center;">
                    <span> 案件分配时间 </span>
                    <span class="sorting">
                        <i class="el-icon-caret-top" onClick={this.btnDisTime1}></i>
                        <i class="el-icon-caret-bottom" onClick={this.btnDisTime2}></i>
                    </span>
                    </div>
                );
            },
            rendersubjectAmount() {
                return (
                    <div style="display: flex;align-items: center;">
                    <span> 标的金额 </span>
                    <span class="sorting">
                        <i class="el-icon-caret-top" onClick={this.btnsubjectAmount1}></i>
                        <i class="el-icon-caret-bottom" onClick={this.btnsubjectAmount2}></i>
                    </span>
                    </div>
                );
            },
            renderpaidAmount() {
                return (
                    <div style="display: flex;align-items: center;">
                    <span> 已还金额 </span>
                    <span class="sorting">
                        <i class="el-icon-caret-top" onClick={this.btnPaidAmount1}></i>
                        <i class="el-icon-caret-bottom" onClick={this.btnPaidAmount2}></i>
                    </span>
                    </div>
                );
            },
            renderremainingBalance() {
                return (
                    <div style="display: flex;align-items: center;">
                    <span> 剩余待还总额 </span>
                    <span class="sorting">
                        <i class="el-icon-caret-top" onClick={this.btnremainingBalance1}></i>
                        <i class="el-icon-caret-bottom" onClick={this.btnremainingBalance2}></i>
                    </span>
                    </div>
                );
            },
            renderremittanceTime() {
                return (
                    <div style="display: flex;align-items: center;">
                    <span> 汇款时间 </span>
                    <span class="sorting">
                        <i class="el-icon-caret-top" onClick={this.btnremittanceTime1}></i>
                        <i class="el-icon-caret-bottom" onClick={this.btnremittanceTime2}></i>
                    </span>
                    </div>
                );
            },
            //申请案件信修
            apply(item) {
                this.applyData.title = '审核申请';
                this.applyData.dialogVisible = true;
                this.applyData.id = item.id;
                this.applyData.item = JSON.stringify(item)
            },
            /** 导入 */
            handleAdd() {
                this.addData.title = '导入还款信息';
                this.addData.dialogVisible = true
            },
            handleUpdate(item) {
                if (item.routerName == 'cUtBeforeInfo') {
                    this.$router.push({
                        name: 'cutBeforeInfo',
                        query: {
                            beforeId: item.caseId
                        }
                    })
                } else if (item.routerName == 'cUtAfterInfo') {
                    this.$router.push({
                        name: 'cutAfterInfo',
                        query: {
                            afterId: item.caseId
                        }
                    })
                }
            },
            //查看二维码
            seeErweima(item) {
                this.erweimaData.title = '汇款凭证';
                this.erweimaData.url = item.remitEvidencePath;
                // 控制弹窗组件显示
                this.erweimaData.dialogVisible = true
            },
            resetAll() {
                this.chooseDaterange = []
            },
            handleChange(value) {
                //console.log(value)
                if (value == null) {
                    this.queryParams.beginTime = ''
                    this.queryParams.endTime = ''
                } else {
                    this.queryParams.beginTime = value[0]
                    this.queryParams.endTime = value[1]
                }
            },
            //还款提交人
            handleSubmitter() {
                divisionApi.userList().then(
                    (response) => {
                        this.userList = response.data.userList || [];
                        // for (var i = 0; i < this.userList.length; i++) {
                        //     this.userList[i].parentId = this.userList[i].deptId
                        //     delete this.userList[i].deptId
                        // }
                    }
                );
                // financeApi.submitter().then(res => {
                //     //console.log(res)
                //     this.userList = res.data || []
                // })
            }
        }
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

    .queryDiv {
        height: 30px;
        padding: 5px 20px;
        background: #FCFFC9;

        span {
            margin-left: 15px;
        }
    }

</style>
