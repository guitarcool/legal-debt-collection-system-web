<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="案件批次号：" prop="batchNo">
                    <el-input v-model="queryParams.batchNo" placeholder="请输入案件批次号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="queryParams.sendUser" placeholder="请输入姓名" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="queryParams.sendPhone" placeholder="请输入手机号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="操作员：">
                    <el-select clearable multiple collapse-tags filterable size="small" v-model="queryParams.operatorIds" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="调解员：">
                    <el-select clearable multiple collapse-tags filterable size="small"
                        v-model="queryParams.mediatorIds" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="催收机构：">
                    <el-input v-model="queryParams.mediatorDept" placeholder="请输入催收机构" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="发送时间：">
                    <el-date-picker v-model="chooseDaterange" type="datetimerange" size="small" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" @change="handleChange"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="短信送达结果：">
                    <el-cascader collapse-tags :props="props" clearable filterable size="small"
                        v-model="queryParams.deliverResult" :options="shortmsgOptions" placeholder="请选择">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="送达时间：">
                    <el-date-picker v-model="chooseDaterange2" type="datetimerange" size="small" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" @change="handleChange2"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="模版名称：">
                    <el-input v-model="queryParams.templateName" placeholder="请输入模版名称" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="点击情况：">
                    <el-select clearable filterable size="small" v-model="queryParams.seeCount" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="有点击" value="1"></el-option>
                        <el-option label="无点击" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户回复内容：">
                    <el-select clearable filterable size="small" v-model="queryParams.replyContent" placeholder="请选择">
                        <el-option label="有" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="正文内容：">
                    <el-input v-model="queryParams.content" placeholder="请输入正文内容" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
            </template>
            <template #buttonArea> </template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="danger" size="mini" :disabled="multiple"
                        v-hasPermi="['shortLinkVisitLog:export']" @click="handleExport">导出
                    </el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="success" size="mini" v-hasPermi="['report:shortmsgrecord:exportAll']"
                        @click="handleExportAll">全选导出
                    </el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="primary" size="mini" v-hasPermi="['employeeIpBind:bind']"
                        @click="setUpIP">员工IP设置
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>

            <el-table v-loading="loading" border max-height="550" :data="caseList" ref="multiTable"
                :row-key="getRowKeys" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="姓名" width="120" prop="sendUser" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="手机号" width="120" prop="sendPhone" fixed="left" />
                <el-table-column label="短信内容" width="800" prop="content">
                    <template slot-scope="scope">
                        <span style="font-size:12px;line-heght:10px;">{{scope.row.content}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发送时间" width="180" prop="sendTime" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="送达状态" width="120" prop="deliverStatus">
                    <template slot-scope="scope" v-if="scope.row.deliverStatus != null">
                        <span
                            v-if="scope.row.providerType == 1">{{shisuyunStatusFormat(scope.row.deliverStatus) !=""?shisuyunStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                        <span
                            v-if="scope.row.providerType == 2">{{wodongStatusFormat(scope.row.deliverStatus) !=""?wodongStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                        <span
                            v-if="scope.row.providerType == 3">{{xuanwuStatusFormat(scope.row.deliverStatus) !=""?xuanwuStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="送达时间" width="180" prop="deliverTime" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="查看次数" width="100" prop="seeCount" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="首次查看时间" width="180" prop="firstSeeTime" />
                <el-table-column label="最新查看时间" width="180" prop="lastSeeTime" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="最新点击IP" width="180" prop="lastIp" />
                <el-table-column label="最新操作系统" width="180" prop="lastOs" />
                <el-table-column label="客户回复内容" width="180" prop="replyContent" :show-overflow-tooltip="true" />
                <el-table-column label="模版名称" width="150" prop="templateName" />
                <el-table-column label="调解员" width="120" prop="mediatorName" />
                <el-table-column label="催收机构" width="150" prop="mediatorDept" />
                <el-table-column label="操作员" width="120" prop="operator" />
                <el-table-column label="操作" width="250" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" v-if="scope.row.caseId!=null&&scope.row.entrustStatus != 3"
                            type="primary" @click="handleUpdate(scope.row)">案件详情
                        </el-button>
                        <el-button size="mini" v-if="scope.row.caseId!=null" type="primary" @click="goSms(scope.row)">
                            短信发送记录
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <exportDialog @refresh="clearSelection" :title="exportData.title" :show.sync="exportData.dialogVisible"
            :ids="exportData.ids" :requestApi="exportData.requestApi" :total="exportData.total"></exportDialog>
        <combined :title="combinedData.title" :show.sync="combinedData.dialogVisible" :id="combinedData.id"></combined>

    </div>
</template>

<script>
    import shortLinkApi from "@/api/case/shortLink/shortLink";
    import SearchBar from "@/components/SearchBar/index";
    import exportDialog from "../components/exportDialog";
    import combined from "./combined.vue";
    import divisionApi from "@/api/case/division/index";

    export default {
        name: "smsList",
        components: {
            SearchBar,
            exportDialog,
            combined
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
                    isAsc: "",
                    orderByColumn: "",
                },
                combinedData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                wodongStatus: [],
                shisuyunStatus: [],
                xuanwuStatus: [],
                chooseDaterange: [],
                chooseDaterange2: [],
                userList: [],
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    requestApi: "",
                    total: ""
                },
                shortmsgProviderType: [],
                getRowKeys(row) {
                    return row.id;
                },
                shortmsgOptions: [],
                props: {
                    multiple: true
                },
            };
        },
        created() {
            this.getList(1);
            this.getUsers();
            this.getCascaderData();
            //沃动标签
            this.getDicts("wodong_deliver_status").then((response) => {
                this.wodongStatus = response.data;
            });
            //时速云标签
            this.getDicts("shisuyun_deliver_status").then((response) => {
                this.shisuyunStatus = response.data;
            });
            //玄武标签
            this.getDicts("xuanwu_deliver_status").then((response) => {
                this.xuanwuStatus = response.data;
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
                    shortLinkApi.list(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearSelection();
                        this.clearTable();//清除排序
                        this.caseList = response.rows||[];
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
                    shortLinkApi.list(this.searchParams).then((response) => {
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
                let params2 = {
                    type: 'shortmsg'
                };
                divisionApi.getCascaderData(params2).then(response => {
                    this.shortmsgOptions = response.data || [];
                });
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
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.selection = [];
                    this.ids = [];
                }
            },
            /** 导出按钮操作 */
            handleExport() {
                this.exportData.ids = this.ids.toString()
                this.exportData.title = "案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.requestApi = "/shortLinkVisitLog/export";
            },
            // /** 导出按钮操作 */
            // handleExportAll() {
            //     this.exportData.title = "全选案件导出";
            //     this.exportData.dialogVisible = true;
            //     this.exportData.total = this.total;
            //     this.exportData.requestApi = "/report/shortMsgRecord/exportAll";
            // },
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
                        name: "cutAfterInfo",
                        query: {
                            afterId: item.caseId
                        }
                    });
                }
            },
            //沃动标签
            wodongStatusFormat(deliverStatus) {
                return this.selectDictLabel(this.wodongStatus, deliverStatus);
            },
            //时速云标签
            shisuyunStatusFormat(deliverStatus) {
                return this.selectDictLabel(this.shisuyunStatus, deliverStatus);
            },
            //玄武标签
            xuanwuStatusFormat(deliverStatus) {
                return this.selectDictLabel(this.xuanwuStatus, deliverStatus);
            },
            //获取调解员
            getUsers() {
                divisionApi.userList().then((response) => {
                    this.userList = response.data.userList || [];
                });
            },
            resetAll() {
                this.chooseDaterange = [];
                this.chooseDaterange2 = [];
            },
            handleChange(value) {
                //console.log(value)
                if (value == null) {
                    this.queryParams.sendSTime = "";
                    this.queryParams.sendETime = "";
                } else {
                    this.queryParams.sendSTime = value[0];
                    this.queryParams.sendETime = value[1];
                }
            },
            handleChange2(value) {
                //console.log(value)
                if (value == null) {
                    this.queryParams.deliverSTime = "";
                    this.queryParams.deliverETime = "";
                } else {
                    this.queryParams.deliverSTime = value[0];
                    this.queryParams.deliverETime = value[1];
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
            clearTable(){
                this.$refs.multiTable.clearSort();
            },
            setUpIP() {
                this.combinedData.title = "员工IP设置";
                this.combinedData.dialogVisible = true;
                this.combinedData.id = "";
            },
            goSms(item) {
                this.$router.push({
                    name: 'SmsRecord',
                    params: {
                        shortMsgId: item.id
                    }
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
