<template>
    <Dialog :title="title" :height="450" :show.sync="dialogVisible" width="60%" @openDialog="openDialog">
        <template v-slot:default>
            <!-- 分配权限内容 -->
            <el-table
                    :data="recordList"
                    style="width: 100%;margin-top: 20px">
                <el-table-column
                        prop="fileName"
                        label="文件名称"
                        :show-overflow-tooltip="true" width="400">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type == 1?scope.row.fileName : scope.row.pdfName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="fileSort"
                        label="排序"
                        :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                v-if="scope.row.type == 1"
                                @click="down(scope.row)"
                                type="primary">下载
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <!--<el-button type="primary" @click="submit">确 定</el-button>-->
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    import templateApi from "@/api/case/document/templateIndex";
    export default {
        name: "chooseFileDown",
        components: { Dialog },
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
            id:{
                type: String | Number,
                default: ''
            }
        },
        watch: {

        },
        data(){
            return{
                recordList: []
            }
        },
        computed: {
            dialogVisible: {
                get () {
                    return this.show
                },
                set (val) {
                    this.$emit('update:show', val)
                }
            }
        },
        created(){

        },
        methods: {
            openDialog(){
                let param = {
                    id:this.id
                };
                templateApi.fileList(param).then(res => {
                    console.log(res)
                    this.recordList = res.data || []
                })
            },
            // 提交上传文件
            submit() {

            },
            down(item){
                window.location.href = process.env.VUE_APP_BASE_API + "/common/download/resource?resource=" + item.fileUrl;
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-dialog__body{
        height: 20px;
    }

</style>
