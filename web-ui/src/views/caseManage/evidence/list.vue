<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="案件批次号：" prop="batchNo">
                    <el-input clearable v-model="queryParams.batchNo" placeholder="请输入案件批次号" size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="订单号：" prop="id">
                    <el-input clearable v-model="queryParams.caseId" placeholder="请输入订单号" size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="内部订单号：" prop="loanId">
                    <el-input clearable v-model="queryParams.loanId" placeholder="请输入订单号" size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="姓名：" prop="respondentName">
                    <el-input clearable v-model="queryParams.respondentName" placeholder="请输入姓名" size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="合同号：">
                    <el-input clearable v-model="queryParams.orderNo" placeholder="请输入合同号，多个合同号用英文逗号连接" type="textarea"
                        size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="分案名：">
                    <el-input clearable v-model="queryParams.divisionName" placeholder="请输入分案名" size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="创建人：">
                    <el-input clearable v-model="queryParams.createName" placeholder="请输入创建人" size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="创建时间：">
                    <el-date-picker size="small" v-model="chooseDaterange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
            </template>
            <template #filter> </template>
            <template #buttonArea> </template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleImport"
                        v-hasPermi="['evidence:package:import']">证据包导入
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" icon="el-icon-download" size="mini" :disabled="multiple"
                        @click="handleExport" v-hasPermi="['evidence:package:export']">导出
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-download" size="mini"
                        @click="handleExportAll" v-hasPermi="['evidence:package:exportAll']">全选导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>

            <el-table v-loading="loading" max-height="550" :data="caseList" @sort-change="handleSortChange" ref="multiTable"
                :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="分案名" prop="divisionName" :show-overflow-tooltip="true" fixed="left"
                    width="100" />
                <el-table-column label="创建时间" prop="createTime" width="120" sortable="custom"
                    :sort-orders="['descending', 'ascending']">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" prop="createName" :show-overflow-tooltip="true" width="120" />
                <el-table-column label="案例数" prop="caseNum" :show-overflow-tooltip="true" width="120" />
                <el-table-column label="涉及金额" prop="amount" width="120" />
                <el-table-column label="注册协议" prop="registProtocolNum" width="120" />
                <el-table-column label="授权协议" prop="authProtocolNum" width="120" />
                <el-table-column label="融担合同" prop="financeContractNum" width="120" />
                <el-table-column label="身份证正面" prop="ocrPhotoNum" width="160">
                </el-table-column>
                <el-table-column label="放款凭证" prop="loanCertificateNum" width="160" :show-overflow-tooltip="true" />

                <el-table-column label="借款合同" prop="loanContractNum" width="160" :show-overflow-tooltip="true" />

                <el-table-column label="还款详情" prop="repayDetailsNum" width="120" />
                <el-table-column label="其他" prop="otherFileNum" width="120" />
                <el-table-column label="状态" prop="status" width="100">
                    <template slot-scope="scope" v-if="scope.row.status != null">
                        <span>{{ scope.row.status == 0 ? "未移交" : "已移交" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="身份证反面" prop="idcardReverseNum" width="120" />
                <el-table-column label="活体照片" prop="livingPhotosNum" width="120" />
                <el-table-column label="服务申请协议" prop="serviceProtocolNum" width="120" />
                <el-table-column label="收货确认书" prop="receiptConfirmNum" width="120" />
                <el-table-column label="还款记录" prop="repayRecordNum" width="120" />
                <el-table-column label="催收记录" prop="collectionRecordNum" width="120" />
                <el-table-column label="代偿证明" prop="transferProveNum" width="120" />
                <el-table-column label="用户电子签章授权" prop="userSignAuthNum" width="180" />
                <el-table-column label="债权转让合同" prop="transferContractNum" width="120" />
                <el-table-column label="债转发送凭证" prop="transferVoucherNum" width="120" />
                <el-table-column label="保理协议" prop="factoringProtocolNum" width="120" />
                <el-table-column label="放款方相关资质" prop="lenderQualificateNum" width="120" />
                <el-table-column label="转让方相关资质" prop="transferorQualificateNum" width="120" />
                <el-table-column label="法定代表人身份证复印件" prop="representativeIdcardNum" width="180" />
                <el-table-column label="平台著作权证书" prop="platformCopyrightNum" width="120" />
                <el-table-column label="电子认证服务许可证" prop="eleServiceNum" width="180" />
                <el-table-column label="担保合同" prop="guaranteeContractNum" width="120" />
                <el-table-column label="备注" prop="remark" width="120" />
                <el-table-column label="操作" width="180" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
                            v-hasPermi="['evidence:package:detailList']">查看
                        </el-button>
                        <!-- <el-button size="mini" type="warning" v-if="scope.row.status == 0"
                            @click="handleMove(scope.row)" v-hasPermi="['evidence:package:edit']">移交
                        </el-button> -->
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <evidenceImport @refresh="getList(1)" :title="evidenceData.title" :show.sync="evidenceData.dialogVisible">
        </evidenceImport>
        <exportDialog @refresh="clearSelection" :title="exportData.title" :show.sync="exportData.dialogVisible"
            :ids="exportData.ids" :total="exportData.total" :requestApi="exportData.requestApi"></exportDialog>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import evidenceApi from "@/api/case/evidence/index";
    import evidenceImport from "./evidenceImport";
    import exportDialog from "../components/exportDialog";


    export default {
        name: "list",
        components: {
            SearchBar,
            evidenceImport,
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
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                    orderByColumn: "",
                    isAsc: "",
                },
                searchParams: {},
                selection: [],
                chooseDaterange: [],
                evidenceData: {
                    title: "",
                    dialogVisible: false,
                    id: null,
                },
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    total: "",
                    requestApi: "",
                },
                getRowKeys(row) {
                    return row.id;
                },
            };
        },
        created() {
            this.getList(1);
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
            resetAll() {
                this.chooseDaterange = [];
            },
            /** 查询角色列表 */
            getList(type) {
                this.loading = true;
                //查询
                if (type == 1) {
                    this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    evidenceApi.list(this.searchParams).then((response) => {
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
                    evidenceApi.list(this.searchParams).then((response) => {
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
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.ids = [];
                    this.selection = [];
                }
            },
            clearTable(){
                this.$refs.multiTable.clearSort();
            },
            /** 导出按钮操作 */
            handleExport() {
                this.exportData.ids = this.ids.toString()
                this.exportData.title = "案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.requestApi = "/evidence/package/export";
            },
            /** 全选案件导出按钮操作 */
            handleExportAll(){
                this.exportData.title = "全选案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.total = this.total;
                this.exportData.requestApi = "/evidence/package/exportAll";
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
            handleUpdate(item) {
                this.$router.push({
                    name: "infoList",
                    query: {
                        pid: item.id
                    }
                });
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
            handleImport() {
                this.evidenceData.title = "证据包导入";
                this.evidenceData.dialogVisible = true;
            },
            handleMove(item) {
                var that = this;
                this.$confirm(`是否确认移交?`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        evidenceApi.move(item.id).then((res) => {
                            if (res.code === 200) {
                                that.msgSuccess("操作成功");
                                that.clearSelection();
                            }
                        });
                    })
                    .catch(() => {
                        that.msgInfo("已取消操作");
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
            /*width: 20%;*/
            margin-right: 10px;
            margin-bottom: 20px;
        }
    }

</style>
