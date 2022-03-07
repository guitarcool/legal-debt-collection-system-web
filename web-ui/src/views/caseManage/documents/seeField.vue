<template>
    <Dialog :title="title" :height="680" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
        <template v-slot:default>
            <!-- 查看字段表 -->
            <div class="see-field">
                <el-input
                        clearable
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                </el-input>
                <el-tree
                        :data="deptOptions"
                        :props="defaultProps"
                        node-key="id"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        ref="tree"
                        default-expand-all
                />
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <!--<el-button type="primary" @click="submit">确 定</el-button>-->
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import {getToken} from "@/utils/auth";
    import templateApi from "@/api/case/document/templateIndex";

    export default {
        name: "seeField",
        components: {Dialog},
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
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        data() {
            return {
                defaultProps: {
                    children: "children",
                    label: "columnComment",
                },
                // 部门树选项
                deptOptions: [],
                filterText:''
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
            openDialog() {
                this.filterText = "";
                this.getTree()
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.columnComment.indexOf(value) !== -1;
            },
            getTree(){
                templateApi.seeFieldTable().then(res => {
                    console.log(res)
                    for (var i=0;i<res.data.length;i++){
                        if(res.data[i].columnName != '""'){
                            res.data[i].columnComment = res.data[i].columnComment + '----' + res.data[i].columnName
                        }
                    }
                    this.deptOptions = this.handleTree(res.data, "id", 'parentId', 'children', 0);
                })
            }
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

        > p {
            font-size: 12px;
            color: #1c84c6;
            margin-bottom: 22px;
        }

        .choise-box {
            display: flex;

            .el-radio, .el-checkbox {
                justify-content: space-between;
                margin: 0 10px 10px 0;
            }

        }
        .tree-box{
            border: 1px solid #e6ebf5;
            padding: 10px;
        }
        /*自定义横向滚动条*/
        ::-webkit-scrollbar{
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
