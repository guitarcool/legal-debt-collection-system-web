<template>
    <Dialog :title="title" :height="500" :show.sync="dialogVisible" width="60%" @openDialog="openDialog">
        <template v-slot:default>
            <div class="box-contnet-wrap">
                <el-row :gutter="10" class="mb8" style="display: flex;align-items: center;">
                    <el-col :span="1.5">
                        <el-button type="primary" icon="el-icon-share" size="mini" @click="handleAddTemplate">新增
                        </el-button>
                    </el-col>
                    <el-tooltip placement="top">
                        <div slot="content">
                            提示：加入员工IP后，该IP的点击不纳入链接查看统计
                        </div>
                        <i class="el-icon-info" style="font-size:20px;text-align:center"></i>
                    </el-tooltip>
                </el-row>

                <el-table v-loading="loading" :data="caseList">
                    <el-table-column label="IP地址" prop="ipAddress" :show-overflow-tooltip="true" width="150" />
                    <el-table-column label="操作" fixed="right" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" type="warning" @click="edit(scope.row)"
                                v-hasPermi="['template:info:edit']">编辑
                            </el-button>
                            <el-button size="mini" type="danger" @click="deleteToggle(scope.row)"
                                v-hasPermi="['template:info:switch']">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" @pagination="getList" />
                <addcombined :getList="getList" :title="addTemplateData.title"
                    :show.sync="addTemplateData.dialogVisible" :id="addTemplateData.id"
                    :editList="addTemplateData.editList"></addcombined>
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <!-- <el-button type="primary" @click="submit">确 定</el-button> -->
        </div>
    </Dialog>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import shortLinkApi from "@/api/case/shortLink/shortLink";
    import addcombined from "./addCombined.vue";
    import divisionApi from "@/api/case/division/index";
    export default {
        name: "combined",
        components: {
            Dialog,
            addcombined
        },
        props: {
            // 传参控制弹窗显示隐藏
            show: {
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: "",
            },
            id: {
                type: String,
                default: "",
            },
        },
        data() {
            return {
                // 遮罩层
                loading: false,
                caseList: [],
                userList: [],
                // 总条数
                total: 0,
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                },
                addTemplateData: {
                    title: "",
                    dialogVisible: false,
                    id: "",
                    editList: {}
                },
            };
        },
        computed: {
            dialogVisible: {
                get() {
                    return this.show;
                },
                set(val) {
                    this.$emit("update:show", val);
                },
            },
        },
        created() {},
        methods: {
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            openDialog() {
                this.getList();
                this.getUsers();
            },
            /** 查询角色列表 */
            getList() {
                this.loading = true;
                shortLinkApi.employList(this.queryParams).then((response) => {
                    //console.log(response)
                    this.caseList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                });
            },
            //删除
            deleteToggle(val) {
                var that = this;
                this.$confirm(`是否确认删除?`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        shortLinkApi.combinateStatus(val.id).then((res) => {
                            if (res.code === 200) {
                                that.msgSuccess(res.msg);
                                that.getList();
                            } else if (res.code === 500) {
                                that.msgError(res.msg);
                            }
                        });

                    })
                    .catch(() => {
                        that.msgError("已取消操作");
                    });
            },
            //编辑
            edit(row) {
                this.addTemplateData.title = "员工IP编辑";
                this.addTemplateData.dialogVisible = true;
                this.addTemplateData.editList = {
                    employeeId: row.employeeId,
                    ipAddress: row.ipAddress,
                };
                this.addTemplateData.id = JSON.stringify(row.id);
            },
            handleAddTemplate() {
                this.addTemplateData.title = "员工IP新增";
                this.addTemplateData.dialogVisible = true;
                this.addTemplateData.id = "";
                // this.addTemplateData.userList = this.userList;
            },
            //获取调解员
            getUsers() {
                divisionApi.userList().then((response) => {
                    this.userList = response.data.userList || [];
                });
            },
        },
    };

</script>

<style scoped lang="scss">
    .el-dialog__body {
        height: 20px;
    }

    .division-content {
        .radio-box {
            margin: 10px 0 14px;
        }

        >p {
            font-size: 12px;
            color: #1c84c6;
            margin-bottom: 22px;
        }

        .choise-box {
            display: flex;

            .el-radio,
            .el-checkbox {
                justify-content: space-between;
                margin: 0 10px 10px 0;
            }
        }

        .tree-box {
            border: 1px solid #e6ebf5;
            padding: 10px;
        }

        /*自定义横向滚动条*/
        ::-webkit-scrollbar {
            background-color: transparent;
        }
    }

</style>
<style lang="scss">
    .custom-width {
        .el-form-item__label {
            width: 170px !important;
            text-align: left;
        }

        .el-form-item__content {
            display: flex;
            align-items: center;
        }
    }

</style>
