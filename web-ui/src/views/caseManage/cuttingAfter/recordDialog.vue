<template>
    <Dialog :title="title" :height="450" :show.sync="dialogVisible" width="60%" @openDialog="openDialog">
        <template v-slot:default>
            <!-- 分配权限内容 -->
            <div class="record-content">
                <recordList :recordList="recordList"></recordList>
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
    import { getToken } from "@/utils/auth";
    import cuttingAfterApi from "@/api/case/cuttingAfter/index";
    import recordList from '../components/recordList'
    export default {
        name: "recordDialog",
        components: { Dialog,recordList },
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
                type: String,
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
                this.getRecord()
            },
            // 提交上传文件
            submit() {

            },
            getRecord(){
                cuttingAfterApi.record(this.id).then(res => {
                    //console.log(res)
                    this.recordList = res.data || []
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-dialog__body{
        height: 20px;
    }

</style>
