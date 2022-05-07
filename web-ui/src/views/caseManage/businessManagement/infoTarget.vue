<template>
    <Dialog :title="title" :height="400" :show.sync="dialogVisible" width="60%" @openDialog="openDialog">
        <template v-slot:default>
            <div class="box-contnet-wrap">
                <el-table v-loading="loading" :data="caseList">
                    <el-table-column label="统计月份" prop="targetMonth" />
                    <el-table-column label="姓名" prop="userName" />
                    <el-table-column label="月目标回款金额（元）" prop="userTarget" />
                </el-table>
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <!-- <el-button type="primary" @click="submit">确 定</el-button> -->
        </div>
    </Dialog>
</template>

<script>
    import Dialog from "@/components/Dialog/index";
    import businessApi from "@/api/case/business/index";

    export default {
        name: "infoTarget",
        components: {
            Dialog
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
            teamId: {
                type: Number,
                default: 0,
            },
            date: {
                type: String,
                default: "",
            },
        },
        data() {
            return {
                // 遮罩层
                loading: false,
                caseList: [],
                // 查询参数
            };
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
        mounted() {},
        methods: {
            openDialog() {
                this.getList()
            },
            //查询成员回款详情列表
            getList() {
                console.log();
                let queryParams = {
                    date: this.date,
                    teamId: this.teamId
                }
                this.loading = true;
                businessApi.productDetail(queryParams).then((response) => {
                    this.caseList = response.data.userList;
                    this.loading = false;
                }
                ).catch(() => {
					this.caseList = [];
					this.loading = false;
				});
            },
        },
    };

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
