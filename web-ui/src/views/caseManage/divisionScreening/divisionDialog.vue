<template>
    <Dialog :title="title" :height="600" :show.sync="dialogVisible" width="40%" @openDialog="openDialog">
        <template v-slot:default>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="已选案件数：">
                    <span style="color:red">{{total}}件</span>
                </el-form-item>
                <el-form-item label="分案至：">
                    <el-radio-group v-model="form.resource">
                        <el-radio label="调解员" value="1"></el-radio>
                        <el-radio label="部门" value="2"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="部门：" prop="deptId">
                    <!-- select结合tree完成树形级联 -->
                    <treeselect style="width:194px;" v-model="form.deptId" :options="deptOptions" :show-count="true"
                        placeholder="请选择部门" size="small" @input="treeChangeSelect" />
                </el-form-item>
                <el-form-item label="调解员：" prop="principals">
                    <el-select :disabled="disabled" clearable multiple collapse-tags filterable size="small"
                        v-model="form.principals" placeholder="请选择">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分案类型：">
                    <el-radio-group v-model="form.resource">
                        <el-radio label="按数量" value="1"></el-radio>
                        <el-radio label="按标的金额" value="2"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="分案比例：">
                    <el-radio-group v-model="form.resource">
                        <el-radio label="平均分案" value="1"></el-radio>
                        <el-radio label="自定义" value="2"></el-radio>
                    </el-radio-group>
                    <el-table :data="userList" show-summary>
                        <el-table-column prop="userId" label="调解员">
                            <template slot-scope="scope">
                                <el-input disabled v-model="scope.row.userTarget"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userTarget" label="分发比例（总和为100%）">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.userTarget"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="共债分配：">
                    <el-radio-group v-model="form.resource">
                        <el-radio label="同身份证号分配同调解员" value="1"></el-radio>
                        <el-radio label="同身份证号不需分配同调解员" value="2"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="分配结果：">
                    <el-button style="margin-bottom:20px;" size="mini" @click="watchTable" type="danger">预览</el-button>
                    <el-table :data="data" border>
                        <el-table-column prop="prop" label="调解员"></el-table-column>
                        <el-table-column prop="prop" label="身份证量"></el-table-column>
                        <el-table-column prop="prop" label="分配案件数"></el-table-column>
                        <el-table-column prop="prop" label="标的金额"></el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="loading">{{loading?'分发中':'确认分发'}}</el-button>
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
            id: {
                type: String,
                default: ''
            },
            principal: {
                type: String | Number,
                default: ''
            },
            orgNo: {
                type: String | Number,
                default: ''
            },
            caseStatus: {
                type: Array | Number,
                default: -1
            },
            total: {
                type: String | Number,
                default: '--'
            }
        },
        data() {
            return {
                defaultProps: {
                    children: "children",
                    label: "userName",
                },
                // 部门树选项
                deptOptions: [],
                userList: [],
                deptList: [],
                // 表单校验
                rules: {
                    deptId: [{
                        required: true,
                        message: "部门不能为空",
                        trigger: "change"
                    }],
                    principals: [{
                        required: true,
                        message: "调解员不能为空",
                        trigger: "change"
                    }]
                },
                loading: false,
                form: {},
                disabled: true,
                data: []
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
            this.getDeptList();
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
                initObj(this.form);
            },
            // 提交上传文件
            submit() {
                this.loading = true;
                if (this.title == '全选案件分发') {
                    divisionApi.divisionAll(param).then(res => {
                        if (res.code == 200) {
                            this.loading = false;
                            this.dialogVisible = false;
                            this.msgSuccess('操作成功');
                            this.$emit('refresh');
                        }
                    }).catch(() => {
                        this.loading = false;
                    });
                } else {
                    divisionApi.division(param).then(res => {
                        if (res.code == 200) {
                            this.loading = false;
                            this.dialogVisible = false;
                            this.msgSuccess('操作成功');
                            this.$emit('refresh');
                        }
                    }).catch(() => {
                        this.loading = false;
                    });
                }
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
                    this.disabled = false;
                } else {
                    this.disabled = true;
                    this.form.principal = [];
                }
            },
            watchTable() {

            },
        }
    }

</script>
<style lang="scss"></style>
