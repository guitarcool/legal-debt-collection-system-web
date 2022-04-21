<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)">
            <template #default>
                <el-form-item label="模版名称：">
                    <el-input v-model="queryParams.name" placeholder="请输入模版名称" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="合同号：">
                    <el-input v-model="queryParams.orderNo" placeholder="请输入合同号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="订单号：">
                    <el-input v-model="queryParams.caseId" placeholder="请输订单号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
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
            </template>
            <template #filter>
                <el-form-item label="签章文书审核状态：" class="custom-radio">
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
            <template #buttonArea></template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="danger" size="mini" :disabled="multiple" @click="handleMessage(1)">批量文书短信发送(旧)
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" size="mini" :disabled="multiple" @click="handleMessage(2)">批量文书短信发送
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" size="mini" v-hasPermi="['shortMsg:clericalRecords:sendsAll']"
                        @click="handleMessageAll">全选文书短信发送
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" size="mini" :disabled="multiple"
                        v-hasPermi="['template:clerical:batchDownloadClerical']" @click="handleOnRecord">批量文书下载
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>
            <el-table v-loading="loading" max-height="550" :data="caseList" @sort-change="handleSortChange"
                ref="multiTable" :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="合同号" prop="orderNo" :show-overflow-tooltip="true" fixed="left" width="150" />
                <el-table-column label="订单号" prop="caseId" :show-overflow-tooltip="true" fixed="left" width="150" />
                <el-table-column label="模版名称" prop="name" :show-overflow-tooltip="true" fixed="left" width="150" />
                <el-table-column label="文书id" prop="id" :show-overflow-tooltip="true" width="150" />
                <el-table-column label="被申请人姓名" prop="respondentName" :show-overflow-tooltip="true" width="120" />
                <el-table-column label="手机号" :show-overflow-tooltip="true" prop="respondentPhone" width="150" />
                <el-table-column label="身份证号" :show-overflow-tooltip="true" prop="respondentIdNo" width="200" />

                <el-table-column label="生成时间" prop="createTime" width="150" sortable="custom"
                    :sort-orders="['descending', 'ascending']">
                    <template slot-scope="scope" v-if="scope.row.createTime">
                        <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作员" prop="nickName" width="130"> </el-table-column>
                <el-table-column label="电子签章" width="100" prop="signContent"> </el-table-column>
                <el-table-column label="签章文书审核状态" width="130" :formatter="auditOptionsFormat" prop="auditSignStatus" />
                <el-table-column label="审批意见" :show-overflow-tooltip="true" width="120" prop="rejectReason">
                </el-table-column>
                <el-table-column label="签章状态" width="120" :formatter="signOptionsFormat" prop="signStatus" />
                <el-table-column label="文书格式" prop="format"> </el-table-column>
                <el-table-column label="操作" width="200" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleSee(scope.row)">查看
                        </el-button>
                        <el-button size="mini" type="warning" @click="downFile(scope.row)">下载
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
            <batchDialog @refresh="clearSelection" :title="batchDialogData.title"
                :show.sync="batchDialogData.dialogVisible" :red="batchDialogData.red" :params="batchDialogData.params"  :total="batchDialogData.total">
            </batchDialog>
        </div>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import templateApi from "@/api/case/document/templateIndex";
    import batchDialog from "./batchDialog";

    export default {
        name: "generationRecord",
        components: {
            SearchBar,
            batchDialog
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
                    name: "",
                    orderNo: "",
                    caseId: "",
                    respondentName: "",
                    respondentPhone: "",
                    respondentIdNo: "",
                    auditSignStatus: "",
                    signStatus: "",
                    orderByColumn: "",
                    isAsc: ''
                },
                selection: [],
                auditOptions: [], //文书审核状态
                signOptions: [], //签章状态
                batchDialogData: {
                    title: "",
                    dialogVisible: false,
                    red: "",
                    params: "",
                    total: ""
                },
                getRowKeys(row) {
                    return row.id;
                },
            };
        },
        created() {
            //文书审核状态
            this.getDicts("audit_sign_status").then((response) => {
                this.auditOptions = response.data;
            });
            //签章状态
            this.getDicts("sign_status").then((response) => {
                this.signOptions = response.data;
            });
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
            /** 查询角色列表 */
            getList(type) {
                this.loading = true;
                //查询
                if (type == 1) {
                    this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    templateApi.recordList(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearSelection();
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
                //切换页
                else if (type == 2) {
                    templateApi.recordList(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        this.total = response.total;
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
            // 签章状态
            signOptionsFormat(row, column) {
                return this.selectDictLabel(this.signOptions, row.signStatus);
            },
            // 文书审核状态
            auditOptionsFormat(row, column) {
                return this.selectDictLabel(this.auditOptions, row.auditSignStatus);
            },
            changeStatus() {
                this.getList(1);
            },
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.ids = [];
                    this.selection = [];
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
                this.ids = selection.map((item) => item.id);
                this.single = selection.length != 1;
                this.multiple = !selection.length;
            },
            handleSee(item) {
                window.open(process.env.VUE_APP_BASE_API + item.fileUrl);
            },
            //下载附件
            downFile(item) {
                window.location.href =
                    process.env.VUE_APP_BASE_API +
                    "/common/download/resource?resource=" +
                    item.fileUrl;
            },
            //批量文书下载
            handleOnRecord() {
                var that = this;
                this.$confirm(`是否批量文书下载?`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        let data = {
                            clericalIds: that.ids.join(",")
                        }
                        templateApi.batchDownloadClerical(data).then((res) => {
                            if (res.code === 200) {
                                that.msgSuccess("操作成功");
                                that.clearSelection();
                                that.download(res.msg);
                            }
                        });
                    })
                    .catch(() => {
                        that.msgError("已取消操作");
                    });
            },
            //打开发送短信的弹窗
            handleMessage(type) {
                if (this.selection.filter((item) => item.caseStatus == 13).length > 0) {
                    this.msgError("所选数据存在已结案的数据，不能批量发送短信");
                    return;
                }
                if(type == 1){
                    this.batchDialogData.title = "批量文书短信发送(旧)";
                }else{
                    this.batchDialogData.title = "批量文书短信发送";
                }
                this.batchDialogData.dialogVisible = true;
                this.batchDialogData.red = false;
                this.batchDialogData.params = this.ids.join(",");
            },
            handleMessageAll() {
                this.batchDialogData.title = "全选文书短信发送";
                this.batchDialogData.dialogVisible = true;
                this.batchDialogData.total = this.total;
                this.batchDialogData.red = false;
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
