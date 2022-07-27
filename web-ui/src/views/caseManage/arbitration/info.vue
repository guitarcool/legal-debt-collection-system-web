<template>
    <div class="case-info">
        <!--第一部分-->
        <div class="box">
            <div class="box-title two-distribution">
                <div>
                    <span style="color:#000;font-size:18px;margin-right:10px"
                        >姓名: {{ firstInfo.name }}</span
                    >
                    <span
                        >【案件状态：{{
                            statusFormat(firstInfo.caseStatus)
                        }}】</span
                    >
                    <span v-if="firstInfo.commonCaseNum > 1">
                        <el-tag type="danger" effect="plain">共债</el-tag>
                    </span>
                </div>
                <div>
                    <el-button
                        circle
                        size="mini"
                        icon="el-icon-edit"
                        v-hasPermi="['case:postAdjudged:getCaseEditData']"
                        @click="editInformation"
                    ></el-button>
                    <el-button
                        v-if="firstInfo.isDesensitization"
                        :disabled="isDisable"
                        circle
                        size="mini"
                        icon="el-icon-view"
                        @click="viewData"
                    ></el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        v-if="buttonChange"
                        @click="nextCase(1)"
                        >上一案</el-button
                    >
                    <el-button
                        size="mini"
                        style="margin-right:10px"
                        type="primary"
                        v-if="buttonChange"
                        @click="nextCase(2)"
                        >下一案</el-button
                    >
                    <el-dropdown
                        style="margin-right:10px"
                        v-if="firstInfo.caseStatus != 13"
                        @command="changeButton"
                    >
                        <el-button type="primary" size="mini">
                            变更案件状态<i
                                class="el-icon-arrow-down el-icon--right"
                            ></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                v-for="(item, index) in componentsName"
                                :command="item.eName"
                                :key="index"
                            >
                                {{ item.cName }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown
                        slot="append"
                        v-if="firstInfo.caseStatus != 13"
                    >
                        <el-button type="primary" size="mini">
                            还款登记<i
                                class="el-icon-arrow-down el-icon--right"
                            ></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                v-hasPermi="['case:adjudged:repayment']"
                                @click.native="handleReimbursement(0)"
                                >部分还款</el-dropdown-item
                            >
                            <el-dropdown-item
                                v-hasPermi="['case:adjudged:repayment']"
                                @click.native="handleReimbursement(1)"
                                >结清</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="box-content">
                <div class="small-three">
                    <p class="small-unit-header">案件批次号：</p>
                    <p class="small-unit-conent">{{ firstInfo.batchNo }}</p>
                </div>
                <div class="small-three">
                    <p class="small-unit-header">放贷主体：</p>
                    <p class="small-unit-conent">{{ firstInfo.loanSubject }}</p>
                </div>
                <div class="small-three">
                    <p class="small-unit-header">产品名称：</p>
                    <p class="small-unit-conent">{{ firstInfo.productName }}</p>
                </div>
                <div class="small-three">
                    <p class="small-unit-header">逾期账龄：</p>
                    <p class="small-unit-conent">{{ firstInfo.overdueAge }}</p>
                </div>
                <div class="small-three">
                    <p class="small-unit-header">标的金额：</p>
                    <p class="small-unit-conent">
                        {{ firstInfo.subjectAmount }}
                    </p>
                </div>
                <div class="small-three">
                    <p class="small-unit-header">剩余待还总额：</p>
                    <p class="small-unit-conent">
                        {{ firstInfo.remainingBalance }}
                    </p>
                </div>
                <div class="small-three">
                    <p class="small-unit-header">还款状态：</p>
                    <p class="small-unit-conent">
                        {{ repayFormat(firstInfo.repayStatus) }}
                    </p>
                </div>
                <div class="small-three">
                    <p class="small-unit-header">联系状态：</p>
                    <p class="small-unit-conent">
                        {{ contactStatusFormat(firstInfo.contactStatus) }}
                    </p>
                </div>
                <div class="small-three">
                    <p class="small-unit-header">财保状态：</p>
                    <p class="small-unit-conent">
                        {{ preStatusFormat(firstInfo.preStatus) }}
                    </p>
                </div>
                <div class="small-three">
                    <p class="small-unit-header">最近一次网调标签：</p>
                    <p class="small-unit-conent">
                        {{ adjustFormat(firstInfo.networkAdjustLabel) }}
                    </p>
                </div>
                <div class="small-three">
                    <p class="small-unit-header">最近一次调解标签：</p>
                    <p class="small-unit-conent">
                        {{ contactResultFormat(firstInfo.medLable) }}
                    </p>
                </div>
                <div class="small-three">
                    <p class="small-unit-header">承诺还款日：</p>
                    <p class="small-unit-conent">
                        {{
                            parseTime(firstInfo.promiseRepayDate, "{y}-{m}-{d}")
                        }}
                    </p>
                </div>
                <div class="small-three">
                    <p class="small-unit-header">最近一次短信送达状态：</p>
                    <P v-if="firstInfo.providerType == 1">
                        {{
                            shisuyunStatusFormat(firstInfo.deliverStatus) != ""
                                ? shisuyunStatusFormat(firstInfo.deliverStatus)
                                : firstInfo.deliverStatus
                        }}
                    </P>
                    <p v-if="firstInfo.providerType == 2">
                        {{
                            wodongStatusFormat(firstInfo.deliverStatus) != ""
                                ? wodongStatusFormat(firstInfo.deliverStatus)
                                : firstInfo.deliverStatus
                        }}
                    </p>
                    <p v-if="firstInfo.providerType == 3">
                        {{
                            xuanwuStatusFormat(firstInfo.deliverStatus) != ""
                                ? xuanwuStatusFormat(firstInfo.deliverStatus)
                                : firstInfo.deliverStatus
                        }}
                    </p>
                </div>
                <div class="small-three" v-if="firstInfo.commonCaseNum > 1">
                    <p class="small-unit-header">共债案件数量：</p>
                    <p class="small-unit-conent">
                        {{ firstInfo.commonCaseNum }}
                    </p>
                </div>
                <div class="small-three" v-if="firstInfo.commonCaseNum > 1">
                    <p class="small-unit-header">共债案件标的总额：</p>
                    <p class="small-unit-conent">
                        {{ firstInfo.commonSubjectAmount }}
                    </p>
                </div>
                <div class="small-three" v-if="firstInfo.commonCaseNum > 1">
                    <p class="small-unit-header">共债案件剩余待还总额：</p>
                    <p class="small-unit-conent">
                        {{ firstInfo.commonRemainingBalanceAmount }}
                    </p>
                </div>
            </div>
        </div>
        <!--第二部分-->
        <div class="box">
            <el-tooltip
                style="float: right;position: relative;z-index: 11;"
                class="item"
                effect="dark"
                content="刷新"
                placement="top"
            >
                <el-button
                    circle
                    icon="el-icon-refresh"
                    @click="getCaseBaseInfo(infoType)"
                />
            </el-tooltip>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="标的详情" name="subject">
                    <div class="box-content" v-if="subjectInfo">
                        <div class="small-three">
                            <p class="small-unit-header">放贷主体：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.loanSubject }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">产品名称：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.productName }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header"></p>
                            <p class="small-unit-conent"></p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">资产转让方：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.assetTransferor }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">资产受让方：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.assetAssignee }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header"></p>
                            <p class="small-unit-conent"></p>
                        </div>
                        <div class="small-three" style="margin-bottom:20px">
                            <p class="small-unit-header">合同编号：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.orderNo }}
                            </p>
                        </div>
                        <div class="small-three" style="margin-bottom:20px">
                            <p class="small-unit-header">合同签订日期：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.contractSignDate }}
                            </p>
                        </div>
                        <div class="small-three" style="margin-bottom:20px">
                            <p class="small-unit-header">合同地址：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.contractAddr }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">借款本金：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.capital }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">分期期数：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.terms }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">逾期总额：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.caseAmount }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">标的金额：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.subjectAmount }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">放款日期：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.loanDate }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">收款银行账号：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.dueBankAccount }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">收款银行：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.dueBank }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">借款用途：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.purpose }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">
                                贷款利息（年化利率）：
                            </p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.interest }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">逾期年利率：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.overYearRate }}
                            </p>
                        </div>
                        <div style="margin-top:20px;width:100%;"></div>
                        <div class="small-three">
                            <p class="small-unit-header">首次还款日期：</p>
                            <p class="small-unit-conent">
                                {{
                                    parseTime(
                                        subjectInfo.firstRepayLocalDateTime,
                                        "{y}-{m}-{d}"
                                    )
                                }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">起始已还本金：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.repaidCapital }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">已还期数：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.repaidTerms }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">末次还款日期：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.lastRepayLocalDateTime }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">逾期时间：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.overdueStartTime }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">逾期天数：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.overdueDay }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">剩余待还本金：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.overdueCapital }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">剩余待还利息：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.overdueInterest }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">剩余待还其他费用：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.overdueOtherFee }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">诉讼费：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.legalCosts }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header"></p>
                            <p class="small-unit-conent"></p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header"></p>
                            <p class="small-unit-conent"></p>
                        </div>
                        <div style="margin-top:20px;width:100%;"></div>
                        <div class="small-three">
                            <p class="small-unit-header">剩余待还总额：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.remainingBalance }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">调解还款总额：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.repayAmount }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">调解待还总额：</p>
                            <p class="small-unit-conent">
                                {{ subjectInfo.outstandingAmount }}
                            </p>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="联系号码" name="contact">
                    <!--被申请人联系号码列表-->
                    <div class="box" style="margin-bottom:0px">
                        <p class="box-title two-distribution">
                            <span>被申请人联系号码列表</span>
                            <span>
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click="addPhone(firstInfo.name)"
                                    v-hasPermi="[
                                        'case:relatedInfo:adjudgedAdd'
                                    ]"
                                    >新增</el-button
                                >
                                <el-button
                                    v-if="firstInfo.caseStatus != 13"
                                    size="mini"
                                    :disabled="
                                        firstInfo.letterRepairStatus == 1 ||
                                            firstInfo.letterRepairStatus == 2
                                    "
                                    type="success"
                                    @click="applyEdit"
                                    v-hasPermi="['case:adjudged:letterRepair']"
                                    >申请案件信修</el-button
                                >
                            </span>
                        </p>
                        <div>
                            <el-table
                                ref="singleTable"
                                :data="contactInfosList"
                                :cell-style="singlecellStyle"
                                style="width: 100%; margin-top: 20px"
                            >
                                <el-table-column
                                    prop="relatedRelation"
                                    label="关系"
                                >
                                    <template>
                                        <span>本人</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="姓名"
                                    prop="respondentName"
                                >
                                </el-table-column>
                                <el-table-column prop="phone" label="电话号码">
                                    <template slot="header">
                                        <el-tooltip
                                            effect="dark"
                                            content="失联、空号、停机”号码为标记为红色"
                                            placement="top"
                                        >
                                            <span
                                                >电话号码<i
                                                    class="el-icon-info"
                                                ></i
                                            ></span>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="有效性"
                                    prop="effectiveness"
                                >
                                    <template slot-scope="scope">
                                        <span>{{
                                            effectivenessFormat(
                                                scope.row.effectiveness
                                            )
                                        }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="号码筛选类型"
                                    prop="screenType"
                                >
                                    <template slot-scope="scope">
                                        <span>{{
                                            screenTypeFormat(
                                                scope.row.screenType
                                            )
                                        }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="号码筛选结果"
                                    prop="screenResult"
                                >
                                    <template slot-scope="scope">
                                        <span
                                            v-if="scope.row.screenType == 1"
                                            >{{
                                                networkSortresultFormat(
                                                    scope.row.screenResult
                                                )
                                            }}</span
                                        >
                                        <span v-else>{{
                                            realtimeSortresultFormat(
                                                scope.row.screenResult
                                            )
                                        }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="已拨次数"
                                    prop="frequency"
                                >
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    width="400"
                                    fixed="right"
                                    align="center"
                                >
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            type="warning"
                                            v-if="
                                                firstInfo.caseStatus != 13 &&
                                                    token
                                            "
                                            @click="callMe(scope.row)"
                                            >一键外呼
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            type="primary"
                                            v-if="firstInfo.caseStatus != 13"
                                            v-hasPermi="['shortMsg:send']"
                                            @click="handleExport(scope.row)"
                                            >短信发送
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <!--关系人联系号码列表-->
                    <div class="box" style="margin-bottom:0px">
                        <p class="box-title">关系人联系号码列表</p>
                        <div>
                            <el-table
                                ref="table"
                                :data="relationalContactList"
                                :cell-style="cellStyle"
                                style="width: 100%; margin-top: 20px"
                            >
                                <el-table-column
                                    prop="relatedRelation"
                                    label="关系"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="relatedName"
                                    label="姓名"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="relatedContact"
                                    label="电话号码"
                                >
                                    <template slot="header">
                                        <el-tooltip
                                            effect="dark"
                                            content="失联、空号、停机”号码为标记为红色"
                                            placement="top"
                                        >
                                            <span
                                                >电话号码<i
                                                    class="el-icon-info"
                                                ></i
                                            ></span>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="有效性"
                                    prop="effectiveness"
                                >
                                    <template slot-scope="scope">
                                        <span>{{
                                            effectivenessFormat(
                                                scope.row.effectiveness
                                            )
                                        }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="号码筛选类型"
                                    prop="screenType"
                                >
                                    <template slot-scope="scope">
                                        <span>{{
                                            screenTypeFormat(
                                                scope.row.screenType
                                            )
                                        }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="号码筛选结果"
                                    prop="screenResult"
                                >
                                    <template slot-scope="scope">
                                        <span
                                            v-if="scope.row.screenType == 1"
                                            >{{
                                                networkSortresultFormat(
                                                    scope.row.screenResult
                                                )
                                            }}</span
                                        >
                                        <span v-else>{{
                                            realtimeSortresultFormat(
                                                scope.row.screenResult
                                            )
                                        }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="已拨次数"
                                    prop="frequency"
                                >
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    width="400"
                                    fixed="right"
                                    align="center"
                                >
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            type="warning"
                                            v-if="
                                                firstInfo.caseStatus != 13 &&
                                                    token
                                            "
                                            @click="callMe(scope.row)"
                                            >一键外呼
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="债务人基本信息" name="borrower">
                    <div class="box-content" v-if="borrowerInfo">
                        <div class="small-three">
                            <p class="small-unit-header">姓名：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.respondentName }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">身份证号：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.respondentIdNo }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">性别：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.respondentSex }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">出生日期：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.respondentBirthday }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">户籍地址：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.respondentAddress }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">工作单位名称：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.workUnitName }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">单位电话：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.workUnitPhone }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">邮箱：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.respondentEmail }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">QQ：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.respondentQq }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">微信：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.respondentChat }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">学历：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.respondentEducation }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">职业：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.respondentOccupation }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">婚姻状况：</p>
                            <p class="small-unit-conent">
                                {{ borrowerInfo.maritalStatus }}
                            </p>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="收款人账号" name="repayAccount">
                    <!--收款人账号-->
                    <div class="box" style="margin-bottom:0px">
                        <el-button
                            type="primary"
                            @click="seeErweima(repayAccountList[0])"
                            size="mini"
                            >商户收款码
                        </el-button>
                        <el-table
                            :data="repayAccountList"
                            style="width: 100%; margin-top: 20px"
                        >
                            <el-table-column
                                prop="accountType"
                                label="收款账户类型"
                                width="200"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="accountNumber"
                                label="收款人账号"
                                width="200"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="accountName"
                                label="收款人名称"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="openbankName"
                                label="收款人开户行"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <!--<el-table-column label="操作" width="160" fixed="right" align="center">-->
                            <!--<template slot-scope="scope">-->
                            <!--<el-button-->
                            <!--size="mini"-->
                            <!--@click="seeErweima(scope.row)"-->
                            <!--type="primary">商户收款码-->
                            <!--</el-button>-->
                            <!--</template>-->
                            <!--</el-table-column>-->
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="备注" name="remark">
                    <div class="box-content" v-if="remarkInfo">
                        <div class="small-unit">
                            <p class="small-unit-header">
                                剩余待还总额计算规则：
                            </p>
                            <p class="small-unit-conent">
                                {{ remarkInfo.remark }}
                            </p>
                        </div>
                        <div class="small-unit">
                            <p class="small-unit-header">备注2：</p>
                            <p class="small-unit-conent">
                                {{ remarkInfo.remark2 }}
                            </p>
                        </div>
                        <div class="small-unit">
                            <p class="small-unit-header">备注3：</p>
                            <p class="small-unit-conent">
                                {{ remarkInfo.remark3 }}
                            </p>
                        </div>
                        <div class="small-unit">
                            <p class="small-unit-header">备注4：</p>
                            <p class="small-unit-conent">
                                {{ remarkInfo.remark4 }}
                            </p>
                        </div>
                        <div class="small-unit">
                            <p class="small-unit-header">备注5：</p>
                            <p class="small-unit-conent">
                                {{ remarkInfo.remark5 }}
                            </p>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="诉前财保" name="preProperty">
                    <div class="box-content" v-if="prePropertyInfo">
                        <div class="small-three">
                            <p class="small-unit-header">财保申请状态：</p>
                            <p class="small-unit-conent">
                                {{ preStatusFormat(prePropertyInfo.status) }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">财保批次号：</p>
                            <p class="small-unit-conent">
                                {{ prePropertyInfo.proBatchNo }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">财保类型：</p>
                            <p class="small-unit-conent">
                                {{ proTypeFormat(prePropertyInfo.proType) }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">财保案号：</p>
                            <p class="small-unit-conent">
                                {{ prePropertyInfo.propertyProNo }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">财保冻结开始时间：</p>
                            <p class="small-unit-conent">
                                {{ prePropertyInfo.frozenStartTime }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">首次冻结金额：</p>
                            <p class="small-unit-conent">
                                {{ prePropertyInfo.frozenAmount }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">车辆情况：</p>
                            <p class="small-unit-conent">
                                {{ prePropertyInfo.vehicle }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">房屋情况：</p>
                            <p class="small-unit-conent">
                                {{ prePropertyInfo.house == 1 ? "有" : "无" }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">审批意见：</p>
                            <p class="small-unit-conent">
                                {{ prePropertyInfo.options }}
                            </p>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="订单信息" name="orderInfo">
                    <div class="box-content" v-if="orderInfo">
                        <div class="small-three">
                            <p class="small-unit-header">订单号：</p>
                            <p class="small-unit-conent">
                                {{ orderInfo.caseId }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header">催收机构：</p>
                            <p class="small-unit-conent">
                                {{ orderInfo.deptName }}
                            </p>
                        </div>
                        <div class="small-three">
                            <p class="small-unit-header"></p>
                            <p class="small-unit-conent"></p>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane
                    v-if="firstInfo.commonCaseNum > 1"
                    label="共债案件"
                    name="commonCase"
                >
                    <!--被申请人联系号码列表-->
                    <div class="box" style="margin-bottom:0px">
                        <el-table
                            ref="Table"
                            :data="commonCaseList"
                            style="width: 100%; margin-top: 20px"
                        >
                            <el-table-column label="案件批次号" prop="batchNo">
                            </el-table-column>
                            <el-table-column
                                prop="assetLastAssignee"
                                width="130"
                                :show-overflow-tooltip="true"
                                label="资产最终受让方"
                            ></el-table-column>
                            <el-table-column
                                prop="productName"
                                label="产品名称"
                            ></el-table-column>
                            <el-table-column
                                prop="subjectAmount"
                                label="标的金额"
                            ></el-table-column>
                            <el-table-column
                                prop="capital"
                                label="借款本金"
                            ></el-table-column>
                            <el-table-column
                                prop="terms"
                                label="分期期数"
                            ></el-table-column>
                            <el-table-column
                                prop="loanDate"
                                label="放款日期"
                            ></el-table-column>
                            <el-table-column
                                prop="overdueStartTime"
                                label="逾期时间"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        parseTime(
                                            scope.row.overdueStartTime,
                                            "{y}-{m}-{d}"
                                        )
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="remainingBalance"
                                label="剩余待还总额"
                            ></el-table-column>
                            <el-table-column
                                prop="mediationLabel"
                                width="130"
                                :formatter="getContactResultOptions"
                                label="最近一次调解标签"
                            ></el-table-column>
                            <el-table-column
                                prop="lastCallTime"
                                width="130"
                                label="最近一次外呼时间"
                            ></el-table-column>
                            <el-table-column
                                prop="principalName"
                                label="调解员"
                            ></el-table-column>
                            <el-table-column
                                prop="id"
                                width="130"
                                label="订单号"
                                :show-overflow-tooltip="true"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="caseStatus"
                                label="案件状态"
                                :formatter="getstatusFormat"
                            >
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="150"
                                fixed="right"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="primary"
                                        @click="handleItemUpdate(scope.row)"
                                        >案件详情
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!--第三部分-->
        <div class="box">
            <el-tabs
                v-model="activeNameTwo"
                type="card"
                @tab-click="handleClickTwo"
            >
                <el-tab-pane label="新增调解记录" name="first">
                    <el-form
                        style="margin-top: 20px"
                        :model="ruleForm"
                        :rules="rules"
                        ref="ruleForm"
                        label-width="100px"
                        class="demo-ruleForm"
                    >
                        <el-form-item label="联络人" prop="related">
                            <el-select
                                v-model="ruleForm.related"
                                filterable
                                clearable
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in medNameOption"
                                    :key="item.sourceRowId"
                                    :label="
                                        `${item.relation} ${item.name} ${item.phone}`
                                    "
                                    :value="
                                        `${item.relation},${item.name},${item.validPhone},${item.sourceRowId},${item.sourceType}`
                                    "
                                >
                                </el-option>
                                <el-option
                                    v-if="borrowerInfo"
                                    :label="`本人 ${firstInfo.name} 虚拟号`"
                                    :value="`本人,${firstInfo.name},虚拟号`"
                                ></el-option>
                                <el-option
                                    v-if="borrowerInfo"
                                    :label="`本人 ${firstInfo.name} 社交号码`"
                                    :value="`本人,${firstInfo.name},社交号码`"
                                ></el-option>
                                <el-option
                                    v-if="borrowerInfo"
                                    :label="`本人 ${firstInfo.name} 法院外呼`"
                                    :value="`本人,${firstInfo.name},法院外呼`"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            class="big-margin"
                            label="标签"
                            prop="medLabel"
                        >
                            <el-radio-group v-model="ruleForm.medLabel">
                                <el-radio
                                    v-for="item in contactResultOptions"
                                    :key="item.dictValue"
                                    :label="item.dictValue"
                                >
                                    {{ item.dictLabel }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="意向还款" prop="intention">
                            <el-switch
                                v-model="ruleForm.intention"
                                :active-value="1"
                                :inactive-value="0"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item
                            label="承诺还款日"
                            prop="promiseRepayDate"
                            v-if="ruleForm.intention == 1"
                        >
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="ruleForm.promiseRepayDate"
                                style="width:400px;"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="内容">
                            <el-input
                                style="width:400px;"
                                type="textarea"
                                v-model="ruleForm.medContent"
                            ></el-input>
                        </el-form-item>
                        <el-collapse accordion>
                            <el-collapse-item>
                                <template slot="title">
                                    新增调解协议内容
                                </template>
                                <el-form-item
                                    label="调解还款总额"
                                    prop="repayAmount"
                                >
                                    <el-input
                                        style="width:400px;"
                                        placeholder="请填写协议后的还款总额"
                                        type="text"
                                        v-model="ruleForm.repayAmount"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="调解时间" prop="repayDate">
                                    <el-input
                                        style="width:400px;"
                                        placeholder="请填写调解时间"
                                        type="text"
                                        v-model="ruleForm.repayDate"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="调解详情内容" prop="term">
                                    <el-input
                                        style="width:400px;"
                                        placeholder="请填写双方达成协议的内容，如偿还方式，本内容可应用于一键生成调解协议"
                                        type="textarea"
                                        :rows="4"
                                        v-model="ruleForm.term"
                                    ></el-input>
                                </el-form-item>
                            </el-collapse-item>
                        </el-collapse>
                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="submitForm('ruleForm')"
                                v-hasPermi="[
                                    'case:mediationRecord:adjudgedAdd'
                                ]"
                                >保存
                            </el-button>
                            <el-button @click="resetForm('ruleForm')"
                                >重置</el-button
                            >
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="新增网调记录" name="second">
                    <el-form
                        ref="adjustmentForm"
                        style="margin-top: 20px"
                        :model="adjustmentForm"
                        :rules="adjustmentRules"
                        label-width="120px"
                    >
                        <el-form-item label="网调对象" prop="related">
                            <el-select
                                v-model="adjustmentForm.related"
                                filterable
                                clearable
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in medNameOption"
                                    :key="item.sourceRowId"
                                    :label="`${item.name}-${item.relation}`"
                                    :value="`${item.name},${item.relation}`"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="网调标签：" prop="label">
                            <el-radio-group v-model="adjustmentForm.label">
                                <el-radio
                                    v-for="item in adjustType"
                                    :key="item.dictValue"
                                    :label="item.dictValue"
                                >
                                    {{ item.dictLabel }}</el-radio
                                >
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="网调情况：" prop="content">
                            <el-input
                                style="width:400px;"
                                maxlength="100"
                                show-word-limit
                                v-model="adjustmentForm.content"
                                type="textarea"
                                :rows="2"
                                placeholder="请输入内容"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="网调参考地址：">
                            <a
                                class="inter-a"
                                v-for="item in interWeb"
                                :key="item.dictValue"
                                target="_blank"
                                :href="item.dictValue"
                                >{{ item.dictValue }}</a
                            >
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                v-hasPermi="[
                                    'case:networkAdjustRecord:adjudgedAdd'
                                ]"
                                @click="adjustmentSubmit"
                                >保存</el-button
                            >
                            <el-button @click="resetForm('adjustmentForm')"
                                >重置</el-button
                            >
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!--第四部分-->
        <div class="box">
            <el-tooltip
                style="float: right;position: relative;z-index: 11;"
                class="item"
                effect="dark"
                content="刷新"
                placement="top"
            >
                <el-button
                    circle
                    icon="el-icon-refresh"
                    @click="getCaseRecordInfo(caseType)"
                />
            </el-tooltip>
            <el-tabs
                v-model="activeNameThree"
                type="card"
                @tab-click="handleClickThree"
            >
                <el-tab-pane label="调解记录" name="medRecord">
                    <!--调解记录-->
                    <div class="box" style="margin-bottom:0px;padding-top:0px">
                        <recordList :recordList="medRecordList"></recordList>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="网调记录" name="netRecord">
                    <!--网调记录列表-->
                    <div class="box" style="margin-bottom:0px;padding-top:0px">
                        <el-table
                            ref="table"
                            :data="netRecordList"
                            style="width: 100%; margin-top: 20px"
                        >
                            <el-table-column
                                label="网调时间"
                                width="200"
                                prop="createTime"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        parseTime(
                                            scope.row.createTime,
                                            "{y}-{m}-{d} {h}:{i}:{s}"
                                        )
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="姓名" prop="name">
                            </el-table-column>
                            <el-table-column label="关系" prop="relation">
                            </el-table-column>
                            <el-table-column
                                label="网调标签"
                                :show-overflow-tooltip="true"
                                :formatter="adjustTypeFormat"
                                prop="label"
                            >
                            </el-table-column>
                            <el-table-column
                                label="网调情况"
                                width="150"
                                prop="content"
                            >
                            </el-table-column>
                            <el-table-column
                                label="操作人"
                                prop="createName"
                                width="150"
                            ></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="还款记录列表" name="repRecord">
                    <!--还款记录列表-->
                    <div class="box" style="margin-bottom:0px;padding-top:0px">
                        <el-table
                            ref="table"
                            :data="repRecordList"
                            style="width: 100%; margin-top: 20px"
                        >
                            <el-table-column
                                prop="accountNo"
                                label="付款人账号"
                                width="200"
                            >
                            </el-table-column>
                            <el-table-column
                                label="汇款类型"
                                :show-overflow-tooltip="true"
                                :formatter="repayTypeFormat"
                                prop="repayType"
                            >
                            </el-table-column>
                            <el-table-column prop="amount" label="汇款金额">
                            </el-table-column>
                            <el-table-column
                                prop="accountNoShou"
                                label="收款人账号"
                                width="200"
                            ></el-table-column>
                            <el-table-column
                                label="汇款时间"
                                width="150"
                                prop="remittanceTime"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        parseTime(
                                            scope.row.remittanceTime,
                                            "{y}-{m}-{d}"
                                        )
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="还款类型"
                                width="120"
                                prop="type"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        scope.row.type == 1
                                            ? "结清"
                                            : scope.row.type == 0
                                            ? "部分还款"
                                            : ""
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="审核状态"
                                width="150"
                                :formatter="reviewStatusFormat"
                                prop="reviewStatus"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="createName"
                                width="150"
                                label="提交人"
                            ></el-table-column>
                            <el-table-column
                                prop="jointdebtAmount"
                                label="共债金额"
                            >
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="180"
                                fixed="right"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="success"
                                        @click="seeErweima2(scope.row)"
                                        >汇款凭证
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="通话记录" name="callRecord">
                    <!-- 通话记录列表 -->
                    <div class="box" style="margin-bottom:0px;padding-top:0px">
                        <el-table
                            border
                            class="wrap-table"
                            :data="callRecordList"
                            style="width: 100%; margin-top: 20px"
                        >
                            <el-table-column
                                label="呼叫时间"
                                :show-overflow-tooltip="true"
                                width="180"
                                prop="callTime"
                            >
                                <template slot-scope="scope">
                                    <span>
                                        {{
                                            parseTime(
                                                scope.row.callTime,
                                                "{y}-{m}-{d} {h}:{i}:{s}"
                                            )
                                        }}</span
                                    >
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="主叫号码"
                                :show-overflow-tooltip="true"
                                width="150"
                                prop="caller"
                            >
                            </el-table-column>
                            <el-table-column
                                label="被叫号码"
                                :show-overflow-tooltip="true"
                                width="150"
                                prop="callee"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="type"
                                label="呼出类型"
                                :show-overflow-tooltip="true"
                                width="100"
                            >
                                <template
                                    slot-scope="scope"
                                    v-if="scope.row.type != null"
                                >
                                    <span>{{
                                        scope.row.type == "INBOUND"
                                            ? "呼入"
                                            : "呼出"
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="subType"
                                label="呼出子类型"
                                :show-overflow-tooltip="true"
                                width="100"
                            >
                                <template
                                    slot-scope="scope"
                                    v-if="scope.row.subType != null"
                                >
                                    <span>{{
                                        scope.row.subType == "OUTBOUND"
                                            ? "坐席呼叫"
                                            : scope.row.subType == "INBOUND"
                                            ? "坐席接听"
                                            : scope.row.subType == "FCFS"
                                            ? "预测式计划"
                                            : ""
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="ringTime"
                                label="响铃时长"
                                :show-overflow-tooltip="true"
                                width="80"
                            >
                                <template
                                    slot-scope="scope"
                                    v-if="scope.row.ringTime != null"
                                >
                                    <span>{{ scope.row.ringTime }}秒</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="通话时长"
                                width="100"
                                prop="duration"
                            >
                                <template
                                    slot-scope="scope"
                                    v-if="scope.row.duration != null"
                                >
                                    <span>{{ scope.row.duration }}秒</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="outcome"
                                label="呼叫结果"
                                :show-overflow-tooltip="true"
                                width="100"
                            >
                                <template
                                    slot-scope="scope"
                                    v-if="scope.row.outcome != null"
                                >
                                    <span>{{
                                        scope.row.outcome == "SUCCESS"
                                            ? "成功"
                                            : scope.row.outcome == "USER_BUSY"
                                            ? "正忙"
                                            : scope.row.outcome == "POWER_OFF"
                                            ? "用户关机"
                                            : scope.row.outcome == "SUSPENDED"
                                            ? "用户停机"
                                            : scope.row.outcome == "NOT_EXIST"
                                            ? "用户空号"
                                            : "失败"
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="seatWord"
                                label="坐席敏感词"
                                :show-overflow-tooltip="true"
                                width="150"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="isSeatWord"
                                label="坐席是否有敏感词"
                                :show-overflow-tooltip="true"
                                width="210"
                            >
                                <template
                                    slot-scope="scope"
                                    v-if="scope.row.isSeatWord != null"
                                >
                                    <span>{{
                                        scope.row.isSeatWord == 0 ? "无" : "有"
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="clientWord"
                                label="客户敏感词"
                                :show-overflow-tooltip="true"
                                width="150"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="isClientWord"
                                label="客户是否有敏感词"
                                :show-overflow-tooltip="true"
                                width="210"
                            >
                                <template
                                    slot-scope="scope"
                                    v-if="scope.row.isClientWord != null"
                                >
                                    <span>{{
                                        scope.row.isClientWord == 0
                                            ? "无"
                                            : "有"
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="createBy"
                                label="操作员"
                                :show-overflow-tooltip="true"
                                width="100"
                            >
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="180"
                                fixed="right"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="success"
                                        v-if="scope.row.path"
                                        @click="recordingPlay(scope.row)"
                                        >录音播放
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="短信发送记录" name="msgRecord">
                    <!-- 短信列表 -->
                    <div class="box" style="margin-bottom:0px;padding-top:0px">
                        <el-table
                            border
                            class="wrap-table"
                            :data="msgRecordList"
                            style="width: 100%; margin-top: 20px"
                        >
                            <el-table-column
                                label="姓名"
                                width="100"
                                prop="name"
                            ></el-table-column>
                            <el-table-column
                                label="手机号"
                                :show-overflow-tooltip="true"
                                width="150"
                                prop="phone"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="content"
                                label="发送内容"
                                :show-overflow-tooltip="true"
                                width="320"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="sendTime"
                                label="发送时间"
                                :show-overflow-tooltip="true"
                                width="200"
                            >
                                <!-- <template slot-scope="scope">
                                <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
                                </template> -->
                            </el-table-column>
                            <!-- <el-table-column prop="city" label="省市" :show-overflow-tooltip="true" width="150"></el-table-column> -->
                            <el-table-column
                                prop="status"
                                label="发送状态"
                                :show-overflow-tooltip="true"
                                width="210"
                            >
                                <template
                                    slot-scope="scope"
                                    v-if="scope.row.status != null"
                                >
                                    <span>{{
                                        scope.row.status == 0
                                            ? "发送成功"
                                            : "发送未成功"
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="送达状态"
                                width="120"
                                prop="deliverStatus"
                            >
                                <template
                                    slot-scope="scope"
                                    v-if="scope.row.deliverStatus != null"
                                >
                                    <span v-if="scope.row.providerType == 1">{{
                                        shisuyunStatusFormat(
                                            scope.row.deliverStatus
                                        ) != ""
                                            ? shisuyunStatusFormat(
                                                  scope.row.deliverStatus
                                              )
                                            : scope.row.deliverStatus
                                    }}</span>
                                    <span v-if="scope.row.providerType == 2">{{
                                        wodongStatusFormat(
                                            scope.row.deliverStatus
                                        ) != ""
                                            ? wodongStatusFormat(
                                                  scope.row.deliverStatus
                                              )
                                            : scope.row.deliverStatus
                                    }}</span>
                                    <span v-if="scope.row.providerType == 3">{{
                                        xuanwuStatusFormat(
                                            scope.row.deliverStatus
                                        ) != ""
                                            ? xuanwuStatusFormat(
                                                  scope.row.deliverStatus
                                              )
                                            : scope.row.deliverStatus
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="deliverTime"
                                label="送达时间"
                                :show-overflow-tooltip="true"
                                width="210"
                            >
                                <!-- <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
            </template> -->
                            </el-table-column>
                            <el-table-column
                                prop="replyContent"
                                label="客户回复内容"
                                :show-overflow-tooltip="true"
                                width="320"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="createBy"
                                label="操作员"
                                :show-overflow-tooltip="true"
                                width="100"
                            >
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="状态变更记录" name="statusRecord">
                    <!--状态变更记录-->
                    <div class="box" style="margin-bottom:0px;padding-top:0px">
                        <el-table
                            class="wrap-table"
                            :data="statusRecordList"
                            style="width: 100%; margin-top: 20px"
                        >
                            <el-table-column
                                label="变更前状态"
                                :show-overflow-tooltip="true"
                                width="150"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        statusFormat(scope.row.beforeStatus)
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="当前状态"
                                :show-overflow-tooltip="true"
                                width="150"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        statusFormat(scope.row.status)
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="content"
                                label="记录内容"
                                :show-overflow-tooltip="true"
                                width="320"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="annexName"
                                label="附件"
                                :show-overflow-tooltip="true"
                                width="200"
                            >
                                <template slot-scope="scope">
                                    <span
                                        class="distinguish-style"
                                        @click="downFile(scope.row)"
                                        >{{ scope.row.annexName }}</span
                                    >
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="createName"
                                label="发起人"
                                :show-overflow-tooltip="true"
                                width="150"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="createTime"
                                label="发起时间"
                                :show-overflow-tooltip="true"
                                width="210"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        parseTime(
                                            scope.row.createTime,
                                            "{y}-{m}-{d}"
                                        )
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button
                                        v-if="
                                            combination[
                                                scope.row.beforeStatus
                                            ] &&
                                                combination[
                                                    scope.row.beforeStatus
                                                ] == scope.row.status
                                        "
                                        size="mini"
                                        type="warning"
                                        @click="addStatus(scope.row)"
                                        >修改</el-button
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <normalDialog
            :confirmTip="normal.confirmTip"
            :title="normal.title"
            :id="id"
            @refresh="getAdjudgedInfo"
            :requestApi="normal.requestApi"
            :show.sync="normal.dialogVisible"
        >
        </normalDialog>
        <pendingFilling
            :confirmTip="pendingFilling.confirmTip"
            :title="pendingFilling.title"
            :statusId="pendingFilling.statusId"
            :id="id"
            @refresh="getAdjudgedInfo"
            :requestApi="pendingFilling.requestApi"
            :show.sync="pendingFilling.dialogVisible"
        >
        </pendingFilling>
        <hasRuled
            :confirmTip="hasRuled.confirmTip"
            :title="hasRuled.title"
            :statusId="hasRuled.statusId"
            :id="id"
            @refresh="getAdjudgedInfo"
            :requestApi="hasRuled.requestApi"
            :show.sync="hasRuled.dialogVisible"
        >
        </hasRuled>
        <multipleSuccess
            :confirmTip="multipleSuccessfully.confirmTip"
            :title="multipleSuccessfully.title"
            :id="id"
            @refresh="getAdjudgedInfo"
            :requestApi="multipleSuccessfully.requestApi"
            :show.sync="multipleSuccessfully.dialogVisible"
        >
        </multipleSuccess>
        <executedFiling
            :confirmTip="executedFiling.confirmTip"
            :title="executedFiling.title"
            :statusId="executedFiling.statusId"
            :id="id"
            @refresh="getAdjudgedInfo"
            :requestApi="executedFiling.requestApi"
            :show.sync="executedFiling.dialogVisible"
        >
        </executedFiling>
        <enforced
            :confirmTip="enforced.confirmTip"
            :title="enforced.title"
            :statusId="enforced.statusId"
            :id="id"
            @refresh="getAdjudgedInfo"
            :requestApi="enforced.requestApi"
            :show.sync="enforced.dialogVisible"
        >
        </enforced>
        <putOnRecord
            :confirmTip="putOnRecord.confirmTip"
            :title="putOnRecord.title"
            :id="id"
            :statusId="putOnRecord.statusId"
            @refresh="getAdjudgedInfo"
            :requestApi="putOnRecord.requestApi"
            :show.sync="putOnRecord.dialogVisible"
        >
        </putOnRecord>
        <exportSms
            @refresh="getCaseRecordInfo('msgRecord')"
            :id="exportSmsData.id"
            :caseId="exportSmsData.caseId"
            :name="exportSmsData.name"
            :phone="exportSmsData.phone"
            :title="exportSmsData.title"
            :show.sync="exportSmsData.dialogVisible"
            :red="exportSmsData.red"
        >
        </exportSms>
        <addPhone
            :title="phoneData.title"
            :show.sync="phoneData.dialogVisible"
            :id="id"
            :name="phoneData.name"
            @refresh="getCaseBaseInfo('contact')"
        >
        </addPhone>
        <reimbursement
            :title="reimbursementData.title"
            :id="id"
            @refresh="getAdjudgedInfo"
            :type="reimbursementData.type"
            :commonCaseNum="reimbursementData.commonCaseNum"
            :subjectAmount="reimbursementData.subjectAmount"
            :repayList="reimbursementData.repayList"
            :remainingBalance="reimbursementData.remainingBalance"
            :outstandingAmount="reimbursementData.outstandingAmount"
            :show.sync="reimbursementData.dialogVisible"
        >
        </reimbursement>
        <erweima
            :title="erweimaData.title"
            :url="erweimaData.url"
            :show.sync="erweimaData.dialogVisible"
        >
        </erweima>
        <editInformation
            :title="information.title"
            :id="id"
            @refresh="getAdjudgedInfo"
            :type="information.type"
            :show.sync="information.dialogVisible"
        >
        </editInformation>
        <audioPlay
            :src="audioData.src"
            :show.sync="audioData.dialogVisible"
        ></audioPlay>
    </div>
</template>

<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import cuttingAfterApi from "@/api/case/cuttingAfter/index";
import recordList from "../components/recordList";
import normalDialog from "../components/normalDialog"; //通用弹窗
import editInformation from "../components/editInformation"; //修改信息弹窗
import componentsArray from "@/utils/componentsArray"; //按钮组件数组，后台直接调用
import pendingFilling from "../components/pendingFiling"; //待执行立案
import hasRuled from "../components/hasRuled"; //已判决
import multipleSuccess from "../components/multipleSuccessfully"; //多元调解成功
import executedFiling from "../components/executedFiling"; //已执行立案
import enforced from "../components/enforced";
import putOnRecord from "../components/putOnRecord";
import addPhone from "../components/addPhone";
import reimbursement from "../components/reimbursement";
import erweima from "../components/erweima";
import { initObj } from "@/utils/common";
import exportSms from "../components/exportSms";
import audioPlay from "../components/audioPlay";
import merge from "webpack-merge";
export default {
    name: "info",
    components: {
        recordList,
        normalDialog,
        pendingFilling,
        hasRuled,
        multipleSuccess,
        executedFiling,
        enforced,
        putOnRecord,
        addPhone,
        reimbursement,
        erweima,
        exportSms,
        editInformation,
        audioPlay
    },
    data() {
        return {
            baseInfoParams: {
                caseId: "",
                type: ""
            },
            caseInfoParams: {
                caseId: "",
                type: ""
            },
            infoType: "subject",
            caseType: "medRecord",
            isDesensitization: false,
            firstInfo: {},
            subjectInfo: {},
            contactInfo: {},
            borrowerInfo: {},
            remarkInfo: {},
            prePropertyInfo: {},
            orderInfo: {},
            medRecordList: [],
            contactInfosList: [],
            commonCaseList: [],
            relationalContactList: [],
            netRecordList: [],
            repRecordList: [],
            callRecordList: [],
            msgRecordList: [],
            statusRecordList: [],
            repayAccountList: [],
            activeName: "subject",
            activeNameTwo: "first",
            activeNameThree: "medRecord",
            remittanceTypes: [], //汇款类型
            auditStatus: [], //审核状态
            paymentStatus: [], //还款状态
            componentsName: [], //按钮组件数组，后台直接调用
            componentsMap: new Map(),
            relationalContactList: [],
            id: "",
            normal: {
                dialogVisible: false,
                title: "",
                requestApi: "",
                confirmTip: "",
                id: ""
            },
            information: {
                dialogVisible: false,
                title: "",
                type: "",
                id: ""
            },
            exportSmsData: {
                title: "",
                dialogVisible: false,
                red: "",
                name: "",
                phone: "",
                id: null,
                caseId: null
            },
            pendingFilling: {
                dialogVisible: false,
                title: "",
                requestApi: "",
                confirmTip: "",
                id: "",
                statusId: 0
            },
            hasRuled: {
                dialogVisible: false,
                title: "",
                requestApi: "",
                confirmTip: "",
                id: "",
                statusId: 0
            },
            multipleSuccessfully: {
                dialogVisible: false,
                title: "",
                requestApi: "",
                confirmTip: "",
                id: ""
            },
            executedFiling: {
                dialogVisible: false,
                title: "",
                requestApi: "",
                confirmTip: "",
                id: "",
                statusId: 0
            },
            enforced: {
                dialogVisible: false,
                title: "",
                requestApi: "",
                confirmTip: "",
                id: "",
                statusId: 0
            },
            putOnRecord: {
                dialogVisible: false,
                title: "",
                requestApi: "",
                confirmTip: "",
                id: "",
                statusId: 0
            },
            phoneData: {
                dialogVisible: false,
                title: "",
                id: "",
                name: ""
            },
            adjustmentData: {
                dialogVisible: false,
                title: ""
            },
            erweimaData: {
                dialogVisible: false,
                title: "",
                url: ""
            },
            reimbursementData: {
                dialogVisible: false,
                title: "",
                id: "",
                type: 0,
                remainingBalance: 0,
                outstandingAmount: 0,
                repayList: [],
                subjectAmount: 0,
                commonCaseNum: 0
            },
            statusOptions: [],
            protects: [],
            proType: [],
            effectiveness: [],
            house: [],
            medNameOption: [],
            ruleForm: {
                related: "",
                promiseRepayDate: "",
                term: "",
                repayAmount: "",
                repayDate: "",
                intention: 0,
                medLabel: "",
                medContent: ""
            },
            rules: {
                related: [
                    {
                        required: true,
                        message: "请选择联络人",
                        trigger: "change"
                    }
                ],
                promiseRepayDate: [
                    {
                        type: "string",
                        required: true,
                        message: "请选择日期",
                        trigger: "change"
                    }
                ],
                medLabel: [
                    {
                        required: true,
                        message: "请选择标签",
                        trigger: "change"
                    }
                ],
                intention: [
                    {
                        required: true
                    }
                ]
            },
            interWeb: [],
            adjustmentForm: {
                content: "",
                label: "",
                related: "",
                caseId: ""
            },
            adjustmentRules: {
                related: [
                    {
                        required: true,
                        message: "请选择网调关系",
                        trigger: "change"
                    }
                ],
                label: [
                    {
                        required: true,
                        message: "请选择网调标签",
                        trigger: "change"
                    }
                ],
                content: [
                    {
                        required: true,
                        message: "请输入网调情况",
                        trigger: "blur"
                    }
                ]
            },
            networkSortresult: [],
            realtimeSortresult: [],
            screenType: [],
            adjustType: [],
            wodongStatus: [],
            shisuyunStatus: [],
            xuanwuStatus: [],
            contactResultOptions: [],
            contactStatusOptions: [],
            token: null,
            isDisable: false,
            idList: [],
            buttonChange: false,
            combination: {
                7: 8,
                8: 9,
                10: 11,
                11: 12,
                5: 10
            },
            audioData: {
                dialogVisible: false,
                src: ""
            }
        };
    },
    created() {
        //案件id
        this.id = this.$route.query.afterId;
        if (
            this.$route.query.afterList &&
            this.$route.query.afterList.length > 0
        ) {
            this.idList = this.$route.query.afterList;
            this.buttonChange = true;
        } else {
            this.idList = [];
            this.buttonChange = false;
        }

        //案件联系状态
        this.getDicts("contactStatus").then(response => {
            this.contactStatusOptions = response.data;
        });
        //联系标签
        this.getDicts("contact_status").then(response => {
            this.contactResultOptions = response.data;
        });
        //车房类型
        this.getDicts("yes_no").then(response => {
            this.house = response.data;
        });
        //汇款类型
        this.getDicts("remittance_status").then(response => {
            this.remittanceTypes = response.data;
        });
        //审核状态
        this.getDicts("audit_status").then(response => {
            this.auditStatus = response.data;
        });
        //还款状态
        this.getDicts("repay_status").then(response => {
            this.paymentStatus = response.data;
        });
        //案件状态
        this.getDicts("case_status").then(response => {
            this.statusOptions = response.data;
        });
        //财保状态
        this.getDicts("wealth_protect").then(response => {
            this.protects = response.data;
        });
        //财保类型
        this.getDicts("pro_type").then(response => {
            this.proType = response.data;
        });
        //有效性状态
        this.getDicts("effectiveness").then(response => {
            this.effectiveness = response.data;
        });
        //在网状态号码筛选结果
        this.getDicts("network_screen_result").then(response => {
            this.networkSortresult = response.data;
        });
        //实时在网号码筛选结果
        this.getDicts("realtime_screen_result").then(response => {
            this.realtimeSortresult = response.data;
        });
        //号码筛选类型
        this.getDicts("screen_Type").then(response => {
            this.screenType = response.data;
        });
        //网调标签
        this.getDicts("network_adjust_label").then(response => {
            this.adjustType = response.data;
        });
        //网调地址标签
        this.getDicts("inter_web").then(response => {
            this.interWeb = response.data;
        });
        //沃动标签
        this.getDicts("wodong_deliver_status").then(response => {
            this.wodongStatus = response.data;
        });
        //时速云标签
        this.getDicts("shisuyun_deliver_status").then(response => {
            this.shisuyunStatus = response.data;
        });
        //玄武标签
        this.getDicts("xuanwu_deliver_status").then(response => {
            this.xuanwuStatus = response.data;
        });
        //度言id
        let token = JSON.parse(sessionStorage.getItem("token"));
        if (token != 0) {
            this.token = true;
        } else {
            this.token = false;
        }
        this.activeName = "subject";
        this.activeNameTwo = "first";
        this.activeNameThree = "medRecord";
    },
    watch: {
        //监控路由参数，实现自己跳自己刷新数据
        $route() {
            this.id = this.$route.query.afterId;
            if (
                this.$route.query.afterList &&
                this.$route.query.afterList.length > 0
            ) {
                this.idList = this.$route.query.afterList;
                this.buttonChange = true;
            } else {
                this.idList = [];
                this.buttonChange = false;
            }
        },
        id() {
            if (!this.id) {
                return;
            }
            //初始化前清空数据
            initObj(this.ruleForm);
            this.clearData();
            this.ruleForm.intention = 0;
            this.requestOrder();
        }
    },
    methods: {
        //切换内容清空数据
        clearData() {
            this.firstInfo = {};
            this.subjectInfo = {};
            this.contactInfo = {};
            this.borrowerInfo = {};
            this.remarkInfo = {};
            this.prePropertyInfo = {};
            this.orderInfo = {};
            this.medRecordList = [];
            this.contactInfosList = [];
            this.commonCaseList = [];
            this.relationalContactList = [];
            this.netRecordList = [];
            this.repRecordList = [];
            this.callRecordList = [];
            this.msgRecordList = [];
            this.statusRecordList = [];
            this.repayAccountList = [];
        },
        requestOrder() {
            this.isDesensitization = false;
            this.infoType = "subject";
            this.caseType = "medRecord";
            this.activeName = "subject";
            this.activeNameTwo = "first";
            this.activeNameThree = "medRecord";
            this.getAdjudgedInfo(2);
        },
        //还原数据或者脱敏
        requestSourceData() {
            this.getCaseBaseInfo("subject");
            this.getCaseBaseInfo("contact");
            this.getCaseBaseInfo("borrower");
            this.getCaseRecordInfo("medRecord");
            this.getCaseRecordInfo("callRecord");
            this.getCaseRecordInfo("msgRecord");
        },
        //第一部分详情
        getAdjudgedInfo(type) {
            cuttingAfterApi.postAdjudgedInfo(this.id).then(response => {
                this.firstInfo = response.data;
                this.componentsName = [];
                componentsArray.componentsName.forEach(item => {
                    if (item.showFlag.includes(this.firstInfo.caseStatus)) {
                        this.componentsName.push(item);
                        this.componentsMap.set(item.eName, item);
                    }
                });
                if (type == 2) {
                    this.getCaseBaseInfo("subject");
                    this.getCaseBaseInfo("repayAccount");
                    this.getMediationObject();
                    this.getCaseRecordInfo("medRecord");
                }
            });
        },
        //第二部分详情
        getCaseBaseInfo(infoType) {
            this.baseInfoParams = {
                caseId: this.id,
                type: infoType
            };
            cuttingAfterApi
                .getCaseBaseInfo(this.baseInfoParams)
                .then(response => {
                    if (infoType == "subject") {
                        this.subjectInfo = response.data;
                        if (
                            this.firstInfo.isDesensitization &&
                            !this.isDesensitization
                        ) {
                            this.subjectInfo.dueBankAccount = this.subjectInfo.dueBankAccount?.replace(
                                /^(.{4})(?:\d+)(.{4})$/,
                                "$1 **** **** $2"
                            );
                        }
                    } else if (infoType == "contact") {
                        this.contactInfo = response.data;
                        this.contactInfosList = response.data.contactInfo || [];
                        this.relationalContactList =
                            response.data.relatedInfo || [];
                        if (
                            this.firstInfo.isDesensitization &&
                            !this.isDesensitization
                        ) {
                            this.contactInfosList.forEach(element => {
                                return (element.phone = element.phone?.replace(
                                    /(\d{3})\d*(\d{4})/,
                                    "$1****$2"
                                ));
                            });
                            this.relationalContactList.forEach(element => {
                                return (element.relatedContact = element.relatedContact?.replace(
                                    /(\d{3})\d*(\d{4})/,
                                    "$1****$2"
                                ));
                            });
                        }
                    } else if (infoType == "borrower") {
                        this.borrowerInfo = response.data;
                        if (
                            this.firstInfo.isDesensitization &&
                            !this.isDesensitization
                        ) {
                            this.borrowerInfo.respondentIdNo = this.borrowerInfo.respondentIdNo?.replace(
                                /(?<=\d{3})\d{12}(?=\d{2})/,
                                "************"
                            );
                        }
                    } else if (infoType == "repayAccount") {
                        this.repayAccountList = response.data;
                    } else if (infoType == "remark") {
                        this.remarkInfo = response.data;
                    } else if (infoType == "preProperty") {
                        this.prePropertyInfo = response.data;
                    } else if (infoType == "orderInfo") {
                        this.orderInfo = response.data;
                    } else if (infoType == "commonCase") {
                        this.commonCaseList = response.data.caseInfo;
                    }
                });
        },
        handleClick(tab) {
            this.infoType = tab.name;
            if (
                tab.name == "subject" &&
                Object.keys(this.subjectInfo).length == 0
            ) {
                this.getCaseBaseInfo(tab.name);
            } else if (
                tab.name == "contact" &&
                Object.keys(this.contactInfo).length == 0
            ) {
                this.getCaseBaseInfo(tab.name);
            } else if (
                tab.name == "borrower" &&
                Object.keys(this.borrowerInfo).length == 0
            ) {
                this.getCaseBaseInfo(tab.name);
            } else if (
                tab.name == "repayAccount" &&
                this.repayAccountList.length == 0
            ) {
                this.getCaseBaseInfo(tab.name);
            } else if (
                tab.name == "remark" &&
                Object.keys(this.remarkInfo).length == 0
            ) {
                this.getCaseBaseInfo(tab.name);
            } else if (
                tab.name == "preProperty" &&
                Object.keys(this.prePropertyInfo).length == 0
            ) {
                this.getCaseBaseInfo(tab.name);
            } else if (
                tab.name == "orderInfo" &&
                Object.keys(this.orderInfo).length == 0
            ) {
                this.getCaseBaseInfo(tab.name);
            } else if (
                tab.name == "commonCase" &&
                this.commonCaseList.length == 0
            ) {
                this.getCaseBaseInfo(tab.name);
            }
        },
        handleClickTwo(tab, event) {
            if (
                tab.name == "first" &&
                Object.keys(this.contactInfo).length == 0
            ) {
                this.getCaseBaseInfo("contact");
            } else if (
                tab.name == "second" &&
                Object.keys(this.contactInfo).length == 0
            ) {
                this.getCaseBaseInfo("contact");
            }
        },
        getMediationObject() {
            let mediationParams = {
                caseId: this.id
            };
            cuttingAfterApi
                .getMediationObject(mediationParams)
                .then(response => {
                    this.medNameOption = response.data;
                });
        },
        debtHandleClick(tab, event) {},
        //第四部分详情
        getCaseRecordInfo(caseType) {
            this.caseInfoParams = {
                caseId: this.id,
                type: caseType
            };
            cuttingAfterApi
                .getCaseRecordInfo(this.caseInfoParams)
                .then(response => {
                    if (caseType == "medRecord") {
                        this.medRecordList = response.data;
                        if (
                            this.firstInfo.isDesensitization &&
                            !this.isDesensitization
                        ) {
                            this.medRecordList.forEach(element => {
                                return (element.medTel = element.medTel?.replace(
                                    /(\d{3})\d*(\d{4})/,
                                    "$1****$2"
                                ));
                            });
                        }
                    } else if (caseType == "netRecord") {
                        this.netRecordList = response.data;
                    } else if (caseType == "repRecord") {
                        this.repRecordList = response.data;
                    } else if (caseType == "callRecord") {
                        this.callRecordList = response.data;
                        if (
                            this.firstInfo.isDesensitization &&
                            !this.isDesensitization
                        ) {
                            this.callRecordList.forEach(element => {
                                return (element.callee = element.callee?.replace(
                                    /(\d{3})\d*(\d{4})/,
                                    "$1****$2"
                                ));
                            });
                        }
                    } else if (caseType == "msgRecord") {
                        this.msgRecordList = response.data;
                        if (
                            this.firstInfo.isDesensitization &&
                            !this.isDesensitization
                        ) {
                            this.msgRecordList.forEach(element => {
                                return (element.phone = element.phone?.replace(
                                    /(\d{3})\d*(\d{4})/,
                                    "$1****$2"
                                ));
                            });
                        }
                    } else if (caseType == "statusRecord") {
                        this.statusRecordList = response.data;
                    }
                });
        },
        handleClickThree(tab, event) {
            this.caseType = tab.name;
            if (tab.name == "medRecord" && this.medRecordList.length == 0) {
                this.getCaseRecordInfo(tab.name);
            } else if (
                tab.name == "netRecord" &&
                this.netRecordList.length == 0
            ) {
                this.getCaseRecordInfo(tab.name);
            } else if (
                tab.name == "repRecord" &&
                this.repRecordList.length == 0
            ) {
                this.getCaseRecordInfo(tab.name);
            } else if (
                tab.name == "callRecord" &&
                this.callRecordList.length == 0
            ) {
                this.getCaseRecordInfo(tab.name);
            } else if (
                tab.name == "msgRecord" &&
                this.msgRecordList.length == 0
            ) {
                this.getCaseRecordInfo(tab.name);
            } else if (
                tab.name == "statusRecord" &&
                this.statusRecordList.length == 0
            ) {
                this.getCaseRecordInfo(tab.name);
            }
        },
        //新增网调提交
        adjustmentSubmit() {
            let related = this.adjustmentForm.related.split(",");
            this.adjustmentForm.name = related[0];
            this.adjustmentForm.relation = related[1];
            this.adjustmentForm.caseId = this.id;
            this.$refs["adjustmentForm"].validate(valid => {
                if (valid) {
                    cuttingAfterApi
                        .addNetworkAdjustRecord(this.adjustmentForm)
                        .then(res => {
                            if (res.code == 200) {
                                this.msgSuccess("新增成功");
                                this.getCaseRecordInfo("netRecord");
                                this.resetForm("adjustmentForm");
                            }
                        });
                }
            });
        },
        changeButton(value) {
            if (value) {
                let singleComponent = this.componentsMap.get(value);
                this[singleComponent["methods"]](singleComponent);
            }
        },
        //打开发送短信的弹窗
        handleExport(item) {
            this.exportSmsData.title = "裁后短信发送";
            this.exportSmsData.dialogVisible = true;
            this.exportSmsData.red = item.red;
            this.exportSmsData.id = item.id;
            this.exportSmsData.caseId = item.caseId;
            this.exportSmsData.name = item.respondentName;
            this.exportSmsData.phone = item.validPhone;
        },
        //电话调解失败,多元调解失败
        fail(item) {
            if (item.cName == "多元调解失败") {
                this.normal.requestApi = "/case/pretrial/multiMediateFail";
            } else {
                this.normal.requestApi = "/case/pretrial/mediationFailed";
            }
            this.normal.title = item.cName;
            this.normal.confirmTip = item.cName;
            // 控制弹窗组件显示
            this.normal.dialogVisible = true;
        },
        editInformation() {
            this.information.title = "裁后详情案件信息编辑";
            this.information.type = "after";
            this.information.requestApi = "/case/adjudged/mediationFailed";
            // 控制弹窗组件显示
            this.information.dialogVisible = true;
        },
        //多元调解成功-待执行立案需要弹窗
        pendingFiling(item) {
            this.pendingFilling.title = item.cName;
            this.pendingFilling.requestApi =
                "/case/postAdjudged/pendingExecute2";
            this.pendingFilling.confirmTip = item.cName;
            // 控制弹窗组件显示
            this.pendingFilling.dialogVisible = true;
        },
        //已判决-待执行立案不需要弹窗
        pendingFilingSecond(item) {
            var that = this;
            this.$confirm(`是否切换案件状态为${item.cName}?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let param = {
                        caseId: that.id
                    };
                    cuttingAfterApi
                        .common(`/case/postAdjudged/pendingExecute`, param)
                        .then(res => {
                            if (res.code == 200) {
                                that.msgSuccess("操作成功");
                                that.getAdjudgedInfo();
                            }
                        });
                })
                .catch(() => {
                    that.msgInfo("已取消操作");
                });
        },
        // 表体字体颜色设置
        /***
         * row为某一行的除操作外的全部数据
         * column为某一列的属性
         * rowIndex为某一行（从0开始数起）
         * columnIndex为某一列（从0开始数起）
         */
        cellStyle({ row, column, rowIndex, columnIndex }) {
            // 状态列字体颜色
            if (row.red && columnIndex == 2) {
                return "color: red";
            } else {
                return "color: black";
            }
        },
        singlecellStyle({ row, column, rowIndex, columnIndex }) {
            // 状态列字体颜色
            if (row.red && columnIndex == 2) {
                return "color: red";
            } else {
                return "color: black";
            }
        },
        //已判决
        hasRule(item) {
            this.hasRuled.title = item.cName;
            this.hasRuled.requestApi = "/case/postAdjudged/judged";
            this.hasRuled.confirmTip = item.cName;
            // 控制弹窗组件显示
            this.hasRuled.dialogVisible = true;
        },
        //多元调解成功
        multipleSuccess(item) {
            this.multipleSuccessfully.title = item.cName;
            this.multipleSuccessfully.requestApi =
                "/case/adjudged/multiMediateSuccess";
            this.multipleSuccessfully.confirmTip = item.cName;
            // 控制弹窗组件显示
            this.multipleSuccessfully.dialogVisible = true;
        },
        //已执行立案
        executedFilling(item) {
            this.executedFiling.title = item.cName;
            this.executedFiling.requestApi = "/case/postAdjudged/executed";
            this.executedFiling.confirmTip = item.cName;
            // 控制弹窗组件显示
            this.executedFiling.dialogVisible = true;
        },
        //已强制执行
        handleEnforced(item) {
            this.enforced.title = item.cName;
            this.enforced.requestApi = "/case/postAdjudged/enforced";
            this.enforced.confirmTip = item.cName;
            // 控制弹窗组件显示
            this.enforced.dialogVisible = true;
        },
        //已立案
        handlePutOnRecord(item) {
            this.putOnRecord.title = item.cName;
            this.putOnRecord.requestApi = "/case/postAdjudged/filedCase";
            this.putOnRecord.confirmTip = item.cName;
            // 控制弹窗组件显示
            this.putOnRecord.dialogVisible = true;
        },
        // 案件状态字典翻译
        statusFormat(caseStatus) {
            return this.selectDictLabel(this.statusOptions, caseStatus);
        },
        // 案件状态字典翻译
        getstatusFormat(row, column) {
            return this.selectDictLabel(this.statusOptions, row.caseStatus);
        },
        // 房屋状态
        houseFormat(house) {
            return this.selectDictLabel(this.house, house);
        },
        // 财保状态字典翻译
        preStatusFormat(preStatus) {
            return this.selectDictLabel(this.protects, preStatus);
        },
        // 财保类型字典翻译
        proTypeFormat(proType) {
            return this.selectDictLabel(this.proType, proType);
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
            return this.selectDictLabel(
                this.realtimeSortresult,
                realtimeSortresult
            );
        },
        //在网状态号码筛选结果
        networkSortresultFormat(networkSortresult) {
            return this.selectDictLabel(
                this.networkSortresult,
                networkSortresult
            );
        },
        //汇款类型
        repayTypeFormat(row, column) {
            return this.selectDictLabel(this.remittanceTypes, row.repayType);
        },
        //审核状态
        reviewStatusFormat(row, column) {
            return this.selectDictLabel(this.auditStatus, row.reviewStatus);
        },
        //还款状态
        repayStatusFormat(row, column) {
            return this.selectDictLabel(this.paymentStatus, row.repayStatus);
        },
        //还款状态
        repayFormat(repayStatus) {
            return this.selectDictLabel(this.paymentStatus, repayStatus);
        },
        //联系标签
        contactResultFormat(medLable) {
            return this.selectDictLabel(this.contactResultOptions, medLable);
        },
        //调解标签
        getContactResultOptions(row, column) {
            return this.selectDictLabel(
                this.contactResultOptions,
                row.mediationLabel
            );
        },
        //联系状态
        contactStatusFormat(contactStatus) {
            return this.selectDictLabel(
                this.contactStatusOptions,
                contactStatus
            );
        },
        //网调标签
        adjustTypeFormat(row, column) {
            return this.selectDictLabel(this.adjustType, row.label);
        },
        //网调标签
        adjustFormat(networkAdjustLabel) {
            return this.selectDictLabel(this.adjustType, networkAdjustLabel);
        },
        //沃动标签
        wodongStatusFormat(deliverStatus) {
            return this.selectDictLabel(this.wodongStatus, deliverStatus);
        },
        //时速云标签
        shisuyunStatusFormat(deliverStatus) {
            return this.selectDictLabel(this.shisuyunStatus, deliverStatus);
        },
        //玄武标签
        xuanwuStatusFormat(deliverStatus) {
            return this.selectDictLabel(this.xuanwuStatus, deliverStatus);
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let po = this.ruleForm.related.split(",");
                    let param = {
                        caseId: this.id,
                        medLink: this.firstInfo.caseStatus,
                        medName: po[1],
                        medContactPerson: po[0],
                        medTel: po[2],
                        sourceRowId: po.length < 4 ? "" : parseInt(po[3]),
                        sourceType: po.length < 4 ? 0 : po[4],
                        medContent: this.ruleForm.medContent,
                        promiseRepayDate: this.ruleForm.promiseRepayDate,
                        promiseRepayDate: this.ruleForm.promiseRepayDate,
                        repayAmount: this.ruleForm.repayAmount,
                        term: this.ruleForm.term,
                        medLabel: this.ruleForm.medLabel,
                        repayDate: this.ruleForm.repayDate,
                        intention: this.ruleForm.intention
                    };
                    //console.log(param)
                    cuttingAfterApi.addRecord(param).then(res => {
                        this.msgSuccess("操作成功");
                        this.getCaseRecordInfo("medRecord");
                        this.resetForm("ruleForm");
                        //this.ruleForm.intention = 1
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //新增网调记录
        newNetworkAdjustmentRecord() {
            this.adjustmentData.title = "新增网调记录";
            this.adjustmentData.id = this.id;
            // 控制弹窗组件显示
            this.adjustmentData.dialogVisible = true;
        },
        //新增手机号
        addPhone(value) {
            this.phoneData.title = "裁后新增手机号";
            // 控制弹窗组件显示
            this.phoneData.dialogVisible = true;
            this.phoneData.name = value;
        },
        addStatus(val) {
            if (val.beforeStatus == 7 && val.status == 8) {
                this.putOnRecord.title = "已立案";
                this.putOnRecord.requestApi =
                    "/case/postAdjudged/updateFiledCase";
                this.putOnRecord.confirmTip = "已立案";
                this.putOnRecord.statusId = val.id;
                // 控制弹窗组件显示
                this.putOnRecord.dialogVisible = true;
            } else if (val.beforeStatus == 8 && val.status == 9) {
                this.hasRuled.title = "已判决";
                this.hasRuled.requestApi = "/case/postAdjudged/updateJudged";
                this.hasRuled.confirmTip = "已判决";
                this.hasRuled.statusId = val.id;
                // 控制弹窗组件显示
                this.hasRuled.dialogVisible = true;
            } else if (val.beforeStatus == 10 && val.status == 11) {
                this.executedFiling.title = "已执行立案";
                this.executedFiling.requestApi =
                    "/case/postAdjudged/updateExecuted";
                this.executedFiling.confirmTip = "已执行立案";
                this.executedFiling.statusId = val.id;
                // 控制弹窗组件显示
                this.executedFiling.dialogVisible = true;
            } else if (val.beforeStatus == 11 && val.status == 12) {
                this.enforced.title = "已强制执行";
                this.enforced.requestApi = "/case/postAdjudged/updateEnforced";
                this.enforced.confirmTip = "已强制执行";
                this.enforced.statusId = val.id;
                // 控制弹窗组件显示
                this.enforced.dialogVisible = true;
            } else if (val.beforeStatus == 5 && val.status == 10) {
                this.pendingFilling.title = "待执行立案";
                this.pendingFilling.requestApi =
                    "/case/postAdjudged/updatePendingExecute2";
                this.pendingFilling.confirmTip = "待执行立案";
                this.pendingFilling.statusId = val.id;
                // 控制弹窗组件显示
                this.pendingFilling.dialogVisible = true;
            }
        },
        //部分还款
        handleReimbursement(type) {
            this.reimbursementData.repayList = this.repayAccountList;
            this.reimbursementData.title =
                type == 0 ? "裁后部分还款" : "裁后结清";
            this.reimbursementData.dialogVisible = true;
            this.reimbursementData.type = type;
            this.reimbursementData.remainingBalance = this.firstInfo.remainingBalance;
            this.reimbursementData.outstandingAmount = this.firstInfo.outstandingAmount;
            this.reimbursementData.subjectAmount = this.firstInfo.subjectAmount;
            this.reimbursementData.commonCaseNum = this.firstInfo.commonCaseNum;
        },
        //多元调解中
        handleFailureing(item) {
            var that = this;
            this.$confirm(`是否切换案件状态为${item.cName}?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let param = {
                        caseId: that.id
                    };
                    cuttingAfterApi
                        .common(`/case/adjudged/multipleMediation`, param)
                        .then(res => {
                            if (res.code == 200) {
                                that.msgSuccess("操作成功");
                                that.getAdjudgedInfo();
                            }
                        });
                })
                .catch(() => {
                    that.msgInfo("已取消操作");
                });
        },
        //移入待立案
        handleOnRecord(item) {
            var that = this;
            this.$confirm(`是否切换案件状态为${item.cName}?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let param = {
                        caseId: that.id
                    };
                    cuttingAfterApi
                        .common(`/case/adjudged/pending`, param)
                        .then(res => {
                            if (res.code == 200) {
                                that.msgSuccess("操作成功");
                                that.getAdjudgedInfo();
                            }
                        });
                })
                .catch(() => {
                    that.msgInfo("已取消操作");
                });
        },
        //强制结案
        handleMandatory(item) {
            var that = this;
            this.$confirm(`是否切换案件状态为${item.cName}?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let param = {
                        caseId: that.id
                    };
                    cuttingAfterApi
                        .common(`/case/postAdjudged/closed`, param)
                        .then(res => {
                            if (res.code == 200) {
                                that.msgSuccess("操作成功");
                                that.getAdjudgedInfo();
                            }
                        });
                })
                .catch(() => {
                    that.msgInfo("已取消操作");
                });
        },
        recordingPlay(val) {
            this.audioData.src = process.env.VUE_APP_BASE_API + val.path;
            this.audioData.dialogVisible = true;
        },
        //一键外呼
        callMe(row) {
            if (this.firstInfo.entrustStatus == 2) {
                this.msgError("案件委案状态为【暂停】,无法进行该操作！");
                return;
            }
            var logData = {};
            var url = process.env.VUE_APP_BASE_API + "/breathe/log/one"; //电话日志
            const instance = axios.create({
                withCredentials: true
            });
            instance.defaults.headers.common["Authorization"] =
                "Bearer " + getToken();
            var that = this;
            this.$confirm(`是否要拨打电话?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    if (that.token) {
                        let phone = row.validPhone;
                        let tag = row.caseId;
                        DYSDK.call(
                            phone,
                            data => {
                                console.log(data, "拨打");
                                //电话连接中的状态
                                DYSDK.callConnecting(data => {
                                    console.log(data, "拨打连接中");
                                });
                                //成功触发
                                DYSDK.callConfirm(data => {
                                    tag = "";
                                    console.log(data, "拨打成功");
                                    that.getCaseRecordInfo("callRecord");
                                    //电话日志
                                    if (data) {
                                        logData = {
                                            ...data,
                                            operation: "拨打成功"
                                        };
                                    }
                                    instance({
                                        method: "post",
                                        url: url,
                                        data: logData,
                                        timeout: 600000,
                                        processData: false, // 告诉axios不要去处理发送的数据(重要参数)
                                        contentType: false // 告诉axios不要去设置Content-Type请求头
                                        // config: {
                                        //     headers: {'Content-Type': 'multipart/form-data'}
                                        // }
                                    }).then(res => {});
                                });
                                //失败触发
                                DYSDK.callFail(data => {
                                    tag = "";
                                    console.log(data, "拨打失败");
                                    that.getCaseRecordInfo("callRecord");
                                    //电话日志
                                    if (data) {
                                        logData = {
                                            ...data,
                                            operation: "拨打失败"
                                        };
                                    }
                                    instance({
                                        method: "post",
                                        url: url,
                                        data: logData,
                                        timeout: 600000,
                                        processData: false, // 告诉axios不要去处理发送的数据(重要参数)
                                        contentType: false // 告诉axios不要去设置Content-Type请求头
                                        // config: {
                                        //     headers: {'Content-Type': 'multipart/form-data'}
                                        // }
                                    }).then(res => {});
                                });
                                //电话挂断状态
                                DYSDK.callEnd(data => {
                                    tag = "";
                                    console.log(data, "电话挂断");
                                    that.getCaseRecordInfo("callRecord");
                                    //电话日志
                                    if (data) {
                                        logData = {
                                            ...data,
                                            operation: "电话挂断"
                                        };
                                    }
                                    instance({
                                        method: "post",
                                        url: url,
                                        data: logData,
                                        timeout: 600000,
                                        processData: false, // 告诉axios不要去处理发送的数据(重要参数)
                                        contentType: false // 告诉axios不要去设置Content-Type请求头
                                        // config: {
                                        //     headers: {'Content-Type': 'multipart/form-data'}
                                        // }
                                    }).then(res => {});
                                });
                            },
                            tag
                        );
                    } else {
                        that.msgError("外呼功能异常");
                    }
                })
                .catch(() => {
                    that.msgInfo("已取消操作");
                });
        },
        //申请案件信修
        applyEdit() {
            var that = this;
            this.$confirm(`是否申请案件信修?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let param = {
                        ids: that.id
                    };
                    cuttingAfterApi.applyCaseEdit(param).then(res => {
                        if (res.code == 200) {
                            that.msgSuccess(res.msg);
                        } else if (res.code == 500) {
                            that.msgError(res.msg);
                        }
                    });
                })
                .catch(() => {
                    that.msgInfo("已取消操作");
                });
        },
        //下载附件
        downFile(item) {
            window.location.href =
                process.env.VUE_APP_BASE_API +
                "/common/download/resource?resource=" +
                item.annexAddress;
        },
        //查看二维码
        seeErweima(item) {
            this.erweimaData.title = "二维码";
            this.erweimaData.url = item.qrCode;
            // 控制弹窗组件显示
            this.erweimaData.dialogVisible = true;
        },
        //查看汇款凭证
        seeErweima2(item) {
            this.erweimaData.title = "汇款凭证";
            this.erweimaData.url = item.remitEvidencePath;
            // 控制弹窗组件显示
            this.erweimaData.dialogVisible = true;
        },
        //脱敏数据
        viewData() {
            this.isDisable = true;
            this.isDesensitization = !this.isDesensitization;
            if (this.isDesensitization == false) {
                this.requestSourceData();
                this.$notify({
                    title: "成功",
                    message: "数据脱敏完成",
                    type: "success"
                });
            } else if (this.isDesensitization == true) {
                this.requestSourceData();
                this.$notify({
                    title: "成功",
                    message: "去除数据脱敏",
                    type: "warning"
                });
            }
            setTimeout(() => {
                this.isDisable = false;
            }, 3000);
        },
        nextCase(type) {
            let targetIndex = this.idList.findIndex(item => item == this.id);
            let idx;
            if (type == 2) {
                idx = targetIndex + 1;
            } else {
                idx = targetIndex - 1;
            }
            if (idx == this.idList.length) {
                this.msgError(
                    "本案件已是当前列表最后一个案件，如需查看下一页案件，请到列表中选择下一页！"
                );
                return;
            }
            if (idx == -1) {
                this.msgError("本案件已是当前列表第一个案件！");
                return;
            }
            this.id = this.idList[idx];
            //新增或修改单个参数
            this.$router.replace({
                query: merge(this.$route.query, {
                    afterId: this.id
                })
            });
        },
        //案件详情跳转
        handleItemUpdate(item) {
            if (item.caseStatus < 7) {
                this.$router.push({
                    path: `/division/cutBeforeDetails/${item.id}`,
                    query: {
                        beforeId: item.id
                    }
                });
            } else if (item.caseStatus >= 7) {
                this.$router.push({
                    path: `/division/cutAfterDetails/${item.id}`,
                    query: {
                        afterId: item.id
                    }
                });
            }
        }
    }
};
</script>

<style scoped lang="scss">
.case-info {
    margin: 10px 15px;
}

.two-distribution {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.inter-a {
    width: 250px;
    display: flex;
    color: #409eff;
}
</style>
<style lang="scss">
.big-margin {
    .el-radio {
        margin-bottom: 6px;
    }
}

.wrap-table {
    .cell.el-tooltip {
        white-space: pre-wrap;
    }
}

.distinguish-style {
    color: rgb(24, 144, 255);
    text-decoration: underline;
    cursor: pointer;
}

.el-collapse {
    border: 0;
}

.el-tabs__header {
    margin: 0;
}

.el-collapse-item__content {
    padding: 20px 0;
}

.el-collapse-item__header {
    border: 0;
    width: 135px;
    font-size: 14px;
    color: #606266;
    margin-left: 100px;
}

.el-collapse-item__wrap {
    border: 0;
}
</style>
