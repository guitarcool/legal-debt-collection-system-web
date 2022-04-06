<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" @submit="getList"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="统计部门：">
                    <el-select size="small" filterable v-model="queryParams.teamId" placeholder="请选择" @change="queryUserDepts">
                        <el-option v-for="item in userDepts" :key="item.deptId" :label="item.deptName"
                            :value="item.deptId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="统计用户：">
                    <el-select :disabled="disabled" filterable multiple collapse-tags size="small" @change="handleMediation" v-model="mediation"
                        placeholder="请选择">
                        <el-option v-for="item in listByDept" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="统计日期：">
                    <el-date-picker v-model="queryParams.date" type="date" size="small" value-format="yyyy-MM-dd"
                        style="width: 200px" @keyup.enter.native="handleQuery" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </template>
            <template #filter>
                <div class="instruction">注：回款统计以财务审核/入账的时间及金额为准，未通过审核的回款暂不计入统计。</div>
            </template>
            <template #buttonArea> </template>
        </search-bar>
        <div class="box-contnet-wrap">
            <div class="case-info">
                <div class="box">
                    <div style="display: flex;align-items: center;">
                        <p class="box-title">日回款情况统计</p>
                        <el-tooltip placement="top">
                            <div slot="content">
                                注释：数据截止至统计日
                                <br />1.月回款目标完成度=（已回款金额/月目标回款金额）*100%
                            </div>
                            <i class="el-icon-question" style="padding-left:5px;"></i>
                        </el-tooltip>
                    </div>
                    <div class="box-content">
                        <div class="refundStatisticsTable">
                            <p>部门成员回款统计表</p>
                            <el-table size="mini" :data="memberList" :header-cell-style="getRowClass" border
                                :summary-method="getSummaries" show-summary style="width: 100%">
                                <el-table-column prop="userName" label="人员">
                                </el-table-column>
                                <el-table-column prop="dayTotalCount" width="100" sortable label="案件总数">
                                </el-table-column>
                                <el-table-column prop="dayAmountCount" width="180" sortable label="案件总金额">
                                </el-table-column>
                                <el-table-column prop="monthTargetAmount" width="150" sortable label="月目标回款金额">
                                </el-table-column>
                                <el-table-column prop="dayTotal" width="120" sortable label="日回款笔数">
                                </el-table-column>
                                <el-table-column prop="dayAmount" width="120" sortable label="日回款金额">
                                </el-table-column>
                                <el-table-column prop="monthCaseCount" width="150" sortable label="月累计回款案件数">
                                </el-table-column>
                                <el-table-column prop="monthTotalCount" width="150" sortable label="月累计回款笔数">
                                </el-table-column>
                                <el-table-column prop="monthAmountCount" width="150" sortable label="月累计回款金额">
                                </el-table-column>
                                <el-table-column prop="monthTargetRatio" width="150" sortable label="月回款目标完成度">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="refundStatisticsTable">
                            <p>产品回款统计表</p>
                            <el-table size="mini" :data="productList" :header-cell-style="getRowClass" border
                                :summary-method="getSummaries" show-summary style="width: 100%">
                                <el-table-column prop="batchNo" label="产品批次号"></el-table-column>
                                <el-table-column prop="dayTotalCount" width="100" sortable label="案件总数">
                                </el-table-column>
                                <el-table-column prop="dayAmountCount" width="180" sortable label="案件总金额">
                                </el-table-column>
                                <el-table-column prop="monthTargetAmount" width="150" sortable label="月目标回款金额">
                                </el-table-column>
                                <el-table-column prop="dayTotal" width="120" sortable label="日回款笔数">
                                </el-table-column>
                                <el-table-column prop="dayAmount" width="120" sortable label="日回款金额">
                                </el-table-column>
                                <el-table-column prop="monthCaseCount" width="150" sortable label="月累计回款案件数">
                                </el-table-column>
                                <el-table-column prop="monthTotalCount" width="150" sortable label="月累计回款笔数">
                                </el-table-column>
                                <el-table-column prop="monthAmountCount" width="150" sortable label="月累计回款金额">
                                </el-table-column>
                                <el-table-column prop="monthTargetRatio" width="150" sortable label="月回款目标完成度">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="refundStatisticsTable">
                            <p>回款渠道统计表</p>
                            <el-table size="mini" :data="channelList" :header-cell-style="getRowClass" border
                                :summary-method="getSummaries" show-summary style="width: 100%">
                                <el-table-column prop="payChannal" label="回款渠道">
                                </el-table-column>
                                <el-table-column prop="dayTotalCount" width="100" sortable label="案件总数">
                                </el-table-column>
                                <el-table-column prop="dayAmountCount" width="180" sortable label="案件总金额">
                                </el-table-column>
                                <el-table-column prop="monthTargetAmount" width="150" sortable label="月目标回款金额">
                                </el-table-column>
                                <el-table-column prop="dayTotal" width="120" sortable label="日回款笔数">
                                </el-table-column>
                                <el-table-column prop="dayAmount" width="120" sortable label="日回款金额">
                                </el-table-column>
                                <el-table-column prop="monthCaseCount" width="150" sortable label="月累计回款案件数">
                                </el-table-column>
                                <el-table-column prop="monthTotalCount" width="150" sortable label="月累计回款笔数">
                                </el-table-column>
                                <el-table-column prop="monthAmountCount" width="150" sortable label="月累计回款金额">
                                </el-table-column>
                                <el-table-column prop="monthTargetRatio" width="150" sortable label="月回款目标完成度">
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <div style="display: flex;align-items: center;">
                        <p class="box-title">案件跟进统计</p>
                        <el-tooltip placement="top">
                            <div slot="content">
                                注释：数据截止至统计日
                                <br />1.日案件跟进数为当日有新增调解记录的案件个数
                            </div>
                            <i class="el-icon-question" style="padding-left:5px;"></i>
                        </el-tooltip>
                    </div>
                    <div class="box-content">
                        <div class="refundStatisticsTable">
                            <p>案件跟进统计表</p>
                            <el-table size="mini" :data="businessList" border :summary-method="getSummariesTwo"
                                show-summary style="width: 100%">
                                <el-table-column prop="userName" label="人员">
                                </el-table-column>
                                <el-table-column prop="caseFollowNum" sortable label="日案件跟进数">
                                </el-table-column>
                                <el-table-column prop="intentionToRepay" sortable label="日新增意向还款案件">
                                </el-table-column>
                                <el-table-column prop="mediationRecord" sortable label="日新增调解记录">
                                </el-table-column>
                                <el-table-column prop="phoneCount" sortable label="日电话通话次数">
                                </el-table-column>
                                <el-table-column prop="phonePassCount" width="150" sortable label="日电话接通量">
                                </el-table-column>
                                <el-table-column prop="phoneTimes" width="150" sortable label="日通话时长">
                                </el-table-column>
                                <el-table-column prop="smsNum" width="150" sortable label="日短信发送量">
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import businessApi from "@/api/case/business/index";
    export default {
        name: "list",
        components: {
            SearchBar
        },
        data() {
            return {
                // 显示搜索条件
                showSearch: true,
                queryParams: {
                    date: "",
                    teamId: "",
                    userId: "",
                },
                value1: [],
                disabled: true,
                userDepts: [],
                listByDept: [],
                productList: [],
                memberList: [],
                channelList: [],
                businessList: [],
                mediation: []
            };
        },
        created() {
            this.getUserDepts();
            this.getList();
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
            /** 询当前用户所在的所有部门 */
            getUserDepts() {
                businessApi.userDepts().then(
                    response => {
                        this.userDepts = response.data;
                    }
                );
            },
            queryUserDepts(value) {
                this.getListByDept(value);
            },
            handleMediation(value) {
                if (value == null) {
                    this.queryParams.userId = "";
                } else {
                    this.queryParams.userId = value.toString()
                }
            },
            getList() {
                businessApi.getTeam(this.queryParams).then(
                    response => {
                        this.businessList = response.data.businessList;
                        this.channelList = response.data.channelList;
                        this.memberList = response.data.memberList;
                        this.productList = response.data.productList;
                    }
                );
            },
            /** 查询当前用户 */
            getListByDept(deptId) {
                businessApi.listByDept(deptId).then(
                    response => {
                        this.listByDept = response.data;
                        this.disabled = false;
                    }
                );
            },
            resetAll() {
                this.mediation = [];
            },
            getSummaries(param) {
                const {
                    columns,
                    data
                } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总计';
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
                        if (index === 1 || index === 6) {
                            sums[index] += ' 个';
                        } else if (index === 4 || index === 7) {
                            sums[index] += ' 笔';
                        } else if (index === 9) {
                            let s = String(sums[index]).indexOf(".") + 1;//获取小数点的位置
                            if(s > 0) {
                                sums[index] = sums[index].toFixed(2) +' %';
                            } else {
                                sums[index] += ' %';
                            }
                        } else if (index === 2 || index === 3|| index === 5|| index === 8) {
                            let y = String(sums[index]).indexOf(".") + 1;//获取小数点的位置
                            if(y > 0) {
                                sums[index] = sums[index].toFixed(2) +' 元';
                            } else {
                                sums[index] += ' 元';
                            }
                        }
                    } else {
                        sums[index] = 'N/A';
                    }
                });
                return sums;
            },
            getSummariesTwo(param) {
                const {
                    columns,
                    data
                } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总计';
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
                        if (index === 1 || index === 2 || index === 4 || index === 5) {
                            sums[index] += ' 个';
                        } else if (index === 3 || index === 7) {
                            sums[index] += ' 条';
                        } else {
                            sums[index] += '';
                        }
                    } else {
                        sums[index] = 'N/A';
                    }
                });

                return sums;
            },
            getRowClass(row) {
                if (row.columnIndex == 9) {
                    return 'background:#33CC99'
                } else if (row.columnIndex == 7 || row.columnIndex == 8) {
                    return 'background:#33CCFF'
                } else {
                    return ''
                }
            },
        }
    };

</script>
<style lang="scss">
    .instruction {
        color: #999;
        font-size: 14px;
        padding-bottom: 5px;
    }

    .refundStatisticsTable {
        width: 100%;
        text-align: center;
        padding: 5px;

        p {
            padding: 5px
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
