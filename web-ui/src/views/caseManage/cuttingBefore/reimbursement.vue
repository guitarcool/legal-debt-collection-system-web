<template>
    <Dialog :title="title" :height="480" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="剩余待还总额：">
                    <el-input v-model="remainingBalance" disabled></el-input>
                </el-form-item>
                <el-form-item label="调解待还金额：" v-if="outstandingAmount">
                    <el-input v-model="outstandingAmount" disabled></el-input>
                </el-form-item>
                <!-- 有账户 -->
                <div v-if="account">
                    <el-form-item label="收款账户：" prop="accountNoShou">
                        <el-select  filterable v-model="form.accountNoShou" placeholder="请选择" style="width: 210px"
                            @change="selectaccountNoShou">
                            <el-option v-for="item in repayList" :key="item.accountNumber" :label="item.accountNumber"
                                :value="item.accountNumber">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="收款账户名：" prop="accountName">
                        <el-input v-model="form.accountName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="开户行名称：" prop="openbankName">
                        <el-input v-model="form.openbankName" disabled></el-input>
                    </el-form-item>
                </div>
                <!-- 无账户自定义 -->
                <div v-else>
                    <el-form-item label="收款账户：" prop="accountNoShou">
                        <el-input v-model="form.accountNoShou"></el-input>
                    </el-form-item>
                    <el-form-item label="收款账户名：" prop="accountName">
                        <el-input v-model="form.accountName"></el-input>
                    </el-form-item>
                    <el-form-item label="开户行名称：" prop="openbankName">
                        <el-input v-model="form.openbankName"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="汇款账户：" prop="accountNo">
                    <el-input v-model="form.accountNo"></el-input>
                </el-form-item>
                <el-form-item label="汇款金额：" prop="amount">
                    <el-input v-model="form.amount"></el-input>
                </el-form-item>
                <el-form-item label="汇款类型：" prop="repayType">
                    <el-select v-model="form.repayType" placeholder="请选择" filterable>
                        <el-option v-for="item in remittanceTypes" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="回款渠道：" prop="payChannal">
                    <el-select v-model="form.payChannal" filterable placeholder="请选择">
                        <el-option v-for="item in payChannalOptions" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="汇款时间：" prop="remittanceTime">
                    <el-date-picker v-model="form.remittanceTime" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item required label="汇款凭证：">
                    <el-upload class="upload-demo" action="string" :http-request="handleUplod" :limit="1"
                        accept=".png, .jpg" :disabled="isUploading" :on-change="fileOnChange" :on-remove="removeFile"
                        :file-list="fileList" drag>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">
                            待财务审批通过后相关数据更新！
                        </div>
                        <div class="el-upload__tip" style="color: red" slot="tip">
                            提示：仅允许导入“png”或“jpg”格式文件！
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import {
        getToken
    } from "@/utils/auth";
    import axios from "axios";
    import {
        initObj
    } from "@/utils/common";
    export default {
        //已判决
        name: "reimbursement",
        components: {
            Dialog
        },
        data() {
            return {
                account: false,
                // 设置只能选择当前日期及之后的日期
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e7就是不可以选择今天的
                    },
                },
                form: {
                    repayType: "",
                    accountNo: "",
                    amount: "",
                    remittanceTime: "",
                    openbankName: "",
                    accountName: "",
                    accountNoShou: "",
                    payChannal: "",
                },
                accountNoShou: "1506213009022200623",
                upload_url: process.env.VUE_APP_BASE_API + "/case/pretrial/repayment", //上传URL
                files: "",
                // 是否禁用上传
                isUploading: false,
                rules: {
                    accountNo: [{
                        required: true,
                        message: "请输入汇款账户",
                        trigger: "blur"
                    }, ],
                    amount: [{
                        required: true,
                        message: "请输入汇款金额",
                        trigger: "blur"
                    }, ],
                    accountName: [{
                        required: true,
                        message: "请输入收款账户名",
                        trigger: "blur"
                    }, ],
                    openbankName: [{
                        required: true,
                        message: "请输入开户行名称",
                        trigger: "blur"
                    }, ],
                    repayType: [{
                        required: true,
                        message: "请选择汇款账户",
                        trigger: "change"
                    }, ],
                    remittanceTime: [{
                        type: "string",
                        required: true,
                        message: "请选择日期",
                        trigger: "change",
                    }, ],
                    file: [{
                        required: true,
                        message: "请上传图片",
                        trigger: "change"
                    }],
                    accountNoShou: [{
                        required: true,
                        message: "请选择收款账户",
                        trigger: "change"
                    }, ],
                    payChannal: [{
                        required: true,
                        message: "请选择回款渠道",
                        trigger: "change"
                    }, ],
                },
                remittanceTypes: [],
                fileList: [],
                payChannalOptions: [],
                accountNoShouOptions: [{
                        label: "130997110000080479",
                        value: "130997110000080479",
                    },
                    {
                        label: "1506213009022200623",
                        value: "1506213009022200623",
                    },
                ],
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
                default: "",
            },
            type: {
                type: Number,
                default: 0,
            },
            remainingBalance: {
                type: Number,
                default: 0,
            },
            outstandingAmount: {
                type: Number,
                default: 0,
            },
            repayList: {
                type: Array,
                default: () => [],
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
        created() {
            //回款状态
            this.getDicts("payChannal_options").then((response) => {
                this.payChannalOptions = response.data;
            });
            //汇款类型
            this.getDicts("remittance_status").then((response) => {
                this.remittanceTypes = response.data;
            });
        },
        methods: {
            openDialog() {
                initObj(this.form);
                this.resetAddForm();
                this.form.id = this.id;
                this.form.payChannal = '1';
                this.removeFile();
                this.fileList = [];
                if (this.repayList.length>0&&this.repayList[0].accountNumber) {
                    this.account = true;
                    this.selectaccountNoShou(this.repayList[0].accountNumber);
                } else {
                    this.account = false;
                }
            },
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs["form"].resetFields();
                } catch (e) {}
            },
            submit() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        if (this.files == null) {
                          this.msgError("请上传汇款凭证");
                          return;
                        }  
                        let formData = new FormData();
                        formData.append("caseId", this.id);
                        formData.append("file", this.files);
                        formData.append("type", this.type);
                        formData.append("accountNo", this.form.accountNo);
                        formData.append("amount", this.form.amount);
                        formData.append("repayType", this.form.repayType);
                        formData.append("openbankName", this.form.openbankName);
                        formData.append("accountName", this.form.accountName);
                        formData.append("accountNoShou", this.form.accountNoShou);
                        formData.append("remittanceTime", this.form.remittanceTime);
                        formData.append("payChannal", this.form.payChannal);
                        const instance = axios.create({
                            withCredentials: true,
                        });
                        instance.defaults.headers.common["Authorization"] =
                            "Bearer " + getToken();
                        var that = this;
                        instance({
                                method: "post",
                                url: process.env.VUE_APP_BASE_API + "/case/pretrial/repayment",
                                data: formData,
                                processData: false, // 告诉axios不要去处理发送的数据(重要参数)
                                contentType: false, // 告诉axios不要去设置Content-Type请求头
                                // config: {
                                //     headers: {'Content-Type': 'multipart/form-data'}
                                // }
                            })
                            .then(function (response) {
                                if (response.data.code == 200) {
                                    that.msgSuccess(response.data.msg);
                                    that.dialogVisible = false;
                                    that.$emit("refresh");
                                } else if (response.data.code == 500) {
                                    that.msgError(response.data.msg);
                                }
                            })
                            .catch((error) => {
                                that.msgError(error);
                            });
                    }
                });
            },
            // 文件上传中处理
            handleFileUploadProgress(event, file, fileList) {
                //console.log(file)
                this.isUploading = true;
            },
            fileOnChange(file) {
                this.isUploading = false;
                this.files = file.raw;
                //this.uploadSectionFile()
            },
            removeFile(file) {
                this.files = null;
            },
            handleUplod() {},
            selectaccountNoShou(val) {
                this.repayList.forEach(element => {
                    if (val == element.accountNumber) {
                        this.form.accountNoShou = element.accountNumber;
                        this.form.openbankName = element.openbankName;
                        this.form.accountName = element.accountName;
                    }
                });
            },
        },
    };

</script>

<style scoped>
    .el-dialog__body {
        height: 20px;
    }

    .el-upload__tip {
        line-height: 10px;
    }

</style>
