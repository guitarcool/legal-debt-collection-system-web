<template>
    <Dialog :title="title" @closeDialog="closeDialog" :height="500" :show.sync="dialogVisible" width="40%"
        @openDialog="openDialog">
        <template v-slot:default>
            <div class="image-style">
                <el-image :src="srcUrl" :preview-src-list="srcList">
                </el-image>
            </div>
        </template>
        <div slot="footer" class="dialog-footer">
            <!--<el-button @click="dialogVisible = false">关闭</el-button>-->
            <!--<el-button type="primary" @click="submit">确 定</el-button>-->
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    export default {
        //已判决
        name: "reimbursement",
        components: {
            Dialog
        },
        data() {
            return {
                srcUrl: '',
                srcList: []
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
            url: {
                type: String,
                default: ''
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
        methods: {
            openDialog() {
                this.srcUrl = process.env.VUE_APP_BASE_API + this.url;
                this.srcList.push(process.env.VUE_APP_BASE_API + this.url);
            },
            closeDialog() {
                this.srcUrl = '';
                this.srcList = [];
            }
        }
    }

</script>

<style scoped lang="scss">
    .el-dialog__body {
        height: 20px;
    }

    .image-style {
        margin: 0 auto;
        width: 60%;
        height: 60%;
    }

</style>
