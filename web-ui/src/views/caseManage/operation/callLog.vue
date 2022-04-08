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
                <el-form-item label="操作员：">
                    <el-select clearable size="small" filterable v-model="queryParams.operatorId" placeholder="请选择">
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
                    <el-select clearable multiple collapse-tags filterable size="small" v-model="queryParams.mediatorIds" placeholder="请选择">
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
                    <el-input v-model="queryParams.respondentName" placeholder="请输入姓名" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="主叫号码：">
                    <el-input v-model="queryParams.caller" placeholder="请输入主叫号码" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="被叫号码：">
                    <el-input v-model="queryParams.callee" placeholder="请输入被叫号码" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="呼出类型：">
                    <el-select clearable size="small" filterable v-model="queryParams.type" placeholder="请选择">
                        <el-option label="呼入" value="INBOUND"></el-option>
                        <el-option label="呼出" value="OUTBOUND"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="呼出子类型：">
                    <el-select clearable size="small" filterable v-model="queryParams.subType" placeholder="请选择">
                        <el-option label="坐席呼叫" value="OUTBOUND"></el-option>
                        <el-option label="坐席接听" value="INBOUND"></el-option>
                        <el-option label="预测式计划" value="FCFS"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="呼叫结果：">
                    <el-select clearable size="small" filterable v-model="queryParams.outcome" placeholder="请选择">
                        <el-option label="成功" value="SUCCESS"></el-option>
                        <el-option label="失败" value="FAIL"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="呼叫时间：">
                    <el-date-picker v-model="chooseDaterange" type="daterange" size="small" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="通话时长：">
                    <el-input v-model="queryParams.minDuration" placeholder="最小时长（秒）" clearable size="small"
                        style="width: 130px" />
                    <span style="margin:0 10px;">~</span>
                    <el-input v-model="queryParams.maxDuration" placeholder="最大时长（秒）" clearable size="small"
                        style="width: 130px" />
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
                    <el-button type="danger"  size="mini" :disabled="multiple" v-hasPermi="['report:callrecord:export']" @click="handleExport">导出
                    </el-button>
                    <el-button type="success"  size="mini" :disabled="multiple" v-hasPermi="['report:callrecord:batchDownloadSoundRecord']" @click="batchDownloadRecording">
                        批量下载录音文件
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="caseList" ref="multiTable" :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="订单号" prop="caseId" width="170" :show-overflow-tooltip="true" />
                <el-table-column label="姓名" width="100" prop="respondentName" :show-overflow-tooltip="true"
                    fixed="left" />
                <el-table-column label="呼叫时间" width="180" prop="callTime" />
                <el-table-column label="联系人姓名" width="150" prop="calleeName" />
                <el-table-column label="关系" width="80" prop="relation" />
                <el-table-column label="主叫号码" width="150" prop="caller" />
                <el-table-column label="被叫号码" prop="callee" width="150" />
                <el-table-column label="呼出类型" width="120" prop="type">
                    <template slot-scope="scope" v-if="scope.row.type != null">
                        <span>{{scope.row.type=='INBOUND'?'呼入':'呼出'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="subType" label="呼出子类型" :show-overflow-tooltip="true" width="100">
                    <template slot-scope="scope" v-if="scope.row.subType != null">
                        <span>{{scope.row.subType=='OUTBOUND'?'坐席呼叫':(scope.row.subType=='INBOUND'?'坐席接听':scope.row.subType=='FCFS'?'预测式计划':'')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="响铃时长" width="80" prop="ringTime">
                    <template slot-scope="scope" v-if="scope.row.ringTime != null">
                        <span>{{scope.row.ringTime}}秒</span>
                    </template>
                </el-table-column>
                <el-table-column label="通话时长" width="80" prop="duration">
                    <template slot-scope="scope" v-if="scope.row.duration != null">
                        <span>{{scope.row.duration}}秒</span>
                    </template>
                </el-table-column>
                <el-table-column label="呼叫结果" width="120" prop="outcome">
                    <template slot-scope="scope" v-if="scope.row.outcome != null">
                        <span>{{scope.row.outcome=='SUCCESS'?'成功':'失败'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作员" width="120" prop="createName" />
                <el-table-column label="调解员" width="120" prop="mediatorName" />
                <el-table-column label="催收机构" width="150" prop="mediatorDeptName" />
                <el-table-column label="产品名称" width="150" prop="platform" />
                <el-table-column label="案件状态" width="150" :show-overflow-tooltip="true" :formatter="statusFormat"
                    prop="caseStatus" />
                <el-table-column label="委案状态" :formatter="getEntrustType" prop="entrustStatus">
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" v-if="scope.row.caseId!=null&&scope.row.entrustStatus != 3" type="primary"
                            @click="handleUpdate(scope.row)">案件详情
                        </el-button>
                        <el-button size="mini" v-if="scope.row.path" type="warning" @click="recordingPlay(scope.row)">
                            录音播放
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
    import { downLoadZip } from "@/utils/zipdownload";
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
                },
                statusOptions: [],
                chooseDaterange: [],
                userList: [],
                entrustType:[],
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    requestApi: "",
                },
                getRowKeys(row) {
                    return row.callRecordId;
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
                    operationApi.callRecordlist(this.searchParams).then((response) => {
                        this.clearSelection();
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
                //切换页
                else if(type == 2){
                    operationApi.callRecordlist(this.searchParams).then((response) => {
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
                this.selection = selection;
                this.ids = selection.map((item) => item.callRecordId);
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
                this.exportData.requestApi = "/report/callRecord/export";
            },
            batchDownloadRecording() {
                const queryParams = this.ids.join(',')
                this.$confirm("是否确认下载选中的录音文件?", "警告", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(function () {
                        downLoadZip("/report/callRecord/batchDownloadSoundRecord?ids=" + queryParams, "ruoyi");
                         this.clearSelection();
                    })
                    .catch(function () {});
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
                //console.log(value)
                if (value == null) {
                    this.queryParams.startCallTime = "";
                    this.queryParams.endCallTime = "";
                } else {
                    this.queryParams.startCallTime = value[0];
                    this.queryParams.endCallTime = value[1];
                }
            },
            recordingPlay(val) {
                let audio = new Audio();
                audio.src = process.env.VUE_APP_BASE_API + val.path;
                audio.play();
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
