<template>
    <div>
        <Dialog :title="title" :show.sync="dialogVisible" :height="400" width="40%" @openDialog="openDialog">
            <template v-slot:default>
                <el-form ref="form" class="custom-display" :model="form" :rules="rules" label-width="120px">
                    <el-form-item label="IP地址：" prop="ipAddress">
                        <el-input v-model="form.ipAddress" placeholder="请输入IP地址">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="调解员：" prop="employeeId">
                        <el-select clearable filterable size="small" v-model="form.employeeId" placeholder="请选择">
                            <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                                :value="item.userId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" v-debounce @click="submitForm" :loading="buttonLoading">确定</el-button>
            </div>
        </Dialog>
    </div>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import shortLinkApi from "@/api/case/shortLink/shortLink";
    import divisionApi from "@/api/case/division/index";
    import {
        initObj
    } from '@/utils/common'
    export default {
        name: "addTemplate",
        components: {
            Dialog
        },
        data() {
            return {
                form: {
                    ipAddress: "",
                    employeeId: ""
                },
                userList: [],
                rules: {
                    ipAddress: [{
                        required: true,
                        message: "请输入IP地址",
                        trigger: "blur"
                    }, ],
                    ipAddress: [{
                        required: true,
                        message: "请请选择调解员",
                        trigger: "change"
                    }, ],
                },
                sigForm: {
                    chooseSignature: [],
                },
                buttonLoading:false
            };
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
            },
            getList: {
                type: Function,
                default: null,
            },
            editList: {
                type: Object,
                default: {},
            },
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
        mounted() {},
        methods: {
            refresh() {
                this.openDialog();
            },
            openDialog() {
                initObj(this.form)
                this.resetAddForm();
                this.getUsers();
                this.buttonLoading = false;
                //编辑查详情
                if (this.id) {
                    this.form = {
                        ipAddress: this.editList.ipAddress,
                        employeeId: this.editList.employeeId,
                        id: this.id
                    }
                } else {
                    this.form = {
                        ipAddress: "",
                        employeeId: ""
                    };
                }
            },
            submitForm() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        if (this.id) {
                            shortLinkApi.combinateEdit(this.form).then((response) => {
                                this.msgSuccess("修改成功");
                                this.dialogVisible = false;
                                this.buttonLoading = false;
                                this.getList();
                            }).catch((error) => {
                                this.buttonLoading = false;
                            });
                        } else {
                            shortLinkApi.combinateAdd(this.form).then((response) => {
                                this.msgSuccess("新增成功");
                                this.dialogVisible = false;
                                this.buttonLoading = false;
                                this.getList();
                            }).catch((error) => {
                                this.buttonLoading = false;
                            });
                        }
                    }
                });
            },
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs["form"].resetFields();
                } catch (e) {}
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

<style scoped>
    .el-dialog__body {
        height: 20px;
    }

</style>
<style lang="scss">
    .add-template {
        .sig-style {
            width: 100%;
        }

        .custom-display {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .el-form-item {
                width: 48%;
                /*.el-form-item__label{*/
                /*text-align: left;*/
                /*}*/
            }
        }

        .more_little {
            position: absolute;
            right: 36%;
            bottom: 30px;
            font-size: 30px;
            color: #409eff;
        }

        .font-big i {
            font-size: 30px;
            margin-right: 20px;
            color: #409eff;
        }
    }

    .add-template {
        >p {
            padding: 0px 0 10px 16px;
            color: #409eff;
            font-size: 16px;
            position: relative;
            font-weight: bold;
        }

        >p::before {
            position: absolute;
            top: 4px;
            left: 0;
            content: "";
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: #409eff;
        }

        .el-upload__tip {
            line-height: 16px;
        }
    }

    .move-left {
        .el-form-item__content {
            margin-left: 0 !important;
        }
    }

    .border-style-custom {
        border: 1px solid #e6ebf5;
        padding: 10px;
        min-height: 190px;
        border-top: none;
        border-radius: 4px;

        .el-tree-node.is-current>.el-tree-node__content {
            color: #409eff;
            background-color: transparent;
            border-radius: 4px;
        }

        .el-tree-node>.el-tree-node__content:hover {
            background-color: transparent;
        }

        .el-tree-node.is-current>.el-tree-node__content:after {
            content: "\e6da";
            font-family: element-icons !important;
            padding-left: 10px;
            font-weight: bolder;
        }

        .el-tree-node>.el-tree-node__children {
            overflow: unset;
        }
    }

    .book-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #409eff;
    }

    .drag-box {
        border: 1px solid #e6ebf5;
        margin: 10px 0;
        padding: 10px;
        min-height: 50px;

        li {
            list-style: none;
            height: 30px;
            border-bottom: 1px solid #f3eeee;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;

            p:first-of-type {
                width: 50%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        li:last-of-type {
            border-bottom: none;
        }
    }

    /*.file-header{*/
    /*display: flex;*/
    /*justify-content: space-between;*/
    /*>p{*/
    /*display: flex;*/
    /*align-items: center;*/
    /*}*/
    /*.el-button{*/
    /*margin-right: 10px;*/
    /*}*/
    /*}*/
    .font-number {
        position: absolute;
        bottom: -20px;
        right: 2px;
        color: #999999;
    }

</style>
