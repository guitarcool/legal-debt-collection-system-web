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
                <el-form-item label="提交人：">
                    <el-select clearable size="small" filterable multiple v-model="createBy" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电子签章：">
                    <el-input v-model="queryParams.signContent" placeholder="请输入电子签章名称" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="模版名称：">
                    <el-input v-model="queryParams.templateName" placeholder="请输入模版名称" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="文书id：">
                    <el-input v-model="queryParams.clericalId" placeholder="请输入文书id" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="审核人：">
                    <el-input v-model="queryParams.reviewer" placeholder="请输入审核人" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="签章状态：">
                    <el-select clearable size="small" filterable v-model="queryParams.signStatus" placeholder="请选择">
                        <el-option v-for="item in signOptions" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签章时间：">
                    <el-date-picker v-model="chooseDaterange" type="daterange" size="small" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
            </template>
            <template #filter>
                <el-form-item label="案件状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.caseStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in statusOptions" :label="item.dictValue" :key="item.dictValue">
                            {{ item.dictLabel }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </template>
            <template #buttonArea> </template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="danger" size="mini" :disabled="multiple" v-hasPermi="['report:signrecord:export']" @click="handleExport">导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="caseList" ref="multiTable" :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="电子签章" prop="signContent" width="170" :show-overflow-tooltip="true" />
                <el-table-column label="文书id" prop="clericalId" width="100" :show-overflow-tooltip="true" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="订单号" prop="caseId" width="170" :show-overflow-tooltip="true" />
                <el-table-column label="姓名" width="100" prop="name" :show-overflow-tooltip="true"
                    fixed="left" />
                <el-table-column label="签章状态" width="120" :show-overflow-tooltip="true" :formatter="signOptionsFormat"
                    prop="caseStatus" />
                <el-table-column label="签章时间" width="180" prop="signTime" />
                <el-table-column label="审核人" width="150" prop="reviewer" />
                <el-table-column label="提交人" width="150" prop="createBy"  :show-overflow-tooltip="true"/>
                <el-table-column label="操作" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">文书查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <exportDialog @refresh="clearSelection"  :title="exportData.title" :show.sync="exportData.dialogVisible" :ids="exportData.ids"
            :requestApi="exportData.requestApi"></exportDialog>
    </div>
</template>

<script>
    import operationApi from "@/api/case/operation/index";
    import SearchBar from "@/components/SearchBar/index";
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
                    createBy:[],
                },
                createBy:[],
                statusOptions: [],
                chooseDaterange: [],
                userList: [],
                signOptions: [],
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    requestApi: "",
                },
                getRowKeys(row) {
                    return row.signId;
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
            //签章状态
            this.getDicts("sign_status").then((response) => {
                this.signOptions = response.data;
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
                    this.queryParams.createBy = this.createBy.toString();
		            this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    operationApi.signRecordlist(this.searchParams).then((response) => {
                        this.clearSelection();
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
                //切换页
                else if(type == 2){
                    operationApi.signRecordlist(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
            },
            // 签章状态
            signOptionsFormat(row, column) {
                return this.selectDictLabel(this.signOptions, row.signStatus);
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList(1);
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.selection = selection;
                this.ids = selection.map((item) => item.signId);
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
                this.exportData.ids = this.ids.toString()
                this.exportData.title = "案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.requestApi = "/report/signRecord/export";
            },
            handleUpdate(item) {
                window.open(process.env.VUE_APP_BASE_API + item.clericalPath);
            },
            changeStatus() {
                this.getList(1);
            },
            //获取调解员
            getUsers() {
                operationApi.userList().then((response) => {
                    this.userList = response.data.userList || [];
                });
            },
            resetAll() {
                this.createBy = [];
                this.queryParams.createBy = [];
                this.chooseDaterange = [];
            },
            handleChange(value) {
                if (value == null) {
                    this.queryParams.startSignTime = "";
                    this.queryParams.endSignTime = "";
                } else {
                    this.queryParams.startSignTime = value[0];
                    this.queryParams.endSignTime = value[1];
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
