<template>
    <Dialog :title="title" :height="500" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="注意：">
                    <span style="color:#9B9B9B">1.预测试外呼工作时间为09:00-21:00; 若计划当天未执行完，次日将继续执行;</span>
                    <span style="color:#9B9B9B">2.若存在"空号"，系统会自动跳过该号码;</span>
                </el-form-item>
                <el-form-item label="计划名称：" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="优先级：" prop="priority">
                    <el-radio-group v-model="form.priority">
                        <el-radio label="HIGH">高</el-radio>
                        <el-radio label="NORMAL">普通</el-radio>
                        <el-radio label="LOW">低</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="启动方式：" prop="is_start_now">
                    <el-radio-group v-model="form.is_start_now">
                        <el-radio :label="false">手动启动</el-radio>
                        <el-radio :label="true">立即启动</el-radio>
                    </el-radio-group>
                    <span style="margin-left:20px;color:#9B9B9B">立即启动需先将外呼状态切换为"上钟"</span>
                </el-form-item>
                <el-form-item label="号码检测：" prop="is_early">
                    <el-radio-group v-model="form.is_early">
                        <el-radio :label="true">开</el-radio>
                        <el-radio :label="false">关</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="外呼比例：" prop="call_rate">
                    <el-radio-group v-model="form.call_rate">
                        <el-radio :label="3">3</el-radio>
                        <el-radio :label="2">2</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="呼出号码：" prop="caller">
                    <el-select size="small" v-model="form.caller" placeholder="请选择">
                        <el-option v-for="item in callphone" :key="item.id" :label="item.full_number"
                            :value="item.full_number">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="外呼对象：" prop="callObject">
                    <el-radio-group v-model="form.callObject">
                        <el-radio :label="0">全部</el-radio>
                        <el-radio :label="1">本人</el-radio>
                        <el-radio :label="2">非本人</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳过标签："></el-form-item>
                <el-form-item label-width="180px" label="跳过最近一次调解标签：">
                    <el-checkbox-group v-model="form.filterMedLabel">
                        <el-checkbox :label="6">停机</el-checkbox>
                        <el-checkbox :label="0">关机</el-checkbox>
                        <el-checkbox :label="8">空号</el-checkbox>
                        <el-checkbox :label="3">失联</el-checkbox>
                        <el-checkbox :label="14">更换机主</el-checkbox>
                        <el-checkbox :label="12">电话设置</el-checkbox>
                        <el-checkbox :label="13">无人接听</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label-width="180px" label="手机号在网状态：">
                    <el-checkbox-group v-model="form.filterNetworkStatus">
                        <el-checkbox :label="2">停用</el-checkbox>
                        <el-checkbox :label="4003">未获取</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label-width="180px" label="手机号实时在网状态：">
                    <el-checkbox-group v-model="form.filterRealtimeStatus">
                        <el-checkbox :label="3">空号</el-checkbox>
                        <el-checkbox :label="4">短时间（24h）关机</el-checkbox>
                        <el-checkbox :label="7">长时间（大于24h）关机</el-checkbox>
                        <el-checkbox :label="0">关机</el-checkbox>
                        <el-checkbox :label="5">欠费停机且无短信能力</el-checkbox>
                        <el-checkbox :label="6">欠费但能接受短信</el-checkbox>
                        <el-checkbox :label="8">关机-疑似呼转</el-checkbox>
                        <el-checkbox :label="9">关机-疑似小号</el-checkbox>
                        <el-checkbox :label="10">未激活</el-checkbox>
                        <el-checkbox :label="-3">携号转网</el-checkbox>
                    </el-checkbox-group>
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
    import cuttingBeforeApi from "@/api/case/cuttingAfter/index";
    import {
        initObj
    } from '@/utils/common'
    export default {
        name: "testCall",
        components: {
            Dialog
        },
        data() {
            return {
                callphone: [],
                form: {
                    path: '',
                    priority: '',
                    is_early: '',
                    call_rate: '',
                    is_start_now: '',
                    name: '',
                    caller: '',
                    callObject: '',
                    filterMedLabel: [],
                    filterNetworkStatus: [],
                    filterRealtimeStatus: []
                },
                rules: {
                    callObject: [{
                        required: true,
                        message: '请选择外呼对象',
                        trigger: 'change'
                    }],
                    priority: [{
                        required: true,
                        message: '请选择优先级',
                        trigger: 'change'
                    }],
                    caller: [{
                        required: true,
                        message: '请选择外呼号码',
                        trigger: 'change'
                    }],
                    is_early: [{
                        required: true,
                        message: '请选择号码检测',
                        trigger: 'change'
                    }],
                    call_rate: [{
                        required: true,
                        message: '请选择外呼比例',
                        trigger: 'change'
                    }],
                    is_start_now: [{
                        required: true,
                        message: '请选择计划开始方式',
                        trigger: 'change'
                    }],
                    name: [{
                        required: true,
                        message: '请输入计划名称',
                        trigger: 'blur'
                    }]
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
            ids: {
                type: String,
                default: ''
            },
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
            //获取线路
            getLineList() {
                cuttingBeforeApi.getLineList().then(res => {
                    this.callphone = res;
                })
            },
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
                this.getLineList();
                this.form = {
                    path: 'cutBeforeInfo',
                    priority: 'HIGH',
                    is_early: false,
                    call_rate: 3,
                    is_start_now: false,
                    filterMedLabel: [6, 0, 8, 3, 12, 14, 13],
                    filterNetworkStatus: [2, 4003],
                    filterRealtimeStatus: [3, 7, 0, 5, 6, 8, 9, 10, -3],
                    callObject: 0,
                }
                this.caseId = this.id;
            },
            submit() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        //获取数组
                        let filterMedLabel = this.form.filterMedLabel.toString();
                        let filterNetworkStatus = this.form.filterNetworkStatus.toString();
                        let filterRealtimeStatus = this.form.filterRealtimeStatus.toString();
                        cuttingBeforeApi.getListByIds(this.ids, this.form.callObject, filterMedLabel,
                            filterNetworkStatus, filterRealtimeStatus, this.form.path).then(res => {
                            if (res.code === 200) {
                                this.form.list = res.data;
                                let accountId = JSON.parse(sessionStorage.getItem("accountId"));
                                this.form.accountId = accountId;
                                cuttingBeforeApi.addduyansoft(this.form).then(res => {
                                    if (res.code === 200) {
                                        this.msgSuccess("创建计划成功");
                                        this.dialogVisible = false;
                                        this.$emit('refresh');
                                    } else {
                                        this.msgError(res.msg);
                                    }
                                })
                            }
                        })
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

    .el-form-item {
        margin-bottom: 0px;
    }

</style>
