<template>
    <div>
        <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
            <template v-slot:default>
                <!-- 查看字段表 -->
                <div class="see-field" v-loading="loading">
                    <div v-show="active ==1">
                        <div class="margin-div">
                            <p class="book-title">1、选择短信模版：</p>
                            <el-scrollbar style="height: 250px">
                                <el-input clearable placeholder="请输入查找短信模版" v-model="filterText">
                                </el-input>
                                <el-tree :data="data" class="border-style" :props="defaultProps" node-key="id"
                                    :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree"
                                    @node-click="handleNodeClick" default-expand-all />
                            </el-scrollbar>
                        </div>
                        <div class="margin-div">
                            <p class="book-title">2、申请日期：</p>
                            <el-date-picker v-model="applyTime" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </div>
                    </div>

                    <div v-show="active ==2">
                        <div class="margin-div">
                            <p class="book-title">3、发送内容：</p>
                            <el-input type="textarea" disabled :rows="4" placeholder="短信内容" v-model="textarea">
                            </el-input>
                        </div>
                        <div class="margin-div">
                            <p class="book-title">4、发送时间：</p>
                            <el-select v-model="setvalue" filterable placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-date-picker :picker-options="pickerOptions" v-if="setvalue == 2" v-model="signatureDate"
                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="margin-left:10px"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                        <div class="margin-div">
                            <p class="book-title">5、发送渠道：</p>
                            <el-select v-model="providerType" filterable placeholder="请选择">
                                <el-option v-for="item in shortmsgProviderType" :key="item.dictValue"
                                    :label="item.dictLabel" :value="item.dictValue">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" v-if="active ==1">取 消</el-button>
                <el-button type="primary" @click="nextActive" v-if="active ==1">下一步</el-button>
                <el-button @click="upperActive" v-if="active ==2">上一步</el-button>
                <el-button type="primary" @click="submit" v-if="active ==2">发 送</el-button>
            </div>
        </Dialog>
        <el-dialog title="提示" :visible.sync="visible" width="30%" :before-close="handleClose">
            <span>该号码当前标记为“停机、失联、空号”，是否要继续发送？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="visibleSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import templateApi from "@/api/case/document/templateIndex";
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
            red: {
                type: Boolean,
                default: false,
            },
            name: {
                type: String,
                default: "",
            },
            phone: {
                type: String,
                default: "",
            },
            id: {
                type: Number,
                default: 999,
            },
            caseId: {
                type: String,
                default: "",
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
                providerType: "",
                shortmsgProviderType: [],
                options: [{
                        value: '1',
                        label: '立即发送'
                    },
                    {
                        value: '2',
                        label: '定时发送'
                    }
                ],
                defaultProps: {
                    children: "children",
                    label: "name",
                },
                filterText: "",
                caseList: [],
                data: [{
                        name: "多元调解模版",
                        children: [],
                    },
                    {
                        name: "诉讼模版",
                        children: [],
                    },
                    {
                        name: "律师函模版",
                        children: [],
                    },
                ],
                templateId: "",
                applyTime: null,
                setvalue: null,
                textarea: "",
                signatureDate: null,
                loading: false,
                visible: false,
                active: 1,
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
                this.templateId = "";
                this.applyTime = null;
                this.filterText = "";
                this.setvalue = null;
                this.active = 1;
                this.textarea = "";
                this.signatureDate = null;
                this.data[0].children = [];
                this.data[1].children = [];
                this.data[2].children = [];
                this.getList();
            },
            nextActive() {
                if (!this.templateId) {
                    this.msgError("请选择模版");
                    return;
                }
                templateApi.info(this.templateId).then(
                    response => {
                        let param = {
                            content: response.data.content,
                            applyTime: this.applyTime,
                            cid: this.caseId,
                        }
                        cuttingAfterApi.turnContent(param).then(
                            response => {
                                this.textarea = response.data;
                                this.active = 2;
                            });
                    }
                );
            },
            upperActive() {
                this.active = 1;
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            //获取当前时间
            timestampToTime() {
                let yy = new Date().getFullYear();
                let mm = new Date().getMonth() + 1;
                let dd = new Date().getDate();
                let hh = new Date().getHours();
                let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
                let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
                return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
            },
            //确定提交
            visibleSubmit() {
                if (!this.templateId) {
                    this.msgError("请选择模版");
                    return;
                }
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
                this.visible = false;
                this.loading = true;
                // let time = this.timestampToTime();
                let param = {
                    content: this.textarea,
                    name: this.name,
                    phone: this.phone,
                    rid: this.id,
                    providerType: this.providerType,
                    applyTime: this.applyTime,
                    cid: this.caseId,
                    sendTime: this.signatureDate ? this.signatureDate : '',
                }
                cuttingAfterApi.shortMsg(param).then((res) => {
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
            // 提交
            submit() {
                if (!this.templateId) {
                    this.msgError("请选择模版");
                    return;
                }
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
                if (this.red) {
                    this.visible = true;
                } else {
                    this.loading = true;
                    // let time = this.timestampToTime();
                    let param = {
                        content: this.textarea,
                        name: this.name,
                        phone: this.phone,
                        rid: this.id,
                        providerType: this.providerType,
                        applyTime: this.applyTime,
                        cid: this.caseId,
                        sendTime: this.signatureDate ? this.signatureDate : '',
                    }
                    cuttingAfterApi.shortMsg(param).then((res) => {
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
                }
            },
            getTime(time) {
                var date = new Date(time)
                var y = date.getFullYear()
                var m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
                var d = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
                return y + '-' + m + '-' + d
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            //获取短信模版
            getList() {
                let param = {
                    name: "",
                    templateType: "",
                    status: "",
                };
                templateApi.templateList(param).then(
                    response => {
                        //console.log(response)
                        this.caseList = response.data || [];
                        this.caseList.forEach(item => {
                            //短信模版
                            if (item.formatType == 1 && item.status == 1) {
                                if (item.templateType == 0) {
                                    this.data[0].children.push(item)
                                }
                                if (item.templateType == 1) {
                                    this.data[1].children.push(item)
                                }
                                if (item.templateType == 2) {
                                    this.data[2].children.push(item)
                                }
                            }
                        })
                    }
                );
            },
            handleNodeClick(data) {
                //console.log(data)
                if (!data.id) {
                    this.$refs.tree.setCurrentKey(null);
                    this.templateId = "";
                } else {
                    this.templateId = data.id;
                }
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

</style>
