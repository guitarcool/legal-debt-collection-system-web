<template>
    <div class="case-info">
        <div class="box">
            <p class="box-title">被申请人基本信息</p>
            <div class="box-content">
                <div class="small-unit">
                    <p class="small-unit-header">姓名：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentName}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">身份证号：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentIdNo}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">户籍地址：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentAddress}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">合同地址：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentAliveAddress}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">出生日期：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentBirthday}}</p>
                </div>
            </div>
        </div>
        <div class="box">
            <p class="box-title">被申请人联系号码列表</p>
            <el-table
                    :data="contactInfosList"
                    style="width: 100%;margin-top: 20px">
                <el-table-column
                        prop="phone"
                        label="电话号码">
                </el-table-column>
                <el-table-column label="有效性" prop="effectiveness">
                    <template slot-scope="scope" v-if="scope.row.effectiveness!=null">
                        <span>{{ effectivenessFormat(scope.row.effectiveness) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="号码筛选类型" prop="screenType">
                    <template slot-scope="scope">
                    <span>{{ screenTypeFormat(scope.row.screenType) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="号码筛选结果" prop="screenResult">
                    <template slot-scope="scope">
                    <span v-if="scope.row.screenType == 1">{{ networkSortresultFormat(scope.row.screenResult) }}</span>
                    <span v-else>{{ realtimeSortresultFormat(scope.row.screenResult) }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="box">
            <p class="box-title">关系人联系号码列表</p>
            <el-table
                    :data="tableData"
                    style="width: 100%;margin-top: 20px">
                <el-table-column
                        prop="relatedRelation"
                        label="关系">
                </el-table-column>
                <el-table-column
                        prop="relatedName"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="relatedContact"
                        label="电话号码">
                </el-table-column>
                <el-table-column label="号码筛选类型" prop="screenType">
                    <template slot-scope="scope">
                    <span>{{ screenTypeFormat(scope.row.screenType) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="号码筛选结果" prop="screenResult">
                    <template slot-scope="scope">
                    <span v-if="scope.row.screenType == 1">{{ networkSortresultFormat(scope.row.screenResult) }}</span>
                    <span v-else>{{ realtimeSortresultFormat(scope.row.screenResult) }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="box" v-if="info.subjectInfo">
            <p class="box-title">标的详情</p>
            <div class="box-content">
                <div class="small-unit">
                    <p class="small-unit-header">放贷主体：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.loanSubject}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">合同编号：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.orderNo}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">借款平台名称：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.platform}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">借款用途：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.purpose}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">放款日期：</p>
                    <p class="small-unit-conent">{{info.subjectInfo.loanDate}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">收款银行：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.dueBank}}</p>
                </div>  
                <div class="small-unit">
                    <p class="small-unit-header">收款银行账号：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.dueBankAccount}}</p>
                </div>                 
                <div class="small-unit">
                    <p class="small-unit-header">借款本金：</p>
                    <p class="small-unit-conent">{{info.subjectInfo.capital}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">逾期总额：</p>
                    <p class="small-unit-conent">{{info.subjectInfo.caseAmount}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">标的金额：</p>
                    <p class="small-unit-conent">{{info.subjectInfo.subjectAmount}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">起始已还本金：</p>
                    <p class="small-unit-conent">{{info.subjectInfo.repaidCapital}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">合同签订日期：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.contractSignDate}}</p>
                </div>


                <div class="small-unit">
                    <p class="small-unit-header">剩余待还总额：</p>
                    <p class="small-unit-conent">{{info.subjectInfo.remainingBalance}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">分期期数：</p>
                    <p class="small-unit-conent">{{info.subjectInfo.terms}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">剩余待还本金：</p>
                    <p class="small-unit-conent">{{info.subjectInfo.overdueCapital}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">已还期数：</p>
                    <p class="small-unit-conent">{{info.subjectInfo.repaidTerms}}</p>
                </div>
                 <div class="small-unit">
                    <p class="small-unit-header">首次还款日期：</p>
                    <p class="small-unit-conent">{{parseTime(info.subjectInfo.firstRepayDate,'{y}-{m}-{d}') }}</p>
                </div>                 
                <div class="small-unit">
                    <p class="small-unit-header">剩余待还利息：</p>
                    <p class="small-unit-conent">{{info.subjectInfo.overdueInterest}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">剩余期数：</p>
                    <p class="small-unit-conent">{{info.subjectInfo.remainTerms}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">剩余待还其他费用：</p>
                    <p class="small-unit-conent">{{info.subjectInfo.overdueOtherFee}}</p>
                </div>
            </div>
        </div>
        <!--网调记录列表-->
        <div class="box">
            <p class="box-title two-distribution">
                <span>网调记录列表</span>
            </p>
            <div>
                <el-table ref="table" :data="adjustData" style="width: 100%; margin-top: 20px">
                    <el-table-column label="网调时间" width="200" prop="createTime">
                        <template slot-scope="scope">
                            <span>{{
                                parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="姓名" prop="name"> </el-table-column>
                    <el-table-column label="关系" prop="relation"> </el-table-column>
                    <el-table-column label="网调标签" :show-overflow-tooltip="true" :formatter="adjustTypeFormat"
                        prop="label">
                    </el-table-column>
                    <el-table-column label="网调情况" width="150" prop="content">
                    </el-table-column>
                    <el-table-column label="操作人" prop="createName" width="150"></el-table-column>
                </el-table>
            </div>
        </div>
        <div class="box">
            <p class="box-title">调解记录</p>
            <recordList :recordList="recordList"></recordList>
        </div>
    </div>
</template>

<script>
    import divisionApi from "@/api/case/division/index";
    import recordList from '../components/recordList'
    export default {
        name: "info",
        components: { recordList },
        data(){
            return{
                tableData: [],
                id:'',
                info:{},
                contactInfosList:[],
                recordList:[],
                effectiveness:[],
                networkSortresult:[],
                realtimeSortresult:[],
                screenType:[],
                adjustData: [],
                adjustType:[]
            }
        },
        created() {
            this.id = this.$route.query.id
            //有效性状态
            this.getDicts("effectiveness").then((response) => {
                this.effectiveness = response.data;
            });
            //在网状态号码筛选结果
            this.getDicts("network_screen_result").then((response) => {
                this.networkSortresult = response.data;
            });
            //网调标签
            this.getDicts("network_adjust_label").then((response) => {
                this.adjustType = response.data;
            });
            //实时在网号码筛选结果
            this.getDicts("realtime_screen_result").then((response) => {
                this.realtimeSortresult = response.data;
            });
            //号码筛选类型
            this.getDicts("screen_Type").then((response) => {
                this.screenType = response.data;
            });
        },
        watch: {
            //监控路由参数，实现自己跳自己刷新数据
            $route() {
                this.id = this.$route.query.id
            },
            id() {
                if(!this.id){
                    return
                }
                //初始化前清空数据
                this.info = {};
                this.contactInfosList=[];
                this.tableData=[];
                this.adjustData=[];
                this.recordList=[];
                this.getInfo()
            },
        },
        methods:{
            getInfo() {
                divisionApi.info(this.id).then(
                    response=> {
                        this.info = response.data
                        this.adjustData = response.data.networkAdjustRecords || [];
                        this.contactInfosList = response.data.contactInfos || [];
                        this.tableData = response.data.relatedInfoList || [];
                        this.recordList = response.data.mediationRecords || [];
                    }
                );
            },
            // 有效性状态字典翻译
            effectivenessFormat(effectiveness) {
                return this.selectDictLabel(this.effectiveness, effectiveness);
            },
            //号码筛选类型
            screenTypeFormat(screenType) {
                return this.selectDictLabel(this.screenType, screenType);
            },
            //实时在网号码筛选结果
            realtimeSortresultFormat(realtimeSortresult) {
                return this.selectDictLabel(this.realtimeSortresult, realtimeSortresult);
            },
            //在网状态号码筛选结果
            networkSortresultFormat(networkSortresult) {
                return this.selectDictLabel(this.networkSortresult, networkSortresult);
            },
            //网调标签
            adjustTypeFormat(row, column) {
                return this.selectDictLabel(this.adjustType, row.label);
            },
        }
    }
</script>

<style scoped lang="scss">
    .case-info{
         margin: 10px 15px;
    }
</style>
