<template>
    <Dialog :title="title" :height="550" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form style="width:80%;margin:0 auto;text-align:left;" ref="form" :model="form"
                label-width="120px">
                <el-form-item label="首次还款日期：" prop="relatedContact">
                    <el-input v-model="form.relatedContact"></el-input>
                </el-form-item>
                <el-form-item label="起始已还本金：" prop="relatedContact">
                    <el-input v-model="form.relatedContact"></el-input>
                </el-form-item>
                <el-form-item label="已还期数：" prop="relatedContact">
                    <el-input v-model="form.relatedContact"></el-input>
                </el-form-item>
                <el-form-item label="借款用途：" prop="relatedContact">
                    <el-input v-model="form.relatedContact"></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="relatedRelation">
                    <el-select style="width: 100%" @change="handleChange" v-model="form.relatedRelation"
                        placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
                </el-form-item>
                <el-form-item label="户籍地址：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
                </el-form-item>
                <el-form-item label="工作单位名称：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
                </el-form-item>
                <el-form-item label="单位电话：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
                </el-form-item>
                <el-form-item label="QQ：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
                </el-form-item>
                <el-form-item label="微信：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
                </el-form-item>
                <el-form-item label="学历：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
                </el-form-item>
                <el-form-item label="职业：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
                </el-form-item>
                <el-form-item label="婚姻状况：" prop="relatedRelation">
                    <el-select style="width: 100%" @change="handleChange" v-model="form.relatedRelation"
                        placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注2：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
                </el-form-item>
                <el-form-item label="备注3：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
                </el-form-item>
                <el-form-item label="备注4：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
                </el-form-item>
                <el-form-item label="备注5：" prop="relatedName">
                    <el-input v-model="form.relatedName"></el-input>
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
    import Dialog from '@/components/Dialog/index'
    import {
        getToken
    } from "@/utils/auth";
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
    import {
        initObj
    } from '@/utils/common'
    export default {
        //已强制执行
        name: "addPhone",
        components: {
            Dialog
        },
        data() {
            return {
                form: {
                    relatedContact: '',
                    relatedRelation: '',
                    relatedName: '',
                    caseId: ''
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
                type: String,
                default: ''
            },
            name: {
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

        },
        methods: {
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            openDialog() {
                initObj(this.form)
                this.resetAddForm();
                this.form.caseId = this.id
            },
            submit() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        cuttingAfterApi.addPhone(this.form).then(res => {
                            if (res.code === 200) {
                                this.msgSuccess("新增成功");
                                this.dialogVisible = false;
                                this.$emit('refresh');
                            }
                        })
                    }
                });
            },
            handleChange(value) {
                if (value == '本人') {
                    this.form.relatedName = this.name
                } else {
                    this.form.relatedName = ''
                }
            }
        }
    }

</script>

<style scoped>
    .el-dialog__body {
        height: 20px;
    }
</style>
