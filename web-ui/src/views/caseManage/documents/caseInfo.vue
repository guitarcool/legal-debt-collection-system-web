<template>
    <div class="case-info">
        <div class="box">
            <p class="box-title">订单信息</p>
            <div class="box-content">
                <div class="small-unit">
                    <p class="small-unit-header">订单号：</p>
                    <p class="small-unit-conent">{{info.id}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">状态：</p>
                    <p class="small-unit-conent">{{statusFormat(info.caseStatus)}}</p>
                </div>
            </div>
        </div>
        <div class="box">
            <p class="box-title">被申请人基本信息</p>
            <div class="box-content">
                <div class="small-unit">
                    <p class="small-unit-header">姓名：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentName}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">身份证号码：</p>
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
            <p class="box-title">联系信息</p>
            <el-table
                    ref="table"
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
                <el-table-column label="有效性" prop="effectiveness">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.effectiveness">{{ effectivenessFormat(scope.row.effectiveness) }}</span>
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
                <el-table-column label="已拨次数" prop="frequency">

                </el-table-column>
            </el-table>
        </div>
        <!--标的详情-->
        <div class="box" v-if="info.subjectInfo">
            <p class="box-title two-distribution">
                <span>标的详情</span>
            </p>
            <div class="box-content">
                <div class="small-unit">
                    <p class="small-unit-header">放贷主体：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.loanSubject}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">案件发布公司：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.orderNo}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">合同编号：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.orderNo}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">案件发布时间：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.orderNo}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">产品名称：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.platform}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header"></p>
                    <p class="small-unit-conent"></p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header"></p>
                    <p class="small-unit-conent"></p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header"></p>
                    <p class="small-unit-conent"></p>
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
        <!--调解记录-->
        <div class="box">
            <p class="box-title">调解记录</p>
            <recordList :recordList="recordList"></recordList>
        </div>
    </div>
</template>

<script>
    import recordList from '../components/recordList'
    import templateApi from "@/api/case/document/templateIndex";
    export default {
        name: "caseInfo",
        components: { recordList },
        data(){
            return{
                tableData: [],
                id:'',
                info:'',
                statusOptions: [],
                recordList: [],
                networkSortresult:[],
                realtimeSortresult:[],
                screenType:[],
            }
        },
        created() {
            this.id = this.$route.query.documentId
            //案件状态
            this.getDicts("case_status").then((response) => {
                this.statusOptions = response.data;
            });
            //有效性状态
            this.getDicts("effectiveness").then((response) => {
                this.effectiveness = response.data;
            });
            //在网状态号码筛选结果
            this.getDicts("network_screen_result").then((response) => {
                this.networkSortresult = response.data;
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
                this.id = this.$route.query.documentId
            },
            id() {
                if(!this.id){
                    return
                }
                //初始化前清空数据
                this.info = '';
                this.tableData=[];
                this.recordList = [];
                this.getInfo()
            },
        },
        methods:{
            getInfo() {
                templateApi.caseInfo(this.id).then(
                    response => {
                        this.info = response.data
                        if(response.data.contactInfos&&response.data.contactInfos.length > 0){
                            for (var i = 0; i < response.data.contactInfos.length; i++) {
                                response.data.contactInfos[i]['relatedRelation'] = `本人${i + 1}`
                                response.data.contactInfos[i]['relatedName'] = this.info.borrowerInfo.respondentName
                                response.data.contactInfos[i]['relatedContact'] = response.data.contactInfos[i].phone
                            }
                            this.tableData = response.data.contactInfos.concat(response.data.relatedInfoList || [])
                        }else{
                            this.tableData = response.data.relatedInfoList || []
                        }
                        //contactInfos

                        this.recordList = response.data.mediationRecords || [];
                    }
                );
            },
            // 状态字典翻译
            statusFormat(caseStatus) {
                return this.selectDictLabel(this.statusOptions, caseStatus);
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
        }
    }
</script>

<style scoped lang="scss">
    .case-info{
         margin: 10px 15px;
    }
    .big-width{

    }
</style>
