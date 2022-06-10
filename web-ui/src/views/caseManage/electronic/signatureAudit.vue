<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="案件批次号：" prop="batchno">
                    <el-input v-model="queryParams.batchno" placeholder="请输入案件批次号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="提交人：">
                    <el-input v-model="queryParams.reviewerName" placeholder="请输入提交人" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable size="small" style="width: 240px"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="签章时间：">
                    <el-date-picker size="small" v-model="signTime" type="daterange" range-separator="至"
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
                <el-form-item label="审核状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.auditSignStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in auditOptions" :label="item.dictValue" :key="item.dictValue">
                            {{ item.dictLabel }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="签章状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.signStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in signOptions" :label="item.dictValue" :key="item.dictValue">
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
                    <el-button type="primary" size="mini" @click="editApply" :disabled="multiple"
                        icon="el-icon-download">批量签章审核</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" size="mini" @click="editApplyAll" v-hasPermi="['sign:apply:checkAll']"
                        icon="el-icon-download">全选签章审核</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>
            <el-table v-loading="loading" max-height="550" :data="caseList" @sort-change="handleSortChange" ref="multiTable"
                :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="案件批次号" prop="batchno" width="200" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="姓名" prop="name" width="150" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="文书id" prop="clericalId" width="110" />
                <el-table-column label="最终受让人" width="200" :show-overflow-tooltip="true" prop="assignee" />
                <el-table-column label="模版名称" prop="clericalName" width="150" :show-overflow-tooltip="true" />
                <el-table-column label="签章内容" prop="signContent" width="160" />
                <el-table-column label="案件状态" width="120" :formatter="caseStatusFormat" prop="caseStatus" />
                <el-table-column label="提交人" prop="submitterName" />
                <el-table-column label="审核提交时间" width="140" prop="submitTime" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="签章时间" width="120" prop="signTime" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="签章状态" width="120" :formatter="signOptionsFormat" prop="signStatus" />
                <el-table-column label="审核人" width="120" prop="reviewerName" />
                <el-table-column label="签章文书审核状态" width="130" :formatter="auditOptionsFormat" prop="auditSignStatus" />
                <el-table-column label="委案状态" :formatter="getEntrustType" prop="entrustStatus">
                </el-table-column>
                <el-table-column label="操作" width="280" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" v-if="scope.row.auditSignStatus === 0"
                            @click="apply(scope.row)">审核</el-button>
                        <el-button size="mini" type="warning" @click="seeErweima(scope.row)">文书查看</el-button>
                        <el-button size="mini" type="primary"
                            v-if="scope.row.templateType != 4&&scope.row.entrustStatus != 3"
                            @click="goRouter(scope.row)">案件详情</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <applyAudit @refresh="clearSelection" :type="applyData.type" :title="applyData.title"
            :show.sync="applyData.dialogVisible" :id="applyData.id" :ids="applyData.ids"  :total="applyData.total"></applyAudit>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import electronicApi from "@/api/case/electronic/index";
    import applyAudit from "./applyAudit";

    export default {
        name: "list",
        components: {
            SearchBar,
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
                    reviewerName: "",
                    batchno: "",
                    pageNum: 1,
                    pageSize: 50,
                    name: "",
                    auditSignStatus: "",
                    signStatus: "",
                    caseStatuss: [],
                    orderByColumn: "",
                    isAsc: "",
                },
                statusOptions: [], //案件状态
                auditOptions: [], //文书审核状态
                signOptions: [], //签章状态
                entrustType: [],
                applyData: {
                    title: "",
                    dialogVisible: false,
                    id: -1,
                    type: -1,
                    total: ""
                },
                selection: [],
                signTime: [],
                getRowKeys(row) {
                    return row.id;
                },
            };
        },
        created() {
            this.getList(1);
            //案件状态
            this.getDicts("case_status").then((response) => {
                this.statusOptions = response.data;
            });
            //文书审核状态
            this.getDicts("audit_sign_status").then((response) => {
                this.auditOptions = response.data;
            });
            //签章状态
            this.getDicts("sign_status").then((response) => {
                this.signOptions = response.data;
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
                if (type == 1) {
                    this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    electronicApi.applyList(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearSelection();
                        this.clearTable();
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }
                    ).catch(() => {
                        this.caseList = [];
                        this.total = 0;
                        this.loading = false;
                    });
                }
                //切换页
                else if (type == 2) {
                    electronicApi.applyList(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }
                    ).catch(() => {
                        this.caseList = [];
                        this.total = 0;
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
            clearTable(){
                this.$refs.multiTable.clearSort();
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
            changeStatus() {
                this.getList(1);
            },
            // 案件状态
            caseStatusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.caseStatus);
            },
            // 签章状态
            signOptionsFormat(row, column) {
                return this.selectDictLabel(this.signOptions, row.signStatus);
            },
            // 文书审核状态
            auditOptionsFormat(row, column) {
                return this.selectDictLabel(this.auditOptions, row.auditSignStatus);
            },
            //委案状态
            getEntrustType(row, column) {
                return this.selectDictLabel(this.entrustType, row.entrustStatus);
            },
            //申请审核
            apply(item) {
                this.applyData.title = "文书签章审核";
                this.applyData.type = 1;
                this.applyData.dialogVisible = true;
                this.applyData.id = item.id;
            },
            //批量申请审核
            editApply() {
                if (this.selection.filter((item) => item.auditSignStatus != 0).length > 0) {
                    this.msgError("所选数据存在已审核的数据，不能批量审核");
                    return;
                }
                this.applyData.title = "批量文书签章审核";
                this.applyData.type = 2;
                this.applyData.dialogVisible = true;
                this.applyData.ids = this.ids;
            },
            //批量申请审核
            editApplyAll() {
                this.applyData.title = "全选文书签章审核";
                this.applyData.type = 2;
                this.applyData.total = this.total;
                this.applyData.dialogVisible = true;
            },
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.ids = [];
                    this.selection = [];
                }
            },
            //案件详情
            goRouter(item) {
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
            //查看
            seeErweima(item) {
                if (item.fileUrl) {
                    window.open(process.env.VUE_APP_BASE_API + item.fileUrl);
                } else {
                    this.$message({
                        message: '文书内容不存在',
                        type: 'warning'
                    })
                }
            },
            resetAll() {
                this.signTime = [];
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
