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
                    <el-input v-model="queryParams.id" placeholder="请输入订单号" clearable size="small" style="width: 240px"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="调解员：">
                    <el-select clearable size="small" v-model="queryParams.principal" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品名称：">
                    <el-input v-model="queryParams.productName" placeholder="请输入产品名称" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="分发时间：">
                    <el-date-picker v-model="chooseDaterange" type="daterange" size="small" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="承诺还款日：">
                    <!--<el-date-picker-->
                    <!--v-model="queryParams.promiseRepayDate"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期"-->
                    <!--format="yyyy-MM-dd"-->
                    <!--value-format="yyyy-MM-dd">-->
                    <!--</el-date-picker>-->
                    <el-date-picker v-model="chooseDaterange1" type="daterange" size="small" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange1"
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
                <el-form-item label="联系结果：">
                    <el-select clearable size="small" v-model="queryParams.medLabel" placeholder="请选择">
                        <el-option v-for="item in contactResultOptions" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="信修状态：">
                    <el-select clearable size="small" v-model="queryParams.letterRepairStatus" placeholder="请选择">
                        <el-option v-for="item in letterRepairStatusOptions" :key="item.dictValue"
                            :label="item.dictLabel" :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合同号：">
                    <el-input v-model="queryParams.orderNo" placeholder="请输入合同号，多个合同号用英文逗号连接" clearable type="textarea"
                        size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="号码筛选状态：">
                    <el-select clearable size="small" v-model="queryParams.screenStatus" placeholder="请选择">
                        <el-option v-for="item in screen_status" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
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
                    <el-select clearable v-if="queryParams.screenType == 1" size="small" v-model="queryParams.screenResult"
                        placeholder="请选择">
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
                <el-form-item label="网调标签：">
                    <el-select clearable size="small" v-model="queryParams.networkAdjustLabel" placeholder="请选择">
                        <el-option v-for="item in adjustType" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="最近一次调解时间：">
                    <el-date-picker v-model="chooseDaterange2" type="daterange" size="small" range-separator="至"
                        start-placeholder="调解开始日期" end-placeholder="调解结束日期" format="yyyy-MM-dd" @change="handleChange2"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="短信发送渠道：">
                    <el-select clearable size="small" v-model="queryParams.providerType" placeholder="请选择">
                        <el-option v-for="item in shortmsgProviderType" :key="item.dictValue"
                            :label="item.dictLabel" :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="短信送达状态：" v-if="queryParams.providerType">
                    <el-select clearable size="small" v-model="queryParams.lastDeliverStatus" placeholder="请选择">
                        <el-option label="已送达" value="0"></el-option>
                        <el-option label="接收中" value="1"></el-option>
                        <el-option label="其他" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户回复内容：">
                    <el-select clearable size="small" v-model="queryParams.replyContent" placeholder="请选择">
                        <el-option label="无" value="0"></el-option>
                        <el-option label="有" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账龄（M）：">
                        <el-input size="small" style="width:100px" clearable v-model="queryParams.overdueStartAge" />~<el-input size="small" style="width:100px" clearable v-model="queryParams.overdueEndAge" />
                </el-form-item>
                <el-form-item label="联系状态：">
                    <el-select clearable size="small" v-model="queryParams.contactStatus" placeholder="请选择">
                        <el-option v-for="item in contactStatusOptions" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template #filter>
                <!--<el-form-item label="案件状态" class="custom-radio">-->
                <!--<el-radio-group v-model="queryParams.medFail" @change="changeStatus">-->
                <!--<el-radio label="">全部</el-radio>-->
                <!--<el-radio label="1">调解失败</el-radio>-->
                <!--</el-radio-group>-->
                <!--</el-form-item>-->

                <el-form-item label="案件状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.caseStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio :label="0">待分配</el-radio>
                        <el-radio :label="1">电话调解中</el-radio>
                        <el-radio :label="2">电话调解成功</el-radio>
                        <el-radio :label="3">电话调解失败</el-radio>
                        <el-radio :label="4">多元调解中</el-radio>
                        <el-radio :label="5">多元调解成功</el-radio>
                        <el-radio :label="6">多元调解失败</el-radio>

                        <!--<el-radio v-for="item in statusOptions" :label="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</el-radio>-->
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="财保状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.preStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in protects" :key="item.dictValue" :label="item.dictValue">
                            {{ item.dictLabel }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="委案状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.entrustStatus" @change="changeStatus">
                        <el-radio v-for="item in entrustType" :label="item.dictValue" :key="item.dictValue">
                            {{ item.dictLabel }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </template>
            <template #buttonArea> </template>
        </search-bar>
        <div class="queryDiv">
            查询结果统计：<span>列表案件量：{{otherParam.caseTotalCount?otherParam.caseTotalCount:''}}件；</span><span>列表标的金额：{{otherParam.subjectTotalAmount?otherParam.subjectTotalAmount:''}}元；</span><span>列表剩余待还总额：{{otherParam.totalRemainingBalance?otherParam.totalRemainingBalance:''}}元；</span>
        </div>
        <div class="box-contnet-wrap" style="margin-top:0">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <!-- <el-button
            type="success"
            size="mini"
            @click="batchMessage"
            :disabled="multiple"
            >批量生成律师函短信
          </el-button> -->
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" size="mini" @click="batchLawyer" :disabled="multiple">批量生成律师函
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" size="mini" :disabled="multiple" @click="handleAppleEdit"
                        v-hasPermi="['case:pretrial:letterRepair']">批量申请案件信修
                    </el-button>
                </el-col>
                <el-col :span="1.5" v-if="queryParams.preStatus">
                    <el-button v-if="queryParams.preStatus == 0 || queryParams.preStatus == 4" type="primary"
                        size="mini" :disabled="multiple" @click="handleprojectEdit"
                        v-hasPermi="['case:pretrial:letterRepair']">批量诉前财保申请
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button v-if="queryParams.caseStatus != 13&&token" type="danger" size="mini" :disabled="multiple"
                        @click="handleAppleCall">批量预测式外呼
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button v-if="queryParams.caseStatus != 13" type="success" size="mini" :disabled="multiple"
                        v-hasPermi="['shortMsg:sends']" @click="handleMessage">批量短信发送
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" size="mini" :disabled="multiple"
                        v-hasPermi="['case:pretrial:batchExportMediationRecord']" @click="batchExportMediationRecord">
                        批量导出调解记录
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" size="mini" :disabled="multiple"
                        v-hasPermi="['case:pretrial:batchExportNetworkAdjustRecord']" @click="batchExportAdjestMent">
                        批量导出网调记录
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="caseList" ref="multiTable" :row-key="getRowKeys"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="手机号" width="120" prop="respondentPhone" fixed="left" />
                <el-table-column label="姓名" width="100" prop="respondentName" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="最近一次调解标签" width="150" :formatter="getContactResultOptions" prop="mediationLabel"></el-table-column>
                <el-table-column label="最近一次调解时间" width="160" prop="mediateTime"></el-table-column>
                <el-table-column label="最近一次短信送达状态" width="160" prop="deliverStatus">
                    <template slot-scope="scope" v-if="scope.row.deliverStatus != null">
                        <span v-if="scope.row.providerType == 1">{{shisuyunStatusFormat(scope.row.deliverStatus) !=""?shisuyunStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                        <span v-if="scope.row.providerType == 2">{{wodongStatusFormat(scope.row.deliverStatus) !=""?wodongStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="账龄"  prop="overdueAge" />
                <el-table-column label="标的金额" width="150" prop="subjectAmount" :render-header="renderAmount" />
                <el-table-column label="已还金额" width="150" prop="paidAmount" :render-header="renderPaidAmount" />
                <el-table-column label="剩余待还总额" width="200" prop="remainingBalance" />
                <el-table-column label="还款状态" :formatter="getRepayStatus" prop="repayStatus">
                </el-table-column>
                <el-table-column label="合同号" width="150" prop="orderNo" :show-overflow-tooltip="true" />
                <el-table-column label="逾期天数" width="150" :render-header="renderOverdueDay" prop="overdueDay" />
                <el-table-column label="逾期年利率" prop="overYearRate" width="100" />
                <el-table-column label="联系状态" :formatter="getContactStatusOptions" prop="contactStatus">
                </el-table-column>
                <el-table-column label="案件分配时间" prop="distributionTime" width="120"
                    :render-header="renderDisTime">
                    <template slot-scope="scope" v-if="scope.row.distributionTime">
                        <span>{{
                            parseTime(scope.row.distributionTime, "{y}-{m}-{d}")
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="信修状态" :formatter="getLetterRepairStatus" prop="letterRepairStatus">
                </el-table-column>
                <el-table-column label="财保状态" :formatter="getProtects" prop="preStatus">
                </el-table-column>
                <el-table-column label="最近一次网调标签" width="150" :formatter="getAdjustType" prop="networkAdjustLabel">
                </el-table-column>
                <el-table-column label="最近一次网调时间" width="160" prop="networkAdjustTime">
                </el-table-column>
                <el-table-column label="调解员" prop="principalName" width="140" />
                <el-table-column label="委案状态" :formatter="getEntrustType" prop="entrustStatus">
                </el-table-column>
                <el-table-column label="订单号" prop="id" width="170" :show-overflow-tooltip="true" />
                <el-table-column label="案件状态" width="150" :show-overflow-tooltip="true" :formatter="statusFormat"
                    prop="caseStatus">
                </el-table-column>
                <el-table-column label="承诺还款日" width="150" prop="promiseRepayDate" :render-header="renderRepayDate">
                    <template slot-scope="scope">
                        <span>{{
                            parseTime(scope.row.promiseRepayDate, "{y}-{m}-{d}")
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="warning" @click="handleRecord(scope.row)"
                            v-hasPermi="['case:pretrial:record']">调解记录
                        </el-button>
                        <el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
                            v-hasPermi="['case:pretrial:query']">查看
                        </el-button>
                        <!-- <el-button
              size="mini"
              type="success"
              @click="handleExportMessage(scope.row)"
              >律师函短信
            </el-button> -->
                        <el-button size="mini" type="danger" @click="handleExport(scope.row)">律师函
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <el-dialog :title="form.title" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
            <el-form style="margin: 0 auto;" ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item v-if="form.title=='导出调解记录'" label="导出范围：" prop="exportRange">
                    <el-checkbox-group v-model="form.exportRange">
                        <el-checkbox :label="1">最近一次调解记录</el-checkbox>
                        <el-checkbox :label="2">全部调解记录</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="form.title=='导出网调记录'" label="导出范围：" prop="exportRange">
                    <el-checkbox-group v-model="form.exportRange">
                        <el-checkbox :label="1">最近一次网调记录</el-checkbox>
                        <el-checkbox :label="2">全部网调记录</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="form.title=='导出调解记录'" label="是否脱敏：" prop="isDesensitization">
                    <el-radio-group v-model="form.isDesensitization">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="phoneSubmit(form.title)">确 定</el-button>
            </span>
        </el-dialog>
        <!--<divisionDialog @refresh="getList" :title="divisionData.title" :show.sync="divisionData.dialogVisible" :id="divisionData.id"></divisionDialog>-->
        <recordDialog :title="recordData.title" :show.sync="recordData.dialogVisible" :id="recordData.id">
        </recordDialog>
        <exportDialog :requestApi="exportDialogData.requestApi" :title="exportDialogData.title"
            :show.sync="exportDialogData.dialogVisible" :id="exportDialogData.id"
            :contractNo="exportDialogData.contractNo" @refresh="clearSelection"></exportDialog>
        <batchExportDialog @refresh="clearSelection" :requestApi="batchData.requestApi" :title="batchData.title"
            :show.sync="batchData.dialogVisible" :params="batchData.params"></batchExportDialog>
        <testCall @refresh="clearSelection" :title="callData.title" :show.sync="callData.dialogVisible" :ids="callData.ids">
        </testCall>
        <batchExport @refresh="clearSelection" :title="batchexportData.title" :show.sync="batchexportData.dialogVisible"
            :red="batchexportData.red" :params="batchexportData.params"></batchExport>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import cuttingBeforeApi from "@/api/case/cuttingBefore/index";
    import exportDialog from "./exportDialog";
    // import divisionDialog from './divisionDialog'
    import recordDialog from "./recordDialog";
    import batchExportDialog from "./batchExportDialog";
    import divisionApi from "@/api/case/division/index";
    import testCall from "./testCall";
    import batchExport from "./batchExport";


    export default {
        name: "list",
        components: {
            SearchBar,
            recordDialog,
            exportDialog,
            batchExportDialog,
            testCall,
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
                    id: "",
                    batchNo: "",
                    pageNum: 1,
                    pageSize: 50,
                    mediator: "",
                    distributionTime: "",
                    promiseRepayDate: "",
                    respondentName: "",
                    replyContent:"",
                    respondentPhone: "",
                    respondentIdNo: "",
                    screenStatus:"",
                    orderNo: "",
                    screenType: "",
                    screenResult: "",
                    productName: "",
                    medLabel: "",
                    letterRepairStatus: "",
                    medFail: "",
                    caseStatus: "",
                    preStatus: "",
                    entrustStatus:"1",
                    orderByColumn: "",
                    isAsc: "",
                },
                statusOptions: [],
                repayStatus: [],
                exportDialogData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                    contractNo: "",
                    requestApi: "",
                },
                recordData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                contactResultOptions: [],
                letterRepairStatusOptions: [],
                checkFailure: false,
                selection: [],
                token: null,
                batchData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                    requestApi: "",
                    params: "",
                },
                userList: [],
                idList:[],
                chooseDaterange: [],
                networkSortresult: [],
                realtimeSortresult: [],
                screenType: [],
                adjustType: [],
                chooseDaterange1: [],
                chooseDaterange2: [],
                protects: [],
                entrustType:[],
                otherParam: {},
                callData: {
                    title: "",
                    dialogVisible: false,
                    ids: null,
                },
                batchexportData: {
                    title: "",
                    dialogVisible: false,
                    red: "",
                    params: "",
                },
                rules: {
                    exportRange: [{
                        required: true,
                        message: '请选择导出范围',
                        trigger: 'change'
                    }],
                    isDesensitization: [{
                        required: true,
                        message: '请选择是否脱敏',
                        trigger: 'change'
                    }]
                },
                form: {
                    exportRange: [],
                    isDesensitization: '1',
                },
                dialogVisible: false,
                getRowKeys(row) {
                    return row.id;
                },
                wodongStatus: [],
                shisuyunStatus: [],
                contactStatusOptions:[],
                shortmsgProviderType:[],
                screen_status:[]
            };
        },
        created() {
            this.getList(1);
            this.getUsers();
            //财保申请类型
            this.getDicts("wealth_protect").then((response) => {
                this.protects = response.data;
            });
            //案件状态
            this.getDicts("case_status").then((response) => {
                this.statusOptions = response.data;
            });
            //还款状态
            this.getDicts("repay_status").then((response) => {
                this.repayStatus = response.data;
            });
            //信修状态
            this.getDicts("letter_repair_status").then((response) => {
                this.letterRepairStatusOptions = response.data;
            });
            //调节标签状态
            this.getDicts("contact_status").then((response) => {
                this.contactResultOptions = response.data;
            });
            //号码筛选状态类型
            this.getDicts("screen_status").then((response) => {
                this.screen_status = response.data;
            });
            this.getDicts("contactStatus").then((response) => {
                this.contactStatusOptions = response.data;
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
            //网调标签
            this.getDicts("network_adjust_label").then((response) => {
                this.adjustType = response.data;
            });
            //委案状态
            this.getDicts("entrust_status").then((response) => {
                this.entrustType = response.data;
            });
            //沃动标签
            this.getDicts("wodong_deliver_status").then((response) => {
                this.wodongStatus = response.data;
            });
            //时速云标签
            this.getDicts("shisuyun_deliver_status").then((response) => {
                this.shisuyunStatus = response.data;
            });
            //短信渠道类型
            this.getDicts("shortmsg_provider_type").then((response) => {
                this.shortmsgProviderType = response.data;
            });
            //度言id
            let token = JSON.parse(sessionStorage.getItem("token"));
            if (token != 0) {
                this.token = true;
            } else {
                this.token = false;
            }
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
                this.idList = [];
                this.loading = true;
                //查询
                if(type == 1){
		            this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    cuttingBeforeApi.list(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearSelection();
                        this.otherParam = response.otherParam;
                        this.caseList = response.rows;
                        response.rows.forEach(element => {
                            this.idList.push(element.id)
                        });
                        this.total = response.total;
                        this.loading = false;
                    });
                }
                //切换页
                else if(type == 2){
                    cuttingBeforeApi.list(this.searchParams).then((response) => {
                        this.otherParam = response.otherParam;
                        this.caseList = response.rows;
                        response.rows.forEach(element => {
                            this.idList.push(element.id)
                        });
                        this.total = response.total;
                        this.loading = false;
                    });
                }
            },
            changeStatus() {
                this.getList(1);
            },
            handleAppleCall() {
                if (this.selection.filter((item) => item.caseStatus == 13).length > 0) {
                    this.msgError("所选数据存在已结案的数据，不能批量拨打");
                    return;
                }
                this.callData.ids = this.ids.join(",");
                this.callData.title = "个人预测试外呼计划";
                this.callData.dialogVisible = true;
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
                this.single = selection.length != 1;
                this.multiple = !selection.length;
            },
            // /** 律师函短信 */
            // handleExportMessage(item) {
            //   //console.log(item)
            //   this.exportDialogData.title = "生成律师函短信";
            //   this.exportDialogData.dialogVisible = true;
            //   this.exportDialogData.id = item.id;
            //   this.exportDialogData.contractNo = item.orderNo;
            //   this.exportDialogData.requestApi = "/case/pretrial/sms/";
            // },
            /** 律师函 */
            handleExport(item) {
                this.exportDialogData.title = "生成律师函";
                this.exportDialogData.dialogVisible = true;
                this.exportDialogData.id = item.id;
                this.exportDialogData.contractNo = item.orderNo;
                this.exportDialogData.requestApi = "/case/pretrial/instrument/";
            },
            // //批量生成律师函短信
            // batchMessage() {
            //   this.batchData.title = "批量生成律师函短信";
            //   this.batchData.dialogVisible = true;
            //   this.batchData.requestApi = "/case/pretrial/sms/batch";
            //   this.batchData.params = this.ids.join(",");
            // },
            //批量生成律师函
            batchLawyer() {
                this.batchData.title = "批量生成律师函";
                this.batchData.dialogVisible = true;
                this.batchData.requestApi = "/case/pretrial/instrument/batch";
                this.batchData.params = this.ids.join(",");
            },
            handleUpdate(item) {
                this.$router.push({
                    name: "cutBeforeInfo",
                    query: {
                        beforeId: item.id,
                        beforeList:this.idList
                    }
                });
            },
            handleRecord(item) {
                this.recordData.title = "调解记录";
                this.recordData.dialogVisible = true;
                this.recordData.id = item.id;
            },
            // 案件状态字典翻译
            statusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.caseStatus);
            },
            //还款状态
            getRepayStatus(row, column) {
                return this.selectDictLabel(this.repayStatus, row.repayStatus);
            },
            //联系状态
            getContactStatusOptions(row, column) {
                return this.selectDictLabel(this.contactStatusOptions, row.contactStatus);
            },
            //信修状态
            getLetterRepairStatus(row, column) {
                return this.selectDictLabel(
                    this.letterRepairStatusOptions,
                    row.letterRepairStatus
                );
            },
            //财保状态
            getProtects(row, column) {
                return this.selectDictLabel(this.protects, row.preStatus);
            },
            //网调标签
            getAdjustType(row, column) {
                return this.selectDictLabel(this.adjustType, row.networkAdjustLabel);
            },
            //调解标签
            getContactResultOptions(row, column) {
                return this.selectDictLabel(this.contactResultOptions, row.mediationLabel);
            },
            //委案状态
            getEntrustType(row, column) {
                return this.selectDictLabel(this.entrustType, row.entrustStatus);
            },
            //沃动标签
            wodongStatusFormat(deliverStatus) {
                return this.selectDictLabel(this.wodongStatus, deliverStatus);
            },
            //时速云标签
            shisuyunStatusFormat(deliverStatus) {
                return this.selectDictLabel(this.shisuyunStatus, deliverStatus);
            },
            //申请案件信修
            handleAppleEdit() {
                let cannotChoose = [];
                this.selection.forEach((item) => {
                    if (item.letterRepairStatus == 1 || item.letterRepairStatus == 2) {
                        cannotChoose.push(item.id);
                    }
                });
                //console.log(cannotChoose)
                if (cannotChoose.length > 0) {
                    let a = cannotChoose[0];
                    this.$message.error({
                        dangerouslyUseHTMLString: true,
                        message: `订单${a}未完成信修申请，不能重复提交`,
                    });
                } else {
                    var that = this;
                    this.$confirm(`是否申请信修?`, "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        })
                        .then(() => {
                            let param = {
                                ids: that.ids.join(","),
                            };
                            cuttingBeforeApi.applyCaseEdit(param).then((res) => {
                                if (res.code === 200) {
                                    that.msgSuccess(res.msg);
                                    that.clearSelection();
                                }else if (res.code === 500) {
                                    that.msgError(res.msg);
                                }
                            });
                        })
                        .catch(() => {
                            that.msgError("已取消操作");
                        });
                }
            },
            //导出调解记录
            batchExportMediationRecord() {
                // if (this.selection.filter((item) => item.caseStatus == 13).length > 0) {
                //   this.msgError("所选数据存在已结案的数据，不能批量筛选号码");
                //   return;
                // }  
                this.form.title = '导出调解记录';
                this.form.exportRange = [];
                this.form.isDesensitization = 1;
                this.dialogVisible = true;
            },
            //导出网调记录
            batchExportAdjestMent() {
                // if (this.selection.filter((item) => item.caseStatus == 13).length > 0) {
                //   this.msgError("所选数据存在已结案的数据，不能批量筛选号码");
                //   return;
                // }  
                this.form.title = '导出网调记录';
                this.form.exportRange = [];
                this.form.isDesensitization = 1;
                this.dialogVisible = true;
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            phoneSubmit(title) {
                if (title == '导出调解记录') {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            let queryParams = {
                                caseIds: this.ids.join(","),
                                exportRange: this.form.exportRange.toString(),
                                isDesensitization: this.form.isDesensitization,
                            };
                            cuttingBeforeApi.batchExportMediationRecord(queryParams).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.dialogVisible = false;
                                    this.clearSelection();
                                    this.download(res.msg);
                                }
                            })
                        }
                    });
                } else if (title == '导出网调记录') {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            let queryParams = {
                                caseIds: this.ids.join(","),
                                exportRange: this.form.exportRange.toString(),
                            };
                            cuttingBeforeApi.batchExportNetworkAdjustRecord(queryParams).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.dialogVisible = false;
                                    this.clearSelection();
                                    this.download(res.msg);
                                }
                            })
                        }
                    });
                }

            },
            //申请财保
            handleprojectEdit() {
                let cannotChoose = [];
                this.selection.forEach((item) => {

                    if (item.preStatus == 0 || item.preStatus == 4) {
                        cannotChoose.push(item.id);
                    }
                });
                var that = this;
                this.$confirm(`是否申请诉前财保?`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        let ids = that.ids.join(",");
                        cuttingBeforeApi.caseProperty(ids).then((res) => {
                            if (res.code === 200) {
                                that.msgSuccess("操作成功");
                                that.clearSelection();
                            }
                        });
                    })
                    .catch(() => {
                        that.msgError("已取消操作");
                    });
            },
            //获取调解员
            getUsers() {
                divisionApi.userList().then((response) => {
                    //console.log(response)
                    this.userList = response.data.userList || [];
                    // for (var i = 0; i < this.userList.length; i++) {
                    //     this.userList[i].parentId = this.userList[i].deptId
                    //     delete this.userList[i].deptId
                    // }
                });
            },
            btnAmount1() {
                this.searchParams.orderByColumn = "subjectAmount asc";
                this.getList(2);
            },
            btnAmount2() {
                this.searchParams.orderByColumn = "subjectAmount desc";
                this.getList(2);
            },
            btnPaidAmount1() {
                this.searchParams.orderByColumn = "paidAmount asc";
                this.getList(2);
            },
            btnPaidAmount2() {
                this.searchParams.orderByColumn = "paidAmount desc";
                this.getList(2);
            },
            btnRepayDate1() {
                this.searchParams.orderByColumn = "promiseRepayDate asc";
                this.getList(2);
            },
            btnRepayDate2() {
                this.searchParams.orderByColumn = "promiseRepayDate desc";
                this.getList(2);
            },
            btnDisTime1() {
                this.searchParams.orderByColumn = "distributionTime asc";
                this.getList(2);
            },
            btnDisTime2() {
                this.searchParams.orderByColumn = "distributionTime desc";
                this.getList(2);
            },
            btnOverdueDay1() {
                this.searchParams.orderByColumn = "overdueDay asc";
                this.getList(2);
            },
            btnOverdueDay2() {
                this.searchParams.orderByColumn = "overdueDay desc";
                this.getList(2);
            },
            resetAll() {
                this.chooseDaterange = [];
                this.chooseDaterange1 = [];
                this.chooseDaterange2 = [];
            },
            handleChange(value) {
                //console.log(value)
                if (value == null) {
                    this.queryParams.disBeginTime = "";
                    this.queryParams.disEndTime = "";
                } else {
                    this.queryParams.disBeginTime = value[0];
                    this.queryParams.disEndTime = value[1];
                }
            },
            handleChange1(value) {
                //console.log(value)
                if (value == null) {
                    this.queryParams.repayBeginTime = "";
                    this.queryParams.repayEndTime = "";
                } else {
                    this.queryParams.repayBeginTime = value[0];
                    this.queryParams.repayEndTime = value[1];
                }
            },
            handleChange2(value) {
                //console.log(value)
                if (value == null) {
                    this.queryParams.lastMediateBeginTime = "";
                    this.queryParams.lastMediateEndTime = "";
                } else {
                    this.queryParams.lastMediateBeginTime = value[0];
                    this.queryParams.lastMediateEndTime = value[1];
                }
            },
            //打开发送短信的弹窗
            handleMessage() {
                if (this.selection.filter((item) => item.caseStatus == 13).length > 0) {
                    this.msgError("所选数据存在已结案的数据，不能批量发送短信");
                    return;
                }
                this.batchexportData.title = "批量短信发送";
                this.batchexportData.dialogVisible = true;
                this.batchexportData.red = false;
                this.batchexportData.params = this.ids.join(",");
            },
            renderOverdueDay(){
              return (
                <div style="display: flex;align-items: center;">
                  <span> 逾期天数 </span>
                  <span class="sorting">
                    <i class="el-icon-caret-top" onClick={this.btnOverdueDay1}></i>
                    <i class="el-icon-caret-bottom" onClick={this.btnOverdueDay2}></i>
                  </span>
                </div>
              );
            },
            renderAmount() {
              return (
                <div style="display: flex;align-items: center;">
                  <span> 标的金额 </span>
                  <span class="sorting">
                    <i class="el-icon-caret-top" onClick={this.btnAmount1}></i>
                    <i class="el-icon-caret-bottom" onClick={this.btnAmount2}></i>
                  </span>
                </div>
              );
            },
            renderPaidAmount() {
              return (
                <div style="display: flex;align-items: center;">
                  <span> 已还金额 </span>
                  <span class="sorting">
                    <i class="el-icon-caret-top" onClick={this.btnPaidAmount1}></i>
                    <i class="el-icon-caret-bottom" onClick={this.btnPaidAmount2}></i>
                  </span>
                </div>
              );
            },
            renderRepayDate() {
              return (
                <div style="display: flex;align-items: center;">
                  <span> 承诺还款日 </span>
                  <span class="sorting">
                    <i class="el-icon-caret-top" onClick={this.btnRepayDate1}></i>
                    <i class="el-icon-caret-bottom" onClick={this.btnRepayDate2}></i>
                  </span>
                </div>
              );
            },
            renderDisTime() {
              return (
                <div style="display: flex;align-items: center;">
                  <span> 案件分配时间 </span>
                  <span class="sorting">
                    <i class="el-icon-caret-top" onClick={this.btnDisTime1}></i>
                    <i class="el-icon-caret-bottom" onClick={this.btnDisTime2}></i>
                  </span>
                </div>
              );
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
            /*width: 20%;*/
            margin-right: 10px;
            margin-bottom: 20px;
        }
    }

    .queryDiv {
        height: 30px;
        padding: 5px 20px;
        background: #FCFFC9;

        span {
            margin-left: 15px;
        }
    }

    .queryDivTwo {
        height: 20px;
    }

</style>
