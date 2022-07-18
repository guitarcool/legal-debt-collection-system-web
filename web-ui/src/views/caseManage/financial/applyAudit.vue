<template>
    <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="45%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form class="custom-display" ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="申请还款类型：">
                    <span>{{form.type== 1?'结清':'部分还款'}}</span>
                </el-form-item>
                <el-form-item label="汇款账号：">
                    <el-input disabled style="width: 200px" v-model="form.accountNo" placeholder="请输入汇款账号"></el-input>
                </el-form-item>
                <el-form-item label="汇款金额：">
                    <el-input disabled style="width: 200px" v-model="form.amount" placeholder="请输入汇款金额"></el-input>
                </el-form-item>
                <el-form-item label="汇款类型：">
                    <el-select disabled v-model="form.repayType" filterable placeholder="请选择">
                        <el-option v-for="item in remittanceTypes" :key="item.dictValue" :label="item.dictLabel"
                            :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="汇款时间：">
                    <el-date-picker disabled v-model="form.remittanceTime" type="date" placeholder="选择日期"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="汇款凭证：">
                    <!--<el-input style="width: 200px" v-model="form.remitEvidenceName" placeholder="请输入汇款凭证"></el-input>-->
                    <el-button type="text" @click="seeErweima(form)">{{form.remitEvidenceName}}</el-button>
                </el-form-item>
            </el-form>

            <el-form ref="submitForm" :model="submitForm" :rules="rules" label-width="110px">
                <div v-if="jointdebtId">
                    <div v-for="(domain, index) in submitForm.domains" :key="domain.key">
                        <el-form-item :label="'还款案件' + (index+1)">
                            <el-select style="width:50%" disabled v-model="domain.caseId" placeholder="请选择" filterable>
                                <el-option :label="domain.caseId +'-'+ domain.productName +'-'+ domain.subjectAmount"
                                    :value="domain.caseId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="'汇款金额' + (index+1)">
                            <el-input style="width:50%" disabled v-model.number="domain.repayAmount"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item label="审批结果：" prop="operate">
                    <el-radio-group v-model="submitForm.operate">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="0">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审批意见：" :required="submitForm.operate==0">
                    <el-input v-model="submitForm.option" :rows="8" type="textarea" placeholder="请输入审批意见"></el-input>
                </el-form-item>
                <el-form-item label="交易流水号：" :required="submitForm.operate==1">
                    <el-input v-model="submitForm.serialNo" placeholder="请输入交易流水号"></el-input>
                </el-form-item>
            </el-form>
            <erweima :title="erweimaData.title" :url="erweimaData.url" :show.sync="erweimaData.dialogVisible">
            </erweima>
        </template>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" v-debounce="submit">确 定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import {
        getToken
    } from "@/utils/auth";
    import {
        initObj
    } from '@/utils/common'
    import financeApi from "@/api/case/finance/index";
    import erweima from '../components/erweima'
    export default {
        //多元调解成功
        name: "applyAudit",
        components: {
            Dialog,
            erweima
        },
        data() {
            return {
                submitForm: {
                    operate: '',
                    id: '',
                    serialNo: '',
                    option: '',
                    domains: [{
                        caseId: '',
                        productName: '',
                        subjectAmount: '',
                        repayAmount:''
                    }],
                },
                form: {},
                rules: {
                    operate: [{
                        required: true,
                        message: '请选择审批结果',
                        trigger: 'change'
                    }],
                    serialNo: [{
                        required: true,
                        message: '请输入交易流水号',
                        trigger: 'blur'
                    }],
                    option: [{
                        required: true,
                        message: '请输入审批意见',
                        trigger: 'blur'
                    }],
                },
                paymentStatus: [], //还款状态
                remittanceTypes: [], //汇款类型
                erweimaData: {
                    dialogVisible: false,
                    title: '',
                    url: ''
                },
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
                type: Number,
                default: -999
            },
            jointdebtId: {
                type: String,
                default: ''
            },
            item: {
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
            //还款状态
            this.getDicts("repay_status").then((response) => {
                this.paymentStatus = response.data;
            });
            //汇款类型
            this.getDicts("remittance_status").then((response) => {
                this.remittanceTypes = response.data;
            });
        },
        methods: {
            openDialog() {
                initObj(this.form);
                initObj(this.submitForm);
                this.resetAddForm();
                this.form = JSON.parse(this.item);
                this.submitForm.id = this.id;
                this.form.repayType = this.form.repayType.toString();
                this.submitForm.operate = 1;
                if (this.jointdebtId) {
                    this.getList();
                }
            },
            getList() {
                //查询
                financeApi.getJointdebtDetail(this.jointdebtId).then((response) => {
                    this.submitForm.domains = response.data;
                }).catch(() => {
                    this.caseList = [];
                });
            },
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs['submitForm'].resetFields()
                } catch (e) {

                }
            },
            submit() {
                if (this.submitForm.operate == 0 && this.submitForm.option == '') {
                    this.msgError("请填写拒绝理由");
                    return
                }
                if (this.submitForm.operate == 1 && this.submitForm.serialNo == '') {
                    this.msgError("请填写交易流水号");
                    return
                }
                this.$refs["submitForm"].validate((valid) => {
                    if (valid) {
                        let param = {
                            caseId: this.form.caseId,
                            respondentName: this.form.respondentName,
                            id: this.id,
                            serialNo: this.submitForm.serialNo,
                            options: this.submitForm.option,
                            operate: this.submitForm.operate,
                            type: this.form.type
                        }
                        financeApi.applyModify(param).then(res => {
                            if (res.code === 200) {
                                this.msgSuccess("操作成功");
                                this.$emit('refresh')
                                this.dialogVisible = false
                            }
                        })
                    }
                });
            },
            //查看凭证
            seeErweima(item) {
                this.erweimaData.title = '汇款凭证';
                this.erweimaData.url = item.remitEvidencePath;
                // 控制弹窗组件显示
                this.erweimaData.dialogVisible = true
            },
        }
    }

</script>

<style scoped>
    .el-dialog__body {
        height: 20px;
    }

</style>
<style lang="scss">
    .custom-display {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .el-form-item {
            width: 50%;
        }
    }

</style>
