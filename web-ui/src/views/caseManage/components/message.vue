<template>
    <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <!-- 查看字段表 -->
            <div class="see-field" v-loading="loading">
                <div class="margin-div">
                    <div v-if="title == '全选生成通知邮件'" style="padding:10px 0;color:red;font-size:16px;line-height:24px">
                        注意：本次共操作{{total}}条数据，请确认搜索条件无误后操作!</div>
                    <p class="book-title">{{type==1?'1、选择邮件模版':'1、选择短信模版'}}</p>
                    <el-scrollbar style="height: 250px">
                        <el-input clearable placeholder="输入关键字进行过滤" v-model="filterText">
                        </el-input>
                        <el-tree :data="caseList" class="border-style" :props="defaultProps" node-key="id"
                            :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree"
                            @node-click="handleNodeClick" default-expand-all />
                    </el-scrollbar>

                </div>
                <div class="margin-div">
                    <p class="book-title">2、签章日期</p>
                    <el-date-picker v-model="signatureDate" type="datetime" placeholder="选择日期"
                        format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss">
                    </el-date-picker>
                </div>
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import {
        getToken
    } from "@/utils/auth";
    import templateApi from "@/api/case/document/templateIndex";

    export default {
        name: "message",
        components: {
            Dialog
        },
        props: {
            // 传参控制弹窗显示隐藏
            show: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            type: {
                type: Number,
                default: 0
            },
            requestApi: {
                type: String,
                default: ''
            },
            params: { //就是选择的ids
                type: String,
                default: ''
            },
            total: {
                type: String,
                default: '--'
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        data() {
            return {
                defaultProps: {
                    children: "children",
                    label: "name",
                },
                filterText: '',
                caseList: [],
                signatureDate: '',
                templateId: '',
                loading: false
            }
        },
        computed: {
            dialogVisible: {
                get() {
                    return this.show
                },
                set(val) {
                    this.$emit('update:show', val)
                }
            }
        },
        created() {

        },
        mounted() {

        },
        methods: {
            openDialog() {
                this.loading = false
                this.filterText = "";
                this.signatureDate = "";
                this.templateId = "";
                this.caseList = []
                this.getList()
            },
            // 提交
            submit() {
                if (!this.templateId) {
                    this.msgError('请选择模版')
                    return
                }
                let param = {};
                param.ids = [];
                param.type = this.type;
                param.templateId = this.templateId
                param.signatureDate = this.signatureDate
                this.loading = true
                templateApi.common(this.requestApi, param).then(res => {
                    //console.log(1,res)
                    this.download(res.msg);
                    this.dialogVisible = false
                    this.loading = false
                    this.$emit('refresh');
                }).catch(err => {
                    this.loading = false
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            getList() {
                let data = {};
                if (this.type == 1) {
                    data = {
                        formatType: 2,
                        templateTypes: [],
                        status: 1,
                    };
                } else {
                    data = {
                        formatType: 1,
                        templateTypes: [],
                        status: 1,
                    };
                }
                templateApi.templateListInfo(data).then((response) => {
                    this.caseList = response.data || [];
                });
            },
            handleNodeClick(data) {
                //console.log(data)
                if (!data.id) {
                    this.$refs.tree.setCurrentKey(null)
                    this.templateId = ''
                } else {
                    this.templateId = data.id
                }
            },

        }
    }

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
        color: #409EFF;
    }

</style>
