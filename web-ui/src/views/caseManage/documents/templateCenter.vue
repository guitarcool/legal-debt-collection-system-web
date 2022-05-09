<template>
    <div class="app-container">
        <search-bar v-show="showSearch" :model="queryParams" :has-filter="hasFilter" :flag="true" @submit="getList(1)">
            <template #default>
                <el-form-item label="模版名称：">
                    <el-input v-model="queryParams.name" placeholder="请输入模版名称" clearable size="small"
                        style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="格式类型：">
                    <el-select clearable filterable v-model="queryParams.formatType" placeholder="请选择">
                        <el-option v-for="item in formatTypes" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template #filter>
                <el-form-item label="模版状态：" class="custom-radio">
                    <el-radio-group v-model="queryParams.status" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="模版类型：" class="custom-radio">
                    <el-radio-group v-model="queryParams.templateType" @change="changeStatus">
                        <el-radio label="">全部</el-radio>
                        <el-radio v-for="item in templateTypes" :key="item.dictValue" :label="item.dictValue">
                            {{ item.dictLabel }}</el-radio>
                        <!--<el-radio :label="1">诉讼模版</el-radio>-->
                        <!--<el-radio :label="2">律师函模版</el-radio>-->
                        <!--<el-radio :label="3">债转模版</el-radio>-->
                    </el-radio-group>
                </el-form-item>
            </template>
            <template #buttonArea> </template>
        </search-bar>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="warning" icon="el-icon-download" size="mini" @click="handleSeeField"
                        v-hasPermi="['template:field:query']">查看字段表
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-share" size="mini" @click="handleAddTemplate"
                        v-hasPermi="['template:info:add']">新增模版
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" icon="el-icon-plus" size="mini" @click="handleAddTCombined"
                        v-hasPermi="['template:info:combined']">新增组合字段
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="deleteData">
                        删除
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(2)" @clearTick="clearSelection">
                </right-toolbar>
            </el-row>

            <el-table v-loading="loading" max-height="550" :data="caseList" ref="multiTable" :row-key="getRowKeys"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left" />
                <el-table-column label="模版号" prop="id" :show-overflow-tooltip="true" fixed="left" width="100" />
                <el-table-column label="模版名称" prop="name" :show-overflow-tooltip="true" fixed="left" width="300" />

                <el-table-column label="模版状态" prop="status" width="120">
                    <template slot-scope="scope" v-if="scope.row.status != null">
                        <span>{{ scope.row.status == 0 ? "停用" : "启用" }}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column label="启用日期" prop="promiseRepayDate" width="160">-->
                <!--<template slot-scope="scope">-->
                <!--<span>{{ parseTime(scope.row.promiseRepayDate,'{y}-{m}-{d}') }}</span>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="是否为公共模版" width="140" prop="pageIsPublic">
                </el-table-column>
                <el-table-column label="管理员" prop="managerName" width="150" />

                <el-table-column label="模版类型" width="150" :formatter="getTemplateTypes" prop="templateType">
                </el-table-column>
                <el-table-column label="格式类型" width="150" :formatter="getFormatType" prop="formatType">
                </el-table-column>
                <el-table-column label="操作" width="300" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" v-if="scope.row.formatType === 0" type="primary"
                            @click="seeWord(scope.row)" v-hasPermi="['template:info:query']">下载
                        </el-button>
                        <el-button size="mini" type="warning" @click="edit(scope.row.id)"
                            v-hasPermi="['template:info:edit']">编辑
                        </el-button>
                        <el-button size="mini" type="danger" @click="toggle(scope.row.id)" v-if="scope.row.status == 0"
                            v-hasPermi="['template:info:switch']">启用
                        </el-button>
                        <el-button size="mini" type="danger" v-if="scope.row.status == 1" @click="toggle(scope.row.id)"
                            v-hasPermi="['template:info:switch']">停用
                        </el-button>
                        <!--<el-button-->
                        <!--size="mini"-->
                        <!--type="success"-->
                        <!--v-hasPermi="['case:caseinfo:query']">更换模版-->
                        <!--</el-button>-->
                        <el-button size="mini" type="success" @click="cloning(scope.row.id)"
                            v-hasPermi="['template:info:clone']">克隆
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="searchParams.pageNum"
                :limit.sync="searchParams.pageSize" @pagination="getList(2)" />
        </div>
        <addTemplate @refresh="getList(1)" :title="addTemplateData.title" :show.sync="addTemplateData.dialogVisible"
            :id="addTemplateData.id"></addTemplate>
        <seeField :title="seeFieldData.title" :show.sync="seeFieldData.dialogVisible" :id="seeFieldData.id"></seeField>
        <combined :title="combinedData.title" :show.sync="combinedData.dialogVisible" :id="combinedData.id"></combined>
        <chooseFileDown :title="fieldDown.title" :show.sync="fieldDown.dialogVisible" :id="fieldDown.id">
        </chooseFileDown>
    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar/index";
    import templateApi from "@/api/case/document/templateIndex";
    import addTemplate from "./addTemplate";
    import seeField from "./seeField";
    import chooseFileDown from "./chooseFileDown";
    import combined from "./combined.vue";

    export default {
        name: "templateCenter",
        components: {
            SearchBar,
            addTemplate,
            seeField,
            chooseFileDown,
            combined
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
                // 查询参数
                searchParams:{},
                queryParams: {
                    name: "",
                    pageNum: 1,
                    pageSize: 50,
                    templateType: "",
                    status: "",
                    formatType: "",
                },
                selection: [],
                addTemplateData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                seeFieldData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                combinedData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                formatTypes: [],
                templateTypes: [],
                fieldDown: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                },
                getRowKeys(row) {
                    return row.id;
                },
            };
        },
        created() {
            this.getList(1);
            //格式类型
            this.getDicts("format_type").then((response) => {
                this.formatTypes = response.data;
            });
            //模版类型
            this.getDicts("template_type").then((response) => {
                this.templateTypes = response.data;
            });
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
                if(type == 1){
		            this.searchParams = JSON.parse(JSON.stringify(this.queryParams));
                    templateApi.list(this.searchParams).then((response) => {
                        this.clearSelection();
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }
                    ).catch(() => {
                        this.caseList = [];
                        this.total = 0;
                        this.loading = false;
                    });
                }
                //切换页
                else if(type == 2){
                    templateApi.list(this.searchParams).then((response) => {
                        this.caseList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }
                    ).catch(() => {
                        this.caseList = [];
                        this.total = 0;
                        this.loading = false;
                    });
                }
            },
            deleteData() {
                const userIds = this.ids;
                this.$confirm(
                        '是否确认删除选中的模版?',
                        "警告", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        }
                    )
                    .then(function () {
                        return templateApi.templatedelete(userIds);
                    })
                    .then(() => {
                        this.clearSelection();
                        this.msgSuccess("删除成功");
                        this.getList(1);
                    })
                    .catch(function () {});
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
            /** 导出按钮操作 */
            handleExport() {
                const queryParams = this.queryParams;
                this.$confirm("是否确认导出所有数据项?", "警告", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(function () {
                        return templateApi.export(queryParams);
                    })
                    .then((response) => {
                        this.download(response.msg);
                    })
                    .catch(function () {});
            },
            handleUpdate(item) {
                this.$router.push({
                    name: "divisionInfo",
                    query: {
                        id: item.id
                    }
                });
            },
            changeStatus() {
                this.getList(1);
            },
            clearSelection() {
                if (this.caseList.length > 0) {
                    this.$refs.multiTable.clearSelection(); //清除选中的数据
                    this.ids = [];
                    this.selection = [];
                }
            },
            handleAddTemplate() {
                this.addTemplateData.title = "新增模版";
                this.addTemplateData.dialogVisible = true;
                this.addTemplateData.id = "";
            },
            handleAddTCombined() {
                this.combinedData.title = "组合字段管理";
                this.combinedData.dialogVisible = true;
                this.combinedData.id = "";
            },
            //切换状态
            toggle(id) {
                var that = this;
                this.$confirm("是否确认切换?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        templateApi.toggleStatus(id).then((res) => {
                            that.msgSuccess("操作成功");
                            that.clearSelection();
                        });
                    })
                    .catch(() => {});
            },
            //编辑
            edit(id) {
                this.addTemplateData.title = "编辑模版";
                this.addTemplateData.dialogVisible = true;
                this.addTemplateData.id = JSON.stringify(id);
            },
            //克隆
            cloning(id) {
                this.addTemplateData.title = "克隆模版";
                this.addTemplateData.dialogVisible = true;
                this.addTemplateData.id = JSON.stringify(id);
            },
            //查看字段表
            handleSeeField() {
                this.seeFieldData.title = "查看字段表";
                this.seeFieldData.dialogVisible = true;
                this.seeFieldData.id = "";
            },
            seeWord(item) {
                this.fieldDown.title = "下载查看";
                this.fieldDown.dialogVisible = true;
                this.fieldDown.id = item.id;
                //window.location.href = process.env.VUE_APP_BASE_API + "/common/download/resource?resource=" + item.fileUrl;
            },
            //模版类型
            getFormatType(row, column) {
                return this.selectDictLabel(this.formatTypes, row.formatType);
            },
            getTemplateTypes(row, column) {
                return this.selectDictLabel(this.templateTypes, row.templateType);
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

</style>
