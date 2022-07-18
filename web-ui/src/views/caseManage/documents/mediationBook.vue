<template>
    <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <!-- 查看字段表 -->
            <div v-if="title == '全选生成多人多案文书'||title == '全选生成调解文书'"
                style="padding:10px 0;color:red;font-size:16px;line-height:24px">注意：本次共操作{{total}}条数据，请确认搜索条件无误后操作!
            </div>
            <div class="see-field" v-loading="loading">
                <div class="margin-div">
                    <p class="book-title">1、选择文书模版：</p>
                    <el-input clearable placeholder="输入关键字进行过滤" v-model="filterText">
                    </el-input>
                    <el-scrollbar style="height:250px;">
                        <el-tree :data="caseList" :props="defaultProps" node-key="id" :expand-on-click-node="true"
                            :check-strictly="true" :filter-node-method="filterNode" ref="tree" @check="handleCheckClick" show-checkbox
                            default-expand-all />
                    </el-scrollbar>
                </div>
                <div class="margin-div">
                    <p class="book-title">2、电子签章设置：</p>
                    <p>系统将根据下面的顺序按顺序打印</p>
                    <ul class="drag-box" ref="parentNode">
                        <p v-if="chooseData.length == 0" style="line-height: 50px; text-align: center">
                            暂无数据
                        </p>
                        <draggable v-model="chooseData" v-else>
                            <transition-group>
                                <li v-for="item in chooseData" :key="item.id" class="item">
                                    <p>{{ item.name }}</p>
                                    <div>
                                        <el-switch v-model="item.switch" active-color="#13ce66"
                                            inactive-color="#ff4949"></el-switch>
                                    </div>
                                </li>
                            </transition-group>
                        </draggable>
                    </ul>
                </div>
                <div class="margin-div">
                    <p class="book-title">3、申请日期：</p>
                    <el-date-picker v-model="applyDate" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <div class="margin-div" v-if="title =='批量生成多人多案文书'||title == '全选生成多人多案文书'">
                    <p class="book-title">4、每份文书的合并案件数量：</p>
                    <el-input v-model="caseNumOnePaper" style="width:220px" placeholder="请输入数量,不超过100个"></el-input>
                </div>
                <div class="margin-div">
                    <p class="book-title" v-if="title =='批量生成调解文书'||title == '全选生成调解文书'">4、导出文档格式：</p>
                    <p class="book-title" v-else>5、导出文档格式：</p>
                    <el-radio-group v-model="suffix">
                        <el-radio :label="1">.docx</el-radio>
                        <el-radio :label="2">.pdf</el-radio>
                        <el-radio :label="3">.xlsx</el-radio>
                    </el-radio-group>
                </div>
                <div class="margin-div" v-show="title =='批量生成多人多案文书'||title == '全选生成多人多案文书'">
                    <p class="book-title">6、自定义案件顺序：</p>
                    <div class="demo">
                        <el-table max-height="550" :data="selection" border row-key="id" align="left">
                            <el-table-column ref="tableColumn" v-for="(item, index) in col" :key="`col_${index}`"
                                :prop="dropCol[index].prop" :label="item.label">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="margin-div">
                    <p class="book-title" v-if="title =='批量生成调解文书'||title == '全选生成调解文书'">5、异常值提示：</p>
                    <p class="book-title" v-else>7、异常值提示：</p>
                    <el-button type="primary" :loading="tipsLoading" @click="getOutliersTips">异常值查询</el-button>
                    <div class="demo" style="margin-top:10px">
                        <el-table max-height="550" :data="tipsList" border align="left">
                            <el-table-column label="异常值提示" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    {{scope.row}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <el-button type="primary" v-debounce="submitTwo" v-if="title == '批量生成调解文书' || title == '全选生成调解文书'">确 定
            </el-button>
            <el-button type="primary" v-debounce="submit" v-else>确 定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import templateApi from "@/api/case/document/templateIndex";
    import divisionApi from "@/api/case/division/index";
    import draggable from 'vuedraggable'
    import Sortable from 'sortablejs'
    export default {
        name: "mediationBook",
        components: {
            Dialog,
            draggable
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
            params: {
                type: String | Array,
                default: [],
            },
            selection: {
                type: Array,
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
            selection(val) {
                this.ids = val.map((item) => item.id);
            }
        },
        data() {
            return {
                defaultProps: {
                    children: "children",
                    label: "name",
                },
                col: [{
                        label: '姓名',
                        prop: 'respondentName'
                    },
                    {
                        label: '订单号',
                        prop: 'id'
                    },
                    {
                        label: '合同号',
                        prop: 'orderNo'
                    }
                ],
                dropCol: [{
                        label: '姓名',
                        prop: 'respondentName'
                    },
                    {
                        label: '订单号',
                        prop: 'id'
                    },
                    {
                        label: '合同号',
                        prop: 'orderNo'
                    }
                ],
                filterText: "",
                caseList: [],
                chooseData: [],
                selectionData: [],
                draging: null, //被拖拽的对象
                target: null, //目标对象
                applyDate: "",
                suffix: 1,
                ids: [],
                caseNumOnePaper: "",
                templateIdArr: [],
                loading: false,
                needSignTemplate: [],
                tipsList: [],
                drawBodyWrapper: '',
                tipsLoading: false,
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
        mounted() {
            //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
            document.body.ondrop = function (event) {
                event.preventDefault();
                event.stopPropagation();
            };
        },
        methods: {
            openDialog() {
                this.loading = false;
                this.caseList = [];
                this.chooseData = [];
                this.needSignTemplate = [];
                this.tipsList = [];
                this.caseNumOnePaper = "";
                this.templateIdArr = [];
                this.applyDate = "";
                this.suffix = 1;
                this.tipsLoading = false;
                this.filterText = "";
                this.getList();
                this.$nextTick(() => {
                    const drawBodyWrapper = document.querySelector('.el-dialog__body tbody')
                    this.drawBodyWrapper = drawBodyWrapper;
                    this.rowDrop()
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            //行拖拽
            rowDrop() {
                const tbody = this.drawBodyWrapper
                const _this = this
                Sortable.create(tbody, {
                    onEnd({
                        newIndex,
                        oldIndex
                    }) {
                        const currRow = _this.selection.splice(oldIndex, 1)[0]
                        _this.selection.splice(newIndex, 0, currRow)
                    }
                })
            },
            // /批量生成调解文书，/全选生成调解文书提交上传文件
            submitTwo() {
                this.templateIdArr = this.chooseData.map((item) => item.id);
                this.needSignTemplate = this.chooseData.map((item) => item.switch ? item.switch : false);
                let param = {};
                //批量生成调解文书
                param.ids = this.params;
                if (this.templateIdArr.length <= 0) {
                    this.msgError("请选择模版");
                    return;
                }
                param.caseNumOnePaper = this.caseNumOnePaper;
                param.templateIdArr = this.templateIdArr.join(",");
                param.needSignTemplate = this.needSignTemplate.join(","),
                    param.applyDate = this.applyDate;
                param.suffix =
                    this.suffix == 1 ?
                    ".docx" :
                    this.suffix == 2 ?
                    ".pdf" :
                    ".xlsx";
                this.loading = true;
                if (this.title == '批量生成调解文书') {
                    if (param.ids.length > 200) {
                        this.msgError('勾选的数据量超出生成文书条数200上限，请重新勾选后再进行提交');
                        return;
                    }
                    divisionApi.instrumentlist(param).then((response) => {
                        if (response.code == 200) {
                            this.dialogVisible = false;
                            this.loading = false;
                            this.msgSuccess('文书生成任务已提交，请在文书下载模块中查看文书生成进度。');
                        } else {
                            this.loading = false;
                            this.msgError(response.msg);
                        }
                    }).catch((error) => {
                        this.needSignTemplate = [];
                        this.loading = false;
                    });
                } else if (this.title == '全选生成调解文书') {
                    if (this.total.length > 200) {
                        this.msgError('筛选的数据量超出生成文书条数200上限，请重新筛选后再进行提交');
                        return;
                    }
                    param.ids = [];
                    divisionApi.instrumentlistAll(param).then((response) => {
                        if (response.code == 200) {
                            this.dialogVisible = false;
                            this.loading = false;
                            this.msgSuccess('文书生成任务已提交，请在文书下载模块中查看文书生成进度。');
                        } else {
                            this.loading = false;
                            this.msgError(response.msg);
                        }
                    }).catch((error) => {
                        this.needSignTemplate = [];
                        this.loading = false;
                    });
                }
            },
            // 多人多案全选，多人多案批量提交上传文件
            submit() {
                this.templateIdArr = this.chooseData.map((item) => item.id);
                this.needSignTemplate = this.chooseData.map((item) => item.switch ? item.switch : false);
                let param = {};
                param.caseNumOnePaper = this.caseNumOnePaper;
                param.templateIdArr = this.templateIdArr.join(",");
                param.needSignTemplate = this.needSignTemplate.join(","),
                    param.applyDate = this.applyDate;
                param.suffix =
                    this.suffix == 1 ?
                    ".docx" :
                    this.suffix == 2 ?
                    ".pdf" :
                    ".xlsx";
                if (this.title == '批量生成多人多案文书') {
                    param.ids = this.ids;
                    if (this.caseNumOnePaper == '' || this.caseNumOnePaper > 100) {
                        this.msgError('请填写正确的合并数量')
                        return
                    }
                    if (this.templateIdArr.length <= 0) {
                        this.msgError("请选择模版");
                        return;
                    }
                    this.loading = true;
                    templateApi.mumcBatchInstrument(param).then((response) => {
                        this.dialogVisible = false;
                        this.loading = false;
                        this.msgSuccess(response.msg);
                        this.$emit('refresh')
                    }).catch((error) => {
                        this.loading = false;
                    })
                } else if (this.title == '全选生成多人多案文书') {
                    param.ids = [];
                    if (this.caseNumOnePaper == '' || this.caseNumOnePaper > 100) {
                        this.msgError('请填写正确的合并数量')
                        return
                    }
                    if (this.templateIdArr.length <= 0) {
                        this.msgError("请选择模版");
                        return;
                    }
                    this.loading = true;
                    templateApi.mumcBatchAllInstrument(param).then((response) => {
                        this.dialogVisible = false;
                        this.loading = false;
                        this.msgSuccess(response.msg);
                        this.$emit('refresh')
                    }).catch(() => {
                        this.loading = false;
                    })
                }
            },
            //多元调解模版 
            getList() {
                let data;
                if (this.title == '批量生成多人多案文书' || this.title == '全选生成多人多案文书') {
                    //多人多案模版  4
                    data = {
                        formatType: 4,
                        templateTypes: [],
                        status: 1,
                    };
                } else {
                    //多元调解模版 
                    data = {
                        formatType: 0,
                        templateTypes: [],
                        status: 1,
                    };
                }
                templateApi.templateListInfo(data).then((response) => {
                    this.caseList = response.data || [];
                });
            },
            getOutliersTips() {
                this.templateIdArr = this.chooseData.map((item) => item.id);
                this.needSignTemplate = this.chooseData.map((item) => item.switch ? item.switch : false);
                let param = {};
                if (this.title == '批量生成多人多案文书') {
                    param.ids = this.ids;
                    if (this.caseNumOnePaper == '' || this.caseNumOnePaper > 100) {
                        this.msgError('请填写正确的合并数量')
                        return
                    }
                    if (this.templateIdArr.length <= 0) {
                        this.msgError("请选择模版");
                        return;
                    }
                } else if (this.title == '全选生成多人多案文书') {
                    param.ids = [];
                    if (this.caseNumOnePaper == '' || this.caseNumOnePaper > 100) {
                        this.msgError('请填写正确的合并数量')
                        return
                    }
                    if (this.templateIdArr.length <= 0) {
                        this.msgError("请选择模版");
                        return;
                    }
                } else if (this.title == '批量生成调解文书') {
                    //批量生成调解文书
                    param.ids = this.params;
                    if (this.templateIdArr.length <= 0) {
                        this.msgError("请选择模版");
                        return;
                    }
                } else if (this.title == '全选生成调解文书') {
                    //批量生成调解文书
                    param.ids = [];
                    if (this.templateIdArr.length <= 0) {
                        this.msgError("请选择模版");
                        return;
                    }
                }
                this.tipsLoading = true;
                param.caseNumOnePaper = this.caseNumOnePaper;
                param.templateIdArr = this.templateIdArr.join(",");
                param.needSignTemplate = this.needSignTemplate.join(","),
                    param.applyDate = this.applyDate;
                param.suffix =
                    this.suffix == 1 ?
                    ".docx" :
                    this.suffix == 2 ?
                    ".pdf" :
                    ".xlsx";
                if (this.title == '全选生成多人多案文书' || this.title == '全选生成调解文书') {
                    templateApi.getOutliersTipsAll(param).then((response) => {
                        this.tipsLoading = false;
                        this.tipsList = response.data || [];
                    }).catch(() => {
                        this.tipsLoading = false;
                        this.tipsList = [];
                    })
                } else {
                    templateApi.getOutliersTips(param).then((response) => {
                        this.tipsLoading = false;
                        this.tipsList = response.data || [];
                    }).catch(() => {
                        this.tipsLoading = false;
                        this.tipsList = [];
                    })
                }
            },
            handleCheckClick() {
                this.chooseData = this.$refs.tree.getCheckedNodes();
            },
        },
    };

</script>

<style scoped lang="scss">
    .el-dialog__body {
        height: 20px;
    }

    // 父级不可选样式

    ::v-deep .el-tree {

        // 不可全选样式
        .el-tree-node {
            .is-leaf+.el-checkbox .el-checkbox__inner {
                display: inline-block;
            }

            .el-checkbox .el-checkbox__inner {
                display: none;
            }
        }
    }

</style>
<style lang="scss">
    .li-item {
        padding: 10px 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        border-top: 2px solid #f8f8f9;
        align-items: center;

        &:first-child {
            border: none;
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
