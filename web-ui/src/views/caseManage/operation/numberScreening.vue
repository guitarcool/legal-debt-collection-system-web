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
                    <el-input v-model="queryParams.caseId" placeholder="请输入订单号" clearable size="small" style="width: 240px"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="操作员：">
                    <el-select clearable size="small" filterable v-model="queryParams.createBy" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品名称：">
                    <el-input v-model="queryParams.platform" placeholder="请输入产品名称" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="调解员：">
                    <el-select clearable multiple collapse-tags filterable size="small" v-model="queryParams.mediationtors" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="催收机构：">
                    <el-input v-model="queryParams.deptname" placeholder="请输入催收机构" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="queryParams.phone" placeholder="请输入手机号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="号码筛选结果：">
                    <el-cascader collapse-tags :props="props" clearable filterable size="small"
                        v-model="queryParams.screenResults" :options="screenResultOptions" placeholder="请选择">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="筛选时间：">
                    <el-date-picker v-model="chooseDaterange" type="daterange" size="small" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
            </template>
            <template #filter>
                <el-form-item label="案件状态：" class="custom-radio">
                    <el-checkbox-group v-model="queryParams.caseStatuss" @change="changeStatus">
                        <el-checkbox v-for="item in statusOptions" :label="item.dictValue"
                            :key="item.dictValue">
                            {{ item.dictLabel }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </template>
            <template #buttonArea> </template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="danger" size="mini" :disabled="multiple" v-hasPermi="['report:screenrecord:export']" @click="handleExport">导出
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" size="mini" v-hasPermi="['report:screenrecord:exportAll']" @click="handleExportAll">全选导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" max-height="550" :data="caseList" ref="multiTable" :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="号码筛选类型" width="200" prop="screenType">
                    <template slot-scope="scope">
                    <span>{{ screenTypeFormat(scope.row.screenType) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="案件批次号" prop="batchNo" width="150" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="订单号" prop="caseId" width="170" :show-overflow-tooltip="true" />
                <el-table-column label="姓名" width="80" prop="name" :show-overflow-tooltip="true"
                    fixed="left" />
                <el-table-column label="手机号" width="120" prop="phone" />
                <el-table-column label="筛选时间" width="180" prop="screenTime" />
                <el-table-column label="号码筛选结果" width="150" prop="screenResult">
                    <template slot-scope="scope">
                    <span v-if="scope.row.screenType == 1">{{ networkSortresultFormat(scope.row.screenResult) }}</span>
                    <span v-else>{{ realtimeSortresultFormat(scope.row.screenResult) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作员" width="120" prop="createBy" />
                <el-table-column label="调解员" width="100" prop="mediationtor" />
                <el-table-column label="催收机构" width="120" prop="deptname" />
                <el-table-column label="产品名称" width="150" :show-overflow-tooltip="true" prop="platform" />
                <el-table-column label="案件状态" width="150" :show-overflow-tooltip="true" :formatter="statusFormat"
                    prop="caseStatus" />
                <el-table-column label="委案状态" :formatter="getEntrustType" prop="entrustStatus">
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" v-if="scope.row.caseId!=null&&scope.row.entrustStatus != 3" type="primary"
                            @click="handleUpdate(scope.row)">案件详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <exportDialog @refresh="clearSelection"  :title="exportData.title" :show.sync="exportData.dialogVisible" :ids="exportData.ids"
            :requestApi="exportData.requestApi" :total="exportData.total"></exportDialog>
    </div>
</template>

<script>
    import operationApi from "@/api/case/operation/index";
    import SearchBar from "@/components/SearchBar/index";
    import divisionApi from "@/api/case/division/index";
    import exportDialog from "../components/exportDialog";

    export default {
        name: "callLogList",
        components: {
            SearchBar,
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
                    pageNum: 1,
                    pageSize: 50,
                    caseStatuss: [],
                },
                statusOptions: [],
                chooseDaterange: [],
                userList: [],
                entrustType:[],
                networkSortresult: [],
                realtimeSortresult: [],
                screenType: [],
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: [],
                    requestApi: "",
                    total: ""
                },
                screenResultOptions:[],
                screen_status:[],
                props: {
                        multiple: true
                    },
                getRowKeys(row) {
                    return row.screenId;
                },
            };
        },
        created() {
            this.getList(1);
            this.getUsers();
            this.getCascaderData();
            //案件状态
            this.getDicts("case_status").then((response) => {
                this.statusOptions = response.data;
            });
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
            //号码筛选状态类型
            this.getDicts("screen_status").then((response) => {
                this.screen_status = response.data;
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
                    return true;
                },
            },
        },
        methods: {
            /** 查询角色列表 */
            getList(type) {
                this.loading = true;
                //查询
                if(type == 1){
		            this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    operationApi.screenRecordlist(this.searchParams).then((response) => {
                        this.clearSelection();
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
                else if(type == 2){
                    operationApi.screenRecordlist(this.searchParams).then((response) => {
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
            /** 获取级联选择器 */
            getCascaderData() {
                let params1 = {
                    type: 'screen'
                };
                divisionApi.getCascaderData(params1).then(response => {
                    this.screenResultOptions = response.data || [];
                });
            },
            //号码筛选类型
            screenTypeFormat(screenType) {
                return this.selectDictLabel(this.screenType, screenType);
            },
            //实时在网号码筛选结果
            realtimeSortresultFormat(realtimeSortresult) {
                return this.selectDictLabel(this.realtimeSortresult, realtimeSortresult);
            },
            //在网状态号码筛选结果
            networkSortresultFormat(networkSortresult) {
                return this.selectDictLabel(this.networkSortresult, networkSortresult);
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList(1);
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.selection = selection;
                this.ids = selection.map((item) => item.screenId);
                this.single = selection.length != 1;
                this.multiple = !selection.length;
            },
            clearSelection(){
                if(this.caseList.length>0){
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.ids = [];
                    this.selection = [];
                }
            },
            /** 导出按钮操作 */
            handleExport() {
                this.exportData.ids = this.ids
                this.exportData.title = "案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.requestApi = "/report/screenRecord/export";
            },
            /** 导出按钮操作 */
            handleExportAll() {
                this.exportData.title = "全选案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.total = this.total;
                this.exportData.requestApi = "/report/screenRecord/exportAll";
            },
            handleUpdate(item) {
                if (item.caseStatus < 7) {
                    this.$router.push({
                        name: "cutBeforeInfo",
                        query: {
                            beforeId: item.caseId
                        }
                    });
                } else if (item.caseStatus >= 7) {
                    this.$router.push({
                        name: "cutAfterInfo",
                        query: {
                            afterId: item.caseId
                        }
                    });
                }
            },
            changeStatus() {
                this.getList(1);
            },
            // 案件状态字典翻译
            statusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.caseStatus);
            },
            //委案状态
            getEntrustType(row, column) {
                return this.selectDictLabel(this.entrustType, row.entrustStatus);
            },
            //获取调解员
            getUsers() {
                operationApi.userList().then((response) => {
                    this.userList = response.data.userList || [];
                });
            },
            resetAll() {
                this.chooseDaterange = [];
            },
            handleChange(value) {
                if (value == null) {
                    this.queryParams.startScreenTime = "";
                    this.queryParams.endScreenTime = "";
                } else {
                    this.queryParams.startScreenTime = value[0];
                    this.queryParams.endScreenTime = value[1];
                }
            },
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
            margin-right: 10px;
            margin-bottom: 20px;
        }
    }

</style>
