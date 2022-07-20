<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="还款登记提交时间：">
                    <el-date-picker size="small" v-model="chooseDaterange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="案件批次号：" prop="batchNo">
                    <el-input v-model="queryParams.batchNo" placeholder="请输入案件批次号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="身份证：">
                    <el-input v-model="queryParams.respondentIdNo" placeholder="请输入身份证，多个身份证用英文逗号连接" clearable
                        type="textarea" size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="queryParams.respondentName" placeholder="请输入姓名，多个姓名用英文逗号连接" clearable
                        type="textarea" size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input v-model="queryParams.caseId" placeholder="请输入订单号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="借款平台名称：">
                    <el-input v-model="queryParams.platform" placeholder="请输入借款平台名称" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
            </template>
            <template #filter>
                <el-form-item label="审核状态：" class="custom-radio">
                    <el-checkbox-group v-model="queryParams.state" @change="changeStatus">
                        <el-checkbox v-for="item in auditStatus" :key="item.dictValue" :label="item.dictValue">
                            {{item.dictLabel}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </template>
            <template #buttonArea>

            </template>
        </search-bar>
        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>
            <el-table v-loading="loading" max-height="550" :data="caseList" @sort-change="handleSortChange"
                ref="multiTable" :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column label="还款提交时间" sortable="custom" :sort-orders="['descending', 'ascending']"
                    prop="createTime" width="170" :show-overflow-tooltip="true" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="姓名" width="80" prop="respondentName" :show-overflow-tooltip="true"
                    fixed="left" />
                <el-table-column label="身份证号" width="180" prop="respondentIdNo" :show-overflow-tooltip="true"
                    sortable="custom" :sort-orders="['descending', 'ascending']" />
                <el-table-column label="手机号" width="120" prop="respondentPhone" />
                <el-table-column label="审核状态" width="150" :show-overflow-tooltip="true" :formatter="stateStatusFormat" prop="state">
                </el-table-column>
                <el-table-column label="还款ID" prop="id" width="60" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="汇款金额" width="150" prop="amount" />
                <el-table-column label="备注" width="150" prop="remarks" :show-overflow-tooltip="true"/>
                <el-table-column label="借款平台" width="150" prop="platform" />
                <el-table-column label="订单号" prop="caseId" width="170" :show-overflow-tooltip="true" />
                <el-table-column label="案件状态" width="150" :show-overflow-tooltip="true" :formatter="statusFormat"
                    prop="caseStatus">
                </el-table-column>
                <el-table-column label="委案状态" :formatter="getEntrustType" prop="entrustStatus" />
                <el-table-column label="调解员" prop="mediator" />
                <el-table-column label="操作" width="300" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" v-if="scope.row.state.indexOf('1')>-1 == true" @click="apply(scope.row)"
                            v-hasPermi="['wechat:repay:audit']">审核
                        </el-button>
                        <el-button size="mini" type="warning" v-if="scope.row.entrustStatus != 3"
                            @click="handleUpdate(scope.row)">案件详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <erweima :title="erweimaData.title" :url="erweimaData.url" :show.sync="erweimaData.dialogVisible">
        </erweima>
        <applyAudit @refresh="clearSelection" :title="applyData.title" :show.sync="applyData.dialogVisible"
            :id="applyData.id" :item="applyData.item"></applyAudit>
    </div>
</template>

<script>
    import SearchBar from '@/components/SearchBar/index'
    import officialApi from "@/api/case/officialAccount/index";
    import applyAudit from './applyAudit'
    import erweima from '../components/erweima'

    export default {
        name: "list",
        components: {
            SearchBar,
            erweima,
            applyAudit,
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
                    caseId: '',
                    id: '',
                    batchNo: '',
                    pageNum: 1,
                    pageSize: 50,
                    respondentName: '',
                    respondentPhone: '',
                    respondentIdNo: '',
                    orderNo: '',
                    repayType: '',
                    repayStatus: '',
                    remittanceTime: '',
                    caseType: '',
                    caseStatuss: [],
                    state: [],
                    orderByColumn: "",
                    isAsc: "",
                },
                statusOptions: [], //案件状态
                remittanceTypes: [], //汇款类型
                payChannalOptions: [], //回款类型
                paymentStatus: [], //还款状态
                auditStatus: [], //审核状态
                caseTypes: [], //案件类型
                otherParam: {},
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
                getRowKeys(row) {
                    return row.id;
                },
                chooseDaterange2: [],
            }
        },
        created() {
            //案件状态
            this.getDicts("case_status").then((response) => {
                this.statusOptions = response.data;
            });
            //还款状态
            this.getDicts("repay_status").then((response) => {
                this.paymentStatus = response.data;
            });
            //审核状态
            this.getDicts("wechat_case_status").then((response) => {
                this.auditStatus = response.data;
            });
            //委案状态
            this.getDicts("entrust_status").then((response) => {
                this.entrustType = response.data;
            });
            this.getList(1);
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
                if (type == 1) {
                    this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    officialApi.repayList(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearTable();
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }).catch(() => {
                        this.loading = false;
                        this.caseList = [];
                        this.total = 0;
                    });
                }
                //切换页
                else if (type == 2) {
                    officialApi.repayList(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }).catch(() => {
                        this.loading = false;
                        this.caseList = [];
                        this.total = 0;
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
            clearSelection() {},
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.selection = selection;
                this.ids = selection.map((item) => item.id);
                this.single = selection.length != 1;
                this.multiple = !selection.length;
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList(1);
            },
            changeStatus() {
                this.getList(1);
            },
            // 案件状态
            statusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.caseStatus);
            },
            //审核状态
            stateStatusFormat(row, column) {
                return this.selectDictLabel(this.auditStatus, row.state);
            },
            //委案状态
            getEntrustType(row, column) {
                return this.selectDictLabel(this.entrustType, row.entrustStatus);
            },
            //申请案件信修
            apply(item) {
                this.applyData.title = '审核申请';
                this.applyData.dialogVisible = true;
                this.applyData.id = item.id;
                this.applyData.item = JSON.stringify(item)
            },
            //查看二维码
            seeErweima(item) {
                this.erweimaData.title = '汇款凭证';
                this.erweimaData.url = item.remitEvidencePath;
                // 控制弹窗组件显示
                this.erweimaData.dialogVisible = true
            },
            resetAll() {
                this.chooseDaterange = [];
            },
            handleChange(value) {
                if (value == null) {
                    this.queryParams.beginTime = ''
                    this.queryParams.endTime = ''
                } else {
                    this.queryParams.beginTime = value[0];
                    this.queryParams.endTime = value[1];
                }
            },
            handleUpdate(item) {
                if (item.caseStatus < 7) {
                    this.$router.push({
                        name: "pretrialMediationInfo",
                        query: {
                            pretrialId: item.caseId
                        }
                    });
                } else if (item.caseStatus >= 7) {
                    this.$router.push({
                        name: "civilActionInfo",
                        query: {
                            civilActionId: item.caseId
                        }
                    });
                }
            },
        }
    };

</script>
<style lang="scss" scoped>
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
