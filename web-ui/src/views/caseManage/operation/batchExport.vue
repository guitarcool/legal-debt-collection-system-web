<template>
    <div>
        <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
            <template v-slot:default>
                <!-- 查看字段表 -->
                <div class="see-field" v-loading="loading">
                    <div class="margin-div">
                        <p class="book-title">1、发送时间：</p>
                        <el-select v-model="setvalue" filterable placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-date-picker :picker-options="pickerOptions" v-if="setvalue == 2" v-model="signatureDate"
                            type="datetime" style="margin-left:10px" value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div class="margin-div">
                        <p class="book-title">2、发送渠道：</p>
                        <el-select v-model="providerType" filterable placeholder="请选择">
                            <el-option v-for="item in shortmsgProviderType" :key="item.dictValue"
                                :label="item.dictLabel" :value="item.dictValue">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">发 送</el-button>
            </div>
        </Dialog>
    </div>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
    export default {
        name: "exportDialog",
        components: {
            Dialog
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
            params: {
                type: String,
                default: ''
            },
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
        },
        data() {
            return {
                pickerOptions: {
                    disabledDate(date) {
                        let zero = new Date().setHours(0, 0, 0, 0);
                        if (date.getTime() < zero) {
                            return true;
                        }
                        return false;
                    }
                },
                options: [{
                        value: '1',
                        label: '立即发送'
                    },
                    {
                        value: '2',
                        label: '定时发送'
                    }
                ],
                setvalue: null,
                signatureDate: null,
                loading: false,
                providerType: "",
                shortmsgProviderType: []
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
        created() {
            //短信渠道类型
            this.getDicts("shortmsg_provider_type").then((response) => {
                this.shortmsgProviderType = response.data;
            });
        },
        mounted() {},
        methods: {
            openDialog() {
                this.loading = false;
                this.setvalue = null;
                this.signatureDate = null;
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            // 提交
            submit() {
                if (!this.setvalue) {
                    this.msgError("请选择发送时间");
                    return;
                }
                if (!this.providerType) {
                    this.msgError("请选择发送渠道");
                    return;
                }
                if (!this.signatureDate && this.setvalue == 2) {
                    this.msgError("请选择定时发送的时间");
                    return;
                }
                this.loading = true;
                let param = {
                    ids: this.params,
                    providerType: this.providerType,
                    sendTime: this.signatureDate ? this.signatureDate : '',
                }
                cuttingAfterApi.sendSmsBatchResend(param).then((res) => {
                        if (res.code == 500) {
                            this.loading = false;
                            this.msgError(res.msg);
                        } else {
                            this.dialogVisible = false;
                            this.loading = false;
                            this.msgSuccess(res.msg);
                            this.$emit('refresh');
                        }
                    })
                    .catch((error) => {
                        this.loading = false;
                    });
            },
        },
    };

</script>

<style scoped lang="scss">
    .el-dialog__body {
        height: 20px;
    }

</style>
<style lang="scss">
    .border-style {
        border: 1px solid #e6ebf5;
        padding: 10px;
        min-height: 250px;
        border-top: none;
        border-radius: 4px;

        //margin-bottom: 10px;
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

    .margin-div {
        margin-bottom: 20px;
    }

    .book-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #409eff;
    }

    .import-content {
        >p {
            margin: 5px 0;
            position: relative;
            padding-left: 20px;
            line-height: 20px;
        }

        >p::before {
            position: absolute;
            top: 6px;
            left: 0;
            content: "";
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: red;
        }

        .el-upload__tip {}

        .import-div {
            display: flex;
            align-items: center;
        }
    }

</style>
