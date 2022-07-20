<template>
    <Dialog :title="title" :height="250" :show.sync="dialogVisible" width="25%" @openDialog="openDialog">
        <template v-slot:default>
            <center>
                <audio :src="url" autoplay="autoplay" controls="controls" ref="audio">Your browser does not support the
                    audio element.</audio>
            </center>
        </template>
        <div slot="footer" class="dialog-footer">
            <el-button @click="audioClose">关闭</el-button>
        </div>
    </Dialog>
</template>

<script>
    import Dialog from '@/components/Dialog/index'
    export default {
        //已强制执行
        name: "audioPlay",
        components: {
            Dialog
        },
        data() {
            return {
                url: '',
                title: '播放录音'
            }
        },
        props: {
            // 传参控制弹窗显示隐藏
            show: {
                type: Boolean,
                default: false
            },
            src: {
                type: String,
                default: ''
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
        created() {

        },
        methods: {
            openDialog() {
                //打开获取新的录音数据；
                this.url = this.src;
            },
            //播放组件
            handlePlay() {
                this.play();
            },
            //播放
            play() {
                this.dialogVisible = true;
                this.$refs.audio.play();
            },
            //音频暂停
            stop() {
                this.$refs.audio.pause();
                this.$refs.audio.currentTime = 0;
            },
            //
            audioClose() {
                this.url = "";
                this.$refs.audio.pause();
                this.$refs.audio.currentTime = 0;
                this.dialogVisible = false;
            }
        }
    }

</script>

<style scoped>
    .el-dialog__body {
        height: 20px;
    }

</style>
