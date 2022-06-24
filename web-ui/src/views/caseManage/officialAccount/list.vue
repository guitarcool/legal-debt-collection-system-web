<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)"
            @resetAll="resetAll">
            <template #default>
                <el-form-item label="登录时间：">
                    <el-date-picker size="small" v-model="chooseDaterange" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" @change="handleChange"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="登录身份证：">
                    <el-input v-model="queryParams.idCard" placeholder="请输入身份证" clearable size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="登录手机号：">
                    <el-input v-model="queryParams.phone" placeholder="请输入手机号" clearable size="small"
                        style="width: 200px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="身份证匹配案件：">
                    <el-select style="width: 150px" filterable clearable size="small" v-model="queryParams.idCardHit"
                        placeholder="请选择">
                        <el-option v-for="item in hitList" :key="item.id" :label="item.label" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号匹配案件：">
                    <el-select style="width: 150px" filterable clearable size="small" v-model="queryParams.phoneHit"
                        placeholder="请选择">
                        <el-option v-for="item in hitList" :key="item.id" :label="item.label" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template #buttonArea>
            </template>
        </search-bar>
        <div class="box-contnet-wrap" style="margin-top:0">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="success" :disabled="isDisable" icon="el-icon-share" size="mini"
                        v-hasPermi="['wechat:list:replace']" @click="handleDivision">{{title}}
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>
            <p style="padding-bottom:10px;">注：仅且仅当登陆身份证在系统中含有进行中/暂停的案件且案件已绑定匹配的公众号时，方可登陆成功</p>
            <el-table v-loading="loading" max-height="550" border :data="caseList" ref="multiTable">
                <el-table-column label="登陆身份证" prop="idCard" :show-overflow-tooltip="true" />
                <el-table-column label="登陆手机号" prop="phone" :show-overflow-tooltip="true" />
                <el-table-column label="身份证匹配案件" prop="idCardHit" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{scope.row.idCardHit == 1?'不匹配':'匹配'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="手机号匹配案件" prop="phoneHit" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{scope.row.phoneHit == 1?'不匹配':'匹配'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="公众号匹配案件" prop="gzhHit" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{scope.row.gzhHit == 1?'不匹配':'匹配'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="查询时间" prop="createTime" :show-overflow-tooltip="true" />
                <el-table-column label="操作" width="300" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="warning" v-if="scope.row.caseStatus != 13"
                            @click="handleUpdate(scope.row)">案件详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <el-dialog title="案件列表" :height="300" :visible.sync="dialogVisible" width="45%" :before-close="handleClose">
            <el-table v-loading="modalLoading" max-height="550" border :data="modallist" ref="multiTable">
                <el-table-column label="订单号" prop="caseId" :show-overflow-tooltip="true" />
                <el-table-column label="案件批次号" prop="batchNo" :show-overflow-tooltip="true" />
                <el-table-column label="姓名" prop="respondentName" :show-overflow-tooltip="true" />
                <el-table-column label="标的金额" prop="subjectAmount" :show-overflow-tooltip="true" />
                <el-table-column label="操作" width="120" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button v-clipboard:copy="scope.row.respondentPhone" v-clipboard:success="onCopy" size="mini"
                            type="success" v-if="scope.row.caseStatus != 13" @click="handleItemUpdate(scope.row)">案件详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
                <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import officialApi from "@/api/case/officialAccount/index";
    import SearchBar from '@/components/SearchBar/index'
    export default {
        name: "list",
        components: {
            SearchBar,
        },
        data() {
            return {
                // 遮罩层
                loading: false,
                modalLoading: false,
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
                // 查询参数
                searchParams: {},
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                    orderByColumn: "",
                    isAsc: "",
                },
                chooseDaterange: [],
                hitList: [{
                        id: 0,
                        label: '匹配'
                    },
                    {
                        id: 1,
                        label: '不匹配'
                    }
                ],
                isDesensitization: false,
                isDisable: false,
                title: '去除数据脱敏',
                dialogVisible: false,
                modallist: []
            }
        },
        created() {
            this.getList(1);
        },
        // 是否显示过滤栏， 扣除页数，每页显示数，总数量参数，3个内的搜索参数，直接显示一行，不显示过滤
        computed: {
            hasFilter: {
                get() {
                    return true
                }
            }
        },
        methods: {
            /** 查询角色列表 */
            getList(type) {
                this.loading = true;
                //查询
                if (type == 1) {
                    this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    officialApi.wechatList(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        if (!this.isDesensitization) {
                            this.caseList.forEach(element => {
                                element.idCardNo = element.idCard;
                                element.idCard = element.idCard.replace(/^(.{4})(?:\d+)(.{4})$/,
                                    "$1 **** **** $2");
                                element.phone = element.phone.replace(/(\d{3})\d*(\d{4})/, "$1****$2");
                            });
                        }
                        this.total = response.total;
                        this.loading = false;
                    }).catch(() => {
                        this.caseList = [];
                        this.total = 0;
                        this.loading = false;
                    });
                }
                //切换页
                else if (type == 2) {
                    officialApi.wechatList(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        if (!this.isDesensitization) {
                            this.caseList.forEach(element => {
                                element.idCardNo = element.idCard;
                                element.idCard = element.idCard.replace(/^(.{4})(?:\d+)(.{4})$/,
                                    "$1 **** **** $2");
                                element.phone = element.phone.replace(/(\d{3})\d*(\d{4})/, "$1****$2");
                            });
                        }
                        this.total = response.total;
                        this.loading = false;
                    }).catch(() => {
                        this.caseList = [];
                        this.total = 0;
                        this.loading = false;
                    });
                }
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList(1);
            },
            clearSelection() {},
            resetAll() {
                this.chooseDaterange = []
            },
            handleChange(value) {
                //console.log(value)
                if (value == null) {
                    this.queryParams.beginTime = ''
                    this.queryParams.endTime = ''
                } else {
                    this.queryParams.beginTime = value[0]
                    this.queryParams.endTime = value[1]
                }
            },
            handleDivision() {
                this.isDisable = true;
                this.isDesensitization = !this.isDesensitization;
                if (!this.isDesensitization) {
                    this.getList(2);
                    this.$notify({
                        title: '成功',
                        message: '数据脱敏成功',
                        type: 'success'
                    });
                    this.title = '去除数据脱敏';
                } else if (this.isDesensitization) {
                    this.getList(2);
                    this.$notify({
                        title: '成功',
                        message: '数据去除脱敏成功',
                        type: 'warning'
                    });
                    this.title = '数据脱敏';
                }
                setTimeout(() => {
                    this.isDisable = false
                }, 3000)
            },
            handleUpdate(item) {
                let idCard = item.idCardNo;
                this.dialogVisible = true;
                officialApi.wechatCaseList(idCard).then((response) => {
                    this.modallist = response.data;
                    this.modalLoading = false;
                }).catch(() => {
                    this.modallist = [];
                    this.modalLoading = false;
                });
            },
            handleItemUpdate(item) {
                if (item.caseStatus < 7) {
                    this.$router.push({
                        name: "cutBeforeInfo",
                        query: {
                            beforeId: item.caseId
                        }
                    });
                } else if (item.caseStatus >= 7) {
                    this.$router.push({
                        name: "cutAfterInfo",
                        query: {
                            afterId: item.caseId
                        }
                    });
                }
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            //复制成功的回调
            onCopy() {
                this.dialogVisible = false;
                this.$message.success('提示：号码已复制，点击度言悬浮框中“拨打”即可以粘贴号码并外呼，通话后请及时“新增”联系人号码”');
            }
        }
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

</style>
