<template>
    <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <!-- 查看字段表 -->
            <div v-if="title == '全选生成律师函'" style="padding:10px 0;color:red;font-size:16px;line-height:24px">
                注意：本次共操作{{total}}条数据，请确认搜索条件无误后操作!</div>
            <div class="see-field" v-loading="loading" :element-loading-text="`拼命加载中，${num}秒...`"
                element-loading-spinner="el-icon-loading">
                <div class="margin-div" customClass="loading-style">
                    <p class="book-title">1、选择律师函模版</p>
                    <el-scrollbar style="height: 250px">
                        <el-input clearable placeholder="输入关键字进行过滤" v-model="filterText">
                        </el-input>
                        <el-tree :data="caseList" class="border-style" :props="defaultProps" node-key="id"
                            :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree"
                            @node-click="handleNodeClick" default-expand-all />
                    </el-scrollbar>
                </div>
                <div class="margin-div">
                    <p class="book-title">2、电子签章设置：</p>
                    <ul class="drag-box" ref="parentNode">
                        <div v-if="formlist.length==0" style="line-height: 50px;text-align: center">暂无数据</div>
                        <li v-else v-for="(item,index) in formlist" :key="index" class="item">
                            <p>{{item.name}}</p>
                            <el-switch v-model="item.switch" active-color="#13ce66" inactive-color="#ff4949"
                                @change="switchChange(item)"></el-switch>
                        </li>
                    </ul>
                </div>
                <div class="margin-div" v-if="title == '批量生成律师函'|| title == '全选生成律师函'">
                    <p class="book-title">3、申请日期：</p>
                    <el-date-picker v-model="applyDate" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <div class="margin-div" v-if="title == '批量生成律师函'|| title == '全选生成律师函'">
                    <p class="book-title">4、导出文档格式：</p>
                    <el-radio-group v-model="suffix">
                        <el-radio :label="1">.docx</el-radio>
                        <el-radio :label="2">.pdf</el-radio>
                        <el-radio :label="3">.xlsx</el-radio>
                    </el-radio-group>
                </div>
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <el-button type="primary" v-debounce="submitTwo" v-if="title == '批量生成律师函' || title == '全选生成律师函'">确定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import templateApi from "@/api/case/document/templateIndex";
    import {
        interval
    } from "@/utils/ruoyi";
    import cuttingBeforeApi from "@/api/case/cuttingBefore/index";
    export default {
        name: "batchExportDialog",
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
            id: {
                type: String,
                default: "",
            },
            requestApi: {
                type: String,
                default: "",
            },
            params: {
                type: String | Array,
                default: [],
            },
            total: {
                type: String | Number,
                default: '--'
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
        },
        data() {
            return {
                defaultProps: {
                    children: "children",
                    label: "name",
                },
                filterText: "",
                caseList: [],
                templateId: "",
                applyDate: "",
                suffix: 1,
                loading: false,
                num: 0,
                formlist: [],
                needSignTemplate: null,
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
        mounted() {},
        methods: {
            openDialog() {
                this.loading = false;
                this.caseList = [];
                this.templateId = "";
                this.applyDate = "";
                this.suffix = 1;
                this.filterText = "";
                this.getList();
            },
            timekeeping() {
                this.num = 0;
                interval(1000, (id, resolve) => {
                    //console.log(id);
                    this.num++;
                    if (this.loading == false) {
                        clearInterval(id);
                        resolve("计时结束");
                    }
                }).then((res) => {
                    console.log(res);
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            //多元调解模版 0
            //诉讼模版    1
            //律师函模版  2
            //债转模版   3
            getList() {
                let data = {
                    formatType: 0,
                    templateType: 2,
                    status: 1,
                };
                templateApi.templateListInfo(data).then((response) => {
                    this.caseList = response.data || [];
                });
            },
            handleNodeClick(data) {
                //console.log(data)
                this.formlist = [];
                if (!data.id) {
                    this.$refs.tree.setCurrentKey(null);
                    this.templateId = "";
                } else {
                    this.templateId = data.id;
                    let formData = {
                        switch: false,
                        name: data.name,
                        id: data.id,
                    }
                    this.formlist.push(formData);
                }
            },
            switchChange(item) {
                this.needSignTemplate = null;
                if (item.switch == true) {
                    this.needSignTemplate = item.id;
                }
            },
            // 提交
            submitTwo() {
                if (!this.templateId) {
                    this.msgError("请选择模版");
                    return;
                }
                this.loading = true;
                this.timekeeping();
                let param = {};
                param.ids = this.params;
                param.templateId = this.templateId;
                param.needSignTemplate = this.needSignTemplate;
                param.applyDate = this.applyDate;
                param.suffix = this.suffix == 1 ? ".docx" : (this.suffix == 2 ? ".pdf" : ".xlsx");
                if (this.title == '批量生成律师函') {
                    if (param.ids.length > 200) {
                        this.msgError('勾选的数据量超出生成律师函条数200上限，请重新勾选后再进行提交');
                        return;
                    }
                    cuttingBeforeApi.instrumentBatch(param).then((response) => {
                        if (response.code == 200) {
                            this.dialogVisible = false;
                            this.loading = false;
                            this.msgSuccess('生成律师函任务已提交，请在律师函下载模块中查看律师函生成进度。');
                        } else {
                            this.loading = false;
                            this.msgError(response.msg);
                        }
                    }).catch((error) => {
                        this.loading = false;
                    });
                } else if (this.title == '全选生成律师函') {
                    if (this.total.length > 200) {
                        this.msgError('筛选的数据量超出生成律师函条数200上限，请重新筛选后再进行提交');
                        return;
                    }
                    param.ids = [];
                    cuttingBeforeApi.instrumentBatchAll(param).then((response) => {
                        if (response.code == 200) {
                            this.dialogVisible = false;
                            this.loading = false;
                            this.msgSuccess('生成律师函任务已提交，请在律师函下载模块中查看律师函生成进度。');
                        } else {
                            this.loading = false;
                            this.msgError(response.msg);
                        }
                    }).catch((error) => {
                        this.loading = false;
                    });
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
    .loading-style {
        font-size: 30px;
    }

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
        }

        li:last-of-type {
            border-bottom: none;
        }
    }

</style>
