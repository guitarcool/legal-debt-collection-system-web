<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="订单号：">
                    <el-input v-model="queryParams.caseId" placeholder="请输入订单号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable size="small" style="width: 240px"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="身份证正面：" prop="haveOcrPhoto">
                    <el-select clearable size="small" filterable v-model="queryParams.haveOcrPhoto" placeholder="请选择">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授权协议：" prop="haveAuthProtocol">
                    <el-select clearable size="small" filterable v-model="queryParams.haveAuthProtocol"
                        placeholder="请选择">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="放款凭证：" prop="haveLoanCertificate">
                    <el-select clearable size="small" filterable v-model="queryParams.haveLoanCertificate"
                        placeholder="请选择">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="注册协议：" prop="haveRegistProtocol">
                    <el-select clearable size="small" filterable v-model="queryParams.haveRegistProtocol"
                        placeholder="请选择">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="融担协议：" prop="haveFinanceContract">
                    <el-select clearable size="small" filterable v-model="queryParams.haveFinanceContract"
                        placeholder="请选择">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="还款详情：" prop="haveRepayDetails">
                    <el-select clearable size="small" filterable v-model="queryParams.haveRepayDetails"
                        placeholder="请选择">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="还款记录：" prop="haveRepayRecord">
                    <el-select clearable size="small" filterable v-model="queryParams.haveRepayRecord"
                        placeholder="请选择">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template #filter>

            </template>
            <template #buttonArea>

            </template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleImport"
                        v-hasPermi="['evidence:detail:batchImportData']">证据包导入
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="info" icon="el-icon-plus" size="mini" :disabled="single" @click="deleteData">删除
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-plus" size="mini"
                        v-hasPermi="['evidence:package:removeAll']" @click="deleteDataAll">全选删除
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" icon="el-icon-download" size="mini" :disabled="multiple"
                        @click="handleExport" v-hasPermi="['evidence:package:detailExport']">导出
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-download" size="mini" @click="handleExportAll"
                        v-hasPermi="['evidence:package:detailExportAll']">全选导出
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" icon="el-icon-download" size="mini" @click="handleDownZip"
                        :disabled="multiple" v-hasPermi="['evidence:package:download']">下载证据包
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-download" size="mini" @click="handleDownZipAll"
                        v-hasPermi="['evidence:package:downloadAll']">全选下载证据包
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" icon="el-icon-download" size="mini" @click="handleMessage(1)"
                        :disabled="multiple" v-hasPermi="['evidence:package:mail']">生成通知邮件
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-download" size="mini" @click="handleMessageAll(1)"
                        v-hasPermi="['evidence:package:mailAll']">全选生成通知邮件
                    </el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-download" size="mini"
                        @click="generateANotificationTextMessage" :disabled="multiple"
                        v-hasPermi="['evidence:package:mail']">生成通知短信
                    </el-button>
                </el-col> -->
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>

            <el-table v-loading="loading" max-height="550" :data="caseList" ref="multiTable" :row-key="getRowKeys"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="订单号" prop="caseId" :show-overflow-tooltip="true" fixed="left" width="180" />
                <el-table-column label="内部订单号" prop="loanId" :show-overflow-tooltip="true" fixed="left" width="100" />
                <el-table-column label="姓名" prop="name" :show-overflow-tooltip="true" fixed="left" width="80" />
                <el-table-column label="借款平台" prop="platform" width="120" />
                <el-table-column label="注册协议" prop="haveRegistProtocol" width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.haveRegistProtocol}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="授权协议" prop="haveAuthProtocol" width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.haveAuthProtocol}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="融担合同" prop="haveFinanceContract" width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.haveFinanceContract}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="身份证正面" prop="haveOcrPhoto" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.haveOcrPhoto}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="身份证反面" prop="haveIdcardReverse" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.haveIdcardReverse}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="放款凭证" prop="haveLoanCertificate" width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{scope.row.haveLoanCertificate}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="借款合同" prop="haveLoanCertificate" width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{scope.row.haveLoanContract}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="还款详情" prop="haveRepayDetails" />
                <el-table-column label="其他" prop="haveOtherFile" />
                <el-table-column label="资产受让方" prop="assetAssignee" width="140" :show-overflow-tooltip="true">

                </el-table-column>
                <el-table-column label="通知邮件" prop="noticeMail" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.noticeMail}}次</span>
                    </template>
                </el-table-column>
                <el-table-column label="通知短信" prop="noticeSms">
                    <template slot-scope="scope">
                        <span>{{scope.row.noticeSms}}次</span>
                    </template>
                </el-table-column>
                <el-table-column label="活体照片" prop="haveLivingPhotos" />
                <el-table-column label="服务申请协议" prop="haveServiceProtocol" width="120" />
                <el-table-column label="收货确认书" prop="haveReceiptConfirm" width="120" />
                <el-table-column label="还款记录" prop="haveRepayRecord" />
                <el-table-column label="催收记录" prop="haveCollectionRecord" />
                <el-table-column label="代偿证明" prop="haveTransferProve" />
                <el-table-column label="用户电子签章授权" prop="haveUserSignAuth" width="140" />
                <el-table-column label="债权转让合同" prop="haveTransferContract" width="120" />
                <el-table-column label="债转发送凭证" prop="haveTransferVoucher" width="120" />
                <el-table-column label="保理协议" prop="haveFactoringProtocol" />
                <el-table-column label="放款方相关资质" prop="haveLenderQualificate" width="120" />
                <el-table-column label="转让方相关资质" prop="haveTransferorQualificate" width="120" />
                <el-table-column label="法定代表人身份证复印件" prop="haveRepresentativeIdcard" width="180" />
                <el-table-column label="平台著作权证书" prop="havePlatformCopyright" width="180" />
                <el-table-column label="电子认证服务许可证" prop="haveEleService" width="180" />
                <el-table-column label="担保合同" prop="haveGuaranteeContract" />
                <el-table-column label="操作" width="180" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" v-hasPermi="['evidence:detail:addEvidenceMaterial']"
                            @click="newlyAdded(scope.row)">新增
                        </el-button>
                        <el-button size="mini" type="warning" @click="editFile(scope.row)">编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <message @refresh="clearSelection" :params="messageData.params" :title="messageData.title"
            :show.sync="messageData.dialogVisible" :type="messageData.type" :total="messageData.total"
            :requestApi="messageData.requestApi">
        </message>
        <batchExportDialog @refresh="clearSelection" :title="batchexportDialogData.title"
            :show.sync="batchexportDialogData.dialogVisible" :red="batchexportDialogData.red"
            :params="batchexportDialogData.params"></batchExportDialog>
        <editEvidence @refresh="clearSelection" :id="editData.id" :title="editData.title"
            :show.sync="editData.dialogVisible">
        </editEvidence>
        <newEvidenceImport @refresh="clearSelection" :id="evidenceData.id" :title="evidenceData.title"
            :show.sync="evidenceData.dialogVisible">
        </newEvidenceImport>
        <exportDialog @refresh="clearSelection" :title="exportData.title" :show.sync="exportData.dialogVisible"
            :ids="exportData.ids" :total="exportData.total" :requestApi="exportData.requestApi"></exportDialog>
    </div>
</template>

<script>
    import SearchBar from '@/components/SearchBar/index'
    import exportDialog from "../components/exportDialog";
    import evidenceApi from "@/api/case/evidence/index";
    import {
        downLoadZip
    } from "@/utils/zipdownload";
    import message from '../components/message'
    import batchExportDialog from "./batchExportDialog";
    import editEvidence from "./editEvidence";
    import newEvidenceImport from "./newEvidenceImport";

    export default {
        name: "infoList",
        components: {
            SearchBar,
            message,
            batchExportDialog,
            editEvidence,
            newEvidenceImport,
            exportDialog
        },
        data() {
            return {
                // 遮罩层
                loading: false,
                // 选中数组
                ids: [],
                caseIds: [],
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
                },
                selection: [],
                typeOptions: [{
                        value: '无',
                        label: '无'
                    },
                    {
                        value: '有',
                        label: '有'
                    }
                ],
                pid: '',
                messageData: {
                    title: '',
                    dialogVisible: false,
                    type: 0,
                    requestApi: '',
                    params: '',
                    total: ''
                },
                batchexportDialogData: {
                    title: "",
                    dialogVisible: false,
                    red: "",
                    params: "",
                },
                editData: {
                    title: "",
                    dialogVisible: false,
                    id: null,
                },
                evidenceData: {
                    title: "",
                    dialogVisible: false,
                    id: null,
                },
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    requestApi: "",
                    total: ""
                },
                getRowKeys(row) {
                    return row.id;
                },
            };
        },
        watch: {
            //监控路由参数，实现自己跳自己刷新数据
            $route() {
                this.pid = this.$route.query.pid
                this.queryParams.pid = this.$route.query.pid
            },
            pid() {
                if (!this.queryParams.pid) {
                    return
                }
                //初始化前清空数据
                this.getList(1);
            },
        },
        created() {
            //案件id
            this.pid = this.$route.query.pid
            this.queryParams.pid = this.$route.query.pid
            this.getList(1);
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
            /** 查询角色列表 */
            getList(type) {
                this.loading = true;
                //查询
                if (type == 1) {
                    this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    evidenceApi.infoList(this.searchParams).then((response) => {
                        this.clearSelection();
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
                //切换页
                else if (type == 2) {
                    evidenceApi.infoList(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
            },
            handleImport() {
                this.evidenceData.title = "证据包导入";
                this.evidenceData.id = this.pid;
                this.evidenceData.dialogVisible = true;
            },
            newlyAdded(row) {
                this.evidenceData.title = "新增文件";
                this.evidenceData.dialogVisible = true;
                this.evidenceData.id = row.id;
            },
            editFile(row) {
                this.editData.title = "编辑文件";
                this.editData.dialogVisible = true;
                this.editData.id = row.id;
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
                this.caseIds = selection.map(item => item.caseId)
                this.single = selection.length != 1
                this.multiple = !selection.length
            },
            /** 导出按钮操作 */
            handleExport() {
                const queryParams = {
                    ids: this.ids.join(',')
                };
                this.$confirm('是否确认导出所选数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    return evidenceApi.exportInfo(queryParams);
                }).then(response => {
                    this.download(response.msg);
                    this.clearSelection();
                }).catch(function () {});
            },
            /** 全选案件导出按钮操作 */
            handleExportAll() {
                this.exportData.title = "全选案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.total = this.total;
                this.exportData.requestApi = "/evidence/package/detail/exportAll";
            },
            handleDownZip() {
                this.$confirm('此操作将下载证据包, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let id = this.ids.join(',')
                    downLoadZip("/evidence/package/download?ids=" + id, '证据包');
                    this.clearSelection();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            handleDownZipAll() {
                this.$confirm('此操作将全选下载证据包, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    downLoadZip("/evidence/package/downloadAll", '证据包');
                    this.clearSelection();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.ids = [];
                    this.selection = [];
                }
            },
            handleMessage(type) {
                this.messageData.title = type == 1 ? '生成通知邮件' : '生成通知短信'
                this.messageData.dialogVisible = true;
                this.messageData.type = type;
                this.messageData.requestApi = '/evidence/package/notice/mail'
                this.messageData.params = this.ids.join(',')
            },
            //全选生成通知邮件
            handleMessageAll(type) {
                this.messageData.title = type == 1 ? '全选生成通知邮件' : '生成通知短信'
                this.messageData.dialogVisible = true;
                this.messageData.type = type;
                this.messageData.total = this.total;
                this.messageData.requestApi = '/evidence/package/notice/mailAll'
            },
            deleteData() {
                const userIds = this.ids;
                const name = this.selection[0].caseId
                this.$confirm(
                        '是否确认删除订单号为"' + name + '"的数据项?',
                        "警告", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        }
                    )
                    .then(function () {
                        return evidenceApi.delData(userIds);
                    })
                    .then(() => {
                        this.clearSelection();
                        this.msgSuccess("删除成功");
                    })
                    .catch(function () {});
            },
            deleteDataAll() {
                this.$confirm(
                        '是否确认删除全部的数据项?',
                        "警告", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        }
                    )
                    .then(function () {
                        return evidenceApi.delDataAll();
                    })
                    .then(() => {
                        this.clearSelection();
                        this.msgSuccess("删除成功");
                    })
                    .catch(function () {});
            },
            //打开发送短信的弹窗
            generateANotificationTextMessage() {
                if (this.selection.filter((item) => item.caseStatus == 13).length > 0) {
                    this.msgError("所选数据存在已结案的数据，不能批量发送短信");
                    return;
                }
                this.batchexportDialogData.title = "批量短信发送";
                this.batchexportDialogData.dialogVisible = true;
                this.batchexportDialogData.red = false;
                this.batchexportDialogData.params = this.caseIds.join(",");
            },
            resetAll() {
                this.queryParams.pid = this.pid
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
