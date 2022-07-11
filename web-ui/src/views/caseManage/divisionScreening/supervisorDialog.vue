<template>
    <Dialog :title="title" :height="500" :show.sync="dialogVisible" width="40%" @openDialog="openDialog">
        <template v-slot:default>
            <!-- 分配权限内容 -->
            <div v-if="title == '全选监督员分发'" style="padding:10px 0;color:red;font-size:16px;line-height:24px">
                注意：本次共操作{{total}}条数据，请确认搜索条件无误后操作!</div>
            <div class="division-content">
                <p>可多选，多选时默认平均分配给所选择人，所有选择人均可监督本批案件信息</p>
                <el-scrollbar style="height: 350px">
                    <div class="tree-box">
                        <div class="left">
                            <el-input placeholder="输请选择分发人，可直接输入查找" v-model="filterText">
                            </el-input>
                            <el-tree :data="deptOptions" :props="defaultProps" node-key="userId" show-checkbox
                                :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree"
                                default-expand-all />
                        </div>
                    </div>
                </el-scrollbar>

            </div>
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

    export default {
        name: "divisionDialog",
        components: {
            Dialog
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
            total: {
                type: String | Number,
                default: '--'
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        data() {
            return {
                filterText: '',
                defaultProps: {
                    children: "children",
                    label: "userName",
                },
                // 部门树选项
                deptOptions: [],
                rootId: 100,
                userList: [],
                realcheckNodes: [],
                deptList: [],
                loading: false
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
            //   this.getList();
            this.getDeptList();
        },
        mounted() {

        },
        methods: {
            openDialog() {
                //数据初始化，首次进入
                this.filterText = "";
                //整合部门数据和用户数据成一棵树
                let arr = this.deptList.concat(this.userList)
                this.deptOptions = this.handleTree(arr, "deptId", 'parentId', 'children', this.rootId);
            },
            // 提交上传文件
            submit() {
                let checkNodes = this.$refs.tree.getCheckedNodes() || []
                if (checkNodes.length == 0) {
                    this.msgError('请选择用户');
                    return
                }
                this.realcheckNodes = checkNodes.filter(res => {
                    return res.userId
                })
                let userIds = [];
                let deptIds = [];
                let noData = [];
                this.realcheckNodes.forEach(item => {
                    if (item.parentId != this.realcheckNodes[0].parentId) {
                        noData.push(item.parentId)
                    }
                    userIds.push(item.userId);
                    deptIds.push(item.parentId)
                })
                let param = {
                    caseIds: [this.ids], 
                    supervisorIds: userIds,
                }
                if (this.title == '全选监督员分发') {
                    this.loading = true;
                    param.caseIds = [];
                    divisionApi.supervisorAssignmentAll(param).then(res => {
                        if (res.code == 200) {
                            this.loading = false;
                            this.dialogVisible = false;
                            this.msgSuccess('操作成功')
                            this.$emit('refresh')
                        }
                    }).catch(error => {
                        this.loading = false;
                    })
                } else {
                    this.loading = true;
                    divisionApi.supervisorAssignment(param).then(res => {
                        if (res.code == 200) {
                            this.loading = false;
                            this.dialogVisible = false;
                            this.msgSuccess('操作成功')
                            this.$emit('refresh')
                        }
                    }).catch(error => {
                        this.loading = false;
                    })
                }
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.userName.indexOf(value) !== -1;
            },
            checkChange(node) {
                console.log(node)
            },
            handleNodeClick(data) {
                //this.getList();
            },
            /** 查询部门列表 */
            getDeptList() {
                //获取rootid
                divisionApi.supervisorList().then(response => {
                    this.rootId = response.data.pid;
                    this.deptList = response.data.deptList || [];
                    for (var j = 0; j < this.deptList.length; j++) {
                        this.deptList[j].userName = this.deptList[j].deptName
                    }
                    this.userList = response.data.userList || []
                    for (var i = 0; i < this.userList.length; i++) {
                        this.userList[i].parentId = this.userList[i].deptId
                        delete this.userList[i].deptId
                    }
                });
            },
        }
    }

</script>

<style scoped lang="scss">
    .el-dialog__body {
        height: 20px;
    }

    .division-content {
        .radio-box {
            margin: 10px 0 14px;
        }

        >p {
            font-size: 12px;
            color: #1c84c6;
            margin-bottom: 22px;
        }

        .choise-box {
            display: flex;

            .el-radio,
            .el-checkbox {
                justify-content: space-between;
                margin: 0 10px 10px 0;
            }

        }

        .tree-box {
            border: 1px solid #e6ebf5;
            padding: 10px;
        }

        /*自定义横向滚动条*/
        ::-webkit-scrollbar {
            background-color: transparent;
        }
    }

</style>
<style lang="scss">
    .custom-width {
        .el-form-item__label {
            width: 170px !important;
            text-align: left;
        }

        .el-form-item__content {
            display: flex;
            align-items: center;
        }
    }

</style>
