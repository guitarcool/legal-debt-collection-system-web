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
                    <el-input v-model="queryParams.cid" placeholder="请输入订单号" clearable size="small" style="width: 240px"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="调解员：">
                    <el-select clearable size="small" v-model="queryParams.principal" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="财保申请时间：">
                    <el-date-picker size="small" v-model="chooseDaterange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange"
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

                <el-form-item label="财保案号：">
                    <el-input v-model="queryParams.propertyProNo" placeholder="请输入财保案号，多个财保案号用英文逗号连接" clearable
                        type="textarea" size="small" style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
            </template>
            <template #filter>
                <el-form-item label="案件状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.caseStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in statusOptions" :label="item.dictValue" :key="item.dictValue">
                            {{ item.dictLabel }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="财保状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.status" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in protects" :key="item.dictValue" :label="item.dictValue">
                            {{ item.dictLabel }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </template>
            <template #buttonArea> </template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>
            <el-table v-loading="loading" :data="caseList" @sort-change="handleSortChange" ref="multiTable"
                :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="案件分配时间" prop="distributionTime" fixed="left" width="120" sortable="custom"
                    :sort-orders="['descending', 'ascending']">
                    <template slot-scope="scope" v-if="scope.row.distributionTime">
                        <span>{{
              parseTime(scope.row.distributionTime, "{y}-{m}-{d}")
            }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" prop="respondentName" fixed="left" />
                <el-table-column label="案件状态" width="120" :formatter="caseStatusFormat" prop="caseStatus" />
                <el-table-column label="订单号" width="180" prop="cid" :show-overflow-tooltip="true" />
                <el-table-column label="财保申请状态" :formatter="statusFormat" prop="status" width="120" />
                <el-table-column label="性别" prop="respondentSex" />
                <el-table-column label="民族" prop="respondentNation" />
                <el-table-column label="出生日期" width="120" prop="respondentBirthday" />
                <el-table-column label="身份证号" width="180" prop="respondentIdNo" />
                <el-table-column label="手机号" width="120" prop="respondentPhone" />
                <el-table-column label="户籍地址" width="150" prop="respondentAddress" />
                <el-table-column label="标的金额" width="120" prop="subjectAmount" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="逾期年利率" prop="overYearRate" width="100" />
                <el-table-column label="放款日期" width="120" prop="loanDate" />
                <el-table-column label="合同地址" width="200" :show-overflow-tooltip="true" prop="respondentAliveAddress" />
                <el-table-column label="调解员" width="80" prop="principalName" />
                <el-table-column label="案件状态" width="120" :formatter="caseStatusFormat" prop="caseStatus" />
                <el-table-column label="财保申请时间" width="180" prop="createTime" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="财保案号" width="100" prop="propertyProNo" />
                <el-table-column label="财保冻结时间" width="150" prop="frozenStartTime" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="首次冻结金额" width="120" prop="frozenAmount" />
                <!-- <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.remittanceTime,'{y}-{m}-{d}') }}</span>
                    </template> -->
                <el-table-column label="有无车" width="80" prop="vehicle" />
                <el-table-column label="有无房" width="80" prop="house" :formatter="houseFormat" />
                <el-table-column label="操作" width="180" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" v-if="scope.row.status == 1" @click="apply(scope.row)"
                            v-hasPermi="['case:financial:review']">审核
                        </el-button>
                        <el-button size="mini" type="warning" v-if="scope.row.status == 2"
                            @click="handleAppleEdit(scope.row)">冻结结束
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <applyAudit @refresh="clearSelection" :title="applyData.title" :show.sync="applyData.dialogVisible"
            :id="applyData.id" :cid="applyData.cid" :item="applyData.item"></applyAudit>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import divisionApi from "@/api/case/division/index";
    import applyAudit from "./applyAudit";

    export default {
        name: "list",
        components: {
            SearchBar,
            applyAudit
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
                    cid: "",
                    batchNo: "",
                    pageNum: 1,
                    pageSize: 50,
                    respondentName: "",
                    respondentPhone: "",
                    respondentIdNo: "",
                    propertyProNo: "",
                    principal: "",
                    caseStatus: "",
                    status: "",
                    orderByColumn: "",
                    isAsc: "",
                },
                statusOptions: [], //案件状态
                protects: [], //案件类型
                addData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                applyData: {
                    title: "",
                    dialogVisible: false,
                    id: -999,
                    cid: '',
                    item: "",
                },
                selection: [],
                chooseDaterange: [],
                userList: [],
                house: [],
                getRowKeys(row) {
                    return row.id;
                },
            };
        },
        created() {
            this.getList(1);
            this.getUsers();
            //财保状态
            this.getDicts("wealth_protect").then((response) => {
                this.protects = response.data;
                this.protects.shift();
            });
            //车房类型
            this.getDicts("yes_no").then((response) => {
                this.house = response.data;
            });
            //案件状态
            this.getDicts("case_status").then((response) => {
                this.statusOptions = response.data;
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
                    divisionApi.list(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearSelection();
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
                //切换页
                else if (type == 2) {
                    divisionApi.list(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
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
            changeStatus() {
                this.getList(1);
            },
            //财保状态
            statusFormat(row, column) {
                return this.selectDictLabel(this.protects, row.status);
            },
            // 案件状态
            caseStatusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.caseStatus);
            },
            // 房屋状态
            houseFormat(row, column) {
                return this.selectDictLabel(this.house, row.house);
            },
            //申请审核
            apply(item) {
                this.applyData.title = "财保申请审核";
                this.applyData.dialogVisible = true;
                this.applyData.id = item.id;
                this.applyData.cid = item.cid;
                this.applyData.item = JSON.stringify(item);
            },
            resetAll() {
                this.chooseDaterange = [];
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
            //获取调解员
            getUsers() {
                divisionApi.userList().then((response) => {
                    this.userList = response.data.userList || [];
                });
            },
            //申请冻结结束
            handleAppleEdit(val) {
                var that = this;
                this.$confirm(`是否申请冻结结束?`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        let param = {
                            id: val.id,
                        };
                        divisionApi.property(param).then((res) => {
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
        },
    };

</script>
<style lang="scss">
    .custom-radio {
        padding-top: 10px;
        display: flex !important;

        .el-form-item__label {
            width: 120px;
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
