<template>
    <Dialog :title="title" :height="500" :show.sync="dialogVisible" width="35%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="140px" style="margin:0 auto; width:90%">
                <el-form-item label="剩余待还总额：">
                    <el-input v-model="remainingBalance" disabled></el-input>
                </el-form-item>
                <el-form-item label="调解待还金额：">
                    <el-input v-model="outstandingAmount" disabled></el-input>
                </el-form-item>
                <el-form-item label="共债剩余待还总额：">
                    <el-input v-model="outstandingAmount" disabled></el-input>
                </el-form-item>
                <!-- 有账户 -->
                <div v-if="account">
                    <el-form-item label="收款账户：" prop="accountNoShou">
                        <el-select v-model="form.accountNoShou" filterable placeholder="请选择" style="width: 210px"
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
                <el-form-item label="共债还款：" prop="accountNo">
                    <el-switch v-model="form.switch" @change="switchChange" active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <div v-for="(domain, index) in form.domains" :key="domain.key">
                    <el-form-item :label="'还款案件' + (index+1)" :prop="'domains.' + index + '.payChannal'"
                        :rules="{ required: true, message: '请选择还款案件', trigger: 'change'}">
                        <el-select v-model="domain.payChannal" placeholder="请选择" filterable>
                            <el-option v-for="item in payChannalOptions" :key="item.dictValue" :label="item.dictLabel"
                                :value="item.dictValue">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="'汇款金额' + (index+1)" :prop="'domains.' + index + '.amount'"
                        :rules="[{ required: true, message: '请输入汇款金额', trigger: 'blur'}, { type: 'number', message: '汇款金额必须为大于0的数字'}]">
                        <el-input style="width:200px;" v-model.number="domain.amount"></el-input>
                        <el-button size="mini" style="margin-left:10px;" icon="el-icon-circle-plus-outline"
                            @click="addDomain" circle />
                        <el-button size="mini" icon="el-icon-remove-outline" @click.prevent="removeDomain(domain)"
                            circle />
                    </el-form-item>
                </div>
                <el-form-item label="汇款类型：" prop="repayType">
                    <el-select v-model="form.repayType" placeholder="请选择" filterable>
                        <el-option v-for="item in remittanceTypes" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="回款渠道：" prop="payChannal">
                    <el-select v-model="form.payChannal" placeholder="请选择" filterable>
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
                    <!--<el-upload-->
                    <!--class="upload-demo"-->
                    <!--:action="upload_url"-->
                    <!--:limit="1"-->
                    <!--accept=".png, .jpg"-->
                    <!--:disabled="isUploading"-->
                    <!--:on-change="fileOnChange"-->
                    <!--:on-remove="removeFile">-->
                    <!--<el-button size="mini" type="primary">上传图片</el-button>-->
                    <!--</el-upload>-->
                    <el-upload class="upload-demo" action="string" :http-request="handleUplod" :limit="1"
                        accept=".png, .jpg" :disabled="isUploading" :on-change="fileOnChange" :on-remove="removeFile"
                        drag :file-list="fileList">
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
                    remittanceTime: "",
                    openbankName: "",
                    accountName: "",
                    accountNoShou: "",
                    payChannal: "",
                    domains: [{
                        amount: '',
                        payChannal: ''
                    }],
                },
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
                    remittanceTime: [{
                        type: "string",
                        required: true,
                        message: "请选择日期",
                        trigger: "change",
                    }, ],
                    file: [{
                        required: true,
                        message: "请上传图片"
                    }],
                },
                remittanceTypes: [],
                payChannalOptions: [],
                fileList: [],
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
                if (this.repayList.length > 0 && this.repayList[0].accountNumber) {
                    this.account = true;
                    this.selectaccountNoShou(this.repayList[0].accountNumber);
                } else {
                    this.account = false;
                }
                this.addOneDomain();
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
                        let url;
                        if (this.title == '裁前部分还款' || '裁前结清') {
                            url = process.env.VUE_APP_BASE_API + "/case/pretrial/repayment";
                        } else if (this.title == '裁后部分还款' || '裁后结清') {
                            url = process.env.VUE_APP_BASE_API + "/case/postAdjudged/repayment";
                        }
                        instance({
                                method: "post",
                                url: url,
                                data: formData,
                                timeout: 600000,
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
            //删除
            removeDomain(item) {
                var index = this.form.domains.indexOf(item)
                if (index !== 0) {
                    this.form.domains.splice(index, 1)
                }
            },
            //初始化新增
            addOneDomain() {
                this.form.domains.push({
                    amount: '',
                    payChannal: '',
                    key: Date.now()
                });
            },
            //新增
            addDomain() {
                if (this.form.switch) {
                    this.form.domains.push({
                        amount: '',
                        payChannal: '',
                        key: Date.now()
                    });
                } else {
                    this.msgInfo('请开启共债还款后再新增还款案件！');
                }
            },
            //共债情况
            switchChange(value) {
                switch (true) {
                    case value == true:
                        this.addDomain();
                        break;
                    case value == false:
                        this.form.domains.splice(1)
                        break;
                }
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
