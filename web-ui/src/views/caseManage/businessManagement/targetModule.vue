<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" @submit="getList"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="案件批次号：" v-if="infoName == 'second'">
                    <el-input v-model="queryParams.batchNo" placeholder="请输入案件批次号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="统计月份：">
                    <el-date-picker v-model="queryParams.month" type="month" size="small" value-format="yyyy-MM"
                        style="width: 200px" @keyup.enter.native="handleQuery" placeholder="选择月份">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="团队名称：">
                    <el-input v-model="queryParams.teamName" placeholder="请输入案件批次号" clearable size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
            </template>
            <template #filter>
                <div class="instruction">注：回款统计以财务审核/入账的时间及金额为准，未通过审核的回款暂不计入统计。</div>
            </template>
            <template #buttonArea> </template>
        </search-bar>
        <div class="box-contnet-wrap">
            <div class="box">
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="成员回款目标" name="first">
                        <div class="box" style="margin-bottom:0px">
                            <el-button size="mini" type="primary" v-hasPermi="['count:teamUser:target:addOrUpdate']"
                                @click="addTarget()">新增目标</el-button>
                            <el-table v-loading="loading" ref="singleTable" :data="teamUserList" style="width: 100%; margin-top: 20px">
                                <el-table-column label="统计月份" prop="targetMonth">
                                </el-table-column>
                                <el-table-column label="团队名称" prop="teamName">
                                </el-table-column>
                                <el-table-column label="调解回款" prop="mediateTarget">
                                </el-table-column>
                                <el-table-column label="立案回款" prop="registerTarget">
                                </el-table-column>
                                <el-table-column label="财保回款" prop="safeguardingTarget">
                                </el-table-column>
                                <el-table-column label="仲裁回款" prop="arbitrateTarget">
                                </el-table-column>
                                <el-table-column label="月目标回款金额" width="120" prop="totalTarget">
                                </el-table-column>
                                <el-table-column label="操作" width="400" fixed="right" align="center">
                                    <template slot-scope="scope">
                                        <el-button size="mini" type="warning"
                                            v-hasPermi="['count:teamUser:target:detail']"
                                            @click="handleAddTinfoTarget(scope.row)">详情
                                        </el-button>
                                        <el-button size="mini" type="primary"
                                            v-hasPermi="['count:teamUser:target:addOrUpdate']"
                                            @click="editTarget(scope.row)">编辑
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                                :limit.sync="queryParams.pageSize" @pagination="getteamUserList" />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="产品回款目标" name="second">
                        <!--收款账户-->
                        <div class="box" style="margin-bottom:0px">
                            <el-button size="mini" type="primary" v-hasPermi="['count:product:target:addOrUpdate']"
                                @click="addSecondTarget">新增目标</el-button>
                            <el-table v-loading="loading" :data="productList" style="width: 100%; margin-top: 20px">
                                <el-table-column label="统计月份" prop="targetMonth">
                                </el-table-column>
                                <el-table-column label="团队名称" prop="teamName">
                                </el-table-column>
                                <el-table-column label="案件批次号" prop="batchNo">
                                </el-table-column>
                                <el-table-column label="案件量" prop="caseNum">
                                </el-table-column>
                                <el-table-column label="案件金额" prop="caseAmount">
                                </el-table-column>
                                <el-table-column label="月目标回款金额" prop="targetAmount">
                                </el-table-column>
                                <el-table-column label="操作" width="400" fixed="right" align="center">
                                    <template slot-scope="scope">
                                        <el-button size="mini" type="primary"
                                            v-hasPermi="['count:product:target:addOrUpdate']"
                                            @click="editSecondTarget(scope.row)">编辑
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                                :limit.sync="queryParams.pageSize" @pagination="getproductList" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <addTarget :title="targetData.title" :date="targetData.date" :teamId="targetData.teamId"
            :show.sync="targetData.dialogVisible" @refresh="getList">
        </addTarget>
        <secondTarget :title="secondData.title" :date="secondData.date" :teamId="secondData.teamId"
            :show.sync="secondData.dialogVisible" @refresh="getList">
        </secondTarget>
        <infoTarget :title="infoTargetData.title" :date="infoTargetData.date" :teamId="infoTargetData.teamId"
            :show.sync="infoTargetData.dialogVisible">
        </infoTarget>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import addTarget from "./addTarget";
    import secondTarget from "./secondTarget";
    import infoTarget from "./infoTarget.vue";
    import businessApi from "@/api/case/business/index";
    export default {
        name: "list",
        components: {
            SearchBar,
            addTarget,
            secondTarget,
            infoTarget
        },
        data() {
            return {
                // 总条数
                total: 0,
                // 角色表格数据
                caseList: [],
                // 显示搜索条件
                showSearch: true,
                loading: false,
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                },
                activeName: 'first',
                infoName: 'first',
                teamUserList: [],
                productList: [],
                targetData: {
                    dialogVisible: false,
                    title: "",
                    date: "",
                    teamId: null,
                },
                secondData: {
                    dialogVisible: false,
                    title: "",
                    date: "",
                    teamId: null,
                },
                infoTargetData: {
                    title: "",
                    dialogVisible: false,
                    date: "",
                    teamId: null,
                },
            };
        },
        created() {
            this.getteamUserList();
            // this.getproductList();
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
            getList() {
                if (this.infoName == 'first') {
                    this.getteamUserList();
                } else if (this.infoName == 'second') {
                    this.getproductList();
                }
            },
            /** 查询成员回款列表 */
            getteamUserList() {
                this.loading = true;
                businessApi.teamUserList(this.queryParams).then(
                    response => {
                        this.teamUserList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }
                    ).catch(() => {
                        this.teamUserList = [];
                        this.total = 0;
                        this.loading = false;
                    });
            },
            /** 查询产品回款列表 */
            getproductList() {
                this.loading = true;
                businessApi.productList(this.queryParams).then(
                    response => {
                        this.productList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }
                    ).catch(() => {
                        this.productList = [];
                        this.total = 0;
                        this.loading = false;
                    });
            },
            handleAddTinfoTarget(row) {
                this.infoTargetData.title = "详情";
                this.infoTargetData.date = row.targetMonth;
                this.infoTargetData.teamId = row.teamId;
                this.infoTargetData.dialogVisible = true;
            },
            resetAll() {},
            getSummaries(param) {
                const {
                    columns,
                    data
                } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总价';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' 元';
                    } else {
                        sums[index] = 'N/A';
                    }
                });

                return sums;
            },
            handleClick(tab) {
                this.infoName = tab.name;
                if (tab.name === "first" && this.teamUserList.length === 0) {
                    this.getteamUserList()
                } else if (tab.name === "second" && this.productList.length === 0) {
                    this.getproductList()
                }
            },
            getRowClass(row) {
                if (row.columnIndex == 10 || row.columnIndex == 11) {
                    return 'background:#33CC99'
                } else if (row.columnIndex == 7 || row.columnIndex == 8 || row.columnIndex == 9) {
                    return 'background:#33CCFF'
                } else {
                    return ''
                }
            },
            //新增成员目标
            addTarget() {
                this.targetData.title = "新增成员目标";
                // 控制弹窗组件显示
                this.targetData.dialogVisible = true;
            },
            //新增产品目标
            addSecondTarget() {
                this.secondData.title = "新增产品目标";
                // 控制弹窗组件显示
                this.secondData.dialogVisible = true;
            },
            editTarget(row) {
                this.targetData.title = "编辑成员目标";
                // 控制弹窗组件显示
                this.targetData.date = row.targetMonth;
                this.targetData.teamId = row.teamId;
                this.targetData.dialogVisible = true;
            },
            editSecondTarget(row) {
                this.secondData.title = "编辑产品目标";
                // 控制弹窗组件显示
                this.secondData.date = row.targetMonth;
                this.secondData.teamId = row.teamId;
                this.secondData.dialogVisible = true;
            },
        }
    };

</script>
<style lang="scss">
    .instruction {
        color: #999;
        font-size: 14px;
        padding-bottom: 10px;
    }

    .refundStatisticsTable {
        width: 100%;
        text-align: center;
        padding: 10px;

        p {
            padding: 10px
        }

        .el-table {
            overflow: auto;
        }

        .el-table .el-table__body-wrapper,
        .el-table .el-table__header-wrapper,
        .el-table .el-table__footer-wrapper {
            overflow: visible;
        }

        .el-table::after {
            position: relative !important;
        }
    }

</style>
