<template>
    <div class="app-container">
        <search-bar
            v-show="showSearch"
            :model="queryParams"
            :has-filter="hasFilter"
            :flag="true"
            @submit="getList(1)"
            @resetAll="resetAll"
        >
            <template #default>
                <el-form-item label="案件批次号：">
                    <el-input
                        clearable
                        v-model="queryParams.batchNo"
                        placeholder="请输入案件批次号"
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="财保批次号：">
                    <el-input
                        clearable
                        v-model="queryParams.proBatchNo"
                        placeholder="请输入财保批次号"
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="借款平台名称：">
                    <el-input
                        clearable
                        v-model="queryParams.platform"
                        placeholder="请输入借款平台名称"
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input
                        clearable
                        v-model="queryParams.id"
                        placeholder="请输入订单号"
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="调解员：">
                    <el-select
                        clearable
                        multiple
                        collapse-tags
                        filterable
                        size="small"
                        v-model="queryParams.principals"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in userList"
                            :key="item.userId"
                            :label="item.userName"
                            :value="item.userId"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input
                        v-model="queryParams.respondentName"
                        placeholder="请输入姓名，多个姓名用英文逗号连接"
                        clearable
                        type="textarea"
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input
                        clearable
                        v-model="queryParams.respondentPhone"
                        placeholder="请输入手机号"
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="身份证号：">
                    <el-input
                        v-model="queryParams.respondentIdNo"
                        placeholder="请输入身份证号，多个身份证号用英文逗号连接"
                        clearable
                        size="small"
                        style="width: 240px"
                        type="textarea"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="合同号：">
                    <el-input
                        clearable
                        v-model="queryParams.orderNo"
                        placeholder="请输入合同号，多个合同号用英文逗号连接"
                        type="textarea"
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input
                        v-model="queryParams.remark"
                        placeholder="请输入备注查询内容"
                        clearable
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="证据材料：">
                    <el-select
                        clearable
                        multiple
                        collapse-tags
                        filterable
                        size="small"
                        v-model="queryParams.paperInfo"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in evidenceOptions"
                            :key="item.dictValue"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="材料情况：">
                    <el-select
                        filterable
                        size="small"
                        v-model="queryParams.exist"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template #filter>
                <el-form-item
                    label-width="125px"
                    label="共债仅展示一条："
                    class="custom-radio"
                >
                    <el-switch
                        @change="changeStatus"
                        style="margin-top:-15px"
                        v-model="queryParams.commonFlag"
                        :active-value="1"
                        :inactive-value="-1"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                    >
                    </el-switch>
                </el-form-item>
                <el-form-item
                    label-width="125px"
                    label="扩选排序功能："
                    class="custom-radio"
                >
                    <el-switch
                        @change="changeExtensive"
                        style="margin-top:-15px"
                        v-model="extensive"
                        :active-value="1"
                        :inactive-value="-1"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                    >
                    </el-switch>
                </el-form-item>
                <el-form-item
                    label="排序依据："
                    v-if="extensive == 1"
                    class="custom-radio"
                >
                    <el-radio-group v-model="queryParams.sortExtColumn">
                        <el-radio
                            v-for="item in sortOptions"
                            :key="item.dictValue"
                            :label="item.dictValue"
                        >
                            {{ item.dictLabel }}</el-radio
                        >
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="案件状态：" class="custom-radio">
                    <el-checkbox-group
                        v-model="queryParams.caseStatuss"
                        @change="changeStatus"
                    >
                        <el-checkbox
                            v-for="item in statusOptions"
                            v-show="item.dictValue != 0"
                            :label="item.dictValue"
                            :key="item.dictValue"
                        >
                            {{ item.dictLabel }}</el-checkbox
                        >
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="还款状态：" class="custom-radio">
                    <el-radio-group
                        v-model="queryParams.repayStatus"
                        @change="changeStatus"
                    >
                        <el-radio label="">全部</el-radio>
                        <el-radio
                            v-for="item in repayStatus"
                            :key="item.dictValue"
                            :label="item.dictValue"
                        >
                            {{ item.dictLabel }}</el-radio
                        >
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="财保状态：" class="custom-radio">
                    <el-radio-group
                        v-model="queryParams.preStatus"
                        @change="changeStatus"
                    >
                        <el-radio label="">全部</el-radio>
                        <el-radio
                            v-for="item in protects"
                            :key="item.dictValue"
                            :label="item.dictValue"
                        >
                            {{ item.dictLabel }}</el-radio
                        >
                    </el-radio-group>
                </el-form-item>
            </template>
            <template #buttonArea></template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button
                        v-if="
                            queryParams.caseStatuss.indexOf('13') > -1 == false
                        "
                        type="danger"
                        size="mini"
                        :disabled="multiple"
                        @click="handleCaseStatusMessage(1)"
                        v-hasPermi="['case:clerical:batchSMSFile']"
                        >批量短信发送(旧)
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button
                        v-if="
                            queryParams.caseStatuss.indexOf('13') > -1 == false
                        "
                        type="danger"
                        size="mini"
                        :disabled="multiple"
                        @click="handleCaseStatusMessage(2)"
                        v-hasPermi="['case:clerical:batchSMS']"
                        >批量短信发送
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button
                        v-if="
                            queryParams.caseStatuss.indexOf('13') > -1 == false
                        "
                        type="success"
                        size="mini"
                        @click="handleCaseStatusMessageAll"
                        v-hasPermi="['case:clerical:batchSMSAll']"
                        >全选短信发送
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button
                        type="warning"
                        icon="el-icon-download"
                        size="mini"
                        @click="batchBook"
                        :disabled="multiple"
                        v-hasPermi="['case:clerical:instrumentBatch']"
                        >批量生成调解文书
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button
                        type="success"
                        icon="el-icon-download"
                        size="mini"
                        @click="batchBookAll"
                        v-hasPermi="['case:clerical:instrumentBatchAll']"
                        >全选生成调解文书
                    </el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-share" size="mini" @click="batchMessage"
                        :disabled="multiple" v-hasPermi="['case:clerical:noticeBatch']">批量生成短信/邮件
                    </el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button
                        type="primary"
                        icon="el-icon-download"
                        size="mini"
                        @click="batchBookTwo"
                        :disabled="multiple"
                        v-hasPermi="['case:clerical:instrumentBatch']"
                        >批量生成多人多案文书
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button
                        type="success"
                        icon="el-icon-download"
                        size="mini"
                        @click="batchBookTwoAll"
                        v-hasPermi="['case:clerical:mumc:instrumentBatchAll']"
                        >全选生成多人多案文书
                    </el-button>
                </el-col>
                <right-toolbar
                    :showSearch.sync="showSearch"
                    @queryTable="getList(2)"
                    @clearTick="clearSelection"
                >
                </right-toolbar>
            </el-row>

            <el-table
                v-loading="loading"
                max-height="550"
                :data="caseList"
                @sort-change="handleSortChange"
                ref="multiTable"
                :row-key="getRowKeys"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    :reserve-selection="true"
                    width="55"
                    align="center"
                    fixed="left"
                />
                <el-table-column
                    prop="commonFlag"
                    label="标签"
                    width="100"
                    align="center"
                    fixed="left"
                >
                    <template
                        slot-scope="scope"
                        v-if="scope.row.commonFlag == 1"
                    >
                        <el-tag type="danger">共债</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="案件批次号"
                    prop="batchNo"
                    width="110"
                    :show-overflow-tooltip="true"
                    fixed="left"
                />
                <el-table-column
                    label="姓名"
                    prop="respondentName"
                    :show-overflow-tooltip="true"
                    fixed="left"
                    width="80"
                />
                <el-table-column
                    label="手机号"
                    prop="respondentPhone"
                    width="120"
                />
                <el-table-column
                    label="身份证号"
                    width="180"
                    prop="respondentIdNo"
                    sortable="custom"
                    :sort-orders="['descending', 'ascending']"
                />
                <el-table-column
                    label="标的金额"
                    width="150"
                    prop="subjectAmount"
                    sortable="custom"
                    :sort-orders="['descending', 'ascending']"
                />
                <el-table-column
                    label="剩余待还本金"
                    prop="overdueCapital"
                    width="150"
                    sortable="custom"
                    :sort-orders="['descending', 'ascending']"
                />
                <el-table-column
                    label="逾期年利率"
                    prop="overYearRate"
                    width="100"
                />
                <el-table-column
                    label="户籍地址"
                    prop="respondentAddress"
                    width="150"
                    :show-overflow-tooltip="true"
                />
                <el-table-column
                    label="合同地址"
                    prop="contractAddr"
                    width="150"
                    :show-overflow-tooltip="true"
                />
                <el-table-column
                    label="还款状态"
                    :formatter="getRepayStatus"
                    prop="repayStatus"
                />
                <el-table-column
                    label="剩余待还总额"
                    prop="remainingBalance"
                    width="150"
                    sortable="custom"
                    :sort-orders="['descending', 'ascending']"
                />
                <el-table-column
                    label="资产最终受让方"
                    prop="assetLastAssignee"
                    width="160"
                    :show-overflow-tooltip="true"
                />
                <el-table-column
                    label="调解员"
                    prop="principalName"
                    width="120"
                />
                <el-table-column
                    label="案件状态"
                    :formatter="statusFormat"
                    prop="caseStatus"
                    width="120"
                />
                <el-table-column
                    label="财保状态"
                    :formatter="getProtects"
                    prop="preStatus"
                    width="120"
                />
                <el-table-column
                    label="借款合同"
                    prop="loanContract"
                    width="100"
                >
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.loanContract == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="身份证正面" prop="ocrPhoto" width="120">
                    <template slot-scope="scope">
                        <span>{{ scope.row.ocrPhoto == 0 ? "无" : "有" }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="身份证反面"
                    prop="idcardReverse"
                    width="120"
                >
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.idcardReverse == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="放款凭证" prop="loanCertificate">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.loanCertificate == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="注册协议" prop="registProtocol">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.registProtocol == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="授权协议" prop="authProtocol">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.authProtocol == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="融担合同" prop="financeContract">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.financeContract == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="还款详情" prop="repayDetails">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.repayDetails == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="活体照片" prop="livingPhotos">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.livingPhotos == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="服务申请协议"
                    prop="serviceProtocol"
                    width="150"
                >
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.serviceProtocol == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="收货确认书"
                    prop="receiptConfirm"
                    width="150"
                >
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.receiptConfirm == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="还款记录" prop="repayRecord">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.repayRecord == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="担保合同" prop="guaranteeContract">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.guaranteeContract == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="催收记录" prop="collectionRecord">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.collectionRecord == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="代偿证明" prop="transferProve">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.transferProve == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="用户电子签章授权"
                    prop="userSignAuth"
                    width="160"
                >
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.userSignAuth == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="债权转让合同"
                    prop="transferContract"
                    width="150"
                >
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.transferContract == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="债转发送凭证"
                    prop="transferVoucher"
                    width="150"
                >
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.transferVoucher == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="银行回单" prop="bankReceipt">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.bankReceipt == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="物流信息" prop="logisticsInfo">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.logisticsInfo == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单详情" prop="orderDetail">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.orderDetail == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="其他" prop="otherFile">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.otherFile == 0 ? "无" : "有"
                        }}</span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="操作"
                    width="160"
                    fixed="right"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            v-if="scope.row.entrustStatus != 3"
                            @click="handleUpdate(scope.row)"
                            v-hasPermi="['case:clerical:query']"
                            >查看
                        </el-button>
                        <!-- <el-button size="mini" type="warning" @click="handleMediation(scope.row)"
                            v-hasPermi="['case:clerical:instrument']">生成调解文书
                        </el-button> -->
                    </template>
                </el-table-column>
            </el-table>

            <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize"
                @pagination="getList(2)"
            />
        </div>
        <mediationBook
            @refresh="clearSelection"
            :params="mediationBookData.params"
            :selection="mediationBookData.selection"
            :title="mediationBookData.title"
            :show.sync="mediationBookData.dialogVisible"
            :id="mediationBookData.id"
            :total="mediationBookData.total"
        ></mediationBook>
        <batchExportDialog
            @refresh="clearSelection"
            :title="batchexportDialogData.title"
            :show.sync="batchexportDialogData.dialogVisible"
            :red="batchexportDialogData.red"
            :params="batchexportDialogData.params"
            :total="batchexportDialogData.total"
        ></batchExportDialog>
    </div>
</template>

<script>
import SearchBar from "@/components/SearchBar/index";
import templateApi from "@/api/case/document/templateIndex";
import mediationBook from "./mediationBook";
import batchExportDialog from "./batchExportDialog";
import divisionApi from "@/api/case/division/index";

export default {
    name: "caseList",
    components: {
        SearchBar,
        mediationBook,
        batchExportDialog
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
            repayStatus: [],
            // 查询参数
            searchParams: {},
            queryParams: {
                id: "",
                batchNo: "",
                pageNum: 1,
                pageSize: 50,
                principal: "",
                mediator: "",
                respondentName: "",
                respondentPhone: "",
                respondentIdNo: "",
                orderNo: "",
                preStatus: "",
                repayStatus: "",
                caseStatuss: [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12"
                ], //默认勾选除已结案外的所有状态
                exist: 1,
                commonFlag: -1,
                sortExtColumn: "",
                orderByColumn: "",
                isAsc: ""
            },
            entrustType: [],
            statusOptions: [],
            recordData: {
                title: "",
                dialogVisible: false,
                id: ""
            },
            selection: [],
            mediationBookData: {
                title: "",
                dialogVisible: false,
                id: "",
                params: "",
                selection: [],
                total: ""
            },
            userList: [],
            getRowKeys(row) {
                return row.id;
            },
            batchexportDialogData: {
                title: "",
                dialogVisible: false,
                red: "",
                params: "",
                total: ""
            },
            sortOptions: [],
            protects: [],
            evidenceOptions: [],
            options: [
                {
                    value: 1,
                    label: "有"
                },
                {
                    value: -1,
                    label: "无"
                }
            ],
            extensive: ""
        };
    },
    created() {
        this.getList(1);
        this.getUsers();
        //案件状态
        this.getDicts("case_status").then(response => {
            this.statusOptions = response.data;
        });
        //还款状态
        this.getDicts("repay_status").then(response => {
            this.repayStatus = response.data;
        });
        //财保状态
        this.getDicts("wealth_protect").then(response => {
            this.protects = response.data;
        });
        //证据材料
        this.getDicts("evidence_package_detail").then(response => {
            this.evidenceOptions = response.data;
        });
        //排序状态
        this.getDicts("sort_ext_column").then(response => {
            this.sortOptions = response.data;
        });
    },
    // 是否显示过滤栏， 扣除页数，每页显示数，总数量参数，3个内的搜索参数，直接显示一行，不显示过滤
    computed: {
        hasFilter: {
            get() {
                return true;
            }
        }
    },
    methods: {
        /** 查询角色列表 */
        getList(type) {
            this.queryParams.commonFlag = this.queryParams.commonFlag
                ? this.queryParams.commonFlag
                : -1;
            //查询
            if (type == 1) {
                // if (this.extensive == 1&&this.queryParams.sortExtColumn == "") {
                //     this.msgError("排序依据未选择，不能进行扩选查询！");
                //     return;
                // }
                //姓名排序
                if (
                    this.queryParams.sortExtColumn == "respondentName" &&
                    this.queryParams.respondentName == ""
                ) {
                    this.msgError("姓名内容未填写，不能进行扩选查询！");
                    return;
                    //身份证排序
                } else if (
                    this.queryParams.sortExtColumn == "respondentIdNo" &&
                    this.queryParams.respondentIdNo == ""
                ) {
                    this.msgError("身份证内容未填写，不能进行扩选查询！");
                    return;
                    //合同号排序
                } else if (
                    this.queryParams.sortExtColumn == "orderNo" &&
                    this.queryParams.orderNo == ""
                ) {
                    this.msgError("合同号内容未填写，不能进行扩选查询！");
                    return;
                }
                this.loading = true;
                this.searchParams = JSON.parse(
                    JSON.stringify(this.queryParams)
                );
                templateApi
                    .caseList(this.searchParams)
                    .then(response => {
                        this.queryParams.orderByColumn = "";
                        this.caseList = response.rows || [];
                        this.total = response.total;
                        this.clearSelection();
                        this.clearTable();
                        this.loading = false;
                    })
                    .catch(() => {
                        this.caseList = [];
                        this.total = 0;
                        this.loading = false;
                    });
            }
            //切换页
            else if (type == 2) {
                this.loading = true;
                templateApi
                    .caseList(this.searchParams)
                    .then(response => {
                        this.caseList = response.rows || [];
                        this.total = response.total;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.caseList = [];
                        this.total = 0;
                        this.loading = false;
                    });
            }
        },
        // 案件状态字典翻译
        statusFormat(row, column) {
            return this.selectDictLabel(this.statusOptions, row.caseStatus);
        },
        getRepayStatus(row, column) {
            return this.selectDictLabel(this.repayStatus, row.repayStatus);
        },
        //财保状态
        getProtects(row, column) {
            return this.selectDictLabel(this.protects, row.preStatus);
        },
        /** 排序触发事件 */
        handleSortChange(column, prop, order) {
            if (column.order) {
                this.searchParams.orderByColumn = column.prop;
                this.searchParams.isAsc = column.order;
                this.getList(2);
            } else {
                this.searchParams.orderByColumn = "";
                this.searchParams.isAsc = "";
                this.getList(2);
            }
        },
        clearTable() {
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
            this.ids = selection.map(item => item.id);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        handleUpdate(item) {
            if (["1", "2", "3", "4", "5", "6"].includes(item.caseStatus)) {
                this.$router.push({
                    name: "cutBeforeInfo",
                    query: {
                        beforeId: item.id
                    }
                });
            } else if (
                ["7", "8", "9", "10", "11", "12"].includes(item.caseStatus)
            ) {
                this.$router.push({
                    name: "cutAfterInfo",
                    query: {
                        afterId: item.id
                    }
                });
            }
        },
        // handleMediation(item) {
        //     this.mediationBookData.title = "生成调解文书";
        //     this.mediationBookData.dialogVisible = true;
        //     this.mediationBookData.id = item.id;
        //     this.mediationBookData.requestApi = "/case/caseInfo/instrument";
        //     this.mediationBookData.params = "";
        // },
        batchBook() {
            this.mediationBookData.title = "批量生成调解文书";
            this.mediationBookData.dialogVisible = true;
            this.mediationBookData.params = this.ids;
            this.mediationBookData.id = "";
        },
        batchBookAll() {
            this.mediationBookData.title = "全选生成调解文书";
            this.mediationBookData.dialogVisible = true;
            this.mediationBookData.total = this.total;
            this.mediationBookData.id = "";
        },
        batchBookTwo() {
            this.mediationBookData.title = "批量生成多人多案文书";
            this.mediationBookData.selection = this.selection;
            this.mediationBookData.dialogVisible = true;
            this.mediationBookData.params = this.ids.join(",");
            this.mediationBookData.id = "";
        },
        batchBookTwoAll() {
            this.mediationBookData.title = "全选生成多人多案文书";
            this.mediationBookData.selection = this.selection;
            this.mediationBookData.dialogVisible = true;
            this.mediationBookData.total = this.total;
            this.mediationBookData.params = this.ids.join(",");
            this.mediationBookData.id = "";
        },
        changeStatus() {
            this.getList(1);
        },
        //打开发送短信的弹窗
        handleCaseStatusMessage(type) {
            if (
                this.selection.filter(item => item.caseStatus == 13).length > 0
            ) {
                this.msgError("所选数据存在已结案的数据，不能批量发送短信");
                return;
            }
            if (type == 1) {
                this.batchexportDialogData.title = "批量短信发送(旧)";
            } else {
                this.batchexportDialogData.title = "批量短信发送";
            }
            this.batchexportDialogData.dialogVisible = true;
            this.batchexportDialogData.red = false;
            this.batchexportDialogData.params = this.ids.join(",");
        },
        //打开发送短信的弹窗
        handleCaseStatusMessageAll() {
            this.batchexportDialogData.title = "全选短信发送";
            this.batchexportDialogData.dialogVisible = true;
            this.batchexportDialogData.total = this.total;
            this.batchexportDialogData.red = false;
        },
        clearSelection() {
            if (this.caseList.length > 0) {
                this.$refs.multiTable.clearSelection(); //清除选中的数据
                this.ids = [];
                this.selection = [];
            }
        },
        //获取调解员
        getUsers() {
            divisionApi.userList().then(response => {
                this.userList = response.data.userList || [];
                // for (var i = 0; i < this.userList.length; i++) {
                //     this.userList[i].parentId = this.userList[i].deptId
                //     delete this.userList[i].deptId
                // }
            });
        },
        resetAll() {
            this.extensive = -1;
            this.queryParams.commonFlag = -1;
            this.queryParams.exist = 1;
            this.queryParams.caseStatuss = [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12"
            ];
        },
        //扩选排序
        changeExtensive(value) {
            if (value == -1) {
                this.queryParams.sortExtColumn = "";
            }
        }
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
