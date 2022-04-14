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
                        v-model="queryParams.medLabels" placeholder="请选择">
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
                            <el-radio-group v-model="queryParams.caseStatus">
                                <el-radio :label="13">已结案</el-radio>
                            </el-radio-group>
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
                <el-button size="mini" icon="el-icon-zoom-in" type="success" @click="implicitQuery"
                    style="margin-left:16px">高级查询</el-button>
            </template>
        </search-bar>
        <div class="queryDiv">
            查询结果统计：<span>列表案件量：{{otherParam.caseTotalCount?otherParam.caseTotalCount:''}}件；</span><span>列表标的金额：{{otherParam.subjectTotalAmount?otherParam.subjectTotalAmount:''}}元；</span><span>列表剩余待还总额：{{otherParam.totalRemainingBalance?otherParam.totalRemainingBalance:''}}元；</span>
        </div>
        <div class="box-contnet-wrap" style="margin-top:0">
            <el-row :gutter="10" class="mb8">
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>

            <el-table v-loading="loading" max-height="550" :data="caseList" @sort-change="handleSortChange" ref="multiTable"
                :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="案件批次号" prop="batchNo" width="110" :show-overflow-tooltip="true" fixed="left" />
                <el-table-column label="手机号" width="120" prop="respondentPhone" fixed="left" />
                <el-table-column label="姓名" width="100" prop="respondentName" :show-overflow-tooltip="true"
                    fixed="left" />
                <el-table-column label="最近一次调解标签" width="150" :formatter="getContactResultOptions"
                    prop="mediationLabel"></el-table-column>
                <el-table-column label="最近一次调解时间" width="160" prop="mediateTime"></el-table-column>
                <el-table-column label="最近一次短信送达状态" width="160" prop="deliverStatus">
                    <template slot-scope="scope" v-if="scope.row.deliverStatus != null">
                        <span
                            v-if="scope.row.providerType == 1">{{shisuyunStatusFormat(scope.row.deliverStatus) !=""?shisuyunStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                        <span
                            v-if="scope.row.providerType == 2">{{wodongStatusFormat(scope.row.deliverStatus) !=""?wodongStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                        <span
                            v-if="scope.row.providerType == 3">{{xuanwuStatusFormat(scope.row.deliverStatus) !=""?xuanwuStatusFormat(scope.row.deliverStatus):scope.row.deliverStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="账龄" prop="overdueAge" />
                <el-table-column label="标的金额" width="150" prop="subjectAmount" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="已还金额" width="150" prop="paidAmount" sortable="custom"
                    :sort-orders="['descending', 'ascending']" />
                <el-table-column label="剩余待还总额" width="200" prop="remainingBalance" />
                <el-table-column label="还款状态" :formatter="getRepayStatus" prop="repayStatus">
                </el-table-column>
                <el-table-column label="合同号" width="150" prop="orderNo" :show-overflow-tooltip="true" />
                <el-table-column label="逾期天数" width="150" sortable="custom" :sort-orders="['descending', 'ascending']"
                    prop="overdueDay" />
                <el-table-column label="逾期年利率" prop="overYearRate" width="100" />
                <el-table-column label="联系状态" :formatter="getContactStatusOptions" prop="contactStatus">
                </el-table-column>
                <el-table-column label="案件分配时间" prop="distributionTime" width="130" sortable="custom"
                    :sort-orders="['descending', 'ascending']">
                    <template slot-scope="scope" v-if="scope.row.distributionTime">
                        <span>{{
                            parseTime(scope.row.distributionTime, "{y}-{m}-{d}")
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="信修状态" :formatter="getLetterRepairStatus" prop="letterRepairStatus">
                </el-table-column>
                <el-table-column label="财保状态" :formatter="getProtects" prop="preStatus">
                </el-table-column>
                <el-table-column label="最近一次网调标签" width="150" :formatter="getAdjustType" prop="networkAdjustLabel">
                </el-table-column>
                <el-table-column label="前通话记录" width="160" prop="lastCallTime"></el-table-column>
                <el-table-column label="最近一次网调时间" width="160" prop="networkAdjustTime">
                </el-table-column>
                <el-table-column label="调解员" prop="principalName" width="140" />
                <el-table-column label="委案状态" :formatter="getEntrustType" prop="entrustStatus">
                </el-table-column>
                <el-table-column label="订单号" prop="id" width="170" :show-overflow-tooltip="true" />
                <el-table-column label="案件状态" width="150" :show-overflow-tooltip="true" :formatter="statusFormat"
                    prop="caseStatus">
                </el-table-column>
                <el-table-column label="承诺还款日" width="150" prop="promiseRepayDate" sortable="custom"
                    :sort-orders="['descending', 'ascending']">
                    <template slot-scope="scope">
                        <span>{{
                            parseTime(scope.row.promiseRepayDate, "{y}-{m}-{d}")
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="公众号名称" prop="bindWechat" width="160" :show-overflow-tooltip="true" />
                <el-table-column label="操作" width="180" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleUpdate(scope.row)"
                            v-hasPermi="['case:adjudged:query']">查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
    import divisionApi from "@/api/case/division/index";
    export default {
        name: "list",
        components: {
            SearchBar,
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
                idList: [], //id集合
                // 查询参数
                searchParams: [],
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                    entrustStatus: "1",
                    preStatus: "",
                    letterRepairStatus: "",
                    contactStatus: "",
                    repayStatus: "",
                    caseStatuss: [],
                    orderByColumn: "",
                    isAsc: "",
                },
                isShow: false,
                statusOptions: [],
                repayStatus: [],
                divisionData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                recordData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                contactResultOptions: [],
                letterRepairStatusOptions: [],
                checkFailure: false,
                selection: [],
                userList: [],
                protects: [],
                chooseDaterange: [],
                chooseDaterange1: [],
                chooseDaterange2: [],
                otherParam: {},
                token: null,
                addData: {
                    title: "",
                    headline: "",
                    dialogVisible: false,
                    id: null,
                },
                callData: {
                    title: "",
                    dialogVisible: false,
                    ids: '',
                },
                batchexportDialogData: {
                    title: "",
                    dialogVisible: false,
                    red: "",
                    params: "",
                },
                networkSortresult: [],
                realtimeSortresult: [],
                screenType: [],
                adjustType: [],
                screen_status: [],
                entrustType: [],
                rules: {
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
                form: {
                    exportRange: [],
                    isDesensitization: '1',
                },
                dialogVisible: false,
                getRowKeys(row) {
                    return row.id;
                },
                wodongStatus: [],
                shisuyunStatus: [],
                xuanwuStatus: [],
                contactStatusOptions: [],
                shortmsgProviderType: [],
                wechatList: [],
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
                contactResultOptions: [],
                screenResultOptions: [],
                shortmsgOptions: [],
                protects: [],
                props: {
                    multiple: true
                },
            };
        },
        created() {
            this.getList(1);
            this.getUsers();
            this.getwechatList();
            this.getCascaderData();
            //财保申请类型
            this.getDicts("wealth_protect").then((response) => {
                this.protects = response.data;
            });
            //案件状态
            this.getDicts("case_status").then((response) => {
                this.statusOptions = response.data;
            });
            //还款状态
            this.getDicts("repay_status").then((response) => {
                this.repayStatus = response.data;
            });
            //信修状态
            this.getDicts("letter_repair_status").then((response) => {
                this.letterRepairStatusOptions = response.data;
            });
            //调节标签状态
            this.getDicts("contact_status").then((response) => {
                this.contactResultOptions = response.data;
            });
            //号码筛选状态类型
            this.getDicts("screen_status").then((response) => {
                this.screen_status = response.data;
            });
            this.getDicts("contactStatus").then((response) => {
                this.contactStatusOptions = response.data;
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
            //度言id
            let token = JSON.parse(sessionStorage.getItem("token"));
            if (token != 0) {
                this.token = true;
            } else {
                this.token = false;
            }
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
            getwechatList() {
                divisionApi.wechatList().then((response) => {
                    this.wechatList = response.data || [];
                });
            },
            /** 查询角色列表 */
            getList(type) {
                this.queryParams.caseStatus = 13;
                this.idList = [];
                this.loading = true;
                //查询
                if (type == 1) {
                    this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    cuttingAfterApi.historical(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearSelection();
                        this.otherParam = response.otherParam;
                        this.caseList = response.rows;
                        response.rows.forEach(element => {
                            this.idList.push(element.id)
                        });
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
                    cuttingAfterApi.historical(this.searchParams).then((response) => {
                        this.otherParam = response.otherParam;
                        this.caseList = response.rows;
                        response.rows.forEach(element => {
                            this.idList.push(element.id)
                        });
                        this.total = response.total;
                        this.loading = false;
                    }).catch(() => {
                        this.loading = false;
                        this.caseList = [];
                        this.total = 0;
                    });
                }
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
            /** 排序触发事件 */
            handleSortChange(column, prop, order) {
                this.searchParams.orderByColumn = column.prop;
                this.searchParams.isAsc = column.order;
                this.getList(2);
            },
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.ids = [];
                    this.selection = [];
                }
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
            handleUpdate(item) {
                this.$router.push({
                    name: "cutAfterInfo",
                    query: {
                        afterId: item.id,
                        afterList: this.idList
                    }
                });
            },
            changeStatus() {
                this.getList(1);
            },
            // 案件状态字典翻译
            statusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.caseStatus);
            },
            //还款状态
            getRepayStatus(row, column) {
                return this.selectDictLabel(this.repayStatus, row.repayStatus);
            },
            //信修状态
            getLetterRepairStatus(row, column) {
                return this.selectDictLabel(this.letterRepairStatusOptions, row.letterRepairStatus);
            },
            //财保状态
            getProtects(row, column) {
                return this.selectDictLabel(this.protects, row.preStatus);
            },
            //网调标签
            getAdjustType(row, column) {
                return this.selectDictLabel(this.adjustType, row.networkAdjustLabel);
            },
            //调解标签
            getContactResultOptions(row, column) {
                return this.selectDictLabel(this.contactResultOptions, row.mediationLabel);
            },
            //联系状态
            getContactStatusOptions(row, column) {
                return this.selectDictLabel(this.contactStatusOptions, row.contactStatus);
            },
            //委案状态
            getEntrustType(row, column) {
                return this.selectDictLabel(this.entrustType, row.entrustStatus);
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
            //获取调解员
            getUsers() {
                divisionApi.userList().then((response) => {
                    this.userList = response.data.userList || [];
                    // for (var i = 0; i < this.userList.length; i++) {
                    //     this.userList[i].parentId = this.userList[i].deptId
                    //     delete this.userList[i].deptId
                    // }
                });
            },
            resetAll() {
                this.chooseDaterange = [];
                this.chooseDaterange1 = [];
                this.chooseDaterange2 = [];
            },
            handleChange(value) {
                //console.log(value)
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
