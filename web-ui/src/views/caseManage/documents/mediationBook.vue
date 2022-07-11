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
                    <el-scrollbar style="height:250px;" v-if="title =='批量生成多人多案文书'||title == '全选生成多人多案文书'" >
                        <el-tree :data="caseListTwo" class="border-style" :props="defaultProps" node-key="id"
                            :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree"
                            @node-click="handleNodeClick" default-expand-all />
                    </el-scrollbar>
                    <el-scrollbar style="height:250px;" v-else >
                        <el-tree :data="caseList" class="border-style" :props="defaultProps" node-key="id"
                            :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree"
                            @node-click="handleNodeClick" default-expand-all />
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
                                <li v-for="(item, index) in chooseData" :key="item.id" class="item">
                                    <p>{{ item.name }}</p>
                                    <div>
                                        <el-switch v-model="item.switch" active-color="#13ce66" inactive-color="#ff4949"
                                            style="margin-right: 20px"></el-switch>
                                        <i class="el-icon-delete" @click="deleteData(index)"></i>
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
                        <el-table :data="selection" border row-key="id" align="left">
                            <el-table-column ref="tableColumn" v-for="(item, index) in col" :key="`col_${index}`"
                                :prop="dropCol[index].prop" :label="item.label">
                            </el-table-column>
                        </el-table>
                    </div>

                </div>
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <el-button type="primary" @click="submitTwo" v-if="title == '批量生成调解文书' || title == '全选生成调解文书'">确 定
            </el-button>
            <el-button type="primary" @click="submit" v-else>确 定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import axios from "axios";
    import {
        getToken
    } from "@/utils/auth";
    import templateApi from "@/api/case/document/templateIndex";
    import divisionApi from "@/api/case/division/index";
    import draggable from 'vuedraggable'
    import Sortable from 'sortablejs'
    const mimeMap = {
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        zip: "application/zip",
    };
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
            requestApi: {
                type: String,
                default: "",
            },
            params: {
                type: Array,
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
                caseListTwo: [],
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
                drawBodyWrapper: '',
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
                this.caseListTwo = [];
                this.chooseData = [];
                this.needSignTemplate = [];
                this.caseNumOnePaper = "";
                this.templateIdArr = [];
                this.applyDate = "";
                this.suffix = 1;
                this.filterText = "";
                if(this.title =='批量生成多人多案文书'||this.title == '全选生成多人多案文书'){
                    this.getListTwo();
                }else{
                    this.getList();
                }
                this.$nextTick(() => {
                    const drawBodyWrapper = document.querySelector('.el-dialog__body tbody')
                    this.drawBodyWrapper = drawBodyWrapper;
                    this.rowDrop()
                })
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
            // 提交上传文件
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
            // 提交上传文件
            submit() {
                this.templateIdArr = this.chooseData.map((item) => item.id);
                this.needSignTemplate = this.chooseData.map((item) => item.switch ? item.switch : false);
                let param = {};
                //单个生成调解文书
                if (this.id) {
                    if (this.templateIdArr.length <= 0) {
                        this.msgError("请选择模版");
                        return;
                    }
                    param = {
                        templateIdArr: this.templateIdArr.join(","),
                        needSignTemplate: this.needSignTemplate.join(","),
                        id: this.id,
                        applyDate: this.applyDate,
                        suffix: this.suffix == 1 ?
                            ".docx" : this.suffix == 2 ?
                            ".pdf" : ".xlsx",
                    };
                    //批量
                } else {
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
                    } else {
                        //批量生成调解文书
                        param.ids = this.params;
                        if (this.templateIdArr.length <= 0) {
                            this.msgError("请选择模版");
                            return;
                        }
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
                }
                this.loading = true;
                const baseUrl = process.env.VUE_APP_BASE_API;
                var url = baseUrl + this.requestApi;
                axios({
                    method: "post",
                    url: url,
                    timeout: 600000,
                    responseType: "blob",
                    data: param,
                    headers: {
                        Authorization: "Bearer " + getToken()
                    },
                }).then((res) => {
                    let data = res.data
                    let _self = this
                    let fileReader = new FileReader();
                    fileReader.onload = function () {
                        try {
                            let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
                            _self.$message({
                                message: jsonData.msg,
                                type: "error",
                            }); // 弹出的提示信息
                            _self.loading = false;
                        } catch (err) { // 解析成对象失败，说明是正常的文件流
                            _self.resolveBlob(res, mimeMap.zip);
                            _self.needSignTemplate = [];
                            _self.dialogVisible = false;
                            _self.loading = false;
                            _self.$emit('refresh')
                        }
                    };
                    fileReader.readAsText(data) // 注意别落掉此代码，可以将 Blob 或者 File 对象转根据特殊的编码格式转化为内容(字符串形式)
                }).catch((error) => {
                    this.needSignTemplate = [];
                    this.loading = false;
                });
            },
            resolveBlob(res, mimeType) {
                const aLink = document.createElement("a");
                var blob = new Blob([res.data], {
                    type: mimeType
                });
                // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
                var patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
                var contentDisposition = decodeURI(res.headers["content-disposition"]);
                var result = patt.exec(contentDisposition);
                var fileName = result[1];
                fileName = fileName.replace(/\"/g, "");
                aLink.href = URL.createObjectURL(blob);
                aLink.setAttribute("download", fileName); // 设置下载文件名称
                document.body.appendChild(aLink);
                aLink.click();
                document.body.appendChild(aLink);
                this.dialogVisible = false;
                this.loading = false;
                this.$emit('refresh')
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            //多元调解模版 
            getList() {
                let data = {
                    formatType: 0,
                    templateTypes: [],
                    status: 1,
                };
                templateApi.templateListInfo(data).then((response) => {
                    this.caseList = response.data || [];
                });
            },
            //多人多案模版  4
            getListTwo() {
                let data = {
                    formatType: 4,
                    templateTypes: [],
                    status: 1,
                };
                templateApi.templateListInfo(data).then((response) => {
                    this.caseListTwo = response.data || [];
                });
            },
            handleNodeClick(data) {
                //console.log(data)
                if (!data.id) {
                    this.$refs.tree.setCurrentKey(null);
                } else {
                    this.chooseData.push(data);
                    this.chooseData = Array.from(new Set(this.chooseData));
                }
            },
            deleteData(index) {
                this.chooseData.splice(index, 1);
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

</style>
