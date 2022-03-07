<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" @submit="getList"
            @resetAll="resetAll">
            <template #default>
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

                    <div class="box-content" style="margin-top:25px">
                        <div>
                            <div class="numericalDisplay" style="padding-bottom:10px">
                                <div>案件总数</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{feedback.dayTotalCount||0}}笔</div>
                            </div>
                            <div class="numericalDisplay" style="padding-top:10px">
                                <div>月累计回款案件数</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{feedback.monthCaseCount||0}}笔</div>
                            </div>
                        </div>
                        <div>
                            <div class="numericalDisplay" style="padding-bottom:10px">
                                <div>案件总金额</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{feedback.dayAmountCount||0}}元</div>
                            </div>
                            <div class="numericalDisplay" style="padding-top:10px">
                                <div>月累计回款笔数</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{feedback.monthTotalCount||0}}笔</div>
                            </div>
                        </div>
                        <div>
                            <div class="numericalDisplay" style="padding-bottom:10px">
                                <div>月目标回款金额</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{feedback.monthTargetAmount||0}}元</div>
                            </div>
                            <!-- <div class="numericalDisplay" style="padding-bottom:10px">
                                <div>月目标回款案件数</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{feedback.monthTargetCount}}笔</div>
                            </div> -->
                            <div class="numericalDisplay" style="padding-top:10px">
                                <div>月累计回款金额</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{feedback.monthAmountCount||0}}元</div>
                            </div>
                        </div>
                        <!-- <div>
                            <div class="numericalDisplay" style="padding-bottom:10px">
                                <div>月目标回款金额</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{feedback.monthTargetAmount}}元</div>
                            </div>
                            <div class="numericalDisplay" style="padding-top:10px">
                                <div></div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;"></div>
                            </div>
                        </div> -->
                        <div>
                            <div class="numericalDisplay" style="padding-bottom:10px">
                                <div>日回款笔数</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">{{feedback.dayTotal||0}}笔
                                </div>
                            </div>
                            <div class="numericalDisplay" style="padding-top:10px">
                                <div>月回款目标完成度</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{feedback.monthTargetRatio||0}}%</div>
                            </div>
                        </div>
                        <div>
                            <div class="numericalDisplay" style="padding-bottom:10px">
                                <div>日回款金额</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">{{feedback.dayAmount||0}}元
                                </div>
                            </div>
                            <div class="numericalDisplay" style="padding-top:10px">
                                <div></div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <div style="display: flex;align-items: center;">
                        <p class="box-title">日业务产能统计</p>
                        <el-tooltip placement="top">
                            <div slot="content">
                                注释：数据截止至统计日
                                <br />1.日案件跟进数为当日有新增调解记录的案件个数
                            </div>
                            <i class="el-icon-question" style="padding-left:5px;"></i>
                        </el-tooltip>
                    </div>
                    <div class="box-content" style="margin-top:25px;">
                        <div class="twoNumericalDisplay">
                            <div class="numericalDisplay">
                                <div>日案件跟进数</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{business.caseFollowNum||0}}笔</div>
                            </div>
                            <div class="numericalDisplay">
                                <div>日电话通话次数</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">{{business.phoneCount||0}}次
                                </div>
                            </div>
                            <div class="numericalDisplay">
                                <div>日电话接通量</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{business.phonePassCount||0}}个</div>
                            </div>
                            <div class="numericalDisplay">
                                <div>日通话时长</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">{{business.phoneTimes||0}}分钟
                                </div>
                            </div>
                            <div class="numericalDisplay">
                                <div>日短信发送量</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">{{business.smsNum||0}}条</div>
                            </div>
                            <div class="numericalDisplay">
                                <div>日新增调解记录</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{business.mediationRecord||0}}条</div>
                            </div>
                            <div class="numericalDisplay">
                                <div>日新增意向还款案件</div>
                                <div style="font-size:20px;font-weight:700;padding-top:10px;">
                                    {{business.intentionToRepay||0}}笔</div>
                            </div>
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
                    date: ""
                },
                business: {},
                feedback: {},
            };
        },
        created() {
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
            /** 查询角色列表 */
            getList() {
                businessApi.getPersonal(this.queryParams).then(
                    response => {
                        this.business = response.data.business;
                        this.feedback = response.data.feedback;
                    }
                );
            },
            resetAll() {},
        },
    };

</script>
<style lang="scss">
    .instruction {
        color: #999;
        font-size: 14px;
        padding-bottom: 10px;
    }

    .numericalDisplay {
        width: 150px;
        display: flex;
        flex-direction: column;
        text-align: center;
    }

    .twoNumericalDisplay {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

</style>
