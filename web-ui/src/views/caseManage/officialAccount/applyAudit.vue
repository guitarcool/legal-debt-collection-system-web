<template>
    <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="45%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="汇款凭证：">
                    <el-button type="text" @click="seeErweima(form)">{{form.remitEvidenceName}}</el-button>
                </el-form-item>
                <el-form-item label="审批结果：" prop="operate">
                    <el-radio-group v-model="form.operate">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="0">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="申请还款类型：" prop="type">
                    <el-select v-model="form.type" filterable placeholder="请选择">
                        <el-option :value="1">结清</el-option>
                        <el-option :value="2">部分还款</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="剩余待还总额：">
                    <el-input v-model="form.remainingBalance" disabled></el-input>
                </el-form-item>
                <el-form-item label="收款账户：" prop="accountNoShou">
                    <el-input v-model="form.accountNoShou"></el-input>
                </el-form-item>
                <el-form-item label="收款账户名：" prop="accountName">
                    <el-input v-model="form.accountName"></el-input>
                </el-form-item>
                <el-form-item label="开户行名称：" prop="openbankName">
                    <el-input v-model="form.openbankName"></el-input>
                </el-form-item>
                <el-form-item label="汇款账号：" prop="accountNo">
                    <el-input v-model="form.accountNo" placeholder="请输入汇款账号"></el-input>
                </el-form-item>
                <el-form-item label="汇款金额：" prop="amount">
                    <el-input v-model="form.amount" placeholder="请输入汇款金额"></el-input>
                </el-form-item>
                <el-form-item label="汇款类型：" prop="repayType">
                    <el-select v-model="form.repayType" filterable placeholder="请选择">
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
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <erweima :title="erweimaData.title" :url="erweimaData.url" :show.sync="erweimaData.dialogVisible">
            </erweima>
        </template>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
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
                form: {
                    operate: '',
                    id: '',
                    serialNo: '',
                    option: '',
                },
                rules: {
                    accountNoShou: [{
                        required: true,
                        message: '请输入收款账户',
                        trigger: 'blur'
                    }],
                    accountName: [{
                        required: true,
                        message: '请输入收款账户名',
                        trigger: 'blur'
                    }],
                    openbankName: [{
                        required: true,
                        message: '请输入开户行名称',
                        trigger: 'blur'
                    }],
                    accountNo: [{
                        required: true,
                        message: '请输入汇款账户',
                        trigger: 'blur'
                    }],
                    amount: [{
                        required: true,
                        message: '请输入汇款金额',
                        trigger: 'blur'
                    }],
                    type: [{
                        required: true,
                        message: '请选择还款类型',
                        trigger: 'change'
                    }],
                    operate: [{
                        required: true,
                        message: '请选择审批结果',
                        trigger: 'change'
                    }],
                    repayType: [{
                        required: true,
                        message: '请选择汇款类型',
                        trigger: 'change'
                    }],
                    payChannal: [{
                        required: true,
                        message: '请选择回款渠道',
                        trigger: 'change'
                    }],
                    remittanceTime: [{
                        required: true,
                        message: '请选择汇款时间',
                        trigger: 'change'
                    }],
                },
                paymentStatus: [], //还款状态
                remittanceTypes: [], //汇款类型
                erweimaData: {
                    dialogVisible: false,
                    title: '',
                    url: ''
                },
                payChannalOptions: []
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
                this.form = JSON.parse(this.item);
                this.form.id = this.id;
                this.form.repayType = this.form.repayType.toString();
                this.form.operate = 1;
            },
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            submit() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        let param = {
                            caseId: this.form.caseId,
                            respondentName: this.form.respondentName,
                            id: this.id,
                            serialNo: this.form.serialNo,
                            options: this.form.option,
                            operate: this.form.operate
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
