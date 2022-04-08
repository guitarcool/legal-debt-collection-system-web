<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="案件批次号：" prop="batchNo">
                    <el-input v-model="queryParams.batchNo" placeholder="请输入案件批次号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="调解员：">
                    <el-select clearable multiple collapse-tags filterable size="small" v-model="queryParams.principals"
                        placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="queryParams.respondentName" placeholder="请输入姓名，多个姓名用英文逗号连接" clearable
                        type="textarea" size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="queryParams.respondentPhone" placeholder="请输入手机号" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="账龄（M）：">
                    <el-input clearable size="small" style="width:100px" v-model="queryParams.overdueStartAge" />~
                    <el-input clearable size="small" style="width:100px" v-model="queryParams.overdueEndAge" />
                </el-form-item>
                <el-form-item label="号码筛选状态：">
                    <el-select clearable filterable size="small" v-model="queryParams.screenStatus" placeholder="请选择">
                        <el-option v-for="item in screen_status" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="号码筛选结果：">
                    <el-cascader collapse-tags :props="props" clearable filterable size="small"
                        v-model="queryParams.screenResults" :options="screenResultOptions" placeholder="请选择">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="最近一次调解时间：">
                    <el-date-picker v-model="chooseDaterange2" type="daterange" size="small" range-separator="至"
                        start-placeholder="调解开始日期" end-placeholder="调解结束日期" format="yyyy-MM-dd" @change="handleChange2"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="无调解天数：">
                    <el-cascader clearable filterable size="small" v-model="queryParams.noMedDay"
                        :options="noMedDayOptions" placeholder="请选择">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="无通话记录天数：">
                    <el-cascader clearable filterable size="small" v-model="queryParams.noCallDay"
                        :options="noCallDayOptions" placeholder="请选择">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="联系结果：">
                    <el-select size="small" multiple collapse-tags filterable clearable
                        v-model="queryParams.medLabelArr" placeholder="请选择">
                        <el-option v-for="item in contactResultOptions" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="承诺还款日：">
                    <el-date-picker v-model="chooseDaterange1" type="daterange" size="small" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange1"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="网调标签：">
                    <el-select clearable filterable size="small" v-model="queryParams.networkAdjustLabel"
                        placeholder="请选择">
                        <el-option v-for="item in adjustType" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="短信送达结果：">
                    <el-cascader collapse-tags :props="props" clearable filterable size="small"
                        v-model="queryParams.deliverResult" :options="shortmsgOptions" placeholder="请选择">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="客户回复内容：">
                    <el-select clearable filterable size="small" v-model="queryParams.replyContent" placeholder="请选择">
                        <el-option label="无" value="0"></el-option>
                        <el-option label="有" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <transition name="fade">
                    <div v-show="isShow" transiton="fade">
                        <div style="padding: 10px 0;font-weight:700">高级查询:</div>
                        <el-form-item label="订单号：">
                            <el-input v-model="queryParams.id" placeholder="请输入订单号" clearable size="small"
                                style="width: 240px" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="监督员：">
                            <el-select clearable multiple collapse-tags filterable size="small"
                                v-model="queryParams.supervisorss" placeholder="请选择">
                                <el-option v-for="item in deptList" :key="item.userId" :label="item.userName"
                                    :value="item.userId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="分发时间：">
                            <el-date-picker v-model="chooseDaterange" type="daterange" size="small" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd"
                                @change="handleChange" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="借款平台名称：">
                            <el-input v-model="queryParams.platform" placeholder="请输入借款平台名称" clearable size="small"
                                style="width: 240px" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="身份证号：">
                            <el-input v-model="queryParams.respondentIdNo" placeholder="请输入身份证号，多个身份证号用英文逗号连接" clearable
                                type="textarea" size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="合同号：">
                            <el-input v-model="queryParams.orderNo" placeholder="请输入合同号，多个合同号用英文逗号连接" clearable
                                type="textarea" size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="公众号名称：">
                            <el-select clearable filterable size="small" v-model="queryParams.bindWechatId"
                                placeholder="请选择">
                                <el-option v-for="item in wechatList" :key="item.id" :label="item.accountName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注：">
                            <el-input v-model="queryParams.remark" placeholder="请输入备注查询内容" clearable size="small"
                                style="width: 240px" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </div>
                </transition>
            </template>
            <template #filter>
                <el-form-item label="联系状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.contactStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in contactStatusOptions" :label="item.dictValue" :key="item.dictValue">
                            {{ item.dictLabel }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="还款状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.repayStatus" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in repayStatus" :key="item.dictValue" :label="item.dictValue">
                            {{item.dictLabel}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <transition name="fade">
                    <div v-show="isShow" transiton="fade">
                        <div style="padding: 10px 0;font-weight:700">高级查询:</div>
                        <el-form-item label="案件状态：" class="custom-radio">
                            <el-checkbox-group v-model="queryParams.caseStatuss" @change="changeStatus">
                                <el-checkbox label="">全部</el-checkbox>
                                <el-checkbox v-for="item in statusOptions" :label="item.dictValue"
                                    :key="item.dictValue">
                                    {{ item.dictLabel }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="财保状态：" class="custom-radio">
                            <el-radio-group v-model="queryParams.preStatus" @change="changeStatus">
                                <el-radio label="">全部</el-radio>
                                <el-radio v-for="item in protects" :key="item.dictValue" :label="item.dictValue">
                                    {{ item.dictLabel }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="委案状态：" class="custom-radio">
                            <el-radio-group v-model="queryParams.entrustStatus" @change="changeStatus">
                                <el-radio v-for="item in entrustType" :label="item.dictValue" :key="item.dictValue">
                                    {{ item.dictLabel }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="信修状态：" class="custom-radio">
                            <el-radio-group v-model="queryParams.letterRepairStatus" @change="changeStatus">
                                <el-radio label="">全部</el-radio>
                                <el-radio v-for="item in letterRepairStatusOptions" :label="item.dictValue"
                                    :key="item.dictValue">{{ item.dictLabel }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                </transition>
            </template>
            <template #buttonArea>
                <el-button size="mini" icon="el-icon-zoom-in" type="success" @click="implicitQuery" style="margin-left:16px">高级查询</el-button>
            </template>
        </search-bar>
        <div v-if="otherParam" class="queryDiv">
            查询结果统计：<span>列表案件量：{{otherParam.caseTotalCount}}件；</span><span>列表标的金额：{{otherParam.subjectTotalAmount}}元；</span><span>列表剩余待还总额：{{otherParam.totalRemainingBalance}}元；</span>
        </div>
        <div v-else class="queryDivTwo"></div>
        <div class="box-contnet-wrap" style="margin-top:0">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <div style="font-size:14px;height:28px;line-height:28px;">分案操作：</div>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-share" size="mini" :disabled="multiple"
                        @click="handleDivision" v-hasPermi="['case:assignment:assignment']">统一分发
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-s-unfold" size="mini" :disabled="multiple"
                        v-hasPermi="['case:assignment:supervisorAssignment']" @click="handleSupervisor">监督员分发
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-s-promotion" size="mini" :disabled="multiple"
                        @click="handleBinding" v-hasPermi="['wechat:case:bind']">公众号绑定</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <div style="font-size:14px;height:28px;line-height:28px;">案件操作：</div>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-mobile" size="mini" :disabled="multiple"
                        @click="handleFiltering">号码筛选
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-video-pause" size="mini" :disabled="multiple"
                        @click="suspendCase" v-hasPermi="['case:assignment:suspendCase']">暂停案件
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-video-play" size="mini" :disabled="multiple"
                        @click="recoveryCase" v-hasPermi="['case:assignment:recoverCase']">恢复案件
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-s-fold" size="mini" :disabled="multiple" @click="retreat"
                        v-hasPermi="['case:assignment:withdrawalCase']">退案
                    </el-button>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <div style="font-size:14px;height:28px;line-height:28px;">导出操作：</div>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" icon="el-icon-download" size="mini" :disabled="multiple"
                        @click="handleExport" v-hasPermi="['case:assignment:export']">导出
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" icon="el-icon-download" size="mini" :disabled="multiple"
                        @click="batchExportMediationRecord">
                        导出调解记录
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" icon="el-icon-download" size="mini" :disabled="multiple"
                        @click="batchExportAdjestMent">
                        导出网调记录
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>
            <el-table v-loading="loading" max-height="550" :data="caseList" @sort-change="handleSortChange"
                ref="multiTable" :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="案件分配时间" prop="distributionTime" fixed="left" width="130" sortable="custom"
                    :sort-orders="['descending', 'ascending']">
                    <template slot-scope="scope" v-if="scope.row.distributionTime">
                        <span>{{
              parseTime(scope.row.distributionTime, "{y}-{m}-{d}")
            }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" prop="respondentName" :show-overflow-tooltip="true" fixed="left"
                    width="80" />
                <el-table-column label="标的金额" prop="subjectAmount" width="110" :show-overflow-tooltip="true" />
                <el-table-column label="案件状态" :formatter="statusFormat" prop="caseStatus" width="120">
                </el-table-column>
                <el-table-column label="订单号" prop="id" :show-overflow-tooltip="true" width="170" />
                <el-table-column label="合同号" prop="orderNo" :show-overflow-tooltip="true" width="120" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="手机号" prop="respondentPhone" width="120" />
                <el-table-column label="已还金额" prop="paidAmount" width="120" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="逾期天数" prop="overdueDay" width="120" />
                <el-table-column label="逾期年利率" prop="overYearRate" width="100" />
                <el-table-column label="承诺还款日" prop="promiseRepayDate" width="160" sortable="custom"
                    :sort-orders="['descending', 'ascending']">
                    <template slot-scope="scope">
                        <span>{{
              parseTime(scope.row.promiseRepayDate, "{y}-{m}-{d}")
            }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="借款平台名称" prop="platform" width="160" :show-overflow-tooltip="true" />
                <el-table-column label="发布时间" prop="createTime" width="160" sortable="custom"
                    :sort-orders="['descending', 'ascending']">
                    <template slot-scope="scope" v-if="scope.row.createTime">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="还款状态" :formatter="getRepayStatus" prop="repayStatus" width="100">
                </el-table-column>
                <el-table-column label="分配天数" sortable="custom" :sort-orders="['descending', 'ascending']"
                    prop="remainDays" width="100">
                </el-table-column>
                <el-table-column label="调解员" prop="principalName" width="140" />
                <el-table-column label="监督员" prop="supervisors" width="140" />
                <el-table-column label="催收机构" prop="deptName" width="120">
                    <template slot-scope="scope" v-if="scope.row.deptName">
                        <span>{{ scope.row.deptName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="资产最终受让方" prop="assetLastAssignee" :show-overflow-tooltip="true" width="200" />
                <el-table-column label="联系状态" :formatter="getContactStatus" prop="contactStatus" width="100">
                </el-table-column>
                <el-table-column label="信修状态" :formatter="getLetterRepairStatusOptions" prop="letterRepairStatus"
                    width="100">
                </el-table-column>
                <el-table-column label="最近一次网调标签" width="150" :formatter="getAdjustType" prop="networkAdjustLabel">
                </el-table-column>
                <el-table-column label="最近一次网调时间" width="160" prop="networkAdjustTime">
                </el-table-column>
                <el-table-column label="最近一次调解标签" width="150" :formatter="getContactResultOptions"
                    prop="mediationLabel">
                </el-table-column>
                <el-table-column label="最近一次调解时间" width="160" prop="mediateTime">
                </el-table-column>
                <el-table-column label="前通话记录" width="160" prop="lastCallTime" sortable="custom"
                    :sort-orders="['descending', 'ascending']"></el-table-column>
                <el-table-column label="最近一次短信发送状态" width="160" prop="deliverStatus">
                    <template slot-scope="scope" v-if="scope.row.deliverStatus != null">
                        <span
                            v-if="scope.row.providerType == 1">{{shisuyunStatusFormat(scope.row.deliverStatus) !=""?shisuyunStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                        <span
                            v-if="scope.row.providerType == 2">{{wodongStatusFormat(scope.row.deliverStatus) !=""?wodongStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                        <span
                            v-if="scope.row.providerType == 3">{{xuanwuStatusFormat(scope.row.deliverStatus) !=""?xuanwuStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="委案状态" :formatter="getEntrustType" prop="entrustStatus">
                </el-table-column>
                <el-table-column label="公众号名称" prop="bindWechat" width="160" :show-overflow-tooltip="true" />
                <el-table-column label="操作" width="240" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="warning" @click="handleRecord(scope.row)"
                            v-hasPermi="['case:assignment:record']">调解记录
                        </el-button>
                        <el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
                            v-hasPermi="['case:assignment:query']">查看
                        </el-button>
                        <el-button size="mini" type="success" v-if="scope.row.caseStatus != 13"
                            @click="handleDivision(scope.row)" v-hasPermi="['case:caseinfo:query']">分发
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <el-dialog title="号码筛选" :visible.sync="numberDialogVisible" width="50%" :before-close="handleClose">
            <el-form style="margin: 0 auto;" ref="numberForm" :model="numberForm" :rules="rules" label-width="100px">
                <el-form-item label="筛选服务：" prop="radioStatus">
                    <el-radio-group v-model="numberForm.radioStatus">
                        <el-radio :label="1">手机号在网状态</el-radio>
                        <el-radio :label="2">手机号实时在网状态</el-radio>
                    </el-radio-group>
                    <p style="color:#49abd9">
                        注：手机号在网状态结果为正常或停用，手机号号码实时在网状态服务结果包括正常，空号，短时间关机，欠费停机且无短信能力，欠费但能接收短信，长时间关机等细化的结果。
                    </p>
                </el-form-item>
                <el-form-item label="筛选对象：" prop="status">
                    <el-radio-group v-model="numberForm.status">
                        <el-radio :label="1">本人</el-radio>
                        <el-radio :label="2">非本人</el-radio>
                        <el-radio :label="3">全部</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳过号码：">
                    <el-checkbox-group v-model="numberForm.jump" @change="jumpChange">
                        <el-checkbox :label="1">号码已筛选</el-checkbox>
                        <el-checkbox :label="2">号码已联系(指已有关联的调解记录)</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="numberDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="phoneNumberFormSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <divisionDialog @refresh="clearSelection" :title="divisionData.title" :show.sync="divisionData.dialogVisible"
            :id="divisionData.id" :principal="divisionData.principal" :orgNo="divisionData.orgNo"
            :caseStatus="divisionData.caseStatus"></divisionDialog>
        <supervisorDialog @refresh="clearSelection" :title="supervisorData.title" :ids="supervisorData.ids"
            :show.sync="supervisorData.dialogVisible"></supervisorDialog>
        <recordDialog :title="recordData.title" :show.sync="recordData.dialogVisible" :id="recordData.id">
        </recordDialog>
        <bindingCase @refresh="clearSelection" :title="bindingData.title" :show.sync="bindingData.dialogVisible"
            :ids="bindingData.ids">
        </bindingCase>
        <exportDialog @refresh="clearSelection" :title="exportData.title" :show.sync="exportData.dialogVisible"
            :ids="exportData.ids" :requestApi="exportData.requestApi"></exportDialog>
        <el-dialog :title="form.title" :visible.sync="exportDialogVisible" width="50%" :before-close="handleClose">
            <el-form style="margin: 0 auto;" ref="form" :model="form" :rules="exportRules" label-width="100px">
                <el-form-item v-if="form.title=='导出调解记录'" label="导出范围：" prop="exportRange">
                    <el-checkbox-group v-model="form.exportRange">
                        <el-checkbox :label="1">最近一次调解记录</el-checkbox>
                        <el-checkbox :label="2">全部调解记录</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="form.title=='导出网调记录'" label="导出范围：" prop="exportRange">
                    <el-checkbox-group v-model="form.exportRange">
                        <el-checkbox :label="1">最近一次网调记录</el-checkbox>
                        <el-checkbox :label="2">全部网调记录</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="form.title=='导出调解记录'" label="是否脱敏：" prop="isDesensitization">
                    <el-radio-group v-model="form.isDesensitization">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="exportDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="phoneSubmit(form.title)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import divisionApi from "@/api/case/division/index";
    import divisionDialog from "./divisionDialog";
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
    import supervisorDialog from "./supervisorDialog";
    import recordDialog from "./recordDialog";
    import bindingCase from "./bindingCase";
    import exportDialog from "../components/exportDialog";

    export default {
        name: "list",
        components: {
            SearchBar,
            divisionDialog,
            supervisorDialog,
            recordDialog,
            exportDialog,
            bindingCase
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
                isShow: false,
                // 查询参数
                searchParams: {},
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                    entrustStatus: "1",
                    preStatus: "",
                    letterRepairStatus: "",
                    contactStatus: "",
                    repayStatus: "",
                    caseStatuss: [''],
                    orderByColumn: "",
                    isAsc: "",
                },
                rules: {
                    status: [{
                        required: true,
                        message: '请选择筛选对象',
                        trigger: 'change'
                    }],
                    radioStatus: [{
                        required: true,
                        message: '请选择筛选服务',
                        trigger: 'change'
                    }]
                },
                noMedDayOptions: [{
                        value: '0',
                        label: '无调解记录'
                    },
                    {
                        value: '1',
                        label: '大于',
                        children: [{
                                value: '7',
                                label: '7天',
                            },
                            {
                                value: '14',
                                label: '14天',
                            },
                            {
                                value: '21',
                                label: '21天',
                            },
                            {
                                value: '28',
                                label: '28天',
                            },
                            {
                                value: '35',
                                label: '35天',
                            },
                            {
                                value: '42',
                                label: '42天',
                            },
                            {
                                value: '49',
                                label: '49天',
                            },
                            {
                                value: '56',
                                label: '56天',
                            },
                            {
                                value: '63',
                                label: '63天',
                            },
                            {
                                value: '70',
                                label: '70天',
                            },
                            {
                                value: '77',
                                label: '77天',
                            },
                            {
                                value: '84',
                                label: '84天',
                            },
                            {
                                value: '91',
                                label: '91天',
                            },
                        ]
                    },
                ],
                noCallDayOptions: [{
                        value: '0',
                        label: '无通话记录'
                    },
                    {
                        value: '1',
                        label: '大于',
                        children: [{
                                value: '7',
                                label: '7天',
                            },
                            {
                                value: '14',
                                label: '14天',
                            },
                            {
                                value: '21',
                                label: '21天',
                            },
                            {
                                value: '28',
                                label: '28天',
                            },
                            {
                                value: '35',
                                label: '35天',
                            },
                            {
                                value: '42',
                                label: '42天',
                            },
                            {
                                value: '49',
                                label: '49天',
                            },
                            {
                                value: '56',
                                label: '56天',
                            },
                            {
                                value: '63',
                                label: '63天',
                            },
                            {
                                value: '70',
                                label: '70天',
                            },
                            {
                                value: '77',
                                label: '77天',
                            },
                            {
                                value: '84',
                                label: '84天',
                            },
                            {
                                value: '91',
                                label: '91天',
                            },
                        ]
                    },
                ],
                statusOptions: [],
                contactStatusOptions: [],
                letterRepairStatusOptions: [],
                repayStatus: [],
                divisionData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                    orgNo: "",
                    principal: "",
                    caseStatus: "",
                },
                bindingData: {
                    title: "",
                    dialogVisible: false,
                    ids: []
                },
                supervisorData: {
                    title: "",
                    dialogVisible: false,
                    ids: ''
                },
                recordData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                numberForm: {
                    status: "",
                    jump: [],
                    radioStatus: "",
                },
                numberDialogVisible: false,
                dialogVisible: false,
                selection: [],
                chooseDaterange: [],
                chooseDaterange1: [],
                chooseDaterange2: [],
                networkSortresult: [],
                realtimeSortresult: [],
                screenType: [],
                screen_status: [],
                userList: [],
                deptList: [],
                adjustType: [],
                entrustType: [],
                otherParam: {},
                exportData: {
                    title: "",
                    dialogVisible: false,
                    ids: "",
                    requestApi: "",
                },
                form: {
                    exportRange: [],
                    isDesensitization: '1',
                },
                exportRules: {
                    exportRange: [{
                        required: true,
                        message: '请选择导出范围',
                        trigger: 'change'
                    }],
                    isDesensitization: [{
                        required: true,
                        message: '请选择是否脱敏',
                        trigger: 'change'
                    }]
                },
                exportDialogVisible: false,
                getRowKeys(row) {
                    return row.id;
                },
                wodongStatus: [],
                shisuyunStatus: [],
                xuanwuStatus: [],
                shortmsgProviderType: [],
                contactResultOptions: [],
                wechatList: [],
                screenResultOptions: [],
                shortmsgOptions: [],
                protects: [],
                props: {
                    multiple: true
                },
            };
        },
        created() {
            //案件状态
            this.getDicts("case_status").then((response) => {
                this.statusOptions = response.data;
            });
            //案件联系状态
            this.getDicts("contactStatus").then((response) => {
                this.contactStatusOptions = response.data;
            });
            //联系状态
            this.getDicts("contact_status").then((response) => {
                this.contactResultOptions = response.data;
            });
            //还款状态
            this.getDicts("repay_status").then((response) => {
                this.repayStatus = response.data;
            });
            //信修状态
            this.getDicts("letter_repair_status").then((response) => {
                this.letterRepairStatusOptions = response.data;
            });
            //号码筛选类型
            this.getDicts("screen_Type").then((response) => {
                this.screenType = response.data;
            });
            //在网状态号码筛选结果
            this.getDicts("network_screen_result").then((response) => {
                this.networkSortresult = response.data;
            });
            //实时在网号码筛选结果
            this.getDicts("realtime_screen_result").then((response) => {
                this.realtimeSortresult = response.data;
            });
            //号码筛选状态类型
            this.getDicts("screen_status").then((response) => {
                this.screen_status = response.data;
            });
            //网调标签
            this.getDicts("network_adjust_label").then((response) => {
                this.adjustType = response.data;
            });
            //委案状态
            this.getDicts("entrust_status").then((response) => {
                this.entrustType = response.data;
            });
            //沃动标签
            this.getDicts("wodong_deliver_status").then((response) => {
                this.wodongStatus = response.data;
            });
            //时速云标签
            this.getDicts("shisuyun_deliver_status").then((response) => {
                this.shisuyunStatus = response.data;
            });
            //玄武标签
            this.getDicts("xuanwu_deliver_status").then((response) => {
                this.xuanwuStatus = response.data;
            });
            //短信渠道类型
            this.getDicts("shortmsg_provider_type").then((response) => {
                this.shortmsgProviderType = response.data;
            });
            //财保申请类型
            this.getDicts("wealth_protect").then((response) => {
                this.protects = response.data;
            });
            this.getList(1);
            this.getUsers();
            this.getwechatList();
            this.getDeptList();
            this.getCascaderData();
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
            resetAll() {
                this.chooseDaterange = [];
                this.chooseDaterange1 = [];
                this.chooseDaterange2 = [];
                this.queryParams.caseStatuss = [''];
            },
            /** 获取监督员列表 */
            getDeptList() {
                divisionApi.supervisorList().then(response => {
                    this.deptList = response.data.userList || [];
                });
            },
            /** 获取级联选择器 */
            getCascaderData() {
                let params1 = {
                    type: 'screen'
                };
                let params2 = {
                    type: 'shortmsg'
                };
                divisionApi.getCascaderData(params1).then(response => {
                    this.screenResultOptions = response.data || [];
                });
                divisionApi.getCascaderData(params2).then(response => {
                    this.shortmsgOptions = response.data || [];
                });
            },
            getwechatList() {
                divisionApi.wechatList().then((response) => {
                    this.wechatList = response.data || [];
                });
            },
            /** 查询角色列表 */
            getList(type) {
                this.loading = true;
                //查询
                if (type == 1) {
                    this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    divisionApi.list(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearSelection();
                        this.otherParam = response.otherParam;
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }).catch(() => {
                        this.loading = false;
                        this.caseList = [];
                        this.total = 0;
                    });
                }
                //切换页
                else if (type == 2) {
                    divisionApi.list(this.searchParams).then((response) => {
                        this.otherParam = response.otherParam;
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }).catch(() => {
                        this.loading = false;
                        this.caseList = [];
                        this.total = 0;
                    });
                }
            },
            /** 排序触发事件 */
            handleSortChange(column, prop, order) {
                this.searchParams.orderByColumn = column.prop;
                this.searchParams.isAsc = column.order;
                this.getList(2);
            },
            jumpChange(value) {
                this.numberForm.jump = value;
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
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.ids = [];
                    this.selection = [];
                }
            },
            /** 导出按钮操作 */
            handleExport() {
                this.exportData.ids = this.ids.toString()
                this.exportData.title = "案件导出";
                this.exportData.dialogVisible = true;
                this.exportData.requestApi = "/case/assignment/export";
            },
            //暂停
            suspendCase() {
                if (this.selection.filter((item) => item.entrustStatus == 2).length > 0) {
                    this.msgError("所选案件存在暂停状态的案件，不能批量暂停");
                    return;
                }
                var that = this;
                this.$confirm("注：案件状态变更为：暂停，暂停期间可从案件中心更新案件信息，分配/监督机构及其用户可对案件信息进行查看，其余业务操作暂停，直至案件恢复。是否确认暂停？", "暂停案件", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        divisionApi.suspendCase(this.ids).then((res) => {
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
            //恢复案件
            recoveryCase() {
                if (this.selection.filter((item) => item.entrustStatus == 1).length > 0) {
                    this.msgError("所选案件存在进行中状态的案件，不能批量恢复案件");
                    return;
                }
                var that = this;
                this.$confirm("注：恢复案件后案件状态变更恢复回暂停前状态，可对案件进行正常业务操作。是否确认恢复？", "恢复案件", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        divisionApi.recoverCase(this.ids).then((res) => {
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
            retreat() {
                var that = this;
                this.$confirm("注：案件状态变更为：已退案，退案后案件不再更新，撤回分配/监督机构及其用户对案件的操作权限，仅保留操作记录及业务统计数据。是否确认退案？", "退案", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        divisionApi.withdrawalCase(this.ids).then((res) => {
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
            //导出调解记录
            batchExportMediationRecord() {
                // if (this.selection.filter((item) => item.caseStatus == 13).length > 0) {
                //   this.msgError("所选数据存在已结案的数据，不能批量筛选号码");
                //   return;
                // }  
                this.form.title = '导出调解记录';
                this.form.exportRange = [];
                this.form.isDesensitization = 1;
                this.exportDialogVisible = true;
            },
            //导出网调记录
            batchExportAdjestMent() {
                // if (this.selection.filter((item) => item.caseStatus == 13).length > 0) {
                //   this.msgError("所选数据存在已结案的数据，不能批量筛选号码");
                //   return;
                // }  
                this.form.title = '导出网调记录';
                this.form.exportRange = [];
                this.form.isDesensitization = 1;
                this.exportDialogVisible = true;
            },
            phoneSubmit(title) {
                if (title == '导出调解记录') {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            let queryParams = {
                                caseIds: this.ids.join(","),
                                exportRange: this.form.exportRange.toString(),
                                isDesensitization: this.form.isDesensitization,
                            };
                            cuttingAfterApi.postAdjudgedBatchExport(queryParams).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.exportDialogVisible = false;
                                    this.download(res.msg);
                                    this.clearSelection();
                                }
                            })
                        }
                    });
                } else if (title == '导出网调记录') {
                    this.$refs["form"].validate((valid) => {
                        if (valid) {
                            let queryParams = {
                                caseIds: this.ids.join(","),
                                exportRange: this.form.exportRange.toString(),
                            };
                            cuttingAfterApi.batchExportNetworkAdjustRecord(queryParams).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.exportDialogVisible = false;
                                    this.download(res.msg);
                                    this.clearSelection();
                                }
                            })
                        }
                    });
                }
            },
            /** 案件分发 */
            handleDivision(item) {
                if (!item.id) {
                    if (this.selection.filter((item) => item.caseStatus == 13).length > 0) {
                        this.msgError("所选数据存在已结案的数据，不能批量分发");
                        return;
                    }
                }
                this.divisionData.title = "案件分发";
                this.divisionData.dialogVisible = true;
                this.divisionData.id = item.id ? item.id : this.ids.join(",");
                this.divisionData.orgNo = item.id ?
                    item.orgNo :
                    this.selection.map((i) => i.orgNo).join(",");
                this.divisionData.principal = item.id ?
                    item.principal :
                    this.selection.map((i) => i.principal).join(",");
                this.divisionData.caseStatus = item.id ?
                    item.caseStatus :
                    this.selection.map((i) => i.caseStatus);
            },
            handleFiltering() {
                if (this.selection.filter((item) => item.caseStatus == 13).length > 0) {
                    this.msgError("所选数据存在已结案的数据，不能批量筛选号码");
                    return;
                }
                this.numberForm.status = 1;
                this.numberForm.jump = [1, 2];
                this.numberForm.radioStatus = 1;
                this.numberDialogVisible = true;
            },
            handleSupervisor() {
                this.supervisorData.ids = this.ids.join(",");
                this.supervisorData.title = "监督员分发";
                this.supervisorData.dialogVisible = true;
            },
            handleBinding() {
                this.bindingData.ids = this.ids;
                this.bindingData.title = "公众号绑定";
                this.bindingData.dialogVisible = true;
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            handleUpdate(item) {
                this.$router.push({
                    name: "divisionInfo",
                    query: {
                        id: item.id
                    }
                });
            },
            handleRecord(item) {
                this.recordData.title = "调解记录";
                this.recordData.dialogVisible = true;
                this.recordData.id = item.id;
            },
            changeStatus() {
                this.getList(1);
            },
            // 案件状态字典翻译
            statusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.caseStatus);
            },
            getRepayStatus(row, column) {
                return this.selectDictLabel(this.repayStatus, row.repayStatus);
            },
            getContactStatus(row, column) {
                return this.selectDictLabel(this.contactStatusOptions, row.contactStatus);
            },
            getLetterRepairStatusOptions(row, column) {
                return this.selectDictLabel(this.letterRepairStatusOptions, row.letterRepairStatus);
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
            //网调标签
            getAdjustType(row, column) {
                return this.selectDictLabel(this.adjustType, row.networkAdjustLabel);
            },
            //联系标签
            getContactResultOptions(row, column) {
                return this.selectDictLabel(this.contactResultOptions, row.mediationLabel);
            },
            //委案状态
            getEntrustType(row, column) {
                return this.selectDictLabel(this.entrustType, row.entrustStatus);
            },
            handleChange(value) {
                if (value == null) {
                    this.queryParams.disBeginTime = "";
                    this.queryParams.disEndTime = "";
                } else {
                    this.queryParams.disBeginTime = value[0];
                    this.queryParams.disEndTime = value[1];
                }
            },
            handleChange1(value) {
                //console.log(value)
                if (value == null) {
                    this.queryParams.repayBeginTime = "";
                    this.queryParams.repayEndTime = "";
                } else {
                    this.queryParams.repayBeginTime = value[0];
                    this.queryParams.repayEndTime = value[1];
                }
            },
            handleChange2(value) {
                //console.log(value)
                if (value == null) {
                    this.queryParams.lastMediateBeginTime = "";
                    this.queryParams.lastMediateEndTime = "";
                } else {
                    this.queryParams.lastMediateBeginTime = value[0];
                    this.queryParams.lastMediateEndTime = value[1];
                }
            },
            //获取调解员
            getUsers() {
                divisionApi.userList().then((response) => {
                    this.userList = response.data.userList || [];
                });
            },
            phoneNumberFormSubmit() {
                this.$refs["numberForm"].validate((valid) => {
                    if (valid) {
                        divisionApi.screening(this.ids, this.numberForm.jump, this.numberForm.status, this
                                .numberForm.radioStatus)
                            .then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("操作成功");
                                    this.numberDialogVisible = false;
                                    this.clearSelection();
                                } else if (res.code === 500) {
                                    this.msgError(res.msg);
                                }
                            })
                    }
                });
            },
            //高级查询
            implicitQuery() {
                this.isShow = !this.isShow
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

    .queryDiv {
        height: 30px;
        padding: 5px 20px;
        background: #FCFFC9;

        span {
            margin-left: 15px;
        }
    }

    .queryDivTwo {
        height: 20px;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter,
    .fade-leave-active {
        transition: opacity .5s
    }

</style>
