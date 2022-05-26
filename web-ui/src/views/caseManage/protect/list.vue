<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="案件批次号：">
                    <el-input v-model="queryParams.batchNo" placeholder="请输入案件批次号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input v-model="queryParams.cid" placeholder="请输入订单号" clearable size="small" style="width: 240px"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="调解员：">
                    <el-select clearable multiple collapse-tags filterable size="small" v-model="queryParams.principals"
                        placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="财保批次号：">
                    <el-input v-model="queryParams.proBatchNo" placeholder="请输入财保批次号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="财保类型：">
                    <el-select clearable filterable size="small" v-model="queryParams.proType"
                        placeholder="请选择">
                        <el-option v-for="item in proType" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="财保申请时间：">
                    <el-date-picker size="small" v-model="chooseDaterange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="财保冻结时间：">
                    <el-date-picker size="small" v-model="frozenDate" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleFrozenChange"
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
                <el-form-item label="财保案号：">
                    <el-input v-model="queryParams.propertyProNo" placeholder="请输入财保案号，多个财保案号用英文逗号连接" clearable
                        type="textarea" size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="queryParams.remark" placeholder="请输入备注查询内容" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
            </template>
            <template #filter>
                <el-form-item label="案件状态：" class="custom-radio">
                    <el-checkbox-group v-model="queryParams.caseStatuss" @change="changeStatus">
                        <el-checkbox v-for="item in statusOptions" :label="item.dictValue" :key="item.dictValue">
                            {{ item.dictLabel }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="财保状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.status" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in protects" :key="item.dictValue" :label="item.dictValue">
                            {{ item.dictLabel }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </template>
            <template #buttonArea> </template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="danger" icon="el-icon-download" size="mini" :disabled="multiple"
                        @click="handleExport" v-hasPermi="['case:property:export']">导出
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" size="mini" :disabled="multiple" @click="handleAdd"
                        v-hasPermi="['case:property:batchPass']">批量审核通过
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" size="mini" :disabled="multiple" @click="applyBatch('批量财保审核驳回')"
                        v-hasPermi="['case:property:batchReject']">批量审核驳回
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" size="mini" :disabled="multiple" @click="handleAppleEdit('批量解冻')"
                        v-hasPermi="['case:property:batchUnfreeze']">批量解冻
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>
            <el-table v-loading="loading" max-height="550" :data="caseList" @sort-change="handleSortChange"
                ref="multiTable" :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="财保状态" :formatter="statusFormat" prop="status" width="120" fixed="left" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="财保批次号" prop="proBatchNo" width="110" :show-overflow-tooltip="true"
                    fixed="left" />
                <el-table-column label="姓名" width="100" prop="respondentName" fixed="left" />
                <el-table-column label="身份证号" width="180" prop="respondentIdNo" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="标的金额" width="120" prop="subjectAmount" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="性别" prop="respondentSex" />
                <el-table-column label="民族" prop="respondentNation" />
                <el-table-column label="出生日期" width="120" prop="respondentBirthday" />
                <el-table-column label="手机号" width="120" prop="respondentPhone" />
                <el-table-column label="户籍地址" width="180" prop="respondentAddress" :show-overflow-tooltip="true" />
                <el-table-column label="合同地址" width="200" :show-overflow-tooltip="true" prop="respondentAliveAddress" />
                <el-table-column label="逾期年利率" prop="overYearRate" width="100" />
                <el-table-column label="放款日期" width="120" prop="loanDate" />
                <el-table-column label="财保申请时间" width="180" prop="createTime" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="财保案号" width="100" prop="propertyProNo" />
                <el-table-column label="财保冻结时间" width="150" prop="frozenStartTime" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="首次冻结金额" width="120" prop="frozenAmount" />
                <el-table-column label="车辆情况" width="80" prop="vehicle" />
                <el-table-column label="房屋情况" width="80" prop="house" :formatter="houseFormat" />
                <el-table-column label="财保类型" :formatter="proTypeFormat" prop="proType" width="120" />
                <el-table-column label="财保保险单号" width="180" prop="proInsureNo" :show-overflow-tooltip="true" />
                <el-table-column label="财保保险公司名称" width="180" prop="proInsureCo" :show-overflow-tooltip="true" />
                <el-table-column label="财保申请费" width="100" prop="proApplyFee" />
                <el-table-column label="调解员" width="80" prop="principalName" />
                <el-table-column label="订单号" width="180" prop="cid" :show-overflow-tooltip="true" />
                <el-table-column label="案件状态" width="120" :formatter="caseStatusFormat" prop="caseStatus" />
                <el-table-column label="案件分配时间" prop="distributionTime" width="130" sortable="custom"
                    :sort-orders="['descending', 'ascending']">
                    <template slot-scope="scope" v-if="scope.row.distributionTime">
                        <span>{{
                            parseTime(scope.row.distributionTime, "{y}-{m}-{d}")
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="审批意见" width="200" prop="options" :show-overflow-tooltip="true" />
                <el-table-column label="操作" width="220" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" v-if="scope.row.status == 1"
                            @click="apply(scope.row,'财保申请审核')" v-hasPermi="['case:property:review']">审核
                        </el-button>
                        <el-button size="mini" type="success" v-if="scope.row.status == 2"
                            @click="apply(scope.row,'财保申请修改')" v-hasPermi="['case:property:edit']">修改</el-button>
                        <el-button size="mini" type="danger" v-if="scope.row.status == 2"
                            @click="handleExamine(scope.row)" v-hasPermi="['case:property:unReview']">反审
                        </el-button>
                        <el-button size="mini" type="warning" v-if="scope.row.status == 2"
                            @click="handleAppleEdit(scope.row)" v-hasPermi="['case:property:unfreeze']">解冻
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <applyAudit @refresh="getList(1)" :title="applyData.title" :show.sync="applyData.dialogVisible"
            :id="applyData.id" :cid="applyData.cid" :item="applyData.item"></applyAudit>
        <applyAuditBatch @refresh="getList(1)" :title="batchData.title" :show.sync="batchData.dialogVisible"
            :ids="batchData.ids"></applyAuditBatch>
        <exportDialog @refresh="clearSelection" :title="exportData.title" :show.sync="exportData.dialogVisible"
            :ids="exportData.ids" :requestApi="exportData.requestApi" :total="exportData.total"></exportDialog>
        <importDialog @refresh="clearSelection" :title="addData.title" :headline="addData.headline"
            :show.sync="addData.dialogVisible" :id="addData.id" :importData="addData.importData"></importDialog>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import divisionApi from "@/api/case/division/index";
    import protectApi from "@/api/case/protect/index";
    import applyAudit from "./applyAudit";
    import exportDialog from "../components/exportDialog";
    import applyAuditBatch from "./applyAuditBatch";
    import importDialog from "./importDialog";

    export default {
        name: "list",
        components: {
            SearchBar,
            applyAudit,
            applyAuditBatch,
            exportDialog,
            importDialog
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
                searchParams: {},
                queryParams: {
                    cid: "",
                    batchNo: "",
                    pageNum: 1,
                    pageSize: 50,
                    respondentName: "",
                    respondentPhone: "",
                    respondentIdNo: "",
                    propertyProNo: "",
                    principal: "",
                    caseStatuss: [],
                    status: "",
                    orderByColumn: "",
                    isAsc: "",
                },
                statusOptions: [], //案件状态
                protects: [], //案件类型
                addData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                batchData: {
                    title: "",
                    dialogVisible: false,
                    ids: [],
                },
                applyData: {
                    title: "",
                    dialogVisible: false,
                    id: 0,
                    cid: '',
                },
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    requestApi: "",
                },
                addData: {
                    title: "",
                    headline: "",
                    dialogVisible: false,
                    id: null,
                    importData: [],
                },
                selection: [],
                chooseDaterange: [],
                frozenDate: [],
                userList: [],
                house: [],
                proType: [],
                getRowKeys(row) {
                    return row.id;
                },
            };
        },
        created() {
            this.getList(1);
            this.getUsers();
            //财保状态
            this.getDicts("wealth_protect").then((response) => {
                this.protects = response.data;
                this.protects.shift();
            });
            //财保类型
            this.getDicts("pro_type").then((response) => {
                this.proType = response.data;
            });
            //车房类型
            this.getDicts("yes_no").then((response) => {
                this.house = response.data;
            });
            //案件状态
            this.getDicts("case_status").then((response) => {
                this.statusOptions = response.data;
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
                    protectApi.propertylist(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearSelection();
                        this.clearTable();
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }).catch(() => {
                        this.caseList = [];
                        this.total = 0;
                        this.loading = false;
                    });
                }
                //切换页
                else if (type == 2) {
                    protectApi.propertylist(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }).catch(() => {
                        this.caseList = [];
                        this.total = 0;
                        this.loading = false;
                    });
                }
            },
            /** 排序触发事件 */
            handleSortChange(column, prop, order) {
                if (column.order) {
                    this.searchParams.orderByColumn = column.prop;
                    this.searchParams.isAsc = column.order;
                    this.getList(2);
                } else {
                    this.searchParams.orderByColumn = '';
                    this.searchParams.isAsc = '';
                    this.getList(2);
                }
            },
            clearTable() {
                this.$refs.multiTable.clearSort();
            },
            /** 导出按钮操作 */
            handleExport() {
                this.exportData.ids = this.ids.toString()
                this.exportData.title = "案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.requestApi = "/case/property/export";
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList(1);
            },
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.ids = [];
                    this.selection = [];
                }
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.selection = selection;
                this.ids = selection.map((item) => item.id);
                this.addData.importData = selection.map(item => {
                    return {
                        respondentName: item.respondentName,
                        id: item.id,
                    }
                });
                this.single = selection.length != 1;
                this.multiple = !selection.length;
            },
            changeStatus() {
                this.getList(1);
            },
            //财保状态
            statusFormat(row, column) {
                return this.selectDictLabel(this.protects, row.status);
            },
            //财保类型
            proTypeFormat(row, column) {
                return this.selectDictLabel(this.proType, row.status);
            },
            // 案件状态
            caseStatusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.caseStatus);
            },
            // 房屋状态
            houseFormat(row, column) {
                return this.selectDictLabel(this.house, row.house);
            },
            //申请审核
            apply(item, title) {
                this.applyData.title = title;
                this.applyData.dialogVisible = true;
                this.applyData.id = item.id;
                this.applyData.cid = item.cid;
            },
            //批量财保审核拒绝
            applyBatch(title) {
                this.batchData.title = title;
                this.batchData.dialogVisible = true;
                this.batchData.ids = this.ids;
            },
            /** 批量统一弹窗 */
            handleAdd() {
                this.addData.headline = "待审核变更为冻结中";
                this.addData.title = "批量财保审核通过";
                this.addData.dialogVisible = true;
            },
            resetAll() {
                this.chooseDaterange = [];
                this.frozenDate = [];
            },
            handleChange(value) {
                if (value == null) {
                    this.queryParams.beginTime = "";
                    this.queryParams.endTime = "";
                } else {
                    this.queryParams.beginTime = value[0];
                    this.queryParams.endTime = value[1];
                }
            },
            handleFrozenChange(value) {
                if (value == null) {
                    this.queryParams.frozenStartDate = "";
                    this.queryParams.frozenEndDate = "";
                } else {
                    this.queryParams.frozenStartDate = value[0];
                    this.queryParams.frozenEndDate = value[1];
                }
            },
            //获取调解员
            getUsers() {
                divisionApi.userList().then((response) => {
                    this.userList = response.data.userList || [];
                });
            },
            //申请冻结结束,批量申请冻结结束
            handleAppleEdit(val) {
                var that = this;
                this.$confirm(`是否申请解除冻结?`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        if (val == '批量解冻') {
                            let data = {
                                ids: this.ids,
                            };
                            protectApi.editUnReview(data).then((res) => {
                                if (res.code === 200) {
                                    that.msgSuccess("操作成功");
                                    that.clearSelection();
                                }
                            });
                        } else {
                            let param = {
                                id: val.id,
                            };
                            protectApi.property(param).then((res) => {
                                if (res.code === 200) {
                                    that.msgSuccess("操作成功");
                                    that.clearSelection();
                                }
                            });
                        }
                    })
                    .catch(() => {
                        that.msgInfo("已取消操作");
                    });
            },
            //反审
            handleExamine(val) {
                var that = this;
                this.$confirm(`是否将冻结中的案件撤回为"待审核"状态?`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        let data = {
                            id: val.id,
                        };
                        protectApi.unReviewProperty(data).then((res) => {
                            if (res.code === 200) {
                                that.msgSuccess("操作成功");
                                that.clearSelection();
                            }
                        });
                    })
                    .catch(() => {
                        that.msgInfo("已取消操作");
                    });
            },
        },
    };

</script>
<style lang="scss">
    .custom-radio {
        padding-top: 10px;
        display: flex !important;

        .el-form-item__label {
            width: 120px;
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
