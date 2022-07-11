<template>
    <Dialog :title="title" :height="400" :show.sync="dialogVisible" width="35%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="审批意见：" prop="options">
                    <el-input v-model="form.options" :rows="8" type="textarea" placeholder="请输入审批意见"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import {
        initObj
    } from "@/utils/common";
    import protectApi from "@/api/case/protect/index";

    export default {
        //多元调解成功
        name: "applyAudit",
        components: {
            Dialog
        },
        data() {
            return {
                form: {
                    ids: [],
                    options: "",
                },
                rules: {
                    options: [{
                        required: true,
                        message: "请输入审批意见",
                        trigger: "blur"
                    }, ],
                },
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
            ids: {
                type: Array,
                default: [],
            },
            cid: {
                type: String,
                default: '',
            },
            item: {
                type: String,
                default: "",
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
        methods: {
            openDialog() {
                initObj(this.form);
                this.resetAddForm();
                this.form.ids = this.ids;
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
                        let data = {
                            options: this.form.options,
                            ids: this.form.ids,
                        };
                        protectApi.batchReviewRefuse(data).then((res) => {
                            if (res.code === 200) {
                                this.msgSuccess("操作成功");
                                this.$emit("refresh");
                                this.dialogVisible = false;
                            }
                        });
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

</style>
