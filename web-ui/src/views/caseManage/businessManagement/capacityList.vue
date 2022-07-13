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
                <el-form-item label="是否重跑：">
                    <el-select clearable filterable size="small" v-model="queryParams.reRun" placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template #filter>
            </template>
            <template #buttonArea>
                <el-button style="margin-left: 16px;" type="danger" icon="el-icon-download" size="mini"
                    v-hasPermi="['count:excel:down']" @click="batchDownloadRecording">导出
                </el-button>
            </template>

        </search-bar>
        <div class="box-contnet-wrap">
            <div class="case-info">
                <div class="box">
                    <div style="display: flex;align-items: center;">
                        <p class="box-title">智方调各调解员回款统计</p>
                    </div>
                    <p style="margin-top:20px;">
                        <span style="margin-right:20px;">当月回款总目标： <span
                                style="color:red">{{queryData.totalAmount||'—'}}元</span></span>
                        <span style="margin-right:20px;">数据截止：<span
                                style="color:red">{{queryData.date||'—'}}</span></span>
                        <span>本月剩余时间：<span style="color:red">{{queryData.daysRemaining||'—'}}天</span></span>
                    </p>
                    <div class="box-content" style="margin-top:20px;">
                        <el-table v-loading="loading" max-height="550" :header-cell-style="headStyle"
                            :cell-style="rowStyle" :data="queryData.reportMediateCount" border style="width: 100%">
                            <el-table-column prop="0" label="部门" width="150"></el-table-column>
                            <el-table-column prop="1" label="用户"></el-table-column>
                            <el-table-column label="案件信息(调解员)">
                                <el-table-column prop="2" label="案件量"></el-table-column>
                                <el-table-column prop="3" label="案件金额" width="150"></el-table-column>
                            </el-table-column>
                            <el-table-column label="当日回款(操作员)">
                                <el-table-column label="调解">
                                    <el-table-column prop="4" label="调解回款"></el-table-column>
                                    <el-table-column prop="5" label="调解回款金额" width="100"></el-table-column>
                                </el-table-column>
                                <el-table-column label="财保">
                                    <el-table-column prop="6" label="财保回款"></el-table-column>
                                    <el-table-column prop="7" label="财保回款金额" width="100"></el-table-column>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column label="当月回款(操作员)">
                                <el-table-column label="调解">
                                    <el-table-column prop="8" label="调解回款"></el-table-column>
                                    <el-table-column prop="9" label="调解回款金额" width="100"></el-table-column>
                                </el-table-column>
                                <el-table-column label="财保">
                                    <el-table-column prop="10" label="财保回款"></el-table-column>
                                    <el-table-column prop="11" label="财保回款金额" width="100"></el-table-column>
                                </el-table-column>
                                <el-table-column prop="12" label="回款率"></el-table-column>
                                <el-table-column prop="13" label="当月回款总额" width="100"></el-table-column>
                                <el-table-column prop="14" label="当月回款目标" width="100"></el-table-column>
                                <el-table-column prop="15" label="目标完成度"></el-table-column>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="box-content" style="margin-top:40px;">
                        <el-table v-loading="loading" max-height="550" :header-cell-style="headStyle"
                            :cell-style="rowStyle" :data="queryData.reportChannelCount" border style="width: 100%">
                            <el-table-column prop="0" label="部门" />
                            <el-table-column prop="1" label="回款渠道" />
                            <el-table-column prop="2" label="当日回款案件量" />
                            <el-table-column prop="3" label="当日回款金额" />
                            <el-table-column prop="4" label="当月回款案件量" />
                            <el-table-column prop="5" label="当月回款金额" />
                            <el-table-column prop="6" label="当月回款目标" />
                            <el-table-column prop="7" label="目标完成度" />
                        </el-table>
                    </div>
                </div>
                <div class="box">
                    <div style="display: flex;align-items: center;">
                        <p class="box-title">鹰潭各批次案件回款统计</p>
                    </div>
                    <p style="margin-top:20px;">
                        <span>数据截止时间：<span style="color:red">{{queryData.date||'—'}}</span></span>
                    </p>
                    <div class="box-content" style="margin-top:20px;">
                        <el-table v-loading="loading" max-height="550" :header-cell-style="headStyle"
                            :cell-style="rowStyle" :data="queryData.reportBatchCount" border style="width: 100%">
                            <el-table-column prop="0" label="案件批次号" />
                            <el-table-column prop="1" label="案件量" />
                            <el-table-column prop="2" label="案件金额" />
                            <el-table-column prop="3" label="历史回款案件量" />
                            <el-table-column prop="4" label="历史回款金额" />
                            <el-table-column prop="5" label="历史回款率" />
                            <el-table-column prop="6" label="当日回款案件量" />
                            <el-table-column prop="7" label="当日回款金额" />
                            <el-table-column prop="8" label="当月回款案件量" />
                            <el-table-column prop="9" label="当月回款金额" />
                            <el-table-column prop="10" label="当月回款率" />
                        </el-table>
                    </div>
                    <div class="box-content" style="margin-top:40px;">
                        <el-table v-loading="loading" max-height="550" :header-cell-style="headStyle"
                            :cell-style="rowStyle" :data="queryData.reportProducingCount" border style="width: 100%">
                            <el-table-column prop="0" label="部门" width="150" />
                            <el-table-column prop="1" label="用户" />
                            <el-table-column prop="2" label="日跟进案件量" />
                            <el-table-column prop="3" label="日新增还款额" />
                            <el-table-column prop="4" label="日新增意向还款案件量" />
                            <el-table-column prop="5" label="日新增意向还款金额" />
                            <el-table-column prop="6" label="日一般外呼量" />
                            <el-table-column prop="7" label="日预测外呼量" />
                            <el-table-column prop="8" label="日电话接通数" />
                            <el-table-column prop="9" label="日接通率" />
                            <el-table-column prop="10" label="日通话时长(分)" />
                            <el-table-column prop="11" label="日短信发送量" />
                            <el-table-column prop="12" label="日新增调解记录" />
                            <el-table-column prop="13" label="今日预计待还标的金额" />
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <exportDialog :title="exportData.title" :show.sync="exportData.dialogVisible" :date="exportData.date"
            :requestApi="exportData.requestApi"></exportDialog>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import exportDialog from "../components/exportDialog";
    import businessApi from "@/api/case/business/index";
    import {
        downLoadXlsx
    } from "@/utils/zipdownload";
    export default {
        name: "list",
        components: {
            SearchBar,
            exportDialog
        },
        data() {
            return {
                // 显示搜索条件
                loading: false,
                showSearch: true,
                queryParams: {
                    date: "",
                    reRun: ""
                },
                memberList: [],
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    requestApi: "",
                },
                queryData: {}
            };
        },
        created() {
            let time = this.timestampToTime();
            this.queryParams.date = time;
            this.queryParams.reRun = "0";
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
            getList() {
                if (this.queryParams.reRun == 1) {
                    var that = this;
                    this.$confirm(`重跑会覆盖当天的数据，是否继续?`, "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        })
                        .then(() => {
                            that.loading = true;
                            businessApi.getExcelList(that.queryParams).then(response => {
                                that.queryData = response.data;
                                that.loading = false;
                            }).catch(() => {
                                that.loading = false;
                                that.queryData = {};
                            });
                        })
                        .catch(() => {
                            that.msgInfo("已取消操作");
                        });
                } else {
                    this.loading = true;
                    businessApi.getExcelList(this.queryParams).then(response => {
                        this.queryData = response.data;
                        this.loading = false;
                    }).catch(() => {
                        this.loading = false;
                        this.queryData = {};

                    });
                }
            },
            headStyle() {
                return "text-align:center"
            },
            rowStyle() {
                return "text-align:center"
            },
            //获取当前时间
            timestampToTime() {
                let yy = new Date().getFullYear();
                let mm = new Date().getMonth() + 1;
                let dd = new Date().getDate();
				mm = mm < 10 ? "0" + mm : mm; //月小于10，加0
				dd = dd < 10 ? "0" + dd : dd; //day小于10，加0
                return yy + '-' + mm + '-' + dd;
            },
            /** 导出按钮操作 */
            batchDownloadRecording() {
                const date = this.queryParams.date;
                const reRun = this.queryParams.reRun;
                this.$confirm("是否确认导出回款统计表文件?", "警告", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(function () {
                        downLoadXlsx(`/count/excel/down?date=${date}&reRun=${reRun}`, "回款统计表");
                    })
                    .catch(function () {});
            },
            resetAll() {
                let time = this.timestampToTime();
                this.queryParams.date = time;
                this.queryParams.reRun = "0";
            },
        }
    };

</script>
<style lang="scss"></style>
