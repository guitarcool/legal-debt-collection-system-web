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
                    <el-select clearable size="small" v-model="queryParams.createBy" placeholder="请选择">
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
                    <el-select clearable size="small" v-model="queryParams.mediationtor" placeholder="请选择">
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
                    <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable size="small" style="width: 240px"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="queryParams.phone" placeholder="请输入手机号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="发送状态：">
                    <el-select clearable size="small" v-model="queryParams.status" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="发送成功" value="0"></el-option>
                        <el-option label="发送未成功" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发送时间：">
                    <el-date-picker v-model="chooseDaterange" type="daterange" size="small" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="送达时间：">
                    <el-date-picker v-model="chooseDaterange2" type="daterange" size="small" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange2"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="客户回复内容：">
                    <el-select clearable size="small" v-model="queryParams.replyContent" placeholder="请选择">
                        <el-option label="有" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="短信发送渠道：">
                    <el-select clearable size="small" v-model="queryParams.providerType" placeholder="请选择">
                        <el-option v-for="item in shortmsgProviderType" :key="item.dictValue"
                            :label="item.dictLabel" :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="短信类型：">
                    <el-select clearable size="small" v-model="queryParams.type" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="一般短信" value="1"></el-option>
                        <el-option label="文书短信" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="短信通道：">
                    <el-input v-model="queryParams.passage" placeholder="请输入短信通道" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="短信送达状态：">
                    <el-select clearable size="small" v-model="queryParams.deliverStatus" placeholder="请选择">
                        <el-option label="已送达" value="0"></el-option>
                        <el-option label="接收中" value="1"></el-option>
                        <el-option label="其他" value="2"></el-option>
                    </el-select>
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
                    <el-button type="danger" size="mini" :disabled="multiple"
                        v-hasPermi="['report:shortmsgrecord:export']" @click="handleExport">导出
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" size="mini" :disabled="multiple" @click="handleMessage">重新发送短信</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(1)" @clearTick="clearSelection"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="caseList" ref="multiTable" :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="姓名" width="80" prop="name" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="手机号" width="120" prop="phone" fixed="left" />
                <el-table-column label="短信内容" width="800" prop="content">
                    <template slot-scope="scope">
                        <span style="font-size:12px;line-heght:10px;">{{scope.row.content}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发送时间" width="180" prop="sendTime" />
                <el-table-column label="发送状态" width="120" prop="status">
                    <template slot-scope="scope" v-if="scope.row.status != null">
                        <span>{{scope.row.status=='1'?'发送未成功':'发送成功'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="送达状态" width="120" prop="deliverStatus">
                    <template slot-scope="scope" v-if="scope.row.deliverStatus != null">
                        <span v-if="scope.row.providerType == 1">{{shisuyunStatusFormat(scope.row.deliverStatus) !=""?shisuyunStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                        <span v-if="scope.row.providerType == 2">{{wodongStatusFormat(scope.row.deliverStatus) !=""?wodongStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="送达时间" width="180" prop="deliverTime" />
                <el-table-column label="客户回复内容" width="180" prop="replyContent" :show-overflow-tooltip="true" />
                <!-- <template slot-scope="scope" v-if="scope.row.replyContent != null">
                        <span>{{scope.row.replyContent=='1'?'是':'否'}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column label="短信类型" width="180" prop="type">
                    <template slot-scope="scope" v-if="scope.row.type != null">
                        <span>{{scope.row.type=='1'?'一般短信':'短信文书'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="短信通道" width="180" prop="passage" />
                <el-table-column label="订单号" prop="caseId" width="170" :show-overflow-tooltip="true" />
                <el-table-column label="操作员" width="120" prop="createBy" />
                <el-table-column label="调解员" width="120" prop="mediationtor" />
                <el-table-column label="催收机构" width="150" prop="deptname" />
                <el-table-column label="产品名称" width="150" prop="platform" />
                <el-table-column label="案件状态" width="150" :show-overflow-tooltip="true" :formatter="statusFormat"
                    prop="caseStatus" />
                <el-table-column label="短信发送渠道" width="150" prop="providerType" :formatter="shortmsgProviderTypeFormat"/>
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
        <exportDialog @refresh="getList(1)"  :title="exportData.title" :show.sync="exportData.dialogVisible" :ids="exportData.ids"
            :requestApi="exportData.requestApi"></exportDialog>
        <batchExport  @refresh="getList(1)" :title="batchexportData.title" :show.sync="batchexportData.dialogVisible" :params="batchexportData.params"></batchExport>
    </div>
</template>

<script>
    import operationApi from "@/api/case/operation/index";
    import SearchBar from "@/components/SearchBar/index";
    import exportDialog from "../components/exportDialog";
    import batchExport from "./batchExport";

    export default {
        name: "callLogList",
        components: {
            SearchBar,
            exportDialog,
            batchExport
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
                    pageSize: 10,
                    caseStatus: "",
                    qttcStartNum: "",
                    qttcEndNum: "",
                    replyContent:"",
                    isAsc: "",
                },
                wodongStatus: [],
                shisuyunStatus: [],
                statusOptions: [],
                chooseDaterange: [],
                chooseDaterange2: [],
                entrustType:[],
                userList: [],
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    requestApi: "",
                },
                batchexportData: {
                    title: "",
                    dialogVisible: false,
                    params: "",
                },
                shortmsgProviderType:[],
                getRowKeys(row) {
                    return row.shortMsgId;
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
            //沃动标签
            this.getDicts("wodong_deliver_status").then((response) => {
                this.wodongStatus = response.data;
            });
            //时速云标签
            this.getDicts("shisuyun_deliver_status").then((response) => {
                this.shisuyunStatus = response.data;
            });
            //委案状态
            this.getDicts("entrust_status").then((response) => {
                this.entrustType = response.data;
            });
            //短信渠道类型
            this.getDicts("shortmsg_provider_type").then((response) => {
                this.shortmsgProviderType = response.data;
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
                    operationApi.shortMsgRecordlist(this.searchParams).then((response) => {
                        this.clearSelection();
                        this.selection = [];
                        this.ids = [];
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
                //切换页
                else if(type == 2){
                    operationApi.shortMsgRecordlist(this.searchParams).then((response) => {
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
            //打开发送短信的弹窗
            handleMessage() {
                if (this.selection.filter((item) => item.caseStatus == 13).length > 0) {
                    this.msgError("所选数据存在已结案的数据，不能批量发送短信");
                    return;
                }
                this.batchexportData.title = "重新发送短信";
                this.batchexportData.dialogVisible = true;
                this.batchexportData.params = this.ids.join(",");
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.selection = selection;
                this.ids = selection.map((item) => item.shortMsgId);
                this.single = selection.length != 1;
                this.multiple = !selection.length;
            },
            clearSelection(){
                if(this.caseList.length>0){
                    this.$refs.multiTable.clearSelection() //清除选中的数据
                }
            },
            /** 导出按钮操作 */
            handleExport() {
                this.exportData.ids = this.ids.toString()
                this.exportData.title = "案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.requestApi = "/report/shortMsgRecord/export";
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
            // 短信渠道
            shortmsgProviderTypeFormat(row, column) {
                return this.selectDictLabel(this.shortmsgProviderType, row.providerType);
            },
            //沃动标签
            wodongStatusFormat(deliverStatus) {
                return this.selectDictLabel(this.wodongStatus, deliverStatus);
            },
            //时速云标签
            shisuyunStatusFormat(deliverStatus) {
                return this.selectDictLabel(this.shisuyunStatus, deliverStatus);
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
                this.chooseDaterange2 = [];
            },
            handleChange(value) {
                //console.log(value)
                if (value == null) {
                    this.queryParams.startSendTime = "";
                    this.queryParams.endSendTime = "";
                } else {
                    this.queryParams.startSendTime = value[0];
                    this.queryParams.endSendTime = value[1];
                }
            },
            handleChange2(value) {
                //console.log(value)
                if (value == null) {
                    this.queryParams.startDeliverTime = "";
                    this.queryParams.endDeliverTime = "";
                } else {
                    this.queryParams.startDeliverTime = value[0];
                    this.queryParams.endDeliverTime = value[1];
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
