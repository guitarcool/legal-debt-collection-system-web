<template>
    <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="40%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                <el-form-item label="已选案件数：">
                    <span style="color:red">{{total}}件</span>
                </el-form-item>
                <el-form-item label="分案至：">
                    <el-radio-group v-model="form.assignObject">
                        <el-radio label="0">调解员</el-radio>
                        <el-radio label="1">部门</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="部门：" prop="deptId">
                    <!-- select结合tree完成树形级联 -->
                    <treeselect style="width:194px;" v-model="form.deptId" :options="deptOptions" :show-count="true"
                        placeholder="请选择部门" size="small" @input="treeChangeSelect" />
                </el-form-item>
                <el-form-item label="调解员：" prop="mediateIds" v-if="form.assignObject == 0">
                    <el-select @change="selectMediateIds" :disabled="disabled" clearable multiple collapse-tags
                        filterable size="small" v-model="form.mediateIds" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="待分配案件状态变更：" label-width="160px" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio label="1">电话调解中</el-radio>
                        <el-radio label="7">待立案</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="共债分配：" v-if="form.assignObject == 0">
                    <el-radio-group v-model="form.jointDebtAssign">
                        <el-radio label="0">同身份证号分配同调解员</el-radio>
                        <el-radio label="1">同身份证号不需分配同调解员</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="分案类型：" v-if="form.assignObject == 0">
                    <el-radio-group v-model="form.assignType">
                        <el-radio label="0">按数量</el-radio>
                        <el-radio label="1">按标的金额</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="分案比例：" v-if="form.assignObject == 0">
                    <el-radio-group @change="pushMediateIds" v-model="form.assignScale">
                        <el-radio label="0">平均分案</el-radio>
                        <el-radio label="1">自定义</el-radio>
                    </el-radio-group>
                    <el-table size="small" :data="form.caseAssignScales" show-summary
                        v-if="form.assignObject == 0&&form.assignScale == 1">
                        <el-table-column prop="mediateId" label="调解员">
                            <template slot-scope="scope">
                                <el-select disabled v-model="scope.row.mediateId" placeholder="请选择">
                                    <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                                        :value="item.userId">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="scale" label="分发比例（总和为100%）">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.scale"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="分配结果：">
                    <el-button style="margin-bottom:20px;" size="mini" @click="watchTable" type="danger">预览</el-button>
                    <el-table :buttonLoading="tableLoading" max-height="550" :data="tableData" border v-if="tableShow">
                        <el-table-column prop="assignObjectName" label="调解员"></el-table-column>
                        <el-table-column prop="idCardNum" label="身份证量"></el-table-column>
                        <el-table-column prop="caseNum" label="分配案件数"></el-table-column>
                        <el-table-column prop="subjectAmount" label="标的金额"></el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" v-debounce @click="submit" :loading="buttonLoading">{{buttonLoading?'分发中':'确认分发'}}</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import divisionApi from "@/api/case/division/index";
    import {
        treeselect
    } from "@/api/system/dept";
    import Treeselect from "@riophae/vue-treeselect";
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    import {
        initObj
    } from '@/utils/common'
    export default {
        name: "divisionDialog",
        components: {
            Dialog,
            Treeselect
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
            caseIds: {
                type: Array,
                default: []
            },
            total: {
                type: String | Number,
                default: '--'
            },
        },
        data() {
            return {
                defaultProps: {
                    children: "children",
                    label: "userName",
                },
                // 部门树选项
                deptOptions: undefined,
                userList: [],
                deptList: [],
                // 表单校验
                rules: {
                    deptId: [{
                        required: true,
                        message: "部门不能为空",
                        trigger: "change"
                    }],
                    mediateIds: [{
                        required: true,
                        message: "调解员不能为空",
                        trigger: "change"
                    }]
                },
                buttonLoading: false,
                form: {
                    jointDebtAssign: "",
                    assignObject: "",
                    assignScale: "",
                    assignType: "",
                    status: "",
                    caseAssignScales: [],
                    mediateIds: []
                },
                disabled: true,
                tableData: [],
                tableShow: false,
                tableLoading: false
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
        mounted() {
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
                this.getDeptList();
                initObj(this.form);
                this.resetAddForm();
                this.form.assignObject = "0";
                this.form.jointDebtAssign = "0";
                this.form.assignScale = "0";
                this.form.assignType = "0";
                this.form.status = "1";
                this.tableShow = false;
            },
            // 提交上传文件
            submit() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        let data;
                        data = {
                            ...this.form
                        };
                        this.buttonLoading = true;
                        if (this.title == "批量案件分发") {
                            data.caseIds = this.caseIds;
                            divisionApi.division(data).then(res => {
                                if (res.code == 200) {
                                    this.buttonLoading = false;
                                    this.dialogVisible = false;
                                    this.msgSuccess('操作成功');
                                    this.$emit('refresh');
                                }
                            }).catch(() => {
                                this.buttonLoading = false;
                            });
                        } else if (this.title == '全选案件分发') {
                            divisionApi.divisionAll(data).then(res => {
                                if (res.code == 200) {
                                    this.buttonLoading = false;
                                    this.dialogVisible = false;
                                    this.msgSuccess('操作成功');
                                    this.$emit('refresh');
                                }
                            }).catch(() => {
                                this.buttonLoading = false;
                            });
                        }
                    }
                });
            },
            /** 查询部门列表 */
            getDeptList() {
                /** 查询部门下拉树结构 */
                treeselect().then((response) => {
                    this.deptOptions = response.data;
                });
            },
            treeChangeSelect(id) {
                if (id) {
                    this.form.mediateIds = [];
                    this.form.caseAssignScales = [];
                    this.disabled = false;
                    divisionApi.getMediatorList(id).then(response => {
                        this.userList = response.data;
                    }).catch(() => {
                        this.caseList = [];
                    });
                } else {
                    this.disabled = true;
                    this.form.mediateIds = [];
                    this.form.caseAssignScales = [];
                }
            },
            pushMediateIds(value) {
                this.form.caseAssignScales = [];
                if (value == 1 && this.form.mediateIds.length > 0) {
                    this.form.mediateIds.forEach(element => {
                        this.form.caseAssignScales.push({
                            mediateId: element,
                            scale: ""
                        })
                    });
                }
            },
            //切换调解员修改自定义列表
            selectMediateIds(arr) {
                this.pushMediateIds(1);
            },
            //预览
            watchTable() {
                this.tableShow = true;
                this.tableLoading = true;
                let data;
                data = {
                    ...this.form
                };
                if (this.title == "批量案件分发") {
                    data.caseIds = this.caseIds;
                    divisionApi.getAssignCaseInfo(data).then(res => {
                        this.tableData = res.data;
                        this.tableLoading = false;
                    }).catch(() => {
                        this.tableData = [];
                        this.tableLoading = false;
                    });
                } else if (this.title == "全选案件分发") {
                    divisionApi.getAssignCaseInfoAll(data).then(res => {
                        this.tableData = res.data;
                        this.tableLoading = false;
                    }).catch(() => {
                        this.tableData = [];
                        this.tableLoading = false;
                    });
                }
            },
        }
    }

</script>
<style lang="scss"></style>
