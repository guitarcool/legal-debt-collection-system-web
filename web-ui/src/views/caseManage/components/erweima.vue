<template>
    <Dialog :title="title" :height="450" :show.sync="dialogVisible" width="40%" @openDialog="openDialog">
        <template v-slot:default>
            <div class="image-style">
                <img :src="baseUrl+url" />
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
        components: { Dialog },
        data(){
            return{
                baseUrl : process.env.VUE_APP_BASE_API
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
            url:{
                type: String,
                default:''
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

            },
        }
    }
</script>

<style scoped>
    .el-dialog__body{
        height: 20px;
    }
    .image-style{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    img{
        height: 300px;
    }
</style>
