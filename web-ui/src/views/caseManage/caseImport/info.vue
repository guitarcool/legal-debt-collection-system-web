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
                    <p class="small-unit-header">内部客户号：</p>
                    <p class="small-unit-conent">{{info.loanId}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">资产转让方：</p>
                    <p class="small-unit-conent">{{info.assetTransferor}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">资产受让方：</p>
                    <p class="small-unit-conent">{{info.assetAssignee}}</p>
                </div>
            </div>
        </div>
        <div class="box">
            <p class="box-title">借款人信息</p>
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
                    <p class="small-unit-header">性别：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentSex}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">手机号：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentPhone}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">户籍地址：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentAddress}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">出生日期：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentBirthday}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">合同地址：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentAliveAddress}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">工作单位名称：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.workUnitName}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">单位地址：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.workUnitAddress}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">单位电话：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.workUnitPhone}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">邮箱：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentEmail}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">QQ：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentQq}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">微信号：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentChat}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">学历：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentEducation}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">职业：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentOccupation}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">婚姻状况：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.maritalStatus}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">本人手机号2：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentPhone2}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">本人手机号3：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentPhone3}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header big-width">被申请人户籍地省份：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.loanProvince}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">被申请人户籍地地级市：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.loanCity}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">被申请人户籍地县/区：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.loanCounty}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">被申请人民族：</p>
                    <p class="small-unit-conent"  v-if="info.borrowerInfo">{{info.borrowerInfo.respondentNation}}</p>
                </div>
            </div>
        </div>
        <div class="box">
            <p class="box-title">关联人信息</p>
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
                <el-table-column label="已拨次数" prop="frequency">

                </el-table-column>
            </el-table>
        </div>
        <div class="box" v-if="info.loanContractInfo">
            <p class="box-title">借款合同基本信息</p>
            <div class="box-content">
                <div class="small-unit">
                    <p class="small-unit-header">放贷主体：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.loanSubject}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">借贷平台名称：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.platform}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">合同编号：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.orderNo}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">合同金额：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.contractAmount}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">合同签订日期：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.contractSignDate}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">借款用途：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.purpose}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">放款日期：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.loanDate}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">分期期数：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.terms}}</p>
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
                    <p class="small-unit-conent">{{info.loanContractInfo.capital}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">贷款利息（年化利率）：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.interest}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">贷款其他费用：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.loanOtherCost}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">每期应还本金：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.perRepayAmount}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">每期应还利息：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.perRepayInterest}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">每期应还其他费用：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.perRepayOtherAmount}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">还款日/扣款日：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.perRepayDay}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">扣款银行：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.accountBank}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">扣款银行卡账号：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.accountNum}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">原合同-合同开始日期：</p>
                    <p class="small-unit-conent">{{parseTime(info.loanContractInfo.loanBeginDate,'{y}-{m}-{d}') }}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">原合同-合同截止时间：</p>
                    <p class="small-unit-conent">{{parseTime(info.loanContractInfo.loanEndDate,'{y}-{m}-{d}') }}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">原合同-利率(24/36）：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.originalInterest}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">原合同-每期还款金额：</p>
                    <p class="small-unit-conent">{{info.loanContractInfo.originalPerRepayAmount}}</p>
                </div>
            </div>
        </div>
        <div class="box" v-if="info.overdueInfo">
            <p class="box-title">逾期详细信息</p>
            <div class="box-content">
                <div class="small-unit">
                    <p class="small-unit-header">逾期总额：</p>
                    <p class="small-unit-conent">{{info.overdueInfo.caseAmount}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">逾期本金：</p>
                    <p class="small-unit-conent">{{info.overdueInfo.overdueCapital}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">罚息：</p>
                    <p class="small-unit-conent">{{info.overdueInfo.overdueInterest}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">逾期其他费用：</p>
                    <p class="small-unit-conent">{{info.overdueInfo.overdueOtherFee}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">逾期时间：</p>
                    <p class="small-unit-conent">{{parseTime(info.overdueInfo.overdueStartTime,'{y}-{m}-{d}') }}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">首逾日期：</p>
                    <p class="small-unit-conent">{{parseTime(info.overdueInfo.overdueFirstDate,'{y}-{m}-{d}') }}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">逾期次数：</p>
                    <p class="small-unit-conent">{{info.overdueInfo.overdueTime}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">逾期天数：</p>
                    <p class="small-unit-conent">{{info.overdueInfo.overdueDay}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">逾期期数：</p>
                    <p class="small-unit-conent">{{info.overdueInfo.overdueTerm}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">逾期年利率：</p>
                    <p class="small-unit-conent">{{info.overYearRate}}</p>
                </div>               
            </div>
        </div>
        <div class="box" v-if="info.repaidInfo">
            <p class="box-title">还款详细信息</p>
            <div class="box-content">
                <div class="small-unit">
                    <p class="small-unit-header">已还本金：</p>
                    <p class="small-unit-conent">{{info.repaidInfo.repaidCapital}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">已还利息：</p>
                    <p class="small-unit-conent">{{info.repaidInfo.repaidInterest}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">已还其他费用：</p>
                    <p class="small-unit-conent">{{info.repaidInfo.repaidOtherFee}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">已还期数：</p>
                    <p class="small-unit-conent">{{info.repaidInfo.repaidTerms}}</p>
                </div>
                 <div class="small-unit">
                    <p class="small-unit-header">首次还款日期：</p>
                    <p class="small-unit-conent">{{parseTime(info.repaidInfo.firstRepayDate,'{y}-{m}-{d}') }}</p>
                </div>               
                <div class="small-unit">
                    <p class="small-unit-header">末次还款日期：</p>
                    <p class="small-unit-conent">{{parseTime(info.repaidInfo.lastRepayDate,'{y}-{m}-{d}') }}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">末次还款金额：</p>
                    <p class="small-unit-conent">{{info.repaidInfo.lastRepayAmount}}</p>
                </div>
            </div>
        </div>
        <div class="box">
            <p class="box-title">备注</p>
            <div class="box-content">
                <div class="small-unit">
                    <p class="small-unit-header">剩余待还总额计算规则：</p>
                    <p class="small-unit-conent">{{info.remark}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">备注2：</p>
                    <p class="small-unit-conent">{{info.remark2}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">备注3：</p>
                    <p class="small-unit-conent">{{info.remark3}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">备注4：</p>
                    <p class="small-unit-conent">{{info.remark4}}</p>
                </div>
                <div class="small-unit">
                    <p class="small-unit-header">备注5：</p>
                    <p class="small-unit-conent">{{info.remark5}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import importApi from "@/api/case/import/index";
    export default {
        name: "info",
        data(){
            return{
                tableData: [],
                effectiveness:[],
                networkSortresult:[],
                realtimeSortresult:[],
                screenType:[],
                id:'',
                info:''
            }
        },
        created() {
            this.id = this.$route.query.listid
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
                this.id = this.$route.query.listid
            },
            id() {
                if(!this.id){
                    return
                }
                //初始化前清空数据
                this.info = '';
                this.tableData=[];
                this.getInfo()
            },
        },
        methods:{
            getInfo() {
                //this.loading = true;
                importApi.info(this.id).then(
                    response => {
                        console.log(response)
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
                        //this.tableData = response.data.relatedInfoList || []
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
