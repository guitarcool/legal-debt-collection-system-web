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
                <el-form-item label="催收机构：">
                    <el-input v-model="queryParams.deptId" placeholder="请输入催收机构，多个催收机构用英文逗号连接" clearable type="textarea"
                        size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="调解员：">
                    <el-select clearable  multiple size="small" @change="handleMediation" v-model="mediation" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="借款平台名称：">
                    <el-input v-model="queryParams.platform" placeholder="请输入借款平台名称" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="queryParams.respondentName" placeholder="请输入姓名" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="还款状态：">
                    <!--paymentStatus-->
                    <el-select clearable size="small" v-model="queryParams.repayStatus" placeholder="请选择">
                        <el-option v-for="item in repayStatus" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="退案时间：">
                    <el-date-picker v-model="chooseDaterange" type="daterange" size="small" range-separator="至"
                        start-placeholder="退案开始日期" end-placeholder="退案结束日期" format="yyyy-MM-dd" @change="handleChange"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
            </template>
            <template #filter>
            </template>
            <template #buttonArea> </template>
        </search-bar>
        <div v-if="otherParam" class="queryDiv">
            查询结果统计：<span>列表案件量：{{otherParam.caseTotalCount}}件；</span><span>列表标的金额：{{otherParam.subjectTotalAmount}}元；</span><span>列表剩余待还总额：{{otherParam.totalRemainingBalance}}元；</span>
        </div>
        <div v-else class="queryDivTwo"></div>
        <div class="box-contnet-wrap" style="margin-top:0">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="warning" icon="el-icon-download" size="mini" :disabled="multiple"
                        @click="handleExport" v-hasPermi="['case:withdrawal:export']">导出
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" size="mini" :disabled="multiple"
                        v-hasPermi="['case:withdrawal:batchExportMediationRecord']" @click="batchExportMediationRecord">
                        批量导出调解记录
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" size="mini" :disabled="multiple"
                        v-hasPermi="['case:withdrawal:batchExportNetworkAdjustRecord']" @click="batchExportAdjestMent">
                        批量导出网调记录
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>

            <el-table v-loading="loading" border :data="caseList" ref="multiTable" :row-key="getRowKeys"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="姓名" width="80" prop="respondentName" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="订单号" prop="caseId" width="170" :show-overflow-tooltip="true" />
                <el-table-column label="催收机构" width="150" prop="deptName" :show-overflow-tooltip="true"/>
                <el-table-column label="调解员" width="150" prop="mediationName" />
                <el-table-column label="借款平台名称" width="150" prop="platform" />
                <el-table-column label="逾期天数" width="150" prop="overdueDay" />
                <el-table-column label="账龄" width="150" prop="overdueAge" />
                <el-table-column label="借款本金" width="150" prop="capital" />
                <el-table-column label="逾期总额" width="150" prop="caseAmount" />
                <el-table-column label="已还金额" width="150" prop="repaidAmount" />
                <el-table-column label="剩余待还总额" width="150" prop="remainingBalance" />
                <el-table-column label="还款状态" width="150" :formatter="getRepayStatus" prop="repayStatus">
                </el-table-column>
                <el-table-column label="最近一次网调标签" width="150" :formatter="getAdjustType" prop="netLabel">
                </el-table-column>
                <el-table-column label="最近一次调解标签" width="150" :formatter="getContactResultOptions"
                    prop="medLable">
                </el-table-column>
                <el-table-column label="退案日期" prop="withdrawalTime" width="150" />
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
        <exportDialog @refresh="clearSelection" :title="exportData.title" :show.sync="exportData.dialogVisible" :ids="exportData.ids"
            :requestApi="exportData.requestApi"></exportDialog>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import withDrawalApi from "@/api/case/withDrawal/index";
    import divisionApi from "@/api/case/division/index";
    import exportDialog from "../components/exportDialog";
    export default {
        name: "list",
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
                mediation:[],
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                },
                searchParams:{},
                repayStatus: [],
                selection: [],
                userList: [],
                adjustType:[],
                contactResultOptions:[],
                chooseDaterange:[],
                otherParam: {},
                token: null,
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
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    requestApi: "",
                },
                getRowKeys(row) {
                    return row.id;
                },
            };
        },
        created() {
            this.getList(1);
            this.getUsers();
            //还款状态
            this.getDicts("repay_status").then((response) => {
                this.repayStatus = response.data;
            });
            //网调标签
            this.getDicts("network_adjust_label").then((response) => {
                this.adjustType = response.data;
            });
            //联系状态
            this.getDicts("contact_status").then((response) => {
                this.contactResultOptions = response.data;
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
                this.loading = true;
                //查询
                if(type == 1){
		            this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    withDrawalApi.list(this.searchParams).then((response) => {
                        this.clearSelection();
                        this.otherParam = response.otherParam;
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
                //切换页
                else if(type == 2){
                    withDrawalApi.list(this.searchParams).then((response) => {
                        this.otherParam = response.otherParam;
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
            },
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.ids = [];
                    this.selection = [];
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
            handleChange(value) {
                if (value == null) {
                    this.queryParams.withdrawalStartDate = "";
                    this.queryParams.withdrawalEndDate = "";
                } else {
                    this.queryParams.withdrawalStartDate = value[0];
                    this.queryParams.withdrawalEndDate = value[1];
                }
            },
            handleMediation(value){
                if (value == null) {
                    this.queryParams.mediationId = "";
                } else {
                    this.queryParams.mediationId = value.toString()
                }    
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
                            withDrawalApi.batchExportMediationRecord(queryParams).then(res => {
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
                            withDrawalApi.batchExportNetworkAdjustRecord(queryParams).then(res => {
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
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList(1);
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.selection = selection;
                this.ids = selection.map((item) => item.caseId);
                this.single = selection.length != 1;
                this.multiple = !selection.length;
            },
            /** 导出按钮操作 */
            handleExport() {
                this.exportData.ids = this.ids.toString()
                this.exportData.title = "案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.requestApi = "/case/withdrawal/export";
            },
            changeStatus() {
                this.getList(1);
            },
            //还款状态
            getRepayStatus(row, column) {
                return this.selectDictLabel(this.repayStatus, row.repayStatus);
            },
            //网调标签
            getAdjustType(row, column) {
                return this.selectDictLabel(this.adjustType, row.netLabel);
            },
            //联系标签
            getContactResultOptions(row, column) {
                return this.selectDictLabel(this.contactResultOptions, row.medLable);
            },
            //获取调解员
            getUsers() {
                divisionApi.userList().then((response) => {
                    this.userList = response.data.userList || [];
                    // for (var i = 0; i < this.userList.length; i++) {
                    //     this.userList[i].parentId = this.userList[i].deptId
                    //     delete this.userList[i].deptId
                    // }
                });
            },
            resetAll() {
                this.chooseDaterange = [];
                this.mediation = [];
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
