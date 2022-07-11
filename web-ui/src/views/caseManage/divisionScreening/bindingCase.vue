<template>
    <Dialog :title="title" :height="350" :show.sync="dialogVisible" width="40%" @openDialog="openDialog">
        <template v-slot:default>
            <div v-if="title == '全选公众号绑定'" style="padding:10px 0;color:red;font-size:16px;line-height:24px" >注意：本次共操作{{total}}条数据，请确认搜索条件无误后操作!</div>
            <el-form ref="form" :model="form" :rules="rules" label-width="160px">
                <el-form-item label="请选择绑定公众号：" prop="wechatId">
                    <el-select style="width: 100%" filterable v-model="form.wechatId" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.id" :label="item.accountName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="loading">{{loading?'绑定中':'确定'}}</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index';
    import divisionApi from "@/api/case/division/index";
    import {
        initObj
    } from '@/utils/common'
    export default {
        //已强制执行
        name: "bindingCase",
        components: {
            Dialog
        },
        data() {
            return {
                form: {
                    wechatId: '',
                    caseIds: ''
                },
                rules: {
                    wechatId: [{
                        required: true,
                        message: '请选择绑定公众号',
                        trigger: 'change'
                    }],
                },
                options: [],
                loading: false
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
            ids: {
                type: Array,
                default: []
            },
            total:{
                type: String | Number,
                default: '--'           
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
        methods: {
            //重置表单清除验证
            resetAddForm() {
                try {
                    this.$refs['form'].resetFields()
                } catch (e) {

                }
            },
            getList() {
                divisionApi.wechatList().then((response) => {
                    this.options = response.data || [];
                });
            },
            openDialog() {
                initObj(this.form);
                this.resetAddForm();
                this.form.caseIds = this.ids;
                this.getList();
            },
            submit() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        if (this.title == '全选公众号绑定') {
                            divisionApi.bindWechatAll(this.form).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("绑定成功");
                                    this.dialogVisible = false;
                                    this.loading = false;
                                    this.$emit('refresh');
                                }
                            }).catch(error => {
                                this.loading = false;
                            })
                        } else {
                            divisionApi.bindWechat(this.form).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("绑定成功");
                                    this.dialogVisible = false;
                                    this.loading = false;
                                    this.$emit('refresh');
                                }
                            }).catch(error => {
                                this.loading = false;
                            })
                        }
                    }
                });
            },
        }
    }

</script>

<style scoped>
    .el-dialog__body {
        height: 20px;
    }

</style>
