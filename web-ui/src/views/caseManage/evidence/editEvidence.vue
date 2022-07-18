<template>
    <div>
        <Dialog :title="title" :height="500" :show.sync="dialogVisible" width="50%" @openDialog="openDialog">
            <template v-slot:default>
                <el-table v-loading="loading" :data="caseList">
                    <el-table-column label="文件名" prop="fileName" :show-overflow-tooltip="true" />
                    <el-table-column label="操作" fixed="right" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.fileType == 2" size="mini" type="text"
                                @click="seeErweima(scope.row)">预览</el-button>
                            <el-button v-if="scope.row.fileType == 3" size="mini" type="text"
                                @click="handleSee(scope.row)">预览</el-button>
                            <el-button size="mini" type="text" v-hasPermi="['evidence:package:maderialDownload']" @click="downFile(scope.row)">下载</el-button>
                            <el-button size="mini" type="text" v-hasPermi="['evidence:detail:deleteEvidenceMaterial']"
                                @click="deleteEvidenceMaterial(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList" /> -->
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" v-debounce="submit">确 定</el-button>
            </div>
        </Dialog>
        <erweima :title="erweimaData.title" :url="erweimaData.url" :show.sync="erweimaData.dialogVisible">
        </erweima>
    </div>
</template>

<script>
    import Dialog from '@/components/Dialog/index';
    import evidenceApi from "@/api/case/evidence/index";
    import erweima from "../components/erweima";

    export default {
        name: "evidence",
        components: {
            Dialog,
            erweima
        },
        data() {
            return {
                loading: false,
                // 显示搜索条件
                // showSearch: true,
                // 总条数
                // total: 0,
                // 角色表格数据
                caseList: [],
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 50,
                },
                erweimaData: {
                    dialogVisible: false,
                    title: "",
                    url: "",
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
                type: Number,
                default: 0
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
        created() {},
        methods: {
            openDialog() {
                this.caseList = [];
                this.loading = false;
                this.getList();
            },
            /** 查询角色列表 */
            getList() {
                this.loading = true;;
                this.queryParams.id = this.id;
                evidenceApi.getEvidenceMaterialDetail(this.queryParams).then(
                    response => {
                        this.caseList = response.data;
                        // this.total = response.total;
                        this.loading = false;
                    }
                );
            },
            //预览
            seeErweima(item) {
                this.erweimaData.title = "预览";
                this.erweimaData.url = item.fileUrl;
                // 控制弹窗组件显示
                this.erweimaData.dialogVisible = true;
            },
            //下载附件
            downFile(item) {
                window.location.href =
                    process.env.VUE_APP_BASE_API +
                    "/common/download/resource?resource=" +
                    item.fileUrl;
            },
            /** 删除按钮操作 */
            deleteEvidenceMaterial(row) {
                let data = {
                    id: this.id,
                    fileName: row.fileName,
                }
                this.$confirm('是否确认删除名称为"' + row.fileName + '"的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                  return  evidenceApi.deleteEvidenceMaterial(data)
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                }).catch(function () {});
            },
            handleSee(item) {
                window.open(process.env.VUE_APP_BASE_API + item.fileUrl);
            },
            submit() {
                this.dialogVisible = false;
                this.loading = false;
                this.$emit('refresh')
            },
        }
    }

</script>

<style lang="scss">
    .custom-radio {
        padding-top: 10px;
        display: flex !important;

        .el-form-item__label {
            width: 100px;
            text-align: left;
            line-height: 20px;
            align-items: flex-start;
        }

        .el-radio {
            /*width: 20%;*/
            margin-right: 10px;
            margin-bottom: 20px;
        }
    }

</style>
