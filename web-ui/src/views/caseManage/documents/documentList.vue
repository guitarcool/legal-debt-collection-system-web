<template>
    <div class="app-container">
        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="danger" size="mini" icon="el-icon-s-help" v-hasPermi="['async:file:reExec']" @click="handleexecution">重新执行
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>

            <el-table v-loading="loading" max-height="550" :data="caseList" @sort-change="handleSortChange"
                ref="multiTable" :row-key="getRowKeys" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" /> -->
                <el-table-column label="主键" prop="id"></el-table-column>
                <el-table-column label="执行结果描述" prop="execDesc" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="执行开始时间" prop="execStartTime" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="执行结束时间" prop="execEndTime" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="执行结果" prop="execResult">
                    <template slot-scope="scope" v-if="scope.row.execResult != null">
                        <span v-if="scope.row.execResult == '生成失败'" style="color:red">{{scope.row.execResult}}</span>
                        <span v-if="scope.row.execResult == '生成成功'" style="color:green">{{scope.row.execResult}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="入参信息" prop="reqInfo" :show-overflow-tooltip="true" width="200"></el-table-column> -->
                <!-- <el-table-column label="执行结果信息" prop="resultInfo" width="280" :show-overflow-tooltip="true"></el-table-column> -->
                <el-table-column label="操作" width="200" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" v-if="scope.row.resultInfo"
                            @click="documemtDownload(scope.row.resultInfo)">下载
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
    import templateApi from "@/api/case/document/templateIndex";

    export default {
        name: "documentList",
        components: {},
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
                // 查询参数
                searchParams: {},
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                    orderByColumn: "",
                    isAsc: "",
                },
                selection: [],
                userList: [],
                getRowKeys(row) {
                    return row.id;
                },
            };
        },
        created() {
            this.getList(1);
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
            getList(type) {
                this.loading = true;
                //查询
                if (type == 1) {
                    this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    templateApi.asyncList(this.searchParams).then((response) => {
                        this.queryParams.orderByColumn = "";
                        this.clearSelection();
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
                //切换页
                else if (type == 2) {
                    templateApi.asyncList(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    });
                }
            },
            /** 排序触发事件 */
            handleSortChange(column, prop, order) {
                if (column.order) {
                    this.searchParams.orderByColumn = column.prop;
                    this.searchParams.isAsc = column.order;
                    this.getList(2);
                } else {
                    this.searchParams.orderByColumn = '';
                    this.searchParams.isAsc = '';
                    this.getList(2);
                }
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
            documemtDownload(file) {
                var that = this;
                this.$confirm(`是否确认下载?`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        that.msgSuccess("操作成功");
                        that.download(file);
                    })
                    .catch(() => {
                        that.msgInfo("已取消操作");
                    });
            },
            handleexecution() {
                var that = this;
                this.$confirm(`是否确认重新执行?`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        let data = {};
                        templateApi.getreExec(data).then((res) => {
                            if (res.code === 200) {
                                that.msgSuccess("操作成功");
                                that.clearSelection();
                            }
                        });
                    })
                    .catch(() => {
                        that.msgInfo("已取消操作");
                    });
            },
            resetAll() {},
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

</style>
