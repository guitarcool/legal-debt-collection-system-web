<template>
    <Dialog :title="title" :height="500" :show.sync="dialogVisible" width="60%" @openDialog="openDialog">
        <template v-slot:default>
            <!--上传模版-->
            <div class="add-template">
                <p>选择/上传需要的加入的内容</p>
                <el-row :gutter="20">
                    <el-col :span="12" v-if="type == 1 || type == 3">
                        <el-form ref="form" label-width="130px">
                            <el-form-item class="move-left">
                                <el-upload class="upload-demo covered-with" action="string" :http-request="handleUplod"
                                    accept=".docx, .doc" :disabled="isUploading" :on-change="fileOnChange" drag
                                    :show-file-list="false">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">
                                        将文件拖到此处，或
                                        <em>点击上传</em>
                                    </div>
                                    <!--<div class="el-upload__tip" slot="tip">-->
                                    <!--请在线下办公软件编辑模版，用“${字段英文名}”表示需要映射的字段，可点击“查看字段表”查看字段，支持上传.docx、.doc文档！-->
                                    <!--</div>-->
                                    <div class="el-upload__tip" style="color:red" slot="tip">
                                        提示：可上传多个.docx文档，编辑时用"${字段英文名}”表示需要映射的字段或图片，可点击“查看字段表”查看字段名需要循环的映射多个案件的内容，请在句子开头插入循环标识“$$[”，句子结束插入标识“]$$”，句子内容可以为一般映射设定内容，以“${字段英文名}$”代表需要映射的具体案件内容。
                                    </div>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="12" v-if="type == 2 || type == 3" style="margin-bottom: 10px">
                        <!--<p class="book-title">勾选您所需要加入的证据包信息：</p>-->
                        <el-input clearable placeholder="输入关键字进行过滤" v-model="filterText">
                        </el-input>
                        <el-tree style="overflow-y: auto;height: 300px;" :data="templateData" class="border-style"
                            node-key="id" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree"
                            @node-click="handleNodeClick" default-expand-all />
                    </el-col>
                </el-row>
                <ul class="drag-box" ref="parentNode">
                    <div v-if="list.length==0" style="line-height: 50px;text-align: center">暂无数据</div>
                    <draggable v-model="list" v-else>
                        <transition-group>
                            <li v-for="(item,index) in list" :key="index+1" class="item"
                                style="height:auto;display:flex;flex-direction: column;padding: 5px;">
                                <div style="width:100%;display:flex;align-items: center;margin: 10px 0;">
                                    <p style="width:50%;font-size:16px;font-weight:700;color:#000;">{{item.label}}</p>
                                    <div style="width:50%;display:flex;justify-content: flex-end;">
                                        <div>
                                            <i v-if="!id||title=='克隆模版'" class="el-icon-s-operation"
                                                style="margin-right: 20px"></i>
                                            <i class="el-icon-delete" @click="deleteData(item,index)"></i>
                                        </div>
                                    </div>
                                </div>
                                <el-form class="model_form" ref="isSignform" :model="isSignform">
                                    <el-form-item style="width:33%" label="有无签章:">
                                        <el-select v-model="item.isSign" filterable @change="isSignchange(item)"
                                            placeholder="请选择">
                                            <el-option v-for="item in isSignOptions" :key="item.dictValue"
                                                :label="item.dictLabel" :value="item.dictValue">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item style="width:33%" label="签章名称:" prop="signName" v-if="item.isSign!=0">
                                        <el-select clearable v-model="item.signName" filterable placeholder="请选择">
                                            <el-option v-for="item in signNameOptions" :key="item.dictValue"
                                                :label="item.dictLabel" :value="item.dictValue">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item style="width:33%" label="签章设定:" prop="signSetUp"
                                        v-if="item.isSign!=0&&item.type==1">
                                        <el-select clearable v-model="item.signSetUp" filterable placeholder="请选择">
                                            <el-option v-for="item in signSetUpOptions" :key="item.dictValue"
                                                :label="item.dictLabel" :value="item.dictValue">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <!-- 如果是证据包 -->
                                    <el-form-item style="width:33%" label="签章设定:" prop="signSetUp"
                                        v-if="item.isSign!=0&&item.type==2">
                                        <el-select clearable v-model="item.signSetUp" filterable placeholder="请选择">
                                            <el-option v-for="item in options5" :key="item.value" :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                                <el-form class="model_form" ref="isSignform" :model="isSignform">
                                    <el-form-item style="width:33%" label="指定位置:" prop="pagePlace"
                                        v-if="item.isSign!=0&&item.signSetUp==2">
                                        <el-select clearable filterable v-model="item.pagePlace" placeholder="请选择">
                                            <el-option v-for="item in pagePlaceOptions" :key="item.dictValue"
                                                :label="item.dictLabel" :value="item.dictValue">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item style="width:33%" label="指定页面:" prop="pageIndex"
                                        v-if="item.isSign!=0&&item.signSetUp==2">
                                        <el-select clearable filterable v-model="item.pageIndex" placeholder="请选择">
                                            <el-option v-for="item in pageIndexOptions" :key="item.value"
                                                :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item style="width:26%" label="" prop="placeContent"
                                        v-if="item.isSign!=0&&item.signSetUp ==1">
                                        <el-input clearable v-model="item.placeContent"
                                            placeholder="请输入关键字，用逗号分隔多个关键字。"></el-input>
                                    </el-form-item>
                                    <el-form-item style="width:26%" label="" prop="pageRange"
                                        v-if="item.isSign!=0&&item.signSetUp ==2&&item.pageIndex==''">
                                        <el-input clearable v-model="item.pageRange" placeholder="请输入页码或用逗号分隔的页面范围。">
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                            </li>
                        </transition-group>
                    </draggable>
                </ul>
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
            <!-- <el-button v-if="type!=3" type="primary" @click="editSubmit">确 定</el-button> -->
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index';
    import templateApi from "@/api/case/document/templateIndex";
    import axios from 'axios'
    import {
        getToken
    } from "@/utils/auth";
    import draggable from 'vuedraggable'

    export default {
        //多元调解成功
        name: "addTemplate",
        components: {
            Dialog,
            draggable
        },
        data() {
            return {
                // 是否禁用上传
                isUploading: false,
                filterText: '',
                isSignOptions: [],
                signNameOptions: [], //签章名称
                signSetUpOptions: [], //签章设定
                options5: [{
                    value: '2',
                    label: '指定位置定位'
                }, ], //签章设定
                isSignform: {},
                pagePlaceOptions: [], //签章位置
                pageIndexOptions: [{
                        value: 'All',
                        label: '所有页'
                    },
                    {
                        value: '',
                        label: '指定页'
                    }
                ], //签章位置
                templateData: [],
                list: [],
                original: ''
            }
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
            id: {
                type: String | Number,
                default: ''
            },
            type: {
                type: Number,
                default: 3
            },
            tid: { //模版id
                type: String | Number,
                default: ''
            },
            singleData: {
                type: String,
                default: ''
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
            //有无电子签章
            this.getDicts("isSign").then((response) => {
                this.isSignOptions = response.data;
            });
            //签章设定类别
            this.getDicts("signSetUp").then((response) => {
                this.signSetUpOptions = response.data;
            });
            //指定页面位置类别
            this.getDicts("pagePlace").then((response) => {
                this.pagePlaceOptions = response.data;
            });
            //签章名称
            this.getDicts("signName").then((response) => {
                this.signNameOptions = response.data;
            });
        },
        mounted() {

        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            openDialog() {
                this.getEvidenceField();
                this.list = [];
                this.filterText = "";
                if (this.singleData) {
                    this.original = JSON.parse(this.singleData)
                }
            },
            getEvidenceField() {
                templateApi.getEvidenceField().then((response) => {
                    this.templateData = [response.data];
                });
            },
            signSetUpchange(item) {
                if (item.pagePlace) {
                    item.pagePlace = '';
                    return item
                }
            },
            isSignchange(item) {
                //证据链包 type== 2
                if (item.isSign == 0 && item.type == 2) {
                    item.signName = '';
                    item.signSetUp = '';
                    item.pagePlace = '';
                    item.pageIndex = 'All';
                    item.pageRange = '';
                    return item
                } else if (item.isSign == 0 && item.type == 1) {
                    //文件上传 type== 1
                    item.signName = '';
                    item.signSetUp = '';
                    item.pagePlace = '';
                    item.placeContent = '';
                    item.pageIndex = 'All';
                    item.pageRange = '';
                    return item
                }
            },
            submit() {
                let that = this
                this.$confirm(`此操作连接数据库，是否继续?`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnClickModal: false,
                    type: "warning",
                }).then(() => {
                    let formData = new FormData();
                    formData.append('tid', that.tid);
                    //电子签章内容
                    this.list.forEach((item, i) => {
                        formData.append('type', item.type);
                        formData.append('pdfName', item.pdfName);
                        formData.append('id', item.id ? item.id : '')
                        if (item.file != null) {
                            formData.append('file', item.file)
                        }
                        formData.append('isSign', item.isSign ? item.isSign : '')
                        formData.append('pagePlace', item.pagePlace ? item.pagePlace : '')
                        formData.append('signName', item.signName ? item.signName : '')
                        formData.append('signSetUp', item.signSetUp ? item.signSetUp : '')
                        if (item.signSetUp == 2 && item.pageIndex == "All") {
                            formData.append('pageRange', "All");
                        } else if (item.signSetUp == 2 && item.pageIndex != "All") {
                            formData.append('pageRange', item.pageRange ? item.pageRange :
                                '');
                        } else if (item.signSetUp == 1) {
                            formData.append('placeContent', item.placeContent ? item
                                .placeContent : '');
                        }
                    })
                    //return
                    const instance = axios.create({
                        withCredentials: true
                    });
                    instance.defaults.headers.common['Authorization'] = 'Bearer ' + getToken()
                    var url = '/template/info/templateFile/add';
                    var these = that
                    instance({
                        method: 'post',
                        url: process.env.VUE_APP_BASE_API + url,
                        data: formData,
                        timeout: 600000,
                        processData: false, // 告诉axios不要去处理发送的数据(重要参数)
                        contentType: false, // 告诉axios不要去设置Content-Type请求头
                    }).then(function (response) {
                        if (response.data.code == 200) {
                            these.msgSuccess(response.data.msg);
                            these.dialogVisible = false;
                            these.$emit('refresh');
                        } else {
                            these.msgError(response.data.msg);
                        }
                    }).catch(error => {
                        these.msgError(error);
                    })
                }).catch(() => {
                    that.msgInfo("已取消操作");
                });
            },
            // 文件上传中处理
            handleFileUploadProgress(event, file, fileList) {
                //console.log(file)
                this.isUploading = true;
            },
            fileOnChange(file) {
                //console.log(file)
                this.isUploading = false;
                if (this.list.length > 0) {
                    this.msgError('每次只新增一条')
                    return
                }
                let param = {
                    file: file.raw,
                    type: 1,
                    pdfName: '',
                    label: file.name,
                    isSign: '0',
                    pageIndex: 'All',
                };
                this.list.push(param);
                //this.uploadSectionFile()
            },
            handleUplod() {

            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            handleNodeClick(data) {
                if (this.list.length > 0) {
                    this.msgError('每次只新增一条')
                    return
                }
                //console.log(data)
                if (!data.value) {
                    this.msgError('请正确选择模版')
                } else {
                    let param = {
                        file: null,
                        type: 2,
                        pdfName: data.label,
                        label: data.label,
                        id: data.value,
                        isSign: '0',
                        pageIndex: 'All',
                    };
                    this.list.push(param);
                    //this.form.list = Array.from(new Set(this.form.list))
                }
            },
            deleteData(index) {
                this.list.splice(index, 1)
            },
            // //切换指定页面
            // changePageIndex(item) {
            //     if (item.pageIndex == 'All') {
            //         item.pageRange = 'All';
            //         return item
            //     }
            // }
        }
    }

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

        .model_form {
            width: 100%;
            display: flex;
            align-items: center;
            margin-top: 10px;

            .el-form-item {
                margin-bottom: 10px;
            }
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
            color: #409EFF;
        }

        .font-big i {
            font-size: 30px;
            margin-right: 20px;
            color: #409EFF;
        }
    }

    .add-template {
        >p {
            padding: 0px 0 10px 16px;
            color: #409EFF;
            font-size: 16px;
            position: relative;
            font-weight: bold;
        }

        >p::before {
            position: absolute;
            top: 4px;
            left: 0;
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: #409EFF;
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

    .border-style {
        border: 1px solid #e6ebf5;
        padding: 10px;
        min-height: 200px;
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
        color: #409EFF;
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
