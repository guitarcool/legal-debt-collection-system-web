<template>
    <Dialog
        :title="title"
        :height="600"
        :show.sync="dialogVisible"
        width="45%"
        @openDialog="openDialog"
    >
        <template v-slot:default>
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="120px"
            >
                <el-form-item label="汇款凭证：">
                    <el-button type="text" @click="seeErweima(form.material)">{{
                        form.material
                    }}</el-button>
                </el-form-item>
                <el-form-item label="审批结果：" prop="audit">
                    <el-radio-group v-model="form.audit">
                        <el-radio label="2">通过</el-radio>
                        <el-radio label="3">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-if="form.audit == 2">
                    <el-form-item label="申请还款类型：" prop="type">
                        <el-select
                            v-model="form.type"
                            filterable
                            placeholder="请选择"
                        >
                            <el-option label="结清" value="1"></el-option>
                            <el-option label="部分还款" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="剩余待还总额：">
                        <el-input
                            v-model="form.remainingBalance"
                            disabled
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="收款人账号：" prop="accountNoShou">
                        <el-input v-model="form.accountNoShou"></el-input>
                    </el-form-item>
                    <el-form-item label="收款人名称：" prop="accountName">
                        <el-input v-model="form.accountName"></el-input>
                    </el-form-item>
                    <el-form-item label="开户行名称：" prop="openbankName">
                        <el-input v-model="form.openbankName"></el-input>
                    </el-form-item>
                    <el-form-item label="付款人账号：" prop="accountNo">
                        <el-input
                            v-model="form.accountNo"
                            placeholder="请输入付款人账号"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="付款人名称：">
                        <el-input v-model="form.remitAccountName"></el-input>
                    </el-form-item>
                    <el-form-item label="汇款金额：" prop="repayAmount">
                        <el-input
                            v-model="form.repayAmount"
                            placeholder="请输入汇款金额"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="汇款类型：" prop="repayType">
                        <el-select
                            v-model="form.repayType"
                            filterable
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in remittanceTypes"
                                :key="item.dictValue"
                                :label="item.dictLabel"
                                :value="item.dictValue"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="回款渠道：" prop="payChannal">
                        <el-select
                            v-model="form.payChannal"
                            placeholder="请选择"
                            filterable
                        >
                            <el-option
                                v-for="item in payChannalOptions"
                                :key="item.dictValue"
                                :label="item.dictLabel"
                                :value="item.dictValue"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="汇款时间：" prop="remittanceTime">
                        <el-date-picker
                            v-model="form.remittanceTime"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                    </el-form-item>
                </div>
            </el-form>
            <erweima
                :title="erweimaData.title"
                :url="erweimaData.url"
                :show.sync="erweimaData.dialogVisible"
            >
            </erweima>
        </template>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button
                type="primary"
                v-debounce
                @click="submit"
                :loading="buttonLoading"
                >确 定</el-button
            >
        </div>
    </Dialog>
</template>

<script>
import Dialog from "@/components/Dialog/index";
import { initObj } from "@/utils/common";
import officialApi from "@/api/case/officialAccount/index";
import erweima from "../components/erweima";
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
                audit: "2",
                id: "",
                type: "",
                remainingBalance: "",
                accountNoShou: "",
                accountName: "",
                openbankName: "",
                accountNo: "",
                repayAmount: "",
                repayType: "",
                payChannal: "",
                remitAccountName: "",
                remittanceTime: ""
            },
            rules: {
                accountNoShou: [
                    {
                        required: true,
                        message: "请输入收款人账号",
                        trigger: "blur"
                    }
                ],
                accountName: [
                    {
                        required: true,
                        message: "请输入收款人名称",
                        trigger: "blur"
                    }
                ],
                openbankName: [
                    {
                        required: true,
                        message: "请输入开户行名称",
                        trigger: "blur"
                    }
                ],
                accountNo: [
                    {
                        required: true,
                        message: "请输入付款人账号",
                        trigger: "blur"
                    }
                ],
                repayAmount: [
                    {
                        required: true,
                        message: "请输入汇款金额",
                        trigger: "blur"
                    }
                ],
                type: [
                    {
                        required: true,
                        message: "请选择还款类型",
                        trigger: "change"
                    }
                ],
                audit: [
                    {
                        required: true,
                        message: "请选择审批结果",
                        trigger: "change"
                    }
                ],
                repayType: [
                    {
                        required: true,
                        message: "请选择汇款类型",
                        trigger: "change"
                    }
                ],
                payChannal: [
                    {
                        required: true,
                        message: "请选择回款渠道",
                        trigger: "change"
                    }
                ],
                remittanceTime: [
                    {
                        required: true,
                        message: "请选择汇款时间",
                        trigger: "change"
                    }
                ]
            },
            paymentStatus: [], //还款状态
            remittanceTypes: [], //汇款类型
            erweimaData: {
                dialogVisible: false,
                title: "",
                url: ""
            },
            payChannalOptions: [],
            buttonLoading: false
        };
    },
    props: {
        // 传参控制弹窗显示隐藏
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        },
        id: {
            type: Number,
            default: -999
        },
        item: {
            type: String,
            default: ""
        }
    },
    computed: {
        dialogVisible: {
            get() {
                return this.show;
            },
            set(val) {
                this.$emit("update:show", val);
            }
        }
    },
    created() {
        //还款状态
        this.getDicts("repay_status").then(response => {
            this.paymentStatus = response.data;
        });
        //回款状态
        this.getDicts("payChannal_options").then(response => {
            this.payChannalOptions = response.data;
        });
        //汇款类型
        this.getDicts("remittance_status").then(response => {
            this.remittanceTypes = response.data;
        });
    },
    methods: {
        openDialog() {
            initObj(this.form);
            this.buttonLoading = false;
            this.resetAddForm();
            this.getRepayDetail();
        },
        //重置表单清除验证
        resetAddForm() {
            try {
                this.$refs["form"].resetFields();
            } catch (e) {}
        },
        //获取详情
        getRepayDetail() {
            officialApi.repayDetail(this.id).then(response => {
                this.form.material = response.data.material;
                this.form.caseId = response.data.caseId;
                this.form.remainingBalance = response.data.remainingBalance;
                this.form.id = this.id;
                this.form.audit = "2";
            });
        },
        submit() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.buttonLoading = true;
                    let params;
                    if (this.form.audit == 3) {
                        params = {
                            audit: 3,
                            id: this.form.id,
                            caseId: this.form.caseId
                        };
                    } else {
                        params = {
                            ...this.form
                        };
                    }
                    officialApi
                        .repayAudit(params)
                        .then(res => {
                            if (res.code === 200) {
                                this.msgSuccess("操作成功");
                                this.$emit("refresh");
                                this.dialogVisible = false;
                                this.buttonLoading = false;
                            }
                        })
                        .catch(() => {
                            this.buttonLoading = false;
                        });
                }
            });
        },
        //查看凭证
        seeErweima(item) {
            this.erweimaData.title = "查看凭证";
            this.erweimaData.url = item;
            // 控制弹窗组件显示
            this.erweimaData.dialogVisible = true;
        }
    }
};
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
