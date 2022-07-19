<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true" label-width="68px">
            <el-form-item label="租户ID" prop="tenantId">
                <el-input v-model="queryParams.tenantId" placeholder="请输入租户ID" clearable size="small"
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="租户名称" prop="tenantName">
                <el-input v-model="queryParams.tenantName" placeholder="请输入租户名称" clearable size="small"
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="联系人" prop="contactPerson">
                <el-input v-model="queryParams.contactPerson" placeholder="请输入联系人" clearable size="small"
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <div class="box-contnet-wrap">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple"
                        @click="handleDelete">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button :disabled="multiple" icon="el-icon-s-tools" size="mini" @click="handleAuthorization">授权配置
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" border :data="roleList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" fixed align="center" />
                <el-table-column label="租户ID" prop="tenantId" width="150" />
                <el-table-column label="租户名称" prop="tenantName" />
                <el-table-column label="联系人" prop="contactPerson" />
                <el-table-column label="联系电话" prop="phone" width="120" />
                <el-table-column label="账号额度" prop="amount" width="100" />
                <el-table-column label="过期时间" prop="expiredTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.expiredTime, "{y}-{m}-{d}") }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="绑定域名" prop="domain" :show-overflow-tooltip="true" width="100" />
                <el-table-column label="操作" fixed="right" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleWatch(scope.row)"
                            v-hasPermi="['system:tenant:edit']">查看</el-button>
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                            v-hasPermi="['system:tenant:edit']">编辑</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                            v-hasPermi="['system:tenant:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>

        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="租户名称:" prop="tenantName">
                    <el-input v-model="form.tenantName" placeholder="请输入租户名称" />
                </el-form-item>
                <el-form-item label="联系人:" prop="contactPerson">
                    <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
                </el-form-item>
                <el-form-item label="联系电话:">
                    <el-input v-model="form.phone" placeholder="请输入联系电话" />
                </el-form-item>
                <el-form-item label="联系地址:">
                    <el-input v-model="form.address" type="textarea" placeholder="请输入联系地址"></el-input>
                </el-form-item>
                <el-form-item label="绑定域名:">
                    <el-input v-model="form.domain" placeholder="请输入域名" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-debounce @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 租户授权配置对话框 -->
        <el-dialog title="租户授权配置" :visible.sync="authorizationOpen" width="400px" append-to-body>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="账号额度:">
                    <el-input style="width: 220px" v-model="form.amount" />
                </el-form-item>
                <el-form-item label="过期时间:">
                    <el-date-picker v-model="form.expiredTime" type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                        placeholder="选择过期时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-debounce @click="authorizationSubmit">确 定</el-button>
                <el-button @click="authorizationCancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 查看对话框 -->
        <el-dialog title="查看" :visible.sync="watchOpen" width="600px" append-to-body>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="租户ID:">{{ form.tenantId }}</el-form-item>
                <el-form-item label="租户名称:">{{ form.tenantName }}</el-form-item>
                <el-form-item label="联系人:">{{ form.contactPerson }}</el-form-item>
                <el-form-item label="联系电话:">{{ form.phone }}</el-form-item>
                <el-form-item label="联系地址:">{{ form.address }}</el-form-item>
                <el-form-item label="账户额度:">{{ form.amount }}</el-form-item>
                <el-form-item label="过期时间:">{{ form.expiredTime }}</el-form-item>
                <el-form-item label="绑定域名:">{{ form.domain }}</el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {
        infoTenant,
        delTenant,
        addTenant,
        updateTenant,
        listTenant,
    } from "@/api/system/tenant";

    export default {
        name: "Tenant",
        data() {
            return {
                // 遮罩层
                loading: true,
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
                roleList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                //查看
                watchOpen: false,
                // 是否显示弹出层
                authorizationOpen: false,
                // 日期范围
                expiredTime: [],
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                    tenantId: "",
                    tenantName: "",
                    contactPerson: "",
                },
                // 表单参数
                form: {},
                // 权限表单参数
                form: {},
                // 表单校验
                rules: {
                    tenantName: [{
                        required: true,
                        message: "租户名称不能为空",
                        trigger: "blur"
                    }, ],
                    contactPerson: [{
                        required: true,
                        message: "联系人不能为空",
                        trigger: "blur"
                    }, ],
                },
                defaultProps: {
                    children: "children",
                    label: "label",
                },
            };
        },
        created() {
            this.getList();
        },
        methods: {
            /** 查询角色列表 */
            getList() {
                this.loading = false;
                listTenant(this.queryParams).then((response) => {
                    this.roleList = response.data.rows;
                    this.total = response.data.total;
                    this.loading = false;
                });
            },
            // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },
            // 表单重置
            reset() {
                this.form = {
                    tenantId: undefined,
                    tenantName: "",
                    contactPerson: undefined,
                    phone: undefined,
                    address: undefined,
                    domain: undefined,
                };
                this.resetForm("form");
            },
            /** 权限配置按钮操作 */
            handleAuthorization() {
                const tenantIds = this.ids;
                infoTenant(tenantIds).then((response) => {
                    this.form = response.data;
                });
                this.authorizationOpen = true;
            },
            /** 权限配置按钮操作 */
            handleWatch(row) {
                infoTenant(row.tenantId).then((response) => {
                    this.form = response.data;
                });
                this.watchOpen = true;
            },
            // 取消按钮
            authorizationCancel() {
                this.authorizationOpen = false;
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.resetForm("queryForm");
                this.handleQuery();
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map((item) => item.tenantId);
                this.single = selection.length != 1;
                this.multiple = !selection.length;
            },
            /** 新增按钮操作 */
            handleAdd() {
                this.reset();
                this.open = true;
                this.title = "添加租户";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                infoTenant(row.tenantId).then((response) => {
                    this.form = response.data;
                });
                this.open = true;
                this.title = "修改租户";
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        if (this.form.tenantId != undefined) {
                            updateTenant(this.form).then((response) => {
                                this.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            });
                        } else {
                            addTenant(this.form).then((response) => {
                                this.msgSuccess("新增成功");
                                this.open = false;
                                this.getList();
                            });
                        }
                    }
                });
            },
            authorizationSubmit() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        if (this.form.amount) {
                            updateTenant(this.form).then((response) => {
                                this.msgSuccess("修改成功");
                                this.authorizationOpen = false;
                                this.getList();
                            });
                        } else {
                            addTenant(this.form).then((response) => {
                                this.msgSuccess("新增成功");
                                this.authorizationOpen = false;
                                this.getList();
                            });
                        }
                    }
                });
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const tenantIds = row.tenantId || this.ids;
                this.$confirm("确定将选择数据删除?", "警告", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(function () {
                        return delTenant(tenantIds);
                    })
                    .then(() => {
                        this.getList();
                        this.msgSuccess("删除成功");
                    });
            },
        },
    };

</script>
