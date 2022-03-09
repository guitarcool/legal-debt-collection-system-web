<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" @submit="getList(1)"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="案件批次号：" prop="batchNo">
                    <el-input clearable v-model="queryParams.batchNo" placeholder="请输入案件批次号" size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="订单号：" prop="id">
                    <el-input clearable v-model="queryParams.id" placeholder="请输入订单号" size="small" style="width: 200px"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="内部订单号：" prop="loanId">
                    <el-input clearable v-model="queryParams.loanId" placeholder="请输入订单号" size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="姓名：" prop="respondentName">
                    <el-input clearable v-model="queryParams.respondentName" placeholder="请输入姓名" size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="身份证号：" prop="respondentIdNo">
                    <el-input clearable v-model="queryParams.respondentIdNo" placeholder="请输入身份证号" size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="资产受让方：" prop="assetAssignee">
                    <el-input clearable v-model="queryParams.assetAssignee" placeholder="请输入资产受让方" size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="案件导入时间：" prop="createTime">
                    <!--<el-date-picker-->
                    <!--v-model="queryParams.createTime"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期"-->
                    <!--size="small"-->
                    <!--format="yyyy-MM-dd"-->
                    <!--value-format="yyyy-MM-dd">-->
                    <!--</el-date-picker>-->
                    <el-date-picker size="small" v-model="chooseDaterange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="借款平台名称：" prop="platform">
                    <el-input clearable v-model="queryParams.platform" placeholder="请输入借款平台名称" size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="证据包材料：">
                    <!--<el-input-->
                    <!--v-model="queryParams.packageMaterial"-->
                    <!--placeholder="请输入证据包材料"-->
                    <!--clearable-->
                    <!--size="small"-->
                    <!--style="width: 200px"-->
                    <!--@keyup.enter.native="handleQuery"-->
                    <!--/>-->
                    <el-select clearable size="small" v-model="queryParams.packageMaterial" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="号码筛选类型：">
                    <el-select clearable size="small" v-model="queryParams.screenType" placeholder="请选择">
                        <el-option v-for="item in screenType" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="queryParams.screenType" label="号码筛选结果：">
                    <el-select clearable v-if="queryParams.screenType == 1" size="small"
                        v-model="queryParams.screenResult" placeholder="请选择">
                        <el-option v-for="item in networkSortresult" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                    <el-select clearable v-else size="small" v-model="queryParams.screenResult" placeholder="请选择">
                        <el-option v-for="item in realtimeSortresult" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template #filter> </template>
            <template #buttonArea> </template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                        v-hasPermi="['case:caseinfo:import']">案件导入</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"
                        :disabled="multiple" v-hasPermi="['case:caseinfo:export']">导出</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="caseList" @sort-change="handleSortChange" ref="multiTable"
                :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="案件分配时间" prop="distributionTime" fixed="left" width="130" sortable="custom"
                    :sort-orders="['descending', 'ascending']">
                    <template slot-scope="scope" v-if="scope.row.distributionTime">
                        <span>{{
              parseTime(scope.row.distributionTime, "{y}-{m}-{d}")
            }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" prop="respondentName" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="订单号" prop="id" width="200" :show-overflow-tooltip="true" />
                <el-table-column label="内部订单号" prop="loanId" width="110" :show-overflow-tooltip="true" />
                <el-table-column label="案件导入时间" sortable="custom" :sort-orders="['descending', 'ascending']"
                    prop="createTime" :show-overflow-tooltip="true" width="130">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="合同编号" prop="orderNo" width="130" :show-overflow-tooltip="true" />
                <el-table-column label="手机号" prop="respondentPhone" width="120" />
                <el-table-column label="合同金额" prop="contractAmount" sortable="custom"
                    :sort-orders="['descending', 'ascending']" width="120" />
                <el-table-column label="尚欠期数" prop="overdueTerm" sortable="custom"
                    :sort-orders="['descending', 'ascending']" width="120" />
                <el-table-column label="尚欠本金" prop="remainingBalance" width="120" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="逾期年利率" prop="overYearRate" width="100" />
                <el-table-column label="资产受让方" prop="assetAssignee" :show-overflow-tooltip="true" width="200" />
                <el-table-column label="资产最终受让方" prop="assetLastAssignee" :show-overflow-tooltip="true" width="200" />
                <el-table-column label="证据包材料" prop="packageMaterial" :show-overflow-tooltip="true" width="100" />
                <el-table-column label="借款平台名称" prop="platform" :show-overflow-tooltip="true" width="100" />

                <el-table-column label="操作" fixed="right" align="center" width="120">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
                            v-hasPermi="['case:caseinfo:query']">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <importDialog @refresh="clearSelection" :title="addData.title" :show.sync="addData.dialogVisible"
            :id="addData.id">
        </importDialog>
        <exportDialog :title="exportData.title" @refresh="clearSelection" :show.sync="exportData.dialogVisible"
            :ids="exportData.ids" :requestApi="exportData.requestApi"></exportDialog>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import importApi from "@/api/case/import/index";
    import importDialog from "./importDialog";
    import exportDialog from "../components/exportDialog";

    export default {
        name: "list",
        components: {
            SearchBar,
            importDialog,
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
                queryParams: {
                    id: "",
                    batchNo: "",
                    pageNum: 1,
                    pageSize: 50,
                    loanId: "",
                    respondentName: "",
                    respondentIdNo: "",
                    screenType: "",
                    screenResult: "",
                    assetAssignee: "",
                    createTime: "",
                    platform: "",
                    orderByColumn: "",
                    isAsc: "",
                },
                searchParams: {},
                // 表单校验
                rules: {
                    roleName: [{
                        required: true,
                        message: "角色名称不能为空",
                        trigger: "blur"
                    }, ],
                    roleKey: [{
                        required: true,
                        message: "权限字符不能为空",
                        trigger: "blur"
                    }, ],
                    roleSort: [{
                        required: true,
                        message: "角色顺序不能为空",
                        trigger: "blur"
                    }, ],
                },
                addData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    requestApi: "",
                },
                options: [{
                        value: "有",
                        label: "有",
                    },
                    {
                        value: "无",
                        label: "无",
                    },
                ],
                chooseDaterange: [],
                networkSortresult: [],
                realtimeSortresult: [],
                screenType: [],
                getRowKeys(row) {
                    return row.id;
                },
            };
        },
        created() {
            //在网状态号码筛选结果
            this.getDicts("network_screen_result").then((response) => {
                this.networkSortresult = response.data;
            });
            //实时在网号码筛选结果
            this.getDicts("realtime_screen_result").then((response) => {
                this.realtimeSortresult = response.data;
            });
            //号码筛选类型
            this.getDicts("screen_Type").then((response) => {
                this.screenType = response.data;
            });
            this.getList(1);
        },
        // 是否显示过滤栏， 扣除页数，每页显示数，总数量参数，3个内的搜索参数，直接显示一行，不显示过滤
        computed: {
            hasFilter: {
                get() {
                    return false;
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
                    importApi.list(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearSelection();
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
                //切换页
                else if (type == 2) {
                    importApi.list(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
            },
            /** 排序触发事件 */
            handleSortChange(column, prop, order) {
                this.searchParams.orderByColumn = column.prop;
                this.searchParams.isAsc = column.order;
                this.getList(2);
            },
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.ids = [];
                }
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList(1);
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map((item) => item.id);
                this.single = selection.length != 1;
                this.multiple = !selection.length;
            },
            /** 导出按钮操作 */
            handleExport() {
                this.exportData.ids = this.ids.toString()
                this.exportData.title = "案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.requestApi = "/case/caseInfo/export";
            },
            /** 案件导入 */
            handleAdd() {
                this.addData.title = "案件导入";
                this.addData.dialogVisible = true;
            },
            handleUpdate(item) {
                this.$router.push({
                    name: "caseInfo",
                    query: {
                        listid: item.id
                    }
                });
            },
            resetAll() {
                this.chooseDaterange = [];
            },
            handleChange(value) {
                //console.log(value)
                if (value == null) {
                    this.queryParams.beginTime = "";
                    this.queryParams.endTime = "";
                } else {
                    this.queryParams.beginTime = value[0];
                    this.queryParams.endTime = value[1];
                }
            },
        },
    };

</script>
<style lang="scss">
</style>
