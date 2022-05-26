<template>
    <div>
        <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
            <template v-slot:default>
                <!-- 查看字段表 -->
                <div v-if="title == '全选短信发送'" style="padding:10px 0;color:red;font-size:16px;line-height:24px" >注意：本次共操作{{total}}条数据，请确认搜索条件无误后操作!</div>
                <div class="see-field" v-loading="loading">
                    <div v-show="active ==1">
                        <div class="margin-div">
                            <p class="book-title">1、选择短信模版：</p>
                            <el-scrollbar style="height: 250px">
                                <el-input clearable placeholder="请输入查找短信模版" v-model="filterText">
                                </el-input>
                                <el-tree :data="caseList" class="border-style" :props="defaultProps" node-key="id"
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
                        <div class="margin-div">
                            <p class="book-title">3、跳过号码：<span>以最近一次标签为准</span></p>
                            <div class="box-check">
                                <p>最近一次短信送达状态：</p>
                                <el-checkbox-group v-model="filterDeliverStatus">
                                    <el-checkbox :label="0">已送达</el-checkbox>
                                    <el-checkbox :label="1">接收中</el-checkbox>
                                    <el-checkbox :label="2">其他</el-checkbox>
                                </el-checkbox-group>
                            </div>
                            <div class="box-check">
                                <p>调解标签：</p>
                                <el-checkbox-group v-model="phoneStatus">
                                    <el-checkbox :label="6">停机</el-checkbox>
                                    <el-checkbox :label="0">关机</el-checkbox>
                                    <el-checkbox :label="8">空号</el-checkbox>
                                    <el-checkbox :label="3">失联</el-checkbox>
                                    <el-checkbox :label="14">更换机主</el-checkbox>
                                    <el-checkbox :label="12">电话设置</el-checkbox>
                                    <el-checkbox :label="13">无人接听</el-checkbox>
                                </el-checkbox-group>
                            </div>
                            <div class="box-check">
                                <p>手机号在网状态：</p>
                                <el-checkbox-group v-model="filterNetworkStatus">
                                    <el-checkbox :label="2">停用</el-checkbox>
                                    <el-checkbox :label="4003">未获取</el-checkbox>
                                </el-checkbox-group>
                            </div>
                            <div class="box-check">
                                <p>手机号实时在网状态：</p>
                                <el-checkbox-group v-model="filterRealtimeStatus">
                                    <el-checkbox :label="3">空号</el-checkbox>
                                    <el-checkbox :label="4">短时间（24h）关机</el-checkbox>
                                    <el-checkbox :label="7">长时间（大于24h）关机</el-checkbox>
                                    <el-checkbox :label="5">欠费停机且无短信能力</el-checkbox>
                                    <el-checkbox :label="6">欠费但能接受短信</el-checkbox>
                                    <el-checkbox :label="8">关机-疑似呼转</el-checkbox>
                                    <el-checkbox :label="9">关机-疑似小号</el-checkbox>
                                    <el-checkbox :label="10">未激活</el-checkbox>
                                    <el-checkbox :label="-3">携号转网</el-checkbox>
                                </el-checkbox-group>
                            </div>
                            <p style="color: #999;line-height: 20px;margin-top: 10px;">
                                批量短信发送按照一人一号码发送原则，筛选跳过号码后债务人存在多个本人号码，则按照“被申请人联系号码列表”中的顺序排行靠前的号码进行发送。
                            </p>
                        </div>
                    </div>

                    <div v-if="active ==2">
                        <div class="margin-div">
                            <p class="book-title">4、发送内容：</p>
                            <div class="import-content" v-loading="loading">
                                <p style="color: #999;line-height: 20px;">
                                    点击文档下载到本地确认短信内容，若短信内容无误可直接发送，若需修改内容可在下载的文档中编辑。
                                </p>
                                <span>点击下载：</span>
                                <el-link type="info" style="font-size: 16px; margin: 10px 0; color: #1890ff"
                                    @click="importTemplate"><i class="el-icon-download"></i>批量生成短信内容</el-link>
                                <el-upload v-if="title == '批量短信发送(旧)'" class="upload-demo" :limit="1" action="string" :http-request="handleUplod"
                                    :disabled="isUploading" :on-change="fileOnChange" :on-remove="removeFile">
                                    <el-button size="mini" type="primary">上传短信内容<i
                                            class="el-icon-upload el-icon--right"></i></el-button>
                                </el-upload>
                            </div>
                        </div>
                        <div class="margin-div">
                            <p class="book-title">5、发送时间：</p>
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
                            <p class="book-title">6、发送渠道：</p>
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
    import {
        getToken
    } from "@/utils/auth";
    import axios from "axios";
    import importApi from "@/api/case/import/index";
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
    import templateApi from "@/api/case/document/templateIndex";
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
            params: {
                type: String,
                default: ''
            },
            total:{
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
                upload_url: '',
                files: null,
                // 是否禁用上传
                isUploading: false,
                defaultProps: {
                    children: "children",
                    label: "name",
                },
                filterText: "",
                caseList: [],
                id: "",
                templateId: "",
                applyTime: "",
                setvalue: null,
                textarea: "",
                text: "",
                signatureDate: null,
                loading: false,
                visible: false,
                phoneStatus: [],
                filterDeliverStatus: [],
                filterNetworkStatus: [],
                filterRealtimeStatus: [],
                active: 1,
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
                this.templateId = "";
                this.applyTime = null;
                this.filterText = "";
                this.removeFile();
                this.setvalue = null;
                this.active = 1;
                this.textarea = "";
                this.signatureDate = null;
                this.files = null;
                this.caseList = [];
                this.providerType = "";
                this.filterDeliverStatus = [];
                this.phoneStatus = [6, 0, 8, 3, 12, 13, 14];
                this.filterRealtimeStatus = [3, 7, 5, 6, 8, 9, 10, -3];
                this.filterNetworkStatus = [2, 4003];
                this.getList();
            },
            nextActive() {
                if (!this.templateId) {
                    this.msgError("请选择模版");
                    return;
                }
                // if (this.phoneStatus.length == 0) {
                //     this.msgError("请至少选择一个跳过内容");
                //     return;
                // }
                this.active = 2;
                // if(this.title == '全选短信发送'){
                templateApi.wituoutPermiInfo(this.templateId).then(
                    response => {
                        this.textarea = response.data.content;
                    }
                );                        
                // }else{
                //     templateApi.info(this.templateId).then(
                //         response => {
                //             this.textarea = response.data.content;
                //         }
                //     );       
                // }
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
            // 文件上传中处理
            handleFileUploadProgress(event, file, fileList) {
                //console.log(file)
                this.isUploading = true;
            },
            fileOnChange(file) {
                console.log(file)
                this.isUploading = false;
                this.files = file.raw;
                //this.uploadSectionFile()
            },
            removeFile(file) {
                this.files = null
            },
            handleUplod() {

            },
            /** 下载模版操作 */
            importTemplate() {
                let param = {
                    content: this.textarea,
                    applyTime: this.applyTime,
                    ids: this.params,
                    templateId: this.templateId,
                    phoneStatus: this.phoneStatus,
                    filterDeliverStatus: this.filterDeliverStatus,
                    filterRealtimeStatus: this.filterRealtimeStatus,
                    filterNetworkStatus: this.filterNetworkStatus,
                    providerType: this.providerType,
                    sendTime: this.signatureDate ? this.signatureDate : '',
                }
                if (this.title == '全选短信发送') {
                    cuttingAfterApi.downloadSmsTemplate(param).then((response) => {
                        this.download(response.msg);
                    });
                }else{
                    importApi.downloadSmsTemplate(param).then((response) => {
                        this.download(response.msg);
                    });
                }
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
                this.visible = false;
                this.red = false;
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
                    if (this.files) {
                        let formData = new FormData();
                        formData.append("content", '');
                        formData.append("ids", this.params);
                        formData.append("templateId", this.templateId);
                        formData.append("phoneStatus", this.phoneStatus);
                        formData.append("filterDeliverStatus", this.filterDeliverStatus);
                        formData.append("filterRealtimeStatus", this.filterRealtimeStatus);
                        formData.append("filterNetworkStatus", this.filterNetworkStatus);
                        formData.append("providerType", this.providerType);
                        formData.append("applyTime", this.applyTime);
                        formData.append("file", this.files);
                        formData.append("sendTime", this.signatureDate ? this.signatureDate : '');
                        const instance = axios.create({
                            withCredentials: true
                        });
                        instance.defaults.headers.common['Authorization'] = 'Bearer ' + getToken();
                        if (this.title == '全选短信发送') {
                            this.upload_url = process.env.VUE_APP_BASE_API + "/case/postAdjudged/batchSMSFileAll"; //上传URL
                        } else if (this.title == '批量短信发送(旧)') {
                            this.upload_url = process.env.VUE_APP_BASE_API + "/case/postAdjudged/batchSMSFile"; //上传URL
                        }
                        var that = this
                        instance({
                            method: 'post',
                            url: that.upload_url,
                            data: formData,
                            timeout:600000,
                            processData: false, // 告诉axios不要去处理发送的数据(重要参数)
                            contentType: false, // 告诉axios不要去设置Content-Type请求头
                            // config: {
                            //     headers: {'Content-Type': 'multipart/form-data'}
                            // }
                        }).then((res) =>{
                            if (res.data.code == 500) {
                                that.loading = false;
                                that.msgError(res.data.msg);
                            } else {
                                that.dialogVisible = false;
                                that.loading = false;
                                that.msgSuccess(res.data.msg);
                                that.$emit('refresh');
                            }
                        }).catch(error => {
                            that.loading = false;
                            that.msgError(error);
                        })
                    } else {
                        let param = {
                            content: this.textarea,
                            applyTime: this.applyTime,
                            ids: this.params,
                            templateId: this.templateId,
                            phoneStatus: this.phoneStatus,
                            filterDeliverStatus: this.filterDeliverStatus,
                            filterRealtimeStatus: this.filterRealtimeStatus,
                            filterNetworkStatus: this.filterNetworkStatus,
                            providerType: this.providerType,
                            sendTime: this.signatureDate ? this.signatureDate : '',
                        }
                        if (this.title == '全选短信发送') {
                            cuttingAfterApi.sendSmsCollectionAll(param).then((res) => {
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
                        } else {
                            cuttingAfterApi.sendSmsCollection(param).then((res) => {
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

                    }
                }
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            //获取短信模版
            getList() {
                let data = {
                    formatType: 1,
                    templateTypes: [0, 1, 2],
                    status: 1,
                };
                templateApi.templateListInfo(data).then((response) => {
                    this.caseList = response.data || [];
                });
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

        span {
            color: #999999;
            font-size: 14px;
        }
    }

    .box-check {
        display: flex;
        align-items: center;
        padding: 5px;

        p {
            text-align: left;
            width: 154px;
            white-space: pre;
        }
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
