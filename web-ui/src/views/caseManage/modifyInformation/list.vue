<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)">
            <template #default>
                <el-form-item label="案件批次号：" prop="batchNo">
                    <el-input v-model="queryParams.batchNo" placeholder="请输入案件批次号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input v-model="queryParams.id" placeholder="请输入订单号" clearable size="small" style="width: 200px"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="信修申请人：">
                    <!--<el-input-->
                    <!--v-model="queryParams.postName"-->
                    <!--placeholder="请输入信修申请人"-->
                    <!--clearable-->
                    <!--size="small"-->
                    <!--style="width: 200px"-->
                    <!--@keyup.enter.native="handleQuery"-->
                    <!--/>-->

                    <el-select clearable size="small" filterable v-model="queryParams.postUserId" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="queryParams.respondentName" placeholder="请输入姓名" clearable size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="queryParams.respondentPhone" placeholder="请输入手机号" clearable size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="身份证号：">
                    <el-input v-model="queryParams.respondentIdNo" placeholder="请输入身份证号" clearable size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>

                <el-form-item label="合同号：">
                    <el-input v-model="queryParams.orderNo" placeholder="请输入合同号，多个合同号用英文逗号连接" clearable type="textarea"
                        size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="号码筛选状态：">
                    <el-select clearable filterable size="small" v-model="queryParams.screenStatus" placeholder="请选择">
                        <el-option v-for="item in screen_status" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="号码筛选结果：">
                    <el-cascader collapse-tags :props="props" clearable filterable size="small"
                        v-model="queryParams.screenResults" :options="screenResultOptions" placeholder="请选择">
                    </el-cascader>
                </el-form-item>
            </template>
            <template #filter>
                <el-form-item label="信修状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.letterRepairStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in letterRepairStatusOptions" :key="item.dictValue"
                            :label="item.dictValue">{{item.dictLabel}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="案件状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.caseStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in statusOptions" :label="item.dictValue" :key="item.dictValue">
                            {{item.dictLabel}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </template>
            <template #buttonArea>

            </template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="warning" size="mini" :disabled="multiple" icon="el-icon-download"
                        @click="handleExport" v-hasPermi="['case:letter:export']">导出
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" size="mini" :disabled="multiple" @click="apply"
                        v-hasPermi="['case:letter:review']">批量审核申请
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" size="mini" @click="handleAdd" v-hasPermi="['case:letter:import']">
                        批量导入信修结果
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>

            <el-table v-loading="loading" max-height="550" :data="caseList" @sort-change="handleSortChange" ref="multiTable"
                :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <!--:selectable="checkSelectable"-->
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
                <el-table-column label="姓名" width="80" prop="respondentName" :show-overflow-tooltip="true"
                    fixed="left" />
                <el-table-column label="案件状态" width="150" :show-overflow-tooltip="true" :formatter="statusFormat"
                    prop="caseStatus"></el-table-column>
                <el-table-column label="订单号" prop="id" width="170" :show-overflow-tooltip="true" />
                <el-table-column label="合同号" width="150" prop="orderNo" :show-overflow-tooltip="true" />
                <el-table-column label="手机号" width="150" prop="respondentPhone"></el-table-column>
                <el-table-column label="逾期年利率" prop="overYearRate" width="100" />
                <el-table-column label="提交人" width="150" prop="postName" />
                <el-table-column label="申请信修时间" width="150" prop="postTime">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.postTime,'{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="信修状态" :formatter="getLetterRepairStatus" prop="letterRepairStatus">
                </el-table-column>
                <el-table-column label="联系状态" :formatter="getContactStatus" prop="contactStatus" width="100">
                </el-table-column>
                <el-table-column label="操作" width="220" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" v-if="scope.row.letterRepairStatus == 1"
                            @click="apply(scope.row)" v-hasPermi="['case:letter:review']">审核申请
                        </el-button>
                        <el-button size="mini" type="primary" @click="handleAdd" v-hasPermi="['case:letter:import']">
                            导入信修结果
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>

        <importDialog @refresh="clearSelection" :title="addData.title" :show.sync="addData.dialogVisible"
            :id="addData.id">
        </importDialog>
        <applyAudit @refresh="clearSelection" :title="applyData.title" :show.sync="applyData.dialogVisible"
            :id="applyData.id"></applyAudit>
        <exportDialog @refresh="clearSelection" :title="exportData.title" :show.sync="exportData.dialogVisible"
            :ids="exportData.ids" :requestApi="exportData.requestApi"></exportDialog>
    </div>
</template>

<script>
    import SearchBar from '@/components/SearchBar/index'
    import modifyApi from "@/api/case/modify/index";
    import importDialog from './importDialog'
    import applyAudit from './applyAudit'
    import divisionApi from "@/api/case/division/index";
    import exportDialog from "../components/exportDialog";

    export default {
        name: "list",
        components: {
            SearchBar,
            importDialog,
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
                searchParams: {},
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                    respondentName: '',
                    respondentPhone: '',
                    respondentIdNo: '',
                    orderNo: '',
                    screenType: "",
                    screenResult: "",
                    letterRepairStatus: '',
                    caseStatus: '',
                    postUserId: '',
                    orderByColumn: "",
                    isAsc: "",
                },
                statusOptions: [],
                contactStatusOptions: [],
                letterRepairStatusOptions: [],
                addData: {
                    title: '',
                    dialogVisible: false,
                    id: ''
                },
                applyData: {
                    title: '',
                    dialogVisible: false,
                    id: ''
                },
                selection: [],
                userList: [],
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    requestApi: "",
                },
                screenResultOptions:[],
                screen_status:[],
               props: {
                    multiple: true
                },
                getRowKeys(row) {
                    return row.id;
                },
            }
        },
        created() {
            //案件状态
            this.getDicts("case_status").then((response) => {
                this.statusOptions = response.data;
            });
            //信修状态
            this.getDicts("letter_repair_status").then((response) => {
                this.letterRepairStatusOptions = response.data;
            });
            //号码筛选状态类型
            this.getDicts("screen_status").then((response) => {
                this.screen_status = response.data;
            });
            //案件联系状态
            this.getDicts("contactStatus").then((response) => {
                this.contactStatusOptions = response.data;
            });
            this.getList(1);
            this.getUsers();
            this.getCascaderData();

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
            // checkSelectable(row, index) {
            //     return row.letterRepairStatus == 1
            // },
            /** 查询角色列表 */
            getList(type) {
                this.loading = true;
                //查询
                if (type == 1) {
                    this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    modifyApi.list(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
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
                else if (type == 2) {
                    modifyApi.list(this.searchParams).then((response) => {
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
            /** 排序触发事件 */
            handleSortChange(column, prop, order) {
                this.searchParams.orderByColumn = column.prop;
                this.searchParams.isAsc = column.order;
                this.getList(2);
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
                this.exportData.requestApi = "/case/letter/export";
            },
            changeStatus() {
                this.getList(1);
            },
            // 案件状态字典翻译
            statusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.caseStatus);
            },
            //信修状态
            getLetterRepairStatus(row, column) {
                return this.selectDictLabel(this.letterRepairStatusOptions, row.letterRepairStatus);
            },
            getContactStatus(row, column) {
                return this.selectDictLabel(this.contactStatusOptions, row.contactStatus);
            },
            //申请案件信修
            apply(item) {
                if (!item.id) {
                    if (this.selection.filter(item => item.letterRepairStatus != 1).length > 0) {
                        this.msgError('所选数据存在不符合批量申请信修操作的数据')
                        return
                    }
                }
                this.applyData.title = '审核信修申请';
                this.applyData.dialogVisible = true;
                this.applyData.id = item.id ? item.id : this.ids.join(',');
            },
            /** 导入 */
            handleAdd() {
                this.addData.title = '导入信修结果';
                this.addData.dialogVisible = true
            },
            //获取调解员
            getUsers() {
                divisionApi.userList().then(
                    (response) => {
                        this.userList = response.data.userList || [];
                        // for (var i = 0; i < this.userList.length; i++) {
                        //     this.userList[i].parentId = this.userList[i].deptId
                        //     delete this.userList[i].deptId
                        // }
                    }
                );
            },
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

</style>
