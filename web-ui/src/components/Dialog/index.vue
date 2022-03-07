<template>
    <!--- 弹窗封装，用于解决弹窗组件外窗会被滚动的问题 --->
    <el-dialog :custom-class="dynamicAddClass" :title="title" :visible.sync="dialogVisible" :width="width"
               :append-to-body="appendToBody" @open="open" @close="close" :close-on-click-modal="false">
        <div class="content-wrapper" ref="contentWrapper" :style="{height: DialogHeigt+ 'px'}">
            <slot></slot>
        </div>
        <template v-slot:footer>
            <slot name="footer"></slot>
        </template>
    </el-dialog>
</template>

<script>
    export default {
        name: 'Dialog',
        props: {
            show: {
                type: Boolean,
                default: false
            },
            title: {
                type: String
            },
            height: {
                type: Number,
                default: 900
            },
            width: {
                type: String,
                default: '80%'
            },
            dynamicAddClass: {
                type: String,
                default: 'default-class'
            },
            appendToBody: {
                type: Boolean,
                default: true
            },
            scrollHeight:{
                type: Number,
                default: 0
            },
            /**
             * 用于绑定打开弹窗后触发的操作，使用方法@openDialog
             */
            openDialog: {
                type: String
            },
            /**
             * 用于绑定关闭弹窗后触发的操作，使用方法@closeDialog
             */
            closeDialog: {
                type: String
            }
        },
        watch:{
            scrollHeight(newValue,oldValue){
                this.$nextTick(() => {
                    console.log(newValue)
                    //console.log(this.$refs.main.scrollHeight)
                    this.$refs.contentWrapper.scrollTop = newValue;
                })
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
            },
            DialogHeigt: {
                get() {
                    return this.height - 81 - 65
                }
            }
        },
        methods: {
            /**
             * 触发父组件绑定的弹窗打开方法
             */
            open() {
                this.$emit('openDialog')
            },
            /**
             * 触发父组件绑定的弹窗的关闭方法
             */
            close() {
                this.$emit('closeDialog')
            }
        }
    }
</script>

<style lang="scss">
    .content-wrapper{
        padding: 10px;
        overflow-y: scroll;
    }
    .default-class {
        .el-dialog__header{
            border-bottom: 1px solid #f5f0f0;
        }
        .el-dialog__body{
            padding: 10px 20px 20px;
        }
    }
    /*滚动条样式*/
    /* 定义滚动条样式 */
    .content-wrapper::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    .content-wrapper::-webkit-scrollbar-thumb:vertical {
        height: 5px;
        background-color: #1890ff;
        -webkit-border-radius: 6px;
    }
</style>
